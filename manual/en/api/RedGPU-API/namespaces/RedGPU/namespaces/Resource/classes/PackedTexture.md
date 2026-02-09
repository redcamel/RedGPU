[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / PackedTexture

# Class: PackedTexture

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:38](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L38)


Utility class that packs channels from multiple textures into a single texture.


By assigning specific channels from different textures to the r, g, b, and a channels, you can reduce memory usage and increase rendering efficiency.

* ### Example
```typescript
const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
await packed.packing({
  r: texture1.gpuTexture,
  g: texture2.gpuTexture
}, 512, 512);
```

## Constructors

### Constructor

> **new PackedTexture**(`redGPUContext`): `PackedTexture`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:61](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L61)


Creates a PackedTexture instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`PackedTexture`

## Accessors

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:74](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L74)

Packed result GPUTexture object

##### Returns

`GPUTexture`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:69](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L69)

Instance unique identifier

##### Returns

`string`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:130](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L130)

Destroys the instance and manages the cache.

#### Returns

`void`

***

### packing()

> **packing**(`textures`, `width`, `height`, `label?`, `componentMapping?`): `Promise`\<`void`\>

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:102](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L102)


Creates a packed texture by combining channels from multiple textures.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `textures` | \{ `a?`: `GPUTexture`; `b?`: `GPUTexture`; `g?`: `GPUTexture`; `r?`: `GPUTexture`; \} | Source GPUTexture object map for each r/g/b/a channel |
| `textures.a?` | `GPUTexture` | - |
| `textures.b?` | `GPUTexture` | - |
| `textures.g?` | `GPUTexture` | - |
| `textures.r?` | `GPUTexture` | - |
| `width?` | `number` | Resulting texture width |
| `height?` | `number` | Resulting texture height |
| `label?` | `string` | Texture label (optional) |
| `componentMapping?` | `ComponentMapping` | Component mapping info (optional) |

#### Returns

`Promise`\<`void`\>

***

### getCacheMap()

> `static` **getCacheMap**(): `Map`\<`string`, \{ `gpuTexture`: `GPUTexture`; `mappingKey`: `string`; `useNum`: `number`; `uuid`: `string`; \}\>

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:79](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L79)

Returns the packed texture cache map.

#### Returns

`Map`\<`string`, \{ `gpuTexture`: `GPUTexture`; `mappingKey`: `string`; `useNum`: `number`; `uuid`: `string`; \}\>
