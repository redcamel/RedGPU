[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_STORE\_OP

# Variable: GPU\_STORE\_OP

> `const` **GPU\_STORE\_OP**: `object`

Defined in: [src/gpuConst/GPU\_STORE\_OP.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_STORE_OP.ts#L7)

렌더 패스(Render Pass) 종료 시 컬러 또는 깊이/스텐실 어태치먼트의 렌더링 결과를 메모리에 보존할지 결정하는 저장 연산 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-discard"></a> `DISCARD` | `"discard"` | `'discard'` | 렌더 패스의 결과물을 메모리에 저장하지 않고 폐기하여 대역폭을 절약합니다. | [src/gpuConst/GPU\_STORE\_OP.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_STORE_OP.ts#L17) |
| <a id="property-store"></a> `STORE` | `"store"` | `'store'` | 렌더 패스에서 그려진 결과물을 어태치먼트 메모리에 저장합니다. | [src/gpuConst/GPU\_STORE\_OP.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_STORE_OP.ts#L12) |
