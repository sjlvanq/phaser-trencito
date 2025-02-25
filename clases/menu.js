export default class Menu extends Phaser.GameObjects.Container {
	constructor(scene, x, y, dotTexture, itemStyle, vSpacing = 10) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);
		this.dotTexture = dotTexture;
		this.itemStyle = itemStyle;
		this.nextY = 0;
		this.vSpacing = vSpacing;
		
		if (!this.scene.anims.exists('parpadea')) {
			const anim = {
				key: 'parpadea',
				frames: this.dotTexture,
				frameRate: 10,
				repeat: 3,
			}
			this.scene.anims.create(anim);
		}
		this.enabled = true;
	}

	addItem(texto, callback) {
		const cont = new Phaser.GameObjects.Container(this.scene, 0, this.nextY);
		
		const dot = this.scene.add.sprite(0, 0, this.dotTexture);
		const txt = this.scene.add.text(dot.width + 10, 0, texto, this.itemStyle);
		
		txt.setOrigin(0, 0.5);
		txt.y = dot.y;
		
		dot.setOrigin(0, 0.5);
		const hitArea = this.scene.add.rectangle(
			dot.x, 0,
			txt.width + dot.width + 10,
			Math.max(dot.height, txt.height),
			0x000000, 0
		);
		hitArea.setOrigin(0,0.5);
		hitArea.setInteractive();
		
		hitArea.on('pointerdown', () => {
			if(this.enabled){
				this.enabled = false;
				this.animate(dot, callback).then(() => {
						this.enabled = true;
				});
			}
		});
		
		cont.add([dot, txt, hitArea]);
		this.add(cont);
		
		this.nextY += Math.max(dot.height, txt.height) + this.vSpacing;
	}
	async animate(dot, callback) {
		this.scene.sound.play('menu_snd');
		dot.play('parpadea');
		await new Promise(resolve => {
			dot.once('animationcomplete', async () => {
				dot.setFrame(0);
				await callback();
				resolve();
			});
		});
	}
}
