import RowAnimatedSprite from '../clases/rowanimatedsprite.js';
import colores from '../data/paleta.js';

export default class Libro extends Phaser.GameObjects.Container 
{	
	static TEXTO = {
		X: 35, 
		Y: 25,
		FADEIN: 500,
	};
	static SIGUIENTE = {
		X: 240, 
		Y: 130, 
		ESCALA: 0.8,
		FRAMERATE: 1,
		SETINTERACTIVE_DELAY: 200
	};
	static FADEIN = 400;
	static FADEOUT = 400;
	
	constructor(scene, x, y, paginas, handleComplete = ()=>{}) {
		super(scene, x, y);
		this.scene = scene;
		
		this.setAlpha(0);
		this.scene.add.existing(this);
		
		this.paginas = paginas;
		this.cursor = 0;
		this.handleComplete = handleComplete;
		
		this.fondo = this.scene.add.image(0,0,'marcoHistoria').setOrigin(0);
		this.texto = this.scene.add.text(Libro.TEXTO.X, Libro.TEXTO.Y, this.paginas[this.cursor], { fontFamily: 'unkempt', fontSize: 18, color: colores.texto, align: 'justify'}); 
		this.add([this.fondo, this.texto]);
		
		this.siguiente = new RowAnimatedSprite(this.scene, Libro.SIGUIENTE.X, Libro.SIGUIENTE.Y, 'flechas', Libro.SIGUIENTE.FRAMERATE);
		this.siguiente.setScale(Libro.SIGUIENTE.ESCALA);
		this.siguiente.setInteractive();
		this.siguiente.on('pointerdown', ()=> {this.siguientePagina()});

		this.scene.input.keyboard?.on('keydown', (event) => {
			if(event.code === 'ArrowRight' || event.code === 'Space'){
				if (this.siguiente.input?.enabled){
					this.siguiente.emit('pointerdown');
				}
			}
		});

		this.siguiente.play();
		this.add(this.siguiente);
		this.fadeIn();
	}
	siguientePagina() {
		if (this.cursor < this.paginas.length - 1) {
			this.siguiente.disableInteractive(); //Evita spam
			this.cursor++;
			this.texto.setAlpha(0);
			this.texto.setText(this.paginas[this.cursor]);
			this.scene.tweens.add({
				targets: this.texto,
				alpha: 1,
				duration: Libro.TEXTO.FADEIN
			})
			this.scene.time.delayedCall(Libro.SIGUIENTE.SETINTERACTIVE_DELAY, () => {
				this.siguiente.setInteractive();
			});
		} else {
			this.fadeOut(true);
		}
	}
	fadeIn() {
		this.setAlpha(0);
		this.scene.tweens.add({
			targets: this,
			alpha: 1,
			duration: Libro.FADEIN,
		});
	}
	fadeOut(destroyAfter = false) {
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: Libro.FADEOUT,
			onComplete: ()=>{
				this.handleComplete();
				if (destroyAfter) {
					this.destroy();
				}
			},
		});
	}
}
