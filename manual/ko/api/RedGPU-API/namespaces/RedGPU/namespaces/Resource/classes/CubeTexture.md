[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / CubeTexture

# Class: CubeTexture

Defined in: [src/resources/texture/CubeTexture.ts:26](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L26)

6개의 이미지를 사용하는 큐브 텍스처 클래스입니다.


* ### Example
```typescript
const texture = new RedGPU.Resource.CubeTexture(redGPUContext, [
  'right.png', 'left.png',
  'top.png', 'bottom.png',
  'front.png', 'back.png'
]);
```

## Extends

- [`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md)

## Constructors

### Constructor

> **new CubeTexture**(`redGPUContext`, `srcList`, `useMipMap`, `onLoad?`, `onError?`, `format?`): `CubeTexture`

Defined in: [src/resources/texture/CubeTexture.ts:78](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L78)

CubeTexture 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `srcList` | `SrcInfo` | `undefined` | 큐브 텍스처 소스 정보 (URL 배열 또는 객체)
| `useMipMap` | `boolean` | `true` | 밉맵 사용 여부 (기본값: true)
| `onLoad?` | (`cubeTextureInstance?`) => `void` | `undefined` | 로드 완료 콜백
| `onError?` | (`error`) => `void` | `undefined` | 에러 콜백
| `format?` | `GPUTextureFormat` | `undefined` | 텍스처 포맷 (선택)

#### Returns

`CubeTexture`

#### Overrides

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`constructor`](../namespaces/Core/classes/ManagementResourceBase.md#constructor)

## Properties

### defaultViewDescriptor

> `static` **defaultViewDescriptor**: `GPUTextureViewDescriptor`

Defined in: [src/resources/texture/CubeTexture.ts:28](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L28)

기본 뷰 디스크립터

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L57)

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L65)

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

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ManagementResourceBase.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/CubeTexture.ts:121](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L121)

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

***

### mipLevelCount

#### Get Signature

> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/CubeTexture.ts:126](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L126)

밉맵 레벨 개수를 반환합니다.

##### Returns

`number`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`name`](../namespaces/Core/classes/ManagementResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### srcList

#### Get Signature

> **get** **srcList**(): `string`[]

Defined in: [src/resources/texture/CubeTexture.ts:131](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L131)

텍스처 소스 경로 리스트를 반환합니다.

##### Returns

`string`[]

#### Set Signature

> **set** **srcList**(`value`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:136](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L136)

텍스처 소스 경로 리스트를 설정하고 로드를 시작합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `SrcInfo` |

##### Returns

`void`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ManagementResourceBase.ts#L45)

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../namespaces/Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### useMipmap

#### Get Signature

> **get** **useMipmap**(): `boolean`

Defined in: [src/resources/texture/CubeTexture.ts:143](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L143)

밉맵 사용 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **useMipmap**(`value`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:148](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L148)

밉맵 사용 여부를 설정하고 텍스처를 재생성합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`uuid`](../namespaces/Core/classes/ManagementResourceBase.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/CubeTexture.ts:116](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L116)

비디오 메모리 사용량(byte)을 반환합니다.

##### Returns

`number`

***

### viewDescriptor

#### Get Signature

> **get** **viewDescriptor**(): `object`

Defined in: [src/resources/texture/CubeTexture.ts:108](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L108)

뷰 디스크립터를 반환합니다.

##### Returns

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `arrayLayerCount?` | `number` | How many array layers, starting with [GPUTextureViewDescriptor#baseArrayLayer](#viewdescriptorviewdescriptor), are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1848 |
| `aspect?` | `GPUTextureAspect` | Which GPUTextureAspect \| aspect(s) of the texture are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1830 |
| `baseArrayLayer?` | `number` | The index of the first array layer accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1843 |
| `baseMipLevel?` | `number` | The first (most detailed) mipmap level accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1834 |
| `dimension?` | `GPUTextureViewDimension` | The dimension to view the texture as. | node\_modules/@webgpu/types/dist/index.d.ts:1817 |
| `format?` | `GPUTextureFormat` | The format of the texture view. Must be either the GPUTextureDescriptor#format of the texture or one of the GPUTextureDescriptor#viewFormats specified during its creation. | node\_modules/@webgpu/types/dist/index.d.ts:1813 |
| `label?` | `string` | The initial value of GPUObjectBase#label \| GPUObjectBase.label. | node\_modules/@webgpu/types/dist/index.d.ts:1058 |
| `mipLevelCount` | `number` | - | [src/resources/texture/CubeTexture.ts:111](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L111) |
| `swizzle?` | `string` | A string of length four, with each character mapping to the texture view's red/green/blue/alpha channels, respectively. When accessed by a shader, the red/green/blue/alpha channels are replaced by the value corresponding to the component specified in `swizzle[0]`, `swizzle[1]`, `swizzle[2]`, and `swizzle[3]`, respectively: - `"r"`: Take its value from the red channel of the texture. - `"g"`: Take its value from the green channel of the texture. - `"b"`: Take its value from the blue channel of the texture. - `"a"`: Take its value from the alpha channel of the texture. - `"0"`: Force its value to 0. - `"1"`: Force its value to 1. Requires the GPUFeatureName `"texture-component-swizzle"` feature to be enabled. | node\_modules/@webgpu/types/dist/index.d.ts:1863 |
| `usage?` | `number` | The allowed GPUTextureUsage \| usage(s) for the texture view. Must be a subset of the GPUTexture#usage flags of the texture. If 0, defaults to the full set of GPUTexture#usage flags of the texture. Note: If the view's [GPUTextureViewDescriptor#format](#viewdescriptorviewdescriptor) doesn't support all of the texture's GPUTextureDescriptor#usages, the default will fail, and the view's [GPUTextureViewDescriptor#usage](#viewdescriptorviewdescriptor) must be specified explicitly. | node\_modules/@webgpu/types/dist/index.d.ts:1826 |

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L125)

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

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__fireListenerList`](../namespaces/Core/classes/ManagementResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/CubeTexture.ts:154](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L154)

텍스처 리소스를 파괴합니다.

#### Returns

`void`

***

### setGPUTextureDirectly()

> **setGPUTextureDirectly**(`gpuTexture`, `cacheKey?`, `useMipmap?`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:177](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/CubeTexture.ts#L177)

GPUTexture를 직접 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `gpuTexture` | `GPUTexture` | `undefined` | 설정할 `GPUTexture` 객체
| `cacheKey?` | `string` | `undefined` | 캐시 키 (선택)
| `useMipmap?` | `boolean` | `true` | 밉맵 사용 여부 (기본값: true)

#### Returns

`void`
