export default class Botella extends Phaser.GameObjects.Sprite {
	constructor (scene, y, texture) {
		const x = Phaser.Math.Between(5, 315);
		super(scene, x, y, texture);
		this.scene = scene;
		this.scene.add.existing(this);
		
		this.setFrame(Phaser.Math.Between(0, 2));
		this.isCollected = false; 
		
		this.initialY = y;

		this.recogerTween = this.scene.tweens.add({
			targets: this,
			duration: 1000,
			y: '-=100',
			alpha: 0,
			paused: true,
			onComplete: () => {
				this.onRecogerComplete();
				this.recogerTween.restart();
				this.recogerTween.pause()
				
			},
		});
	}
	
	recoger() {
		if (!this.recogerTween.isPlaying() && !this.isCollected) {
			this.isCollected = true; 
			this.recogerTween.resume();
			this.scene.sound.play('botella_snd');
			
			this.scene.events.emit('botellaRecolectada');
		}
	}
	
	onRecogerComplete() {
		let newX;
		do {
			newX = Phaser.Math.Between(5, 315);
			} while (Math.abs(newX - this.x) < 50);
		
		this.setPosition(newX, this.initialY);
		this.setFrame(Phaser.Math.Between(0, 2));
		this.setAlpha(1); 
		this.isCollected = false;
	}
}	
