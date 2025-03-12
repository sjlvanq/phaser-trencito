import CAMIONETA from './trencitocamionetaConfig.js';
import FullAnimatedSprite from '../clases/fullanimatedsprite.js';

export default class Camioneta extends Phaser.GameObjects.Container
{
	constructor (scene, x, y, ventanillaTweenDelay=0, direccion=1)
	{
		super(scene, x, y);
		scene.add.existing(this);
		
		this.disparando = false;
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
		if(this.ventanillaTween){this.ventanillaTween.destroy();}
		this.ventanillaTween = this.scene.tweens.chain({
			delay: this.ventanillaTweenDelay,
			onStart: ()=>{

			},
			tweens: [
				{
					targets: this.vidrios[direccion<0?0:1],
					y: {start: CAMIONETA.VIDRIOS.OFFSET_Y, to: CAMIONETA.TWEENS.VENTANILLA.PROP_Y},
					duration: CAMIONETA.TWEENS.VENTANILLA.DURACION,
					ease: Phaser.Math.Easing.Expo.In,
					onStart: () => {
						if(this.enRetirada) {
							this.ventanillaTween.stop();
						}
					}
				},
				{
					targets: this.cabeza,
					scale: {start: CAMIONETA.CABEZA.ESCALA, to: CAMIONETA.TWEENS.CABEZA.PROP_SCALE},
					y: {start: CAMIONETA.CABEZA.OFFSET_Y, to: CAMIONETA.TWEENS.CABEZA.PROP_Y},
					duration: CAMIONETA.TWEENS.CABEZA.DURACION,
					yoyo: true,
					hold: 1500,
					onStart: () => {
						//console.log("onStart");
						if(this.enRetirada) {
							this.ventanillaTween.nextTween();
						} else {
							this.cabeza.setVisible(true);
						}
					},
					onYoyo: () => {
						//console.log("onYoyo");
						if(this.buscandoObjetivo){
							this.finalizarBusquedaObjetivo();
						} else if(this.disparando){
							this.finalizarDisparo();
						}
					},
					onHold: () => {
						//console.log("onHold");
						if(!this.enRetirada){
							this.buscandoObjetivo = true;
						}
					},
					onComplete: () => {
						//console.log("onComplete");
						this.cabeza.setVisible(false);
					},
				},
				{
					targets: this.vidrios[direccion<0?0:1],
					y: CAMIONETA.VIDRIOS.OFFSET_Y,
					duration: CAMIONETA.TWEENS.VENTANILLA.DURACION,
					ease: Phaser.Math.Easing.Expo.Out,
				},
			],
			loop: -1,
		});
	}
		
	iniciarBusquedaObjetivo(){
		this.buscandoObjetivo = true;
		this.scene.time.delayedCall(CAMIONETA.TWEENS.CABEZA.ESPERA, () => {
			this.finalizarBusquedaObjetivo();
		});
	}

	disparar () 
	{
		//if(this.enRetirada){return}
		this.buscandoObjetivo = false;
		this.disparando = true;
		this.mostrarExplosion();
		this.scene.sound.play('disparo_snd');
		this.scene.events.emit('camionetaDispara', this.x);
	}
	
	mostrarExplosion(){
		this.explosion.setVisible(true)
		this.scene.time.delayedCall(CAMIONETA.EXPLOSION.TIEMPO_VISIBLE, () => {
			this.explosion.setVisible(false)
		});
	}
	
	finalizarBusquedaObjetivo(){
		this.buscandoObjetivo = false;
	}

	finalizarDisparo(){
		this.disparando = false;
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
		this.cabeza.setVisible(false);
		this.vidrios.forEach((vidrio)=>{vidrio.setY(CAMIONETA.VIDRIOS.OFFSET_Y)});
		
		this.enRetirada = false;
	}
	
	update (time, delta, velocidad, playerX, direccion)
	{
		const deltaSeconds = delta / 1000;
		const playerWidth = this.scene.jugador.displayWidth;
		const haSalidoIzquierda = this.x + this.width / 2 < 0;
		const haSalidoDerecha = this.x - this.width / 2 > this.scene.cameras.main.width;

		this.x -= velocidad * deltaSeconds * direccion;
				
		// Verificar si la camioneta está dentro del rango de colisión con el jugador
		//if(this.x > playerX - playerWidth / 2 && this.x < playerX + playerWidth / 2 && this.buscandoObjetivo) {
		if (Math.abs(this.x - playerX) < playerWidth / 2 && this.buscandoObjetivo) {
			this.disparar();
		}
		
		const haSalido = direccion > 0 ? haSalidoIzquierda : haSalidoDerecha;
		if (haSalido) {
			this.scene.events.emit('camionetaHaSalido', this);
		}
	}
}
