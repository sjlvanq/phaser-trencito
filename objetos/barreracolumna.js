export default class BarreraColumna extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, onPointerDown) {
		super(scene, x, y, texture);
		this.scene = scene;
		this.scene.add.existing(this);
		this.esMinima = false;
		this.on('pointerdown', () => {
			this.reparar(false, onPointerDown);
		});
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
	
	reparar(recursive=false, callback=()=>{})
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
		this.esMinima = false;
	}

	decrecer(recursive=false)
	{
		const frameBase = this.frame.name % 3;
		if(frameBase<2){
			this.stop();
			this.setFrame(frameBase+1);
			this.scene.tweens.add({
				targets: this,
				displayHeight: '+=2',
				displayWidth: '+=2',
				yoyo: true,
				ease: 'Power1.easeIn',
				duration: 100,
				onComplete: ()=>{
					if(recursive){
						this.decrecer(true);
					}
				}
			});
		} else {
			this.esMinima = true;
		}
		/*
		this.setFrame((this.frame.name + 1) % 3);
		this.scene.tweens.add({
			targets: this,
			displayHeight: '+=2',
			displayWidth: '+=2',
			yoyo: true,
			ease: 'Power1.easeIn',
			duration: 100
		});
		this.esMinima = true;
		*/
	}

	update(miraX, restituible)
	{
		if(miraX > this.x - this.displayWidth/2 && 
			miraX < this.x + this.displayWidth/2 &&
			this.frame.name % 3 < 2) // En Frame 3 ya no detiene balas
		{
			
			this.decrecer();
			if(restituible){this.glow();}
			this.scene.balaParada = true;
		}
	}
}
