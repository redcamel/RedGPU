[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ShaderVariantGenerator

# Class: ShaderVariantGenerator

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L14)

조건부 블록과 define 문자열을 기반으로 WGSL 셰이더의 다양한 변형(Variant) 코드를 동적으로 생성하고 캐싱하는 유틸리티 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ShaderVariantGenerator**(`defines`, `conditionalBlocks`): `ShaderVariantGenerator`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L33)

ShaderVariantGenerator 인스턴스를 생성합니다. (내부 시스템 전용)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defines` | `string` | WGSL 셰이더의 define 문자열 (기본 소스) |
| `conditionalBlocks` | `ConditionalBlock`[] | 조건부 블록 정보 배열 |

#### Returns

`ShaderVariantGenerator`

## Methods

### addConditionalInfo()

> **addConditionalInfo**(`uniformName`, `textures`, `samplers`): `void`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L69)

특정 유니폼 키에 연결된 텍스처 및 샘플러 정보를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uniformName` | `string` | 유니폼 이름 |
| `textures` | `any`[] | 해당 조건에서 활성화될 텍스처 배열 |
| `samplers` | `any`[] | 해당 조건에서 활성화될 샘플러 배열 |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:192](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L192)

캐시된 변형 코드 및 내부 텍스처/샘플러 맵들의 참조를 명시적으로 해제합니다.

#### Returns

`void`

***

### getCachedVariants()

> **getCachedVariants**(): `string`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L184)

현재 캐시된 변형 키 목록을 반환합니다.

#### Returns

`string`[]

캐시된 변형 키 배열

***

### getUnionSamplers()

> **getUnionSamplers**(): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L146)

모든 가능한 샘플러 목록(합집합)을 반환합니다.

#### Returns

`any`[]

모든 샘플러 배열

***

### getUnionTextures()

> **getUnionTextures**(): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:129](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L129)

모든 가능한 텍스처 목록(합집합)을 반환합니다.

#### Returns

`any`[]

모든 텍스처 배열

***

### getVariant()

> **getVariant**(`variantKey`): `string`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L166)

특정 변형 키에 대한 셰이더 코드를 지연 생성(Lazy generate)합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | 활성화할 조건부 키를 '+'로 연결한 문자열 (예: "FOO+BAR"), 조건이 없으면 'none' |

#### Returns

`string`

변형된 WGSL 셰이더 코드 문자열

***

### getVariantSamplers()

> **getVariantSamplers**(`variantKey`): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L108)

특정 변형 키에 활성화된 샘플러 목록을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | 변형 키 |

#### Returns

`any`[]

활성화된 샘플러 배열

***

### getVariantTextures()

> **getVariantTextures**(`variantKey`): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L84)

특정 변형 키에 활성화된 텍스처 목록을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | 변형 키 |

#### Returns

`any`[]

활성화된 텍스처 배열

***

### setBaseInfo()

> **setBaseInfo**(`textures`, `samplers`): `void`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L51)

기본 텍스처 및 샘플러 정보를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `textures` | `any`[] | 기본 텍스처 배열 |
| `samplers` | `any`[] | 기본 샘플러 배열 |

#### Returns

`void`
