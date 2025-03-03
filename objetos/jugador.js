export default class Jugador extends Phaser.GameObjects.Sprite {
            constructor (scene, x, y, texture) {
				super(scene, x, y,texture);
				this.scene = scene;
				this.scene.add.existing(this);
				this.velocidad = 90;
				this.isHerido = false; 
				
				this.heridoTween = scene.tweens.add({
					targets: this,
					paused: true,
					alpha: 0.1,
					duration: 100,
					yoyo: true,
					repeat: 3,
					onStart: ()=>{
						this.isHerido = true;
					},
					onComplete: ()=>{
						this.heridoTween.restart();
						this.heridoTween.pause();
						this.isHerido = false;
						this.setAlpha(1);
					}
				});
				
				this.animatePlayer();
			}
			animatePlayer() {
				if(!this.scene.anims.exists('walk')) {
					this.anims.create({
						key: 'walk',
						frames: this.anims.generateFrameNumbers('jugador', { start: 0, end: 3 }),
						frameRate: 10,
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
						if(this.x + this.displayWidth / 2 <= 320) {
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
