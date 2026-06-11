[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingManager

# Class: PickingManager

Defined in: [src/picking/core/PickingManager.ts:38](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L38)

마우스 이벤트를 처리하고 객체와의 상호작용을 관리하는 클래스입니다.

마우스 클릭, 이동, 오버 등의 이벤트를 감지하고 처리합니다. GPU 텍스처를 사용하여 픽셀 단위의 객체 선택을 구현합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// 올바른 접근 방법 (Correct access)
const pickingManager = view.pickingManager;
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new PickingManager**(`view`): `PickingManager`

Defined in: [src/picking/core/PickingManager.ts:60](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L60)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`AView`](../../Display/namespaces/CoreView/classes/AView.md) |

#### Returns

`PickingManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### lastMouseClickEvent

> **lastMouseClickEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:40](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L40)

***

### lastMouseEvent

> **lastMouseEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:39](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L39)

## Accessors

### castingList

#### Get Signature

> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/picking/core/PickingManager.ts:101](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L101)

피킹 대상 리스트를 반환합니다.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

***

### mouseX

#### Get Signature

> **get** **mouseX**(): `number`

Defined in: [src/picking/core/PickingManager.ts:77](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L77)

마우스 X 좌표

##### Returns

`number`

#### Set Signature

> **set** **mouseX**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:81](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L81)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mouseY

#### Get Signature

> **get** **mouseY**(): `number`

Defined in: [src/picking/core/PickingManager.ts:89](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L89)

마우스 Y 좌표

##### Returns

`number`

#### Set Signature

> **set** **mouseY**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:93](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L93)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### pickingDepthGPUTextureView

#### Get Signature

> **get** **pickingDepthGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:125](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L125)

피킹용 깊이 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

***

### pickingGPUTexture

#### Get Signature

> **get** **pickingGPUTexture**(): `GPUTexture`

Defined in: [src/picking/core/PickingManager.ts:109](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L109)

피킹용 GPU 텍스처를 반환합니다.

##### Returns

`GPUTexture`

***

### pickingGPUTextureView

#### Get Signature

> **get** **pickingGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:117](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L117)

피킹용 GPU 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

***

### pickingPassDescriptor

#### Get Signature

> **get** **pickingPassDescriptor**(): `GPURenderPassDescriptor`

Defined in: [src/picking/core/PickingManager.ts:129](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L129)

##### Returns

`GPURenderPassDescriptor`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/picking/core/PickingManager.ts:69](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L69)

비디오 메모리 사용량을 반환합니다.

##### Returns

`number`

## Methods

### checkEvents()

> **checkEvents**(`view`, `time`): `Promise`\<`void`\>

Defined in: [src/picking/core/PickingManager.ts:206](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L206)

이벤트를 확인하고 처리합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | View3D 인스턴스
| `time` | `number` | 시간

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(): `void`

Defined in: [src/picking/core/PickingManager.ts:184](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L184)

PickingManager를 파기합니다.

#### Returns

`void`

***

### render()

> **render**(`view`): `void`

Defined in: [src/picking/core/PickingManager.ts:133](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L133)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) |

#### Returns

`void`

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/picking/core/PickingManager.ts:176](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/picking/core/PickingManager.ts#L176)

캐스팅 리스트를 초기화합니다.

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L52)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
