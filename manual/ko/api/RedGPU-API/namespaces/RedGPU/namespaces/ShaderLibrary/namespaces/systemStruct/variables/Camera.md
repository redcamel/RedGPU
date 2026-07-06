[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Camera

# Variable: Camera

> `const` **Camera**: `string` = `Camera_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2331](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/systemCodeManager/ShaderLibrary.ts#L2331)

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
