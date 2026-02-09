[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / preprocessWGSL

# Function: preprocessWGSL()

> **preprocessWGSL**(`code`): `PreprocessedWGSLResult`

Defined in: [src/resources/wgslParser/core/preprocessWGSL.ts:209](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/wgslParser/core/preprocessWGSL.ts#L209)

WGSL 셰이더 코드를 전처리합니다.


이 함수는 #redgpu_include, REDGPU_DEFINE_*, #redgpu_if 등 RedGPU 전용 매크로를 처리하고, 셰이더 변형(variant) 생성을 위한 정보를 추출합니다.


## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | `string` | 전처리할 WGSL 소스 코드

## Returns

`PreprocessedWGSLResult`

전처리 결과 객체 (캐시 키, 기본 소스, 변형 생성기 등 포함)

