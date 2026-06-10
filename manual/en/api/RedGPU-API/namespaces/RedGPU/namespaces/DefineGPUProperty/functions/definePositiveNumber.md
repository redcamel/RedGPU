[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / definePositiveNumber

# Function: definePositiveNumber()

> **definePositiveNumber**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:98](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/defineProperty/funcs/number/definePositiveNumber.ts#L98)

지정된 클래스의 프로토타입에 GPU와 연동되는 양수(Positive Number) 범위 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefinePositiveNumberInfo`](../interfaces/DefinePositiveNumberInfo.md) \| [`DefinePositiveNumberInfo`](../interfaces/DefinePositiveNumberInfo.md)[] | A single [DefinePositiveNumberInfo](../interfaces/DefinePositiveNumberInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Validates that the input is a positive number (>= 0) via [validatePositiveNumberRange](../../RuntimeChecker/functions/validatePositiveNumberRange.md).
- The minimum value `min` defaults to 0. Clamps the value if it exceeds `max` (if provided).
- Values outside the range print a `console.warn` and are clamped before writing to the GPU buffer.

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
