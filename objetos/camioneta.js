import FullAnimatedSprite from '../clases/fullanimatedsprite.js';

export default class Camioneta extends Phaser.GameObjects.Container
        {
            constructor (scene, x, y, ventanillaTweenDelay=0)
            {
                super(scene, x, y);
                scene.add.existing(this);
                
                this.isDisparando = false;
                this.buscandoObjetivo = false;
                this.velocidad = 80; 
                
                this.camionetaSprite = scene.add.sprite(0, 0, 'camioneta').setDepth(1);
				this.vidrios = [
					scene.add.rectangle(-42, -25, 50, 50, 0x3333bb),
					scene.add.rectangle(20, -25, 50, 50, 0x3333bb),
				];
				
				this.explosion = scene.add.sprite(-10,-15, 'explosion').setDepth(1);
				this.explosion.setScale(0.7);
				this.explosion.setVisible(false);
				
				this.cabeza = scene.add.sprite(20, -48, 'cabeza');
				this.cabeza.setScale(1.15);
				this.cabeza.setDepth(1);
				this.cabeza.setVisible(false);
				
				this.rueda = [
					new FullAnimatedSprite(scene, -143, 47, 'rueda', 25).setScale(1.1),
					new FullAnimatedSprite(scene, 100, 47, 'rueda', 25).setScale(1.1)
				];
				this.rueda[0].play();
				this.rueda[1].play();


				this.add([...this.vidrios, this.camionetaSprite, this.rueda[0], this.rueda[1], this.cabeza, this.explosion]);
								
				this.camionetaTween = scene.tweens.add({
					targets: this.camionetaSprite,
					rotation: 0.01,
					duration: 200,
					yoyo: true,
					repeat: -1,
				});
				
				this.ventanillaTweenDelay = ventanillaTweenDelay;
				this.ventanillaTween = scene.tweens.add({
					targets: this.vidrios[1],
					delay: this.ventanillaTweenDelay,
					y: '+=30',
					duration: 1500,
					repeat: -1,
					yoyo: true,
					ease: 'Expo.in',
					onYoyo: () => {
						this.ventanillaTween.pause();
						this.cabeza.setVisible(true);

						this.cabezaTween = scene.tweens.add({
							targets: this.cabeza,
							scale: '+=0.45',
							y: '-=10',
							duration: 300,
							yoyo: true,
							onYoyo: () => {
								this.cabezaTween.pause();
								this.buscandoObjetivo = true;
								scene.time.delayedCall(1000, () => {
									this.explosion.setVisible(false);
									this.isDisparando = false;
									this.buscandoObjetivo = false;
									this.cabezaTween.resume();
								});
							},
							onComplete: () => {
								this.cabeza.setVisible(false);
								this.ventanillaTween.resume();
							},
						});
					},
				});
				this.setScale(0.31);
				this.width = this.getBounds().width;
			}
			
            update (time, delta, playerX)
            {
				const deltaSeconds = delta / 1000;
				const playerWidth = this.scene.jugador.displayWidth 

				this.x -= this.velocidad * deltaSeconds;
				
				if(this.x > playerX - playerWidth / 2 && this.x < playerX + playerWidth / 2) {
					if(this.buscandoObjetivo){
						this.explosion.setVisible(true);
						this.isDisparando = true;
						this.buscandoObjetivo = false;
					}
				}
				
				//Ancho de camioneta escalada: 123
				//Ancho de celda en grid: 200
				//Propiedad originX: 0.5
				// (200 - 123) / 2 = 38.5
				
				if (this.x < this.width * -1) {
					this.x = this.scene.cameras.main.width + this.width + 38.5;
				}				
            }
        }
