[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / SkyAtmosphere

# Variable: SkyAtmosphere

> `const` **SkyAtmosphere**: `string` = `SkyAtmosphere_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2517](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L2517)

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
	groundRadius: f32,
	atmosphereHeight: f32,
	aerialPerspectiveDistanceScale: f32,
	aerialPerspectiveStartDepth: f32,
	sunIntensity: f32,
	sunSize: f32,
	sunLimbDarkening: f32,
	cameraHeight: f32,
	cloudTime: f32,
	cloudCoverage: f32,
	cloudDensity: f32,
	cloudHeight: f32
};
```
