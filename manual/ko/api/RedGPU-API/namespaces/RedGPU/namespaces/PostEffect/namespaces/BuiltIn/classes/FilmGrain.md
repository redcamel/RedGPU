[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / FilmGrain

# Class: FilmGrain

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:40](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L40)

필름의 입자 질감을 시뮬레이션하는 필름 그레인 후처리 이펙트입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 builtInEffectManager를 통해 FilmGrain 활성화 및 프리셋 적용
view.builtInEffectManager.useFilmGrain = true;
const filmGrain = view.builtInEffectManager.filmGrain;
filmGrain.applyPreset(RedGPU.PostEffect.BuiltIn.FilmGrain.MEDIUM);
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/filmGrain/" />

## See

[FilmGrain example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/filmGrain/)

## Extends

- [`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md)

## Constructors



***

### Constructor

> **new FilmGrain**(`redGPUContext`): `FilmGrain`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:126](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L126)

FilmGrain 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`FilmGrain`

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`constructor`](../../Core/classes/ASingleComputePassPostEffect.md#constructor)

## Properties



***

### coloredGrain

> **coloredGrain**: `number` = `0.15`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:64](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L64)

유색 그레인 적용 비율 (0: 단색, 1: 풀컬러)

***

***

### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.06`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:46](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L46)

그레인 입자 강도 (0 이상)

***

***

### filmGrainResponse

> **filmGrainResponse**: `number` = `1.0`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:52](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L52)

명도에 따른 그레인 반응 곡선 (0 이상)

***

***

### filmGrainScale

> **filmGrainScale**: `number` = `1.6`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:58](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L58)

그레인 입자 크기 스케일 (0 이상)

***

***

### grainSaturation

> **grainSaturation**: `number` = `0.3`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L70)

그레인 입자 채도 강도 (0 이상)

***

***

### HEAVY

> `static` **HEAVY**: `object`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:111](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L111)

강한 질감 프리셋

#### coloredGrain

> **coloredGrain**: `number` = `0.25`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.10`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.8`

#### filmGrainScale

> **filmGrainScale**: `number` = `2.2`

#### grainSaturation

> **grainSaturation**: `number` = `0.5`

***

***

### MEDIUM

> `static` **MEDIUM**: `object`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:106](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L106)

표준 질감 프리셋

#### coloredGrain

> **coloredGrain**: `number` = `0.15`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.06`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `1.0`

#### filmGrainScale

> **filmGrainScale**: `number` = `1.6`

#### grainSaturation

> **grainSaturation**: `number` = `0.3`

***

***

### SUBTLE

> `static` **SUBTLE**: `object`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:101](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L101)

미세한 질감 프리셋

#### coloredGrain

> **coloredGrain**: `number` = `0.05`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.03`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `1.2`

#### filmGrainScale

> **filmGrainScale**: `number` = `1.2`

#### grainSaturation

> **grainSaturation**: `number` = `0.1`

***

***

### VINTAGE

> `static` **VINTAGE**: `object`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:116](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L116)

빈티지 영화 스타일 프리셋

#### coloredGrain

> **coloredGrain**: `number` = `0.6`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.16`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.6`

#### filmGrainScale

> **filmGrainScale**: `number` = `3.0`

#### grainSaturation

> **grainSaturation**: `number` = `0.8`

## Accessors



## Methods



***

### applyPreset()

> **applyPreset**(`preset`): `void`

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:149](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L149)

프리셋 수치를 이펙트에 적용합니다.

#### Example
```typescript
view.builtInEffectManager.useFilmGrain = true;
view.builtInEffectManager.filmGrain.applyPreset(RedGPU.PostEffect.BuiltIn.FilmGrain.SUBTLE);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `preset` | \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} | 적용할 프리셋 객체 |
| `preset.coloredGrain?` | `number` | - |
| `preset.filmGrainIntensity?` | `number` | - |
| `preset.filmGrainResponse?` | `number` | - |
| `preset.filmGrainScale?` | `number` | - |
| `preset.grainSaturation?` | `number` | - |

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L19)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`isInstanceofPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md#isinstanceofposteffect)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`antialiasingManager`](../../Core/classes/ASingleComputePassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`commandEncoderManager`](../../Core/classes/ASingleComputePassPostEffect.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`gpuDevice`](../../Core/classes/ASingleComputePassPostEffect.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`instanceId`](../../Core/classes/ASingleComputePassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:102](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L102)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`isLdr`](../../Core/classes/ASingleComputePassPostEffect.md#isldr)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`name`](../../Core/classes/ASingleComputePassPostEffect.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`redGPUContext`](../../Core/classes/ASingleComputePassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`resourceManager`](../../Core/classes/ASingleComputePassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:126](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L126)

WGSL 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 파싱 정보

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`shaderInfo`](../../Core/classes/ASingleComputePassPostEffect.md#shaderinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:138](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L138)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

`UniformBuffer` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`uniformBuffer`](../../Core/classes/ASingleComputePassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:150](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L150)

이펙트 전용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`uniformsInfo`](../../Core/classes/ASingleComputePassPostEffect.md#uniformsinfo)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`uuid`](../../Core/classes/ASingleComputePassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:114](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L114)

이펙트 고유 버퍼의 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`videoMemorySize`](../../Core/classes/ASingleComputePassPostEffect.md#videomemorysize)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:163](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L163)

컴퓨트 워크그룹 X축 크기를 반환합니다.

##### Returns

`number`

워크그룹 X 크기

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_X`](../../Core/classes/ASingleComputePassPostEffect.md#work_size_x)

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:176](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L176)

컴퓨트 워크그룹 Y축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Y 크기

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_Y`](../../Core/classes/ASingleComputePassPostEffect.md#work_size_y)

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:189](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L189)

컴퓨트 워크그룹 Z축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Z 크기

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_Z`](../../Core/classes/ASingleComputePassPostEffect.md#work_size_z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:197](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L197)

캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`clear`](../../Core/classes/ASingleComputePassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:207](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L207)

이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`destroy`](../../Core/classes/ASingleComputePassPostEffect.md#destroy)

***

***

### executePass()

> `protected` **executePass**(`view`, `width`, `height`, `result`, ...`sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:339](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L339)

지정된 출력 타겟(`result`)에 컴퓨트 패스를 실행하고 결과 텍스처 정보를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| `result` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | 결과를 기록할 출력 텍스처 및 뷰 (`IPostEffectResult`) |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)[] | 입력 소스 텍스처 정보 목록 |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`executePass`](../../Core/classes/ASingleComputePassPostEffect.md#executepass)

***

***

### init()

> **init**(`redGPUContext`, `name`, `computeCode`): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L236)

컴퓨트 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `name` | `string` | 이펙트 식별 이름 |
| `computeCode` | `string` | 컴퓨트 셰이더 WGSL 코드 문자열 |

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`init`](../../Core/classes/ASingleComputePassPostEffect.md#init)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/filmGrain/FilmGrain.ts:177](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/filmGrain/FilmGrain.ts#L177)

필름 그레인 후처리 이펙트를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | 입력 소스 텍스처 정보 |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

렌더링 결과 (`IPostEffectResult`)

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`render`](../../Core/classes/ASingleComputePassPostEffect.md#render)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:309](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L309)

지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 멤버 키 이름 |
| `value` | `number` \| `boolean` \| `number`[] | 기록할 값 |

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md).[`updateUniform`](../../Core/classes/ASingleComputePassPostEffect.md#updateuniform)

</details>
