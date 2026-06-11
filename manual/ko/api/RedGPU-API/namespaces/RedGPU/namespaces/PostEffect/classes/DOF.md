[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / DOF

# Class: DOF

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:35](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L35)

피사계 심도(DOF, Depth of Field) 후처리 이펙트입니다.

실제 카메라 렌즈의 특성을 시뮬레이션하여, 초점이 맞는 영역은 선명하게 하고 그 외의 영역은 거리에 따라 부드럽게 블러 처리합니다.

CoC(Circle of Confusion) 모델을 기반으로 물리적으로 정확한 심도 표현을 제공하며, 고품질 하드웨어 샘플링을 통해 매끄러운 보케(Bokeh) 질감을 구현합니다.

이 효과는 HDR 공간에서 동작하여 밝은 광원의 보케 형태를 아름답게 보존합니다.

* ### Example
```typescript
const effect = new RedGPU.PostEffect.DOF(redGPUContext);
effect.focusDistance = 10;
effect.aperture = 1.4;
effect.nearBlurSize = 20;
effect.farBlurSize = 25;
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/lens/dof/"></iframe>

## Extends

- [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

## Constructors

### Constructor

> **new DOF**(`redGPUContext`): `DOF`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:111](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L111)

DOF 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`DOF`

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`constructor`](../namespaces/Core/classes/AMultiPassPostEffect.md#constructor)

## Properties

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:168](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L168)

조리개 값을 반환합니다.

##### Returns

`number`

조리개 값 (F값)

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:180](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L180)

조리개 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 조리개 값 (F값)

##### Returns

`void`

***

### farBlurSize

#### Get Signature

> **get** **farBlurSize**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:294](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L294)

원거리 블러 크기를 반환합니다.

##### Returns

`number`

원거리 블러 크기 (픽셀 단위)

#### Set Signature

> **set** **farBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:306](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L306)

원거리 블러 크기를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 원거리 블러 크기 (픽셀 단위)

##### Returns

`void`

***

### farPlane

#### Get Signature

> **get** **farPlane**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:243](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L243)

원평면 값을 반환합니다.

##### Returns

`number`

원평면 거리

#### Set Signature

> **set** **farPlane**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:255](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L255)

원평면 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 원평면 거리

##### Returns

`void`

***

### farStrength

#### Get Signature

> **get** **farStrength**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:344](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L344)

원거리 블러 강도를 반환합니다.

##### Returns

`number`

원거리 블러 강도

#### Set Signature

> **set** **farStrength**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:356](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L356)

원거리 블러 강도를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 원거리 블러 강도

##### Returns

`void`

***

### focusDistance

#### Get Signature

> **get** **focusDistance**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:143](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L143)

초점 거리를 반환합니다.

##### Returns

`number`

초점 거리

#### Set Signature

> **set** **focusDistance**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:155](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L155)

초점 거리를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 초점 거리

##### Returns

`void`

***

### maxCoC

#### Get Signature

> **get** **maxCoC**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:193](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L193)

최대 CoC 값을 반환합니다.

##### Returns

`number`

최대 CoC 값

#### Set Signature

> **set** **maxCoC**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:205](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L205)

최대 CoC 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최대 CoC 값

##### Returns

`void`

***

### nearBlurSize

#### Get Signature

> **get** **nearBlurSize**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:269](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L269)

근거리 블러 크기를 반환합니다.

##### Returns

`number`

근거리 블러 크기 (픽셀 단위)

#### Set Signature

> **set** **nearBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:281](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L281)

근거리 블러 크기를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 근거리 블러 크기 (픽셀 단위)

##### Returns

`void`

***

### nearPlane

#### Get Signature

> **get** **nearPlane**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:218](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L218)

근평면 값을 반환합니다.

##### Returns

`number`

근평면 거리

#### Set Signature

> **set** **nearPlane**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:230](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L230)

근평면 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 근평면 거리

##### Returns

`void`

***

### nearStrength

#### Get Signature

> **get** **nearStrength**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:319](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L319)

근거리 블러 강도를 반환합니다.

##### Returns

`number`

근거리 블러 강도

#### Set Signature

> **set** **nearStrength**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:331](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L331)

근거리 블러 강도를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 근거리 블러 강도

##### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:479](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L479)

DOF 효과를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스
| `width` | `number` | 너비
| `height` | `number` | 높이
| `sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md) | 소스 텍스처 정보

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

최종 DOF 처리 결과

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`render`](../namespaces/Core/classes/AMultiPassPostEffect.md#render)

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:379](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L379)

시네마틱 프리셋을 적용합니다. (강한 DOF, 영화같은 느낌)

#### Returns

`void`

***

### setGameDefault()

> **setGameDefault**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:365](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L365)

게임 기본 프리셋을 적용합니다. (균형잡힌 품질/성능)

#### Returns

`void`

***

### setLandscape()

> **setLandscape**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:407](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L407)

풍경 사진 프리셋을 적용합니다. (전체적으로 선명, 약간의 원거리 흐림)

#### Returns

`void`

***

### setMacro()

> **setMacro**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:421](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L421)

매크로 촬영 프리셋을 적용합니다. (극도로 얕은 심도)

#### Returns

`void`

***

### setNightMode()

> **setNightMode**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:449](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L449)

야간 촬영 프리셋을 적용합니다. (저조도 환경)

#### Returns

`void`

***

### setPortrait()

> **setPortrait**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:393](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L393)

인물 사진 프리셋을 적용합니다. (배경 흐림, 인물 포커스)

#### Returns

`void`

***

### setSports()

> **setSports**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:435](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/effects/lens/dof/DOF.ts#L435)

액션/스포츠 프리셋을 적용합니다. (빠른 움직임에 적합)

#### Returns

`void`

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:13](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L13)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md#isinstanceofposteffect)

***

### isLdr

> **isLdr**: `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:30](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L30)

이펙트가 LDR(Low Dynamic Range) 공간에서 동작하는지 여부

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`isLdr`](../namespaces/Core/classes/AMultiPassPostEffect.md#isldr)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/AMultiPassPostEffect.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`name`](../namespaces/Core/classes/AMultiPassPostEffect.md#name)

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:208](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L208)

현재 할당된 출력 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

출력 GPUTextureView

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/AMultiPassPostEffect.md#outputtextureview)

***

### passList

#### Get Signature

> **get** **passList**(): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:65](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/AMultiPassPostEffect.ts#L65)

등록된 내부 패스 리스트를 반환합니다.

##### Returns

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

내부 단일 패스 이펙트 배열

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`passList`](../namespaces/Core/classes/AMultiPassPostEffect.md#passlist)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#resourcemanager)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:124](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L124)

현재 MSAA 상태에 따른 셰이더 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 분석 정보

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L112)

셰이더의 스토리지 구조 정보를 반환합니다.

##### Returns

`any`

스토리지 구조 정보

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#storageinfo)

***

### systemUniformsInfo

#### Get Signature

> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L160)

시스템 공용 유니폼 구조 정보를 반환합니다.

##### Returns

`any`

시스템 유니폼 구조 정보

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`systemUniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#systemuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L136)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

유니폼 버퍼 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L148)

이펙트 전용 유니폼 구조 정보를 반환합니다.

##### Returns

`any`

유니폼 구조 정보

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformsinfo)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uuid`](../namespaces/Core/classes/AMultiPassPostEffect.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:52](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/AMultiPassPostEffect.ts#L52)

모든 내부 패스의 비디오 메모리 사용량을 합산하여 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (Bytes)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/AMultiPassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L172)

워크그룹 사이즈 X를 반환합니다.

##### Returns

`number`

워크그룹 사이즈 X

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L184)

워크그룹 사이즈 Y를 반환합니다.

##### Returns

`number`

워크그룹 사이즈 Y

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:196](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L196)

워크그룹 사이즈 Z를 반환합니다.

##### Returns

`number`

워크그룹 사이즈 Z

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:73](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/AMultiPassPostEffect.ts#L73)

등록된 모든 내부 패스의 리소스를 해제합니다.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`clear`](../namespaces/Core/classes/AMultiPassPostEffect.md#clear)

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:238](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L238)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`init`](../namespaces/Core/classes/AMultiPassPostEffect.md#init)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:349](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/core/ASinglePassPostEffect.ts#L349)

특정 유니폼 값을 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 키 이름
| `value` | `number` \| `boolean` \| `number`[] | 설정할 값

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/AMultiPassPostEffect.md#updateuniform)


</details>
