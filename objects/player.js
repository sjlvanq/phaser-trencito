export default class Player extends Phaser.GameObjects.Sprite 
{	
	static SPEED = 95;
	
	static TWEENS = {
		HURT: {
			DURATION: 100,
			REPEATS: 3,
		},
	};
	
	static ANIMATIONS = {
		WALK: {
			FRAMERATE: 15,
		},
	};
	
	constructor (scene, x, y, texture) {
		super(scene, x, y,texture);
		this.scene = scene;
		this.scene.add.existing(this);
		this.speed = Player.SPEED;
		this.isHurt = false; 
		
		this.hurtTween = scene.tweens.add({
			targets: this,
			paused: true,
			alpha: 0.1,
			duration: Player.TWEENS.HURT.DURATION,
			yoyo: true,
			repeat: Player.TWEENS.HURT.REPEATS,
			persist: true,
			onStart: ()=>{
				this.isHurt = true;
			},
			onComplete: ()=>{
				this.isHurt = false;
				this.setAlpha(1);
			}
		});

		this.setScrollFactor(0);
		this.animatePlayer();
	}
	animatePlayer() {
		if(!this.scene.anims.exists('walk')) {
			this.anims.create({
				key: 'walk',
				frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
				frameRate: Player.ANIMATIONS.WALK.FRAMERATE,
				repeat: -1
			});
		}
	}
	move(time, delta, direction) {
		const deltaSeconds = delta / 1000;
		this.anims.play('walk', true);
		switch(direction) {
			case 'right':
				this.setFlipX(false);
				if(this.x + this.displayWidth / 2 <= this.scene.cameras.main.width) {
					this.x += this.speed * deltaSeconds;
				}
				break;
			case 'left':
				this.setFlipX(true);
				if(this.x - this.displayWidth / 2 >= 0) {
					this.x -= this.speed * deltaSeconds;
				}
				break;
		}
	}
	stop() {
		this.anims.stop();
		this.setFrame(4);
	}
}
