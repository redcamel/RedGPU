[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineUint

# Function: defineUint()

> **defineUint**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:96](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/defineProperty/funcs/number/defineUint.ts#L96)

지정된 클래스의 프로토타입에 GPU와 연동되는 부호 없는 정수(Uint) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineUintInfo`](../interfaces/DefineUintInfo.md) \| [`DefineUintInfo`](../interfaces/DefineUintInfo.md)[] | 단일 [DefineUintInfo](../interfaces/DefineUintInfo.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 값 설정 시 [validateUintRange](../../RuntimeChecker/functions/validateUintRange.md)를 통해 0 이상의 정수(unsigned integer)인지 검사합니다.
- 범위 외의 정수나 실수가 들어오면 `console.warn` 경고를 출력한 후 최소/최대 범위 및 정수 값으로 조절하여 저장하고 GPU 버퍼에 반영합니다.


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
