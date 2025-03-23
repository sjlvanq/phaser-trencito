export function establecerBotonPorDefecto(scene, boton) {
	scene.input.keyboard.on('keydown-SPACE', function() {
		if (boton.input?.enabled){ 
			boton.emit('pointerdown');
		}
	});
}
