[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / definePositiveNumber

# Function: definePositiveNumber()

> **definePositiveNumber**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/definePositiveNumber.ts#L101)

지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 양수(Positive Number) 범위 속성을 정의합니다.

값 할당 시 0 이상의 양수 여부를 검사하며, `min`(기본값: 0) 및 `max` 범위를 벗어나면 경고 출력 후 경계값으로 클램핑하여 유니폼 버퍼를 갱신합니다.

### Example
```typescript
// 단일 양수 속성 정의
RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, { key: 'shininess', value: 30, min: 0, max: 100 });

// 다중 양수 속성 일괄 정의
RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, [
  { key: 'fogDensity', value: 0.01, min: 0 },
  { key: 'roughness', value: 0.5, min: 0, max: 1 }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 대상 클래스 또는 프로토타입 |
| `defineInfo` | [`DefinePositiveNumberInfo`](../interfaces/DefinePositiveNumberInfo.md) \| [`DefinePositiveNumberInfo`](../interfaces/DefinePositiveNumberInfo.md)[] | 단일 `DefinePositiveNumberInfo` 설정 또는 설정 배열 |

## Returns

`void`
