import mapsData from '../data/maps.js';

export default class EscenariosManager {
    constructor(scene){
        this.scene = scene;
        
        this.mapa = this.scene.make.tilemap({
            tileWidth: mapsData.main.tiles.tileWidth,
            tileHeight: mapsData.main.tiles.tileHeight,
            width: mapsData.main.width,
            height: mapsData.main.height,
        });
        const tileset = this.mapa.addTilesetImage(mapsData.main.tiles.tileSet);
        this.layer = this.mapa.createBlankLayer('layer1', tileset);
    }
    
    cargarEscenario(){
        const nivel = this.scene.data.get('nivel');
        const escenariosLength = mapsData.main.escenarios.length;
        this.mapa.putTilesAt(mapsData.main.escenarios[(nivel - 1) % escenariosLength].data, 0, 0);
        this.mapa.putTilesAt(mapsData.main.escenarios[ nivel % escenariosLength].data, mapsData.main.width/2, 0);
    }
}