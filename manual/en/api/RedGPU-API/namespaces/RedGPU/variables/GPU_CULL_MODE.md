[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_CULL\_MODE

# Variable: GPU\_CULL\_MODE

> `const` **GPU\_CULL\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_CULL\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/gpuConst/GPU_CULL_MODE.ts#L10)


Constants defining which faces to cull during rendering.


Determines whether to exclude front or back faces from rendering relative to the camera.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="back"></a> `BACK` | `"back"` | `'back'` | Culls back faces, rendering only front faces. (Standard setting) | [src/gpuConst/GPU\_CULL\_MODE.ts:25](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/gpuConst/GPU_CULL_MODE.ts#L25) |
| <a id="front"></a> `FRONT` | `"front"` | `'front'` | Culls front faces, rendering only back faces. | [src/gpuConst/GPU\_CULL\_MODE.ts:20](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/gpuConst/GPU_CULL_MODE.ts#L20) |
| <a id="none"></a> `NONE` | `"none"` | `'none'` | Does not perform any culling. | [src/gpuConst/GPU\_CULL\_MODE.ts:15](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/gpuConst/GPU_CULL_MODE.ts#L15) |
