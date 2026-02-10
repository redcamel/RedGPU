[**RedGPU API v4.0.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_COMPARE\_FUNCTION

# Variable: GPU\_COMPARE\_FUNCTION

> `const` **GPU\_COMPARE\_FUNCTION**: `object`

Defined in: [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:10](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L10)

비교 연산 시 사용되는 함수 옵션을 정의하는 상수군입니다.


깊이 테스트나 스텐실 테스트에서 두 값을 비교하는 방식을 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-always"></a> `ALWAYS` | `"always"` | `'always'` | 비교 테스트를 항상 통과하게 합니다.
| <a id="property-equal"></a> `EQUAL` | `"equal"` | `'equal'` | 새로운 값이 기존 값과 같을 때 통과합니다.
| <a id="property-greater"></a> `GREATER` | `"greater"` | `'greater'` | 새로운 값이 기존 값보다 클 때 통과합니다.
| <a id="property-greater_equal"></a> `GREATER_EQUAL` | `"greater-equal"` | `'greater-equal'` | 새로운 값이 기존 값보다 크거나 같을 때 통과합니다.
| <a id="property-less"></a> `LESS` | `"less"` | `'less'` | 새로운 값이 기존 값보다 작을 때 통과합니다.
| <a id="property-less_equal"></a> `LESS_EQUAL` | `"less-equal"` | `'less-equal'` | 새로운 값이 기존 값보다 작거나 같을 때 통과합니다.
| <a id="property-never"></a> `NEVER` | `"never"` | `'never'` | 비교 테스트를 항상 통과하지 못하게 합니다.
| <a id="property-not_equal"></a> `NOT_EQUAL` | `"not-equal"` | `'not-equal'` | 새로운 값이 기존 값과 다를 때 통과합니다.
