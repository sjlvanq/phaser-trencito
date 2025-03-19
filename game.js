// Escenas
import Preload    from './escenas/preload.js';
import MenuScene  from './escenas/menuscene.js';
import MainScene  from './escenas/mainscene.js';
import GameOver   from './escenas/gameover.js';
import HudScene   from './escenas/hudscene.js';

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    fps: {target: 25},
    scene: [Preload, MenuScene, MainScene, HudScene, GameOver],
    backgroundColor: '#94c364',
    scale: {
		parent: 'gameCanvas',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
};

const game = new Phaser.Game(config);
