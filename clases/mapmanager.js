import mapsData from '../data/maps.js';

export default class MapManager {
    constructor(scene, tipo = 'estatico'){
        this.scene = scene;
        this.tileWidth = 48;
        this.tileHeight = 48;
        this.mapaWidth = 15;
        this.mapa = null;
        this.tiles = "bgtiles";
        this.layer = null;
        
        this.mapaData = tipo === 'estatico' ? mapsData.fondoEstatico.data : mapsData.main.escenarios[0].data;
        this.crearMapa();
    }

    crearMapa() {
        this.mapa = this.scene.make.tilemap({
            data: this.mapaData,
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight
        });
        const tileset = this.mapa.addTilesetImage(this.tiles);
        this.layer = this.mapa.createLayer(0, tileset, 0, 0);
    }

}