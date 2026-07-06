[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / parseWGSL

# Function: parseWGSL()

> **parseWGSL**(`sourceName`, `code`, `injectLibrary?`): `object`

Defined in: [src/resources/wgslParser/parseWGSL.ts:191](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L191)

WGSL 코드를 파싱하고 리플렉션 정보를 반환합니다.

이 함수는 WGSL 소스 코드를 분석하여 유니폼, 스토리지, 샘플러, 텍스처 등의 정보를 추출하고, 조건부 컴파일(variant) 처리를 지원합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceName` | `string` | 셰이더 소스 식별 이름 (경고 출력용)
| `code` | `string` | 파싱할 WGSL 셰이더 코드 문자열
| `injectLibrary?` | `Record`\<`string`, `string`\> | 주입된 로컬 라이브러리 객체 (선택)

## Returns

`object`

리플렉션 정보 및 전처리된 소스 코드를 포함하는 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `computeEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:199](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L199) |
| `conditionalBlocks` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:202](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L202) |
| `defaultSource` | `string` | [src/resources/wgslParser/parseWGSL.ts:200](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L200) |
| `fragmentEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:198](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L198) |
| `samplers` | `any` | [src/resources/wgslParser/parseWGSL.ts:195](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L195) |
| `shaderSourceVariant` | `any` | [src/resources/wgslParser/parseWGSL.ts:201](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L201) |
| `storage` | `any` | [src/resources/wgslParser/parseWGSL.ts:193](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L193) |
| `structs` | `any` | [src/resources/wgslParser/parseWGSL.ts:194](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L194) |
| `textures` | `any` | [src/resources/wgslParser/parseWGSL.ts:196](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L196) |
| `uniforms` | `any` | [src/resources/wgslParser/parseWGSL.ts:192](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L192) |
| `vertexEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:197](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/wgslParser/parseWGSL.ts#L197) |
