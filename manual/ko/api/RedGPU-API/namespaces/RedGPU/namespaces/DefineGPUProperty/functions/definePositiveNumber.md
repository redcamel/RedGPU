[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / definePositiveNumber

# Function: definePositiveNumber()

> **definePositiveNumber**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:98](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/number/definePositiveNumber.ts#L98)

지정된 클래스의 프로토타입에 GPU와 연동되는 양수(Positive Number) 범위 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefinePositiveNumberInfo`](../interfaces/DefinePositiveNumberInfo.md) \| [`DefinePositiveNumberInfo`](../interfaces/DefinePositiveNumberInfo.md)[] | 단일 [DefinePositiveNumberInfo](../interfaces/DefinePositiveNumberInfo.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 값 설정 시 [validatePositiveNumberRange](../../RuntimeChecker/functions/validatePositiveNumberRange.md)를 통해 0 이상의 양수인지 검사합니다.
- 최소값 `min`은 0 이상이어야 하며 기본값은 0입니다. `max`가 제공된 경우 최대값을 넘지 못하도록 클램핑(Clamping)합니다.
- 범위 외의 값이 할당되면 `console.warn` 경고를 출력한 후 최소/최대값 한계치로 조정하여 저장하고 GPU 버퍼에 반영합니다.


## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, { key: 'shininess', value: 30, min: 0, max: 100 });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, [
  { key: 'fogDensity', value: 0.01, min: 0 },
  { key: 'roughness', value: 0.5, min: 0, max: 1 }
]);
```
