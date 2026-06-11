[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / DrawDebuggerPointLight

# Class: DrawDebuggerPointLight

Defined in: [src/display/drawDebugger/light/DrawDebuggerPointLight.ts:27](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/DrawDebuggerPointLight.ts#L27)

점광원([PointLight](../../../../Light/classes/PointLight.md))의 물리적 위치와 영향 범위를 입체적으로 나타내어 주는 디버거 클래스입니다.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Remarks


***
- Visualizes light bounds and origin point of a target [PointLight](../../../../Light/classes/PointLight.md).
- Draws cyan wireframe boundary circles in 3 orthogonal planes (XY, XZ, YZ) alongside a bulb emoji ('💡') icon label.
- Tracks change events of the target light's `radius` property to update geometric bounds dynamically.

## Extends

- [`ADrawDebuggerLight`](ADrawDebuggerLight.md)\<[`PointLight`](../../../../Light/classes/PointLight.md)\>

## Constructors

### Constructor

> **new DrawDebuggerPointLight**(`redGPUContext`, `target`): `DrawDebuggerPointLight`

Defined in: [src/display/drawDebugger/light/DrawDebuggerPointLight.ts:29](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/DrawDebuggerPointLight.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `target` | [`PointLight`](../../../../Light/classes/PointLight.md) |

#### Returns

`DrawDebuggerPointLight`

#### Overrides

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`constructor`](ADrawDebuggerLight.md#constructor)

## Accessors

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/DrawDebuggerPointLight.ts:33](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/DrawDebuggerPointLight.ts#L33)

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

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:60](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L60)

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`label`](ADrawDebuggerLight.md#label)

***

### lightDebugMesh

#### Get Signature

> **get** **lightDebugMesh**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:64](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L64)

##### Returns

[`Mesh`](../../../classes/Mesh.md)

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`lightDebugMesh`](ADrawDebuggerLight.md#lightdebugmesh)

***

### target

#### Get Signature

> **get** **target**(): `T`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:56](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L56)

##### Returns

`T`

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`target`](ADrawDebuggerLight.md#target)

## Methods

### updateVertexBuffer()

> **updateVertexBuffer**(`lines`, `vertexBuffer`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:68](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L68)

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
