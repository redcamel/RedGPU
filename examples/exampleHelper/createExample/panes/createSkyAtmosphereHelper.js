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
		sunElevation: skyAtmosphere.sunElevation,
		sunAzimuth: skyAtmosphere.sunAzimuth,
		sunSize: skyAtmosphere.sunSize,
		earthRadius: skyAtmosphere.earthRadius,
		atmosphereHeight: skyAtmosphere.atmosphereHeight,
		mieScattering: skyAtmosphere.mieScattering,
		mieExtinction: skyAtmosphere.mieExtinction,
		mieAnisotropy: skyAtmosphere.mieAnisotropy,
		rayleighR: skyAtmosphere.rayleighScattering[0],
		rayleighG: skyAtmosphere.rayleighScattering[1],
		rayleighB: skyAtmosphere.rayleighScattering[2]
	};

	folder.addBinding(params, 'visible').on('change', (ev) => {
		if (ev.value) {
			targetView.skyAtmosphere = skyAtmosphere;
		} else {
			targetView.skyAtmosphere = null;
		}
	});

	// Sun Orientation
	const sunFolder = folder.addFolder({ title: 'Sun Orientation', expanded: true });
	sunFolder.addBinding(params, 'sunElevation', { min: -90, max: 90, step: 0.001, label: 'Elevation (고도)' }).on('change', (ev) => {
		skyAtmosphere.sunElevation = ev.value;
	});
	sunFolder.addBinding(params, 'sunAzimuth', { min: -360, max: 360, step: 0.001, label: 'Azimuth (방위각)' }).on('change', (ev) => {
		skyAtmosphere.sunAzimuth = ev.value;
	});
	sunFolder.addBinding(params, 'sunSize', { min: 0.1, max: 5.0, step: 0.01, label: 'Sun Size (태양 크기)' }).on('change', (ev) => {
		skyAtmosphere.sunSize = ev.value;
	});

	// Physics Parameters
	const physicsFolder = folder.addFolder({ title: 'Atmosphere Physics', expanded: true });

	physicsFolder.addBinding(params, 'earthRadius', { min: 1000, max: 10000, step: 10 }).on('change', (ev) => {
		skyAtmosphere.earthRadius = ev.value;
	});
	physicsFolder.addBinding(params, 'atmosphereHeight', { min: 10, max: 200, step: 1 }).on('change', (ev) => {
		skyAtmosphere.atmosphereHeight = ev.value;
	});
	
	const mieFolder = physicsFolder.addFolder({ title: 'Mie (탁도/광륜)', expanded: true });
	mieFolder.addBinding(params, 'mieScattering', { min: 0, max: 0.1, step: 0.0001, label: 'Mie Scattering' }).on('change', (ev) => {
		skyAtmosphere.mieScattering = ev.value;
	});
	mieFolder.addBinding(params, 'mieExtinction', { min: 0, max: 0.1, step: 0.0001, label: 'Mie Extinction' }).on('change', (ev) => {
		skyAtmosphere.mieExtinction = ev.value;
	});
	mieFolder.addBinding(params, 'mieAnisotropy', { min: 0, max: 0.999, step: 0.001, label: 'Mie Anisotropy (이방성)' }).on('change', (ev) => {
		skyAtmosphere.mieAnisotropy = ev.value;
	});

	const rayleighFolder = physicsFolder.addFolder({ title: 'Rayleigh (하늘색/노을색)', expanded: true });
	const updateRayleigh = () => {
		skyAtmosphere.rayleighScattering = [params.rayleighR, params.rayleighG, params.rayleighB];
	};
	rayleighFolder.addBinding(params, 'rayleighR', { min: 0, max: 0.1, step: 0.0001, label: 'Rayleigh R' }).on('change', updateRayleigh);
	rayleighFolder.addBinding(params, 'rayleighG', { min: 0, max: 0.1, step: 0.0001, label: 'Rayleigh G' }).on('change', updateRayleigh);
	rayleighFolder.addBinding(params, 'rayleighB', { min: 0, max: 0.1, step: 0.0001, label: 'Rayleigh B' }).on('change', updateRayleigh);

	// LUT Preview Placeholder
	const debugFolder = folder.addFolder({ title: 'Debug (LUT Preview)', expanded: false });
	const canvas = document.createElement('canvas');
	canvas.style.width = '100%';
	canvas.style.height = '64px';
	canvas.style.marginTop = '8px';
	canvas.style.border = '1px solid #555';
	debugFolder.controller.view.containerElement.appendChild(canvas);
}
