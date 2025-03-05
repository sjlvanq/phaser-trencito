import Camioneta from '../objetos/trencitocamioneta.js';
export default class Trencito extends Phaser.GameObjects.Group
{
	static CANTIDAD_CAMIONETAS = 6;
	static FILAS = 2;
	static FILA_ESPACIADO_EXTRA = 20;
	static CELL_WIDTH = 180;
	static OFFSET_X_FILA = 110;
	static OFFSET_VELOCIDAD_FILA = 20;
	static INTERVALO_ORDEN_DISPAROS = 2800;
	
	constructor(scene, x, y, shadows = false) {
		super(scene);
		this.scene = scene;
		
		const camioneta = new Camioneta(this.scene, 0, 0, 0, 0);
		const anchoCamioneta = camioneta.getBounds().width;
		const altoCamioneta = camioneta.getBounds().height;
		this.add(camioneta);
		
		// Restantes camionetas
		for (let i = 1; i < Trencito.CANTIDAD_CAMIONETAS; i++) {
			const camioneta = new Camioneta(this.scene, 0, 0, i*Trencito.INTERVALO_ORDEN_DISPAROS, Trencito.CELL_WIDTH);
			if(shadows){ // Pasar de gameOptions
				camioneta.postFX.addShadow(0,1,0.03,2);
			}
			this.add(camioneta);
		}
		
		this.shuffle();
		
		Phaser.Actions.GridAlign(this.getChildren(), {
			width: Math.ceil(Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS),
			cellWidth: Trencito.CELL_WIDTH, 
			cellHeight: altoCamioneta + Trencito.FILA_ESPACIADO_EXTRA,
			x: this.scene.cameras.main.width + Trencito.CELL_WIDTH,
			y: y
		});
		
		// Válido para filas >= 1
		this.getChildren().forEach((camioneta, index) => {
			let fila = Math.floor(index / (Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS));
			camioneta.x += Trencito.OFFSET_X_FILA * fila;
			camioneta.velocidad += Trencito.OFFSET_VELOCIDAD_FILA * fila;
		});
	}
	
	update(time, delta, playerX){
		this.getChildren().forEach((camioneta)=>{
			camioneta.update(time, delta, playerX, Trencito.CELL_WIDTH);
			if(camioneta.isDisparando){
				camioneta.isDisparando = false; //break
				this.scene.sound.play('disparo_snd');
				this.scene.events.emit('camionetaDispara', camioneta.x);
			}
		});
	}
}
