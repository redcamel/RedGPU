[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [DrawDebugger](../README.md) / ADrawDebuggerLight

# Abstract Class: ADrawDebuggerLight\<T\>

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L29)

Abstract class for rendering light visual guides and label icons for light debuggers.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`DrawDebuggerDirectionalLight`](DrawDebuggerDirectionalLight.md)
- [`DrawDebuggerPointLight`](DrawDebuggerPointLight.md)
- [`DrawDebuggerSpotLight`](DrawDebuggerSpotLight.md)

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`ABaseLight`](../../../../Light/namespaces/Core/classes/ABaseLight.md) | Target light class type for debugging (extends `ABaseLight`) |

## Constructors



***

### Constructor

> **new ADrawDebuggerLight**\<`T`\>(`redGPUContext`, `target`, `labelIcon`, `color`, `maxLines?`): `ADrawDebuggerLight`\<`T`\>

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L55)

Creates an `ADrawDebuggerLight` instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `target` | `T` | `undefined` | Target light object to visualize |
| `labelIcon` | `string` | `undefined` | 3D text icon string to display at the light position |
| `color` | \[`number`, `number`, `number`\] | `undefined` | RGB color array for debug lines (`[r, g, b]`, 0–255) |
| `maxLines?` | `number` | `32` | Maximum number of lines to allocate in the vertex buffer (default: 32) |

#### Returns

`ADrawDebuggerLight`\<`T`\>

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): [`TextField3D`](../../../classes/TextField3D.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L92)

Returns the 3D text label object indicating the light position.

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

3D text label object

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

***

## Methods



***

### render()

> `abstract` **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L161)

Renders the light debug guide.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) | Render state data of the current view |

#### Returns

`void`

***

***

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
