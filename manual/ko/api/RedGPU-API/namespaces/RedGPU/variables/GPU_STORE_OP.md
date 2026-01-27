[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_STORE\_OP

# Variable: GPU\_STORE\_OP

> `const` **GPU\_STORE\_OP**: `object`

Defined in: [src/gpuConst/GPU\_STORE\_OP.ts:10](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/gpuConst/GPU_STORE_OP.ts#L10)

렌더 패스 종료 시 어태치먼트의 내용을 저장하는 방식을 정의하는 상수군입니다.


렌더링 결과물을 메모리에 저장할지 혹은 버릴지 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="discard"></a> `DISCARD` | `"discard"` | `'discard'` | 렌더링된 결과물을 저장하지 않고 버립니다.
| <a id="store"></a> `STORE` | `"store"` | `'store'` | 렌더링된 결과물을 어태치먼트에 저장합니다.
