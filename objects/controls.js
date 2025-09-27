export default class Controls extends Phaser.GameObjects.Container 
{
	constructor(scene, y) {
		super(scene, scene.scale.width / 2, y);
		scene.add.existing(this);
		
		this.enabled = true;
		this.rightIsPressed = false;
		this.leftIsPressed = false;
		
		const buttonLeft = this._createButton(-45, 'button','left');
		const buttonRight = this._createButton(45, 'button', 'right', true);

		this.add(buttonLeft);
		this.add(buttonRight);
		
		scene.input.keyboard?.on('keydown-LEFT', function() {
			if (buttonLeft.input?.enabled) { buttonLeft.emit('pointerdown'); }
		});
		scene.input.keyboard?.on('keyup-LEFT', function() {
			if (buttonLeft.input?.enabled) { buttonLeft.emit('pointerup'); }
		});
		scene.input.keyboard?.on('keydown-RIGHT', function() {
			if (buttonRight.input?.enabled) { buttonRight.emit('pointerdown'); }
		});
		scene.input.keyboard?.on('keyup-RIGHT', function() {
			if (buttonRight.input?.enabled) { buttonRight.emit('pointerup'); }
		});

	}
	_createButton(x, textura, direccion, flipX = false) {
		const button = this.scene.add.image(x, 0, textura).setInteractive().setFlipX(flipX);
		button.on('pointerdown', () => {
			this[`${direccion}IsPressed`] = true;
			button.setFlipY(true);
		});
		
		button.on('pointerup', () => {
			this[`${direccion}IsPressed`] = false;
			button.setFlipY(false);
		});
		return button;
	}

	clear() {
		this.rightIsPressed = false;
		this.leftIsPressed = false;
	}

	enable() {
		this.enabled = true;
		this.list.forEach(button => {
			button.setInteractive();
		});
	}

	disable() {
		this.clear();
		this.enabled = false;
		this.list.forEach(button => {
			button.disableInteractive();
		});
	}
}
