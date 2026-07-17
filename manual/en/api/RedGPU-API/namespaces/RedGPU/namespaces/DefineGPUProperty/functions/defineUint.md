[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineUint

# Function: defineUint()

> **defineUint**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:96](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/number/defineUint.ts#L96)

지정된 클래스의 프로토타입에 GPU와 연동되는 부호 없는 정수(Uint) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineUintInfo`](../interfaces/DefineUintInfo.md) \| [`DefineUintInfo`](../interfaces/DefineUintInfo.md)[] | A single [DefineUintInfo](../interfaces/DefineUintInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Validates that the input is an unsigned integer (>= 0) via [validateUintRange](../../RuntimeChecker/functions/validateUintRange.md).
- Values outside the range print a `console.warn` and are clamped/adjusted before writing to the GPU buffer.

## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineUint(MyMaterial, { key: 'lightType', value: 1, min: 0, max: 10 });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineUint(MyMaterial, [
  { key: 'shadowMode', value: 0 },
  { key: 'maxLights', value: 4, min: 0, max: 16 }
]);
```
