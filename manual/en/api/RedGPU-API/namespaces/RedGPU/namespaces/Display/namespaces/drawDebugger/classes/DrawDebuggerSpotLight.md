[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / DrawDebuggerSpotLight

# Class: DrawDebuggerSpotLight

Defined in: [src/display/drawDebugger/light/DrawDebuggerSpotLight.ts:26](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/DrawDebuggerSpotLight.ts#L26)

스포트라이트([SpotLight](../../../../Light/classes/SpotLight.md))의 원추형 조사 범위, 방향, 도달거리를 입체 기하 형태로 시각화하는 디버거 클래스입니다.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Remarks


***
- Renders nested cones corresponding to the inner (`innerCutoff`) and outer (`outerCutoff`) bounds of a target [SpotLight](../../../../Light/classes/SpotLight.md).
- Employs a flashlight emoji ('🔦') label alongside yellow guidelines mapping directions, lengths, and point anchors.

## Extends

- [`ADrawDebuggerLight`](ADrawDebuggerLight.md)\<[`SpotLight`](../../../../Light/classes/SpotLight.md)\>

## Constructors

### Constructor

> **new DrawDebuggerSpotLight**(`redGPUContext`, `target`): `DrawDebuggerSpotLight`

Defined in: [src/display/drawDebugger/light/DrawDebuggerSpotLight.ts:28](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/DrawDebuggerSpotLight.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `target` | [`SpotLight`](../../../../Light/classes/SpotLight.md) |

#### Returns

`DrawDebuggerSpotLight`

#### Overrides

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`constructor`](ADrawDebuggerLight.md#constructor)

## Accessors

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/DrawDebuggerSpotLight.ts:32](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/DrawDebuggerSpotLight.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`

#### Overrides

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`render`](ADrawDebuggerLight.md#render)

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### label

#### Get Signature

> **get** **label**(): [`TextField3D`](../../../classes/TextField3D.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:60](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L60)

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`label`](ADrawDebuggerLight.md#label)

***

### lightDebugMesh

#### Get Signature

> **get** **lightDebugMesh**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L64)

##### Returns

[`Mesh`](../../../classes/Mesh.md)

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`lightDebugMesh`](ADrawDebuggerLight.md#lightdebugmesh)

***

### target

#### Get Signature

> **get** **target**(): `T`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:56](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L56)

##### Returns

`T`

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`target`](ADrawDebuggerLight.md#target)

## Methods

### updateVertexBuffer()

> **updateVertexBuffer**(`lines`, `vertexBuffer`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:68](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lines` | `number`[][][] |
| `vertexBuffer` | [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md) |

#### Returns

`void`

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`updateVertexBuffer`](ADrawDebuggerLight.md#updatevertexbuffer)


</details>
