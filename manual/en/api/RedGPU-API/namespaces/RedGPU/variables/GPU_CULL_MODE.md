[**RedGPU API v4.0.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_CULL\_MODE

# Variable: GPU\_CULL\_MODE

> `const` **GPU\_CULL\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_CULL\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_CULL_MODE.ts#L10)


Constants defining which faces to cull during rendering.


Determines whether to exclude front or back faces from rendering relative to the camera.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-back"></a> `BACK` | `"back"` | `'back'` | Culls back faces, rendering only front faces. (Standard setting) | [src/gpuConst/GPU\_CULL\_MODE.ts:25](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_CULL_MODE.ts#L25) |
| <a id="property-front"></a> `FRONT` | `"front"` | `'front'` | Culls front faces, rendering only back faces. | [src/gpuConst/GPU\_CULL\_MODE.ts:20](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_CULL_MODE.ts#L20) |
| <a id="property-none"></a> `NONE` | `"none"` | `'none'` | Does not perform any culling. | [src/gpuConst/GPU\_CULL\_MODE.ts:15](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_CULL_MODE.ts#L15) |
