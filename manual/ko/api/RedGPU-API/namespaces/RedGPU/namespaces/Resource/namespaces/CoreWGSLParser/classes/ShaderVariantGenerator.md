[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ShaderVariantGenerator

# Class: ShaderVariantGenerator

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:17](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L17)

조건부 블록과 define 문자열을 기반으로 WGSL 셰이더의 다양한 변형(variant) 코드를 생성하는 유틸리티 클래스입니다.


변형 키(variantKey)에 따라 조건부 블록을 처리하여, 각기 다른 셰이더 소스를 동적으로 생성하고 캐싱합니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>직접 인스턴스를 생성하지 마십시오.

:::

## Constructors

### Constructor

> **new ShaderVariantGenerator**(`defines`, `conditionalBlocks`): `ShaderVariantGenerator`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:36](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L36)

ShaderVariantGenerator 인스턴스를 생성합니다. (내부 시스템 전용)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defines` | `string` | WGSL 셰이더의 define 문자열 (기본 소스)
| `conditionalBlocks` | `ConditionalBlock`[] | 조건부 블록 정보 배열

#### Returns

`ShaderVariantGenerator`

## Methods

### addConditionalInfo()

> **addConditionalInfo**(`uniformName`, `textures`, `samplers`): `void`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:72](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L72)

특정 유니폼 키에 연결된 텍스처 및 샘플러 정보를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uniformName` | `string` | 유니폼 이름
| `textures` | `any`[] | 해당 조건에서 활성화될 텍스처 배열
| `samplers` | `any`[] | 해당 조건에서 활성화될 샘플러 배열

#### Returns

`void`

***

### getCachedVariants()

> **getCachedVariants**(): `string`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:186](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L186)

현재 캐시된 변형 키 목록을 반환합니다.


#### Returns

`string`[]

캐시된 변형 키 배열


***

### getUnionSamplers()

> **getUnionSamplers**(): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:149](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L149)

모든 가능한 샘플러 목록(합집합)을 반환합니다.


#### Returns

`any`[]

모든 샘플러 배열


***

### getUnionTextures()

> **getUnionTextures**(): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:132](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L132)

모든 가능한 텍스처 목록(합집합)을 반환합니다.


#### Returns

`any`[]

모든 텍스처 배열


***

### getVariant()

> **getVariant**(`variantKey`): `string`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:169](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L169)

특정 변형 키에 대한 셰이더 코드를 지연 생성(Lazy generate)합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | 활성화할 조건부 키를 '+'로 연결한 문자열 (예: "FOO+BAR"), 조건이 없으면 'none'

#### Returns

`string`

변형된 WGSL 셰이더 코드 문자열


***

### getVariantSamplers()

> **getVariantSamplers**(`variantKey`): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:111](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L111)

특정 변형 키에 활성화된 샘플러 목록을 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | 변형 키

#### Returns

`any`[]

활성화된 샘플러 배열


***

### getVariantTextures()

> **getVariantTextures**(`variantKey`): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:87](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L87)

특정 변형 키에 활성화된 텍스처 목록을 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | 변형 키

#### Returns

`any`[]

활성화된 텍스처 배열


***

### setBaseInfo()

> **setBaseInfo**(`textures`, `samplers`): `void`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L54)

기본 텍스처 및 샘플러 정보를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `textures` | `any`[] | 기본 텍스처 배열
| `samplers` | `any`[] | 기본 샘플러 배열

#### Returns

`void`
