[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / DownSampleCubeMapGenerator

# Class: DownSampleCubeMapGenerator

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L18)

큐브맵 다운샘플링 및 밉맵 생성을 담당하는 제너레이터 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new DownSampleCubeMapGenerator**(`redGPUContext`): `DownSampleCubeMapGenerator`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L36)

DownSampleCubeMapGenerator 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`DownSampleCubeMapGenerator`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



## Methods



***

### createBindGroup()

> **createBindGroup**(`bindGroupLayout`, `sourceView`, `targetView`, `uniformBuffer`): `GPUBindGroup`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L117)

큐브맵 다운샘플링 연산에 사용할 바인드 그룹을 생성하거나 캐시에서 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bindGroupLayout` | `GPUBindGroupLayout` | 바인드 그룹 레이아웃 |
| `sourceView` | `GPUTextureView` | 소스 큐브맵 텍스처 뷰 |
| `targetView` | `GPUTextureView` | 타겟 2D 배열 텍스처 뷰 |
| `uniformBuffer` | `GPUBuffer` | 밉 레벨 파라미터 유니폼 버퍼 |

#### Returns

`GPUBindGroup`

생성되거나 캐시된 바인드 그룹

***

***

### createSourceTextureView()

> **createSourceTextureView**(`sourceCubemap`, `sourceMipLevel`): `GPUTextureView`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L54)

지정된 밉 레벨의 소스 큐브맵 텍스처 뷰를 생성하거나 캐시에서 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceCubemap` | `GPUTexture` | 소스 큐브맵 GPUTexture |
| `sourceMipLevel` | `number` | 소스 밉 레벨 인덱스 |

#### Returns

`GPUTextureView`

큐브맵 텍스처 뷰

***

***

### createTargetTextureView()

> **createTargetTextureView**(`targetCubemap`, `targetMipLevel`): `GPUTextureView`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L82)

지정된 밉 레벨의 타겟 2D 배열 텍스처 뷰를 생성하거나 캐시에서 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetCubemap` | `GPUTexture` | 타겟 큐브맵 GPUTexture |
| `targetMipLevel` | `number` | 타겟 밉 레벨 인덱스 |

#### Returns

`GPUTextureView`

2D 배열 텍스처 뷰

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L201)

모든 캐시와 GPU 리소스를 해제합니다.

#### Returns

`void`

***

***

### downsampleCubemap()

> **downsampleCubemap**(`sourceCubemap`, `targetSize?`, `format?`): `Promise`\<`GPUTexture`\>

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:158](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L158)

큐브맵 다운샘플링을 수행합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubemap` | `GPUTexture` | `undefined` | 소스 큐브맵 텍스처 |
| `targetSize?` | `number` | `256` | 타겟 크기 (기본값: 256) |
| `format?` | `GPUTextureFormat` | `'rgba16float'` | 텍스처 포맷 (기본값: 'rgba16float') |

#### Returns

`Promise`\<`GPUTexture`\>

다운샘플링된 큐브맵 GPUTexture

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

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

[`LakeWaveSimulator`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
