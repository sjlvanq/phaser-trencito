export default {
	// General
	SCALE: 0.31,
	
	GUN_FLASH: {
		SCALE: 1,
		OFFSETS_X: [-20,-10],
		OFFSET_Y: -15,
		VISIBLE_TIME: 500,
	},
	
	HEAD: {
		SCALE: 1.15,
		OFFSETS_X: [-40, 20],
		OFFSET_Y: -48,
	},
	
	WINDOWS: {
		WIDTH: 50,
		HEIGHT: 50,
		OFFSET_Y: -25,
		COLOR: 0x3333bb,
		OFFSETS_X: [-42, 20],
	},
	
	WHEELS: {
		SCALE: 1.1,
		OFFSET_Y: 47,
		OFFSETS_X: [-143, 100],
		FRAMERATE: 25,
	},
	
	TWEENS: {
			HEAD: {
			DURATION: 300,
			PROP_SCALE: '+=0.45',
			PROP_Y: '-=10'
		},
			WINDOW: {
			DURATION: 1500,
			PROP_Y: '+=30',
		},
			CHASSIS: {
			DURATION: 200,
			PROP_ROTATION: 0.01,
		}
	},
}
