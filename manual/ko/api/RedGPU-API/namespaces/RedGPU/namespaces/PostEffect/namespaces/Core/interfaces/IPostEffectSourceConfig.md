[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / IPostEffectSourceConfig

# Interface: IPostEffectSourceConfig

Defined in: [src/postEffect/core/types.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/types.ts#L26)

후처리 소스 텍스처 바인딩 설정 인터페이스입니다.

## Properties

### isSampled?

> `optional` **isSampled?**: `boolean` = `true`

Defined in: [src/postEffect/core/types.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/types.ts#L37)

샘플러와 함께 사용하는 샘플링 가능 타입(`texture_2d<f32>`) 여부

***

### name

> **name**: `string`

Defined in: [src/postEffect/core/types.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/types.ts#L31)

셰이더 내 텍스처 바인딩 식별자 이름
