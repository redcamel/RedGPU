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

	// UI와 연결할 로컬 파라미터 객체
	const params = {
		visible: true,
		sunElevation: skyAtmosphere.sunElevation,
		sunAzimuth: skyAtmosphere.sunAzimuth,
		sunSize: skyAtmosphere.sunSize,
		sunIntensity: skyAtmosphere.sunIntensity,
		exposure: skyAtmosphere.exposure,
		bottomRadius: skyAtmosphere.bottomRadius,
		atmosphereHeight: skyAtmosphere.atmosphereHeight,
		mieScattering: skyAtmosphere.mieScattering,
		mieAbsorption: skyAtmosphere.mieAbsorption,
		mieAnisotropy: skyAtmosphere.mieAnisotropy,
		mieExponentialDistribution: skyAtmosphere.mieExponentialDistribution,
		rayleighR: skyAtmosphere.rayleighScattering[0],
		rayleighG: skyAtmosphere.rayleighScattering[1],
		rayleighB: skyAtmosphere.rayleighScattering[2],
		rayleighExponentialDistribution: skyAtmosphere.rayleighExponentialDistribution,
		absorptionR: skyAtmosphere.absorptionCoefficient[0],
		absorptionG: skyAtmosphere.absorptionCoefficient[1],
		absorptionB: skyAtmosphere.absorptionCoefficient[2]
	};

	// UI 수치를 실제 객체와 동기화하는 함수
	const syncUI = () => {
		params.sunElevation = skyAtmosphere.sunElevation;
		params.sunAzimuth = skyAtmosphere.sunAzimuth;
		params.sunSize = skyAtmosphere.sunSize;
		params.sunIntensity = skyAtmosphere.sunIntensity;
		params.exposure = skyAtmosphere.exposure;
		params.bottomRadius = skyAtmosphere.bottomRadius;
		params.atmosphereHeight = skyAtmosphere.atmosphereHeight;
		params.mieScattering = skyAtmosphere.mieScattering;
		params.mieAbsorption = skyAtmosphere.mieAbsorption;
		params.mieAnisotropy = skyAtmosphere.mieAnisotropy;
		params.mieExponentialDistribution = skyAtmosphere.mieExponentialDistribution;
		params.rayleighR = skyAtmosphere.rayleighScattering[0];
		params.rayleighG = skyAtmosphere.rayleighScattering[1];
		params.rayleighB = skyAtmosphere.rayleighScattering[2];
		params.rayleighExponentialDistribution = skyAtmosphere.rayleighExponentialDistribution;
		params.absorptionR = skyAtmosphere.absorptionCoefficient[0];
		params.absorptionG = skyAtmosphere.absorptionCoefficient[1];
		params.absorptionB = skyAtmosphere.absorptionCoefficient[2];
		pane.refresh();
	};

	// 1. 프리셋 섹션
	const presetFolder = folder.addFolder({ title: 'Atmosphere Presets', expanded: true });
	
	const applyPreset = (config) => {
		Object.assign(skyAtmosphere, config);
		syncUI();
	};

	presetFolder.addButton({ title: '☀️ Clear Noon' }).on('click', () => {
		applyPreset({
			sunElevation: 90,
			mieScattering: 0.00399,
			mieAbsorption: 0.00444,
			rayleighScattering: [0.0058, 0.0135, 0.0331],
			mieAnisotropy: 0.8,
			sunIntensity: 100,
			exposure: 1.0,
			rayleighExponentialDistribution: 8.0,
			mieExponentialDistribution: 1.2,
			absorptionCoefficient: [0.00065, 0.00188, 0.00008]
		});
	});

	presetFolder.addButton({ title: '🌅 Golden Sunset' }).on('click', () => {
		applyPreset({
			sunElevation: 1.5,
			mieScattering: 0.01,
			mieAbsorption: 0.015,
			rayleighScattering: [0.0058, 0.0135, 0.05],
			mieAnisotropy: 0.9,
			sunIntensity: 200,
			exposure: 1.5,
			rayleighExponentialDistribution: 8.0,
			mieExponentialDistribution: 1.2,
			absorptionCoefficient: [0.00065, 0.00188, 0.00008]
		});
	});

	// 2. 가시성 및 광량
	folder.addBinding(params, 'visible').on('change', (ev) => {
		if (ev.value) targetView.skyAtmosphere = skyAtmosphere;
		else targetView.skyAtmosphere = null;
	});

	const lightFolder = folder.addFolder({ title: 'Lighting & Exposure', expanded: false });
	lightFolder.addBinding(params, 'sunIntensity', { min: 0, max: 5000, step: 1 }).on('change', (ev) => skyAtmosphere.sunIntensity = ev.value);
	lightFolder.addBinding(params, 'exposure', { min: 0.1, max: 50, step: 0.1 }).on('change', (ev) => skyAtmosphere.exposure = ev.value);

	// 3. 태양 방향 및 크기
	const sunFolder = folder.addFolder({ title: 'Sun Orientation', expanded: true });
	sunFolder.addBinding(params, 'sunElevation', { min: -90, max: 90, step: 0.001, label: 'Elevation' }).on('change', (ev) => skyAtmosphere.sunElevation = ev.value);
	sunFolder.addBinding(params, 'sunAzimuth', { min: -360, max: 360, step: 0.001, label: 'Azimuth' }).on('change', (ev) => skyAtmosphere.sunAzimuth = ev.value);
	sunFolder.addBinding(params, 'sunSize', { min: 0.1, max: 10.0, step: 0.01 }).on('change', (ev) => skyAtmosphere.sunSize = ev.value);

	// 4. 물리 파라미터 (고급 설정)
	const physicsFolder = folder.addFolder({ title: 'Atmosphere Physics', expanded: false });
	physicsFolder.addBinding(params, 'bottomRadius', { min: 1000, max: 10000, step: 10 }).on('change', (ev) => skyAtmosphere.bottomRadius = ev.value);
	physicsFolder.addBinding(params, 'atmosphereHeight', { min: 10, max: 200, step: 1 }).on('change', (ev) => skyAtmosphere.atmosphereHeight = ev.value);
	
	// Mie 산란
	const mieFolder = physicsFolder.addFolder({ title: 'Mie Scattering', expanded: false });
	mieFolder.addBinding(params, 'mieScattering', { min: 0, max: 0.1, step: 0.0001 }).on('change', (ev) => skyAtmosphere.mieScattering = ev.value);
	mieFolder.addBinding(params, 'mieAbsorption', { min: 0, max: 0.1, step: 0.0001 }).on('change', (ev) => skyAtmosphere.mieAbsorption = ev.value);
	mieFolder.addBinding(params, 'mieAnisotropy', { min: 0, max: 0.999, step: 0.001 }).on('change', (ev) => skyAtmosphere.mieAnisotropy = ev.value);
	mieFolder.addBinding(params, 'mieExponentialDistribution', { min: 0.1, max: 10, step: 0.1 }).on('change', (ev) => skyAtmosphere.mieExponentialDistribution = ev.value);

	// Rayleigh 산란
	const rayleighFolder = physicsFolder.addFolder({ title: 'Rayleigh Scattering', expanded: false });
	const updateRayleigh = () => { skyAtmosphere.rayleighScattering = [params.rayleighR, params.rayleighG, params.rayleighB]; };
	rayleighFolder.addBinding(params, 'rayleighR', { min: 0, max: 0.1, step: 0.0001 }).on('change', updateRayleigh);
	rayleighFolder.addBinding(params, 'rayleighG', { min: 0, max: 0.1, step: 0.0001 }).on('change', updateRayleigh);
	rayleighFolder.addBinding(params, 'rayleighB', { min: 0, max: 0.1, step: 0.0001 }).on('change', updateRayleigh);
	rayleighFolder.addBinding(params, 'rayleighExponentialDistribution', { min: 1, max: 20, step: 0.1 }).on('change', (ev) => skyAtmosphere.rayleighExponentialDistribution = ev.value);

	// 오존 흡수
	const ozoneFolder = physicsFolder.addFolder({ title: 'Ozone Absorption', expanded: false });
	const updateAbsorption = () => { skyAtmosphere.absorptionCoefficient = [params.absorptionR, params.absorptionG, params.absorptionB]; };
	ozoneFolder.addBinding(params, 'absorptionR', { min: 0, max: 0.1, step: 0.0001 }).on('change', updateAbsorption);
	ozoneFolder.addBinding(params, 'absorptionG', { min: 0, max: 0.1, step: 0.0001 }).on('change', updateAbsorption);
	ozoneFolder.addBinding(params, 'absorptionB', { min: 0, max: 0.1, step: 0.0001 }).on('change', updateAbsorption);
}
