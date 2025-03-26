export default class Menu extends Phaser.GameObjects.Container {
	static keyCodes = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "ZERO"];
	constructor(scene, x, y, dotTexture, itemStyle, vSpacing) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);
		this.dotTexture = dotTexture;
		this.itemStyle = itemStyle;
		this.nextY = 0;
		this.vSpacing = vSpacing;

		const anim = {
			key: 'parpadea',
			frames: this.dotTexture,
			frameRate: 10,
			repeat: 3,
		}

		if(!this.scene.anims.get(anim.key)) {
			this.scene.anims.create(anim);
		}

		this.enabled = true;
	}

	addItem(texto, callback, defaultItem = false) {
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
			if(this.enabled && hitArea.input.enabled){
				dot.play('parpadea')
				this.scene.sound.play('menu_snd');
				dot.once('animationcomplete', async () => {
					dot.setFrame(0);
					await callback();
					hitArea.setInteractive();

				});
			}
		});

		this.scene.input.keyboard?.on(`keydown-${Menu.keyCodes[this.length]}`, () => {
			hitArea.emit('pointerdown');
		});

		if(defaultItem){
			this.scene.input.keyboard?.on('keydown', (event) => {
				if(event.code === 'Space' || event.code === 'Enter') {
					if(this.enabled) hitArea.emit('pointerdown');
				}
			});
		}
		
		cont.add([dot, txt, hitArea]);
		this.add(cont);
		
		this.nextY += Math.max(dot.height, txt.height) + this.vSpacing;
	}

	disable() {
		this.enabled = false;
	}

	enable() {
		this.enabled = true;
	}
}
