export default class Controles extends Phaser.GameObjects.Container 
{
	constructor(scene, y) {
		super(scene, scene.scale.width / 2, y);
		scene.add.existing(this);
		
		this.rightIsPressed = false;
		this.leftIsPressed = false;
		
		const buttonLeft = this._crearBoton(-45, 'boton','left');
		const buttonRight = this._crearBoton(45, 'boton', 'right', true);
			
		this.add(buttonLeft);
		this.add(buttonRight);
		
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
}
