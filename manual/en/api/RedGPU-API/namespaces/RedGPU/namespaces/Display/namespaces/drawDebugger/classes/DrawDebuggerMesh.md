[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / DrawDebuggerMesh

# Class: DrawDebuggerMesh

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:48](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/drawDebugger/DrawDebuggerMesh.ts#L48)

대상 3D 메시(Mesh)의 공간 바운딩 박스(AABB, OBB) 정보를 추출하여 시각적으로 투영해 주는 디버깅용 클래스입니다.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Remarks


***
- Visualizes spatial bounds (AABB, OBB) of a target 3D Mesh in the viewport.
- Renders bounding wireframe boxes in various modes: OBB (Red), AABB (Green), or BOTH.
- Tracks change history of target geometries to execute GPU vertex updates lazily (performance-optimized caching).
- Implements view frustum culling to bypass drawing operations once the target object leaves the view camera boundaries.

## Constructors

### Constructor

> **new DrawDebuggerMesh**(`redGPUContext`, `target`): `DrawDebuggerMesh`

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:61](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/drawDebugger/DrawDebuggerMesh.ts#L61)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `target` | [`Mesh`](../../../classes/Mesh.md) |

#### Returns

`DrawDebuggerMesh`

## Accessors

### debugMode

#### Get Signature

> **get** **debugMode**(): `DebugMode`

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:80](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/drawDebugger/DrawDebuggerMesh.ts#L80)

##### Returns

`DebugMode`

#### Set Signature

> **set** **debugMode**(`value`): `void`

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:84](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/drawDebugger/DrawDebuggerMesh.ts#L84)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `DebugMode` |

##### Returns

`void`

## Methods

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:99](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/drawDebugger/DrawDebuggerMesh.ts#L99)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`
