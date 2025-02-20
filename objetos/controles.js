export default class Controles extends Phaser.GameObjects.Container {
    constructor(scene, y) {
		const centerX = scene.scale.width / 2;
        super(scene, centerX, y);
        scene.add.existing(this);

        // Crear un grupo de botones usando la escena
        //this.group = scene.add.group();
		this.rightIsPressed = false;
		this.leftIsPressed = false;
		//const frames = ['control0', 'control1', 'control2']; 
		//const flags = ['leftIsPressed', 'actionIsPressed', 'rightIsPressed'];
		/*
		frames.forEach((frame, index) => {
			const button = scene.add.image(0, 0, frame);
			button.setInteractive();
			button.on('pointerdown', () => { this[flags[index]] = true; button.flipY = true;});
			button.on('pointerup', () => { this[flags[index]] = false; button.flipY = false;});
			this.group.add(button);
		});
		*/
		
		const buttonLeft = scene.add.image(0,0,'boton');
		const buttonRight = scene.add.image(0,0,'boton');
		buttonRight.flipX = true;
		buttonLeft.setInteractive();
		buttonRight.setInteractive();
		
		buttonLeft.on('pointerdown', () => {this.leftIsPressed = true; buttonLeft.flipY = true;});
		buttonRight.on('pointerdown', () => {this.rightIsPressed = true; buttonRight.flipY = true;});
		buttonLeft.on('pointerup', () => {this.leftIsPressed = false; buttonLeft.flipY = false;});
		buttonRight.on('pointerup', () => {this.rightIsPressed = false; buttonRight.flipY = false;});

		//buttonRight.flipX = true;
		
		this.add(buttonLeft);
		this.add(buttonRight);
		
        // Alinearlos en una cuadrícula
        Phaser.Actions.GridAlign(this.list, {
            width: 2,          // Número de columnas
            height: 1,         // Número de filas
            cellWidth: buttonLeft.width + 15,     // Ancho de cada celda
            cellHeight: buttonLeft.height + 10,    // Altura de cada celda
            x: -buttonLeft.width - 15,          // Coordenada X inicial
            y: 0              // Coordenada Y inicial
        });

        // Añadir el grupo al contenedor
        //this.add(this.group.getChildren());
        //this.setOrigin(0.5);
    }
}
