[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / SimplexTexture

# Class: SimplexTexture

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L39)

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



***

### Constructor

> **new SimplexTexture**(`redGPUContext`, `width?`, `height?`, `define`, `useMipmap?`): `SimplexTexture`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L68)

**`Experimental`**

SimplexTexture 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `width?` | `number` | `1024` | 텍스처 가로 크기 (기본값: 1024) |
| `height?` | `number` | `1024` | 텍스처 세로 크기 (기본값: 1024) |
| `define` | [`NoiseDefine`](../namespaces/CoreNoiseTexture/interfaces/NoiseDefine.md) | `undefined` | 노이즈 정의 객체 |
| `useMipmap?` | `boolean` | `true` | 밉맵 사용 여부 (기본값: true) |

#### Returns

`SimplexTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties



## Accessors



***

### amplitude

#### Get Signature

> **get** **amplitude**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L153)

**`Experimental`**

진폭(Amplitude)을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **amplitude**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:165](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L165)

**`Experimental`**

진폭(Amplitude)을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 진폭 값 |

##### Returns

`void`

***

***

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L131)

**`Experimental`**

주파수(Frequency)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L143)

**`Experimental`**

주파수(Frequency)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 주파수 값 |

##### Returns

`void`

***

***

### lacunarity

#### Get Signature

> **get** **lacunarity**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:219](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L219)

**`Experimental`**

간극성(Lacunarity)을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:231](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L231)

**`Experimental`**

간극성(Lacunarity)을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 간극성 값 |

##### Returns

`void`

***

***

### noiseDimension

#### Get Signature

> **get** **noiseDimension**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L106)

**`Experimental`**

노이즈 차원을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **noiseDimension**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:118](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L118)

**`Experimental`**

노이즈 차원을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 노이즈 차원 값 |

##### Returns

`void`

***

***

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L175)

**`Experimental`**

옥타브(Octaves) 수를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L187)

**`Experimental`**

옥타브(Octaves) 수를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 옥타브 수 (1 ~ 8) |

##### Returns

`void`

***

***

### persistence

#### Get Signature

> **get** **persistence**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:197](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L197)

**`Experimental`**

지속성(Persistence)을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:209](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L209)

**`Experimental`**

지속성(Persistence)을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 지속성 값 (0 ~ 1) |

##### Returns

`void`

***

***

### seed

#### Get Signature

> **get** **seed**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L241)

**`Experimental`**

시드(Seed)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L253)

**`Experimental`**

시드(Seed)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 시드 값 |

##### Returns

`void`

***

## Methods



***

### applySettings()

> **applySettings**(`settings`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:300](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L300)

**`Experimental`**

노이즈 설정을 일괄 적용합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `settings` | `Partial`\<\{ `amplitude`: `number`; `frequency`: `number`; `lacunarity`: `number`; `octaves`: `number`; `persistence`: `number`; `seed`: `number`; \}\> | 적용할 노이즈 설정 부분 객체 |

#### Returns

`void`

***

***

### getSettings()

> **getSettings**(): `object`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:274](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L274)

**`Experimental`**

현재 모든 노이즈 설정을 반환합니다.

#### Returns

`object`

노이즈 파라미터 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `amplitude` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:276](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L276) |
| `frequency` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L275) |
| `lacunarity` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L279) |
| `octaves` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L277) |
| `persistence` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:278](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L278) |
| `seed` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:280](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L280) |

***

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:262](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L262)

**`Experimental`**

시드를 무작위 값으로 설정합니다.

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### mipLevelCount

> **mipLevelCount**: `number` = `1`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L47)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

***

### src

> **src**: `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L49)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

***

### useMipmap

> **useMipmap**: `boolean` = `true`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L48)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

***

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L132)

**`Experimental`**

애니메이션 속도를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L144)

**`Experimental`**

애니메이션 속도를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 애니메이션 속도 |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationSpeed`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationspeed)

***

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L154)

**`Experimental`**

X축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

**`Experimental`**

X축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X축 애니메이션 값 |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationX`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationx)

***

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:176](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L176)

**`Experimental`**

Y축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L188)

**`Experimental`**

Y축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y축 애니메이션 값 |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationY`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationy)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

**`Experimental`**

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`antialiasingManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

**`Experimental`**

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`cacheKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

**`Experimental`**

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`commandEncoderManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

**`Experimental`**

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuDevice`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gpudevice)

***

***

### gpuTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:206](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L206)

**`Experimental`**

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

**`Experimental`**

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`instanceId`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

**`Experimental`**

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

**`Experimental`**

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

**`Experimental`**

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L124)

**`Experimental`**

리소스 매니저 상태 키를 반환합니다.

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManagerKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

**`Experimental`**

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`revision`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#revision)

***

***

### targetResourceManagedState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ManagementResourceBase.ts#L50)

**`Experimental`**

리소스의 관리 상태 정보를 반환합니다.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

리소스 관리 상태 정보 객체

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`targetResourceManagedState`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#targetresourcemanagedstate)

***

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L214)

**`Experimental`**

현재 시간을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L226)

**`Experimental`**

현재 시간을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 시간 (밀리초) |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`time`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#time)

***

***

### uniformInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L198)

**`Experimental`**

유니폼 정보를 반환합니다.

##### Returns

`any`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uniformInfo`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uniforminfo)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

**`Experimental`**

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uuid`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

**`Experimental`**

비디오 메모리 사용량(byte)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

**`Experimental`**

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__addDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

**`Experimental`**

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__removeDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__removedirtypipelinelistener)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L285)

**`Experimental`**

리소스를 파괴합니다.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

**`Experimental`**

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`notifyUpdate`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#notifyupdate)

***

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L277)

**`Experimental`**

지정된 시간으로 노이즈를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `time` | `number` | 렌더링할 시간 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`render`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#render)

***

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L243)

**`Experimental`**

개별 유니폼 파라미터를 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 유니폼 이름 |
| `value` | `any` | 설정할 값 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniform`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniform)

***

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L259)

**`Experimental`**

여러 유니폼 파라미터를 일괄 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> | 업데이트할 유니폼 키-값 레코드 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniforms`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniforms)

</details>
