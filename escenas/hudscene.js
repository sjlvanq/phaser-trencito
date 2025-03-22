export default class HudScene extends Phaser.Scene {
	constructor ()
	{
		//super({ key: 'HudScene', active: true });
		super({ key: 'HudScene' });
    }

    preload ()
    {
        this.load.spritesheet('icons', 'assets/imagenes/statusbaricons.png', {frameWidth: 24});
    }

    create ()
    {
		const statusTextOptions = {color: "#000", fontSize:"15px", fontFamily: "sans-serif"};
		
		this.bg = this.add.rectangle(0,0,this.cameras.main.width,35,0xFFFFFF)
			.setOrigin(0)
			.setAlpha(0.60);
		
		this.statusVidasIco = this.add.sprite(260, 18, 'icons', 2);
		this.statusVidasText = this.add.text(280, 13, "x " + this.registry.get('gameOptions').vidas, statusTextOptions);
		this.statusPuntosIco = this.add.sprite(200, 18, 'icons', 0);
		this.statusPuntosText = this.add.text(220, 13, '0', statusTextOptions);
		this.statusNivelText = this.add.text(15, 8, "Nivel 1", statusTextOptions);
		//this.statusGomasIco = this.add.sprite(100, 18, 'icons',1);

        this.actualizarHud = (parent, key, value) => {
	        switch (key) {
	            case 'vidas':
		            this.putVidas(value);
		            break;
	            case 'puntaje':
		            this.putPuntaje(value);
		            break;
	            case 'nivel':
		            this.putNivel(value);
		            break;
	            /*
	            case 'gomas':
		            value ? this.showGomas() : this.hideGomas();
		            break;
	            */
		    }
	    };

        const mainScene = this.scene.get('MainScene');
        if (mainScene) {
            mainScene.events.off('changedata', this.actualizarHud);
            mainScene.events.on('changedata', this.actualizarHud);
        }

        this.scene.get('MainScene').events.on('changedata', this.actualizarHud);

        this.scene.get('MainScene').events.once('shutdown', this.shutdown, this);

	}

    shutdown()
    {
        this.scene.get('MainScene').events.off('changedata', this.actualizarHud);
    }

	putVidas(vidas){
		this.statusVidasText.setText(`x ${vidas}`);
	}
	
    putNivel(nivel){
		this.statusNivelText.setText(`Nivel ${nivel}`);
	}
	
    putPuntaje(puntos){
		this.statusPuntosText.setText(puntos);
	}
	
    showGomas(){
		this.statusGomasIco.setVisible(true);
	}
	
    hideGomas(){
		this.statusGomasIco.setVisible(false);
	}
}
