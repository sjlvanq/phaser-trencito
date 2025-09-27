export default class Preload extends Phaser.Scene {
	constructor() {
		super("Preload");
	}

	preload() {
		this.load.json('options','options.json');
		this.load.json('version','version.json');

		this.load.spritesheet('bgtiles', 'assets/images/tiles.png', {frameWidth:48,frameHeight:48});

		this.load.spritesheet('player', 'assets/images/player.png', {frameWidth: 32, frameHeight: 80});
		this.load.spritesheet('bottle', 'assets/images/bottles.png', {frameWidth: 30, frameHeight: 55});

		this.load.image('patrolChassis', 	'assets/images/enemy/camioneta.png');
		this.load.image('policeman', 		'assets/images/enemy/policeman.png');
		this.load.image('gunFlash', 	'assets/images/enemy/gun_flash.png');
		this.load.spritesheet('wheel', 	'assets/images/enemy/wheel.png', {frameWidth: 60, frameHeight: 63});

		this.load.on('complete',()=>{
			const gameOptions = this.cache.json.get("options");
			const version = this.cache.json.get("version");
			this.registry.reset().merge({
					version: version.version,
					gameOptions: gameOptions,
					rankingLast: 0,
					rankingBest: 0,
					isFirstGame: true
				}
			);
			this.loadFonts().then(() => {
				this.scene.start("MenuScene");
			});
		});
	}

	create() {
		this.add.text(320/2,480/2,"...", {color:"#000", fontSize:"20px", fontWeight: "bold"})
			.setOrigin(0.5)
			.setAlpha(0.9);
	}

	loadFonts() {
		const monacoFontFace = new FontFace('monaco', 'url(assets/fonts/monaco.ttf)');
		const unkemptFontFace = new FontFace('unkempt', 'url(assets/fonts/unkempt-regular.ttf)');

		document.fonts.add(monacoFontFace);
		document.fonts.add(unkemptFontFace);

		return Promise.all([
			monacoFontFace.load(),
			unkemptFontFace.load()
		]);
	}

}
