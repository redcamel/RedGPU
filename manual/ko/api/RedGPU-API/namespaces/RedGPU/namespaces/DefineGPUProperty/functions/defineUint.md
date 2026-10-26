[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineUint

# Function: defineUint()

> **defineUint**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineUint.ts#L101)

지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 부호 없는 정수(Uint) 속성을 정의합니다.

값 할당 시 0 이상의 정수 여부를 검사하며, `min`(기본값: 0) 및 `max` 범위를 벗어나면 경고 출력 후 경계값으로 클램핑하여 유니폼 버퍼를 갱신합니다.

### Example
```typescript
// 단일 부호 없는 정수 속성 정의
RedGPU.DefineGPUProperty.defineUint(MyMaterial, { key: 'lightType', value: 1, min: 0, max: 10 });

// 다중 부호 없는 정수 속성 일괄 정의
RedGPU.DefineGPUProperty.defineUint(MyMaterial, [
  { key: 'shadowMode', value: 0 },
  { key: 'maxLights', value: 4, min: 0, max: 16 }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 대상 클래스 또는 프로토타입 |
| `defineInfo` | [`DefineUintInfo`](../interfaces/DefineUintInfo.md) \| [`DefineUintInfo`](../interfaces/DefineUintInfo.md)[] | 단일 `DefineUintInfo` 설정 또는 설정 배열 |

## Returns

`void`
