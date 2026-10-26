[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineColorRGB

# Function: defineColorRGB()

> **defineColorRGB**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/color/defineColorRGB.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/color/defineColorRGB.ts#L102)

대상 클래스의 프로토타입에 GPU 유니폼 버퍼와 연동되는 `ColorRGB` 프로퍼티를 동적으로 정의합니다.

Setter는 16진수 색상 문자열(예: `'#ff0000'`) 또는 `ColorRGB` 인스턴스를 허용하며, 값 변경 시 정규화된 선형 RGB 값(`rgbNormalLinear`)을 유니폼 버퍼에 자동 기록합니다.

### Example
```typescript
// 단일 RGB 색상 프로퍼티 정의
RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, { key: 'albedoColor', value: '#ff0000' });

// 다중 RGB 색상 프로퍼티 일괄 정의
RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, [
    { key: 'emissiveColor', value: '#000000' },
    { key: 'specularColor', value: '#ffffff' }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 프로퍼티를 정의할 대상 클래스 생성자 |
| `defineInfo` | [`DefineColorRGBInfo`](../interfaces/DefineColorRGBInfo.md) \| [`DefineColorRGBInfo`](../interfaces/DefineColorRGBInfo.md)[] | 단일 `DefineColorRGBInfo` 설정 객체 또는 설정 배열 |

## Returns

`void`
