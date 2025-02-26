export default class BarreraColumna extends Phaser.GameObjects.Sprite {
            constructor(scene, x, y, texture, onPointerDown) {
                super(scene, x, y, texture);
				this.scene = scene;
				this.scene.add.existing(this);
				this.on('pointerdown', () => {
					const frameBase = this.frame.name % 3;
					if(frameBase>0){ 
						this.setFrame(frameBase-1);
						onPointerDown();
					}
				});
				this.setOrigin(0.5, 1); // Para tween en update
			}
			stop() {
				super.stop();
				const frameBase = this.frame.name % 3;
				this.setFrame(frameBase);
			}
			glow()
			{
				const frameBase = this.frame.name % 3; // Determina si está en 0, 1 o 2
				if(frameBase>0){
					this.play(`glow_${frameBase}`);
					this.setInteractive();
					}
			}
			
            update(miraX, restituible)
            {
				if(miraX > this.x - this.displayWidth/2 && 
					miraX < this.x + this.displayWidth/2 &&
					this.frame.name % 3 < 2) // En Frame 3 ya no detiene balas
				{
					
					this.setFrame((this.frame.name + 1) % 3); // Reduce columna
					this.scene.tweens.add({
						targets: this,
						displayHeight: '+=2',
						displayWidth: '+=2',
						yoyo: true,
						ease: 'Power1.easeIn',
						duration: 100
					});
					if(restituible){this.glow();}
					this.scene.balaParada = true;
				}
            }
        }
