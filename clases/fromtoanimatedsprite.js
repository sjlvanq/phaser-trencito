export default class FromToAnimatedSprite extends Phaser.GameObjects.Sprite {
            constructor (scene, x, y, texture, first=0, last=0, autoplay=false, framerate=5) {
				super(scene, x, y, texture);
				this.scene = scene;
				this.scene.add.existing(this);
				
				const key = `${texture}_${first}to${last}`;
				this.key = key;

				this.setFrame(first);
				if (!this.scene.anims.exists(key)) {
					this.scene.anims.create({
						key: key,
						frames: this.scene.anims.generateFrameNumbers(texture, { 
							start: first, 
							end: last
						}),
						frameRate: framerate,
						repeat: -1
					});
				}
				if(autoplay){this.play();}

			}
			play(){
				super.play(this.key);
			}
		}
