[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_FACTOR

# Variable: GPU\_BLEND\_FACTOR

> `const` **GPU\_BLEND\_FACTOR**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_FACTOR.ts:10](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L10)


Constants defining factor options used in blending operations.


Determines the values multiplied by each channel when mixing source and destination colors.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="constant"></a> `CONSTANT` | `"constant"` | `"constant"` | Uses the constant color as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:70](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L70) |
| <a id="dst"></a> `DST` | `"dst"` | `"dst"` | Uses the destination color value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:45](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L45) |
| <a id="dst_alpha"></a> `DST_ALPHA` | `"dst-alpha"` | `"dst-alpha"` | Uses the destination alpha value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:55](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L55) |
| <a id="one"></a> `ONE` | `"one"` | `'one'` | Uses factor 1. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:20](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L20) |
| <a id="one_minus_constant"></a> `ONE_MINUS_CONSTANT` | `"one-minus-constant"` | `"one-minus-constant"` | Uses (1 - constant color) value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:75](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L75) |
| <a id="one_minus_dst"></a> `ONE_MINUS_DST` | `"one-minus-dst"` | `"one-minus-dst"` | Uses (1 - destination color) value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:50](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L50) |
| <a id="one_minus_dst_alpha"></a> `ONE_MINUS_DST_ALPHA` | `"one-minus-dst-alpha"` | `"one-minus-dst-alpha"` | Uses (1 - destination alpha) value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:60](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L60) |
| <a id="one_minus_src"></a> `ONE_MINUS_SRC` | `"one-minus-src"` | `"one-minus-src"` | Uses (1 - source color) value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:30](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L30) |
| <a id="one_minus_src_alpha"></a> `ONE_MINUS_SRC_ALPHA` | `"one-minus-src-alpha"` | `"one-minus-src-alpha"` | Uses (1 - source alpha) value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:40](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L40) |
| <a id="one_minus_src1"></a> `ONE_MINUS_SRC1` | `"one-minus-src1"` | `"one-minus-src1"` | Uses (1 - second source color) value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:85](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L85) |
| <a id="one_minus_src1_alpha"></a> `ONE_MINUS_SRC1_ALPHA` | `"one-minus-src1-alpha"` | `"one-minus-src1-alpha"` | Uses (1 - second source alpha) value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:95](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L95) |
| <a id="src"></a> `SRC` | `"src"` | `"src"` | Uses the source color value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:25](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L25) |
| <a id="src_alpha"></a> `SRC_ALPHA` | `"src-alpha"` | `"src-alpha"` | Uses the source alpha value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:35](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L35) |
| <a id="src_alpha_saturated"></a> `SRC_ALPHA_SATURATED` | `"src-alpha-saturated"` | `"src-alpha-saturated"` | Uses the saturated source alpha value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:65](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L65) |
| <a id="src1"></a> `SRC1` | `"src1"` | `"src1"` | Uses the second source color as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:80](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L80) |
| <a id="src1_alpha"></a> `SRC1_ALPHA` | `"src1-alpha"` | `"src1-alpha"` | Uses the second source alpha value as the factor. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:90](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L90) |
| <a id="zero"></a> `ZERO` | `"zero"` | `"zero"` | Uses factor 0. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:15](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L15) |
