[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / createPrimitiveGeometry

# Function: createPrimitiveGeometry()

> **createPrimitiveGeometry**(`redGPUContext`, `interleaveData`, `indexData`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/createPrimitiveGeometry.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/primitive/core/createPrimitiveGeometry.ts#L38)

인터리브 정점 데이터와 인덱스 배열로부터 기본 도형 `Geometry` 인스턴스를 생성합니다.

### Example
```typescript
const geometry = RedGPU.Primitive.Core.createPrimitiveGeometry(
    redGPUContext,
    interleaveData,
    indexData,
    'CUSTOM_KEY'
);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `interleaveData` | `number`[] | 인터리브 형식의 정점 데이터 배열 (`Array<number>`) |
| `indexData` | `number`[] | 정점 인덱스 데이터 배열 (`Array<number>`) |
| `uniqueKey` | `string` | 버퍼 라벨 지정 및 캐싱에 사용할 고유 키 |

## Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스
