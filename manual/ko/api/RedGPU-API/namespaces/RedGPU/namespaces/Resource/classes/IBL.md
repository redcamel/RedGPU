[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IBL

# Class: IBL

Defined in: [src/resources/texture/ibl/IBL.ts:13](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L13)

Image-Based Lighting (IBL)을 관리하는 클래스입니다.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new IBL**(`redGPUContext`, `srcInfo`, `luminance?`, `environmentSize?`, `prefilterSize?`, `irradianceSize?`): `IBL`

Defined in: [src/resources/texture/ibl/IBL.ts:38](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L38)

IBL 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPU 컨텍스트
| `srcInfo` | `string` \| \[`string`, `string`, `string`, `string`, `string`, `string`\] | `undefined` | 환경맵 소스 (HDR URL 또는 6개 이미지 URL 배열)
| `luminance` | `number` | `25000` | 물리적 휘도 (Nit, 기본값: 20000)
| `environmentSize` | `number` | `1024` | 환경맵 크기
| `prefilterSize` | `number` | `512` | Prefilter 크기
| `irradianceSize` | `number` | `64` | Irradiance 크기

#### Returns

`IBL`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### environmentSize

#### Get Signature

> **get** **environmentSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:69](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L69)

##### Returns

`number`

***

### environmentTexture

#### Get Signature

> **get** **environmentTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:85](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L85)

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:94](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L94)

아티스트 제어를 위한 강도 배율

##### Returns

`number`

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/resources/texture/ibl/IBL.ts:98](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L98)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### irradianceSize

#### Get Signature

> **get** **irradianceSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:77](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L77)

##### Returns

`number`

***

### irradianceTexture

#### Get Signature

> **get** **irradianceTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:81](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L81)

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

***

### luminance

#### Get Signature

> **get** **luminance**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:103](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L103)

물리적 휘도 (단위: cd/m²)

##### Returns

`number`

#### Set Signature

> **set** **luminance**(`value`): `void`

Defined in: [src/resources/texture/ibl/IBL.ts:107](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L107)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### prefilterSize

#### Get Signature

> **get** **prefilterSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:73](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L73)

##### Returns

`number`

***

### prefilterTexture

#### Get Signature

> **get** **prefilterTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:89](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/ibl/IBL.ts#L89)

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)


</details>
