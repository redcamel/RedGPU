[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineNumber

# Function: defineNumber()

> **defineNumber**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:98](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/defineProperty/funcs/number/defineNumber.ts#L98)

지정된 클래스의 프로토타입에 GPU와 연동되는 일반 숫자(Number) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineNumberInfo`](../interfaces/DefineNumberInfo.md) \| [`DefineNumberInfo`](../interfaces/DefineNumberInfo.md)[] | 단일 [DefineNumberInfo](../interfaces/DefineNumberInfo.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 값 설정 시 [validateNumber](../../RuntimeChecker/functions/validateNumber.md)를 통해 런타임 타입 검사가 수행됩니다.
- `min`과 `max` 값이 설정된 경우, 범위 외의 값이 들어오면 `console.warn` 경고를 출력한 후 해당 최소/최대값으로 값을 조절하여 설정합니다.
- 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼를 업데이트합니다.


## Example

```typescript
// 단일 설정 (범위 제한 포함)
RedGPU.DefineGPUProperty.defineNumber(MyMaterial, { key: 'roughness', value: 0.5, min: 0, max: 1 });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineNumber(MyMaterial, [
  { key: 'opacity', value: 1.0, min: 0, max: 1 },
  { key: 'shininess', value: 30 }
]);
```
