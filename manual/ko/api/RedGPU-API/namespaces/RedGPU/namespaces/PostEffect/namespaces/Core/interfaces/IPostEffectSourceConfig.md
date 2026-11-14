[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / IPostEffectSourceConfig

# Interface: IPostEffectSourceConfig

Defined in: [src/postEffect/core/types.ts:26](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/types.ts#L26)

후처리 소스 텍스처 바인딩 설정 인터페이스입니다.

## Properties

### name

> **name**: `string`

Defined in: [src/postEffect/core/types.ts:31](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/types.ts#L31)

셰이더 내 텍스처 바인딩 식별자 이름

***

### textureType?

> `optional` **textureType?**: `string`

Defined in: [src/postEffect/core/types.ts:37](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/types.ts#L37)

명시적 WGSL 텍스처 타입 (예: `'texture_2d<f32>'`, `'texture_3d<f32>'`)

#### Default Value

`'texture_2d<f32>'`
