import Menu from '../classes/menu.js';
import Book from '../objects/book.js';
import Animation from '../objects/animation.js';
import pages from '../data/history.js';
import { createStaticBackground } from "../utils/backgrounds.js";

export default class MenuScene extends Phaser.Scene {
	constructor() {
		super('MenuScene');
	}

	preload() {
		this.load.image('title', 'assets/images/title.png');
		this.load.image('title_separator', 'assets/images/titleseparator.png');
		this.load.spritesheet('arrows','assets/images/arrows.png',{frameWidth: 64,frameHeight: 32 });
		this.load.spritesheet('dotmenu', 'assets/images/dotmenu.png', {frameWidth: 32, frameHeight:32});
		//this.load.image('dothelp', 'assets/images/dothelp.png');
		
		this.load.image('carrito','assets/images/history/carrito.png');
		this.load.spritesheet('movil', 'assets/images/history/px_movil.png', {frameWidth:64, frameHeight:32});
		this.load.image('animation_frame', 'assets/images/history/animationframe.png');

		this.load.image('history_frame', 'assets/images/history/historyframe.png');
		
		this.load.audio('menu_snd', 'assets/sounds/653382__krokulator__select.wav');
	}
	
	create() {
		const layer = createStaticBackground(this);

		this.title = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 4, 'title');		
		this.titleSeparator = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'title_separator');
		this.titleSeparatorText = this.add.text(190,240,`Versión ${this.registry.get('version')}`, {color: "#000", fontSize:"9px", fontFamily: "monospace", align:'right'});
		this.titleSeparatorText.setAlpha(0.5);

		this.menu = new Menu(this, 65, 300, 'dotmenu', {
			fontFamily: "monaco", color: "#000", fontSize:"38px"
		}, 10);

		this.menu.addItem("INICIAR JUEGO", ()=>{
			this.scene.start('MainScene');
		}, true);

		this.menu.addItem("Historia", ()=>{
			this.menu.disable();
			this.menu.setVisible(false);
			this.titleSeparator.setAlpha(0.5);
			this.titleSeparatorText.setAlpha(0);
			
			const libro = new Book(this, 10, 220, pages,
			()=>{
				this.titleTween.restart();
				this.tweens.add({
					targets: this.titleSeparator,
					alpha: 1,
					duration: 50,
					onComplete: ()=>{this.titleSeparatorTween.restart();}
				});
				this.menu.setVisible(true);
				this.menu.enable();
			});
			
		});

		// if !skipIntro para contemplar undefined
		if(this.registry.get('isFirstGame') && !this.registry.get('gameOptions').skipIntro){
			this.menu.disable(); // Evitar pulsaciones
			this.menu.setVisible(false);
			this.animation = new Animation(this, 10, 220, ()=>{
				this.menu.setVisible(true);
				this.menu.enable();
			});
		}
		
		//this.buttonHelp = this.add.image(this.cameras.main.width-20, 460, 'dothelp')
		//this.buttonHelp.setVisible(false);
		
		const madeInTucuman = this.add.text(this.cameras.main.width/2,460,['Made in Tucumán'],{color:"#444", fontFamily:'monospace', fontSize:13, align:'right'});
		madeInTucuman.setOrigin(0.5);
		madeInTucuman.setAlpha(0.5);
		madeInTucuman.blendMode = Phaser.BlendModes.ADD;
		
		this.titleTween = this.tweens.add({
			targets: this.title,
			yoyo: true,
			scale: 1.05,
			duration: 250,
			repeat: 2,
			persist: true
		})
		
		this.titleSeparatorTween = this.tweens.add({
			delay: 100,
			targets: this.titleSeparatorText,
			alpha: 1,
			duration: 400,
			persist: true
		});
		
	}
}
