export function establecerBotonPorDefecto(scene, boton) {
	scene.input.keyboard?.on('keydown', (event) => {
		if(event.code === 'Space' || event.code === 'Enter') {
			if (boton.input?.enabled){ 
				boton.emit('pointerdown');
			}
		}
	});
}
