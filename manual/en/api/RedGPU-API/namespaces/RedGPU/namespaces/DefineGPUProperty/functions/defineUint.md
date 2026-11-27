[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineUint

# Function: defineUint()

> **defineUint**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:101](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/defineProperty/funcs/number/defineUint.ts#L101)

Defines unsigned integer (Uint) properties on the target's prototype that synchronize with GPU uniform buffers.

Validates that the assigned value is an unsigned integer (`>= 0`), clamping out-of-bounds values to `min` (default: 0) or `max` with a warning before updating the uniform buffer.

### Example
```typescript
// Define a single unsigned integer property
RedGPU.DefineGPUProperty.defineUint(MyMaterial, { key: 'lightType', value: 1, min: 0, max: 10 });

// Define multiple unsigned integer properties at once
RedGPU.DefineGPUProperty.defineUint(MyMaterial, [
  { key: 'shadowMode', value: 0 },
  { key: 'maxLights', value: 4, min: 0, max: 16 }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class or prototype to define properties on |
| `defineInfo` | [`DefineUintInfo`](../interfaces/DefineUintInfo.md) \| [`DefineUintInfo`](../interfaces/DefineUintInfo.md)[] | Single `DefineUintInfo` configuration or an array of configurations |

## Returns

`void`
