[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / PostEffectTexturePool

# Class: PostEffectTexturePool

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L24)

후처리 과정에서 생성되는 임시 텍스처를 재사용하여 비디오 메모리 점유율과 할당 오버헤드를 줄이는 텍스처 풀 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 postEffectManager를 통해 접근
const texturePool = view.postEffectManager.texturePool;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new PostEffectTexturePool**(`redGPUContext`): `PostEffectTexturePool`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L45)

PostEffectTexturePool 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`PostEffectTexturePool`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### activeCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L81)

현재 사용 중인 활성 텍스처 개수를 반환합니다.

##### Returns

`number`

활성 텍스처 수

***

***

### allocationCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **allocationCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L119)

신규로 생성된 총 텍스처 할당 횟수를 반환합니다.

##### Returns

`number`

총 생성 횟수

***

***

### hitRate

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hitRate**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L131)

텍스처 재사용 적중률(0 ~ 1)을 반환합니다.

##### Returns

`number`

적중률 (0 ~ 1)

***

***

### idleCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **idleCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L93)

풀에서 대기 중인 유휴 텍스처 개수를 반환합니다.

##### Returns

`number`

유휴 텍스처 수

***

***

### peakActiveCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **peakActiveCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L107)

역대 최대 동시 활성 텍스처 수를 반환합니다.

##### Returns

`number`

최대 활성 텍스처 수

***

***

### totalCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L69)

풀 내의 전체 텍스처 개수(활성 + 유휴)를 반환합니다.

##### Returns

`number`

전체 텍스처 수

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L57)

풀 내의 전체 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

## Methods



***

### allocResult()

> **allocResult**(`width`, `height`, `format?`): [`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L175)

지정된 크기와 포맷의 텍스처를 풀에서 가져오거나 새로 할당하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `width` | `number` | `undefined` | 텍스처 너비 (단위: 픽셀) |
| `height` | `number` | `undefined` | 텍스처 높이 (단위: 픽셀) |
| `format?` | `GPUTextureFormat` | `'rgba16float'` | 텍스처 포맷 |

#### Returns

[`IPostEffectResult`](../interfaces/IPostEffectResult.md)

할당된 텍스처 및 뷰 결과 객체 (`IPostEffectResult`)

***

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:216](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L216)

풀에 있는 모든 텍스처를 파기하고 통계 상태를 초기화합니다.

#### Returns

`void`

***

***

### getDetails()

> **getDetails**(): `any`[]

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L144)

해상도 및 포맷 키별 텍스처 풀의 상세 상태 목록을 반환합니다.

#### Returns

`any`[]

풀의 상세 상태 객체 배열

***

***

### release()

> **release**(`texture`): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L188)

사용이 끝난 특정 텍스처를 풀로 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | 반환할 `GPUTexture` 인스턴스 |

#### Returns

`void`

***

***

### releaseAll()

> **releaseAll**(): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:202](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/PostEffectTexturePool.ts#L202)

현재 활성 상태인 모든 텍스처를 풀로 반환합니다.

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
