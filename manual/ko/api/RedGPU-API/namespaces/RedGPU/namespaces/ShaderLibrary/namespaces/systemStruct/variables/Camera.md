[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Camera

# Variable: Camera

> `const` **Camera**: `string` = `Camera_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2299](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L2299)

카메라(Camera) 구조체 정의입니다.

```wgsl
struct Camera {
    viewMatrix: mat4x4<f32>,
    inverseViewMatrix: mat4x4<f32>,
    cameraPosition: vec3<f32>,
    nearClipping: f32,
    farClipping: f32,
    fieldOfView: f32,
    ev100: f32,
    _pad_exposure: f32,
    aperture: f32,
    shutterSpeed: f32,
    iso: f32,
    _pad: f32
};
```
