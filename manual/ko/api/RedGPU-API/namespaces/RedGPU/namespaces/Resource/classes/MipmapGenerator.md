[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / MipmapGenerator

# Class: MipmapGenerator

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L20)

2D 텍스처의 밉맵(Mipmap)을 GPU 렌더 패스를 통해 자동 생성하는 유틸리티 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new MipmapGenerator**(`redGPUContext`): `MipmapGenerator`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L40)

MipmapGenerator 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`MipmapGenerator`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



## Methods



***

### createBindGroup()

> **createBindGroup**(`texture`, `textureView`, `useCache?`): `GPUBindGroup`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L121)

밉맵 렌더 패스에 사용할 바인드 그룹을 생성하거나 캐시에서 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `texture` | `GPUTexture` | `undefined` | 대상 GPUTexture |
| `textureView` | `GPUTextureView` | `undefined` | 대상 GPUTextureView |
| `useCache?` | `boolean` | `false` | 영속 캐시 사용 여부 (기본값: false) |

#### Returns

`GPUBindGroup`

생성되거나 캐시된 GPUBindGroup

***

***

### createTextureView()

> **createTextureView**(`texture`, `baseMipLevel`, `baseArrayLayer`, `useCache?`): `GPUTextureView`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L66)

지정된 밉 레벨 및 레이어의 텍스처 뷰를 생성하거나 캐시에서 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `texture` | `GPUTexture` | `undefined` | 대상 GPUTexture |
| `baseMipLevel` | `number` | `undefined` | 기본 밉 레벨 |
| `baseArrayLayer` | `number` | `undefined` | 기본 배열 레이어 |
| `useCache?` | `boolean` | `false` | 영속 캐시 사용 여부 (기본값: false) |

#### Returns

`GPUTextureView`

생성되거나 캐시된 GPUTextureView

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:376](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L376)

모든 캐시 및 밉맵 생성용 파이프라인 리소스를 해제합니다.

#### Returns

`void`

***

***

### generateMipmap()

> **generateMipmap**(`texture`, `textureDescriptor`, `useCache?`, `encoderType?`): `GPUTexture`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L241)

입력 텍스처에 대한 밉맵 체인을 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `texture` | `GPUTexture` | `undefined` | 원본 GPUTexture |
| `textureDescriptor` | `GPUTextureDescriptor` | `undefined` | 텍스처 디스크립터 |
| `useCache?` | `boolean` | `false` | 영속 캐시 사용 여부 (기본값: false) |
| `encoderType?` | [`CommandEncoderType`](../../CommandEncoderManager/type-aliases/CommandEncoderType.md) | `COMMAND_ENCODER_TYPE.RESOURCE` | 사용할 명령 인코더 유형 (기본값: COMMAND_ENCODER_TYPE.RESOURCE) |

#### Returns

`GPUTexture`

밉맵이 생성된 GPUTexture

***

***

### getMipmapPipeline()

> **getMipmapPipeline**(`format`): `GPURenderPipeline`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:178](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L178)

지정된 텍스처 포맷에 대응하는 밉맵 렌더 파이프라인을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `format` | `GPUTextureFormat` | 대상 GPUTextureFormat |

#### Returns

`GPURenderPipeline`

밉맵 GPURenderPipeline

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`LakeWaveSimulator`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
