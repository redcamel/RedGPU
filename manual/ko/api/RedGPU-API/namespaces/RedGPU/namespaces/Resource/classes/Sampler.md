[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / Sampler

# Class: Sampler

Defined in: [src/resources/sampler/Sampler.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L37)

GPU 텍스처 샘플러(`GPUSampler`)를 관리하는 클래스입니다.

필터링 모드, 어드레스 모드, 이방성 필터링(`maxAnisotropy`) 옵션을 설정할 수 있으며, 동일 옵션의 샘플러는 내부적으로 캐싱됩니다.

***

### Example
```typescript
const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
  magFilter: 'linear',
  minFilter: 'linear',
  addressModeU: 'repeat',
  addressModeV: 'repeat'
});
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/texture/bitmapTextureSampler/" style="width:100%; height:500px;"></iframe>

## See

- [Sampler Combination example](https://redcamel.github.io/RedGPU/examples/3d/texture/samplerCombination/)
 - [Sampler AddressMode example](https://redcamel.github.io/RedGPU/examples/3d/texture/samplerAddressMode/)

## Extends

- [`ResourceBase`](../namespaces/Core/classes/ResourceBase.md)

## Constructors



***

### Constructor

> **new Sampler**(`redGPUContext`, `options?`): `Sampler`

Defined in: [src/resources/sampler/Sampler.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L71)

Sampler 인스턴스를 생성합니다.

#### Example
```typescript
const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
  magFilter: 'linear',
  minFilter: 'linear',
  addressModeU: 'repeat',
  addressModeV: 'repeat'
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `options?` | `GPUSamplerDescriptor` | GPUSamplerDescriptor 옵션 객체 (선택) |

#### Returns

`Sampler`

#### Overrides

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`constructor`](../namespaces/Core/classes/ResourceBase.md#constructor)

## Accessors



***

### addressModeU

#### Get Signature

> **get** **addressModeU**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L84)

U축 어드레스 모드를 반환하거나 설정합니다.

##### Returns

`GPUAddressMode`

U축 어드레스 모드

#### Set Signature

> **set** **addressModeU**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L88)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

***

### addressModeV

#### Get Signature

> **get** **addressModeV**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L100)

V축 어드레스 모드를 반환하거나 설정합니다.

##### Returns

`GPUAddressMode`

V축 어드레스 모드

#### Set Signature

> **set** **addressModeV**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L104)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

***

### addressModeW

#### Get Signature

> **get** **addressModeW**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L116)

W축 어드레스 모드를 반환하거나 설정합니다.

##### Returns

`GPUAddressMode`

W축 어드레스 모드

#### Set Signature

> **set** **addressModeW**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L120)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

***

### gpuSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuSampler**(): `GPUSampler`

Defined in: [src/resources/sampler/Sampler.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L148)

생성된 `GPUSampler` 객체를 반환합니다.

##### Returns

`GPUSampler`

WebGPU `GPUSampler` 객체

***

***

### isAnisotropyValid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isAnisotropyValid**(): `boolean`

Defined in: [src/resources/sampler/Sampler.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L210)

이방성 필터링 설정이 유효한지 여부를 반환합니다. (`magFilter`, `minFilter`, `mipmapFilter`가 모두 `'linear'`여야 유효)

##### Returns

`boolean`

유효 여부

***

***

### magFilter

#### Get Signature

> **get** **magFilter**(): `GPUFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L160)

확대 필터 모드를 반환하거나 설정합니다.

##### Returns

`GPUFilterMode`

확대 필터 모드

#### Set Signature

> **set** **magFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:164](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L164)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUFilterMode` |

##### Returns

`void`

***

***

### maxAnisotropy

#### Get Signature

> **get** **maxAnisotropy**(): `number`

Defined in: [src/resources/sampler/Sampler.ts:192](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L192)

최대 이방성 필터링(`maxAnisotropy`) 값을 반환하거나 설정합니다. (유효 범위: 1~16)

##### Returns

`number`

최대 이방성 필터링 값

#### Set Signature

> **set** **maxAnisotropy**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:196](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L196)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minFilter

#### Get Signature

> **get** **minFilter**(): `GPUFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:176](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L176)

축소 필터 모드를 반환하거나 설정합니다.

##### Returns

`GPUFilterMode`

축소 필터 모드

#### Set Signature

> **set** **minFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:180](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L180)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUFilterMode` |

##### Returns

`void`

***

***

### mipmapFilter

#### Get Signature

> **get** **mipmapFilter**(): `GPUMipmapFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L132)

밉맵 필터 모드를 반환하거나 설정합니다.

##### Returns

`GPUMipmapFilterMode`

밉맵 필터 모드

#### Set Signature

> **set** **mipmapFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/sampler/Sampler.ts#L136)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUMipmapFilterMode` |

##### Returns

`void`

***

## Methods



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

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`OctahedralImpostorMaterial`](../../Landscape/namespaces/Foliage/namespaces/Core/classes/OctahedralImpostorMaterial.md).[`cacheKey`](../../Landscape/namespaces/Foliage/namespaces/Core/classes/OctahedralImpostorMaterial.md#cachekey)

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

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../namespaces/Core/classes/ResourceBase.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ResourceBase.md#gpudevice)

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

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`instanceId`](../namespaces/Core/classes/ResourceBase.md#instanceid)

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

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ResourceBase.md#redgpucontext)

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

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../namespaces/Core/classes/ResourceBase.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L77)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

리소스 매니저 키 문자열

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`revision`](../namespaces/Core/classes/ResourceBase.md#revision)

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

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Core/classes/ResourceBase.md#uuid)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../namespaces/Core/classes/ResourceBase.md#notifyupdate)

</details>
