[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineNumber

# Function: defineNumber()

> **defineNumber**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:101](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/defineProperty/funcs/number/defineNumber.ts#L101)

Defines numeric properties on the target's prototype that synchronize with GPU uniform buffers.

Validates numeric input upon assignment, clamping out-of-bounds values to `min` or `max` with a warning before updating the uniform buffer.

### Example
```typescript
// Define a single numeric property (with range limits)
RedGPU.DefineGPUProperty.defineNumber(MyMaterial, { key: 'roughness', value: 0.5, min: 0, max: 1 });

// Define multiple numeric properties at once
RedGPU.DefineGPUProperty.defineNumber(MyMaterial, [
  { key: 'opacity', value: 1.0, min: 0, max: 1 },
  { key: 'shininess', value: 30 }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefineNumberInfo`](../interfaces/DefineNumberInfo.md) \| [`DefineNumberInfo`](../interfaces/DefineNumberInfo.md)[] | Single `DefineNumberInfo` configuration or an array of configurations |

## Returns

`void`
