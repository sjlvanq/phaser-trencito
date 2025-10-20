// Clases de objetos
import Player 		from '../objects/player.js';
import Controls 	from '../objects/controls.js';
import TireBarrier 	from '../objects/tirebarrier.js';
import Bottle 		from '../objects/bottle.js';
import Trencito 	from '../objects/trencito.js';
import LevelBanner	from '../objects/levelbanner.js';

// Clases de utilidades
import StageManager from '../classes/stagemanager.js';

export default class MainScene extends Phaser.Scene {
	constructor(){
		super({ key: 'MainScene' });
	}
	
	preload() {
		this.load.image('button', 'assets/images/controles/button.png');
		this.load.spritesheet('barrera', 'assets/images/neumaticos.png', {frameWidth: 70, frameHeight: 90});
 		
		// Sonidos
		 this.load.audio('shoot_snd', 'assets/sounds/368732__leszek_szary__shoot-3.wav');
		 this.load.audio('bottle_snd', 'assets/sounds/160420__relenzo2__icespell.wav');
		 this.load.audio('gameover_snd', 'assets/sounds/38469__marvman__sliding-note-2.wav');
		 this.load.audio('hurt_snd', 'assets/sounds/432875__xtrgamr__lfs_vox8.wav');
	}

	create() {
		this.scene.launch('HudScene');

		this.data.set('level', 1);
		this.data.set('score', 0);
		this.data.set('lives', this.registry.get('gameOptions').lives ?? 1);

		this.isRestorable = false;
		this.stoppedBullet = false;

		this.stages = new StageManager(this);
		this.stages.loadStage();
		this.stages.layer.y -= 16;

		this.levelBanner = new LevelBanner(this, this.cameras.main.width / 2, this.cameras.main.height / 3)
		
		this.tireBarrier = new TireBarrier(this, 0, 250, 4, this.registry.get('gameOptions').shadows);
		
		this.trencito = new Trencito(this, 420, 140);
		
		this.controls = new Controls(this, 430);
		this.controls.alpha = 0.7;
		
		this.player = new Player(this, 160, 320, 'player').setDepth(3);
		this.player.scale = 0.85; //1.05; //0.90; //32
		
		this.bottle = new Bottle(this, 330, 'bottle', this.player.x);
		this.bottle.setScale(0.55);
		this.bottle.setDepth(1);
		
		this.events.on('patrolCarShoots', (patrolCarX)=>this.onPatrolCarShot(patrolCarX));

		this.events.on('lastPatrolCarHasLeft', ()=>this.onLastPatrolCarHasLeft());

		this.events.on('barreraReducida', ()=>this.onBarreraReducida());

		this.events.on('bottleCollected', ()=>{
			this.data.inc('score', 1);
		});

		this.events.once('shutdown', () => {
			this.events.off('patrolCarShoots');
			this.events.off('patrolCarOffscreen');
			this.events.off('lastPatrolCarHasLeft');
			this.events.off('barreraReducida');
			this.events.off('bottleCollected');
			this.scene.stop('HudScene');
		}); 
	}
	
	onPatrolCarShot(patrolCarX) {
		this.tireBarrier.update(patrolCarX);
		
		//Herir al player
		if (!this.tireBarrier.hasProtectedPlayer && !this.player.isHurt) {
			this.sound.play('hurt_snd');
			this.data.inc('lives', -1);
			
			//Matar al jugador
			if(this.data.get('lives')<=0) {
				this.controls.visible = false;						
				if(this.bottle.collectTween.isPlaying()){this.bottle.setVisible(false);}
				this.levelBanner.hide();
				
				this.sound.play('gameover_snd');
				this.scene.pause();

				setTimeout(() => {
					this.scene.start('GameOver', {score: this.data.get('score')});
				}, 1000);
				
			};

			this.player.hurtTween.play();
		}
	}

	onLastPatrolCarHasLeft(){
		this.tireBarrier.reduce();
	}

	onBarreraReducida(){
		if(this.moveStage){this.moveStage.destroy();}
		this.moveStage = this.tweens.add({
			targets: this.cameras.main,
			scrollX: this.stages.layer.displayWidth/2,
			duration: 5000,
			ease: 'Linear',
			onUpdate: () => {
				this.cameras.main.scrollX = Math.floor(this.cameras.main.scrollX)
			},
			onStart: () => {
				console.log("inicia teen moverEscenario");
				this.controls.disable();
				this.controls.setVisible(false);
				this.player.setFlipX(false);
				this.player.anims.play('walk');
				this.levelBanner.show();
			},
			onComplete: () => {
				this.controls.setVisible(true);
				this.controls.enable();

				this.stages.loadStage();
				this.cameras.main.scrollX = 0;

				this.tireBarrier.repair();
				this.trencito.enterPatrolCars();

				this.bottle.setState(Bottle.STATES.COLLECTIBLE);
				this.bottle.setVisible(true);
			}
		});
	}

	update(time, delta) {
		
		this.trencito.update(time, delta, this.player.x);
		
		// Movimiento del jugador
		if (this.controls.enabled) {
			if (this.controls.rightIsPressed) {
				this.player.move(time, delta, 'right');
			}
			else if (this.controls.leftIsPressed) {
				this.player.move(time, delta, 'left');
			} 
			else {
				this.player.stop();
			}
		}
		
		// Recoge botellas
		if(Phaser.Geom.Intersects.RectangleToRectangle(this.bottle.getBounds(), this.player.getBounds())
			&& this.bottle.state === Bottle.STATES.COLLECTIBLE){

			this.bottle.collect();
			
			const bottlesPerLevel = this.registry.get('gameOptions').bottlesPerLevel || 9999;
			const bottlesPerTire = this.registry.get('gameOptions').bottlesPerTire || 9999;
			// Avanza level
			if(!(this.data.get('score') % bottlesPerLevel)){
				this.bottle.setVisible(false);
				this.bottle.setState(Bottle.STATES.HIDDEN);
				this.tireBarrier.setIsRestorable(false);
				
				this.data.inc('level', 1);
				
				this.trencito.retreatPatrolCars();
			}
			// Puede restituir un neumático a la barrier
			else if(!(this.data.get('score') % bottlesPerTire)){
				this.tireBarrier.setIsRestorable(true);
				this.tireBarrier.glow();
			}
		}
	}
}
