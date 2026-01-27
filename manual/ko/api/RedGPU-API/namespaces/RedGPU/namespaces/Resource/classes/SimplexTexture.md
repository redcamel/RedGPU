[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / SimplexTexture

# Class: SimplexTexture

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:39](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L39)

**`Experimental`**

Simplex 노이즈 패턴을 생성하는 텍스처 클래스입니다.


1D, 2D, 3D Simplex 노이즈를 지원하며, FBM(Fractal Brownian Motion)을 통해 복잡한 패턴을 만들 수 있습니다.


* ### Example
```typescript
const texture = new RedGPU.Resource.SimplexTexture(redGPUContext);
```

## Extends

- [`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

## Constructors

### Constructor

> **new SimplexTexture**(`redGPUContext`, `width`, `height`, `define`): `SimplexTexture`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:63](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L63)

**`Experimental`**

SimplexTexture 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `width` | `number` | `1024` | 텍스처 가로 크기
| `height` | `number` | `1024` | 텍스처 세로 크기
| `define` | `NoiseDefine` | `undefined` | 노이즈 정의 객체 (선택)

#### Returns

`SimplexTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties

### mipLevelCount

> **mipLevelCount**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:38](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L38)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

### src

> **src**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:40](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L40)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

### useMipmap

> **useMipmap**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:39](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L39)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

## Accessors

### amplitude

#### Get Signature

> **get** **amplitude**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:124](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L124)

**`Experimental`**

진폭(Amplitude)을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **amplitude**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:129](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L129)

**`Experimental`**

진폭(Amplitude)을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:99](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L99)

**`Experimental`**

애니메이션 속도를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:104](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L104)

**`Experimental`**

애니메이션 속도를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationSpeed`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationspeed)

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:111](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L111)

**`Experimental`**

X축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

**`Experimental`**

X축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationX`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationx)

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:123](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L123)

**`Experimental`**

Y축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:128](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L128)

**`Experimental`**

Y축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationY`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationy)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L57)

**`Experimental`**

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L65)

**`Experimental`**

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

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:112](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L112)

**`Experimental`**

주파수(Frequency)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:117](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L117)

**`Experimental`**

주파수(Frequency)를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L106)

**`Experimental`**

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuDevice`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:140](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L140)

**`Experimental`**

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

### lacunarity

#### Get Signature

> **get** **lacunarity**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:160](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L160)

**`Experimental`**

간극성(Lacunarity)을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:165](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L165)

**`Experimental`**

간극성(Lacunarity)을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L81)

**`Experimental`**

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L90)

**`Experimental`**

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

### noiseDimension

#### Get Signature

> **get** **noiseDimension**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:97](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L97)

**`Experimental`**

노이즈 차원을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **noiseDimension**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:102](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L102)

**`Experimental`**

노이즈 차원을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:136](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L136)

**`Experimental`**

옥타브(Octaves) 수를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:141](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L141)

**`Experimental`**

옥타브(Octaves) 수를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### persistence

#### Get Signature

> **get** **persistence**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:148](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L148)

**`Experimental`**

지속성(Persistence)을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:153](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L153)

**`Experimental`**

지속성(Persistence)을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L114)

**`Experimental`**

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:94](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L94)

**`Experimental`**

리소스 매니저 키

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManagerKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanagerkey)

***

### seed

#### Get Signature

> **get** **seed**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:172](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L172)

**`Experimental`**

시드(Seed)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:177](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L177)

**`Experimental`**

시드(Seed)를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ManagementResourceBase.ts#L45)

**`Experimental`**

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`targetResourceManagedState`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#targetresourcemanagedstate)

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:145](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L145)

**`Experimental`**

현재 시간을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:150](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L150)

**`Experimental`**

현재 시간을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`time`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#time)

***

### uniformInfo

#### Get Signature

> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:135](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L135)

**`Experimental`**

유니폼 정보를 반환합니다.

##### Returns

`any`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uniformInfo`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uniforminfo)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L98)

**`Experimental`**

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uuid`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:89](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L89)

**`Experimental`**

비디오 메모리 사용량(byte)

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L125)

**`Experimental`**

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__addDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L152)

**`Experimental`**

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__fireListenerList`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L137)

**`Experimental`**

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__removeDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__removedirtypipelinelistener)

***

### applySettings()

> **applySettings**(`settings`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:207](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L207)

**`Experimental`**

노이즈 설정을 일괄 적용합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `settings` | `Partial`\<\{ `amplitude`: `number`; `frequency`: `number`; `lacunarity`: `number`; `octaves`: `number`; `persistence`: `number`; `seed`: `number`; \}\> |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:183](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L183)

**`Experimental`**

리소스를 파괴합니다.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

### getSettings()

> **getSettings**(): `object`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:188](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L188)

**`Experimental`**

현재 모든 노이즈 설정을 반환합니다.

#### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `amplitude` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:190](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L190) |
| `frequency` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:189](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L189) |
| `lacunarity` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:193](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L193) |
| `octaves` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:191](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L191) |
| `persistence` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:192](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L192) |
| `seed` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:194](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L194) |

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:183](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L183)

**`Experimental`**

시드를 랜덤 값으로 설정합니다.

#### Returns

`void`

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:177](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L177)

**`Experimental`**

지정된 시간으로 노이즈를 렌더링합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `time` | `number` |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`render`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#render)

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:157](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L157)

**`Experimental`**

개별 유니폼 파라미터를 업데이트합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniform`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniform)

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

**`Experimental`**

여러 유니폼 파라미터를 일괄 업데이트합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniforms`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniforms)
