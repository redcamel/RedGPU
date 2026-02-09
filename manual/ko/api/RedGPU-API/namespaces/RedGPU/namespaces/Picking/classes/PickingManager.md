[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingManager

# Class: PickingManager

Defined in: [src/picking/core/PickingManager.ts:29](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L29)

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

## Constructors

### Constructor

> **new PickingManager**(): `PickingManager`

#### Returns

`PickingManager`

## Properties

### lastMouseClickEvent

> **lastMouseClickEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:31](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L31)

***

### lastMouseEvent

> **lastMouseEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:30](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L30)

## Accessors

### castingList

#### Get Signature

> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/picking/core/PickingManager.ts:83](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L83)

피킹 대상 리스트를 반환합니다.


##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

***

### mouseX

#### Get Signature

> **get** **mouseX**(): `number`

Defined in: [src/picking/core/PickingManager.ts:59](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L59)

마우스 X 좌표


##### Returns

`number`

#### Set Signature

> **set** **mouseX**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:63](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L63)

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

Defined in: [src/picking/core/PickingManager.ts:71](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L71)

마우스 Y 좌표


##### Returns

`number`

#### Set Signature

> **set** **mouseY**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:75](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L75)

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

Defined in: [src/picking/core/PickingManager.ts:107](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L107)

피킹용 깊이 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

***

### pickingGPUTexture

#### Get Signature

> **get** **pickingGPUTexture**(): `GPUTexture`

Defined in: [src/picking/core/PickingManager.ts:91](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L91)

피킹용 GPU 텍스처를 반환합니다.


##### Returns

`GPUTexture`

***

### pickingGPUTextureView

#### Get Signature

> **get** **pickingGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:99](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L99)

피킹용 GPU 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/picking/core/PickingManager.ts:51](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L51)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

## Methods

### checkEvents()

> **checkEvents**(`view`, `time`): `void`

Defined in: [src/picking/core/PickingManager.ts:168](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L168)

이벤트를 확인하고 처리합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | View3D 인스턴스
| `time` | `number` | 시간

#### Returns

`void`

***

### checkTexture()

> **checkTexture**(`view`): `void`

Defined in: [src/picking/core/PickingManager.ts:142](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L142)

텍스처 크기를 확인하고 필요시 재생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | View3D 인스턴스

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/picking/core/PickingManager.ts:123](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L123)

PickingManager를 파기합니다.


#### Returns

`void`

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/picking/core/PickingManager.ts:115](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/picking/core/PickingManager.ts#L115)

캐스팅 리스트를 초기화합니다.


#### Returns

`void`
