[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Context](../README.md) / RedGPUContext

# Class: RedGPUContext

Defined in: [src/context/RedGPUContext.ts:39](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L39)

The RedGPUContext class is the top-level context object provided after WebGPU initialization.

It holds core WebGPU information such as GPU, canvas, device, and adapter as properties.
It owns View3D objects and acts as the actual top-level container.
It provides various features such as resizing, background color, debug panel, anti-aliasing, and resource management.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
RedGPU.init(canvas, (redGPUContext) => {
    console.log('Context created:', redGPUContext);
    redGPUContext.backgroundColor = new RedGPU.Color.ColorRGBA(0, 0, 0, 1);
});
```

## Extends

- [`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md)

## Constructors

### Constructor

> **new RedGPUContext**(`htmlCanvas`, `gpuAdapter`, `gpuDevice`, `gpuContext`, `alphaMode`): `RedGPUContext`

Defined in: [src/context/RedGPUContext.ts:150](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L150)

RedGPUContext constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `htmlCanvas` | `HTMLCanvasElement` | HTMLCanvasElement to render |
| `gpuAdapter` | `GPUAdapter` | WebGPU Adapter |
| `gpuDevice` | `GPUDevice` | WebGPU Device |
| `gpuContext` | `GPUCanvasContext` | WebGPU Canvas Context |
| `alphaMode` | `GPUCanvasAlphaMode` | Canvas alpha mode |

#### Returns

`RedGPUContext`

#### Overrides

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`constructor`](../namespaces/Core/classes/RedGPUContextViewContainer.md#constructor)

## Properties

### currentRequestAnimationFrame

> **currentRequestAnimationFrame**: `number`

Defined in: [src/context/RedGPUContext.ts:44](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L44)

Current requestAnimationFrame ID (for frame loop management)

***

### currentTime

> **currentTime**: `number`

Defined in: [src/context/RedGPUContext.ts:55](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L55)

Current time (frame based, ms)

***

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/context/RedGPUContext.ts:50](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L50)

Resize event handler (called when canvas size changes)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `RedResizeEvent`\<`RedGPUContext`\> | Resize event object |

#### Returns

`void`

## Accessors

### alphaMode

#### Get Signature

> **get** **alphaMode**(): `GPUCanvasAlphaMode`

Defined in: [src/context/RedGPUContext.ts:246](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L246)

Returns the alpha mode of the canvas.

##### Returns

`GPUCanvasAlphaMode`

#### Set Signature

> **set** **alphaMode**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:257](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L257)

Sets the alpha mode of the canvas.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUCanvasAlphaMode` | GPUCanvasAlphaMode value to set |

##### Returns

`void`

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/context/RedGPUContext.ts:191](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L191)

Returns the antialiasing manager.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/context/RedGPUContext.ts:199](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L199)

Returns the background color.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:213](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L213)

Sets the background color.

##### Throws

Throws error if value is not an instance of ColorRGBA

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`ColorRGBA`](../../Color/classes/ColorRGBA.md) | ColorRGBA object to set |

##### Returns

`void`

***

### boundingClientRect

#### Get Signature

> **get** **boundingClientRect**(): `DOMRect`

Defined in: [src/context/RedGPUContext.ts:183](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L183)

Returns the BoundingClientRect info of the HTML canvas.

##### Returns

`DOMRect`

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/context/RedGPUContext.ts:175](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L175)

Returns the command encoder manager.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

***

### configurationDescription

#### Get Signature

> **get** **configurationDescription**(): `GPUCanvasConfiguration`

Defined in: [src/context/RedGPUContext.ts:230](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L230)

Returns the GPU canvas configuration information.

##### Returns

`GPUCanvasConfiguration`

***

### detector

#### Get Signature

> **get** **detector**(): [`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

Defined in: [src/context/RedGPUContext.ts:222](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L222)

Returns the RedGPUContextDetector instance.

##### Returns

[`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

***

### gpuAdapter

#### Get Signature

> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/RedGPUContext.ts:238](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L238)

Returns the GPU adapter.

##### Returns

`GPUAdapter`

***

### gpuContext

#### Get Signature

> **get** **gpuContext**(): `GPUCanvasContext`

Defined in: [src/context/RedGPUContext.ts:266](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L266)

Returns the GPU canvas context.

##### Returns

`GPUCanvasContext`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/context/RedGPUContext.ts:274](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L274)

Returns the GPU device.

##### Returns

`GPUDevice`

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:344](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L344)

Returns the height.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:355](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L355)

Sets the height.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Height value (number or string) |

##### Returns

`void`

***

### htmlCanvas

#### Get Signature

> **get** **htmlCanvas**(): `HTMLCanvasElement`

Defined in: [src/context/RedGPUContext.ts:282](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L282)

Returns the HTML canvas element.

##### Returns

`HTMLCanvasElement`

***

### keyboardKeyBuffer

#### Get Signature

> **get** **keyboardKeyBuffer**(): `object`

Defined in: [src/context/RedGPUContext.ts:290](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L290)

Returns the keyboard input state buffer.

##### Returns

`object`

#### Set Signature

> **set** **keyboardKeyBuffer**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:301](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L301)

Sets the keyboard input state buffer.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | \{\[`p`: `string`\]: `boolean`; \} | Keyboard state object |

##### Returns

`void`

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:371](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L371)

Returns the pixel size information. (in physical pixels)

##### Returns

`IRedGPURectObject`

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/RedGPUContext.ts:379](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L379)

Returns the render scale.

##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:390](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L390)

Sets the render scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Render scale value |

##### Returns

`void`

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/context/RedGPUContext.ts:309](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L309)

Returns the resource manager.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:363](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L363)

Returns the screen size information. (in CSS pixels)

##### Returns

`IRedGPURectObject`

***

### sizeManager

#### Get Signature

> **get** **sizeManager**(): [`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

Defined in: [src/context/RedGPUContext.ts:317](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L317)

Returns the RedGPUContextSizeManager instance.

##### Returns

[`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:325](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L325)

Returns the width.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:336](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L336)

Sets the width.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Width value (number or string) |

##### Returns

`void`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/context/RedGPUContext.ts:402](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L402)

Destroys the GPU device and releases resources.

#### Returns

`void`

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/context/RedGPUContext.ts:417](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/RedGPUContext.ts#L417)

Sets the size of the context.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | Width (default: current width) |
| `h` | `string` \| `number` | Height (default: current height) |

#### Returns

`void`

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### numViews

#### Get Signature

> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:52](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L52)

Returns the number of View3D objects owned.

##### Returns

`number`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`numViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#numviews)

***

### viewList

#### Get Signature

> **get** **viewList**(): [`View3D`](../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:44](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L44)

Returns the list of View3D objects owned by this instance.

##### Returns

[`View3D`](../../Display/classes/View3D.md)[]

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`viewList`](../namespaces/Core/classes/RedGPUContextViewContainer.md#viewlist)

***

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:80](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L80)

Adds a view to the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to add |

#### Returns

`void`

#### Throws

Throws error if view is not an instance of View3D

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addview)

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:98](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L98)

Adds a view at the specified index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to add |
| `index` | `number` | Index to insert at |

#### Returns

`void`

#### Throws

Throws error if view is not an instance of View3D or index is not a valid uint

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addviewat)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:66](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L66)

Checks if the given child View3D is contained in the current container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`View3D`](../../Display/classes/View3D.md) | Child View3D to check |

#### Returns

`boolean`

Containment status

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`contains`](../namespaces/Core/classes/RedGPUContextViewContainer.md#contains)

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:120](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L120)

Retrieves the view at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to retrieve |

#### Returns

[`View3D`](../../Display/classes/View3D.md)

View3D object at the specified index

#### Throws

Throws error if index is not a valid uint

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewat)

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:138](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L138)

Returns the index of the specified view.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to search for |

#### Returns

`number`

Index of the view (or -1 if not found)

#### Throws

Throws error if view is not an instance of View3D

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewindex)

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:257](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L257)

Removes all views from the view list.

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeAllViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeallviews)

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:226](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L226)

Removes the specified view from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to remove |

#### Returns

`void`

#### Throws

Throws error if view is not found in the view list

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeview)

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:243](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L243)

Removes the view at the specified index from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to remove |

#### Returns

`void`

#### Throws

Throws error if index is out of range

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeviewat)

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:156](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L156)

Moves the specified view to a specific index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to move |
| `index` | `number` | Index to move to |

#### Returns

`void`

#### Throws

Throws error if view is not registered or index is out of bounds

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`setViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#setviewindex)

***

### swapViews()

> **swapViews**(`view1`, `view2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:183](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L183)

Swaps the positions of two views in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view1` | [`View3D`](../../Display/classes/View3D.md) | First View3D to swap |
| `view2` | [`View3D`](../../Display/classes/View3D.md) | Second View3D to swap |

#### Returns

`void`

#### Throws

Throws error if view is not a child of this context

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviews)

***

### swapViewsAt()

> **swapViewsAt**(`index1`, `index2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:205](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/context/core/RedGPUContextViewContainer.ts#L205)

Swaps the positions of two views at the specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`

#### Throws

Throws error if indices are out of bounds or identical

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViewsAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviewsat)


</details>
