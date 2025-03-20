import mapsData from '../data/maps.js';

export default class EscenariosManager {
    constructor(scene){
        this.scene = scene;
        this.mapaMitadWidth = 15;
        
        const tileWidth = 48;
        const tileHeight = 48;
        const mapaHeight = 23;
        const tiles = "bgtiles";
        

        this.mapa = this.scene.make.tilemap({
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            width: this.mapaMitadWidth * 2,
            height: mapaHeight,
        });
        const tileset = this.mapa.addTilesetImage(tiles);
        this.layer = this.mapa.createBlankLayer('layer1', tiles);
        //this.mapa.createLayer(0, tileset, 0, 0);
    }
    
    cargarEscenario(nivel){
        const escenariosLength = mapsData.main.escenarios.length;
        this.mapa.putTilesAt(mapsData.main.escenarios[(nivel - 1) % escenariosLength].data, 0, 0);
        this.mapa.putTilesAt(mapsData.main.escenarios[ nivel % escenariosLength].data, this.mapaMitadWidth, 0);
    }
}