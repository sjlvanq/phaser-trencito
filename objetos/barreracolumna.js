export default class BarreraColumna extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, onPointerDown, teclaAsociada) {
		super(scene, x, y, texture);
		this.scene = scene;
		this.scene.add.existing(this);
		this.minima = false;
		this.detuvoDisparo = false;
		this.on('pointerdown', () => {
			this.reparar(false, onPointerDown);
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
	
	reducir(recursive=false, onMinima=()=>{})
	{
		const frameBase = this.frame.name % 3;
		this.stop(); // Que animación no revierta el setFrame.
		if(frameBase<2){
			this.setFrame((this.frame.name + 1) % 3); // Reduce columna
			this.scene.tweens.add(this.tweenConfig)
			.once('complete', () => {
				if(recursive) this.reducir(true, onMinima);
			});
		} else {
			this.minima = true;
			onMinima();
		}
	}

	reparar(recursive=false, callback=()=>{})
	{
		const frameBase = this.frame.name % 3;
		if(frameBase>0){
			this.stop();
			this.setFrame(frameBase-1);
			callback();
			this.scene.tweens.add(this.tweenConfig)
			.once('complete', () => {
				if(recursive) this.reparar(true);
			});
			this.minima = false;
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
			
			this.reducir();
			if(restituible){this.glow();}
		}
	}
}
