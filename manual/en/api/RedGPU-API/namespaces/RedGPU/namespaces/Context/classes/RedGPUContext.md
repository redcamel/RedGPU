[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Context](../README.md) / RedGPUContext

# Class: RedGPUContext

Defined in: [src/context/RedGPUContext.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L38)

Top-level context class created after WebGPU initialization, managing the GPU device/adapter, canvas, `View3D` container, and resource, command, and anti-aliasing managers.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
RedGPU.init(canvas, (redGPUContext) => {
    redGPUContext.backgroundColor = new RedGPU.Color.ColorRGBA(0, 0, 0, 1);
});
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/helloWorld/" style="width:100%; height:500px;"></iframe>

## See

[Hello World example](https://redcamel.github.io/RedGPU/examples/3d/helloWorld/)

## Extends

- [`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md)

## Constructors



***

### Constructor

> **new RedGPUContext**(`htmlCanvas`, `gpuAdapter`, `gpuDevice`, `gpuContext`, `alphaMode`, `onDestroy?`): `RedGPUContext`

Defined in: [src/context/RedGPUContext.ts:111](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L111)

Creates a RedGPUContext instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `htmlCanvas` | `HTMLCanvasElement` | Target `HTMLCanvasElement` for rendering |
| `gpuAdapter` | `GPUAdapter` | Initialized WebGPU `GPUAdapter` |
| `gpuDevice` | `GPUDevice` | Initialized WebGPU `GPUDevice` |
| `gpuContext` | `GPUCanvasContext` | Canvas WebGPU context (`GPUCanvasContext`) |
| `alphaMode` | `GPUCanvasAlphaMode` | Canvas alpha compositing mode (`GPUCanvasAlphaMode`) |
| `onDestroy?` | (`info`) => `void` | Optional callback function invoked when the device is destroyed |

#### Returns

`RedGPUContext`

#### Overrides

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`constructor`](../namespaces/Core/classes/RedGPUContextViewContainer.md#constructor)

## Properties



***

### currentRequestAnimationFrame

> **currentRequestAnimationFrame**: `number`

Defined in: [src/context/RedGPUContext.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L43)

Currently active `requestAnimationFrame` loop ID

***

***

### currentTime

> **currentTime**: `number`

Defined in: [src/context/RedGPUContext.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L53)

Timestamp of the current frame (ms)

***

***

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/context/RedGPUContext.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L48)

Resize event callback invoked when the canvas size changes (`RedResizeEvent<RedGPUContext>`)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<`RedGPUContext`\> |

#### Returns

`void`

***

***

### targetRenderer

> **targetRenderer**: [`Renderer`](../../../classes/Renderer.md)

Defined in: [src/context/RedGPUContext.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L58)

Target `Renderer` instance currently rendering this context

## Accessors



***

### alphaMode

#### Get Signature

> **get** **alphaMode**(): `GPUCanvasAlphaMode`

Defined in: [src/context/RedGPUContext.ts:300](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L300)

Gets or sets the alpha compositing mode (`GPUCanvasAlphaMode`) of the canvas.

##### Returns

`GPUCanvasAlphaMode`

Currently configured `GPUCanvasAlphaMode`

#### Set Signature

> **set** **alphaMode**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:304](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L304)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUCanvasAlphaMode` |

##### Returns

`void`

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/context/RedGPUContext.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L196)

Returns the anti-aliasing manager (`AntialiasingManager`).

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

***

***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/context/RedGPUContext.ts:247](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L247)

Gets or sets the default background color (`ColorRGBA`) of the context.

##### Throws

Throws an error when setting a value that is not a `ColorRGBA` instance

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Background `ColorRGBA` instance

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:251](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L251)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGBA`](../../Color/classes/ColorRGBA.md) |

##### Returns

`void`

***

***

### boundingClientRect

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingClientRect**(): `DOMRect`

Defined in: [src/context/RedGPUContext.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L184)

Returns the `DOMRect` bounding area of the HTML canvas.

##### Returns

`DOMRect`

Canvas `DOMRect` object

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/context/RedGPUContext.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L172)

Returns the command encoder manager (`CommandEncoderManager`).

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

***

***

### configurationDescription

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **configurationDescription**(): `GPUCanvasConfiguration`

Defined in: [src/context/RedGPUContext.ts:276](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L276)

Returns the WebGPU canvas configuration (`GPUCanvasConfiguration`).

##### Returns

`GPUCanvasConfiguration`

`GPUCanvasConfiguration` object

***

***

### destroyed

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **destroyed**(): `boolean`

Defined in: [src/context/RedGPUContext.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L148)

Returns whether the context has been destroyed.

##### Returns

`boolean`

Whether the context is destroyed

***

***

### detector

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **detector**(): [`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

Defined in: [src/context/RedGPUContext.ts:264](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L264)

Returns the hardware and browser environment detector (`RedGPUContextDetector`).

##### Returns

[`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

`RedGPUContextDetector` instance

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/context/RedGPUContext.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L160)

Returns the draw buffer manager (`DrawBufferManager`).

##### Returns

`DrawBufferManager`

`DrawBufferManager` instance

***

***

### globalFragmentSSBO\_BuiltIn

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSSBO\_BuiltIn**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L232)

Returns the global fragment storage buffer manager (`GlobalStorageBufferManager`) for built-in materials.

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Global fragment `GlobalStorageBufferManager` instance for built-in materials

***

***

### globalFragmentSSBO\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSSBO\_PBR**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L220)

Returns the global fragment storage buffer manager (`GlobalStorageBufferManager`) for PBR materials.

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Global fragment `GlobalStorageBufferManager` instance for PBR

***

***

### globalVertexSSBO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSSBO**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L208)

Returns the global vertex storage buffer manager (`GlobalStorageBufferManager`).

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Global vertex `GlobalStorageBufferManager` instance

***

***

### gpuAdapter

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/RedGPUContext.ts:288](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L288)

Returns the WebGPU adapter (`GPUAdapter`).

##### Returns

`GPUAdapter`

`GPUAdapter` instance

***

***

### gpuContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuContext**(): `GPUCanvasContext`

Defined in: [src/context/RedGPUContext.ts:317](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L317)

Returns the WebGPU canvas context (`GPUCanvasContext`).

##### Returns

`GPUCanvasContext`

`GPUCanvasContext` instance

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/context/RedGPUContext.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L329)

Returns the WebGPU logical device (`GPUDevice`).

##### Returns

`GPUDevice`

`GPUDevice` instance

***

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:409](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L409)

Gets or sets the canvas height (number or `px`/`%` string).

##### Returns

`string` \| `number`

Configured height value

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:413](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L413)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

***

***

### htmlCanvas

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **htmlCanvas**(): `HTMLCanvasElement`

Defined in: [src/context/RedGPUContext.ts:341](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L341)

Returns the target `HTMLCanvasElement` for rendering.

##### Returns

`HTMLCanvasElement`

`HTMLCanvasElement` instance

***

***

### keyboardKeyBuffer

#### Get Signature

> **get** **keyboardKeyBuffer**(): `object`

Defined in: [src/context/RedGPUContext.ts:353](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L353)

Gets or sets the keyboard key input state buffer.

##### Returns

`object`

Key press state map (`{ [key: string]: boolean }`)

#### Set Signature

> **set** **keyboardKeyBuffer**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L357)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \{\[`p`: `string`\]: `boolean`; \} |

##### Returns

`void`

***

***

### pixelRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:437](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L437)

Returns the rendering area information in physical pixels.

##### Returns

`IRedGPURectObject`

Physical pixel rect object (`IRedGPURectObject`)

***

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/RedGPUContext.ts:449](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L449)

Gets or sets the rendering resolution scale factor.

##### Returns

`number`

Current rendering scale factor

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:453](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L453)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/context/RedGPUContext.ts:369](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L369)

Returns the GPU resource manager (`ResourceManager`).

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

***

***

### screenRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **screenRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:425](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L425)

Returns the screen area information in CSS logical pixels.

##### Returns

`IRedGPURectObject`

CSS pixel rect object (`IRedGPURectObject`)

***

***

### sizeManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sizeManager**(): [`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

Defined in: [src/context/RedGPUContext.ts:381](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L381)

Returns the canvas size and resolution manager (`RedGPUContextSizeManager`).

##### Returns

[`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

`RedGPUContextSizeManager` instance

***

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:393](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L393)

Gets or sets the canvas width (number or `px`/`%` string).

##### Returns

`string` \| `number`

Configured width value

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:397](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L397)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/context/RedGPUContext.ts:465](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L465)

Destroys the RedGPUContext instance and releases all registered views, managers, event listeners, and WebGPU device resources.

#### Returns

`void`

***

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/context/RedGPUContext.ts:555](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L555)

Sets the width and height of the context (canvas).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | Width (default: currently configured `width`) |
| `h?` | `string` \| `number` | Height (default: currently configured `height`) |

#### Returns

`void`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### numViews

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L52)

Returns the total number of registered `View3D` instances.

##### Returns

`number`

Number of registered views

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`numViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#numviews)

***

***

### viewList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewList**(): [`View3D`](../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L40)

Returns the list of registered `View3D` instances.

##### Returns

[`View3D`](../../Display/classes/View3D.md)[]

Array of `View3D` instances

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`viewList`](../namespaces/Core/classes/RedGPUContextViewContainer.md#viewlist)

***

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L82)

Appends a `View3D` to the end of the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to add |

#### Returns

`void`

#### Throws

Throws an error if `view` is not a `View3D` instance

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addview)

***

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L101)

Places a `View3D` at the specified index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to add |
| `index` | `number` | Target index (unsigned integer) |

#### Returns

`void`

#### Throws

Throws an error if `view` is not a `View3D` instance or `index` is not a valid uint

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addviewat)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L67)

Checks whether the specified `View3D` is contained in the current container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to check |

#### Returns

`boolean`

Whether the view is contained

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`contains`](../namespaces/Core/classes/RedGPUContextViewContainer.md#contains)

***

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L124)

Returns the `View3D` at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to retrieve |

#### Returns

[`View3D`](../../Display/classes/View3D.md)

`View3D` instance at the specified index

#### Throws

Throws an error if `index` is not a valid uint

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewat)

***

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L143)

Returns the index of the specified `View3D`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to find |

#### Returns

`number`

Index of the view (`-1` if not found)

#### Throws

Throws an error if `view` is not a `View3D` instance

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewindex)

***

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L265)

Removes all registered `View3D` instances from the view list.

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeAllViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeallviews)

***

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:233](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L233)

Removes the specified `View3D` from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to remove |

#### Returns

`void`

#### Throws

Throws an error if the view is not found in the view list

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeview)

***

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:251](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L251)

Removes the `View3D` at the specified index from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to remove |

#### Returns

`void`

#### Throws

Throws an error if `index` is out of range

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeviewat)

***

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L162)

Moves a registered `View3D` to the specified index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to move |
| `index` | `number` | Target index to move to |

#### Returns

`void`

#### Throws

Throws an error if the view is not registered or `index` is out of bounds

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`setViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#setviewindex)

***

***

### swapViews()

> **swapViews**(`view1`, `view2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L188)

Swaps the positions of two registered `View3D` instances in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view1` | [`View3D`](../../Display/classes/View3D.md) | First `View3D` instance to swap |
| `view2` | [`View3D`](../../Display/classes/View3D.md) | Second `View3D` instance to swap |

#### Returns

`void`

#### Throws

Throws an error if either view is not registered in this container

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviews)

***

***

### swapViewsAt()

> **swapViewsAt**(`index1`, `index2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:211](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L211)

Swaps the `View3D` instances at the two specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First view index |
| `index2` | `number` | Second view index |

#### Returns

`void`

#### Throws

Throws an error if the indices are identical or out of bounds

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViewsAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviewsat)

</details>
