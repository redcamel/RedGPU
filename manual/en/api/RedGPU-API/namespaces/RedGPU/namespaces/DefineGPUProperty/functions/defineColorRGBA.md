[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineColorRGBA

# Function: defineColorRGBA()

> **defineColorRGBA**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/color/defineColorRGBA.ts:99](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/defineProperty/funcs/color/defineColorRGBA.ts#L99)

지정된 클래스의 프로토타입에 GPU와 연동되는 RGBA 색상(ColorRGBA) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineColorRGBAInfo`](../interfaces/DefineColorRGBAInfo.md) \| [`DefineColorRGBAInfo`](../interfaces/DefineColorRGBAInfo.md)[] | A single [DefineColorRGBAInfo](../interfaces/DefineColorRGBAInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- The getter returns a [ColorRGBA](../../Color/classes/ColorRGBA.md) instance.
- The setter accepts a hex color string (e.g. `#ff0000`) or a [ColorRGBA](../../Color/classes/ColorRGBA.md) instance.
- When the value changes, it automatically normalizes and writes to the GPU uniform buffer as linear RGBA values (rgbaNormalLinear).

## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, { key: 'diffuseColor', value: '#ff0000' });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, [
  { key: 'ambientColor', value: '#111111' },
  { key: 'specularColor', value: '#ffffff' }
]);
```
