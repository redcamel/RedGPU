[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / parseWGSL

# Function: parseWGSL()

> **parseWGSL**(`code`): `any`

Defined in: [src/resources/wgslParser/parseWGSL.ts:111](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/resources/wgslParser/parseWGSL.ts#L111)

WGSL 코드를 파싱하고 리플렉션 정보를 반환합니다.


이 함수는 WGSL 소스 코드를 분석하여 유니폼, 스토리지, 샘플러, 텍스처 등의 정보를 추출하고, 조건부 컴파일(variant) 처리를 지원합니다.


## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | `string` | 파싱할 WGSL 셰이더 코드 문자열

## Returns

`any`

리플렉션 정보 및 전처리된 소스 코드를 포함하는 객체

