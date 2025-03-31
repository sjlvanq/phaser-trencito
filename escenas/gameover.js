import Camioneta from '../objetos/trencitocamioneta.js';
import RowAnimatedSprite from '../clases/rowanimatedsprite.js';
import { crearFondoEstatico } from "../utils/fondos.js";
import { establecerBotonPorDefecto } from '../utils/teclado.js';

export default class GameOver extends Phaser.Scene {
	constructor() {
		super('GameOver');
	}
	
	init(data){
		this.isRecord = false;
		this.partidaPuntaje = data.puntaje;
		const rankingMejor = this.registry.get('rankingMejor');
		if (!this.registry.get('primeraPartida') && this.partidaPuntaje > rankingMejor) {
			this.registry.set({ rankingMejor: this.partidaPuntaje});
			this.isRecord = true;
		}
	}

	preload() {
		this.load.image('gameover', 'assets/imagenes/gameover.png');
	}
	
	create() {
		const layer = crearFondoEstatico(this);

		this.add.rectangle(0,0,this.cameras.main.width,40,0xFFFFFF).setOrigin(0).setAlpha(0.60);
		
		const dotBotella = this.add.image(this.cameras.main.width / 2 - 25, 130,'botella');
		this.add.text(this.cameras.main.width / 2, 130,`x ${this.partidaPuntaje}`, {color:"#fff", fontSize:24}).setOrigin(0);
		dotBotella.setScale(1);
		dotBotella.setRotation(0.2);
		
		const statusTextOptions = {color: "#000", fontSize:"15px", fontFamily: "sans-serif"};
		const primeraPartida = this.registry.get('primeraPartida');
		this.add.text(this.cameras.main.width / 5, 25,
			'Anterior: '+(primeraPartida ? '--':this.registry.get('rankingAnterior')), statusTextOptions).setOrigin(0.5);
		this.add.text(this.cameras.main.width / 5 * 4, 25,
			'Mejor: '+(primeraPartida ? '--':this.registry.get('rankingMejor')), statusTextOptions).setOrigin(0.5);
		
		if (this.isRecord) {
			const record = this.add.text(this.cameras.main.width, this.cameras.main.height / 4, "Record ! ! !", {color: "#fff",fontSize: "50px", fontFamily: "monaco", strokeThickness: 1})
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
		
		this.add.image(this.cameras.main.width / 2,this.cameras.main.height / 2,'gameover');
		
		const camioneta = new Camioneta(this, this.cameras.main.width/2, 310-15).setScale(0.4);
		// Ha sido sacada la llamada a animarVentanilla del constructor de Camioneta
		camioneta.animarVentanilla(1);
		camioneta.postFX.addShadow(0,1,0.03,2);
		
		this.botonVolverAlMenu = new RowAnimatedSprite(this, this.cameras.main.width/2, 170, 'flechas', 0).setOrigin(0.5,0);
		this.botonVolverAlMenu.setScale(1.1);
		this.botonVolverAlMenu.play();
		this.botonVolverAlMenu.setInteractive()
		this.botonVolverAlMenu.on('pointerdown', () => {
			this.actualizarData();
			this.scene.start('MenuScene');
		});

		establecerBotonPorDefecto(this, this.botonVolverAlMenu);
	}
	
	actualizarData(){
		const primeraPartida = this.registry.get('primeraPartida');
		this.registry.set({ rankingAnterior: this.partidaPuntaje });
		if(this.isRecord || primeraPartida ){
			this.registry.set({ rankingMejor: this.partidaPuntaje });
		}
		if(primeraPartida){
			this.registry.toggle('primeraPartida');
		}
	}
}
