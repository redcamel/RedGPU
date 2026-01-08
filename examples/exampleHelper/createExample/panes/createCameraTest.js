const createCameraTest = (pane, camera, openYn = false) => {
	const folder = pane.addFolder({
		title: camera.name,
		expanded: openYn
	})

	folder.addBinding(camera, 'fov', {min: 10, max: 135, step: 0.1})
	folder.addBinding(camera, 'nearClipping', {min: 0.1, max: 135, step: 0.1})
	folder.addBinding(camera, 'farClipping', {min: 10, max: 10000, step: 1})
	if (camera.constructor.name === 'OrbitController') {

		folder.addBinding(camera, 'tilt', {min: 0, max: 360, readonly: true})
		folder.addBinding(camera, 'pan', {min: 0, max: 360, readonly: true})
		folder.addBinding(camera, 'minTilt', {min: -90, max: 90})
		folder.addBinding(camera, 'maxTilt', {min: -90, max: 90})
		folder.addBinding(camera, 'distance', {min: 1, max: 100})
		folder.addBinding(camera, 'speedRotation', {min: 1, max: 5})
		folder.addBinding(camera, 'rotationInterpolation', {min: 0.01, max: 0.99, step: 0.0001})
		folder.addBinding(camera, 'speedDistance', {min: 1, max: 10})
		folder.addBinding(camera, 'distanceInterpolation', {min: 0.01, max: 0.99, step: 0.0001})
	} else {
		folder.addBinding(camera, 'x', {readonly: true,})
		folder.addBinding(camera, 'y', {readonly: true,})
		folder.addBinding(camera, 'z', {readonly: true,})
		folder.addBinding(camera, 'rotationX', {readonly: true,})
		folder.addBinding(camera, 'rotationX', {readonly: true,})
		folder.addBinding(camera, 'rotationZ', {readonly: true,})
	}

}

export default createCameraTest
