[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector2

# Function: defineVector2()

> **defineVector2**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector2.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector2.ts#L53)

Defines 2D vector (`[number, number]`) properties on the target's prototype that synchronize with the GPU uniform buffer.

### Example
```typescript
// Define a single 2D vector property
RedGPU.DefineGPUProperty.defineVector2(MyMaterial, { key: 'uvScale', value: [1, 1] });

// Define multiple 2D vector properties at once
RedGPU.DefineGPUProperty.defineVector2(MyMaterial, [
  { key: 'uvOffset', value: [0, 0] },
  { key: 'tiling', value: [2, 2] }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefineVector2Info`](../interfaces/DefineVector2Info.md) \| [`DefineVector2Info`](../interfaces/DefineVector2Info.md)[] | Single `DefineVector2Info` configuration or an array of configurations |

## Returns

`void`
