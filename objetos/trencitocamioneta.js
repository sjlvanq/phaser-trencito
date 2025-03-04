import CAMIONETA from './trencitocamionetaConfig.js';
import FullAnimatedSprite from '../clases/fullanimatedsprite.js';

export default class Camioneta extends Phaser.GameObjects.Container
{
	constructor (scene, x, y, ventanillaTweenDelay=0, celdaGridAncho=200)
	{
		super(scene, x, y);
		scene.add.existing(this);
		
		this.isDisparando = false;
		this.buscandoObjetivo = false;
		this.velocidad = CAMIONETA.VELOCIDAD_INICIAL;
		
		this.celdaGridAncho = celdaGridAncho;
		
		this.chasis = scene.add.sprite(0, 0, 'camioneta').setDepth(1);
		this.vidrios = [
			scene.add.rectangle(CAMIONETA.VIDRIOS.OFFSETS_X[0], CAMIONETA.VIDRIOS.OFFSET_Y, CAMIONETA.VIDRIOS.ANCHO, CAMIONETA.VIDRIOS.ALTO, CAMIONETA.VIDRIOS.COLOR),
			scene.add.rectangle(CAMIONETA.VIDRIOS.OFFSETS_X[1], CAMIONETA.VIDRIOS.OFFSET_Y, CAMIONETA.VIDRIOS.ANCHO, CAMIONETA.VIDRIOS.ALTO, CAMIONETA.VIDRIOS.COLOR),
		];
		
		this.explosion = scene.add.sprite(CAMIONETA.EXPLOSION.OFFSET_X, CAMIONETA.EXPLOSION.OFFSET_Y, 'explosion').setDepth(1);
		this.explosion.setScale(CAMIONETA.EXPLOSION.ESCALA);
		this.explosion.setVisible(false);
		
		this.cabeza = scene.add.sprite(CAMIONETA.CABEZA.OFFSET_X, CAMIONETA.CABEZA.OFFSET_Y, 'cabeza');
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
		
		this.crearTweens(ventanillaTweenDelay);
		
		this.width = this.getBounds().width;
	}
	
	crearTweens(ventanillaTweenDelay)
	{
		this.animarChasis();
		this.animarVentanilla(ventanillaTweenDelay);

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
	
	animarVentanilla(ventanillaTweenDelay)
	{
		this.ventanillaTween = this.scene.tweens.add({
			targets: this.vidrios[1],
			delay: ventanillaTweenDelay,
			y: CAMIONETA.TWEENS.VENTANILLA.PROP_Y,
			duration: CAMIONETA.TWEENS.VENTANILLA.DURACION,
			repeat: -1,
			yoyo: true,
			ease: Phaser.Math.Easing.Expo.In,
			onYoyo: () => {this.mostrarCabeza();},
		});
	}
	
	mostrarCabeza()
	{
		this.cabezaTween = this.scene.tweens.add({
			targets: this.cabeza,
			scale: CAMIONETA.TWEENS.CABEZA.PROP_SCALE,
			y: CAMIONETA.TWEENS.CABEZA.PROP_Y,
			duration: CAMIONETA.TWEENS.CABEZA.DURACION,
			onStart: () => {
				this.ventanillaTween.pause();
				this.cabeza.setVisible(true);
			},
			yoyo: true,
			onYoyo: () => {this.iniciarBusquedaObjetivo();},
			onComplete: () => {this.ocultarCabeza();},
		});
	}
	
	iniciarBusquedaObjetivo(){
		this.cabezaTween.pause();
		this.buscandoObjetivo = true;
		this.scene.time.delayedCall(CAMIONETA.TWEENS.CABEZA.ESPERA, () => {
			this.buscandoObjetivo = false;
			this.explosion.setVisible(false);
			this.isDisparando = false;
			this.cabezaTween.resume();
		});
	}
	
	ocultarCabeza(){
		this.cabeza.setVisible(false);
		this.ventanillaTween.resume();
	}
	
	disparar () 
	{
		this.isDisparando = true;
		this.buscandoObjetivo = false;
		this.explosion.setVisible(true);
	}
	
	reiniciarPosicion ()
	{
		const offsetReinicio = (this.celdaGridAncho - this.width) / 2;
		this.x = this.scene.cameras.main.width + this.width + offsetReinicio; //38.5;				
	}
	
	update (time, delta, playerX)
	{
		const deltaSeconds = delta / 1000;
		const playerWidth = this.scene.jugador.displayWidth 

		this.x -= this.velocidad * deltaSeconds;
		
		//if(this.x > playerX - playerWidth / 2 && this.x < playerX + playerWidth / 2 && this.buscandoObjetivo) {
		if (Math.abs(this.x - playerX) < playerWidth / 2 && this.buscandoObjetivo) {
			this.disparar();
		}
		
		if (this.x < this.width * -1) {
			this.reiniciarPosicion();
		}				
	}
}
