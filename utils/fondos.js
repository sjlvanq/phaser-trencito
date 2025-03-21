import mapsData from "../data/maps.js";

export function crearFondoEstatico(scene) {
    const map = scene.make.tilemap({
        data: mapsData.fondoEstatico.data,
        tileWidth: mapsData.fondoEstatico.tiles.tileWidth,
        tileHeight: mapsData.fondoEstatico.tiles.tileHeight
    });
    const tiles = map.addTilesetImage(mapsData.fondoEstatico.tiles.tileSet);
    return map.createLayer(0, tiles, 0, 0);
}

export function crearFondo(scene, x, y, clave) {
    const map = scene.make.tilemap({
        data: mapsData[clave].data,
        tileWidth: mapsData[clave].tiles.tileWidth,
        tileHeight: mapsData[clave].tiles.tileHeight
    });
    const tiles = map.addTilesetImage(mapsData[clave].tiles.tileSet);
    return map.createLayer(0, tiles, x, y);
}