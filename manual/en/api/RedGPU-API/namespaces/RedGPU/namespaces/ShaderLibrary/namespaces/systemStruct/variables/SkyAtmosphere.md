[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / SkyAtmosphere

# Variable: SkyAtmosphere

> `const` **SkyAtmosphere**: `string` = `SkyAtmosphere_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2411](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/systemCodeManager/ShaderLibrary.ts#L2411)

Definition of the SkyAtmosphere parameters structure.

```wgsl
struct SkyAtmosphere {
	rayleighScattering: vec3<f32>,
	rayleighExponentialDistribution: f32,
	mieScattering: vec3<f32>,
	mieAnisotropy: f32,
	mieAbsorption: vec3<f32>,
	mieExponentialDistribution: f32,
	absorptionCoefficient: vec3<f32>,
	absorptionTipAltitude: f32,
	groundAlbedo: vec3<f32>,
	absorptionTentWidth: f32,
	skyLuminanceFactor: vec3<f32>,
	multiScatteringFactor: f32,
	sunDirection: vec3<f32>,
	transmittanceMinLightElevationAngle: f32,
	groundRadius: f32,
	atmosphereHeight: f32,
	aerialPerspectiveDistanceScale: f32,
	aerialPerspectiveStartDepth: f32,
	sunIntensity: f32,
	sunSize: f32,
	sunLimbDarkening: f32,
	cameraHeight: f32,
	cloudTime: f32,
	cloudTimeMultiplier: f32,
	cloudCoverage: f32,
	cloudDensity: f32,
	cloudHeight: f32
};
```
