[**RedGPU API v4.0.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_CULL\_MODE

# Variable: GPU\_CULL\_MODE

> `const` **GPU\_CULL\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_CULL\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_CULL_MODE.ts#L10)

렌더링 시 제외할 면(컬링)을 정의하는 상수군입니다.


카메라를 기준으로 앞면 혹은 뒷면을 렌더링에서 제외할지 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-back"></a> `BACK` | `"back"` | `'back'` | 뒷면을 컬링하여 앞면만 렌더링합니다. (일반적인 설정)
| <a id="property-front"></a> `FRONT` | `"front"` | `'front'` | 앞면을 컬링하여 뒷면만 렌더링합니다.
| <a id="property-none"></a> `NONE` | `"none"` | `'none'` | 컬링을 수행하지 않습니다.
