import CAMIONETA from './trencitocamionetaConfig.js';
import FullAnimatedSprite from '../clases/fullanimatedsprite.js';

export default class Camioneta extends Phaser.GameObjects.Container
{
	constructor (scene, x, y, ventanillaTweenDelay=0, direccion=1)
	{
		super(scene, x, y);
		scene.add.existing(this);
		
		this.isDisparando = false;
		this.buscandoObjetivo = false;
		this.enRetirada = false;
		this.fila = 0;
		
		this.velocidad = CAMIONETA.VELOCIDAD_INICIAL;
		this.ventanillaTweenDelay = ventanillaTweenDelay;
				
		this.chasis = scene.add.sprite(0, 0, 'camioneta').setDepth(1);
		this.animarChasis();
		
		this.vidrios = [
			scene.add.rectangle(CAMIONETA.VIDRIOS.OFFSETS_X[0], CAMIONETA.VIDRIOS.OFFSET_Y, CAMIONETA.VIDRIOS.ANCHO, CAMIONETA.VIDRIOS.ALTO, CAMIONETA.VIDRIOS.COLOR),
			scene.add.rectangle(CAMIONETA.VIDRIOS.OFFSETS_X[1], CAMIONETA.VIDRIOS.OFFSET_Y, CAMIONETA.VIDRIOS.ANCHO, CAMIONETA.VIDRIOS.ALTO, CAMIONETA.VIDRIOS.COLOR),
		];
		
		this.explosion = scene.add.sprite(CAMIONETA.EXPLOSION.OFFSETS_X[direccion<0?0:1], CAMIONETA.EXPLOSION.OFFSET_Y, 'explosion').setDepth(1);
		this.explosion.setScale(CAMIONETA.EXPLOSION.ESCALA);
		this.explosion.setVisible(false);
		
		this.cabeza = scene.add.sprite(CAMIONETA.CABEZA.OFFSETS_X[direccion<0?0:1], CAMIONETA.CABEZA.OFFSET_Y, 'cabeza');
		this.cabeza.setScale(CAMIONETA.CABEZA.ESCALA);
		this.cabeza.setDepth(1);
		this.cabeza.setVisible(false);
		
		this.ruedas = [
			new FullAnimatedSprite(scene, CAMIONETA.RUEDAS.OFFSETS_X[0], CAMIONETA.RUEDAS.OFFSET_Y, 'rueda', CAMIONETA.RUEDAS.FRAMERATE).setScale(CAMIONETA.RUEDAS.ESCALA),
			new FullAnimatedSprite(scene, CAMIONETA.RUEDAS.OFFSETS_X[1], CAMIONETA.RUEDAS.OFFSET_Y, 'rueda', CAMIONETA.RUEDAS.FRAMERATE).setScale(CAMIONETA.RUEDAS.ESCALA)
		];
		this.ruedas.forEach(rueda => rueda.play());

		this.add([...this.vidrios, this.chasis, ...this.ruedas, this.cabeza, this.explosion]);
		this.setScale(CAMIONETA.ESCALA);
		
		this.width = this.getBounds().width;
	}
		
	animarChasis()
	{
		this.scene.tweens.add({
			targets: this.chasis,
			rotation: CAMIONETA.TWEENS.CHASIS.PROP_ROTATION,
			duration: CAMIONETA.TWEENS.CHASIS.DURACION,
			yoyo: true,
			repeat: -1,
		});
	}
	
	animarVentanilla(direccion)
	{
		let faseYoyo = false;
		this.ventanillaTween = this.scene.tweens.add({
			targets: this.vidrios[direccion<0?0:1],
			delay: this.ventanillaTweenDelay,
			// Uso de 'start-to' para evitar desfasajes al matar el tween
			y: {start: CAMIONETA.VIDRIOS.OFFSET_Y, to: CAMIONETA.TWEENS.VENTANILLA.PROP_Y},
			duration: CAMIONETA.TWEENS.VENTANILLA.DURACION,
			ease: Phaser.Math.Easing.Expo.In,
			repeat: -1,
			yoyo: true,
			onYoyo: () => {
				faseYoyo=true;
				this.mostrarCabeza();},
			onRepeat: () => {
				faseYoyo=false;
				if(this.enRetirada){
					this.ventanillaTween.remove();
				}
			},
			onUpdate: () => {
				// Si cambia el estado enRetirada antes de mostrarCabeza, da marcha atrás y finaliza el ciclo
				if(this.enRetirada && this.ventanillaTween.isPlaying() && !faseYoyo){
					const tiempoTranscurrido = this.ventanillaTween.elapsed % CAMIONETA.TWEENS.VENTANILLA.DURACION;
					this.scene.tweens.add({
						targets: this.ventanillaTween.targets,
						y: CAMIONETA.VIDRIOS.OFFSET_Y,
						duration: tiempoTranscurrido,
					});
					this.ventanillaTween.remove();
				}
			},
		});
	}
	
	mostrarCabeza()
	{
		if(this.enRetirada){return};
		this.cabezaTween = this.scene.tweens.add({
			targets: this.cabeza,
			// Uso de 'start-to' para evitar desfasajes al matar el tween
			scale: {start: CAMIONETA.CABEZA.ESCALA, to: CAMIONETA.TWEENS.CABEZA.PROP_SCALE},
			y: {start: CAMIONETA.CABEZA.OFFSET_Y, to: CAMIONETA.TWEENS.CABEZA.PROP_Y},
			duration: CAMIONETA.TWEENS.CABEZA.DURACION,
			onStart: () => {
				this.ventanillaTween.pause();
				this.cabeza.setVisible(true);
			},
			yoyo: true,
			onYoyo: () => {
				this.cabezaTween.pause();
				this.iniciarBusquedaObjetivo();
			},
			onComplete: () => {
				this.ocultarCabeza();
			},
		});
	}
	
	iniciarBusquedaObjetivo(){
		this.buscandoObjetivo = true;
		this.scene.time.delayedCall(CAMIONETA.TWEENS.CABEZA.ESPERA, () => {
			this.finalizarBusquedaObjetivo();
		});
	}
	
	finalizarBusquedaObjetivo(){
		this.buscandoObjetivo = false;
		this.explosion.setVisible(false);
		this.isDisparando = false;
		this.cabezaTween.resume();
	}
	
	ocultarCabeza(){
		this.cabeza.setVisible(false);
		this.ventanillaTween.resume();
	}
	
	disparar () 
	{
		if(this.enRetirada){return}
		this.isDisparando = true;
		this.buscandoObjetivo = false;
		this.explosion.setVisible(true);
	}
	
	voltear (direccion) {
		this.cabeza.setX(CAMIONETA.CABEZA.OFFSETS_X[direccion<0?0:1]);
		this.explosion.setX(CAMIONETA.EXPLOSION.OFFSETS_X[direccion<0?0:1]);
		//this.scaleX *= -1; // alterna valor
		this.scaleX = Math.abs(this.scaleX) * direccion;
		
		this.scene.tweens.killTweensOf(this); 		// Mata los tweens asociados
		this.animarVentanilla(direccion);
	}
	
	retirar(){
		this.enRetirada = true;
		if(this.buscandoObjetivo){
			this.finalizarBusquedaObjetivo();
		}
	}
	
	ingresar(){
		this.enRetirada = false;
	}
	
	update (time, delta, velocidad, playerX, direccion)
	{
		const deltaSeconds = delta / 1000;
		const playerWidth = this.scene.jugador.displayWidth;
		const haSalidoIzquierda = this.x + this.width < 0;
		const haSalidoDerecha = this.x - this.width > this.scene.cameras.main.width;

		this.x -= velocidad * deltaSeconds * direccion;
				
		// Verificar si la camioneta está dentro del rango de colisión con el jugador
		//if(this.x > playerX - playerWidth / 2 && this.x < playerX + playerWidth / 2 && this.buscandoObjetivo) {
		if (Math.abs(this.x - playerX) < playerWidth / 2 && this.buscandoObjetivo) {
			this.disparar();
		}
		
		const haSalido = direccion > 0 ? haSalidoIzquierda : haSalidoDerecha;
		if (haSalido && !this.enRetirada) {
			this.scene.events.emit('camionetaHaSalido', this);
		}
	}
}
