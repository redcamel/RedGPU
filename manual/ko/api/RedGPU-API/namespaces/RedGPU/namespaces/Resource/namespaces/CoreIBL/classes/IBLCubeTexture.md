[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / IBLCubeTexture

# Class: IBLCubeTexture

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:20](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L20)

IBL에서 내부적으로 사용하는 큐브 텍스처 클래스입니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

## Extends

- [`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md)

## Constructors

### Constructor

> **new IBLCubeTexture**(`redGPUContext`, `cacheKey`, `gpuTexture?`): `IBLCubeTexture`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:41](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L41)

IBLCubeTexture 인스턴스를 생성합니다. (내부 시스템 전용)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `cacheKey` | `string` | 캐시 키
| `gpuTexture?` | `GPUTexture` | `GPUTexture` 객체 (선택)

#### Returns

`IBLCubeTexture`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`constructor`](../../Core/classes/ManagementResourceBase.md#constructor)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L57)

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L65)

캐시 키를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`cacheKey`](../../Core/classes/ManagementResourceBase.md#cachekey)

***

### format

#### Get Signature

> **get** **format**(): `GPUTextureFormat`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:77](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L77)

텍스처 포맷


##### Returns

`GPUTextureFormat`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`gpuDevice`](../../Core/classes/ManagementResourceBase.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:93](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L93)

GPUTexture 객체


##### Returns

`GPUTexture`

#### Set Signature

> **set** **gpuTexture**(`gpuTexture`): `void`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:101](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L101)

GPUTexture 객체를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `gpuTexture` | `GPUTexture` |

##### Returns

`void`

***

### mipLevelCount

#### Get Signature

> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L109)

밉맵 레벨 개수


##### Returns

`number`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`name`](../../Core/classes/ManagementResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`redGPUContext`](../../Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../../Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ManagementResourceBase.ts#L45)

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../../Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### useMipmap

#### Get Signature

> **get** **useMipmap**(): `boolean`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L117)

밉맵 사용 여부


##### Returns

`boolean`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`uuid`](../../Core/classes/ManagementResourceBase.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:85](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L85)

비디오 메모리 사용량(byte)


##### Returns

`number`

***

### viewDescriptor

#### Get Signature

> **get** **viewDescriptor**(): `object`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:66](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L66)

뷰 디스크립터를 반환합니다.


##### Returns

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `arrayLayerCount?` | `number` | How many array layers, starting with [GPUTextureViewDescriptor#baseArrayLayer](../../../classes/CubeTexture.md#viewdescriptorviewdescriptor), are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1848 |
| `aspect?` | `GPUTextureAspect` | Which GPUTextureAspect \| aspect(s) of the texture are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1830 |
| `baseArrayLayer?` | `number` | The index of the first array layer accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1843 |
| `baseMipLevel?` | `number` | The first (most detailed) mipmap level accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1834 |
| `dimension?` | `GPUTextureViewDimension` | The dimension to view the texture as. | node\_modules/@webgpu/types/dist/index.d.ts:1817 |
| `format?` | `GPUTextureFormat` | The format of the texture view. Must be either the GPUTextureDescriptor#format of the texture or one of the GPUTextureDescriptor#viewFormats specified during its creation. | node\_modules/@webgpu/types/dist/index.d.ts:1813 |
| `label?` | `string` | The initial value of GPUObjectBase#label \| GPUObjectBase.label. | node\_modules/@webgpu/types/dist/index.d.ts:1058 |
| `mipLevelCount` | `number` | - | [src/resources/texture/ibl/core/IBLCubeTexture.ts:69](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L69) |
| `swizzle?` | `string` | A string of length four, with each character mapping to the texture view's red/green/blue/alpha channels, respectively. When accessed by a shader, the red/green/blue/alpha channels are replaced by the value corresponding to the component specified in `swizzle[0]`, `swizzle[1]`, `swizzle[2]`, and `swizzle[3]`, respectively: - `"r"`: Take its value from the red channel of the texture. - `"g"`: Take its value from the green channel of the texture. - `"b"`: Take its value from the blue channel of the texture. - `"a"`: Take its value from the alpha channel of the texture. - `"0"`: Force its value to 0. - `"1"`: Force its value to 1. Requires the GPUFeatureName `"texture-component-swizzle"` feature to be enabled. | node\_modules/@webgpu/types/dist/index.d.ts:1863 |
| `usage?` | `number` | The allowed GPUTextureUsage \| usage(s) for the texture view. Must be a subset of the GPUTexture#usage flags of the texture. If 0, defaults to the full set of GPUTexture#usage flags of the texture. Note: If the view's [GPUTextureViewDescriptor#format](../../../classes/CubeTexture.md#viewdescriptorviewdescriptor) doesn't support all of the texture's GPUTextureDescriptor#usages, the default will fail, and the view's [GPUTextureViewDescriptor#usage](../../../classes/CubeTexture.md#viewdescriptorviewdescriptor) must be specified explicitly. | node\_modules/@webgpu/types/dist/index.d.ts:1826 |

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L125)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__fireListenerList`](../../Core/classes/ManagementResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/ibl/core/IBLCubeTexture.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/IBLCubeTexture.ts#L125)

리소스를 파괴합니다.


#### Returns

`void`
