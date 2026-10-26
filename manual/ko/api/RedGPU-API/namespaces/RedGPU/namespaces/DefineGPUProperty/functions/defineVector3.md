[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector3

# Function: defineVector3()

> **defineVector3**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector3.ts#L53)

지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 3차원 벡터(`[number, number, number]`) 속성을 정의합니다.

### Example
```typescript
// 단일 3차원 벡터 속성 정의
RedGPU.DefineGPUProperty.defineVector3(MyMaterial, { key: 'lightPosition', value: [0, 10, 0] });

// 다중 3차원 벡터 속성 일괄 정의
RedGPU.DefineGPUProperty.defineVector3(MyMaterial, [
  { key: 'direction', value: [0, -1, 0] },
  { key: 'gravity', value: [0, -9.8, 0] }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 대상 클래스 또는 프로토타입 |
| `defineInfo` | [`DefineVector3Info`](../interfaces/DefineVector3Info.md) \| [`DefineVector3Info`](../interfaces/DefineVector3Info.md)[] | 단일 `DefineVector3Info` 설정 또는 설정 배열 |

## Returns

`void`
