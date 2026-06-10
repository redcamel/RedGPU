[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineNumber

# Function: defineNumber()

> **defineNumber**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:98](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/defineProperty/funcs/number/defineNumber.ts#L98)

지정된 클래스의 프로토타입에 GPU와 연동되는 일반 숫자(Number) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineNumberInfo`](../interfaces/DefineNumberInfo.md) \| [`DefineNumberInfo`](../interfaces/DefineNumberInfo.md)[] | A single [DefineNumberInfo](../interfaces/DefineNumberInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Performs runtime type check via [validateNumber](../../RuntimeChecker/functions/validateNumber.md) upon setting value.
- If `min` and `max` are set, values out of bounds trigger `console.warn` and are clamped to the boundaries.
- Automatically updates the GPU uniform buffer on value change.

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
