[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / ASinglePassPostEffect

# Abstract Class: ASinglePassPostEffect

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:13](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L13)

단일 컴퓨트 패스(Compute Pass)로 동작하는 후처리 이펙트의 추상 기본 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`BrightnessContrast`](../../../classes/BrightnessContrast.md)
- [`ColorBalance`](../../../classes/ColorBalance.md)
- [`ColorTemperatureTint`](../../../classes/ColorTemperatureTint.md)
- [`Grayscale`](../../../classes/Grayscale.md)
- [`HueSaturation`](../../../classes/HueSaturation.md)
- [`Invert`](../../../classes/Invert.md)
- [`Threshold`](../../../classes/Threshold.md)
- [`Vibrance`](../../../classes/Vibrance.md)
- [`BlurX`](../../../classes/BlurX.md)
- [`BlurY`](../../../classes/BlurY.md)
- [`DirectionalBlur`](../../../classes/DirectionalBlur.md)
- [`RadialBlur`](../../../classes/RadialBlur.md)
- [`ZoomBlur`](../../../classes/ZoomBlur.md)
- [`ChromaticAberration`](../../../classes/ChromaticAberration.md)
- [`LensDistortion`](../../../classes/LensDistortion.md)
- [`Vignetting`](../../../classes/Vignetting.md)
- [`Fog`](../../../classes/Fog.md)
- [`HeightFog`](../../../classes/HeightFog.md)
- [`FilmGrain`](../../../classes/FilmGrain.md)
- [`Convolution`](../../../classes/Convolution.md)
- [`FXAA`](../../../../Antialiasing/classes/FXAA.md)
- [`TAA`](../../../../Antialiasing/classes/TAA.md)
- [`SkyAtmospherePostEffect`](../../../../Display/namespaces/CoreSkyAtmosphere/classes/SkyAtmospherePostEffect.md)
- [`AMultiPassPostEffect`](AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> `protected` **new ASinglePassPostEffect**(`redGPUContext`, `options?`): `ASinglePassPostEffect`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L84)

ASinglePassPostEffect 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `options?` | \{ `isLdr?`: `boolean`; `workSizeX?`: `number`; `workSizeY?`: `number`; `workSizeZ?`: `number`; \} | 초기화 옵션 (`workSizeX`, `workSizeY`, `workSizeZ`, `isLdr`) |
| `options.isLdr?` | `boolean` | - |
| `options.workSizeX?` | `number` | - |
| `options.workSizeY?` | `number` | - |
| `options.workSizeZ?` | `number` | - |

#### Returns

`ASinglePassPostEffect`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L19)

후처리 이펙트 인스턴스 여부

## Accessors



***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L112)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

***

***

### outputTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:235](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L235)

현재 패스에 할당된 출력 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

출력 `GPUTextureView`

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L148)

현재 MSAA 상태에 대응하는 WGSL 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 파싱 정보

***

***

### storageInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L136)

파싱된 셰이더의 스토리지 바인딩 구조 정보를 반환합니다.

##### Returns

`any`

스토리지 바인딩 구조 정보

***

***

### systemUniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L184)

시스템 공용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

시스템 유니폼 구조체 정보

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L160)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

`UniformBuffer` 인스턴스

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L172)

이펙트 전용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L124)

이펙트 고유 버퍼의 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:197](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L197)

컴퓨트 워크그룹 X축 크기를 반환합니다.

##### Returns

`number`

워크그룹 X 크기

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L210)

컴퓨트 워크그룹 Y축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Y 크기

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L223)

컴퓨트 워크그룹 Z축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Z 크기

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:243](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L243)

캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:255](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L255)

이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.

#### Returns

`void`

***

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:283](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L283)

MSAA/Non-MSAA 컴퓨트 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `name` | `string` | 이펙트 식별 이름 |
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드 객체 |
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa` | `string` | - |

#### Returns

`void`

***

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): [`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:344](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L344)

텍스처 풀에서 출력 텍스처를 할당받아 컴퓨트 패스를 실행하고 결과 텍스처 정보를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../interfaces/IPostEffectResult.md)[] | 입력 소스 텍스처 정보 목록 |

#### Returns

[`IPostEffectResult`](../interfaces/IPostEffectResult.md)

렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:387](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L387)

지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 멤버 키 이름 |
| `value` | `number` \| `boolean` \| `number`[] | 기록할 값 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
