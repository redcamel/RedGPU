[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector3

# Function: defineVector3()

> **defineVector3**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:51](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/defineProperty/funcs/vector/defineVector3.ts#L51)

지정된 클래스의 프로토타입에 GPU와 연동되는 3차원 벡터(Vector3) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineVector3Info`](../interfaces/DefineVector3Info.md) \| [`DefineVector3Info`](../interfaces/DefineVector3Info.md)[] | A single [DefineVector3Info](../interfaces/DefineVector3Info.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Handles a 3-tuple array (`[number, number, number]`).
- Automatically updates the GPU globalStruct buffer on value change.

## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineVector3(MyMaterial, { key: 'lightPosition', value: [0, 10, 0] });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineVector3(MyMaterial, [
  { key: 'direction', value: [0, -1, 0] },
  { key: 'gravity', value: [0, -9.8, 0] }
]);
```
