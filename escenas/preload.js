export default class Preload extends Phaser.Scene {
	constructor() {
		super("Preload");
	}

	preload() {
		this.load.json('options','options.json');

		this.load.spritesheet('bgtiles', 'assets/imagenes/tiles.png', {frameWidth:48,frameHeight:48});

		this.load.spritesheet('jugador', 'assets/imagenes/jugador.png', {frameWidth: 32, frameHeight: 80});
		this.load.spritesheet('botella', 'assets/imagenes/botellas.png', {frameWidth: 30, frameHeight: 55});

		this.load.image('camioneta', 	'assets/imagenes/enemigo/camioneta.png');
		this.load.image('cabeza', 		'assets/imagenes/enemigo/cabeza.png');
		this.load.image('explosion', 	'assets/imagenes/enemigo/explosion.png');
		this.load.spritesheet('rueda', 	'assets/imagenes/enemigo/rueda.png', {frameWidth: 60, frameHeight: 63});

		this.load.on('complete',()=>{
			this.loadFonts().then(() => {
				const gameOptions = this.cache.json.get("options");
				this.scene.start("MenuScene", {
					gameOptions: gameOptions,
					ranking: {anterior: 0, mejor: 0},
					primeraPartida: true
				});
			});
		});
	}

	create() {
		this.add.text(320/2,480/2,"...", {color:"#000", fontSize:"20px", fontWeight: "bold"})
			.setOrigin(0.5)
			.setAlpha(0.9);
	}

	loadFonts() {
		const monacoFontFace = new FontFace('monaco', 'url(assets/fuentes/monaco.ttf)');
		const unkemptFontFace = new FontFace('unkempt', 'url(assets/fuentes/unkempt-regular.ttf)');

		document.fonts.add(monacoFontFace);
		document.fonts.add(unkemptFontFace);

		return Promise.all([
			monacoFontFace.load(),
			unkemptFontFace.load()
		]);
	}

}
