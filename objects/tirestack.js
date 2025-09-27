export default class TireStack extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, onPointerDown, teclaAsociada) {
		super(scene, x, y, texture);
		this.scene = scene;
		this.scene.add.existing(this);
		this.atMinimum = false;
		this.blockedShot = false;
		this.on('pointerdown', () => {
			this.repair(false, onPointerDown);
		});

		this.scene.input.keyboard?.on(`keydown-${teclaAsociada}`, () => {
			// this.emit salta estado de interactividad 
			if (this.input?.enabled){ 
				this.emit('pointerdown');
			}
		});

		this.setOrigin(0.5, 1); // Para tween en update
		
		this.tweenConfig = {
			targets: this,
			displayHeight: '+=2',
			displayWidth: '+=2',
			yoyo: true,
			ease: 'Power1.easeIn',
			duration: 100
		};
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
	
	reduce(recursive=false, atMinimum=()=>{})
	{
		const frameBase = this.frame.name % 3;
		this.stop(); // Que animación no revierta el setFrame.
		if(frameBase<2){
			this.setFrame((this.frame.name + 1) % 3); // Reduce columna
			this.scene.tweens.add(this.tweenConfig)
			.once('complete', () => {
				if(recursive) this.reduce(true, atMinimum);
			});
		} else {
			this.atMinimum = true;
			atMinimum();
		}
	}

	repair(recursive=false, callback=()=>{})
	{
		const frameBase = this.frame.name % 3;
		if(frameBase>0){
			this.stop();
			this.setFrame(frameBase-1);
			callback();
			this.scene.tweens.add(this.tweenConfig)
			.once('complete', () => {
				if(recursive) this.repair(true);
			});
			this.atMinimum = false;
		}
	}

	update(miraX, isRestorable)
	{
		this.blockedShot = false;
		if(miraX > this.x - this.displayWidth/2 && 
			miraX < this.x + this.displayWidth/2 &&
			this.frame.name % 3 < 2) // En Frame 3 ya no detiene balas
		{
			this.blockedShot = true;
			
			this.reduce();
			if(isRestorable){this.glow();}
		}
	}
}
