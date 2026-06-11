[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / PostEffectTexturePool

# Class: PostEffectTexturePool

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:25](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L25)

후처리용 텍스처 풀링 클래스입니다.

후처리 과정에서 발생하는 임시 텍스처들을 재사용하여 비디오 메모리 점유율과 생성/파괴 오버헤드를 줄입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

* ### Example
```typescript
// View3D의 postEffectManager를 통해 접근합니다.
// Access through the postEffectManager of View3D.
const texturePool = view.postEffectManager.texturePool;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new PostEffectTexturePool**(`redGPUContext`): `PostEffectTexturePool`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:43](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L43)

PostEffectTexturePool 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트 |

#### Returns

`PostEffectTexturePool`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### activeCount

#### Get Signature

> **get** **activeCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:80](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L80)

현재 사용 중인 활성 텍스처 개수를 반환합니다.

##### Returns

`number`

활성 텍스처 수

***

### allocationCount

#### Get Signature

> **get** **allocationCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:118](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L118)

신규로 생성된 총 텍스처 횟수를 반환합니다.

##### Returns

`number`

총 생성 횟수

***

### hitRate

#### Get Signature

> **get** **hitRate**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:130](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L130)

재사용 적중률(Hit Rate)을 반환합니다. (0~1)

##### Returns

`number`

적중률 (0에서 1 사이)

***

### idleCount

#### Get Signature

> **get** **idleCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:92](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L92)

풀에서 대기 중인 유휴 텍스처 개수를 반환합니다.

##### Returns

`number`

유휴 텍스처 수

***

### peakActiveCount

#### Get Signature

> **get** **peakActiveCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:106](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L106)

역대 최대 동시 활성 텍스처 수를 반환합니다.

##### Returns

`number`

최대 활성 텍스처 수

***

### totalCount

#### Get Signature

> **get** **totalCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:68](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L68)

풀 내의 전체 텍스처 개수(활성 + 유휴)를 반환합니다.

##### Returns

`number`

전체 텍스처 수

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:56](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L56)

풀 내의 전체 비디오 메모리 사용량(bytes)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (Bytes)

## Methods

### allocResult()

> **allocResult**(`width`, `height`, `format?`): [`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:174](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L174)

적절한 텍스처를 풀에서 가져오거나 새로 생성하여 IPostEffectResult 형식으로 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `width` | `number` | `undefined` | 텍스처 가로 크기
| `height` | `number` | `undefined` | 텍스처 세로 크기
| `format` | `GPUTextureFormat` | `'rgba16float'` | 텍스처 포맷 (기본값: 'rgba16float')

#### Returns

[`IPostEffectResult`](../interfaces/IPostEffectResult.md)

할당된 텍스처 및 뷰 정보 객체

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:218](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L218)

풀에 있는 모든 텍스처를 파기합니다.

#### Returns

`void`

***

### getDetails()

> **getDetails**(): `any`[]

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:143](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L143)

풀에 담긴 상세 내역을 반환합니다.

#### Returns

`any`[]

풀의 상세 상태 객체 배열

***

### release()

> **release**(`texture`): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:190](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L190)

특정 텍스처를 풀로 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | 반환할 GPUTexture

#### Returns

`void`

***

### releaseAll()

> **releaseAll**(): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:204](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/postEffect/core/PostEffectTexturePool.ts#L204)

사용 중인 모든 텍스처를 풀로 반환합니다.

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
