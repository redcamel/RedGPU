[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / ADrawDebuggerLight

# Abstract Class: ADrawDebuggerLight\<T\>

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:34](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L34)

광원(Light) 디버거들의 조명 매개변수 및 시각 가이드를 그리기 위한 공통 추상 부모 클래스입니다.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Remarks


***
- Draws light visualization layouts (lines, boundaries, emoji icons).
- Automatically initializes a 3D icon label using [TextField3D](../../../classes/TextField3D.md).
- Implements a common buffer pipeline to stream coordinate details directly to GPU drawing passes.

## Extended by

- [`DrawDebuggerDirectionalLight`](DrawDebuggerDirectionalLight.md)
- [`DrawDebuggerPointLight`](DrawDebuggerPointLight.md)
- [`DrawDebuggerSpotLight`](DrawDebuggerSpotLight.md)

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`ABaseLight`](../../../../Light/namespaces/Core/classes/ABaseLight.md) |

## Constructors

### Constructor

> `protected` **new ADrawDebuggerLight**\<`T`\>(`redGPUContext`, `target`, `labelIcon`, `color`, `maxLines?`): `ADrawDebuggerLight`\<`T`\>

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L40)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` |
| `target` | `T` | `undefined` |
| `labelIcon` | `string` | `undefined` |
| `color` | \[`number`, `number`, `number`\] | `undefined` |
| `maxLines` | `number` | `32` |

#### Returns

`ADrawDebuggerLight`\<`T`\>

## Accessors

### label

#### Get Signature

> **get** **label**(): [`TextField3D`](../../../classes/TextField3D.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:60](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L60)

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

***

### lightDebugMesh

#### Get Signature

> **get** **lightDebugMesh**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:64](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L64)

##### Returns

[`Mesh`](../../../classes/Mesh.md)

***

### target

#### Get Signature

> **get** **target**(): `T`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:56](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L56)

##### Returns

`T`

## Methods

### render()

> `abstract` **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:106](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L106)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`

***

### updateVertexBuffer()

> **updateVertexBuffer**(`lines`, `vertexBuffer`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:68](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lines` | `number`[][][] |
| `vertexBuffer` | [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md) |

#### Returns

`void`
