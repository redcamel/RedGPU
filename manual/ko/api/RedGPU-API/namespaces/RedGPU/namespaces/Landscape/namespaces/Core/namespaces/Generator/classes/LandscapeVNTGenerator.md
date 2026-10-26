[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Generator](../README.md) / LandscapeVNTGenerator

# Class: LandscapeVNTGenerator

Defined in: [src/landscape/core/generator/LandscapeVNTGenerator.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVNTGenerator.ts#L18)

가상 하이트 텍스처(VHT) 아틀라스의 고도 구배로부터 지형 표면 법선 및 경사도를 계산하여 가상 노멀 텍스처(VNT) 아틀라스에 베이킹하는 생성기 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- `ALandscapeAtlasGenerator`

## Constructors



***

### Constructor

> **new LandscapeVNTGenerator**(`redGPUContext`): `LandscapeVNTGenerator`

Defined in: [src/landscape/core/generator/LandscapeVNTGenerator.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVNTGenerator.ts#L30)

`LandscapeVNTGenerator` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`LandscapeVNTGenerator`

#### Overrides

`ALandscapeAtlasGenerator.constructor`

## Accessors



## Methods



***

### bakeTileRegion()

> **bakeTileRegion**(`vhtAtlas`, `vntAtlas`, `pixelX`, `pixelZ`, `pixelW`, `pixelH`, `heightScale`, `worldSizeX`, `componentCountX`, `sampleStep?`): `void`

Defined in: [src/landscape/core/generator/LandscapeVNTGenerator.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVNTGenerator.ts#L70)

VHT 아틀라스의 지정된 타일 영역으로부터 법선 데이터를 계산하여 VNT 아틀라스에 베이킹합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `vhtAtlas` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | `undefined` | 원본 가상 하이트 텍스처(VHT) 아틀라스 |
| `vntAtlas` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | `undefined` | 대상 가상 노멀 텍스처(VNT) 아틀라스 |
| `pixelX` | `number` | `undefined` | 타일 영역의 시작 X 픽셀 오프셋 |
| `pixelZ` | `number` | `undefined` | 타일 영역의 시작 Z(Y) 픽셀 오프셋 |
| `pixelW` | `number` | `undefined` | 타일 영역의 가로 픽셀 크기 |
| `pixelH` | `number` | `undefined` | 타일 영역의 세로 픽셀 크기 |
| `heightScale` | `number` | `undefined` | 지형 최대 높이 스케일 (월드 단위) |
| `worldSizeX` | `number` | `undefined` | 지형 전체의 X축 월드 크기 |
| `componentCountX` | `number` | `undefined` | X축 방향 타일(컴포넌트) 개수 |
| `sampleStep?` | `number` | `1` | 법선 기울기 샘플링 아틀라스 텍셀 간격 (기본값: `1`) |

#### Returns

`void`

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

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L233)

유니폼 버퍼 풀을 파기하고 컴퓨트 파이프라인 참조를 해제합니다.

#### Returns

`void`

#### Inherited from

`ALandscapeAtlasGenerator.destroy`

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
