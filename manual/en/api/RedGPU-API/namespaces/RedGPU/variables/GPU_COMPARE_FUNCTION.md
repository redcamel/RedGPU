[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_COMPARE\_FUNCTION

# Variable: GPU\_COMPARE\_FUNCTION

> `const` **GPU\_COMPARE\_FUNCTION**: `object`

Defined in: [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L7)

Comparison function constants used in depth/stencil tests and shadow comparison samplers.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-always"></a> `ALWAYS` | `"always"` | `'always'` | Comparison test always passes. (`true`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L47) |
| <a id="property-equal"></a> `EQUAL` | `"equal"` | `'equal'` | Passes if the new value is equal to the existing value. (`new == existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L22) |
| <a id="property-greater"></a> `GREATER` | `"greater"` | `'greater'` | Passes if the new value is strictly greater than the existing value. (`new > existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L32) |
| <a id="property-greater_equal"></a> `GREATER_EQUAL` | `"greater-equal"` | `'greater-equal'` | Passes if the new value is greater than or equal to the existing value. (`new >= existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L42) |
| <a id="property-less"></a> `LESS` | `"less"` | `'less'` | Passes if the new value is strictly less than the existing value. (`new < existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L17) |
| <a id="property-less_equal"></a> `LESS_EQUAL` | `"less-equal"` | `'less-equal'` | Passes if the new value is less than or equal to the existing value. (`new <= existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L27) |
| <a id="property-never"></a> `NEVER` | `"never"` | `'never'` | Comparison test always fails. (`false`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L12) |
| <a id="property-not_equal"></a> `NOT_EQUAL` | `"not-equal"` | `'not-equal'` | Passes if the new value is not equal to the existing value. (`new != existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L37) |
