export function setDefaultButton(scene, button) {
	scene.input.keyboard?.on('keydown', (event) => {
		if(event.code === 'Space' || event.code === 'Enter') {
			if (button.input?.enabled){ 
				button.emit('pointerdown');
			}
		}
	});
}
