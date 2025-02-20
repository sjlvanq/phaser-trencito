import RowAnimatedSprite from '../clases/rowanimatedsprite.js';
import colores from '../data/paleta.js';

export default class Libro extends Phaser.GameObjects.Container {
	constructor(scene, x, y, paginas, handleComplete = ()=>{}) {
		super(scene, x, y);
		this.scene = scene;
		
		this.setAlpha(0);
		this.scene.add.existing(this);
		
		this.paginas = paginas;
		this.cursor = 0;
		this.handleComplete = handleComplete;
		
		this.fondo = this.scene.add.image(0,0,'marcoHistoria').setOrigin(0);
		this.texto = this.scene.add.text(35,25, this.paginas[this.cursor], { fontFamily: 'unkempt', fontSize: 18, color: colores.texto, align: 'justify'}); 
		this.add([this.fondo, this.texto]);
		
		this.siguiente = new RowAnimatedSprite(this.scene, 240, 130, 'flechas', 1);
		this.siguiente.setScale(0.8);
		this.siguiente.setInteractive();
		this.siguiente.on('pointerdown', ()=> {this.siguientePagina(500)});
		this.siguiente.play();
		this.add(this.siguiente);
		this.fadeIn();
	}
    siguientePagina(duration = 200) {
        if (this.cursor < this.paginas.length - 1) {
            this.siguiente.disableInteractive(); //Evita spam
            this.cursor++;
            this.texto.setAlpha(0);
            this.texto.setText(this.paginas[this.cursor]);
            this.scene.tweens.add({
				targets: this.texto,
				alpha: 1,
				duration: duration
			})
            this.scene.time.delayedCall(200, () => {
				this.siguiente.setInteractive();
			});
        } else {
			this.fadeOut(400,true);
		}
    }
	fadeIn(duration = 400) {
		this.setAlpha(0);
		this.scene.tweens.add({
			targets: this,
			alpha: 1,
			duration: duration,
		});
	}
	fadeOut(duration = 400, destroyAfter = false) {
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: duration,
			onComplete: ()=>{
				this.handleComplete();
				if (destroyAfter) {
					this.destroy();
				}
            },
		});
	}
}
