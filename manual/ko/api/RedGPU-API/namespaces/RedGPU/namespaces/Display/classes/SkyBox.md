[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyBox

# Class: SkyBox

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L47)

큐브맵 텍스처를 사용하여 3D 씬의 무한 원경 배경을 렌더링하는 스카이박스 클래스입니다.

물리적 휘도(Nit), 강도 배율, 블러(Blur), 불투명도 조절 및 노이즈 마스크 기반의 실시간 텍스처 전환(Transition) 효과를 지원합니다.

***

### Example
```typescript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
view.skybox = skybox;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/" style="width:100%; height:500px;"></iframe>

## See

- [SkyBox basic example](https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/)
 - [SkyBox IBL example](https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/)
 - [SkyBox transition example](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 - [SkyBox transition with noise texture](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new SkyBox**(`redGPUContext`, `texture`, `luminance?`): `SkyBox`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L94)

SkyBox 인스턴스를 생성합니다.

#### Example
```typescript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture, 25000);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) | `undefined` | 배경으로 사용할 큐브 텍스처 객체 |
| `luminance?` | `number` | `25000` | 물리적 휘도 (단위: Nit, 기본값: 25000) |

#### Returns

`SkyBox`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L57)

버텍스 GPU 렌더링 정보 객체

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L52)

스카이박스 모델 변환 행렬

## Accessors



***

### blur

#### Get Signature

> **get** **blur**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:165](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L165)

배경 텍스처의 블러 강도(0.0 ~ 1.0)를 가져오거나 설정합니다.

##### Returns

`number`

블러 강도 (0.0 ~ 1.0)

#### Set Signature

> **set** **blur**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:169](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L169)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L149)

시각적 밝기 조절을 위한 강도 배율을 가져오거나 설정합니다.

##### Returns

`number`

강도 배율

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L153)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### luminance

#### Get Signature

> **get** **luminance**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L132)

물리 기반 광학 시뮬레이션용 휘도(Nit) 값을 가져오거나 설정합니다.

##### Returns

`number`

휘도 값 (단위: Nit)

#### Set Signature

> **set** **luminance**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L136)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L182)

스카이박스 배경의 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.

##### Returns

`number`

불투명도 (0.0 ~ 1.0)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:186](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### texture

#### Get Signature

> **get** **texture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L114)

스카이박스 배경으로 적용된 현재 큐브 텍스처를 가져오거나 설정합니다.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

현재 큐브 텍스처 인스턴스

#### Set Signature

> **set** **texture**(`texture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:118](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L118)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) |

##### Returns

`void`

***

***

### transitionTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **transitionTexture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:199](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L199)

텍스처 전환 애니메이션의 목표 큐브 텍스처를 반환합니다.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

전환 목표 큐브 텍스처

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L297)

스카이박스 인스턴스를 파기하고 할당된 GPU 리소스를 해제합니다.

#### Returns

`void`

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:238](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L238)

스카이박스를 렌더링하고 진행 중인 텍스처 전환 상태를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 현재 뷰의 렌더링 상태 데이터 |

#### Returns

`void`

***

***

### transition()

> **transition**(`targetTexture`, `duration?`, `mask`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:222](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyboxs/skyBox/SkyBox.ts#L222)

지정된 대상 큐브 텍스처로 배경을 전환하는 애니메이션을 시작합니다.

#### Example
```typescript
skybox.transition(nextCubeTexture, 500, noiseTexture);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `targetTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) | `undefined` | 전환할 대상 큐브 텍스처 |
| `duration?` | `number` | `300` | 전환 지속 시간 (단위: ms, 기본값: 300) |
| `mask` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) | `undefined` | 전환 효과에 사용할 노이즈 마스크 텍스처 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
