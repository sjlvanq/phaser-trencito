import BarreraColumna from '../objetos/barreracolumna.js';
export default class Barrera extends Phaser.GameObjects.Group
{
	constructor(scene, x, y, numeroColumnas = 4, shadows = false) {
		super(scene);
		this.scene = scene;

		for(let i = 0; i<numeroColumnas; i++){
			const barrera = new BarreraColumna(this.scene, 0, 0, 'barrera', ()=>{
						// Callback de pointerdown
						this.restituible = false;
						this.children.iterate( barrera => {
								barrera.disableInteractive(); // Se ha seleccionado una
								barrera.stop(); // Detiene contorno parpadeante
						});
					}
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
		this.restituible = false; // Estado de restitución de neumáticos en columnas
	}
	
	crearAnimaciones() {
		// Número de cuadros alternables 3
		for (let i = 0; i < 3; i++) {
			this.scene.anims.create({
				key: `glow_${i}`,
				frames: this.scene.anims.generateFrameNumbers('barrera', { frames: [i, i + 3] }),
				frameRate: 5,
				repeat: -1
			});
		}
	}
	
	glowColumnas() {
		this.children.iterate((barrera) => {barrera.glow();});		
	}
	
	update(miraX) {
		this.children.iterate(barrera => {
			barrera.update(miraX, this.restituible);
		});
	}
}
