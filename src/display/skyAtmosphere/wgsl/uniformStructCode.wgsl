#redgpu_include math.hash.getHash3D_vec3
#redgpu_include depth.getLinearizeDepth
struct Uniforms {
	rayleighScattering: vec3<f32>,
	rayleighExponentialDistribution: f32,
	mieScattering: f32,
	mieAbsorption: f32,
	mieAnisotropy: f32,
	mieExponentialDistribution: f32,
	absorptionCoefficient: vec3<f32>,
	absorptionTipAltitude: f32,
	absorptionTentWidth: f32,
	bottomRadius: f32,
	atmosphereHeight: f32,
	multiScatteringFactor: f32,
	skyLuminanceFactor: f32,
	sunDirection: vec3<f32>,
	sunIntensity: f32,
	sunSize: f32,
	sunLimbDarkening: f32,
	aerialPerspectiveDistanceScale: f32,
	cameraHeight: f32
};
