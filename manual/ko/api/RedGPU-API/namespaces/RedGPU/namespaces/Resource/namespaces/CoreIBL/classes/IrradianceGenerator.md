[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / IrradianceGenerator

# Class: IrradianceGenerator

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:21](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L21)

Irradiance 맵을 생성하는 클래스입니다.

큐브맵으로부터 저주파 조명 정보를 추출하여 난반사(Diffuse) 라이팅에 사용할 Irradiance 맵을 베이킹합니다.

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new IrradianceGenerator**(`redGPUContext`): `IrradianceGenerator`

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:35](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L35)

IrradianceGenerator 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`IrradianceGenerator`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### generate()

> **generate**(`sourceCubeTexture`, `size?`, `phase?`): `Promise`\<[`DirectCubeTexture`](../../../classes/DirectCubeTexture.md)\>

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:69](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L69)

소스 큐브 텍스처로부터 Irradiance 맵을 생성하여 반환합니다.

### Example
```typescript
const irradianceMap = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCubeTexture, 64);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubeTexture` | `GPUTexture` | `undefined` | 소스 환경맵 (큐브)
| `size` | `number` | `32` | 생성될 Irradiance 맵의 크기 (기본값: 32)
| `phase` | [`CommandEncoderType`](../../../../CommandEncoderManager/type-aliases/CommandEncoderType.md) | `COMMAND_ENCODER_TYPE.RESOURCE` | 커맨드 인코더 단계 (기본값: PRE_PROCESS)

#### Returns

`Promise`\<[`DirectCubeTexture`](../../../classes/DirectCubeTexture.md)\>

생성된 Irradiance DirectCubeTexture

***

### render()

> **render**(`sourceCubeTexture`, `targetTexture`, `phase?`): `Promise`\<`void`\>

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:106](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L106)

소스 큐브 텍스처로부터 Irradiance를 계산하여 대상 GPUTexture에 렌더링합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubeTexture` | `GPUTexture` | `undefined` | 소스 환경맵 (큐브)
| `targetTexture` | `GPUTexture` | `undefined` | 대상 GPUTexture (2D Array, 6 layers)
| `phase` | [`CommandEncoderType`](../../../../CommandEncoderManager/type-aliases/CommandEncoderType.md) | `COMMAND_ENCODER_TYPE.RESOURCE` | 커맨드 인코더 단계 (기본값: RESOURCE)

#### Returns

`Promise`\<`void`\>


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`PostEffectTexturePool`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
