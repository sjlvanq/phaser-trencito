import Camioneta from '../objetos/camioneta.js';
import RowAnimatedSprite from '../clases/rowanimatedsprite.js';
import createTilemap from '../tilemaps.js';

export default class GameOver extends Phaser.Scene {
	constructor() {
		super('GameOver');
	 }
	 init(data){
		//console.log(data);
		this.data = data;
		this.isRecord = false;
		if (!this.data.primeraPartida && this.data.puntaje > this.data.ranking.mejor) { 
			this.data.ranking.mejor = this.data.puntaje;
			this.isRecord = true;
		}
	 }
	 preload() {
		
	}
    create() {
		const layer = createTilemap(this);
		layer.setScale(0.5);

		this.add.rectangle(0,0,this.cameras.main.width,40,0xFFFFFF).setOrigin(0).setAlpha(0.60);

		//this.add.image(this.cameras.main.width / 2,this.cameras.main.height / 4,'pizarra1');
		
		const statusTextOptions = {color: "#000", fontSize:"15px", fontFamily: "sans-serif"};
		
		//const dotBotella = this.add.image(this.cameras.main.width / 2 - 25, this.cameras.main.height / 6 * 2,'botella');
		const dotBotella = this.add.image(this.cameras.main.width / 2 - 25, 130,'botella');
		//this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 6 * 2,'x '+this.data.puntaje, {color:"#fff", fontSize:24})
		this.add.text(this.cameras.main.width / 2, 130,'x '+this.data.puntaje, {color:"#fff", fontSize:24}).setOrigin(0);
		dotBotella.setScale(1);
		dotBotella.setRotation(0.2);
		
		
		this.add.text(this.cameras.main.width / 5, 25,
			'Anterior: '+(this.data.primeraPartida ? '--':this.data.ranking.anterior), statusTextOptions).setOrigin(0.5);
		this.add.text(this.cameras.main.width / 5 * 4, 25,
			'Mejor: '+(this.data.primeraPartida ? '--':this.data.ranking.mejor), statusTextOptions).setOrigin(0.5);
		
		if (this.isRecord) {
			const record = this.add.text(this.cameras.main.width, this.cameras.main.height / 4, "Record ! ! !", {color: "#fff",fontSize: "50px", fontFamily: "monaco", strokeThickness: 1})
				//.setOrigin(0,0.5)
				.setScale(2)
				.setAlpha(0.8);
			this.tweens.add({
				targets: record,
				duration: 2500,
				x: -record.displayWidth
			})
		}
		
		const dotBotellaTween = this.tweens.add({
			targets:dotBotella,
			duration:0,
			rotation: -0.2,
			yoyo: true,
			repeat: -1,
			repeatDelay: 300,
			onYoyo: ()=>{
				dotBotellaTween.pause();
				this.time.delayedCall(300, () => {
					dotBotellaTween.resume();
				});
			},
		})
		
		//this.add.image(this.cameras.main.width / 2,this.cameras.main.height / 6 * 3,'gameover').setScale(1);
		this.add.image(this.cameras.main.width / 2,this.cameras.main.height / 2,'gameover').setScale(1);
		
		const camioneta = new Camioneta(this, this.cameras.main.width/2, 310-15).setScale(0.4);
		camioneta.postFX.addShadow(0,1,0.03,2);
		
		//this.botonVolverAlMenu = new RowAnimatedSprite(this, this.cameras.main.width/2, 355, 'flechas', 0).setOrigin(0.5,0);
		this.botonVolverAlMenu = new RowAnimatedSprite(this, this.cameras.main.width/2, 170, 'flechas', 0).setOrigin(0.5,0);
		this.botonVolverAlMenu.setScale(1.1);
		this.botonVolverAlMenu.play();
		this.botonVolverAlMenu.setInteractive()
		this.botonVolverAlMenu.on('pointerdown', () => {
			this.actualizarData();
			this.scene.start('MenuScene', this.data);
		});
    }
    actualizarData(){
		this.data.ranking.anterior = this.data.puntaje;
		if(this.isRecord || this.data.primeraPartida){
			this.data.primeraPartida = false;
			this.data.ranking.mejor = this.data.puntaje;
		}
		
	}
}
