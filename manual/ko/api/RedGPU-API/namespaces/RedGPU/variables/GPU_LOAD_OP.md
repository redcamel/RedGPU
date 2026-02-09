[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_LOAD\_OP

# Variable: GPU\_LOAD\_OP

> `const` **GPU\_LOAD\_OP**: `object`

Defined in: [src/gpuConst/GPU\_LOAD\_OP.ts:10](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_LOAD_OP.ts#L10)

렌더 패스 시작 시 어태치먼트를 로드하는 방식을 정의하는 상수군입니다.


새로운 렌더링 작업을 시작하기 전 기존 데이터를 어떻게 처리할지 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="clear"></a> `CLEAR` | `"clear"` | `'clear'` | 어태치먼트를 지정된 색상 혹은 값으로 초기화(지움)합니다.
| <a id="load"></a> `LOAD` | `"load"` | `'load'` | 기존 어태치먼트의 내용을 로드하여 유지합니다.
