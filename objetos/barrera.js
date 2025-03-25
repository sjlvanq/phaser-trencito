import BarreraColumna from '../objetos/barreracolumna.js';
export default class Barrera extends Phaser.GameObjects.Group
{
	constructor(scene, x, y, numeroColumnas = 4, shadows = false) {
		super(scene);
		this.scene = scene;

		this.protegioAlJugador = false; // Alguna columna detuvo un disparo
		this.restituible = false; // Estado de restitución de neumáticos en columnas
		const keyCodes = ['ONE', 'TWO', 'THREE', 'FOUR'];
		for(let i = 0; i<numeroColumnas; i++){
			const teclaAsociada = this.scene.registry.get('gameOptions').soporteTeclado ? keyCodes[i] : false;
			const barrera = new BarreraColumna(this.scene, 0, 0, 'barrera', ()=>{
					// Callback de pointerdown
					this.restituible = false;
					this.children.iterate( columna => {columna.stop();}); // Quitar glow
				}, teclaAsociada
			);
			barrera.scale = 0.6
			
			if(shadows){
				barrera.postFX.addShadow(0,2,0.02,0.5);
			}
			
			// Se agrega a este grupo
			this.add(barrera);
		}

		Phaser.Actions.GridAlign(this.getChildren(), {
			width: numeroColumnas, cellWidth: this.scene.cameras.main.width / numeroColumnas,
			x: x, y: y
		});

		this.crearAnimaciones();
	}
	
	crearAnimaciones() {
		// Número de cuadros alternables 3
		for (let i = 0; i < 3; i++) {
			if(!this.scene.anims.get(`glow_${i}`)){
				this.scene.anims.create({
					key: `glow_${i}`,
					frames: this.scene.anims.generateFrameNumbers('barrera', { frames: [i, i + 3] }),
					frameRate: 5,
					repeat: -1
				});
			}
		}
	}
	
	glowColumnas() {
		this.children.iterate((columna) => {columna.glow();});
	}
	
	repararColumnas() {
		this.setVisible(true);
		this.scene.time.delayedCall(100, ()=>{
			this.children.iterate((columna) => {columna.reparar(true);});
		});
	}
	
	reducirColumnas() {
		this.children.iterate((columna) => {
			columna.reducir(true, () => {
				this.scene.time.delayedCall(100, ()=>{columna.setVisible(false)});
				if(this.children.entries.every((columna)=>columna.minima)){
					this.scene.events.emit('barreraReducida');
				}
			});
		})
	}

	setRestituible(value){this.restituible = value;}
	
	update(miraX) {
		this.protegioAlJugador = false;
		this.children.iterate(columna => {
			columna.update(miraX, this.restituible);
			if(columna.detuvoDisparo){
				this.protegioAlJugador = true;
			}
		});
	}
}
