[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineBoolean

# Function: defineBoolean()

> **defineBoolean**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/defineBoolean.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/defineBoolean.ts#L85)

Dynamically defines boolean (`boolean`) properties linked to the GPU uniform buffer on the target class prototype.

On value change, writes `1` (`true`) or `0` (`false`) to the GPU uniform buffer and sets the `dirtyPipeline` flag to `true`.

### Example
```typescript
// Define a single boolean property
RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: true });

// Define multiple boolean properties at once
RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, [
    { key: 'useAlphaTest', value: true },
    { key: 'useNormalMap', value: false }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class constructor to define properties on |
| `defineInfo` | [`DefineBooleanInfo`](../interfaces/DefineBooleanInfo.md) \| [`DefineBooleanInfo`](../interfaces/DefineBooleanInfo.md)[] | Single `DefineBooleanInfo` configuration object or array of configurations |

## Returns

`void`
