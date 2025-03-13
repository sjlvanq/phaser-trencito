export default class Botella extends Phaser.GameObjects.Sprite {
	static NUEVA_UBICACION_DISTANCIA_MINIMA = 50;
	static TWEEN_DURACION = 1000;
	static TWEEN_PROP_Y = '-=100';
	
	constructor (scene, y, texture, jugadorX) {
		super(scene, -100, y, texture);
		this.scene = scene;
		this.scene.add.existing(this);
		
		this.setFrame(Phaser.Math.Between(0, 2));
		this.isCollected = false; 
		
		this.initialY = y;
		
		this.recogerTween = this.scene.tweens.add({
			targets: this,
			duration: Botella.TWEEN_DURACION,
			y: Botella.TWEEN_PROP_Y,
			alpha: 0,
			paused: true,
			onComplete: () => {
				this.onRecogerComplete();
				this.recogerTween.seek(0);
				this.recogerTween.pause()
				
			},
		});
		
		this.setPosition(this.nuevaPosicionX(jugadorX), this.initialY);
	}
	
	recoger() {
		if (!this.recogerTween.isPlaying() && !this.isCollected) {
			this.isCollected = true; 
			this.recogerTween.resume();
			this.scene.sound.play('botella_snd');
			
			this.scene.events.emit('botellaRecolectada');
		}
	}
	
	nuevaPosicionX(anteriorX) {
		let newX;
		const anchoPantalla = this.scene.cameras.main.width;
		const anchoBotella = this.getBounds().width;
		do {
			newX = Phaser.Math.Between(anchoBotella, anchoPantalla-anchoBotella);
		} while (Math.abs(newX - anteriorX) < Botella.NUEVA_UBICACION_DISTANCIA_MINIMA);
		return newX;
	}

	onRecogerComplete() {
		this.setPosition(this.nuevaPosicionX(this.x), this.initialY);
		this.setFrame(Phaser.Math.Between(0, 2));
		this.setAlpha(1); 
		this.isCollected = false;
	}
}	
