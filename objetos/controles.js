export default class Controles extends Phaser.GameObjects.Container 
{
	constructor(scene, y) {
		super(scene, scene.scale.width / 2, y);
		scene.add.existing(this);
		
		this.enabled = true;
		this.rightIsPressed = false;
		this.leftIsPressed = false;
		
		const buttonLeft = this._crearBoton(-45, 'boton','left');
		const buttonRight = this._crearBoton(45, 'boton', 'right', true);

		this.add(buttonLeft);
		this.add(buttonRight);
		
		if(scene.registry.get('gameOptions').soporteTeclado) {
			scene.input.keyboard.on('keydown-LEFT', function() {
				if (buttonLeft.input?.enabled) { buttonLeft.emit('pointerdown'); }
			});
			scene.input.keyboard.on('keyup-LEFT', function() {
				if (buttonLeft.input?.enabled) { buttonLeft.emit('pointerup'); }
			});
			scene.input.keyboard.on('keydown-RIGHT', function() {
				if (buttonRight.input?.enabled) { buttonRight.emit('pointerdown'); }
			});
			scene.input.keyboard.on('keyup-RIGHT', function() {
				if (buttonRight.input?.enabled) { buttonRight.emit('pointerup'); }
			});
		}

	}
	_crearBoton(x, textura, direccion, flipX = false) {
		const boton = this.scene.add.image(x, 0, textura).setInteractive().setFlipX(flipX);
		boton.on('pointerdown', () => {
			this[`${direccion}IsPressed`] = true;
			boton.setFlipY(true);
		});
		
		boton.on('pointerup', () => {
			this[`${direccion}IsPressed`] = false;
			boton.setFlipY(false);
		});
		return boton;
	}

	limpiar() {
		this.rightIsPressed = false;
		this.leftIsPressed = false;
	}

	enable() {
		this.enabled = true;
		this.list.forEach(boton => {
			boton.setInteractive();
		});
	}

	disable() {
		this.limpiar();
		this.enabled = false;
		this.list.forEach(boton => {
			boton.disableInteractive();
		});
	}
}
