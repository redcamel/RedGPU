[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_OPERATION

# Variable: GPU\_BLEND\_OPERATION

> `const` **GPU\_BLEND\_OPERATION**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_OPERATION.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_OPERATION.ts#L7)

Blending arithmetic operator constants that combine weighted source and destination color/alpha values.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-add"></a> `ADD` | `"add"` | `"add"` | Adds the weighted source and destination values. (`Src * SrcFactor + Dst * DstFactor`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_OPERATION.ts#L12) |
| <a id="property-max"></a> `MAX` | `"max"` | `"max"` | Selects the maximum value per channel between source and destination. (`max(Src, Dst)`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_OPERATION.ts#L32) |
| <a id="property-min"></a> `MIN` | `"min"` | `"min"` | Selects the minimum value per channel between source and destination. (`min(Src, Dst)`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_OPERATION.ts#L27) |
| <a id="property-reverse_subtract"></a> `REVERSE_SUBTRACT` | `"reverse-subtract"` | `"reverse-subtract"` | Subtracts the weighted source value from the weighted destination value. (`Dst * DstFactor - Src * SrcFactor`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_OPERATION.ts#L22) |
| <a id="property-subtract"></a> `SUBTRACT` | `"subtract"` | `"subtract"` | Subtracts the weighted destination value from the weighted source value. (`Src * SrcFactor - Dst * DstFactor`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_OPERATION.ts#L17) |
