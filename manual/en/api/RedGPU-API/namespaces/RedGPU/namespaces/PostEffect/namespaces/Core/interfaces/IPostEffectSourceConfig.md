[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / IPostEffectSourceConfig

# Interface: IPostEffectSourceConfig

Defined in: [src/postEffect/core/types.ts:26](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/postEffect/core/types.ts#L26)

Interface for post-processing source texture binding configuration.

## Properties

### name

> **name**: `string`

Defined in: [src/postEffect/core/types.ts:31](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/postEffect/core/types.ts#L31)

Texture binding identifier name in the shader

***

### textureType?

> `optional` **textureType?**: `string`

Defined in: [src/postEffect/core/types.ts:37](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/postEffect/core/types.ts#L37)

Explicit WGSL texture type (e.g., `'texture_2d<f32>'`, `'texture_3d<f32>'`)

#### Default Value

`'texture_2d<f32>'`
