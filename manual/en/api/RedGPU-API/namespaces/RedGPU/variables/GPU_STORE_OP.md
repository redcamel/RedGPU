[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_STORE\_OP

# Variable: GPU\_STORE\_OP

> `const` **GPU\_STORE\_OP**: `object`

Defined in: [src/gpuConst/GPU\_STORE\_OP.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_STORE_OP.ts#L7)

Store operation constants determining whether to preserve the rendered results of color or depth/stencil attachments in memory at the end of a render pass.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-discard"></a> `DISCARD` | `"discard"` | `'discard'` | Discards the rendered results without storing them to memory, conserving memory bandwidth. | [src/gpuConst/GPU\_STORE\_OP.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_STORE_OP.ts#L17) |
| <a id="property-store"></a> `STORE` | `"store"` | `'store'` | Stores the rendered results of the render pass into the attachment memory. | [src/gpuConst/GPU\_STORE\_OP.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_STORE_OP.ts#L12) |
