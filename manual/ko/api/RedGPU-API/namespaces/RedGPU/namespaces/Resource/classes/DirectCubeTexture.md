[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / DirectCubeTexture

# Class: DirectCubeTexture

Defined in: [src/resources/texture/DirectCubeTexture.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L19)

파일 경로(URL) 로드 과정 없이 외부 `GPUTexture`를 직접 주입받아 관리하는 다차원(Cube 및 3D) 텍스처 클래스입니다.

***

### Example
```typescript
const directCubeTexture = new RedGPU.Resource.DirectCubeTexture(redGPUContext, 'custom_cube_key', gpuTexture);
```

## Extends

- `ADirectTexture`

## Constructors



***

### Constructor

> **new DirectCubeTexture**(`redGPUContext`, `cacheKey`, `gpuTexture?`): `DirectCubeTexture`

Defined in: [src/resources/texture/DirectCubeTexture.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L41)

DirectCubeTexture 인스턴스를 생성합니다. 동일한 `cacheKey`가 존재할 경우 기존 캐시된 인스턴스를 반환합니다.

#### Example
```typescript
const directCubeTexture = new RedGPU.Resource.DirectCubeTexture(redGPUContext, 'my_cube_texture', gpuTexture);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `cacheKey` | `string` | 리소스 식별 및 캐싱을 위한 고유 키 |
| `gpuTexture?` | `GPUTexture` | 직접 주입할 `GPUTexture` 객체 (선택) |

#### Returns

`DirectCubeTexture`

#### Overrides

`ADirectTexture.constructor`

## Accessors



***

### viewDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewDescriptor**(): `GPUTextureViewDescriptor`

Defined in: [src/resources/texture/DirectCubeTexture.ts:67](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L67)

텍스처 차원(`cube` 또는 `3d`)과 밉맵 레벨이 반영된 `GPUTextureViewDescriptor`를 반환합니다.

##### Returns

`GPUTextureViewDescriptor`

`GPUTextureViewDescriptor` 객체

#### Overrides

`ADirectTexture.viewDescriptor`

## Methods



***

### registerResource()

> `protected` **registerResource**(): `void`

Defined in: [src/resources/texture/DirectCubeTexture.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L94)

리소스 매니저에 큐브 텍스처 상태를 등록합니다.

#### Returns

`void`

#### Overrides

`ADirectTexture.registerResource`

***

***

### setGpuTexture()

> `protected` **setGpuTexture**(`value`): `void`

Defined in: [src/resources/texture/DirectCubeTexture.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L85)

`GPUTexture` 객체를 설정하고 차원 정보 및 뷰를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUTexture` | 설정할 `GPUTexture` 객체 |

#### Returns

`void`

#### Overrides

`ADirectTexture.setGpuTexture`

***

***

### unregisterResource()

> `protected` **unregisterResource**(): `void`

Defined in: [src/resources/texture/DirectCubeTexture.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L102)

리소스 매니저에서 큐브 텍스처 등록을 해제합니다.

#### Returns

`void`

#### Overrides

`ADirectTexture.unregisterResource`

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

`ADirectTexture.antialiasingManager`

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

`ADirectTexture.cacheKey`

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

`ADirectTexture.commandEncoderManager`

***

***

### format

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **format**(): `GPUTextureFormat`

Defined in: [src/resources/texture/core/ADirectTexture.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L80)

텍스처의 GPU 포맷을 반환합니다.

##### Returns

`GPUTextureFormat`

#### Inherited from

`ADirectTexture.format`

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

`ADirectTexture.gpuDevice`

***

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/core/ADirectTexture.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L52)

내부 WebGPU 텍스처 인스턴스를 반환하거나 설정합니다.

##### Returns

`GPUTexture`

#### Set Signature

> **set** **gpuTexture**(`value`): `void`

Defined in: [src/resources/texture/core/ADirectTexture.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L56)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUTexture` |

##### Returns

`void`

#### Inherited from

[`DirectTexture`](DirectTexture.md).[`gpuTexture`](DirectTexture.md#gputexture)

***

***

### gpuTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTextureView**(): `GPUTextureView`

Defined in: [src/resources/texture/core/ADirectTexture.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L64)

내부 WebGPU 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

#### Inherited from

`ADirectTexture.gpuTextureView`

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

`ADirectTexture.instanceId`

***

***

### mipLevelCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/core/ADirectTexture.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L88)

텍스처의 밉 레벨 수를 반환합니다.

##### Returns

`number`

#### Inherited from

`ADirectTexture.mipLevelCount`

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

`ADirectTexture.redGPUContext`

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

`ADirectTexture.resourceManager`

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

`ADirectTexture.resourceManagerKey`

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

`ADirectTexture.revision`

***

***

### targetResourceManagedState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ManagementResourceBase.ts#L50)

리소스의 관리 상태 정보를 반환합니다.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

리소스 관리 상태 정보 객체

#### Inherited from

`ADirectTexture.targetResourceManagedState`

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

`ADirectTexture.uuid`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/core/ADirectTexture.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L72)

텍스처의 비디오 메모리 사용량(바이트 단위)을 반환합니다.

##### Returns

`number`

#### Inherited from

`ADirectTexture.videoMemorySize`

***

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

`ADirectTexture.__addDirtyPipelineListener`

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

`ADirectTexture.__removeDirtyPipelineListener`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/ADirectTexture.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L96)

텍스처 리소스를 파괴하고 비디오 메모리를 해제합니다.

#### Returns

`void`

#### Inherited from

`ADirectTexture.destroy`

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

`ADirectTexture.notifyUpdate`

***

</details>
