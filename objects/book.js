import RowAnimatedSprite from '../classes/rowanimatedsprite.js';
import colors from '../data/palette.js';

export default class Book extends Phaser.GameObjects.Container 
{	
	static TEXT = {
		X: 35, 
		Y: 25,
		FADEIN: 500,
	};
	static NEXT = {
		X: 240, 
		Y: 130, 
		SCALE: 0.8,
		FRAMERATE: 1,
		SETINTERACTIVE_DELAY: 200
	};
	static FADEIN = 400;
	static FADEOUT = 400;
	
	constructor(scene, x, y, pages, handleComplete = ()=>{}) {
		super(scene, x, y);
		this.scene = scene;
		
		this.setAlpha(0);
		this.scene.add.existing(this);
		
		this.pages = pages;
		this.cursor = 0;
		this.handleComplete = handleComplete;
		
		this.background = this.scene.add.image(0,0,'history_frame').setOrigin(0);
		this.text = this.scene.add.text(Book.TEXT.X, Book.TEXT.Y, this.pages[this.cursor], { fontFamily: 'unkempt', fontSize: 18, color: colors.texto, align: 'justify'}); 
		this.add([this.background, this.text]);
		
		this.arrow = new RowAnimatedSprite(this.scene, Book.NEXT.X, Book.NEXT.Y, 'arrows', Book.NEXT.FRAMERATE);
		this.arrow.setScale(Book.NEXT.SCALE);
		this.arrow.setInteractive();
		this.arrow.on('pointerdown', ()=> {this.nextPage()});

		this.scene.input.keyboard?.on('keydown', (event) => {
			if(event.code === 'ArrowRight' || event.code === 'Space'){
				if (this.arrow.input?.enabled){
					this.arrow.emit('pointerdown');
				}
			}
		});

		this.arrow.play();
		this.add(this.arrow);
		this.fadeIn();
	}
	nextPage() {
		if (this.cursor < this.pages.length - 1) {
			this.arrow.disableInteractive(); //Evita spam
			this.cursor++;
			this.text.setAlpha(0);
			this.text.setText(this.pages[this.cursor]);
			this.scene.tweens.add({
				targets: this.text,
				alpha: 1,
				duration: Book.TEXT.FADEIN
			})
			this.scene.time.delayedCall(Book.NEXT.SETINTERACTIVE_DELAY, () => {
				this.arrow.setInteractive();
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
			duration: Book.FADEIN,
		});
	}
	fadeOut(destroyAfter = false) {
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: Book.FADEOUT,
			onComplete: ()=>{
				this.handleComplete();
				if (destroyAfter) {
					this.destroy();
				}
			},
		});
	}
}
