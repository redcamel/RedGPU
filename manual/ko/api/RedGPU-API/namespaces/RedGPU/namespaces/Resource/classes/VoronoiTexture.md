[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VoronoiTexture

# Class: VoronoiTexture

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:59](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L59)

**`Experimental`**

Voronoi 노이즈 패턴을 생성하는 텍스처 클래스입니다.


셀룰러 패턴, 돌 텍스처, 크랙 패턴, 셀 ID 출력 등을 생성할 수 있습니다.


* ### Example
```typescript
const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext);
```

## Extends

- [`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

## Constructors

### Constructor

> **new VoronoiTexture**(`redGPUContext`, `width`, `height`, `define?`): `VoronoiTexture`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:89](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L89)

**`Experimental`**

VoronoiTexture 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `width` | `number` | `1024` | 텍스처 가로 크기
| `height` | `number` | `1024` | 텍스처 세로 크기
| `define?` | `NoiseDefine` | `undefined` | 노이즈 정의 객체 (선택)

#### Returns

`VoronoiTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties

### mipLevelCount

> **mipLevelCount**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:38](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L38)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

### src

> **src**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:40](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L40)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

### useMipmap

> **useMipmap**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:39](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L39)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

## Accessors

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:99](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L99)

**`Experimental`**

애니메이션 속도를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:104](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L104)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:111](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L111)

**`Experimental`**

X축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:123](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L123)

**`Experimental`**

Y축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:128](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L128)

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

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L57)

**`Experimental`**

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L65)

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

### cellIdColorIntensity

#### Get Signature

> **get** **cellIdColorIntensity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:242](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L242)

**`Experimental`**

셀 ID 색상 강도를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **cellIdColorIntensity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:247](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L247)

**`Experimental`**

셀 ID 색상 강도를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### distanceScale

#### Get Signature

> **get** **distanceScale**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:141](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L141)

**`Experimental`**

거리 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **distanceScale**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:146](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L146)

**`Experimental`**

거리 스케일을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### distanceType

#### Get Signature

> **get** **distanceType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:200](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L200)

**`Experimental`**

거리 타입을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **distanceType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:205](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L205)

**`Experimental`**

거리 타입을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:129](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L129)

**`Experimental`**

주파수를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:134](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L134)

**`Experimental`**

주파수를 설정합니다.

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

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L106)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:140](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L140)

**`Experimental`**

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

### jitter

#### Get Signature

> **get** **jitter**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:230](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L230)

**`Experimental`**

지터(Jitter) 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **jitter**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:235](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L235)

**`Experimental`**

지터(Jitter) 값을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### lacunarity

#### Get Signature

> **get** **lacunarity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:177](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L177)

**`Experimental`**

간극성을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:182](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L182)

**`Experimental`**

간극성을 설정합니다.

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

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L81)

**`Experimental`**

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L90)

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

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:153](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L153)

**`Experimental`**

옥타브 수를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:158](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L158)

**`Experimental`**

옥타브 수를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### outputType

#### Get Signature

> **get** **outputType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:215](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L215)

**`Experimental`**

출력 타입을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **outputType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:220](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L220)

**`Experimental`**

출력 타입을 설정합니다.

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

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:165](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L165)

**`Experimental`**

지속성을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:170](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L170)

**`Experimental`**

지속성을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L114)

**`Experimental`**

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:94](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L94)

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

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:189](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L189)

**`Experimental`**

시드를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:194](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L194)

**`Experimental`**

시드를 설정합니다.

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

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ManagementResourceBase.ts#L45)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:145](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L145)

**`Experimental`**

현재 시간을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:150](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L150)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:135](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L135)

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

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L98)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:89](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L89)

**`Experimental`**

비디오 메모리 사용량(byte)

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L125)

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

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L152)

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

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L137)

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

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:377](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L377)

**`Experimental`**

설정을 일괄 적용합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `settings` | `Partial`\<`VoronoiSettings`\> |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:183](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L183)

**`Experimental`**

리소스를 파괴합니다.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

### getDistanceTypeName()

> **getDistanceTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:391](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L391)

**`Experimental`**

현재 거리 타입의 이름을 반환합니다.

#### Returns

`string`

***

### getOutputTypeName()

> **getOutputTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:401](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L401)

**`Experimental`**

현재 출력 타입의 이름을 반환합니다.

#### Returns

`string`

***

### getSettings()

> **getSettings**(): `VoronoiSettings`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:361](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L361)

**`Experimental`**

현재 설정을 반환합니다.

#### Returns

`VoronoiSettings`

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:254](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L254)

**`Experimental`**

시드를 랜덤하게 변경합니다.

#### Returns

`void`

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:177](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L177)

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

### setBiomeMapPattern()

> **setBiomeMapPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:353](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L353)

**`Experimental`**

바이옴 맵 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setCellIdColorOutput()

> **setCellIdColorOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:299](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L299)

**`Experimental`**

셀 ID 색상 출력 방식을 설정합니다.

#### Returns

`void`

***

### setCellIdOutput()

> **setCellIdOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:294](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L294)

**`Experimental`**

셀 ID 출력 방식을 설정합니다.

#### Returns

`void`

***

### setCellularPattern()

> **setCellularPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:304](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L304)

**`Experimental`**

셀룰러 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setChebyshevDistance()

> **setChebyshevDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:269](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L269)

**`Experimental`**

체비셰프 거리 방식을 설정합니다.

#### Returns

`void`

***

### setCrackPattern()

> **setCrackPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:284](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L284)

**`Experimental`**

크랙 패턴 방식을 설정합니다.

#### Returns

`void`

***

### setCrystalPattern()

> **setCrystalPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:330](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L330)

**`Experimental`**

크리스탈 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setEuclideanDistance()

> **setEuclideanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:259](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L259)

**`Experimental`**

유클리드 거리 방식을 설정합니다.

#### Returns

`void`

***

### setF1Output()

> **setF1Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:274](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L274)

**`Experimental`**

F1 출력 방식을 설정합니다.

#### Returns

`void`

***

### setF2Output()

> **setF2Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:279](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L279)

**`Experimental`**

F2 출력 방식을 설정합니다.

#### Returns

`void`

***

### setGridPattern()

> **setGridPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:324](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L324)

**`Experimental`**

격자 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setManhattanDistance()

> **setManhattanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:264](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L264)

**`Experimental`**

맨하탄 거리 방식을 설정합니다.

#### Returns

`void`

***

### setMosaicPattern()

> **setMosaicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:345](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L345)

**`Experimental`**

모자이크 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setOrganicPattern()

> **setOrganicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:318](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L318)

**`Experimental`**

유기체 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setSmoothBlend()

> **setSmoothBlend**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:289](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L289)

**`Experimental`**

부드러운 블렌딩 방식을 설정합니다.

#### Returns

`void`

***

### setStainedGlassPattern()

> **setStainedGlassPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:337](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L337)

**`Experimental`**

스테인드글라스 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setStonePattern()

> **setStonePattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:311](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L311)

**`Experimental`**

돌 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:157](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L157)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

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
