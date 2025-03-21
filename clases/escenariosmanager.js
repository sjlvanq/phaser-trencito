import mapsData from '../data/maps.js';

export default class EscenariosManager {
    constructor(scene){
        this.scene = scene;
        this.mapaMitadWidth = 15;
        
        this.mapa = this.scene.make.tilemap({
            tileWidth: mapsData.main.tiles.tileWidth,
            tileHeight: mapsData.main.tiles.tileHeight,
            width: mapsData.main.width,
            height: mapsData.main.height,
        });
        const tileset = this.mapa.addTilesetImage(mapsData.main.tiles.tileSet);
        this.layer = this.mapa.createBlankLayer('layer1', tileset);
    }
    
    cargarEscenario(nivel){
        if(!nivel){console.error("EscenariosManager no ha recibido un argumento válido"); return;}
        const escenariosLength = mapsData.main.escenarios.length;
        this.mapa.putTilesAt(mapsData.main.escenarios[(nivel - 1) % escenariosLength].data, 0, 0);
        this.mapa.putTilesAt(mapsData.main.escenarios[ nivel % escenariosLength].data, this.mapaMitadWidth, 0);
    }
}