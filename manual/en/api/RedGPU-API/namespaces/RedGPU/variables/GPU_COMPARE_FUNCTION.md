[**RedGPU API v4.0.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_COMPARE\_FUNCTION

# Variable: GPU\_COMPARE\_FUNCTION

> `const` **GPU\_COMPARE\_FUNCTION**: `object`

Defined in: [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:10](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L10)


Constants defining comparison function options.


Determines how two values are compared in depth or stencil tests.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-always"></a> `ALWAYS` | `"always"` | `'always'` | Causes the comparison test to always pass. | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:50](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L50) |
| <a id="property-equal"></a> `EQUAL` | `"equal"` | `'equal'` | Passes if the new value is equal to the existing value. | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:25](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L25) |
| <a id="property-greater"></a> `GREATER` | `"greater"` | `'greater'` | Passes if the new value is greater than the existing value. | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:35](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L35) |
| <a id="property-greater_equal"></a> `GREATER_EQUAL` | `"greater-equal"` | `'greater-equal'` | Passes if the new value is greater than or equal to the existing value. | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:45](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L45) |
| <a id="property-less"></a> `LESS` | `"less"` | `'less'` | Passes if the new value is less than the existing value. | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:20](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L20) |
| <a id="property-less_equal"></a> `LESS_EQUAL` | `"less-equal"` | `'less-equal'` | Passes if the new value is less than or equal to the existing value. | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:30](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L30) |
| <a id="property-never"></a> `NEVER` | `"never"` | `'never'` | Causes the comparison test to always fail. | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:15](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L15) |
| <a id="property-not_equal"></a> `NOT_EQUAL` | `"not-equal"` | `'not-equal'` | Passes if the new value is not equal to the existing value. | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:40](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L40) |
