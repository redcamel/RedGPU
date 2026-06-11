[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / Sampler

# Class: Sampler

Defined in: [src/resources/sampler/Sampler.ts:33](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L33)

GPU 텍스처 샘플러를 관리하는 클래스입니다.

샘플러의 필터, 어드레스 모드, 애니소트로피 등 다양한 옵션을 설정할 수 있습니다.
동일 옵션의 샘플러는 내부적으로 캐싱하여 중복 생성을 방지하며, 옵션 변경 시 자동으로 샘플러를 갱신합니다.

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/texture/bitmapTextureSampler/"></iframe>

## See

 -아래는 Sampler의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

## Extends

- [`ResourceBase`](../namespaces/Core/classes/ResourceBase.md)

## Constructors

### Constructor

> **new Sampler**(`redGPUContext`, `options?`): `Sampler`

Defined in: [src/resources/sampler/Sampler.ts:78](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L78)

Sampler 인스턴스를 생성합니다.

* ### Example
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
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `options?` | `GPUSamplerDescriptor` | GPUSamplerDescriptor 옵션 객체

#### Returns

`Sampler`

#### Overrides

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`constructor`](../namespaces/Core/classes/ResourceBase.md#constructor)

## Accessors

### addressModeU

#### Get Signature

> **get** **addressModeU**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L88)

U축 어드레스 모드를 반환합니다.

##### Returns

`GPUAddressMode`

- 어드레스 모드

#### Set Signature

> **set** **addressModeU**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:97](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L97)

U축 어드레스 모드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUAddressMode` | 설정할 어드레스 모드

##### Returns

`void`

***

### addressModeV

#### Get Signature

> **get** **addressModeV**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:106](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L106)

V축 어드레스 모드를 반환합니다.

##### Returns

`GPUAddressMode`

- 어드레스 모드

#### Set Signature

> **set** **addressModeV**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:115](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L115)

V축 어드레스 모드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUAddressMode` | 설정할 어드레스 모드

##### Returns

`void`

***

### addressModeW

#### Get Signature

> **get** **addressModeW**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:124](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L124)

W축 어드레스 모드를 반환합니다.

##### Returns

`GPUAddressMode`

- 어드레스 모드

#### Set Signature

> **set** **addressModeW**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:133](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L133)

W축 어드레스 모드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUAddressMode` | 설정할 어드레스 모드

##### Returns

`void`

***

### gpuSampler

#### Get Signature

> **get** **gpuSampler**(): `GPUSampler`

Defined in: [src/resources/sampler/Sampler.ts:160](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L160)

GPU 샘플러 객체를 반환합니다.

##### Returns

`GPUSampler`

- WebGPU GPU 샘플러 객체

***

### isAnisotropyValid

#### Get Signature

> **get** **isAnisotropyValid**(): `boolean`

Defined in: [src/resources/sampler/Sampler.ts:228](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L228)

애니소트로피 설정이 유효한지 확인합니다. (모든 필터가 'linear'여야 함)

##### Returns

`boolean`

- 유효 여부

***

### magFilter

#### Get Signature

> **get** **magFilter**(): `GPUFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:169](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L169)

확대 필터 모드를 반환합니다.

##### Returns

`GPUFilterMode`

- 확대 필터 모드

#### Set Signature

> **set** **magFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:178](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L178)

확대 필터 모드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUFilterMode` | 설정할 확대 필터 모드

##### Returns

`void`

***

### maxAnisotropy

#### Get Signature

> **get** **maxAnisotropy**(): `number`

Defined in: [src/resources/sampler/Sampler.ts:205](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L205)

최대 애니소트로피 값을 반환합니다.

##### Returns

`number`

- 최대 애니소트로피 값

#### Set Signature

> **set** **maxAnisotropy**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:217](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L217)

최대 애니소트로피 값을 설정합니다. (1~16 사이)

##### Throws

1 미만 또는 16 초과 시 RangeError 발생

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 애니소트로피 값

##### Returns

`void`

***

### minFilter

#### Get Signature

> **get** **minFilter**(): `GPUFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:187](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L187)

축소 필터 모드를 반환합니다.

##### Returns

`GPUFilterMode`

- 축소 필터 모드

#### Set Signature

> **set** **minFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:196](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L196)

축소 필터 모드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUFilterMode` | 설정할 축소 필터 모드

##### Returns

`void`

***

### mipmapFilter

#### Get Signature

> **get** **mipmapFilter**(): `GPUMipmapFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:142](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L142)

밉맵 필터 모드를 반환합니다.

##### Returns

`GPUMipmapFilterMode`

- 밉맵 필터 모드

#### Set Signature

> **set** **mipmapFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:151](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/sampler/Sampler.ts#L151)

밉맵 필터 모드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUMipmapFilterMode` | 설정할 밉맵 필터 모드

##### Returns

`void`

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L53)

캐시 키를 반환합니다.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L61)

캐시 키를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`cacheKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../namespaces/Core/classes/ResourceBase.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L77)

연관된 GPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L71)

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

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../namespaces/Core/classes/ResourceBase.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L69)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L45)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`revision`](../namespaces/Core/classes/ResourceBase.md#revision)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Core/classes/ResourceBase.md#uuid)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L89)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L101)

리소스 업데이트 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L116)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../namespaces/Core/classes/ResourceBase.md#notifyupdate)


</details>
