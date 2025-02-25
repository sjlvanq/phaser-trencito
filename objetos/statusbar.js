export default class StatusBar extends Phaser.GameObjects.Container
{
	constructor (scene, nivel, puntaje, vidas)
	{
		
		super(scene, 0, 0);
		scene.add.existing(this);
		
		const statusTextOptions = {color: "#000", fontSize:"15px", fontFamily: "sans-serif"};
		
		this.bg = scene.add.rectangle(0,0,scene.cameras.main.width,35,0xFFFFFF)
			.setOrigin(0)
			.setAlpha(0.60);
		
		this.statusVidasIco = scene.add.sprite(260, 18, 'icons', 2);
		this.statusVidasText = scene.add.text(280, 13, "x " + vidas, statusTextOptions);
		this.statusPuntosIco = scene.add.sprite(200, 18, 'icons', 0);
		this.statusPuntosText = scene.add.text(220, 13, puntaje, statusTextOptions);
		this.statusNivelText = scene.add.text(15, 8, "Nivel "+nivel, statusTextOptions);
		this.statusGomasIco = scene.add.sprite(100, 18, 'icons',1);
		this.statusGomasIco.setVisible(false);
		scene.tweens.add({
			targets: this.statusGomasIco,
			duration: 0,
			alpha: 0,
			yoyo: true,
			hold: 100,
			repeat: -1,
			repeatDelay: 500,
		});;
		
		this.add([this.bg, this.statusVidasIco,this.statusVidasText,this.statusPuntosIco,this.statusPuntosText,this.statusNivelText,this.statusGomasIco]);
	}
	putVidas(vidas){
		this.statusVidasText.setText("x "+vidas);
	}
	putNivel(nivel){
		this.statusNivelText.setText("Nivel "+nivel);
	}
	putPuntaje(puntos){
		this.statusPuntosText.setText(puntos);
	}
	showGomas(){
		this.statusGomasIco.setVisible(true);
	}
	hideGomas(){
		this.statusGomasIco.setVisible(false);
	}
}
