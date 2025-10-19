import PatrolCar from '../objects/trencitocamioneta.js';
export default class Trencito extends Phaser.GameObjects.Group
{
	static NUM_PATROL_CARS = 6;
	static ROWS = 2;
	static CELL_HEIGHT = 75;
	static CELL_WIDTH = 180;
	static ROW_OFFSET_X = 110;
	static ROW_SPEED_OFFSET = 20;
	static FIRING_ORDER_INTERVAL = 2800;
	static INITAL_SPEED = 80;
	static SPEED_INCREMENT = 20;
	
	constructor(scene, x, y, shadows = false) {
		super(scene);
		this.scene = scene;
		this.y = y;
		this.direction = 1; //1 o -1
		this.speed = Trencito.INITAL_SPEED;
		this.lastPatrolCarInRow = [];
		
		for (let i = 0; i < Trencito.NUM_PATROL_CARS; i++) {
			const patrolCar = new PatrolCar(this.scene, 0, 0, i*Trencito.FIRING_ORDER_INTERVAL, this.direction, Trencito.INITAL_SPEED);
			if(shadows){ // Pasar de gameOptions
				patrolCar.postFX.addShadow(0,1,0.03,2);
			}
			this.add(patrolCar);
		}
		this.shuffle();
		// Retorno de getChildren(), evita invocarlo cada vez
		this.patrolCars = this.getChildren();
		this.distributePatrolCars(y, this.direction);
		
		this.scene.events.on('patrolCarOffscreen',(patrolCar)=>{
			//console.log(patrolCar.state)
			if(patrolCar.state === PatrolCar.STATES.RETREATING){
				if(patrolCar === this.lastPatrolCarInConvoy){
					//Ultima camioneta ha salido
					this.scene.events.emit('lastPatrolCarHasLeft');
					this.lastPatrolCarInConvoy = null;
				}
			} else {
				this.repositionPatrolCar(patrolCar);
			}
		});
	}

	flipPatrolCars(direction){
		this.direction = direction;
		this.getChildren().forEach((patrolCar)=>{
			patrolCar.flip(direction);
		});
	}
	
	distributePatrolCars(y, direction){	
		this.direction = direction;
		this.flipPatrolCars(direction);
		
		const gridX = direction === -1 ?
			-(Trencito.NUM_PATROL_CARS / Trencito.ROWS * Trencito.CELL_WIDTH) :
			this.scene.cameras.main.width;
		
		Phaser.Actions.GridAlign(this.patrolCars, {
			width: Math.floor(Trencito.NUM_PATROL_CARS / Trencito.ROWS),
			cellWidth: Trencito.CELL_WIDTH, 
			cellHeight: Trencito.CELL_HEIGHT,
			x: gridX,
			y: y
		});
		
		// Offset de camioneta.x en fila y velocidad, asignación de camioneta.fila y ultimaCamionetaEnFila
		this.patrolCars.forEach((patrolCar, index) => {
			let row = Math.ceil((index+1) / Math.floor(Trencito.NUM_PATROL_CARS / Trencito.ROWS));
			patrolCar.x += (Trencito.ROW_OFFSET_X * row) * direction;
			patrolCar.speed = this.speed + Trencito.ROW_SPEED_OFFSET * row;
			patrolCar.row = row;
			if(direction>0){
				if ((index + 1) % Math.floor(Trencito.NUM_PATROL_CARS / Trencito.ROWS) === 0 || index === this.patrolCars.length - 1) {
					this.lastPatrolCarInRow[row-1] = patrolCar;
				}
			} else {
				if (index % (Trencito.NUM_PATROL_CARS/Trencito.ROWS) === 0){
					this.lastPatrolCarInRow[row-1] = patrolCar;
				}
			}
		});
		this.lastPatrolCarInConvoy = this.patrolCars[this.direction>0?this.patrolCars.length-1:0];
	}
	
	repositionPatrolCar(patrolCar) {
		let lastXPosition = this.lastPatrolCarInRow[patrolCar.row-1].x;
		let newXPosition = lastXPosition;
		
		// Si la nueva posición queda dentro de la pantalla
		// ...yendo a la izquierda
		if(this.direction === 1 && 
			lastXPosition + Trencito.CELL_WIDTH < this.scene.cameras.main.width) {
			
			newXPosition = this.scene.cameras.main.width;
		// ...yendo a la derecha
		} else if (this.direction === -1 && 
			lastXPosition - Trencito.CELL_WIDTH > 0) {
			
			newXPosition = 0;
		}
		newXPosition += Trencito.CELL_WIDTH * this.direction
		
		patrolCar.setX(newXPosition);
		this.lastPatrolCarInRow[patrolCar.row-1] = patrolCar;
		this.lastPatrolCarInConvoy = patrolCar;
	}
		
	retreatPatrolCars() {
		this.patrolCars.forEach((patrolCar) => {patrolCar.retreat();});
	}
	
	enterPatrolCars() {
		this.distributePatrolCars(this.y, this.direction * -1); // Alterna this.direccion
		this.patrolCars.forEach((patrolCar) => {patrolCar.enter();});
		this.increaseSpeed();
	}
	
	increaseSpeed() {
		this.speed += Trencito.SPEED_INCREMENT;
	}
	
	update(time, delta, playerX){
		this.patrolCars.forEach((patrolCar)=>{
			patrolCar.update(time, delta, playerX, this.direction);
		});
	}
}
