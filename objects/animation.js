import RowAnimatedSprite from '../classes/rowanimatedsprite.js';
import AnimationScene from './animationscene.js';
import colores from '../data/palette.js';

export default class Animation extends Phaser.GameObjects.Container {
	constructor(scene, x, y, onFin) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);
		
		this.fondo = this.scene.add.image(0,0,'history_frame').setOrigin(0);
		this.fondo.setAlpha(1);
		this.add([this.fondo]);
		const bounds = this.getBounds();
		this.animation = new AnimationScene(this.scene, 5, 25, bounds, ()=>{
			this.scene.tweens.add({
				targets: [this.animation.layer, this],
				alpha: 0,
				duration: 250,
				onComplete: ()=> {onFin();this.destroy();}
			});
		});
		this.add(this.animation);
	}
}

