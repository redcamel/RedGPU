[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineColorRGB

# Function: defineColorRGB()

> **defineColorRGB**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/color/defineColorRGB.ts:102](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/defineProperty/funcs/color/defineColorRGB.ts#L102)

Dynamically defines `ColorRGB` properties linked to the GPU uniform buffer on the target class prototype.

The setter accepts a hex color string (e.g., `'#ff0000'`) or a `ColorRGB` instance, automatically writing normalized linear RGB values (`rgbNormalLinear`) to the uniform buffer on change.

### Example
```typescript
// Define a single RGB color property
RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, { key: 'albedoColor', value: '#ff0000' });

// Define multiple RGB color properties at once
RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, [
    { key: 'emissiveColor', value: '#000000' },
    { key: 'specularColor', value: '#ffffff' }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target class constructor to define properties on |
| `defineInfo` | [`DefineColorRGBInfo`](../interfaces/DefineColorRGBInfo.md) \| [`DefineColorRGBInfo`](../interfaces/DefineColorRGBInfo.md)[] | Single `DefineColorRGBInfo` configuration object or array of configurations |

## Returns

`void`
