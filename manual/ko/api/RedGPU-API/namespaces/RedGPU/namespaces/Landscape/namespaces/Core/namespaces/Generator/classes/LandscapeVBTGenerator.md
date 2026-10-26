[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Generator](../README.md) / LandscapeVBTGenerator

# Class: LandscapeVBTGenerator

Defined in: [src/landscape/core/generator/LandscapeVBTGenerator.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/LandscapeVBTGenerator.ts#L22)

지형 머티리얼의 다중 레이어를 합성하여 가상 블렌드 텍스처(VBT: BaseColor, Normal, ORM) 아틀라스와 밉맵 체인을 생성하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- `ALandscapeAtlasGenerator`

## Constructors



***

### Constructor

> **new LandscapeVBTGenerator**(`redGPUContext`): `LandscapeVBTGenerator`

Defined in: [src/landscape/core/generator/LandscapeVBTGenerator.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/LandscapeVBTGenerator.ts#L46)

`LandscapeVBTGenerator` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`LandscapeVBTGenerator`

#### Overrides

`ALandscapeAtlasGenerator.constructor`

## Accessors



## Methods



***

### bakeAtlas()

> **bakeAtlas**(`vntAtlas`, `vbtAtlas`, `material`, `singleTilePixels?`): `void`

Defined in: [src/landscape/core/generator/LandscapeVBTGenerator.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/LandscapeVBTGenerator.ts#L69)

VNT 아틀라스와 `LandscapeMaterial`의 레이어 데이터를 기반으로 전체 VBT 아틀라스(BaseColor, Normal, ORM) 및 밉맵을 베이킹합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `vntAtlas` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | `undefined` | 가상 노멀 텍스처(VNT) 아틀라스 |
| `vbtAtlas` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | `undefined` | 베이킹 결과를 저장할 3-레이어 VBT(BaseColor, Normal, ORM) 아틀라스 텍스처 |
| `material` | [`LandscapeMaterial`](../../../../../classes/LandscapeMaterial.md) | `undefined` | 합성할 레이어 정보를 가진 `LandscapeMaterial` 인스턴스 |
| `singleTilePixels?` | `number` | `256` | 단일 타일당 픽셀 해상도 (기본값: `256`) |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/generator/LandscapeVBTGenerator.ts:153](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/LandscapeVBTGenerator.ts#L153)

VBT 베이킹 및 타일 밉맵 생성에 사용된 GPU 버퍼와 캐시를 모두 해제합니다.

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

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L66)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L54)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

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

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L81)

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

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L136)

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

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:178](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L178)

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
