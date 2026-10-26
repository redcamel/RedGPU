[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineColorRGBA

# Function: defineColorRGBA()

> **defineColorRGBA**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/color/defineColorRGBA.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/color/defineColorRGBA.ts#L102)

Dynamically defines `ColorRGBA` properties linked to the GPU uniform buffer on the target class prototype.

The setter accepts a hex color string (e.g., `'#ff0000'`) or a `ColorRGBA` instance, automatically writing normalized linear RGBA values (`rgbaNormalLinear`) to the uniform buffer on change.

### Example
```typescript
// Define a single RGBA color property
RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, { key: 'diffuseColor', value: '#ff0000' });

// Define multiple RGBA color properties at once
RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, [
    { key: 'ambientColor', value: '#111111' },
    { key: 'specularColor', value: '#ffffff' }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class constructor to define properties on |
| `defineInfo` | [`DefineColorRGBAInfo`](../interfaces/DefineColorRGBAInfo.md) \| [`DefineColorRGBAInfo`](../interfaces/DefineColorRGBAInfo.md)[] | Single `DefineColorRGBAInfo` configuration object or array of configurations |

## Returns

`void`
