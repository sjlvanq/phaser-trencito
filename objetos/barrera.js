import BarreraColumna from '../objetos/barreracolumna.js';
import Sorpresa from '../objetos/sorpresa.js';

export default class Barrera extends Phaser.GameObjects.Group
{
	constructor(scene, x, y, numeroColumnas = 4, shadows = false) {
		super(scene);
		this.scene = scene;
		for(let i = 0; i<numeroColumnas; i++){
			const barrera = new BarreraColumna(this.scene, 0, 0, 'barrera', ()=>{
						// Callback de pointerdown
						this.children.iterate( barrera => {
								barrera.disableInteractive(); // Se ha seleccionado una
								barrera.stop(); // Detiene contorno parpadeante
						});
					}, i
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
		
		this.sorpresa = new Sorpresa(this.scene);

		this.crearAnimaciones();
		this.cargarSorpresa();
		this.scene.events.on('columnaGolpeada', this.buscarSorpresa, this);
	}
	
	cargarSorpresa(){
		this.columnaConSorpresa = Phaser.Math.Between(0, this.getLength() - 1);
		this.sorpresa.cargar();
		console.log(`Sorpresa cargada en columna ${this.columnaConSorpresa}`);
	}
	
	buscarSorpresa(indice){
		if(indice===this.columnaConSorpresa){
			let columna = this.getChildren()[this.columnaConSorpresa];
			this.sorpresa.mostrar(columna.x, columna.y+columna.displayHeight/2);
			this.columnaConSorpresa = -1;
		}
	}
	
	recolectarSorpresa(indice){
		this.sorpresa.recolectar();
	}
	
	crearAnimaciones() {
		// Número de cuadros alternables 3
		for (let i = 0; i < 3; i++) {
			if (!scene.anims.exists('glow_0')) {
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
		this.children.iterate((barrera) => {barrera.glow();});		
	}
	
	update(miraX, restituible) {
		this.children.iterate(barrera => {
			barrera.update(miraX, restituible);
		});
	}
}
