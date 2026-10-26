[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_LOAD\_OP

# Variable: GPU\_LOAD\_OP

> `const` **GPU\_LOAD\_OP**: `object`

Defined in: [src/gpuConst/GPU\_LOAD\_OP.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_LOAD_OP.ts#L7)

렌더 패스(Render Pass) 시작 시 컬러 또는 깊이/스텐실 어태치먼트의 초기 데이터를 처리하는 로드 연산 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-clear"></a> `CLEAR` | `"clear"` | `'clear'` | 렌더 패스 시작 시 어태치먼트를 지정된 초기화 값(`clearValue` 또는 ` depthClearValue`)으로 지웁니다. | [src/gpuConst/GPU\_LOAD\_OP.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_LOAD_OP.ts#L17) |
| <a id="property-load"></a> `LOAD` | `"load"` | `'load'` | 어태치먼트에 기록되어 있던 이전 프레임 또는 이전 패스의 기존 내용을 그대로 유지하여 로드합니다. | [src/gpuConst/GPU\_LOAD\_OP.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_LOAD_OP.ts#L12) |
