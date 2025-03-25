export default class Jugador extends Phaser.GameObjects.Sprite 
{	
	static VELOCIDAD = 95;
	
	static TWEENS = {
		HERIDO: {
			DURACION: 100,
			REPETICIONES: 3,
		},
	};
	
	static ANIMACIONES = {
		CAMINAR: {
			FRAMERATE: 15,
		},
	};
	
	constructor (scene, x, y, texture) {
		super(scene, x, y,texture);
		this.scene = scene;
		this.scene.add.existing(this);
		this.velocidad = Jugador.VELOCIDAD;
		this.isHerido = false; 
		
		this.heridoTween = scene.tweens.add({
			targets: this,
			paused: true,
			alpha: 0.1,
			duration: Jugador.TWEENS.HERIDO.DURACION,
			yoyo: true,
			repeat: Jugador.TWEENS.HERIDO.REPETICIONES,
			persist: true,
			onStart: ()=>{
				this.isHerido = true;
			},
			onComplete: ()=>{
				this.isHerido = false;
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
				frames: this.anims.generateFrameNumbers('jugador', { start: 0, end: 3 }),
				frameRate: Jugador.ANIMACIONES.CAMINAR.FRAMERATE,
				repeat: -1
			});
		}
	}
	avanzar(time, delta, direccion) {
		const deltaSeconds = delta / 1000;
		this.anims.play('walk', true);
		switch(direccion) {
			case 'derecha':
				this.setFlipX(false);
				if(this.x + this.displayWidth / 2 <= this.scene.cameras.main.width) {
					this.x += this.velocidad * deltaSeconds;
				}
				break;
			case 'izquierda':
				this.setFlipX(true);
				if(this.x - this.displayWidth / 2 >= 0) {
					this.x -= this.velocidad * deltaSeconds;
				}
				break;
		}
	}
	detenerse() {
		this.anims.stop();
		this.setFrame(4);
	}
}
