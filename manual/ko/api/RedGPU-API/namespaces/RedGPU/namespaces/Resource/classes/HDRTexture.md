[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / HDRTexture

# Class: HDRTexture

Defined in: [src/resources/texture/hdr/HDRTexture.ts:29](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L29)

Radiance HDR(.hdr) 파일을 사용하는 2D 텍스처 클래스입니다.

.hdr 파일을 로드하여 rgba16float 포맷의 2D GPUTexture를 생성합니다. 라이트맵, 투영 텍스처 또는 IBL의 원천 데이터로 사용됩니다.

### Example
```typescript
const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'path/to/image.hdr');
```

## Extends

- [`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md)

## Constructors

### Constructor

> **new HDRTexture**(`redGPUContext`, `src`, `onLoad?`, `onError?`): `HDRTexture`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L64)

HDRTexture 인스턴스를 생성합니다.

### Example
```typescript
const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'assets/hdr/sky.hdr', (v) => {
    console.log('Loaded:', v);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `src` | [`HDRSrcInfo`](../type-aliases/HDRSrcInfo.md) | HDR 파일 경로 또는 정보
| `onLoad?` | (`textureInstance?`) => `void` | 로드 완료 콜백
| `onError?` | (`error`) => `void` | 에러 콜백

#### Returns

`HDRTexture`

#### Overrides

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`constructor`](../namespaces/Core/classes/ManagementResourceBase.md#constructor)

## Properties

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:136](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L136)

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

GPUTexture 인스턴스

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:112](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L112)

텍스처 세로 크기를 반환합니다.

##### Returns

`number`

세로 크기 (픽셀)

***

### src

#### Get Signature

> **get** **src**(): `string`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:148](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L148)

텍스처 소스 경로를 반환합니다.

##### Returns

`string`

소스 경로

#### Set Signature

> **set** **src**(`value`): `void`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:160](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L160)

텍스처 소스 경로 설정 및 로드를 시작합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`HDRSrcInfo`](../type-aliases/HDRSrcInfo.md) | 설정할 소스 정보

##### Returns

`void`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:124](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L124)

비디오 메모리 사용량(byte)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (Bytes)

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:100](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L100)

텍스처 가로 크기를 반환합니다.

##### Returns

`number`

가로 크기 (픽셀)

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:169](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/texture/hdr/HDRTexture.ts#L169)

리소스를 파괴합니다.

#### Returns

`void`

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`instanceId`](../namespaces/Core/classes/ManagementResourceBase.md#instanceid)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`antialiasingManager`](../namespaces/Core/classes/ManagementResourceBase.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L53)

캐시 키를 반환합니다.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L61)

캐시 키를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`cacheKey`](../namespaces/Core/classes/ManagementResourceBase.md#cachekey)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`commandEncoderManager`](../namespaces/Core/classes/ManagementResourceBase.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L77)

연관된 GPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ManagementResourceBase.md#gpudevice)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`name`](../namespaces/Core/classes/ManagementResourceBase.md#name)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ManagementResourceBase.md#redgpucontext)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManager`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L69)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L45)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`revision`](../namespaces/Core/classes/ManagementResourceBase.md#revision)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ManagementResourceBase.ts#L45)

리소스의 관리 상태 정보를 반환합니다.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../namespaces/Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`uuid`](../namespaces/Core/classes/ManagementResourceBase.md#uuid)

***

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L89)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L101)

리소스 업데이트 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L116)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`notifyUpdate`](../namespaces/Core/classes/ManagementResourceBase.md#notifyupdate)


</details>
