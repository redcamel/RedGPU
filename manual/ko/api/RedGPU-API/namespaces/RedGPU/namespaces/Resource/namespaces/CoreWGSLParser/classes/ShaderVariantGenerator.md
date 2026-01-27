[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ShaderVariantGenerator

# Class: ShaderVariantGenerator

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:17](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L17)

조건부 블록과 define 문자열을 기반으로 WGSL 셰이더의 다양한 변형(variant) 코드를 생성하는 유틸리티 클래스입니다.


변형 키(variantKey)에 따라 조건부 블록을 처리하여, 각기 다른 셰이더 소스를 동적으로 생성하고 캐싱합니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>직접 인스턴스를 생성하지 마십시오.

:::

## Constructors

### Constructor

> **new ShaderVariantGenerator**(`defines`, `conditionalBlocks`): `ShaderVariantGenerator`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:32](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L32)

ShaderVariantGenerator 인스턴스를 생성합니다. (내부 시스템 전용)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defines` | `string` | WGSL 셰이더의 define 문자열 (기본 소스)
| `conditionalBlocks` | `ConditionalBlock`[] | 조건부 블록 정보 배열

#### Returns

`ShaderVariantGenerator`

## Methods

### getCachedVariants()

> **getCachedVariants**(): `string`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:64](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L64)

현재 캐시된 변형 키 목록을 반환합니다.


#### Returns

`string`[]

***

### getVariant()

> **getVariant**(`variantKey`): `string`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:50](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L50)

특정 변형 키에 대한 셰이더 코드를 지연 생성(Lazy generate)합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | 활성화할 조건부 키를 '+'로 연결한 문자열 (예: "FOO+BAR"), 조건이 없으면 'none'

#### Returns

`string`

변형된 WGSL 셰이더 코드 문자열

