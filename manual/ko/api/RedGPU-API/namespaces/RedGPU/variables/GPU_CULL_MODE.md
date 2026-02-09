[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_CULL\_MODE

# Variable: GPU\_CULL\_MODE

> `const` **GPU\_CULL\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_CULL\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_CULL_MODE.ts#L10)

렌더링 시 제외할 면(컬링)을 정의하는 상수군입니다.


카메라를 기준으로 앞면 혹은 뒷면을 렌더링에서 제외할지 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="back"></a> `BACK` | `"back"` | `'back'` | 뒷면을 컬링하여 앞면만 렌더링합니다. (일반적인 설정)
| <a id="front"></a> `FRONT` | `"front"` | `'front'` | 앞면을 컬링하여 뒷면만 렌더링합니다.
| <a id="none"></a> `NONE` | `"none"` | `'none'` | 컬링을 수행하지 않습니다.
