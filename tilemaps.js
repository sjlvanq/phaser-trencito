const w = 15;
const MapData = Array();
/*
const MapData = {
    MenuScene: [
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(8),
        Array(w).fill(16),
        Array(w).fill(24),
        Array(w).fill(32),
        Array(w).fill(32),
        Array(w).fill(32),
        Array(w).fill(40),
        Array(w).fill(48),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill([36, 37]),
        Array(w).fill([44, 45]),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
    ],
    GameOver: [
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(8),
        Array(w).fill(16),
        Array(w).fill(24),
        Array(w).fill(32),
        Array(w).fill(32),
        Array(w).fill(32),
        Array(w).fill(40),
        Array(w).fill(48),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill([36, 37]),
        Array(w).fill([44, 45]),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
    ],
    default: [
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(8),
        Array(w).fill(16),
        Array(w).fill(24),
        Array(w).fill(32),
        Array(w).fill(32),
        Array(w).fill(32),
        Array(w).fill(40),
        Array(w).fill(48),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill(0),
        Array(w).fill([36, 37]),
        Array(w).fill([44, 45]),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
        Array(w).fill(26),
    ],
};
*/

MapData['MenuScene'] = [
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),

	Array(w).fill(8),
	Array(w).fill(16),
	Array(w).fill(24),

	Array(w).fill(32),
	Array(w).fill(32),
	Array(w).fill(32),
	Array(w).fill(40),
	Array(w).fill(48),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill([36,37]),
	Array(w).fill([44,45]),

	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
];

MapData['GameOver'] = [
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),

	Array(w).fill(8),
	Array(w).fill(16),
	Array(w).fill(24),

	Array(w).fill(32),
	Array(w).fill(32),
	Array(w).fill(32),
	Array(w).fill(40),
	Array(w).fill(48),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill([36,37]),
	Array(w).fill([44,45]),

	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
];

MapData['default'] = [
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(8),
	Array(w).fill(16),
	Array(w).fill(24),
	Array(w).fill(32),
	Array(w).fill(32),
	Array(w).fill(32),
	Array(w).fill(40),
	Array(w).fill(48),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill(0),
	Array(w).fill([36,37]),
	Array(w).fill([44,45]),
	
	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
	Array(w).fill(26),
];


// Líneas calle
MapData['MenuScene'][6].splice(1,4,1,2,2,3);
MapData['MenuScene'][7].splice(1,4,9,10,10,11);
MapData['MenuScene'][6].splice(9,4,1,2,2,3);
MapData['MenuScene'][7].splice(9,4,9,10,10,11);

// Líneas calle
MapData['GameOver'][6].splice(1,4,1,2,2,3);
MapData['GameOver'][7].splice(1,4,9,10,10,11);
MapData['GameOver'][6].splice(9,4,1,2,2,3);
MapData['GameOver'][7].splice(9,4,9,10,10,11);

// Líneas calle
MapData['default'][7].splice(2,4,1,2,2,3);
MapData['default'][8].splice(2,4,9,10,10,11);
MapData['default'][7].splice(10,4,1,2,2,3);
MapData['default'][8].splice(10,4,9,10,10,11);
		
// Bancos
MapData['default'][2].splice(2,3,49,50,51);
MapData['default'][3].splice(2,3,57,58,59);
MapData['default'][2].splice(7,3,49,50,51);
MapData['default'][3].splice(7,3,57,58,59);
		
// Macetas
MapData['default'][2].splice(0,2,33,34);
MapData['default'][3].splice(0,2,41,42);
MapData['default'][2].splice(5,2,33,34);
MapData['default'][3].splice(5,2,41,42);
MapData['default'][2].splice(10,2,33,34);
MapData['default'][3].splice(10,2,41,42);


export default function createTilemap(scene) {
	//console.log(scene);
	const map = scene.make.tilemap({ data: MapData[scene.scene.key], tileWidth: 48, tileHeight: 48 });
	const tiles = map.addTilesetImage("bgtiles");
	return map.createLayer(0, tiles, 0, 0);
}

export function createAnimacionTilemap(scene, x, y) {
	const bg_w = 25;
	const bg = [
	Array(bg_w).fill(8*3+2),
	Array(bg_w).fill(8),
	Array(bg_w).fill(16),
	Array(bg_w).fill(48),
	Array(bg_w).fill([44,45]),
	Array(bg_w).fill(0),
	Array(bg_w).fill(8*3+2),
	];
	
	bg[4].splice(0,3,8*7+0,8*7+0,8*5+3);
		
	bg[4].splice(5,2,46,0);
	bg[4].splice(6,3,8*6+1,8*6+2,8*6+3);
	bg[5].splice(6,3,8*7+1,8*7+2,8*7+3);
	bg[4].splice(9,1,43);

	bg[4].splice(9,6,8*7+0,8*7+0,8*7+0,8*7+0,8*7+0,8*5+3);
	
	bg[4].splice(16,2,46,0);
	bg[4].splice(17,3,8*6+1,8*6+2,8*6+3);
	bg[5].splice(17,3,8*7+1,8*7+2,8*7+3);
	bg[4].splice(20,1,43);
	
	const map = scene.make.tilemap({ data: bg, tileWidth: 48, tileHeight: 48 });
	const tiles = map.addTilesetImage("bgtiles");
	return map.createLayer(0, tiles, x, y);
}
