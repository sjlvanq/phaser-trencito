export default class BarreraColumna extends Phaser.GameObjects.Sprite {
            constructor(scene, x, y, texture, onPointerDown) {
                super(scene, x, y, texture);
				this.scene = scene;
				this.scene.add.existing(this);
				this.onPointerDown = onPointerDown;
				
				// ¿ Lo mismo que en this.stop() ?
				/*
				this.on('animationcomplete',()=>{
					this.setFrame(this.frame.name % 3);
				});
				*/
				
				this.on('pointerdown', () => {
					const frameBase = this.frame.name % 3;
					if(frameBase>0){ 
						this.setFrame(frameBase-1);
						this.onPointerDown();
					}
				});
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
			
            update(miraX)
            {
				if(miraX > this.x - this.displayWidth/2 && 
					miraX < this.x + this.displayWidth/2 + 10 && // ToDo: ¿Qué es este +10?
					this.frame.name % 3 < 2) // Frame 3 ya no detiene balas
				{
					this.setFrame((this.frame.name + 1) % 3); // Reduce columna
					
					// Estas dos líneas no me convencen
					if(this.scene.gomas > 0){this.glow();} // Inicia animación en esta columna
					this.scene.balaParada = true;
				}
            }
        }
