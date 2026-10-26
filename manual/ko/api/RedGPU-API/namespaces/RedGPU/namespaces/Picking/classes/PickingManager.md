[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingManager

# Class: PickingManager

Defined in: [src/picking/core/PickingManager.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L37)

GPU 오프스크린 피킹 패스와 레이캐스팅을 결합하여 뷰 내 객체의 마우스 상호작용을 처리하는 매니저 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// 올바른 접근 방법
const pickingManager = view.pickingManager;
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new PickingManager**(`view`): `PickingManager`

Defined in: [src/picking/core/PickingManager.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L74)

PickingManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`AView`](../../Display/namespaces/CoreView/classes/AView.md) | 피킹을 수행할 대상 뷰 인스턴스 |

#### Returns

`PickingManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### lastMouseClickEvent

> **lastMouseClickEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L47)

마지막으로 수신된 마우스 클릭 이벤트

***

***

### lastMouseEvent

> **lastMouseEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L42)

마지막으로 수신된 마우스 이동/버튼 이벤트

## Accessors



***

### castingList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/picking/core/PickingManager.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L131)

현재 프레임에 수집된 피킹 대상 객체 목록을 반환합니다.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

피킹 대상 메시 배열

***

***

### mouseX

#### Get Signature

> **get** **mouseX**(): `number`

Defined in: [src/picking/core/PickingManager.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L99)

현재 논리 마우스 X 좌표를 가져오거나 설정합니다.

##### Returns

`number`

논리 마우스 X 좌표

#### Set Signature

> **set** **mouseX**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L103)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mouseY

#### Get Signature

> **get** **mouseY**(): `number`

Defined in: [src/picking/core/PickingManager.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L115)

현재 논리 마우스 Y 좌표를 가져오거나 설정합니다.

##### Returns

`number`

논리 마우스 Y 좌표

#### Set Signature

> **set** **mouseY**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L119)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### pickingDepthGPUTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingDepthGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L167)

피킹 깊이 텍스처의 GPU 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

피킹 깊이용 `GPUTextureView`

***

***

### pickingGPUTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingGPUTexture**(): `GPUTexture`

Defined in: [src/picking/core/PickingManager.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L143)

피킹 색상 렌더링용 GPU 텍스처를 반환합니다.

##### Returns

`GPUTexture`

피킹용 `GPUTexture`

***

***

### pickingGPUTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L155)

피킹 색상 텍스처의 GPU 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

피킹용 `GPUTextureView`

***

***

### pickingPassDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingPassDescriptor**(): `GPURenderPassDescriptor`

Defined in: [src/picking/core/PickingManager.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L179)

피킹 렌더 패스 디스크립터를 반환합니다.

##### Returns

`GPURenderPassDescriptor`

`GPURenderPassDescriptor` 객체

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/picking/core/PickingManager.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L87)

피킹용 텍스처들이 점유 중인 총 비디오 메모리 크기(바이트)를 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

## Methods



***

### checkEvents()

> **checkEvents**(`view`, `time`): `Promise`\<`void`\>

Defined in: [src/picking/core/PickingManager.ts:268](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L268)

비동기로 픽셀 색상 값을 읽어 피킹된 객체를 판별하고 등록된 마우스 이벤트를 실행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | 대상 뷰 인스턴스 |
| `time` | `number` | 현재 프레임 시각 (ms) |

#### Returns

`Promise`\<`void`\>

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/picking/core/PickingManager.ts:242](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L242)

피킹 매니저의 GPU 텍스처 및 픽셀 읽기 버퍼를 파기합니다.

#### Returns

`void`

***

***

### render()

> **render**(`view`): `void`

Defined in: [src/picking/core/PickingManager.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L191)

수집된 피킹 대상 객체들을 피킹 렌더 패스에 기록하고 픽셀 읽기 복사를 예약합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 렌더링할 대상 `View3D` 인스턴스 |

#### Returns

`void`

***

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/picking/core/PickingManager.ts:234](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L234)

피킹 대상 객체 리스트를 비웁니다.

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

***

</details>
