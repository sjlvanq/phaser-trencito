export default class Menu extends Phaser.GameObjects.Container {
	constructor(scene, x, y, dotTexture, itemStyle, vSpacing = 10) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);
		this.dotTexture = dotTexture;
		this.itemStyle = itemStyle;
		this.nextY = 0;
		this.vSpacing = vSpacing;
	}

	addItem(texto, callback) {
		const cont = new Phaser.GameObjects.Container(this.scene, 0, this.nextY);
		
		const dot = this.scene.add.image(0, 0, this.dotTexture);
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
		hitArea.on('pointerdown', callback);

		cont.add([dot, txt, hitArea]);
		this.add(cont);
		
		this.nextY += Math.max(dot.height, txt.height) + this.vSpacing;
	}
}
