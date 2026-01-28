[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_OPERATION

# Variable: GPU\_BLEND\_OPERATION

> `const` **GPU\_BLEND\_OPERATION**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_OPERATION.ts:10](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/gpuConst/GPU_BLEND_OPERATION.ts#L10)

블렌딩 시 사용되는 수학적 연산 옵션을 정의하는 상수군입니다.


소스와 대상 색상 결과물을 어떻게 결합할지 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="add"></a> `ADD` | `"add"` | `"add"` | 소스와 대상 결과를 더합니다.
| <a id="max"></a> `MAX` | `"max"` | `"max"` | 두 결과 중 큰 값을 선택합니다.
| <a id="min"></a> `MIN` | `"min"` | `"min"` | 두 결과 중 작은 값을 선택합니다.
| <a id="reverse_subtract"></a> `REVERSE_SUBTRACT` | `"reverse-subtract"` | `"reverse-subtract"` | 소스 결과에서 대상 결과를 뺍니다.
| <a id="subtract"></a> `SUBTRACT` | `"subtract"` | `"subtract"` | 대상 결과에서 소스 결과를 뺍니다.
