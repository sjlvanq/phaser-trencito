export default class RowAnimatedSprite extends Phaser.GameObjects.Sprite {
            constructor (scene, x, y, texture, row=0, framerate=3) {
				super(scene, x, y, texture);
				this.scene = scene;
				this.scene.add.existing(this);
				
				const textureData = this.scene.textures.get(texture).getSourceImage();
				const frameWidth = this.scene.textures.getFrame(texture, 0).width;
				const columns = Math.floor(textureData.width / frameWidth);
				
				this.anims.create({
					key: 'mov',
					frames: this.anims.generateFrameNumbers(texture, { 
						start: row * columns, 
						end: row * columns + (columns - 1)
					}),
					frameRate: framerate,
					repeat: -1
				});
				this.setFrame(columns*row);
			}
			play(){
				super.play('mov');
			}
		}
