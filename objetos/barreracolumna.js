export default class BarreraColumna extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, onPointerDown, teclaAsociada=false) {
		super(scene, x, y, texture);
		this.scene = scene;
		this.scene.add.existing(this);
		this.detuvoDisparo = false;
		this.on('pointerdown', () => {
			this.reparar(false, onPointerDown);
		});
		if(teclaAsociada){
			this.scene.input.keyboard.on(`keydown-${teclaAsociada}`, () => {
				// this.emit salta estado de interactividad 
				if (this.input?.enabled){ 
					this.emit('pointerdown');
				}
			});
		}
		this.setOrigin(0.5, 1); // Para tween en update
	}
	
	stop() {
		super.stop();
		const frameBase = this.frame.name % 3;
		this.setFrame(frameBase);
		this.disableInteractive();
	}
	
	glow() 
	{
		const frameBase = this.frame.name % 3; // Determina si está en 0, 1 o 2
		if(frameBase>0){
			this.play(`glow_${frameBase}`);
			this.setInteractive();
		}
	}
	
	reparar(recursive, callback=()=>{})
	{
		const frameBase = this.frame.name % 3;
		if(frameBase>0){
			this.stop();
			this.setFrame(frameBase-1);
			callback();
			
			if(recursive){
				this.scene.tweens.add({
					targets: this,
					displayHeight: '+=2',
					displayWidth: '+=2',
					yoyo: true,
					ease: 'Power1.easeIn',
					duration: 100,
					onComplete: ()=>{
						this.reparar(true);
					}
				});
			}
		}
	}
	
	update(miraX, restituible)
	{
		this.detuvoDisparo = false;
		if(miraX > this.x - this.displayWidth/2 && 
			miraX < this.x + this.displayWidth/2 &&
			this.frame.name % 3 < 2) // En Frame 3 ya no detiene balas
		{
			this.detuvoDisparo = true;
			this.setFrame((this.frame.name + 1) % 3); // Reduce columna
			this.scene.tweens.add({
				targets: this,
				displayHeight: '+=2',
				displayWidth: '+=2',
				yoyo: true,
				ease: 'Power1.easeIn',
				duration: 100
			});
			if(restituible){this.glow();}
		}
	}
}
