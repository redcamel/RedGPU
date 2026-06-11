[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / parseWGSL

# Function: parseWGSL()

> **parseWGSL**(`sourceName`, `code`, `injectLibrary?`): `object`

Defined in: [src/resources/wgslParser/parseWGSL.ts:153](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L153)

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
| `computeEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:160](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L160) |
| `conditionalBlocks` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:163](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L163) |
| `defaultSource` | `string` | [src/resources/wgslParser/parseWGSL.ts:161](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L161) |
| `fragmentEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:159](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L159) |
| `samplers` | `any` | [src/resources/wgslParser/parseWGSL.ts:156](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L156) |
| `shaderSourceVariant` | `any` | [src/resources/wgslParser/parseWGSL.ts:162](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L162) |
| `storage` | `any` | [src/resources/wgslParser/parseWGSL.ts:155](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L155) |
| `textures` | `any` | [src/resources/wgslParser/parseWGSL.ts:157](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L157) |
| `uniforms` | `any` | [src/resources/wgslParser/parseWGSL.ts:154](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L154) |
| `vertexEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:158](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/wgslParser/parseWGSL.ts#L158) |
