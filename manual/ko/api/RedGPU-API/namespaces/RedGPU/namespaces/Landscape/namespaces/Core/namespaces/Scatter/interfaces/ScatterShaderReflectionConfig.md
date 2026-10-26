[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterShaderReflectionConfig

# Interface: ScatterShaderReflectionConfig

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L26)

WGSL 셰이더 리플렉션을 통해 인스턴스 및 타입 파라미터 구조체 크기를 추출하기 위한 설정 인터페이스입니다.

## Properties

### instanceStructName

> **instanceStructName**: `string`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L36)

인스턴스 데이터 구조체의 WGSL 식별자 이름

***

### shaderInfo

> **shaderInfo**: `any`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L31)

WGSL 파서에서 생성된 셰이더 리플렉션 정보 객체

***

### typeParamStructName?

> `optional` **typeParamStructName?**: `string`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L41)

타입별 파라미터 구조체의 WGSL 식별자 이름 (선택적)
