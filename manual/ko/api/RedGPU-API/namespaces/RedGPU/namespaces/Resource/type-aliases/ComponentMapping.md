[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / ComponentMapping

# Type Alias: ComponentMapping

> **ComponentMapping** = `object`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:20](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/texture/packedTexture/PackedTexture.ts#L20)

결과 텍스처의 각 채널(r/g/b/a)이 소스 텍스처의 어느 채널을 읽을지 지정하는 매핑 타입입니다.

생략된 채널은 동일한 이름의 채널을 사용합니다. (예: `r` 생략 시 `'r'`)

## Properties

### a?

> `optional` **a?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:24](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/texture/packedTexture/PackedTexture.ts#L24)

***

### b?

> `optional` **b?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:23](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/texture/packedTexture/PackedTexture.ts#L23)

***

### g?

> `optional` **g?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:22](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/texture/packedTexture/PackedTexture.ts#L22)

***

### r?

> `optional` **r?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:21](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/texture/packedTexture/PackedTexture.ts#L21)
