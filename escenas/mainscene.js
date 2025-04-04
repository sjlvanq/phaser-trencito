// Clases de objetos
import Jugador 		from '../objetos/jugador.js';
import Controles 	from '../objetos/controles.js';
import Barrera 		from '../objetos/barrera.js';
import Botella 		from '../objetos/botella.js';
import Trencito 	from '../objetos/trencito.js';
import MensajeNivel	from '../objetos/mensajenivel.js';

// Clases de utilidades
import EscenariosManager from '../clases/escenariosmanager.js';

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
		this.scene.launch('HudScene');

		this.data.set('nivel', 1);
		this.data.set('puntaje', 0);
		this.data.set('vidas', this.registry.get('gameOptions').vidas ?? 1);

		this.restituible = false;
		this.balaParada = false;

		this.escenarios = new EscenariosManager(this);
		this.escenarios.cargarEscenario();
		this.escenarios.layer.y -= 16;

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

		this.events.on('ultimaCamionetaHaSalido', ()=>this.onUltimaCamionetaHaSalido());

		this.events.on('barreraReducida', ()=>this.onBarreraReducida());

		this.events.on('botellaRecolectada', ()=>{
			this.data.inc('puntaje', 1);
		});

		this.events.once('shutdown', () => {
			this.events.off('camionetaDispara');
			this.events.off('camionetaHaSalido');
			this.events.off('ultimaCamionetaHaSalido');
			this.events.off('barreraReducida');
			this.events.off('botellaRecolectada');
			this.scene.stop('HudScene');
		}); 
	}
	
	onCamionetaDispara(camionetaX) {
		this.barrera.update(camionetaX);
		
		//Herir al jugador
		if (!this.barrera.protegioAlJugador && !this.jugador.isHerido) {
			this.sound.play('herido_snd');
			this.data.inc('vidas', -1);
			
			//Matar al jugador
			if(this.data.get('vidas')<=0) {
				this.controles.visible = false;						
				if(this.botella.recogerTween.isPlaying()){this.botella.setVisible(false);}
				this.mensajeNivel.ocultar();
				
				this.sound.play('gameover_snd');
				this.scene.pause();

				setTimeout(() => {
					this.scene.start('GameOver', {puntaje: this.data.get('puntaje')});
				}, 1000);
				
			};

			this.jugador.heridoTween.play();
		}
	}

	onUltimaCamionetaHaSalido(){
		this.barrera.reducirColumnas();
	}

	onBarreraReducida(){
		if(this.moverEscenario){this.moverEscenario.destroy();}
		this.moverEscenario = this.tweens.add({
			targets: this.cameras.main,
			scrollX: this.escenarios.layer.displayWidth/2,
			duration: 5000,
			ease: 'Linear',
			onUpdate: () => {
				this.cameras.main.scrollX = Math.floor(this.cameras.main.scrollX)
			},
			onStart: () => {
				this.controles.disable();
				this.controles.setVisible(false);
				this.jugador.setFlipX(false);
				this.jugador.anims.play('walk');
				this.mensajeNivel.mostrar();
			},
			onComplete: () => {
				this.controles.setVisible(true);
				this.controles.enable();

				this.escenarios.cargarEscenario();
				this.cameras.main.scrollX = 0;

				this.barrera.repararColumnas();
				this.trencito.ingresarCamionetas();

				this.botella.setState(Botella.ESTADOS.RECOLECTABLE);
				this.botella.setVisible(true);
			}
		});
	}

	update(time, delta) {
		
		this.trencito.update(time, delta, this.jugador.x);
		
		// Movimiento del jugador
		if (this.controles.enabled) {
			if (this.controles.rightIsPressed) {
				this.jugador.avanzar(time, delta, 'derecha');
			}
			else if (this.controles.leftIsPressed) {
				this.jugador.avanzar(time, delta, 'izquierda');
			} 
			else {
				this.jugador.detenerse();
			}
		}
		
		// Recoge botellas
		if(Phaser.Geom.Intersects.RectangleToRectangle(this.botella.getBounds(), this.jugador.getBounds())
			&& this.botella.state === Botella.ESTADOS.RECOLECTABLE){

			this.botella.recoger();
			
			const botellasxnivel = this.registry.get('gameOptions').botellasxnivel || 9999;
			const botellasxneumatico = this.registry.get('gameOptions').botellasxneumatico || 9999;
			// Avanza nivel
			if(!(this.data.get('puntaje') % botellasxnivel)){
				this.botella.setVisible(false);
				this.botella.setState(Botella.ESTADOS.OCULTA);
				this.barrera.setRestituible(false);
				
				this.data.inc('nivel', 1);
				
				this.trencito.retirarCamionetas();
			}
			// Puede restituir un neumático a la barrera
			else if(!(this.data.get('puntaje') % botellasxneumatico)){
				this.barrera.setRestituible(true);
				this.barrera.glowColumnas();
			}
		}
	}
}
