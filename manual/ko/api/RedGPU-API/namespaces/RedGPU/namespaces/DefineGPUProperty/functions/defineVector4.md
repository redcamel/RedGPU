[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector4

# Function: defineVector4()

> **defineVector4**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:51](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/defineProperty/funcs/vector/defineVector4.ts#L51)

지정된 클래스의 프로토타입에 GPU와 연동되는 4차원 벡터(Vector4) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineVector4Info`](../interfaces/DefineVector4Info.md) \| [`DefineVector4Info`](../interfaces/DefineVector4Info.md)[] | 단일 [DefineVector4Info](../interfaces/DefineVector4Info.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 해당 속성의 getter/setter는 숫자 4개를 가진 튜플 배열(`[number, number, number, number]`)을 다룹니다.
- 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼를 업데이트합니다.


## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineVector4(MyMaterial, { key: 'lightColor', value: [1, 1, 1, 1] });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineVector4(MyMaterial, [
  { key: 'tilingAndOffset', value: [1, 1, 0, 0] },
  { key: 'viewport', value: [0, 0, 1920, 1080] }
]);
```
