[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineSampler

# Function: defineSampler()

> **defineSampler**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineSampler.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/texture/defineSampler.ts#L64)

Defines texture sampler properties on the target's prototype that synchronize with GPU bind groups.

Invokes `updateSampler(prevSampler, sampler)` on the target when changed to automatically update the bind group.

### Example
```typescript
// Define a single sampler property
RedGPU.DefineGPUProperty.defineSampler(MyMaterial, { key: 'diffuseSampler' });

// Define multiple sampler properties at once
RedGPU.DefineGPUProperty.defineSampler(MyMaterial, [
  { key: 'diffuseSampler' },
  { key: 'normalSampler' }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefineSamplerInfo`](../interfaces/DefineSamplerInfo.md) \| [`DefineSamplerInfo`](../interfaces/DefineSamplerInfo.md)[] | Single `DefineSamplerInfo` configuration or an array of configurations |

## Returns

`void`
