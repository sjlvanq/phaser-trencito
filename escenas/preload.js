export default class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
		this.load.on('complete',()=>{			
			const monacoFontFace = new FontFace('monaco', 'url(assets/fuentes/monaco.ttf)');
			const vcrosdFontFace = new FontFace('vcrosd', 'url(assets/fuentes/vcr_osd_mono.ttf)');
			const unkemptFontFace = new FontFace('unkempt', 'url(assets/fuentes/unkempt-regular.ttf)');
			document.fonts.add(monacoFontFace);
			document.fonts.add(unkemptFontFace);
			console.log("Cargando fuentes");
			monacoFontFace.load().then(() => {
				unkemptFontFace.load().then(()=> {
					console.log("Cargando configuración");
					fetch("options.json")
						.then(response => response.json())
						.then(data => {
							this.scene.start("MenuScene", {
								gameOptions: data,
								ranking: {anterior: 0, mejor: 0},
								primeraPartida: true
							}); 
						});
					});
			});
		});
		

        
		console.log("Cargando imágenes");
		
		this.load.spritesheet('bgtiles', 'assets/imagenes/tiles.png', {frameWidth:48,frameHeight:48});
		this.load.image('titulo', 'assets/imagenes/titulo.png');
		this.load.image('titulo_banda', 'assets/imagenes/titulo_banda.png');
        this.load.image('gameover', 'assets/imagenes/gameover.png');
		this.load.spritesheet('dotmenu', 'assets/imagenes/dotmenu.png', {frameWidth: 32, frameHeight:32});
		this.load.image('dotayuda', 'assets/imagenes/dotayuda.png');
        this.load.spritesheet('icons', 'assets/imagenes/statusbaricons.png', {frameWidth: 24});
		this.load.spritesheet('sorpresa', 'assets/imagenes/sorpresas.png', {frameWidth: 24});
		
		this.load.spritesheet('jugador', 'assets/imagenes/jugador.png', {frameWidth: 32, frameHeight: 80});
        this.load.spritesheet('botella', 'assets/imagenes/botellas.png', {frameWidth: 30, frameHeight: 55});
        this.load.spritesheet('barrera', 'assets/imagenes/neumaticos.png', {frameWidth: 70, frameHeight: 90});
        
        this.load.image('camioneta', 	'assets/imagenes/enemigo/camioneta.png');
        this.load.image('cabeza', 		'assets/imagenes/enemigo/cabeza.png');
        this.load.image('explosion', 	'assets/imagenes/enemigo/explosion.png');
        this.load.spritesheet('rueda', 	'assets/imagenes/enemigo/rueda.png', {frameWidth: 60, frameHeight: 63});
        
        this.load.image('boton', 'assets/imagenes/controles/boton.png');
 		this.load.spritesheet('flechas','assets/imagenes/flechasluminosas.png',{frameWidth: 64,frameHeight: 32 });
		
		this.load.image('carrito','assets/imagenes/historia/carrito.png');
		this.load.spritesheet('movil', 'assets/imagenes/historia/px_movil.png', {frameWidth:64, frameHeight:32});
 		this.load.image('marcoHistoria', 'assets/imagenes/historia/tarjeta2.png');
 		this.load.image('marcoAnimacion', 'assets/imagenes/historia/tarjeta3.png');
		
 		// Sonidos
 		console.log("Cargando sonidos");
        this.load.audio('disparo_snd', 'assets/sonidos/368732__leszek_szary__shoot-3.wav');
        this.load.audio('botella_snd', 'assets/sonidos/160420__relenzo2__icespell.wav');
        this.load.audio('gameover_snd', 'assets/sonidos/38469__marvman__sliding-note-2.wav');
        this.load.audio('herido_snd', 'assets/sonidos/432875__xtrgamr__lfs_vox8.wav');
        this.load.audio('menu_snd', 'assets/sonidos/653382__krokulator__select.wav');
    }
    
    create() {
		this.add.text(320/2,480/2,"...", {color:"#000", fontSize:"20px", fontWeight: "bold"})
			.setOrigin(0.5)
			.setAlpha(0.9);
    }
}
