[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_ADDRESS\_MODE

# Variable: GPU\_ADDRESS\_MODE

> `const` **GPU\_ADDRESS\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_ADDRESS\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_ADDRESS_MODE.ts#L7)

Sampling wrapping mode constants applied when texture coordinates fall outside the normalized range (`[0, 1]`).

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-clamp_to_edge"></a> `CLAMP_TO_EDGE` | `"clamp-to-edge"` | `'clamp-to-edge'` | Clamps out-of-range coordinates to the edge values (`0.0` or `1.0`). | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_ADDRESS_MODE.ts#L12) |
| <a id="property-mirrored_repeat"></a> `MIRRORED_REPEAT` | `"mirror-repeat"` | `'mirror-repeat'` | Repeats the texture tile while mirroring it across each integer boundary. | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_ADDRESS_MODE.ts#L22) |
| <a id="property-repeat"></a> `REPEAT` | `"repeat"` | `'repeat'` | Repeats the texture tile periodically by taking only the fractional part of coordinates. | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_ADDRESS_MODE.ts#L17) |
