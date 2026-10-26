[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_FACTOR

# Variable: GPU\_BLEND\_FACTOR

> `const` **GPU\_BLEND\_FACTOR**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_FACTOR.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L7)

Weight factor constants multiplied with source and destination values in color and alpha blending operations of a render pipeline.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-constant"></a> `CONSTANT` | `"constant"` | `"constant"` | Applies the constant blend color (`blendConstant`) configured in the render pass as the weight factor. `(Rc, Gc, Bc, Ac)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:67](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L67) |
| <a id="property-dst"></a> `DST` | `"dst"` | `"dst"` | Applies the destination color currently stored in the render target as the weight factor. `(Rd, Gd, Bd, Ad)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L42) |
| <a id="property-dst_alpha"></a> `DST_ALPHA` | `"dst-alpha"` | `"dst-alpha"` | Applies the destination alpha value as the weight factor. `(Ad, Ad, Ad, Ad)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L52) |
| <a id="property-one"></a> `ONE` | `"one"` | `'one'` | Applies a weight factor of `1`. `(1, 1, 1, 1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L17) |
| <a id="property-one_minus_constant"></a> `ONE_MINUS_CONSTANT` | `"one-minus-constant"` | `"one-minus-constant"` | Applies one minus the constant blend color as the weight factor. `(1-Rc, 1-Gc, 1-Bc, 1-Ac)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L72) |
| <a id="property-one_minus_dst"></a> `ONE_MINUS_DST` | `"one-minus-dst"` | `"one-minus-dst"` | Applies one minus the destination color as the weight factor. `(1-Rd, 1-Gd, 1-Bd, 1-Ad)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L47) |
| <a id="property-one_minus_dst_alpha"></a> `ONE_MINUS_DST_ALPHA` | `"one-minus-dst-alpha"` | `"one-minus-dst-alpha"` | Applies one minus the destination alpha value as the weight factor. `(1-Ad, 1-Ad, 1-Ad, 1-Ad)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L57) |
| <a id="property-one_minus_src"></a> `ONE_MINUS_SRC` | `"one-minus-src"` | `"one-minus-src"` | Applies one minus the source color as the weight factor. `(1-Rs, 1-Gs, 1-Bs, 1-As)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L27) |
| <a id="property-one_minus_src_alpha"></a> `ONE_MINUS_SRC_ALPHA` | `"one-minus-src-alpha"` | `"one-minus-src-alpha"` | Applies one minus the source alpha value as the weight factor. `(1-As, 1-As, 1-As, 1-As)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L37) |
| <a id="property-one_minus_src1"></a> `ONE_MINUS_SRC1` | `"one-minus-src1"` | `"one-minus-src1"` | Applies one minus the secondary source color as the weight factor. `(1-Rs1, 1-Gs1, 1-Bs1, 1-As1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L82) |
| <a id="property-one_minus_src1_alpha"></a> `ONE_MINUS_SRC1_ALPHA` | `"one-minus-src1-alpha"` | `"one-minus-src1-alpha"` | Applies one minus the secondary source alpha value as the weight factor. `(1-As1, 1-As1, 1-As1, 1-As1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L92) |
| <a id="property-src"></a> `SRC` | `"src"` | `"src"` | Applies the source color output from the fragment shader as the weight factor. `(Rs, Gs, Bs, As)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L22) |
| <a id="property-src_alpha"></a> `SRC_ALPHA` | `"src-alpha"` | `"src-alpha"` | Applies the source alpha value as the weight factor. `(As, As, As, As)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L32) |
| <a id="property-src_alpha_saturated"></a> `SRC_ALPHA_SATURATED` | `"src-alpha-saturated"` | `"src-alpha-saturated"` | Applies saturated source alpha (`min(As, 1-Ad)`) for RGB channels and `1` for the alpha channel. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L62) |
| <a id="property-src1"></a> `SRC1` | `"src1"` | `"src1"` | Applies the secondary source color in dual-source blending as the weight factor. `(Rs1, Gs1, Bs1, As1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L77) |
| <a id="property-src1_alpha"></a> `SRC1_ALPHA` | `"src1-alpha"` | `"src1-alpha"` | Applies the secondary source alpha value as the weight factor. `(As1, As1, As1, As1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L87) |
| <a id="property-zero"></a> `ZERO` | `"zero"` | `"zero"` | Applies a weight factor of `0`. `(0, 0, 0, 0)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L12) |
