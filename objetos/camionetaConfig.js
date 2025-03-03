export default {
	// General
	ESCALA: 0.31,
	VELOCIDAD_INICIAL: 80,
	
	EXPLOSION: {
		ESCALA: 1,
		OFFSET_X: -10,
		OFFSET_Y: -15,
	},
	
	CABEZA: {
		ESCALA: 1.15,
		OFFSET_X: 20,
		OFFSET_Y: -48,
	},
	
	VIDRIOS: {
		ANCHO: 50,
		ALTO: 50,
		OFFSET_Y: -25,
		COLOR: 0x3333bb,
		OFFSETS_X: [-42,20],
	},
	
	RUEDAS: {
		ESCALA: 1.1,
		OFFSET_Y: 47,
		OFFSETS_X: [-143, 100],
		FRAMERATE: 25,
	},
	
	TWEENS: {
			CABEZA: {
			DURACION: 300,
			PROP_SCALE: '+=0.45',
			PROP_Y: '-=10',
			ESPERA: 1000,
		},
			VENTANILLA: {
			DURACION: 1500,
			PROP_Y: '+=30',
		},
			CHASIS: {
			DURACION: 200,
			PROP_ROTATION: 0.01,
		}
	},
}
