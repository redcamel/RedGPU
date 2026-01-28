[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Context](../README.md) / RedGPUContext

# Class: RedGPUContext

Defined in: [src/context/RedGPUContext.ts:37](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L37)


The RedGPUContext class is the top-level context object provided after WebGPU initialization.


It holds core WebGPU information such as GPU, canvas, device, and adapter as properties.

It owns View3D objects and acts as the actual top-level container.

It provides various features such as resizing, background color, debug panel, anti-aliasing, and resource management.

::: warning

This class is created internally by RedGPU.init().<br/>Do not create an instance directly using the 'new' keyword.
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

Defined in: [src/context/RedGPUContext.ts:140](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L140)


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

Defined in: [src/context/RedGPUContext.ts:42](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L42)


Current requestAnimationFrame ID (for frame loop management)

***

### currentTime

> **currentTime**: `number`

Defined in: [src/context/RedGPUContext.ts:52](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L52)


Current time (frame based, ms)

***

### onResize()

> **onResize**: (`width`, `height`) => `void` = `null`

Defined in: [src/context/RedGPUContext.ts:47](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L47)


Resize event handler (called when canvas size changes)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

## Accessors

### alphaMode

#### Get Signature

> **get** **alphaMode**(): `GPUCanvasAlphaMode`

Defined in: [src/context/RedGPUContext.ts:242](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L242)


Returns the alpha mode of the canvas.

##### Returns

`GPUCanvasAlphaMode`

#### Set Signature

> **set** **alphaMode**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:253](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L253)


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

Defined in: [src/context/RedGPUContext.ts:168](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L168)


Returns the antialiasing manager.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/context/RedGPUContext.ts:195](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L195)


Returns the background color.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:209](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L209)


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

Defined in: [src/context/RedGPUContext.ts:160](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L160)

##### Returns

`DOMRect`

***

### configurationDescription

#### Get Signature

> **get** **configurationDescription**(): `GPUCanvasConfiguration`

Defined in: [src/context/RedGPUContext.ts:226](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L226)


Returns the GPU canvas configuration information.

##### Returns

`GPUCanvasConfiguration`

***

### detector

#### Get Signature

> **get** **detector**(): [`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

Defined in: [src/context/RedGPUContext.ts:218](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L218)


Returns the RedGPUContextDetector instance.

##### Returns

[`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

***

### gpuAdapter

#### Get Signature

> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/RedGPUContext.ts:234](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L234)


Returns the GPU adapter.

##### Returns

`GPUAdapter`

***

### gpuContext

#### Get Signature

> **get** **gpuContext**(): `GPUCanvasContext`

Defined in: [src/context/RedGPUContext.ts:262](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L262)


Returns the GPU canvas context.

##### Returns

`GPUCanvasContext`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/context/RedGPUContext.ts:270](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L270)


Returns the GPU device.

##### Returns

`GPUDevice`

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:340](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L340)


Returns the height.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:351](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L351)


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

Defined in: [src/context/RedGPUContext.ts:278](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L278)


Returns the HTML canvas element.

##### Returns

`HTMLCanvasElement`

***

### keyboardKeyBuffer

#### Get Signature

> **get** **keyboardKeyBuffer**(): `object`

Defined in: [src/context/RedGPUContext.ts:286](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L286)


Returns the keyboard input buffer.

##### Returns

`object`

#### Set Signature

> **set** **keyboardKeyBuffer**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:297](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L297)


Sets the keyboard input buffer.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | \{\[`p`: `string`\]: `boolean`; \} | Keyboard state object |

##### Returns

`void`

***

### numViews

#### Get Signature

> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:47](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L47)


Returns the number of View3D objects owned.

##### Returns

`number`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`numViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#numviews)

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/RedGPUContext.ts:363](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L363)


Returns the render scale.

##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:374](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L374)


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

Defined in: [src/context/RedGPUContext.ts:305](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L305)


Returns the resource manager.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/context/RedGPUContext.ts:355](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L355)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/context/core/RedGPUContextSizeManager.ts:158](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextSizeManager.ts#L158) |
| `width` | `number` | [src/context/core/RedGPUContextSizeManager.ts:157](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextSizeManager.ts#L157) |
| `x` | `number` | [src/context/core/RedGPUContextSizeManager.ts:155](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextSizeManager.ts#L155) |
| `y` | `number` | [src/context/core/RedGPUContextSizeManager.ts:156](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextSizeManager.ts#L156) |

***

### sizeManager

#### Get Signature

> **get** **sizeManager**(): [`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

Defined in: [src/context/RedGPUContext.ts:313](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L313)


Returns the RedGPUContextSizeManager instance.

##### Returns

[`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

***

### useDebugPanel

#### Get Signature

> **get** **useDebugPanel**(): `boolean`

Defined in: [src/context/RedGPUContext.ts:176](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L176)


Returns whether the debug panel is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useDebugPanel**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:187](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L187)


Sets whether to use the debug panel.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Usage status |

##### Returns

`void`

***

### viewList

#### Get Signature

> **get** **viewList**(): [`View3D`](../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:39](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L39)


Returns the list of View3D objects owned by this instance.

##### Returns

[`View3D`](../../Display/classes/View3D.md)[]

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`viewList`](../namespaces/Core/classes/RedGPUContextViewContainer.md#viewlist)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:321](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L321)


Returns the width.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:332](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L332)


Sets the width.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Width value (number or string) |

##### Returns

`void`

## Methods

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:72](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L72)


Adds a view to the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to add |

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addview)

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:87](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L87)


Adds a view at the specified index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to add |
| `index` | `number` | Index to insert at |

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addviewat)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:61](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L61)


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

### destroy()

> **destroy**(): `void`

Defined in: [src/context/RedGPUContext.ts:386](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L386)


Destroys the GPU device and releases resources.

#### Returns

`void`

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:103](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L103)


Retrieves the view at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to retrieve |

#### Returns

[`View3D`](../../Display/classes/View3D.md)

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewat)

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:115](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L115)


Returns the index of the specified view.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to search for |

#### Returns

`number`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewindex)

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:225](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L225)


Removes all views from the view list.

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeAllViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeallviews)

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:197](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L197)


Removes the specified view from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D object to remove |

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeview)

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:211](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L211)


Removes the view at the specified index from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to remove |

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeviewat)

***

### setSize()

> **setSize**(`w`, `h`): `void`

Defined in: [src/context/RedGPUContext.ts:400](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/RedGPUContext.ts#L400)


Sets the size of the context.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | Width (default: current width) |
| `h` | `string` \| `number` | Height (default: current height) |

#### Returns

`void`

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:133](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L133)


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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:160](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L160)


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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:179](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/context/core/RedGPUContextViewContainer.ts#L179)


Swaps the positions of two views at the specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViewsAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviewsat)
