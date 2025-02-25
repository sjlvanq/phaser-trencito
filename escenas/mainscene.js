// Clases genéricas
import FullAnimatedSprite from '../clases/fullanimatedsprite.js';

// Clases específicas
import Jugador 		from '../objetos/jugador.js';
import Controles 	from '../objetos/controles.js';
import StatusBar	from '../objetos/statusbar.js';
import Camioneta 	from '../objetos/camioneta.js';
import Barrera 		from '../objetos/barrera.js';
import Botella 		from '../objetos/botella.js';

// Helpers
import createTilemap from '../tilemaps.js';

export default class MainScene extends Phaser.Scene {
    preload() {
	
    }
    init(data){
		this.data = data;
		this.gameOptions = data.gameOptions;
		this.ranking = data.ranking;
	}
    create() {
		const layer = createTilemap(this);
		layer.y -= 16;
		layer.setScale(0.5);
		
		this.nivel = 1;
		this.puntaje = 0;
		this.vidas = this.gameOptions.vidas?this.gameOptions.vidas:1;
		this.restituible = false;
		
		this.statusBar = new StatusBar(this, this.nivel, this.puntaje, this.vidas);
		this.statusBar.setAlpha(0.5);
		this.add.tween({
			targets: this.statusBar,
			alpha: 1,
			duration: 300
		});
		
		this.nivelTexto = this.add.text(this.cameras.main.width / 2,this.cameras.main.height / 3, "Nivel "+this.nivel, {color: "#fff",fontSize: "50px", fontFamily: "monaco", strokeThickness: 1})
			.setOrigin(0.5,0.5)
			.setScale(0.1)
			.setAlpha(0)
			.setDepth(10);
		
		this.botella = new Botella(this,330,'botella');
		this.botella.setScale(0.55);
		this.botella.setDepth(1);
		
		this.balaParada = false;
		
		this.barrera = new Barrera(this, 0, 260, 4, this.gameOptions.shadows);
		this.camionetas = this.add.group();
        for (let i = 0; i < 6; i++) {
            const camioneta = new Camioneta(this, 0, 0, i*2800);
            camioneta.scale = 0.31;
            if(this.gameOptions.shadows){
				camioneta.postFX.addShadow(0,1,0.03,2);
            }
            this.camionetas.add(camioneta);
        }
        this.camionetas.shuffle();
        console.log(this.ordenDisparos);
        Phaser.Actions.GridAlign(this.camionetas.getChildren(), {
            width: 3,
            cellWidth: 200,
            cellHeight: 80,
            x: 100,
            y: 130
        });
        // Desplazar y aumentar la velocidad en la segunda fila
        const camionetas = this.camionetas.getChildren();
        camionetas.forEach((camioneta, index) => {
            if (index >= 3) { 
                camioneta.x += 110;
                camioneta.velocidad += 20;
            }
        });
        this.controles = new Controles(this, 410);
        this.controles.alpha = 0.7;
        
        this.jugador = new Jugador(this, 160, 320, 'jugador').setDepth(3);
        this.jugador.scale = 0.85; //1.05; //0.90; //32
    }

    update(time, delta) {
		this.camionetas.children.iterate(camioneta => {
				camioneta.update(time, delta, this.jugador.x);
				if(camioneta.isDisparando){
					this.sound.play('disparo_snd');
					camioneta.isDisparando = false;
					this.balaParada = false;
					
					this.barrera.update(camioneta.miraX);
					
					if (!this.balaParada && !this.jugador.isHerido) {
						this.sound.play('herido_snd');
						this.vidas -= 1;
						if(this.vidas<=0) {
							camioneta.explosion.setScale(camioneta.explosion.scale+=0.1);
							
							this.controles.visible = false;						
							if(this.botella.recogerTween.isPlaying()){this.botella.setVisible(false);}
							this.nivelTexto.setVisible(false);
							
							this.sound.play('gameover_snd');
							this.scene.pause();
							
							//setTimeout y no time.delayCall. Revisar
							setTimeout(() => {
								this.data.puntaje = this.puntaje;
								this.scene.start('GameOver', 
									this.data);
							}, 1000);
						};
						
						this.statusBar.putVidas(this.vidas);
						this.jugador.heridoTween.play();
					}
				}
		});
		
		// Movimiento del jugador
		
		if (this.controles.rightIsPressed) {
			this.jugador.anims.play('walk', true);
			this.jugador.setFlipX(false);
			if(this.jugador.x + this.jugador.displayWidth / 2 <= 320) {this.jugador.x += 3}
		}
		else if (this.controles.leftIsPressed) {
			this.jugador.anims.play('walk', true);
			this.jugador.setFlipX(true);
			if(this.jugador.x - this.jugador.displayWidth / 2 >= 0) {this.jugador.x -= 3}
		} 
		else {
			this.jugador.anims.stop();
			this.jugador.setFrame(4);
		}
		
		// Recoge botellas
	    if(Phaser.Geom.Intersects.RectangleToRectangle(this.botella.getBounds(), this.jugador.getBounds())
			&& !this.botella.isCollected){
			this.botella.recoger();
			
			// Avanza nivel
			if(!(this.puntaje % this.gameOptions.botellasxnivel)){
				this.nivel += 1;
				this.statusBar.putNivel(this.nivel);
				this.nivelTexto.setText("Nivel "+this.nivel);
				this.tweens.add({
					targets: this.nivelTexto,
					duration: 1000,
					scale: 2,
					onComplete: ()=> {
						this.nivelTexto.setAlpha(0);
						this.nivelTexto.setScale(0);
					},
				});
				this.tweens.add({
					targets: this.nivelTexto,
					duration: 1000,
					yoyo: true,
					ease: 'Expo.out',
					alpha: 1,
				});
				
				this.barrera.restituible = true;
				this.barrera.glowColumnas();
				//this.statusBar.showGomas();
			}
		}
    }
}

