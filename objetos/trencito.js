import Camioneta from '../objetos/trencitocamioneta.js';
export default class Trencito extends Phaser.GameObjects.Group
{
	static CANTIDAD_CAMIONETAS = 6;
	static FILAS = 2;
	static CELL_HEIGHT = 75;
	static CELL_WIDTH = 180;
	static OFFSET_X_FILA = 110;
	static OFFSET_VELOCIDAD_FILA = 20;
	static INTERVALO_ORDEN_DISPAROS = 2800;
	
	constructor(scene, x, y, shadows = false) {
		super(scene);
		this.scene = scene;
		
		this.direccion = 1; //1 o -1
		for (let i = 0; i < Trencito.CANTIDAD_CAMIONETAS; i++) {
			const camioneta = new Camioneta(this.scene, 0, 0, i*Trencito.INTERVALO_ORDEN_DISPAROS, this.direccion);
			if(shadows){ // Pasar de gameOptions
				camioneta.postFX.addShadow(0,1,0.03,2);
			}
			this.add(camioneta);
		}
		
		this.shuffle();
		this.distribuirCamionetas(y, this.direccion);
	}

	voltearCamionetas(direccion){
		this.getChildren().forEach((camioneta)=>{
			camioneta.voltear(direccion);
		});
	}
	
	distribuirCamionetas(y, direccion){	
		this.direccion = direccion;
		this.voltearCamionetas(direccion);
		
		const gridX = direccion === -1 ?
			-(Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS * Trencito.CELL_WIDTH) :
			this.scene.cameras.main.width;
		
		Phaser.Actions.GridAlign(this.getChildren(), {
			width: Math.floor(Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS),
			cellWidth: Trencito.CELL_WIDTH, 
			cellHeight: Trencito.CELL_HEIGHT,
			x: gridX,
			y: y
		});
		
		// Offset de camioneta.x en fila y velocidad
		this.getChildren().forEach((camioneta, index) => {
			let fila = Math.ceil((index+1) / Math.floor(Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS));
			camioneta.x += (Trencito.OFFSET_X_FILA * fila) * direccion;
			camioneta.velocidad += Trencito.OFFSET_VELOCIDAD_FILA * fila;
			console.log(camioneta.x);
		});
	}
	
	update(time, delta, playerX){
		this.getChildren().forEach((camioneta)=>{
			camioneta.update(time, delta, playerX, Trencito.CELL_WIDTH, this.direccion);
			if(camioneta.isDisparando){
				camioneta.isDisparando = false; //break
				this.scene.sound.play('disparo_snd');
				this.scene.events.emit('camionetaDispara', camioneta.x);
			}
		});
	}
}
