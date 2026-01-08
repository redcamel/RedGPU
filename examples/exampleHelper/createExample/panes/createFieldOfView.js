const createFieldOfView = (pane, camera) => {

	camera = camera.camera || camera

	pane.addBinding(camera, 'fieldOfView', {
		min: 12,
		max: 100,
		step: 0.1
	})
}

export default createFieldOfView
