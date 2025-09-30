import TireStack from './tirestack.js';
export default class TireBarrier extends Phaser.GameObjects.Group
{
	constructor(scene, x, y, numberOfCols = 4, shadows = false) {
		super(scene);
		this.scene = scene;

		this.hasProtectedPlayer = false; // Alguna columna detuvo un disparo
		this.isRestorable = false; // Estado de restitución de neumáticos en columnas
		const keyCodes = ['ONE', 'TWO', 'THREE', 'FOUR'];
		for(let i = 0; i<numberOfCols; i++){
			const boundKey = keyCodes[i];
			const tireStack = new TireStack(this.scene, 0, 0, 'barrera', ()=>{
					// Callback de pointerdown
					this.isRestorable = false;
					this.children.iterate( tireStack => {tireStack.stop();}); // Quitar glow
				}, boundKey
			);
			tireStack.scale = 0.6
			
			if(shadows){
				tireStack.postFX.addShadow(0,2,0.02,0.5);
			}
			
			// Se agrega a este grupo
			this.add(tireStack);
		}

		Phaser.Actions.GridAlign(this.getChildren(), {
			width: numberOfCols, cellWidth: this.scene.cameras.main.width / numberOfCols,
			x: x, y: y
		});

		this.createAnimation();
	}
	
	createAnimation() {
		// Número de cuadros alternables 3
		for (let i = 0; i < 3; i++) {
			if(!this.scene.anims.get(`glow_${i}`)){
				this.scene.anims.create({
					key: `glow_${i}`,
					frames: this.scene.anims.generateFrameNumbers('barrera', { frames: [i, i + 3] }),
					frameRate: 5,
					repeat: -1
				});
			}
		}
	}
	
	glow() {
		this.children.iterate((tireStack) => {tireStack.glow();});
	}
	
	repair() {
		this.setVisible(true);
		this.scene.time.delayedCall(100, ()=>{
			this.children.iterate((tireStack) => {tireStack.repair(true);});
		});
	}
	
	reduce() {
		this.children.iterate((tireStack) => {
			tireStack.reduce(true, () => {
				console.log("tireStack.reduce");
				this.scene.time.delayedCall(100, ()=>{tireStack.setVisible(false)});
				if(this.children.entries.every((tireStack)=>tireStack.atMinimum)){
					this.scene.events.emit('barreraReducida');
				}
			});
		})
	}

	setIsRestorable(value){this.isRestorable = value;}
	
	update(aimX) {
		this.hasProtectedPlayer = false;
		this.children.iterate(tireStack => {
			tireStack.update(aimX, this.isRestorable);
			if(tireStack.blockedShot){
				this.hasProtectedPlayer = true;
			}
		});
	}
}
