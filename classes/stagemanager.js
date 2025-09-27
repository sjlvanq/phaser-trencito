import mapsData from '../data/maps.js';

export default class StageManager {
    constructor(scene){
        this.scene = scene;
        
        this.map = this.scene.make.tilemap({
            tileWidth: mapsData.main.tiles.tileWidth,
            tileHeight: mapsData.main.tiles.tileHeight,
            width: mapsData.main.width,
            height: mapsData.main.height,
        });
        const tileset = this.map.addTilesetImage(mapsData.main.tiles.tileSet);
        this.layer = this.map.createBlankLayer('layer1', tileset);
    }
    
    loadStage(){
        const nivel = this.scene.data.get('level');
        const stagesLength = mapsData.main.stages.length;
        this.map.putTilesAt(mapsData.main.stages[(nivel - 1) % stagesLength].data, 0, 0);
        this.map.putTilesAt(mapsData.main.stages[ nivel % stagesLength].data, mapsData.main.width/2, 0);
    }
}