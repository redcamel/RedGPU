[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector2

# Function: defineVector2()

> **defineVector2**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector2.ts:51](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/defineProperty/funcs/vector/defineVector2.ts#L51)

지정된 클래스의 프로토타입에 GPU와 연동되는 2차원 벡터(Vector2) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineVector2Info`](../interfaces/DefineVector2Info.md) \| [`DefineVector2Info`](../interfaces/DefineVector2Info.md)[] | 단일 [DefineVector2Info](../interfaces/DefineVector2Info.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 해당 속성의 getter/setter는 숫자 2개를 가진 튜플 배열(`[number, number]`)을 다룹니다.
- 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼를 업데이트합니다.


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
