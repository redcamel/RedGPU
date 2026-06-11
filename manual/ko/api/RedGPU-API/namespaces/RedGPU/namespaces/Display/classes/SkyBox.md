[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyBox

# Class: SkyBox

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:57](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L57)

3D 씬의 원경 및 환경 맵 정보로 사용되는 스카이박스(Skybox) 클래스입니다.

큐브 맵 텍스처를 이용하여 무한한 공간 배경을 렌더링합니다. 물리 기반 렌더링에 적합한 물리적 휘도(Luminance) 설정, 아티스트용 강도 배율, 실시간 전환 효과(Transition) 및 블러(Blur)와 불투명도 조절 기능을 지원합니다.

### Example
```typescript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
view.skybox = skybox;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/" ></iframe>

아래는 SkyBox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

## See

 - [SkyBox basic example](https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/)
 - [SkyBox transition example](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 - [SkyBox transition example2](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new SkyBox**(`redGPUContext`, `texture`, `luminance?`): `SkyBox`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:97](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L97)

SkyBox 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPU 컨텍스트 인스턴스
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) | `undefined` | 배경으로 사용할 큐브 텍스처 객체
| `luminance` | `number` | `25000` | 물리적 휘도 (단위: cd/m² 또는 Nit, 기본값: 25000 Nit)

#### Returns

`SkyBox`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:67](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L67)

GPU 렌더링 및 유니폼 정보 객체

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:62](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L62)

스카이박스 메쉬 모델 변환 행렬

## Accessors

### blur

#### Get Signature

> **get** **blur**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:152](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L152)

배경 텍스처의 블러 세기(0.0 ~ 1.0)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **blur**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:156](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L156)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:140](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L140)

시각적인 라이팅 강도를 조절하기 위한 강도 배율을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:144](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L144)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### luminance

#### Get Signature

> **get** **luminance**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:127](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L127)

물리 기반 광학 시뮬레이션용 휘도(Nit) 값을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **luminance**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:131](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L131)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:165](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L165)

스카이박스 배경의 최종 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:169](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L169)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### texture

#### Get Signature

> **get** **texture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:113](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L113)

스카이박스 배경으로 적용된 현재 큐브 텍스처를 가져오거나 설정합니다.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

#### Set Signature

> **set** **texture**(`texture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:117](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) |

##### Returns

`void`

***

### transitionTexture

#### Get Signature

> **get** **transitionTexture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:178](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L178)

텍스처 전환 애니메이션 도중의 목표가 되는 텍스처를 가져옵니다.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:210](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L210)

스카이박스를 화면 배경에 드로우합니다. 텍스처 전환이 진행 중이면 경과 시간을 기준으로 진척도를 계산해 업로드합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 현재 뷰 및 렌더 상태 데이터

#### Returns

`void`

***

### transition()

> **transition**(`targetTexture`, `duration?`, `mask`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:195](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/skyboxs/skyBox/SkyBox.ts#L195)

지정된 다른 큐브 텍스처로 부드럽게 배경을 전환하는 마스킹 애니메이션을 기동합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `targetTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) | `undefined` | 새롭게 전환할 대상 큐브 텍스처
| `duration` | `number` | `300` | 전환에 걸리는 지속 시간 (ms, 기본값: 300)
| `mask` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) | `undefined` | 전환 효과에 적용할 노이즈 마스크 텍스처

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L71)

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

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
