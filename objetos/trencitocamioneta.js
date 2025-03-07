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
		this.velocidad = CAMIONETA.VELOCIDAD_INICIAL;
		this.enRetirada = false;
		this.ventanillaTweenDelay = ventanillaTweenDelay;
				
		this.chasis = scene.add.sprite(0, 0, 'camioneta').setDepth(1);
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
		
		this.crearTweens(ventanillaTweenDelay, direccion);
		
		this.width = this.getBounds().width;
	}
	
	crearTweens(direccion)
	{
		this.animarChasis();
		this.animarVentanilla(direccion);

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
		this.vidrios.forEach((vidrio, index) => {vidrio.setY(CAMIONETA.VIDRIOS.OFFSET_Y);});
		if(this.ventanillaTween){this.ventanillaTween.remove();}
		this.ventanillaTween = this.scene.tweens.add({
			targets: this.vidrios[direccion<0?0:1],
			delay: this.ventanillaTweenDelay,
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
		if(this.cabezaTween){this.cabezaTween.remove();}
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
			onYoyo: () => {
				this.cabezaTween.pause();
				this.iniciarBusquedaObjetivo();
			},
			onComplete: () => {
				this.ocultarCabeza();
				this.cabezaTween.remove();
			},
		});
	}
	
	iniciarBusquedaObjetivo(){
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
	
	voltear (direccion) {
		this.cabeza.setX(CAMIONETA.CABEZA.OFFSETS_X[direccion<0?0:1]);
		this.explosion.setX(CAMIONETA.EXPLOSION.OFFSETS_X[direccion<0?0:1]);
		this.scaleX = Math.abs(this.scaleX) * direccion;
		//this.scaleX *= -1; // alterna valor
		this.animarVentanilla(direccion);
	}
	
	update (time, delta, velocidad, playerX, cellWidth, direccion)
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
		// Obtiene x de la camioneta más a la deracha o más a la izquierda según dirección
		if (haSalido && !this.enRetirada) {
			const ultimaCamioneta = this.scene.trencito.getChildren()
				.reduce((max, c) => (
					(direccion > 0 ? c.x > max.x : c.x < max.x) && c.y == this.y ? c : max
				), this);
			
			this.x = ultimaCamioneta.x + cellWidth * direccion;
		}
	}
}
