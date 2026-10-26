[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / definePositiveNumber

# Function: definePositiveNumber()

> **definePositiveNumber**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/definePositiveNumber.ts#L101)

Defines positive numeric properties on the target's prototype that synchronize with GPU uniform buffers.

Validates that the assigned value is a non-negative number (`>= 0`), clamping out-of-bounds values to `min` (default: 0) or `max` with a warning before updating the uniform buffer.

### Example
```typescript
// Define a single positive numeric property
RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, { key: 'shininess', value: 30, min: 0, max: 100 });

// Define multiple positive numeric properties at once
RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, [
  { key: 'fogDensity', value: 0.01, min: 0 },
  { key: 'roughness', value: 0.5, min: 0, max: 1 }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefinePositiveNumberInfo`](../interfaces/DefinePositiveNumberInfo.md) \| [`DefinePositiveNumberInfo`](../interfaces/DefinePositiveNumberInfo.md)[] | Single `DefinePositiveNumberInfo` configuration or an array of configurations |

## Returns

`void`
