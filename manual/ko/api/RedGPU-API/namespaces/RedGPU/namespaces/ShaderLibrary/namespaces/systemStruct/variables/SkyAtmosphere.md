[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / SkyAtmosphere

# Variable: SkyAtmosphere

> `const` **SkyAtmosphere**: `string` = `SkyAtmosphere_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2444](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/systemCodeManager/ShaderLibrary.ts#L2444)

대기 산란(SkyAtmosphere) 파라미터 구조체 정의입니다.

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
