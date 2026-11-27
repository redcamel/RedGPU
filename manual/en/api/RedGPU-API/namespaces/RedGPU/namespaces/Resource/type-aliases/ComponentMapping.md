[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / ComponentMapping

# Type Alias: ComponentMapping

> **ComponentMapping** = `object`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:20](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/resources/texture/packedTexture/PackedTexture.ts#L20)

Mapping type specifying which source texture channel each output channel (r/g/b/a) reads from.

Omitted channels use the channel of the same name. (e.g. `'r'` when `r` is omitted)

## Properties

### a?

> `optional` **a?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:24](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/resources/texture/packedTexture/PackedTexture.ts#L24)

***

### b?

> `optional` **b?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:23](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/resources/texture/packedTexture/PackedTexture.ts#L23)

***

### g?

> `optional` **g?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:22](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/resources/texture/packedTexture/PackedTexture.ts#L22)

***

### r?

> `optional` **r?**: `"r"` \| `"g"` \| `"b"` \| `"a"`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:21](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/resources/texture/packedTexture/PackedTexture.ts#L21)
