import PATROL_CAR from './trencitocamionetaConfig.js';
import FullAnimatedSprite from '../classes/fullanimatedsprite.js';

export default class PatrolCar extends Phaser.GameObjects.Container
{
	static STATES = {
		PATROLLING: 0,
		TARGETING: 1,
		STARTING_FIRE: 2,
		SHOOTING: 3,
		RETREATING: 4,
		INACTIVE: 5
	};

	constructor (scene, x, y, windowTweenDelay=0, direction=1, speed)
	{
		super(scene, x, y);
		scene.add.existing(this);
		
		this.state = PatrolCar.STATES.INACTIVE; 
		this.row = 0;
		
		this.speed = speed;
		this.windowTweenDelay = windowTweenDelay;
				
		this.chassis = scene.add.sprite(0, 0, 'patrolChassis').setDepth(1);
		this.animateChasis();
		
		this.windows = [
			scene.add.rectangle(PATROL_CAR.WINDOWS.OFFSETS_X[0], PATROL_CAR.WINDOWS.OFFSET_Y, PATROL_CAR.WINDOWS.WIDTH, PATROL_CAR.WINDOWS.HEIGHT, PATROL_CAR.WINDOWS.COLOR),
			scene.add.rectangle(PATROL_CAR.WINDOWS.OFFSETS_X[1], PATROL_CAR.WINDOWS.OFFSET_Y, PATROL_CAR.WINDOWS.WIDTH, PATROL_CAR.WINDOWS.HEIGHT, PATROL_CAR.WINDOWS.COLOR),
		];
		
		this.gunFlash = scene.add.sprite(PATROL_CAR.GUN_FLASH.OFFSETS_X[direction<0?0:1], PATROL_CAR.GUN_FLASH.OFFSET_Y, 'gunFlash').setDepth(1);
		this.gunFlash.setScale(PATROL_CAR.GUN_FLASH.SCALE);
		this.gunFlash.setVisible(false);
		
		this.head = scene.add.sprite(PATROL_CAR.HEAD.OFFSETS_X[direction<0?0:1], PATROL_CAR.HEAD.OFFSET_Y, 'policeman');
		this.head.setScale(PATROL_CAR.HEAD.SCALE);
		this.head.setDepth(1);
		this.head.setVisible(false);
		
		this.wheels = [
			new FullAnimatedSprite(scene, PATROL_CAR.WHEELS.OFFSETS_X[0], PATROL_CAR.WHEELS.OFFSET_Y, 'wheel', PATROL_CAR.WHEELS.FRAMERATE).setScale(PATROL_CAR.WHEELS.SCALE),
			new FullAnimatedSprite(scene, PATROL_CAR.WHEELS.OFFSETS_X[1], PATROL_CAR.WHEELS.OFFSET_Y, 'wheel', PATROL_CAR.WHEELS.FRAMERATE).setScale(PATROL_CAR.WHEELS.SCALE)
		];
		this.wheels.forEach(rueda => rueda.play());

		this.add([...this.windows, this.chassis, ...this.wheels, this.head, this.gunFlash]);
		this.setScale(PATROL_CAR.SCALE);
		
		this.width = this.getBounds().width;
	}

	setState(newState, force=false){
		if(newState===this.state){return}
		if(this.state !== PatrolCar.STATES.RETREATING || force){
			this.state = newState;
		}
	}

	animateChasis()
	{
		this.scene.tweens.add({
			targets: this.chassis,
			rotation: PATROL_CAR.TWEENS.CHASSIS.PROP_ROTATION,
			duration: PATROL_CAR.TWEENS.CHASSIS.DURATION,
			yoyo: true,
			repeat: -1,
		});
	}
	
	animateWindow(direccion)
	{
		if(this.windowTween){this.windowTween.destroy();}
		this.windowTween = this.scene.tweens.chain({
			delay: this.windowTweenDelay,
			tweens: [
				// Baja la ventanilla
				{
					targets: this.windows[direccion<0?0:1],
					y: {start: PATROL_CAR.WINDOWS.OFFSET_Y, to: PATROL_CAR.TWEENS.WINDOW.PROP_Y},
					duration: PATROL_CAR.TWEENS.WINDOW.DURATION,
					ease: Phaser.Math.Easing.Expo.In,
					onStart: () => {
						if(this.state === PatrolCar.STATES.RETREATING){
							// Corta ciclo de animación
							this.windowTween.stop();
						}
					}
				},
				// Asoma la cabeza
				{
					targets: this.head,
					scale: {start: PATROL_CAR.HEAD.SCALE, to: PATROL_CAR.TWEENS.HEAD.PROP_SCALE},
					y: {start: PATROL_CAR.HEAD.OFFSET_Y, to: PATROL_CAR.TWEENS.HEAD.PROP_Y},
					duration: PATROL_CAR.TWEENS.HEAD.DURATION,
					yoyo: true,
					hold: 1500,
					onStart: () => {
						if(this.state === PatrolCar.STATES.RETREATING){
							// NO asoma la cabeza, sube la ventanila
							this.windowTween.nextTween();
							return;
						}
						this.head.setVisible(true);
					},
					onHold: () => {
						this.setState(PatrolCar.STATES.TARGETING);
					},
					onYoyo: () => {
						this.setState(PatrolCar.STATES.PATROLLING);
					},
					onComplete: () => {
						this.head.setVisible(false);
					},
				},
				// Sube la ventanilla
				{
					targets: this.windows[direccion<0?0:1],
					y: PATROL_CAR.WINDOWS.OFFSET_Y,
					duration: PATROL_CAR.TWEENS.WINDOW.DURATION,
					ease: Phaser.Math.Easing.Expo.Out,
				},
			],
			loop: -1,
		});
	}

	shoot() 
	{
		this.showGunFlash();
		this.scene.sound.play('shoot_snd');
		this.scene.events.emit('patrolCarShoots', this.x);
	}
	
	showGunFlash(){
		this.gunFlash.setVisible(true)
		this.scene.time.delayedCall(PATROL_CAR.GUN_FLASH.VISIBLE_TIME, () => {
			this.gunFlash.setVisible(false)
		});
	}
	
	flip(direction) {
		this.head.setX(PATROL_CAR.HEAD.OFFSETS_X[direction<0?0:1]);
		this.gunFlash.setX(PATROL_CAR.GUN_FLASH.OFFSETS_X[direction<0?0:1]);
		
		//this.scaleX *= -1; // alterna valor
		this.scaleX = Math.abs(this.scaleX) * direction;
		
		this.scene.tweens.killTweensOf(this); 		// Mata los tweens asociados
		this.animateWindow(direction);
	}
	
	retreat(){
		this.setState(PatrolCar.STATES.RETREATING);
	}
	
	enter(){
		this.head.setVisible(false);
		this.windows.forEach((vidrio)=>{vidrio.setY(PATROL_CAR.WINDOWS.OFFSET_Y)});
		this.setState(PatrolCar.STATES.PATROLLING, true);
	}
	
	update (time, delta, playerX, direction)
	{
		const deltaSeconds = delta / 1000;
		const isOffscreenLeft = this.x + this.width / 2 < 0;
		const isOffscreenRight = this.x - this.width / 2 > this.scene.cameras.main.width;
		
		this.x -= this.speed * deltaSeconds * direction;
		
		switch(this.state){
			case PatrolCar.STATES.TARGETING:
				//console.log(this.scene.player);
				const playerWidth = this.scene.player.displayWidth;
				if (Math.abs(this.x - playerX) < playerWidth / 2) {
					this.setState(PatrolCar.STATES.STARTING_FIRE);
				}
				break;
			case PatrolCar.STATES.STARTING_FIRE:
				this.shoot();
				this.setState(PatrolCar.STATES.SHOOTING);
				break;
		}

		const isOffscreen = direction > 0 ? isOffscreenLeft : isOffscreenRight;
		if (isOffscreen) {
			this.scene.events.emit('patrolCarOffscreen', this);
		}
	}
}
