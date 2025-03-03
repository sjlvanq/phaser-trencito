import FullAnimatedSprite from '../clases/fullanimatedsprite.js';
import Galera from '../clases/galera.js';
import Jugador from '../objetos/jugador.js';
import {createAnimacionTilemap} from '../tilemaps.js';

export default class AnimacionEscena extends Phaser.GameObjects.Container {
	constructor(scene, offsetX, offsetY, marcoBounds, onFin) {
		super(scene, offsetX, offsetY);
		this.scene = scene;
		
		this.disparando = false;
		
		// Máscara para margen izquierdo
		const mascaraRect = this.scene.make.graphics();
		mascaraRect.fillStyle(0xffffff);
		mascaraRect.fillRect(
			marcoBounds.x + marcoBounds.width - offsetX,
			marcoBounds.y + offsetY,
			this.scene.cameras.main.width - marcoBounds.x + marcoBounds.width - offsetX, 
			marcoBounds.height - offsetY * 2
		);
		const mascara = mascaraRect.createGeometryMask();
		mascara.invertAlpha = true;
		const mascaraX1 = marcoBounds.x + marcoBounds.width - offsetX*2;
		
		this.layer = createAnimacionTilemap(this.scene, marcoBounds.x + offsetX, marcoBounds.y + offsetY);
		this.layer.setScale(0.3);
		this.layer.setMask(mascara);
		
		this.add(this.layer);
				
		const carrito = this.scene.add.image(255, 75, 'carrito').setDepth(2);
		carrito.setScale(0.8);
			
		const pj = new Jugador(this.scene, 280, 70, 'jugador');
		pj.setFlipX(true);
		pj.setScale(0.7);
		
		this.add([carrito, pj]);
		
		// Personaje y carrito a centro de escena
		this.scene.tweens.add({
			targets: [pj, carrito],
			x: "-=100",
			duration: 3000,
			onStart: ()=>{pj.play('walk');},
			onComplete: ()=>{pj.stop();}
		});
		
		this.pxcamionetas = this.scene.add.group();
		this.disparos = [];
		for (let i = 0; i < 5; i++) {
			const camioneta = new FullAnimatedSprite(this.scene, 0, 0, 'movil');
			this.pxcamionetas.add(camioneta);
			this.add(camioneta);
			camioneta.setScale(0.9);
			camioneta.setOrigin(0,0.5);
			camioneta.x = 500;
			camioneta.play();

			this.scene.tweens.add({
				targets: camioneta,
				x: '-=315',
				duration: 4000,
				onUpdate: ()=>{
					if(camioneta.x + camioneta.displayWidth > mascaraX1 &&
						camioneta.x < this.scene.cameras.main.width){
									camioneta.setMask(mascara);
								} else {
									camioneta.clearMask();
								}
				},
				onComplete: ()=>{
					const disparo = this.scene.add.image(camioneta.x+camioneta.displayWidth/2, camioneta.y, 'explosion').setScale(0.2).setOrigin(0.7,0.5);
					this.add(disparo);
					
					//Disparos
					this.scene.tweens.add({
						targets: disparo,
						delay: 300 * (i % 2) + 150 * i,
						duration: 0,
						alpha: 0,
						yoyo: true,
						hold: 300,
						repeat: -1,
						repeatDelay: 300,
						onStart: ()=>{
							if(!this.disparando){

								this.disparando=true;

								//Personaje huye
								this.scene.tweens.add({
									targets:pj,
									delay: 700,
									x:350,
									duration:2000,
									onActive: ()=>{pj.stop();},
									onStart: ()=>{pj.play('walk'); pj.setFlipX(false);},
									onUpdate: ()=>{
										if(pj.x + pj.displayWidth > mascaraX1){pj.setMask(mascara)}
									},
									onComplete: ()=>{
										pj.destroy();
											this.scene.time.delayedCall(5000, () => {
												onFin();
											});
									},
								});
								
								//Saltan botellas
								new Galera(this.scene, carrito.x, carrito.y, 
									'botella', 50, 100, 40, 80, 900, 1000, 1000, 0.4, this);
							}
						},
						});
				}
				});
			}
		Phaser.Actions.GridAlign(this.pxcamionetas.getChildren(), {
			width: 5, cellWidth: 80, y: 20, x: 320,
		});
	}
	update(){
	}
}
