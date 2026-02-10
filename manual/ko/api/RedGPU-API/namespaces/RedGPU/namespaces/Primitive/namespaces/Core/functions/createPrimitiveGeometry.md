[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / createPrimitiveGeometry

# Function: createPrimitiveGeometry()

> **createPrimitiveGeometry**(`redGPUContext`, `interleaveData`, `indexData`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/createPrimitiveGeometry.ts:33](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/primitive/core/createPrimitiveGeometry.ts#L33)

정점 데이터와 인덱스 데이터를 기반으로 기본 도형 지오메트리를 생성합니다.


### Example
```typescript
const geometry = RedGPU.Core.createPrimitiveGeometry(redGPUContext, interleaveData, indexData, "UniqueKey");
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `interleaveData` | `number`[] | 인터리브 형식의 정점 데이터 배열
| `indexData` | `number`[] | 인덱스 데이터 배열
| `uniqueKey` | `string` | 캐싱에 사용할 고유 키

## Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 Geometry 인스턴스

