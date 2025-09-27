export default class Bottle extends Phaser.GameObjects.Sprite {
	static NEW_POSITION_MIN_DISTANCE = 50;
	static TWEEN_DURATION = 1000;
	static TWEEN_PROP_Y = '-=100';
	static STATES = {
		COLLECTIBLE: 0,
		COLLECTED: 1,
		HIDDEN: 2
	};
	
	constructor (scene, y, texture, playerX) {
		super(scene, -100, y, texture);
		this.scene = scene;
		this.scene.add.existing(this);
		
		this.setFrame(Phaser.Math.Between(0, 2));
		this.isCollected = false; 
		
		this.initialY = y;
		
		this.collectTween = this.scene.tweens.add({
			targets: this,
			duration: Bottle.TWEEN_DURATION,
			y: Bottle.TWEEN_PROP_Y,
			alpha: 0,
			paused: true,
			onComplete: () => {
				this.onCollectComplete();
				this.collectTween.seek(0);
				this.collectTween.pause()
			},
		});
		
		this.setPosition(this.newPositionX(playerX), this.initialY);
	}
	
	collect() {
		if (!this.collectTween.isPlaying() && this.state === Bottle.STATES.COLLECTIBLE) {
			this.setState(Bottle.STATES.COLLECTED);
			this.collectTween.resume();
			this.scene.sound.play('bottle_snd');
			
			this.scene.events.emit('bottleCollected');
		}
	}
	
	newPositionX(anteriorX) {
		let newX;
		const anchoPantalla = this.scene.cameras.main.width;
		const anchoBotella = this.getBounds().width;
		do {
			newX = Phaser.Math.Between(anchoBotella, anchoPantalla-anchoBotella);
		} while (Math.abs(newX - anteriorX) < Bottle.NEW_POSITION_MIN_DISTANCE);
		return newX;
	}

	onCollectComplete() {
		this.setPosition(this.newPositionX(this.x), this.initialY);
		this.setFrame(Phaser.Math.Between(0, 2));
		if(this.state != Bottle.STATES.HIDDEN){
			this.setState(Bottle.STATES.COLLECTIBLE);
		}
		this.setAlpha(1); 
	}
}	
