[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineColorRGB

# Function: defineColorRGB()

> **defineColorRGB**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/color/defineColorRGB.ts:99](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/defineProperty/funcs/color/defineColorRGB.ts#L99)

지정된 클래스의 프로토타입에 GPU와 연동되는 RGB 색상(ColorRGB) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineColorRGBInfo`](../interfaces/DefineColorRGBInfo.md) \| [`DefineColorRGBInfo`](../interfaces/DefineColorRGBInfo.md)[] | A single [DefineColorRGBInfo](../interfaces/DefineColorRGBInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- The getter returns a [ColorRGB](../../Color/classes/ColorRGB.md) instance.
- The setter accepts a hex color string (e.g. `#ff0000`) or a [ColorRGB](../../Color/classes/ColorRGB.md) instance.
- When the value changes, it automatically normalizes and writes to the GPU globalStruct buffer as linear RGB values (rgbNormalLinear).

## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, { key: 'albedoColor', value: '#ff0000' });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, [
  { key: 'emissiveColor', value: '#000000' },
  { key: 'specularColor', value: '#ffffff' }
]);
```
