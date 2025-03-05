// Clases genéricas
import FullAnimatedSprite from '../clases/fullanimatedsprite.js';

// Clases específicas
import Jugador 		from '../objetos/jugador.js';
import Controles 	from '../objetos/controles.js';
import StatusBar	from '../objetos/statusbar.js';
import Barrera 		from '../objetos/barrera.js';
import Botella 		from '../objetos/botella.js';
import Camioneta 	from '../objetos/trencitocamioneta.js';
import Trencito 	from '../objetos/trencito.js';

// Helpers
import createTilemap from '../tilemaps.js';

export default class MainScene extends Phaser.Scene {
	
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
		this.balaParada = false;
		
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
		
		this.barrera = new Barrera(this, 0, 250, 4, this.gameOptions.shadows);
		
		this.trencito = new Trencito(this, 420, 130);
		
		this.controles = new Controles(this, 410);
		this.controles.alpha = 0.7;
		
		this.jugador = new Jugador(this, 160, 320, 'jugador').setDepth(3);
		this.jugador.scale = 0.85; //1.05; //0.90; //32
		
		this.events.on('camionetaDispara', (camionetaX)=>this.onCamionetaDispara(camionetaX));
	}
	
	onCamionetaDispara(camionetaX) {
		this.balaParada = false; //Retorno de barrera.update
		this.barrera.update(camionetaX);
		
		//Herir al jugador
		if (!this.balaParada && !this.jugador.isHerido) {
			this.sound.play('herido_snd');
			this.vidas -= 1;
			
			//Matar al jugador
			if(this.vidas<=0) {
				this.controles.visible = false;						
				if(this.botella.recogerTween.isPlaying()){this.botella.setVisible(false);}
				this.nivelTexto.setVisible(false);
				
				this.sound.play('gameover_snd');
				this.scene.pause();
				
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
	
	update(time, delta) {
		
		this.trencito.update(time, delta, this.jugador.x);
		
		// Movimiento del jugador
		
		if (this.controles.rightIsPressed) {
			this.jugador.avanzar(time, delta, 'derecha');
		}
		else if (this.controles.leftIsPressed) {
			this.jugador.avanzar(time, delta, 'izquierda');
		} 
		else {
			this.jugador.detenerse();
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
					props: {
						scale: {value: 2, duration: 1200, ease: 'Power1.in'},
						alpha: {value: 1, yoyo: true, ease: 'Expo.out', duration: 700}
					},
					onComplete: ()=> {
						this.nivelTexto.setAlpha(0);
						this.nivelTexto.setScale(0);
					},
				});
				this.barrera.setRestituible(false);
				this.barrera.repararColumnas();
			}
			// Puede restituir un neumático a la barrera
			else if(!(this.puntaje % this.gameOptions.botellasxneumatico)){
				this.barrera.setRestituible(true);
				this.barrera.glowColumnas();
				//this.statusBar.showGomas();
			}
		}
	}
}
