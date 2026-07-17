[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineColorRGB

# Function: defineColorRGB()

> **defineColorRGB**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/color/defineColorRGB.ts:99](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/color/defineColorRGB.ts#L99)

지정된 클래스의 프로토타입에 GPU와 연동되는 RGB 색상(ColorRGB) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineColorRGBInfo`](../interfaces/DefineColorRGBInfo.md) \| [`DefineColorRGBInfo`](../interfaces/DefineColorRGBInfo.md)[] | 단일 [DefineColorRGBInfo](../interfaces/DefineColorRGBInfo.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 해당 속성의 getter는 [ColorRGB](../../Color/classes/ColorRGB.md) 인스턴스를 반환합니다.
- setter는 16진수 문자열(예: `#ff0000`) 또는 [ColorRGB](../../Color/classes/ColorRGB.md) 인스턴스를 허용합니다.
- 값이 설정되거나 내부 RGB 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼에 정규화된 선형 RGB 값(rgbNormalLinear)을 업데이트합니다.


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
