import Menu from '../clases/menu.js';
import Libro from '../objetos/libro.js';
import Animacion from '../objetos/animacion.js';
import paginas from '../data/historia.js';
import { crearFondoEstatico } from "../utils/fondos.js";

export default class MenuScene extends Phaser.Scene {
	constructor() {
		super('MenuScene');
	}

	preload() {
		this.load.image('titulo', 'assets/imagenes/titulo.png');
		this.load.image('titulo_banda', 'assets/imagenes/titulo_banda.png');
		this.load.spritesheet('flechas','assets/imagenes/flechasluminosas.png',{frameWidth: 64,frameHeight: 32 });
		this.load.spritesheet('dotmenu', 'assets/imagenes/dotmenu.png', {frameWidth: 32, frameHeight:32});
		//this.load.image('dotayuda', 'assets/imagenes/dotayuda.png');
		
		this.load.image('carrito','assets/imagenes/historia/carrito.png');
		this.load.spritesheet('movil', 'assets/imagenes/historia/px_movil.png', {frameWidth:64, frameHeight:32});
		this.load.image('marcoAnimacion', 'assets/imagenes/historia/tarjeta3.png');

		this.load.image('marcoHistoria', 'assets/imagenes/historia/tarjeta2.png');
		
		this.load.audio('menu_snd', 'assets/sonidos/653382__krokulator__select.wav');
	}
	
	create() {
		const layer = crearFondoEstatico(this);
		layer.setScale(0.5);

		this.titulo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 4, 'titulo');		
		this.tituloBanda = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'titulo_banda');
		this.tituloBandaText = this.add.text(190,240,`Versión ${this.registry.get('version')}`, {color: "#000", fontSize:"9px", fontFamily: "monospace", align:'right'});
		this.tituloBandaText.setAlpha(0.5);

		this.menu = new Menu(this, 65, 300, 'dotmenu', {
			fontFamily: "monaco", color: "#000", fontSize:"38px"
		}, 10);

		this.menu.addItem("INICIAR JUEGO", ()=>{
			this.scene.start('MainScene');
		}, true);

		this.menu.addItem("Historia", ()=>{
			this.menu.disable();
			this.menu.setVisible(false);
			this.tituloBanda.setAlpha(0.5);
			this.tituloBandaText.setAlpha(0);
			
			const libro = new Libro(this, 10, 220, paginas,
			()=>{
				this.tituloTween.restart();
				this.tweens.add({
					targets: this.tituloBanda,
					alpha: 1,
					duration: 50,
					onComplete: ()=>{this.bandaTextTween.restart();}
				});
				this.menu.setVisible(true);
				this.menu.enable();
			});
			
		});

		// if !omitePresentacion para contemplar undefined
		if(this.registry.get('primeraPartida') && !this.registry.get('gameOptions').omitePresentacion){
			this.menu.disable(); // Evitar pulsaciones
			this.menu.setVisible(false);
			this.animacion = new Animacion(this, 10, 220, ()=>{
				this.menu.setVisible(true);
				this.menu.enable();
			});
		}
		
		this.botonAyuda = this.add.image(this.cameras.main.width-20, 460, 'dotayuda')
		this.botonAyuda.setVisible(false);
		
		const madeInTucuman = this.add.text(this.cameras.main.width/2,460,['Made in Tucumán'],{color:"#444", fontFamily:'monospace', fontSize:13, align:'right'});
		madeInTucuman.setOrigin(0.5);
		madeInTucuman.setAlpha(0.5);
		madeInTucuman.blendMode = Phaser.BlendModes.ADD;
		
		this.tituloTween = this.tweens.add({
			targets: this.titulo,
			yoyo: true,
			scale: 1.05,
			duration: 250,
			repeat: 2,
			persist: true
		})
		
		this.bandaTextTween = this.tweens.add({
			delay: 100,
			targets: this.tituloBandaText,
			alpha: 1,
			duration: 400,
			persist: true
		});
		
	}
}
