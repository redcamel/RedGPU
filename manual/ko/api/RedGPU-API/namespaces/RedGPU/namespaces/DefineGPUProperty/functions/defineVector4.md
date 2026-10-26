[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector4

# Function: defineVector4()

> **defineVector4**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector4.ts#L53)

지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 4차원 벡터(`[number, number, number, number]`) 속성을 정의합니다.

### Example
```typescript
// 단일 4차원 벡터 속성 정의
RedGPU.DefineGPUProperty.defineVector4(MyMaterial, { key: 'lightColor', value: [1, 1, 1, 1] });

// 다중 4차원 벡터 속성 일괄 정의
RedGPU.DefineGPUProperty.defineVector4(MyMaterial, [
  { key: 'tilingAndOffset', value: [1, 1, 0, 0] },
  { key: 'viewport', value: [0, 0, 1920, 1080] }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 대상 클래스 또는 프로토타입 |
| `defineInfo` | [`DefineVector4Info`](../interfaces/DefineVector4Info.md) \| [`DefineVector4Info`](../interfaces/DefineVector4Info.md)[] | 단일 `DefineVector4Info` 설정 또는 설정 배열 |

## Returns

`void`
