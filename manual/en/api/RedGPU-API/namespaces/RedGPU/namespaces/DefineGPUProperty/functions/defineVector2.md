[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector2

# Function: defineVector2()

> **defineVector2**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector2.ts:51](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/vector/defineVector2.ts#L51)

지정된 클래스의 프로토타입에 GPU와 연동되는 2차원 벡터(Vector2) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineVector2Info`](../interfaces/DefineVector2Info.md) \| [`DefineVector2Info`](../interfaces/DefineVector2Info.md)[] | A single [DefineVector2Info](../interfaces/DefineVector2Info.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Handles a 2-tuple array (`[number, number]`).
- Automatically updates the GPU uniform buffer on value change.

## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineVector2(MyMaterial, { key: 'uvScale', value: [1, 1] });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineVector2(MyMaterial, [
  { key: 'uvOffset', value: [0, 0] },
  { key: 'tiling', value: [2, 2] }
]);
```
