[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / DownSampleCubeMapGenerator

# Class: DownSampleCubeMapGenerator

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:11](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L11)

큐브맵 다운샘플링 및 밉맵 생성을 담당하는 제너레이터 클래스입니다.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new DownSampleCubeMapGenerator**(`redGPUContext`): `DownSampleCubeMapGenerator`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:22](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) |

#### Returns

`DownSampleCubeMapGenerator`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### createBindGroup()

> **createBindGroup**(`bindGroupLayout`, `sourceView`, `targetView`, `uniformBuffer`): `GPUBindGroup`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L58)

바인드 그룹 생성 (캐싱)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bindGroupLayout` | `GPUBindGroupLayout` |
| `sourceView` | `GPUTextureView` |
| `targetView` | `GPUTextureView` |
| `uniformBuffer` | `GPUBuffer` |

#### Returns

`GPUBindGroup`

***

### createSourceTextureView()

> **createSourceTextureView**(`sourceCubemap`, `sourceMipLevel`): `GPUTextureView`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:27](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L27)

소스 텍스처 뷰 생성 (캐싱)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sourceCubemap` | `GPUTexture` |
| `sourceMipLevel` | `number` |

#### Returns

`GPUTextureView`

***

### createTargetTextureView()

> **createTargetTextureView**(`targetCubemap`, `targetMipLevel`): `GPUTextureView`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:42](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L42)

타겟 텍스처 뷰 생성 (캐싱)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetCubemap` | `GPUTexture` |
| `targetMipLevel` | `number` |

#### Returns

`GPUTextureView`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:131](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L131)

모든 리소스를 해제합니다.

#### Returns

`void`

***

### downsampleCubemap()

> **downsampleCubemap**(`sourceCubemap`, `targetSize?`, `format?`): `Promise`\<`GPUTexture`\>

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:91](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L91)

큐브맵 다운샘플링을 수행합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubemap` | `GPUTexture` | `undefined` | 소스 큐브맵 텍스처
| `targetSize` | `number` | `256` | 타겟 크기
| `format` | `GPUTextureFormat` | `'rgba16float'` | 텍스처 포맷

#### Returns

`Promise`\<`GPUTexture`\>

다운샘플링된 큐브맵


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`PostEffectTexturePool`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
