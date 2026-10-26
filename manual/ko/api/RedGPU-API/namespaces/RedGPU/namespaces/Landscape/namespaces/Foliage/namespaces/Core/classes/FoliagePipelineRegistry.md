[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliagePipelineRegistry

# Class: FoliagePipelineRegistry

Defined in: [src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts#L34)

식생(Foliage)의 메인 패스, 깊이 프리패스, 그림자 패스용 인스턴싱 `GPURenderPipeline`을 생성하고 캐싱하는 레지스트리 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new FoliagePipelineRegistry**(`redGPUContext`): `FoliagePipelineRegistry`

Defined in: [src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts#L48)

`FoliagePipelineRegistry` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`FoliagePipelineRegistry`

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



## Methods



***

### clearCache()

> **clearCache**(): `void`

Defined in: [src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts:460](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts#L460)

캐싱된 모든 렌더 파이프라인을 초기화합니다.

#### Returns

`void`

***

***

### getOrCreatePipeline()

> **getOrCreatePipeline**(`material`, `sampleCount`, `msaaID`, `strideBytes?`, `cullMode?`, `depthPassMode?`, `renderUnitBindGroupLayout?`, `isMasked?`): `GPURenderPipeline`

Defined in: [src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts:111](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts#L111)

메인 패스 또는 깊이 프리패스용 식생 렌더 파이프라인을 조회하거나 새로 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `material` | `any` | `undefined` | 대상 머티리얼 인스턴스 |
| `sampleCount` | `number` | `undefined` | MSAA 샘플 수 |
| `msaaID` | `string` | `undefined` | MSAA 식별자 문자열 |
| `strideBytes?` | `number` | `72` | 정점 버퍼 스트라이드 바이트 수 (기본값: `72`) |
| `cullMode?` | `GPUCullMode` | `'none'` | 폴리곤 컬링 모드 (기본값: `'none'`) |
| `depthPassMode?` | `FoliageDepthPassMode` | `'normal'` | 깊이 패스 동작 모드 (기본값: `'normal'`) |
| `renderUnitBindGroupLayout?` | `GPUBindGroupLayout` | `undefined` | 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택) |
| `isMasked?` | `boolean` | `false` | 알파 마스크 렌더링 여부 (기본값: `false`) |

#### Returns

`GPURenderPipeline`

생성 또는 캐시된 `GPURenderPipeline` 인스턴스 (유효하지 않은 경우 `null`)

***

***

### getOrCreateShadowMaskedPipeline()

> **getOrCreateShadowMaskedPipeline**(`material`, `strideBytes?`, `cullMode?`, `renderUnitBindGroupLayout?`): `GPURenderPipeline`

Defined in: [src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts:379](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts#L379)

알파 마스크(컷오프)가 적용된 식생 또는 임포스터용 그림자 패스 렌더 파이프라인을 조회하거나 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `material` | `any` | `undefined` | 대상 머티리얼 인스턴스 |
| `strideBytes?` | `number` | `72` | 정점 버퍼 스트라이드 바이트 수 (기본값: `72`) |
| `cullMode?` | `GPUCullMode` | `'none'` | 폴리곤 컬링 모드 (기본값: `'none'`) |
| `renderUnitBindGroupLayout?` | `GPUBindGroupLayout` | `undefined` | 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택) |

#### Returns

`GPURenderPipeline`

생성 또는 캐시된 `GPURenderPipeline` 인스턴스 (머티리얼 부재 시 `null`)

***

***

### getOrCreateShadowMergedPipeline()

> **getOrCreateShadowMergedPipeline**(`strideBytes?`, `cullMode?`, `renderUnitBindGroupLayout?`): `GPURenderPipeline`

Defined in: [src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts:299](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/pipeline/FoliagePipelineRegistry.ts#L299)

불투명 병합 지오메트리 전용 그림자 패스 렌더 파이프라인을 조회하거나 새로 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `strideBytes?` | `number` | `12` | 위치 전용 정점 버퍼 스트라이드 바이트 수 (기본값: `12`) |
| `cullMode?` | `GPUCullMode` | `'back'` | 폴리곤 컬링 모드 (기본값: `'back'`) |
| `renderUnitBindGroupLayout?` | `GPUBindGroupLayout` | `undefined` | 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택) |

#### Returns

`GPURenderPipeline`

생성 또는 캐시된 그림자 렌더 파이프라인(`GPURenderPipeline`)

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
