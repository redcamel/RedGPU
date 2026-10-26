[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / ComponentMapping

# Type Alias: ComponentMapping

> **ComponentMapping** = `object`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L18)

Mapping type specifying which source texture channel each output channel (r/g/b/a) reads from.

Omitted channels use the channel of the same name. (e.g. `'r'` when `r` is omitted)

## Properties

### a?

> `optional` **a?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L22)

***

### b?

> `optional` **b?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L21)

***

### g?

> `optional` **g?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L20)

***

### r?

> `optional` **r?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L19)
