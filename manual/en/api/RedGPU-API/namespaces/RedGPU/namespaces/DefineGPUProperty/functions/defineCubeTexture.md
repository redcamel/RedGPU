[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineCubeTexture

# Function: defineCubeTexture()

> **defineCubeTexture**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineCubeTexture.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/texture/defineCubeTexture.ts#L77)

Defines cube texture properties on the target's prototype that synchronize with GPU bind groups and uniform buffers.

Invokes `updateTexture(prevTexture, texture)` on the target when changed, and automatically updates the boolean state and uniform value (1 or 0) if a corresponding `use{Key}` property exists.

### Example
```typescript
// Define a single cube texture property
RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, { key: 'envTexture' });

// Define multiple cube texture properties at once
RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, [
  { key: 'skyboxTexture' },
  { key: 'reflectionTexture' }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefineCubeTextureInfo`](../interfaces/DefineCubeTextureInfo.md) \| [`DefineCubeTextureInfo`](../interfaces/DefineCubeTextureInfo.md)[] | Single `DefineCubeTextureInfo` configuration or an array of configurations |

## Returns

`void`
