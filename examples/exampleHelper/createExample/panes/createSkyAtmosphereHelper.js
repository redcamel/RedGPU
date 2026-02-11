/**
 * Creates a helper for SkyAtmosphere properties in the given pane.
 *
 * @param {object} pane - The Tweakpane instance.
 * @param {object} targetView - The View3D instance containing the SkyAtmosphere.
 *
 * @return {void}
 */
export default function createSkyAtmosphereHelper(pane, targetView) {
	const skyAtmosphere = targetView.skyAtmosphere;
	if (!skyAtmosphere) return;

	const folder = pane.addFolder({
		title: 'SkyAtmosphere',
		expanded: true,
	});

	const params = {
		visible: true,
		sunX: skyAtmosphere.sunDirection[0],
		sunY: skyAtmosphere.sunDirection[1],
		sunZ: skyAtmosphere.sunDirection[2],
		earthRadius: skyAtmosphere.earthRadius,
		atmosphereHeight: skyAtmosphere.atmosphereHeight,
		mieScattering: skyAtmosphere.mieScattering,
		mieExtinction: skyAtmosphere.mieExtinction,
		rayleighScattering: {
			r: skyAtmosphere.rayleighScattering[0],
			g: skyAtmosphere.rayleighScattering[1],
			b: skyAtmosphere.rayleighScattering[2]
		}
	};

	folder.addBinding(params, 'visible').on('change', (ev) => {
		if (ev.value) {
			targetView.skyAtmosphere = skyAtmosphere;
		} else {
			targetView.skyAtmosphere = null;
		}
	});

	// Sun Direction Controls (Individual Sliders)
	const sunFolder = folder.addFolder({ title: 'Sun Direction', expanded: true });
	const updateSun = () => {
		skyAtmosphere.sunDirection = new Float32Array([params.sunX, params.sunY, params.sunZ]);
	};

	sunFolder.addBinding(params, 'sunX', { min: -1, max: 1, step: 0.01, label: 'Sun X' }).on('change', updateSun);
	sunFolder.addBinding(params, 'sunY', { min: -1, max: 1, step: 0.01, label: 'Sun Y' }).on('change', updateSun);
	sunFolder.addBinding(params, 'sunZ', { min: -1, max: 1, step: 0.01, label: 'Sun Z' }).on('change', updateSun);

	// Physics Parameters
	const physicsFolder = folder.addFolder({ title: 'Atmosphere Physics', expanded: false });

	physicsFolder.addBinding(params, 'earthRadius', { min: 1000, max: 10000, step: 10 }).on('change', (ev) => {
		skyAtmosphere.earthRadius = ev.value;
	});
	physicsFolder.addBinding(params, 'atmosphereHeight', { min: 10, max: 200, step: 1 }).on('change', (ev) => {
		skyAtmosphere.atmosphereHeight = ev.value;
	});
	physicsFolder.addBinding(params, 'mieScattering', { min: 0, max: 0.1, step: 0.0001 }).on('change', (ev) => {
		skyAtmosphere.mieScattering = ev.value;
	});
	physicsFolder.addBinding(params, 'mieExtinction', { min: 0, max: 0.1, step: 0.0001 }).on('change', (ev) => {
		skyAtmosphere.mieExtinction = ev.value;
	});
	physicsFolder.addBinding(params, 'rayleighScattering', {
		color: { type: 'float' }
	}).on('change', (ev) => {
		skyAtmosphere.rayleighScattering = [ev.value.r, ev.value.g, ev.value.b];
	});

	// LUT Preview (Placeholder)
	const debugFolder = folder.addFolder({ title: 'Debug (LUT Preview)', expanded: false });
	const canvas = document.createElement('canvas');
	canvas.style.width = '100%';
	canvas.style.height = '64px';
	canvas.style.marginTop = '8px';
	canvas.style.border = '1px solid #555';
	debugFolder.controller.view.containerElement.appendChild(canvas);
}
