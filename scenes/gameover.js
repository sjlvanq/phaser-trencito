import PatrolCar from '../objects/trencitocamioneta.js';
import RowAnimatedSprite from '../classes/rowanimatedsprite.js';
import { createStaticBackground } from "../utils/backgrounds.js";
import { setDefaultButton } from '../utils/keyboard.js';

export default class GameOver extends Phaser.Scene {
	constructor() {
		super('GameOver');
	}
	
	init(data){
		this.isRecord = false;
		this.gameScore = data.score;
		const rankingBest = this.registry.get('rankingBest');
		if (!this.registry.get('isFirstGame') && this.gameScore > rankingBest) {
			this.registry.set({ rankingBest: this.gameScore});
			this.isRecord = true;
		}
	}

	preload() {
		this.load.image('gameover', 'assets/images/gameover.png');
	}
	
	create() {
		const layer = createStaticBackground(this);

		this.add.rectangle(0,0,this.cameras.main.width,40,0xFFFFFF).setOrigin(0).setAlpha(0.60);
		
		const dotBotella = this.add.image(this.cameras.main.width / 2 - 25, 130,'bottle');
		this.add.text(this.cameras.main.width / 2, 130,`x ${this.gameScore}`, {color:"#fff", fontSize:24}).setOrigin(0);
		dotBotella.setScale(1);
		dotBotella.setRotation(0.2);
		
		const statusTextOptions = {color: "#000", fontSize:"15px", fontFamily: "sans-serif"};
		const isFirstGame = this.registry.get('isFirstGame');
		this.add.text(this.cameras.main.width / 5, 25,
			'Anterior: '+(isFirstGame ? '--':this.registry.get('rankingLast')), statusTextOptions).setOrigin(0.5);
		this.add.text(this.cameras.main.width / 5 * 4, 25,
			'Mejor: '+(isFirstGame ? '--':this.registry.get('rankingBest')), statusTextOptions).setOrigin(0.5);
		
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
		
		const patrolCar = new PatrolCar(this, this.cameras.main.width/2, 310-15).setScale(0.4);
		// Ha sido sacada la llamada a animarVentanilla del constructor de PatrolCar
		patrolCar.animateWindow(1);
		patrolCar.postFX.addShadow(0,1,0.03,2);
		
		this.backToMenuButton = new RowAnimatedSprite(this, this.cameras.main.width/2, 170, 'arrows', 0).setOrigin(0.5,0);
		this.backToMenuButton.setScale(1.1);
		this.backToMenuButton.play();
		this.backToMenuButton.setInteractive()
		this.backToMenuButton.on('pointerdown', () => {
			this.updateData();
			this.scene.start('MenuScene');
		});

		setDefaultButton(this, this.backToMenuButton);
	}
	
	updateData(){
		const isFirstGame = this.registry.get('isFirstGame');
		this.registry.set({ rankingLast: this.gameScore });
		if(this.isRecord || isFirstGame ){
			this.registry.set({ rankingBest: this.gameScore });
		}
		if(isFirstGame){
			this.registry.toggle('isFirstGame');
		}
	}
}
