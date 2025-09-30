import FullAnimatedSprite from '../classes/fullanimatedsprite.js';
import SideThrower from '../classes/sidethrower.js';
import Player from './player.js';
import {createBackground} from '../utils/backgrounds.js';

export default class AnimationScene extends Phaser.GameObjects.Container {
	constructor(scene, offsetX, offsetY, frameBounds, onFin) {
		super(scene, offsetX, offsetY);
		this.scene = scene;
		
		this.isShooting = false;
		
		// Máscara para margen izquierdo
		const maskRect = this.scene.make.graphics();
		maskRect.fillStyle(0xffffff);
		maskRect.fillRect(
			frameBounds.x + frameBounds.width - offsetX,
			frameBounds.y + offsetY,
			this.scene.cameras.main.width - frameBounds.x + frameBounds.width - offsetX, 
			frameBounds.height - offsetY * 2
		);
		const mask = maskRect.createGeometryMask();
		mask.invertAlpha = true;
		const maskX1 = frameBounds.x + frameBounds.width - offsetX*2;
		
		this.layer = createBackground(this.scene, frameBounds.x + offsetX, frameBounds.y + offsetY, 'introduction');
		this.layer.setScale(0.6);
		this.layer.setMask(mask);
		
		this.add(this.layer);

		const carrito = this.scene.add.image(255, 75, 'carrito').setDepth(2);
		carrito.setScale(0.8);
			
		const pj = new Player(this.scene, 280, 70, 'player');
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
		this.shots = [];
		for (let i = 0; i < 5; i++) {
			const patrolCar = new FullAnimatedSprite(this.scene, 0, 0, 'movil');
			this.pxcamionetas.add(patrolCar);
			this.add(patrolCar);
			patrolCar.setScale(0.9);
			patrolCar.setOrigin(0,0.5);
			patrolCar.x = 500;
			patrolCar.play();

			this.scene.tweens.add({
				targets: patrolCar,
				x: '-=315',
				duration: 4000,
				onUpdate: ()=>{
					if(patrolCar.x + patrolCar.displayWidth > maskX1 &&
						patrolCar.x < this.scene.cameras.main.width){
									patrolCar.setMask(mask);
								} else {
									patrolCar.clearMask();
								}
				},
				onComplete: ()=>{
					const gunFlash = this.scene.add.image(patrolCar.x+patrolCar.displayWidth/2, patrolCar.y, 'gunFlash').setScale(0.2).setOrigin(0.7,0.5);
					this.add(gunFlash);
					
					//Disparos
					this.scene.tweens.add({
						targets: gunFlash,
						delay: 300 * (i % 2) + 150 * i,
						duration: 0,
						alpha: 0,
						yoyo: true,
						hold: 300,
						repeat: -1,
						repeatDelay: 300,
						onStart: ()=>{
							if(!this.isShooting){

								this.isShooting=true;

								//Personaje huye
								this.scene.tweens.add({
									targets:pj,
									delay: 700,
									x:350,
									duration:2000,
									onActive: ()=>{pj.stop();},
									onStart: ()=>{pj.play('walk'); pj.setFlipX(false);},
									onUpdate: ()=>{
										if(pj.x + pj.displayWidth > maskX1){pj.setMask(mask)}
									},
									onComplete: ()=>{
										pj.destroy();
											this.scene.time.delayedCall(5000, () => {
												onFin();
											});
									},
								});
								
								//Saltan botellas
								new SideThrower(this.scene, carrito.x, carrito.y, 
									'bottle', 50, 100, 40, 80, 900, 1000, 1000, 0.4, this);
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
