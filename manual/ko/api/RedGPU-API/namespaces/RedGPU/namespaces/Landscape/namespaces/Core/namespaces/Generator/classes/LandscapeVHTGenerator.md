[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Generator](../README.md) / LandscapeVHTGenerator

# Class: LandscapeVHTGenerator

Defined in: [src/landscape/core/generator/LandscapeVHTGenerator.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVHTGenerator.ts#L20)

타일별 또는 전역 하이트맵 텍스처를 가상 하이트 텍스처(VHT) 아틀라스에 베이킹하는 생성기 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- `ALandscapeAtlasGenerator`

## Constructors



***

### Constructor

> **new LandscapeVHTGenerator**(`redGPUContext`): `LandscapeVHTGenerator`

Defined in: [src/landscape/core/generator/LandscapeVHTGenerator.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVHTGenerator.ts#L39)

`LandscapeVHTGenerator` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`LandscapeVHTGenerator`

#### Overrides

`ALandscapeAtlasGenerator.constructor`

## Accessors



## Methods



***

### bakeGlobalBase()

> **bakeGlobalBase**(`globalTexture`, `vhtAtlas`, `compCountX`, `compCountZ`): `void`

Defined in: [src/landscape/core/generator/LandscapeVHTGenerator.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVHTGenerator.ts#L136)

전역 하이트맵 텍스처를 전체 VHT 아틀라스 영역에 리샘플링하여 베이킹합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `globalTexture` | `GPUTexture` | 전역 하이트맵 `GPUTexture` |
| `vhtAtlas` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | 대상 가상 하이트 텍스처(VHT) 아틀라스 |
| `compCountX` | `number` | X축 방향 타일(컴포넌트) 개수 |
| `compCountZ` | `number` | Z축 방향 타일(컴포넌트) 개수 |

#### Returns

`void`

***

***

### bakeTileRegion()

> **bakeTileRegion**(`srcTileTexture`, `vhtAtlas`, `pixelX`, `pixelZ`, `pixelW`, `pixelH`): `void`

Defined in: [src/landscape/core/generator/LandscapeVHTGenerator.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVHTGenerator.ts#L73)

개별 타일 하이트맵 텍스처를 VHT 아틀라스의 지정된 픽셀 영역에 베이킹합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `srcTileTexture` | `GPUTexture` | 원본 타일 하이트맵 `GPUTexture` |
| `vhtAtlas` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | 대상 가상 하이트 텍스처(VHT) 아틀라스 |
| `pixelX` | `number` | 아틀라스 내 기록할 시작 X 픽셀 오프셋 |
| `pixelZ` | `number` | 아틀라스 내 기록할 시작 Z(Y) 픽셀 오프셋 |
| `pixelW` | `number` | 베이킹할 영역의 가로 픽셀 크기 |
| `pixelH` | `number` | 베이킹할 영역의 세로 픽셀 크기 |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/generator/LandscapeVHTGenerator.ts:288](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVHTGenerator.ts#L288)

VHT 베이킹에 사용된 전역 컴퓨트 파이프라인과 유니폼 버퍼 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

`ALandscapeAtlasGenerator.destroy`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

`ALandscapeAtlasGenerator.antialiasingManager`

***

***

### bindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L66)

아틀라스 베이킹 컴퓨트 파이프라인의 바인드 그룹 레이아웃을 반환합니다.

##### Returns

`GPUBindGroupLayout`

바인드 그룹 레이아웃 또는 `null`

#### Inherited from

`ALandscapeAtlasGenerator.bindGroupLayout`

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

`ALandscapeAtlasGenerator.commandEncoderManager`

***

***

### computePipeline

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **computePipeline**(): `GPUComputePipeline`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L54)

아틀라스 베이킹에 사용되는 기본 컴퓨트 파이프라인을 반환합니다.

##### Returns

`GPUComputePipeline`

컴퓨트 파이프라인 또는 `null`

#### Inherited from

`ALandscapeAtlasGenerator.computePipeline`

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

`ALandscapeAtlasGenerator.gpuDevice`

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

`ALandscapeAtlasGenerator.instanceId`

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

`ALandscapeAtlasGenerator.name`

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

`ALandscapeAtlasGenerator.redGPUContext`

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

`ALandscapeAtlasGenerator.resourceManager`

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

`ALandscapeAtlasGenerator.uuid`

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### acquireUniformBuffer()

> **acquireUniformBuffer**(`byteLength`): `GPUBuffer`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L81)

현재 프레임에서 사용 가능한 지정된 바이트 크기 이상의 유니폼 버퍼를 풀에서 할당받아 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `byteLength` | `number` | 필요한 최소 유니폼 버퍼 바이트 크기 |

#### Returns

`GPUBuffer`

할당된 `GPUBuffer` 인스턴스

#### Inherited from

`ALandscapeAtlasGenerator.acquireUniformBuffer`

***

***

### dispatchBakePass()

> **dispatchBakePass**(`bindGroup`, `pixelW`, `pixelH`, `pixelX`, `pixelZ`): `void`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L136)

지정된 바인드 그룹과 픽셀 영역 크기로 아틀라스 베이킹 컴퓨트 패스를 디스패치합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bindGroup` | `GPUBindGroup` | 바인딩할 `GPUBindGroup` 인스턴스 |
| `pixelW` | `number` | 베이킹 영역의 가로 픽셀 크기 |
| `pixelH` | `number` | 베이킹 영역의 세로 픽셀 크기 |
| `pixelX` | `number` | 베이킹 영역의 시작 X 픽셀 오프셋 |
| `pixelZ` | `number` | 베이킹 영역의 시작 Z(Y) 픽셀 오프셋 |

#### Returns

`void`

#### Inherited from

`ALandscapeAtlasGenerator.dispatchBakePass`

***

***

### initBaseComputePipeline()

> **initBaseComputePipeline**(`shaderModuleKey`, `shaderCode`, `layoutEntries`, `defaultUniformByteLength?`): `void`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L178)

셰이더 모듈과 바인드 그룹 레이아웃 엔트리를 기반으로 기본 컴퓨트 파이프라인 및 유니폼 버퍼 풀을 초기화합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shaderModuleKey` | `string` | `undefined` | 리소스 매니저에 등록할 셰이더 모듈 캐시 키 |
| `shaderCode` | `string` | `undefined` | WGSL 컴퓨트 셰이더 소스 코드 |
| `layoutEntries` | `GPUBindGroupLayoutEntry`[] | `undefined` | 바인드 그룹 레이아웃 엔트리 배열 (`Array<GPUBindGroupLayoutEntry>`) |
| `defaultUniformByteLength?` | `number` | `16` | 초기 유니폼 버퍼 슬롯의 기본 바이트 크기 (기본값: `16`) |

#### Returns

`void`

#### Inherited from

`ALandscapeAtlasGenerator.initBaseComputePipeline`

</details>
