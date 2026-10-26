[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [DrawDebugger](../README.md) / DrawDebuggerDirectionalLight

# Class: DrawDebuggerDirectionalLight

Defined in: [src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts#L27)

Debugger class that visualizes the light direction vector of a `DirectionalLight` in 3D space.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Enable via the enableDebugger property of DirectionalLight.
directionalLight.enableDebugger = true;
```

## See

- [DirectionalLight example](https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/)
 - [DrawDebugger basic example](https://redcamel.github.io/RedGPU/examples/3d/drawDebugger/basic/)

## Extends

- [`ADrawDebuggerLight`](ADrawDebuggerLight.md)\<[`DirectionalLight`](../../../../Light/classes/DirectionalLight.md)\>

## Constructors



***

### Constructor

> **new DrawDebuggerDirectionalLight**(`redGPUContext`, `target`): `DrawDebuggerDirectionalLight`

Defined in: [src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts#L41)

Creates a `DrawDebuggerDirectionalLight` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `target` | [`DirectionalLight`](../../../../Light/classes/DirectionalLight.md) | Target directional light object to debug |

#### Returns

`DrawDebuggerDirectionalLight`

#### Overrides

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`constructor`](ADrawDebuggerLight.md#constructor)

## Accessors



## Methods



***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts#L53)

Renders the directional light debug guide and icon label.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) | Render state data of the current view |

#### Returns

`void`

#### Overrides

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`render`](ADrawDebuggerLight.md#render)

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`antialiasingManager`](ADrawDebuggerLight.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`commandEncoderManager`](ADrawDebuggerLight.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`gpuDevice`](ADrawDebuggerLight.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`instanceId`](ADrawDebuggerLight.md#instanceid)

***

***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): [`TextField3D`](../../../classes/TextField3D.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L92)

Returns the 3D text label object indicating the light position.

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

3D text label object

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`label`](ADrawDebuggerLight.md#label)

***

***

### lightDebugMesh

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lightDebugMesh**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L104)

Returns the debug mesh object that draws the light guide.

##### Returns

[`Mesh`](../../../classes/Mesh.md)

Light debug mesh object

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`lightDebugMesh`](ADrawDebuggerLight.md#lightdebugmesh)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

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

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`name`](ADrawDebuggerLight.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`redGPUContext`](ADrawDebuggerLight.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`resourceManager`](ADrawDebuggerLight.md#resourcemanager)

***

***

### target

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **target**(): `T`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L80)

Returns the target light object being debugged.

##### Returns

`T`

Target light object

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`target`](ADrawDebuggerLight.md#target)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`uuid`](ADrawDebuggerLight.md#uuid)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### updateVertexBuffer()

> **updateVertexBuffer**(`lines`, `vertexBuffer`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L119)

Updates the vertex buffer data of the debug mesh based on the list of line segment coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lines` | `number`[][][] | Array of start and end coordinate pairs (`[[x1, y1, z1], [x2, y2, z2]][]`) |
| `vertexBuffer` | [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md) | Target vertex buffer to update |

#### Returns

`void`

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`updateVertexBuffer`](ADrawDebuggerLight.md#updatevertexbuffer)

</details>
