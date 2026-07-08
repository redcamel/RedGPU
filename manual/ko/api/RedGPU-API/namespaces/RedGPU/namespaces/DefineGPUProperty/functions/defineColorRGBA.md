[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineColorRGBA

# Function: defineColorRGBA()

> **defineColorRGBA**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/color/defineColorRGBA.ts:99](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/defineProperty/funcs/color/defineColorRGBA.ts#L99)

지정된 클래스의 프로토타입에 GPU와 연동되는 RGBA 색상(ColorRGBA) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineColorRGBAInfo`](../interfaces/DefineColorRGBAInfo.md) \| [`DefineColorRGBAInfo`](../interfaces/DefineColorRGBAInfo.md)[] | 단일 [DefineColorRGBAInfo](../interfaces/DefineColorRGBAInfo.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 해당 속성의 getter는 [ColorRGBA](../../Color/classes/ColorRGBA.md) 인스턴스를 반환합니다.
- setter는 16진수 문자열(예: `#ff0000`) 또는 [ColorRGBA](../../Color/classes/ColorRGBA.md) 인스턴스를 허용합니다.
- 값이 설정되거나 내부 RGBA(알파 포함) 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼에 정규화된 선형 RGBA 값(rgbaNormalLinear)을 업데이트합니다.


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
