export default class MensajeNivel extends Phaser.GameObjects.Text {
	constructor(scene, x, y) {
		const estilo = {
			color: "#fff",
			fontSize: "50px", 
			fontFamily: "monaco", 
			strokeThickness: 1
		}
		
		super(scene, x, y, '', estilo);
		this.scene = scene;

		this.setOrigin(0.5);
		this.setScale(0.1);
		this.setAlpha(0);
		this.setDepth(10);
		this.scene.add.existing(this);
	}
	mostrar(nivel) {
		this.setText("Nivel "+nivel)
		this.scene.tweens.add({
			targets: this,
			props: {
				scale: {value: 2, duration: 1200, ease: 'Power1.in'},
				alpha: {value: 1, yoyo: true, ease: 'Expo.out', duration: 700}
			},
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
