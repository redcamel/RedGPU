[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineNumber

# Function: defineNumber()

> **defineNumber**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/defineNumber.ts#L101)

지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 숫자(Number) 속성을 정의합니다.

값 할당 시 숫자 유효성 검사를 수행하며, `min` 및 `max` 범위를 벗어나면 경고 출력 후 경계값으로 클램핑하여 유니폼 버퍼를 갱신합니다.

### Example
```typescript
// 단일 숫자 속성 정의 (범위 제한 포함)
RedGPU.DefineGPUProperty.defineNumber(MyMaterial, { key: 'roughness', value: 0.5, min: 0, max: 1 });

// 다중 숫자 속성 일괄 정의
RedGPU.DefineGPUProperty.defineNumber(MyMaterial, [
  { key: 'opacity', value: 1.0, min: 0, max: 1 },
  { key: 'shininess', value: 30 }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 대상 클래스 또는 프로토타입 |
| `defineInfo` | [`DefineNumberInfo`](../interfaces/DefineNumberInfo.md) \| [`DefineNumberInfo`](../interfaces/DefineNumberInfo.md)[] | 단일 `DefineNumberInfo` 설정 또는 설정 배열 |

## Returns

`void`
