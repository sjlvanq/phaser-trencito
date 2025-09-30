export default class HudScene extends Phaser.Scene {
	constructor ()
	{
		//super({ key: 'HudScene', active: true });
		super({ key: 'HudScene' });
    }

    preload ()
    {
        this.load.spritesheet('icons', 'assets/images/statusbaricons.png', {frameWidth: 24});
    }

    create ()
    {
		const statusTextOptions = {color: "#000", fontSize:"15px", fontFamily: "sans-serif"};
		
		this.bg = this.add.rectangle(0,0,this.cameras.main.width,35,0xFFFFFF)
			.setOrigin(0)
			.setAlpha(0.60);
		
		this.statusLivesIco = this.add.sprite(260, 18, 'icons', 2);
		this.statusLivesText = this.add.text(280, 13, "x " + this.registry.get('gameOptions').lives, statusTextOptions);
		this.statusScoreIco = this.add.sprite(200, 18, 'icons', 0);
		this.statusScoreText = this.add.text(220, 13, '0', statusTextOptions);
		this.statusLevelText = this.add.text(15, 8, "Nivel 1", statusTextOptions);
		//this.statusTiresIco = this.add.sprite(100, 18, 'icons',1);

        this.updateHud = (parent, key, value) => {
	        switch (key) {
	            case 'lives':
		            this.setLives(value);
		            break;
	            case 'score':
		            this.setScore(value);
		            break;
	            case 'level':
		            this.setLevel(value);
		            break;
	            /*
	            case 'tires':
		            value ? this.showTires() : this.hideTires();
		            break;
	            */
		    }
	    };

        this.scene.get('MainScene').events.on('changedata', this.updateHud);
        this.scene.get('MainScene').events.once('shutdown', this.shutdown, this);
	}

    shutdown()
    {
        this.scene.get('MainScene').events.off('changedata', this.updateHud);
    }

	setLives(lives){
		this.statusLivesText.setText(`x ${lives}`);
	}
	
    setLevel(level){
		this.statusLevelText.setText(`Nivel ${level}`);
	}
	
    setScore(score){
		this.statusScoreText.setText(score);
	}
	
/*     showTires(){
		this.statusTiresIco.setVisible(true);
	}
	
    hideGomas(){
		this.statusTiresIco.setVisible(false);
	} */
}
