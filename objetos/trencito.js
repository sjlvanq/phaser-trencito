import Camioneta from '../objetos/trencitocamioneta.js';
import CAMIONETA from '../objetos/trencitocamionetaConfig.js';
export default class Trencito extends Phaser.GameObjects.Group
{
	static CANTIDAD_CAMIONETAS = 6;
	static FILAS = 2;
	static CELL_HEIGHT = 75;
	static CELL_WIDTH = 180;
	static OFFSET_X_FILA = 110;
	static OFFSET_VELOCIDAD_FILA = 20;
	static INTERVALO_ORDEN_DISPAROS = 2800;
	static VELOCIDAD_INICIAL = 80;
	static VELOCIDAD_INCREMENTO = 20;
	
	constructor(scene, x, y, shadows = false) {
		super(scene);
		this.scene = scene;
		this.y = y;
		this.direccion = 1; //1 o -1
		this.velocidad = Trencito.VELOCIDAD_INICIAL;
		this.ultimaCamionetaEnFila = [];
		//this.enRetirada = false;
		this.nivelEnTransicion = false;
		
		for (let i = 0; i < Trencito.CANTIDAD_CAMIONETAS; i++) {
			const camioneta = new Camioneta(this.scene, 0, 0, i*Trencito.INTERVALO_ORDEN_DISPAROS, this.direccion, Trencito.VELOCIDAD_INICIAL);
			if(shadows){ // Pasar de gameOptions
				camioneta.postFX.addShadow(0,1,0.03,2);
			}
			this.add(camioneta);
		}
		this.shuffle();
		// Retorno de getChildren(), evita invocarlo cada vez
		this.camionetas = this.getChildren();
		this.distribuirCamionetas(y, this.direccion);
		
		this.scene.events.on('camionetaHaSalido',(camioneta)=>{
			if(camioneta.enRetirada){
				if(camioneta === this.ultimaCamionetaEnTrencito){
					if (!this.nivelEnTransicion) {
						this.nivelEnTransicion = true;
						this.scene.events.emit('ultimaCamionetaHaSalido');
					}
				}
			} else {
				this.reubicarCamioneta(camioneta);
			}
		});
	}

	voltearCamionetas(direccion){
		this.direccion = direccion;
		this.getChildren().forEach((camioneta)=>{
			camioneta.voltear(direccion);
		});
	}
	
	distribuirCamionetas(y, direccion){	
		this.direccion = direccion;
		//this.enRetirada = false;
		this.voltearCamionetas(direccion);
		
		const gridX = direccion === -1 ?
			-(Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS * Trencito.CELL_WIDTH) :
			this.scene.cameras.main.width;
		
		Phaser.Actions.GridAlign(this.camionetas, {
			width: Math.floor(Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS),
			cellWidth: Trencito.CELL_WIDTH, 
			cellHeight: Trencito.CELL_HEIGHT,
			x: gridX,
			y: y
		});
		
		// Offset de camioneta.x en fila y velocidad, asignación de camioneta.fila y ultimaCamionetaEnFila
		this.camionetas.forEach((camioneta, index) => {
			let fila = Math.ceil((index+1) / Math.floor(Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS));
			camioneta.x += (Trencito.OFFSET_X_FILA * fila) * direccion;
			camioneta.velocidad = this.velocidad + Trencito.OFFSET_VELOCIDAD_FILA * fila;
			camioneta.fila = fila;
			if(direccion>0){
				if ((index + 1) % Math.floor(Trencito.CANTIDAD_CAMIONETAS / Trencito.FILAS) === 0 || index === this.camionetas.length - 1) {
					this.ultimaCamionetaEnFila[fila-1] = camioneta;
				}
			} else {
				if (index % (Trencito.CANTIDAD_CAMIONETAS/Trencito.FILAS) === 0){
					this.ultimaCamionetaEnFila[fila-1] = camioneta;
				}
			}
		});
		this.ultimaCamionetaEnTrencito = this.camionetas[this.direccion>0?this.camionetas.length-1:0];
	}
	
	reubicarCamioneta(camioneta) {
		let ultimaPosicionX = this.ultimaCamionetaEnFila[camioneta.fila-1].x;
		let nuevaPosicionX = ultimaPosicionX;
		
		// Si la nueva posición queda dentro de la pantalla
		// ...yendo a la izquierda
		if(this.direccion === 1 && 
			ultimaPosicionX + Trencito.CELL_WIDTH < this.scene.cameras.main.width) {
			
			nuevaPosicionX = this.scene.cameras.main.width;
		// ...yendo a la derecha
		} else if (this.direccion === -1 && 
			ultimaPosicionX - Trencito.CELL_WIDTH > 0) {
			
			nuevaPosicionX = 0;
		}
		nuevaPosicionX += Trencito.CELL_WIDTH * this.direccion
		
		camioneta.setX(nuevaPosicionX);
		this.ultimaCamionetaEnFila[camioneta.fila-1] = camioneta;
		this.ultimaCamionetaEnTrencito = camioneta;
	}
		
	retirarCamionetas() {
		//this.enRetirada = true;
		this.camionetas.forEach((camioneta) => {camioneta.retirar(); /*Setter de Camioneta.enRetirada*/});
	}
	
	ingresarCamionetas() {
		this.nivelEnTransicion = false;
		this.distribuirCamionetas(this.y, this.direccion * -1); // Alterna this.direccion
		this.camionetas.forEach((camioneta) => {camioneta.ingresar(); /*Setter de Camioneta.enRetirada*/});
		this.incrementarVelocidad();
	}
	
	incrementarVelocidad() {
		this.velocidad += Trencito.VELOCIDAD_INCREMENTO;
		console.log("incrementar velocidad");
	}
	
	update(time, delta, playerX){
		this.camionetas.forEach((camioneta)=>{
			camioneta.update(time, delta, playerX, this.direccion);
		});
	}
}
