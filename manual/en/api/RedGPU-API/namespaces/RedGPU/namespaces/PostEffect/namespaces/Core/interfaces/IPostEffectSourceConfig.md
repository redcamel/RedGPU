[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / IPostEffectSourceConfig

# Interface: IPostEffectSourceConfig

Defined in: [src/postEffect/core/types.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/types.ts#L26)

Interface for post-processing source texture binding configuration.

## Properties

### isSampled?

> `optional` **isSampled?**: `boolean` = `true`

Defined in: [src/postEffect/core/types.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/types.ts#L37)

Whether to use as a sampleable texture type (`texture_2d<f32>`) with a sampler

***

### name

> **name**: `string`

Defined in: [src/postEffect/core/types.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/types.ts#L31)

Texture binding identifier name in the shader
