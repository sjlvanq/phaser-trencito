import RowAnimatedSprite from '../clases/rowanimatedsprite.js';
import AnimacionEscena from '../objetos/animacion_escena.js';
import colores from '../data/paleta.js';

export default class Animacion extends Phaser.GameObjects.Container {
	constructor(scene, x, y, onFin) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);
		
		this.fondo = this.scene.add.image(0,0,'marcoHistoria').setOrigin(0);
		this.fondo.setAlpha(1);
		this.add([this.fondo]);
		const bounds = this.getBounds();
		this.animacion = new AnimacionEscena(this.scene, 5, 25, bounds, ()=>{
			this.scene.tweens.add({
				targets: [this.animacion.layer, this],
				alpha: 0,
				duration: 250,
				onComplete: ()=> {onFin();this.destroy();}
			});
		});
		this.add(this.animacion);
	}
}

