export default class SideThrower {
	constructor( scene, x, y, 
		objectTexture,
		minDistanceX, maxDistanceX,
		minDistanceY, maxDistanceY,
		interval, duration, lifetime, 
		objectScale, animationContainer){
		
		this.scene = scene;
		this.animationContainer = animationContainer;
		this.event = this.scene.time.addEvent({
			delay: interval,
			loop: true,
			callback: ()=>{
			const object = this.scene.add.image(x, y, objectTexture, 
				Phaser.Math.Between(0, this.scene.textures.get(objectTexture).frameTotal-2));
			object.setScale(objectScale);
			
			if (this.animationContainer) {
				this.animationContainer.add(object);
			}
			const finalX = x + Phaser.Math.Between(minDistanceX,maxDistanceX) * Phaser.Math.RND.sign();
			//console.log(xFinal);
			this.scene.tweens.add({
				targets: object,
				x: [x, finalX],
				y: [y, y-Phaser.Math.Between(minDistanceY,maxDistanceY), y],
				duration: duration,
				interpolation: 'bezier',
				onComplete: () => this.scene.time.delayedCall(lifetime, () => {object.destroy()})
				});
		}});
	}
	stop(){
		this.event.remove();
	}
}
