[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_COMPARE\_FUNCTION

# Variable: GPU\_COMPARE\_FUNCTION

> `const` **GPU\_COMPARE\_FUNCTION**: `object`

Defined in: [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L7)

깊이(Depth)·스텐실(Stencil) 테스트 및 그림자 비교 샘플러(Comparison Sampler)에서 사용하는 비교 연산 함수 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-always"></a> `ALWAYS` | `"always"` | `'always'` | 비교 테스트가 항상 통과합니다. (`true`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L47) |
| <a id="property-equal"></a> `EQUAL` | `"equal"` | `'equal'` | 새로운 값이 기존 값과 같을 때 통과합니다. (`new == existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L22) |
| <a id="property-greater"></a> `GREATER` | `"greater"` | `'greater'` | 새로운 값이 기존 값보다 클 때 통과합니다. (`new > existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L32) |
| <a id="property-greater_equal"></a> `GREATER_EQUAL` | `"greater-equal"` | `'greater-equal'` | 새로운 값이 기존 값보다 크거나 같을 때 통과합니다. (`new >= existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L42) |
| <a id="property-less"></a> `LESS` | `"less"` | `'less'` | 새로운 값이 기존 값보다 작을 때 통과합니다. (`new < existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L17) |
| <a id="property-less_equal"></a> `LESS_EQUAL` | `"less-equal"` | `'less-equal'` | 새로운 값이 기존 값보다 작거나 같을 때 통과합니다. (`new <= existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L27) |
| <a id="property-never"></a> `NEVER` | `"never"` | `'never'` | 비교 테스트가 항상 실패합니다. (`false`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L12) |
| <a id="property-not_equal"></a> `NOT_EQUAL` | `"not-equal"` | `'not-equal'` | 새로운 값이 기존 값과 다를 때 통과합니다. (`new != existing`) | [src/gpuConst/GPU\_COMPARE\_FUNCTION.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_COMPARE_FUNCTION.ts#L37) |
