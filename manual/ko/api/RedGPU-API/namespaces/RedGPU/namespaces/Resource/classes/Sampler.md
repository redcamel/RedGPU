[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / Sampler

# Class: Sampler

Defined in: [src/resources/sampler/Sampler.ts:33](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L33)

GPU 텍스처 샘플러를 관리하는 클래스입니다.


샘플러의 필터, 어드레스 모드, 애니소트로피 등 다양한 옵션을 설정할 수 있습니다.

동일 옵션의 샘플러는 내부적으로 캐싱하여 중복 생성을 방지하며, 옵션 변경 시 자동으로 샘플러를 갱신합니다.


<iframe src="https://redcamel.github.io/RedGPU/examples/3d/texture/bitmapTextureSampler/"></iframe>

## See

 - 아래는 Sampler의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

 - [Sampler Combination example](https://redcamel.github.io/RedGPU/examples/3d/texture/samplerCombination/)
 - [Sampler AddressMode example](https://redcamel.github.io/RedGPU/examples/3d/texture/samplerAddressMode/)

## Extends

- [`ResourceBase`](../namespaces/Core/classes/ResourceBase.md)

## Constructors

### Constructor

> **new Sampler**(`redGPUContext`, `options?`): `Sampler`

Defined in: [src/resources/sampler/Sampler.ts:78](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L78)

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

Defined in: [src/resources/sampler/Sampler.ts:84](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L84)

U축 어드레스 모드

##### Returns

`GPUAddressMode`

#### Set Signature

> **set** **addressModeU**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:89](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L89)

U축 어드레스 모드 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

### addressModeV

#### Get Signature

> **get** **addressModeV**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:94](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L94)

V축 어드레스 모드

##### Returns

`GPUAddressMode`

#### Set Signature

> **set** **addressModeV**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:99](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L99)

V축 어드레스 모드 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

### addressModeW

#### Get Signature

> **get** **addressModeW**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:104](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L104)

W축 어드레스 모드

##### Returns

`GPUAddressMode`

#### Set Signature

> **set** **addressModeW**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:109](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L109)

W축 어드레스 모드 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L57)

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L65)

캐시 키를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`BRDFLUTTexture`](../namespaces/CoreIBL/classes/BRDFLUTTexture.md).[`cacheKey`](../namespaces/CoreIBL/classes/BRDFLUTTexture.md#cachekey)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### gpuSampler

#### Get Signature

> **get** **gpuSampler**(): `GPUSampler`

Defined in: [src/resources/sampler/Sampler.ts:136](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L136)

GPU 샘플러 객체를 반환합니다.


##### Returns

`GPUSampler`

***

### isAnisotropyValid

#### Get Signature

> **get** **isAnisotropyValid**(): `boolean`

Defined in: [src/resources/sampler/Sampler.ts:206](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L206)

애니소트로피 설정이 유효한지 확인합니다. (모든 필터가 'linear'여야 함)


##### Returns

`boolean`

***

### magFilter

#### Get Signature

> **get** **magFilter**(): `GPUFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:144](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L144)

확대 필터 모드를 반환합니다.


##### Returns

`GPUFilterMode`

#### Set Signature

> **set** **magFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:155](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L155)

확대 필터 모드를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUFilterMode` | 필터 모드

##### Returns

`void`

***

### maxAnisotropy

#### Get Signature

> **get** **maxAnisotropy**(): `number`

Defined in: [src/resources/sampler/Sampler.ts:182](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L182)

최대 애니소트로피 값을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxAnisotropy**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:196](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L196)

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

Defined in: [src/resources/sampler/Sampler.ts:163](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L163)

축소 필터 모드를 반환합니다.


##### Returns

`GPUFilterMode`

#### Set Signature

> **set** **minFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:174](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L174)

축소 필터 모드를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUFilterMode` | 필터 모드

##### Returns

`void`

***

### mipmapFilter

#### Get Signature

> **get** **mipmapFilter**(): `GPUMipmapFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:117](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L117)

밉맵 필터 모드를 반환합니다.


##### Returns

`GPUMipmapFilterMode`

#### Set Signature

> **set** **mipmapFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:128](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/sampler/Sampler.ts#L128)

밉맵 필터 모드를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUMipmapFilterMode` | 필터 모드

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`BRDFLUTTexture`](../namespaces/CoreIBL/classes/BRDFLUTTexture.md).[`name`](../namespaces/CoreIBL/classes/BRDFLUTTexture.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Core/classes/ResourceBase.md#uuid)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L125)

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

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__fireListenerList`](../namespaces/Core/classes/ResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)
