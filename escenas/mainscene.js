// Clases genéricas
import FullAnimatedSprite from '../clases/fullanimatedsprite.js';

// Clases específicas
import Jugador 		from '../objetos/jugador.js';
import Controles 	from '../objetos/controles.js';
import Barrera 		from '../objetos/barrera.js';
import Botella 		from '../objetos/botella.js';
import Trencito 	from '../objetos/trencito.js';
import MensajeNivel	from '../objetos/mensajenivel.js';

// Helpers
import createTilemap from '../tilemaps.js';

export default class MainScene extends Phaser.Scene {
	constructor(){
		super({ key: 'MainScene' });
	}
	
	preload() {
		this.load.image('boton', 'assets/imagenes/controles/boton.png');
		this.load.spritesheet('barrera', 'assets/imagenes/neumaticos.png', {frameWidth: 70, frameHeight: 90});
 		
		// Sonidos
		 this.load.audio('disparo_snd', 'assets/sonidos/368732__leszek_szary__shoot-3.wav');
		 this.load.audio('botella_snd', 'assets/sonidos/160420__relenzo2__icespell.wav');
		 this.load.audio('gameover_snd', 'assets/sonidos/38469__marvman__sliding-note-2.wav');
		 this.load.audio('herido_snd', 'assets/sonidos/432875__xtrgamr__lfs_vox8.wav');
	}

	create() {
		this.registry.set({partidaPuntaje: 0});
		this.scene.launch('HudScene');

		const layer = createTilemap(this);
		layer.y -= 16;
		layer.setScale(0.5);
		
		this.nivel = 1;
		this.puntaje = 0;
		this.vidas = this.registry.get('gameOptions').vidas ?? 1;
		this.restituible = false;
		this.balaParada = false;
		
		this.mensajeNivel = new MensajeNivel(this, this.cameras.main.width / 2, this.cameras.main.height / 3)
		
		this.barrera = new Barrera(this, 0, 250, 4, this.registry.get('gameOptions').shadows);
		
		this.trencito = new Trencito(this, 420, 140);
		
		this.controles = new Controles(this, 430);
		this.controles.alpha = 0.7;
		
		this.jugador = new Jugador(this, 160, 320, 'jugador').setDepth(3);
		this.jugador.scale = 0.85; //1.05; //0.90; //32
		
		this.botella = new Botella(this, 330, 'botella', this.jugador.x);
		this.botella.setScale(0.55);
		this.botella.setDepth(1);
		
		this.events.on('camionetaDispara', (camionetaX)=>this.onCamionetaDispara(camionetaX));
		this.events.on('botellaRecolectada', ()=>{
			this.puntaje+=1;
			this.events.emit('actualizarHudInfo', 'puntaje', this.puntaje);
			this.registry.inc('partidaPuntaje',1);
		});
		this.events.once('shutdown', () => {
			this.events.off('camionetaDispara');
			this.events.off('botellaRecolectada');
			this.scene.stop('HudScene');
		}); 
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
				this.mensajeNivel.ocultar();
				
				this.sound.play('gameover_snd');
				this.scene.pause();

				this.registry.set({partidaPuntaje: this.puntaje});
				
				setTimeout(() => {
					this.scene.start('GameOver');
				}, 1000);
				
			};

			this.events.emit('actualizarHudInfo', 'vidas', this.vidas);
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
			
			const botellasxnivel = this.registry.get('gameOptions').botellasxnivel || 9999;
			const botellasxneumatico = this.registry.get('gameOptions').botellasxneumatico || 9999;
			// Avanza nivel
			if(!(this.puntaje % botellasxnivel)){
				
				this.nivel += 1;
				this.mensajeNivel.mostrar(this.nivel);
				this.events.emit('actualizarHudInfo', 'nivel', this.nivel);

				this.barrera.setRestituible(false);
				this.barrera.repararColumnas();
				
				this.trencito.retirarCamionetas();
			}
			// Puede restituir un neumático a la barrera
			else if(!(this.puntaje % botellasxneumatico)){
				this.barrera.setRestituible(true);
				this.barrera.glowColumnas();
				//this.statusBar.showGomas();
			}
		}
	}
}
