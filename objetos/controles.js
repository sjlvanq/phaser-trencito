export default class Controles extends Phaser.GameObjects.Container {
    constructor(scene, y) {
		const centerX = scene.scale.width / 2;
        super(scene, centerX, y);
        scene.add.existing(this);

        // Crear un grupo de botones usando la escena
		this.rightIsPressed = false;
		this.leftIsPressed = false;
				
		const buttonLeft = scene.add.image(0,0,'boton');
		const buttonRight = scene.add.image(0,0,'boton');
		buttonRight.flipX = true;
		buttonLeft.setInteractive();
		buttonRight.setInteractive();
		
		buttonLeft.on('pointerdown', () => {this.leftIsPressed = true; buttonLeft.flipY = true;});
		buttonRight.on('pointerdown', () => {this.rightIsPressed = true; buttonRight.flipY = true;});
		buttonLeft.on('pointerup', () => {this.leftIsPressed = false; buttonLeft.flipY = false;});
		buttonRight.on('pointerup', () => {this.rightIsPressed = false; buttonRight.flipY = false;});

		this.add(buttonLeft);
		this.add(buttonRight);
		
        // Alinearlos en una cuadrícula
        Phaser.Actions.GridAlign(this.list, {
            width: 2,
            height: 1,
            cellWidth: buttonLeft.width + 15,
            cellHeight: buttonLeft.height + 10,
            x: -buttonLeft.width - 15,
            y: 0
        });

    }
}
