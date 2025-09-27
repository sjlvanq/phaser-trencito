import mapsData from "../data/maps.js";

export function createStaticBackground(scene) {
    const map = scene.make.tilemap({
        data: mapsData.staticBackground.data,
        tileWidth: mapsData.staticBackground.tiles.tileWidth,
        tileHeight: mapsData.staticBackground.tiles.tileHeight
    });
    const tiles = map.addTilesetImage(mapsData.staticBackground.tiles.tileSet);
    return map.createLayer(0, tiles, 0, 0);
}

export function createBackground(scene, x, y, key) {
    const map = scene.make.tilemap({
        data: mapsData[key].data,
        tileWidth: mapsData[key].tiles.tileWidth,
        tileHeight: mapsData[key].tiles.tileHeight
    });
    const tiles = map.addTilesetImage(mapsData[key].tiles.tileSet);
    return map.createLayer(0, tiles, x, y);
}