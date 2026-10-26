[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineTexture

# Function: defineTexture()

> **defineTexture**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineTexture.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/texture/defineTexture.ts#L77)

Defines texture properties on the target's prototype that synchronize with GPU bind groups and uniform buffers.

Invokes `updateTexture(prevTexture, texture)` on the target when changed, and automatically updates the boolean state and uniform value (1 or 0) if a corresponding `use{Key}` property exists.

### Example
```typescript
// Define a single texture property
RedGPU.DefineGPUProperty.defineTexture(MyMaterial, { key: 'diffuseTexture' });

// Define multiple texture properties at once
RedGPU.DefineGPUProperty.defineTexture(MyMaterial, [
  { key: 'diffuseTexture' },
  { key: 'normalTexture' }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefineTextureInfo`](../interfaces/DefineTextureInfo.md) \| [`DefineTextureInfo`](../interfaces/DefineTextureInfo.md)[] | Single `DefineTextureInfo` configuration or an array of configurations |

## Returns

`void`
