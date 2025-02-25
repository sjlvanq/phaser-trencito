import Menu from '../clases/menu.js';
import Libro from '../objetos/libro.js';
import Animacion from '../objetos/animacion.js';
import paginas from '../data/historia.js';
import createTilemap from '../tilemaps.js';

export default class MenuScene extends Phaser.Scene {
	constructor() {
		super('MenuScene');
	 }
	 init(data){
		this.data = data;
		this.gameOptions = data.gameOptions;
	 }
    create() {
		const layer = createTilemap(this);
		layer.setScale(0.5);

		this.titulo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 4, 'titulo');		
		this.tituloBanda = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'titulo_banda');
		this.tituloBandaText = this.add.text(190,240,"Versión ALPHA-0.2", {color: "#000", fontSize:"9px", fontFamily: "monospace", align:'right'});
		this.tituloBandaText.setAlpha(0.5);
		
		this.menu = new Menu(this, 65, 300, 'dotmenu', {
			fontFamily: "monaco", color: "#000", fontSize:"38px"
		});
		this.menu.addItem("INICIAR JUEGO", ()=>{
			this.scene.start('default', this.data);
		});
		this.menu.addItem("Historia", ()=>{
			this.menu.setVisible(false);
			this.botonAyuda.setVisible(false);
			
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
			});
			
		});

		// if !omitePresentacion para contemplar undefined
		if(this.data.primeraPartida && !this.gameOptions.omitePresentacion){
			this.menu.setVisible(false); // Evitar pulsaciones
			this.animacion = new Animacion(this, 10, 220, ()=>{
				this.menu.setVisible(true);
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
