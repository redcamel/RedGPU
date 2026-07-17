[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector3

# Function: defineVector3()

> **defineVector3**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:51](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/vector/defineVector3.ts#L51)

지정된 클래스의 프로토타입에 GPU와 연동되는 3차원 벡터(Vector3) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineVector3Info`](../interfaces/DefineVector3Info.md) \| [`DefineVector3Info`](../interfaces/DefineVector3Info.md)[] | 단일 [DefineVector3Info](../interfaces/DefineVector3Info.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 해당 속성의 getter/setter는 숫자 3개를 가진 튜플 배열(`[number, number, number]`)을 다룹니다.
- 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼를 업데이트합니다.


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
