[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector3

# Function: defineVector3()

> **defineVector3**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/vector/defineVector3.ts#L53)

Defines 3D vector (`[number, number, number]`) properties on the target's prototype that synchronize with the GPU uniform buffer.

### Example
```typescript
// Define a single 3D vector property
RedGPU.DefineGPUProperty.defineVector3(MyMaterial, { key: 'lightPosition', value: [0, 10, 0] });

// Define multiple 3D vector properties at once
RedGPU.DefineGPUProperty.defineVector3(MyMaterial, [
  { key: 'direction', value: [0, -1, 0] },
  { key: 'gravity', value: [0, -9.8, 0] }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefineVector3Info`](../interfaces/DefineVector3Info.md) \| [`DefineVector3Info`](../interfaces/DefineVector3Info.md)[] | Single `DefineVector3Info` configuration or an array of configurations |

## Returns

`void`
