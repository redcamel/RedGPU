[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / ColorBalance

# Class: ColorBalance

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:10](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L10)

컬러 밸런스(Color Balance) 후처리 이펙트입니다.

이미지의 밝기 영역(Shadow, Midtone, Highlight)별로 RGB 채널의 밸런스를 정밀하게 조절합니다.

각 영역의 시안-레드, 마젠타-그린, 옐로우-블루 축을 조절하여 전체적인 톤과 분위기를 변경할 수 있습니다.

이 효과는 LDR 공간에서 동작할 때 가장 예측 가능한 결과를 제공합니다.

* ### Example
```typescript
const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
effect.shadowCyanRed = 50;         // 그림자 영역에 레드 추가
effect.midtoneYellowBlue = -30;    // 미드톤 영역에 옐로우 추가
effect.preserveLuminosity = true;   // 밝기 변화 억제
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/colorBalance/"></iframe>

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new ColorBalance**(`redGPUContext`): `ColorBalance`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L70)

ColorBalance 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`ColorBalance`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties

### highlightCyanRed

> **highlightCyanRed**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:16](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L16)

하이라이트 영역의 시안-빨강 밸런스 (-100 ~ 100)

***

### highlightMagentaGreen

> **highlightMagentaGreen**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:14](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L14)

하이라이트 영역의 마젠타-초록 밸런스 (-100 ~ 100)

***

### highlightYellowBlue

> **highlightYellowBlue**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:12](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L12)

하이라이트 영역의 노랑-파랑 밸런스 (-100 ~ 100)

***

### midtoneCyanRed

> **midtoneCyanRed**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:23](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L23)

미드톤 영역의 시안-빨강 밸런스 (-100 ~ 100)

***

### midtoneMagentaGreen

> **midtoneMagentaGreen**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:21](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L21)

미드톤 영역의 마젠타-초록 밸런스 (-100 ~ 100)

***

### midtoneYellowBlue

> **midtoneYellowBlue**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:19](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L19)

미드톤 영역의 노랑-파랑 밸런스 (-100 ~ 100)

***

### preserveLuminosity

> **preserveLuminosity**: `boolean`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:33](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L33)

밝기 보존 여부 (true 시 색상 변경 후에도 휘도를 일정하게 유지)

***

### shadowCyanRed

> **shadowCyanRed**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:30](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L30)

쉐도우 영역의 시안-빨강 밸런스 (-100 ~ 100)

***

### shadowMagentaGreen

> **shadowMagentaGreen**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:28](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L28)

쉐도우 영역의 마젠타-초록 밸런스 (-100 ~ 100)

***

### shadowYellowBlue

> **shadowYellowBlue**: `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:26](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L26)

쉐도우 영역의 노랑-파랑 밸런스 (-100 ~ 100)

## Accessors


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`instanceId`](../namespaces/Core/classes/ASinglePassPostEffect.md#instanceid)

***

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:12](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L12)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md#isinstanceofposteffect)

***

### isLdr

> **isLdr**: `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:29](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L29)

이펙트가 LDR(Low Dynamic Range) 공간에서 동작하는지 여부

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`isLdr`](../namespaces/Core/classes/ASinglePassPostEffect.md#isldr)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/ASinglePassPostEffect.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`name`](../namespaces/Core/classes/ASinglePassPostEffect.md#name)

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:208](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L208)

현재 할당된 출력 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

출력 GPUTextureView

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#resourcemanager)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:124](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L124)

현재 MSAA 상태에 따른 셰이더 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 분석 정보

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L112)

셰이더의 스토리지 구조 정보를 반환합니다.

##### Returns

`any`

스토리지 구조 정보

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### systemUniformsInfo

#### Get Signature

> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L160)

시스템 공용 유니폼 구조 정보를 반환합니다.

##### Returns

`any`

시스템 유니폼 구조 정보

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L136)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

유니폼 버퍼 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L148)

이펙트 전용 유니폼 구조 정보를 반환합니다.

##### Returns

`any`

유니폼 구조 정보

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uuid`](../namespaces/Core/classes/ASinglePassPostEffect.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:99](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L99)

비디오 메모리 사용량(Bytes)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (Bytes)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L172)

워크그룹 사이즈 X를 반환합니다.

##### Returns

`number`

워크그룹 사이즈 X

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L184)

워크그룹 사이즈 Y를 반환합니다.

##### Returns

`number`

워크그룹 사이즈 Y

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:196](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L196)

워크그룹 사이즈 Z를 반환합니다.

##### Returns

`number`

워크그룹 사이즈 Z

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:216](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L216)

이펙트에서 사용 중인 리소스를 해제합니다.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:224](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L224)

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`destroy`](../namespaces/Core/classes/ASinglePassPostEffect.md#destroy)

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:252](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L252)

이펙트를 초기화합니다. 컴퓨트 셰이더 및 유니폼 버퍼를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트
| `name` | `string` | 이펙트 이름
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | MSAA 및 Non-MSAA용 컴퓨트 셰이더 소스 코드
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa` | `string` | - |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../namespaces/Core/classes/ASinglePassPostEffect.md#init)

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:310](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L310)

이펙트를 렌더링하고 결과를 반환합니다. 필요한 경우 바인드 그룹을 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스
| `width` | `number` | 렌더링 너비
| `height` | `number` | 렌더링 높이
| ...`sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)[] | 입력으로 사용될 소스 텍스처 정보 리스트

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

렌더링 결과 (텍스처 및 뷰)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:363](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/postEffect/core/ASinglePassPostEffect.ts#L363)

특정 유니폼 값을 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 키 이름
| `value` | `number` \| `boolean` \| `number`[] | 설정할 값

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)


</details>
