export default class GasLacrimogeno extends Phaser.GameObjects.Container
{
	constructor (scene, x, y)
	{
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);
		
		//Cambiar a imagen
		const proyectil = this.scene.add.rectangle(x, y, 5, 10, 0x000000);
		proyectil.setDepth(50);
		
		//let destX = x;
		let yInicial = y;
		let yFinal = 200;
		
		let tween = this.scene.tweens.add({
			targets: proyectil,
			props: {
                y: {
                    //value: this.scene.cameras.main.height + proyectil.height,
                    value: yFinal,
                    duration: 4000,
                    ease: 'Expo.easeIn'
                },
            },
            onUpdate: ()=>{
				let progreso = (proyectil.y - yInicial) / (yFinal - yInicial);
				//let efecto = Math.pow(1 - Math.cos(progreso * Math.PI), 2);
				//let efecto = Math.pow(progreso, 3);
				//let efecto = 1 - Math.sqrt(1 - progreso);
				let efecto = Math.pow(progreso, 0.5);
				//let efecto = Math.pow(Math.sin(progreso * Math.PI), 2);
				//let efecto = Math.pow(1 - Math.cos(progreso * Math.PI), 2);


				console.log("Update ",progreso, efecto);
				this.scene.add.circle(Phaser.Math.Between(proyectil.x-5,proyectil.x+5), proyectil.y, efecto*10, 0xdddddd).setAlpha(0.4);
			},
			onComplete: ()=>console.log("Complete")
		})
	}
}
		
