#redgpu_include math.hash.getHash3D_vec3
#redgpu_include depth.getLinearizeDepth
struct Uniforms {
	rayleighScattering: vec3<f32>,
	rayleighScaleHeight: f32,
	mieScattering: vec3<f32>,
	mieAnisotropy: f32,
	mieAbsorption: vec3<f32>,
	mieScaleHeight: f32,
	absorptionCoefficient: vec3<f32>,
	absorptionTipAltitude: f32,
	groundAlbedo: vec3<f32>,
	absorptionTipWidth: f32,
	skyLuminanceFactor: vec3<f32>,
	multiScatteringFactor: f32,
	sunDirection: vec3<f32>,
	transmittanceMinLightElevationAngle: f32,
	bottomRadius: f32,
	atmosphereHeight: f32,
	aerialPerspectiveDistanceScale: f32,
	aerialPerspectiveStartDepth: f32,
	sunIntensity: f32,
	sunSize: f32,
	sunLimbDarkening: f32,
	cameraHeight: f32
};
