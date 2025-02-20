 
//Galera de mago
//Argumentos: 
//... escena
//... xinicial, yinicial, textura_galera, textura_objetos 
//... (rango) distancia_en_x_mínima, distancia_en_x_máxima
//... (rango) distancia_en_y_mínima, distancia_en_y_máxima 
//... tiempo_entre_objetos, duración_ensuelo
//... 

//Bucle
//- Coge textura aleatoriamente
//- Crea sprite y anima
//- Pasado duracion_ensuelo elimina el sprite

export default class Galera {
	constructor( escena, x, y, 
		texturaGalera, texturaObjetos,
		distanciaXMin, distanciaXMax,
		distanciaYMin, distanciaYMax,
		intervalo, duracion, vida){
		
		this.escena = escena;
		this.galera = this.escena.add.image(x, y, texturaGalera).setDepth(2);
		setInterval(()=>{
			const objeto = this.escena.add.sprite(x, y, texturaObjetos, 
				Phaser.Math.Between(0, this.escena.textures.get(texturaObjetos).frameTotal-2));
			//Cómo hacer random negativo o positivo
			this.escena.tweens.add({
				targets: objeto,
				x: { values: [x, Phaser.Math.Between(distanciaXMin,distanciaXMax), distanciaXMax] },
				y: { values: [y, Phaser.Math.Between(distanciaYMin,distanciaYMax), distanciaYMax] },
				duration: duracion,
				repeat: 0
				});
		},intervalo);
	}
}
