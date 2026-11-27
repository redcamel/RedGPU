[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector4

# Function: defineVector4()

> **defineVector4**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:53](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/defineProperty/funcs/vector/defineVector4.ts#L53)

Defines 4D vector (`[number, number, number, number]`) properties on the target's prototype that synchronize with the GPU uniform buffer.

### Example
```typescript
// Define a single 4D vector property
RedGPU.DefineGPUProperty.defineVector4(MyMaterial, { key: 'lightColor', value: [1, 1, 1, 1] });

// Define multiple 4D vector properties at once
RedGPU.DefineGPUProperty.defineVector4(MyMaterial, [
  { key: 'tilingAndOffset', value: [1, 1, 0, 0] },
  { key: 'viewport', value: [0, 0, 1920, 1080] }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefineVector4Info`](../interfaces/DefineVector4Info.md) \| [`DefineVector4Info`](../interfaces/DefineVector4Info.md)[] | Single `DefineVector4Info` configuration or an array of configurations |

## Returns

`void`
