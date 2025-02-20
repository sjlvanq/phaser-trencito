import FullAnimatedSprite from '../clases/fullanimatedsprite.js';

export default class Camioneta extends Phaser.GameObjects.Container
        {
            constructor (scene, x, y, ventanillaTweenDelay=0)
            {
                super(scene, x, y);
                scene.add.existing(this);
                
                this.camionetaSprite = scene.add.sprite(0, 0, 'camioneta').setDepth(1);
				this.vidrios = [
					scene.add.rectangle(-42, -25, 50, 50, 0x3333bb),
					scene.add.rectangle(20, -25, 50, 50, 0x3333bb),
				];
				
				this.explosion = scene.add.sprite(-10,-15, 'explosion').setDepth(1);
				this.explosion.scale = 0.7;
				this.explosion.visible = false;
				this.isDisparando = false;
				this.buscandoObjetivo = false;
				
				//this.cabeza = scene.add.sprite(20, -48, 'cabeza', Phaser.Math.Between(0,1));
				//this.cabeza.setScale(0.1); //Cabezas pixeladas
				this.cabeza = scene.add.sprite(20, -48, 'cabeza');
				this.cabeza.setScale(1.15);
				this.cabeza.setDepth(1);
				this.cabeza.visible = false;
				
				this.rueda = [
					new FullAnimatedSprite(scene, -143, 47, 'rueda', 25).setScale(1.1),
					new FullAnimatedSprite(scene, 100, 47, 'rueda', 25).setScale(1.1)
				];
				this.rueda[0].play();
				this.rueda[1].play();


				this.add([...this.vidrios, this.camionetaSprite, this.rueda[0], this.rueda[1], this.cabeza, this.explosion]);
				
				this.velocidad = 80; 
				this.enLaMira = false;
				this.miraX = 0;
				
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
						this.cabeza.visible = true;

						this.cabezaTween = scene.tweens.add({
							targets: this.cabeza,
							scale: '+=0.45',
							//scale: 0.8, //Cabezas pixeladas
							y: '-=10',
							duration: 300,
							yoyo: true,
							onYoyo: () => {
								this.cabezaTween.pause();
								this.buscandoObjetivo = true;
								scene.time.delayedCall(1000, () => {
									//console.log("scene.time.delayedCall");
									this.explosion.visible = false;
									this.isDisparando = false;
									this.buscandoObjetivo = false;
									this.cabezaTween.resume();
								});
							},
							onComplete: () => {
								//console.log("onComplete");
								this.cabeza.visible = false;
								this.ventanillaTween.resume();
							},
						});
					},
				});
			}
			
            update (time, delta, playerX)
            {
				const deltaSeconds = delta / 1000;
				const playerWidth = this.scene.jugador.displayWidth 

				this.x -= this.velocidad * deltaSeconds;
				
				this.miraX = this.x;
				
				if(this.miraX > playerX - playerWidth / 2 && this.miraX < playerX + playerWidth / 2) {
					this.enLaMira = true;
					if(this.buscandoObjetivo){
						this.explosion.visible = true;
						this.isDisparando = true;
						this.buscandoObjetivo = false;
					}
				} else {
					this.enLaMira = false;	
				}
				
				if (this.x < -180) { 
					this.x = 420; 
				}
            }
        }
