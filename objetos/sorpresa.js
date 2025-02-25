export default class Sorpresa extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene, 0, 0, 'sorpresa');
		this.scene = scene;
		this.scene.add.existing(this);
	}
	
	cargar(){
		let tipo = Phaser.Math.Between(0, 1);
		this.setFrame(tipo);
		;
	}
	
	mostrar(x, y){
		this.setVisible(true);
		this.setX(x); this.setY(y);
		let tween1x = x+30;
		let tween2x = x+150;
		let tweenchain = this.scene.tweens.chain({
			targets: this,
			tweens: [
				{
					y: {value: y-80, ease: 'sine.out'},
					//ToDo: Debe poder iniciar hacia la izqueirda o derecha
					x: {value: tween1x}, 
					
					duration: 700,
					//ToDo: Debe cambiar dirección si current<=0 también
					onUpdate(tween, target, key, current, previous){
						if(key==='x' && (current<=0 || current >= target.scene.scale.width)) {
							tween.updateTo(key, target.scene.scale.width-(tween1x-current), true);
						}
					}
				},
				{
					y: {value: y, ease:'bounce.out'},
					x: {value: tween2x},
					duration: 1900,
					onStart: ()=> {
						this.esRecolectable = true;
					},
					onUpdate(tween, target, key, current, previous){
						if(key==='x' && (current<=0 || current >= target.scene.scale.width)) {
							tween.updateTo(key, target.scene.scale.width-(tween2x-current), true);
						}
					}
				}
			],
			//onUpdate: ()=>{console.log("Update de chain");}
		});
	}
	
	recolectar(){
		this.setVisible(false);
		this.esRecolectable = false
	}
	
	desvanecerSorpresa(){
		
	}
}
