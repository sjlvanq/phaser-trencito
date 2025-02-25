export default class Galera {
	constructor( escena, x, y, 
		texturaObjetos,
		distanciaXMin, distanciaXMax,
		distanciaYMin, distanciaYMax,
		intervalo, duracion, vida, 
		objetoScale, contenedorAnimacion){
		
		this.escena = escena;
		this.contenedorAnimacion = contenedorAnimacion;
		this.evento = this.escena.time.addEvent({
			delay: intervalo,
			loop: true,
			callback: ()=>{
			const objeto = this.escena.add.image(x, y, texturaObjetos, 
				Phaser.Math.Between(0, this.escena.textures.get(texturaObjetos).frameTotal-2));
			objeto.setScale(objetoScale);
			
			if (this.contenedorAnimacion) {
				this.contenedorAnimacion.add(objeto);
			}
			const xFinal = x + Phaser.Math.Between(distanciaXMin,distanciaXMax) * Phaser.Math.RND.sign();
			//console.log(xFinal);
			this.escena.tweens.add({
				targets: objeto,
				x: [x, xFinal],
				y: [y, y-Phaser.Math.Between(distanciaYMin,distanciaYMax), y],
				duration: duracion,
				interpolation: 'bezier',
				onComplete: () => this.escena.time.delayedCall(vida, () => {objeto.destroy()})
				});
		}});
	}
	detener(){
		this.evento.remove();
	}
}
