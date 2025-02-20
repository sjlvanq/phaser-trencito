export default class RowAnimatedSprite extends Phaser.GameObjects.Sprite {
            constructor (scene, x, y, texture, framerate=3, row=1) {
				super(scene, x, y, texture);
				this.scene = scene;
				this.scene.add.existing(this);
				this.anims.create({
					key: 'mov',
					frames: this.anims.generateFrameNumbers(texture, { 
						start: 0, 
						end: scene.textures.get(texture).frameTotal - 2
					}),
					frameRate: framerate,
					repeat: -1
				});
			}
			play(){
				super.play('mov');
			}
		}
