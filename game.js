// Escenas
import Preload 		from './escenas/preload.js';
import MenuScene 	from './escenas/menuscene.js';
import MainScene	from './escenas/mainscene.js';
import GameOver 	from './escenas/gameover.js';
/*
import Pagina1 		from './escenas/historia/pagina1.js';
import Pagina2 		from './escenas/historia/pagina2.js';
import Pagina3 		from './escenas/historia/pagina3.js';
import Pagina4 		from './escenas/historia/pagina4.js';
import Pagina5 		from './escenas/historia/pagina5.js';
import Pagina6 		from './escenas/historia/pagina6.js';
*/
const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    fps: {target: 25},
    scene: [Preload, MenuScene, MainScene, GameOver],
    backgroundColor: '#94c364',
};

const game = new Phaser.Game(config);
