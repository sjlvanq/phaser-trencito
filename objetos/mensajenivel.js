export default class MensajeNivel extends Phaser.GameObjects.Text {
	constructor(scene, x, y) {
		const estilo = {
			color: "#fff",
			fontSize: "50px", 
			fontFamily: "monaco", 
			strokeThickness: 1
		}
		
		super(scene, x, y, '', estilo);
		scene.add.existing(this);
		this.scene = scene;

		this.setOrigin(0.5);
		this.setScale(0.1);
		this.setAlpha(0);
		this.setDepth(10);
		this.setScrollFactor(0);
	}
	mostrar() {
		this.setText(`Nivel ${this.scene.data.get('nivel')}`);
		this.scene.tweens.add({
			targets: this,
			props: {
				scale: {value: 2, duration: 1200, ease: 'Cubic.easeIn'},
				alpha: {value: 1, yoyo: true, ease: 'Expo.easeOut', duration: 850}
			},
			hold: 3000,
			onComplete: ()=> {
				this.setAlpha(0);
				this.setScale(0);
			},
		});
	}
	ocultar() {
		this.setVisible(false);
	}
}
