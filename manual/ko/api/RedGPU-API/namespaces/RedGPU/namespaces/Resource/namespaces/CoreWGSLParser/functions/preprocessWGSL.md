[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / preprocessWGSL

# Function: preprocessWGSL()

> **preprocessWGSL**(`sourceName`, `code`, `injectLibrary?`): [`PreprocessedWGSLResult`](../interfaces/PreprocessedWGSLResult.md)

Defined in: [src/resources/wgslParser/core/preprocessWGSL.ts:262](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/wgslParser/core/preprocessWGSL.ts#L262)

WGSL 셰이더 코드를 전처리합니다.

이 함수는 #redgpu_include, REDGPU_DEFINE_*, #redgpu_if 등 RedGPU 전용 매크로를 처리하고, 셰이더 변형(variant) 생성을 위한 정보를 추출합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceName` | `string` | 셰이더 소스 식별 이름 (경고 출력용)
| `code` | `string` | 전처리할 WGSL 소스 코드
| `injectLibrary?` | `Record`\<`string`, `string`\> | 주입된 로컬 라이브러리 객체 (선택)

## Returns

[`PreprocessedWGSLResult`](../interfaces/PreprocessedWGSLResult.md)

전처리 결과 객체 (캐시 키, 기본 소스, 변형 생성기 등 포함)
