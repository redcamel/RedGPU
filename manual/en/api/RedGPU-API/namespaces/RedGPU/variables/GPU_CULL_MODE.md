[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_CULL\_MODE

# Variable: GPU\_CULL\_MODE

> `const` **GPU\_CULL\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_CULL\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_CULL_MODE.ts#L7)

Constants determining whether to cull front or back-facing polygons relative to the camera in a render pipeline.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-back"></a> `BACK` | `"back"` | `'back'` | Culls back faces, rendering only front faces. | [src/gpuConst/GPU\_CULL\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_CULL_MODE.ts#L22) |
| <a id="property-front"></a> `FRONT` | `"front"` | `'front'` | Culls front faces, rendering only back faces. | [src/gpuConst/GPU\_CULL\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_CULL_MODE.ts#L17) |
| <a id="property-none"></a> `NONE` | `"none"` | `'none'` | Performs no face culling and renders both sides. | [src/gpuConst/GPU\_CULL\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_CULL_MODE.ts#L12) |
