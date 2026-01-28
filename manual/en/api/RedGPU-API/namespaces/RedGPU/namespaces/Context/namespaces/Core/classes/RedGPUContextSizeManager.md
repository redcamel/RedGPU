[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextSizeManager

# Class: RedGPUContextSizeManager

Defined in: [src/context/core/RedGPUContextSizeManager.ts:35](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L35)


Class that manages canvas size and rendering scale.


You can set the size in pixels (px) or percentages (%), and it provides rendering resolution adjustment functions.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
const sizeManager = redGPUContext.sizeManager;
sizeManager.renderScale = 0.5; // Reduce resolution to 50%
sizeManager.setSize('100%', '100%');
```

## Constructors

### Constructor

> **new RedGPUContextSizeManager**(`redGPUContext`, `width`, `height`): `RedGPUContextSizeManager`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:56](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L56)


RedGPUContextSizeManager constructor

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width` | `string` \| `number` | `'100%'` | Initial width (default: '100%') |
| `height` | `string` \| `number` | `'100%'` | Initial height (default: '100%') |

#### Returns

`RedGPUContextSizeManager`

## Accessors

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:109](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L109)


Returns the set height value.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:120](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L120)


Sets the height. (px, %, or number)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Height value |

##### Returns

`void`

***

### parentDomRect

#### Get Signature

> **get** **parentDomRect**(): `DOMRect`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:149](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L149)


Returns the dimension information of the canvas's parent DOM element.

##### Returns

`DOMRect`

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/context/core/RedGPUContextSizeManager.ts:128](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L128)


Returns the actual pixel rect to be rendered as an array. [x, y, w, h]

##### Returns

\[`number`, `number`, `number`, `number`\]

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:136](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L136)


Returns the actual pixel rect to be rendered as an object.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/context/core/RedGPUContextSizeManager.ts:141](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L141) |
| `width` | `number` | [src/context/core/RedGPUContextSizeManager.ts:140](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L140) |
| `x` | `number` | [src/context/core/RedGPUContextSizeManager.ts:138](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L138) |
| `y` | `number` | [src/context/core/RedGPUContextSizeManager.ts:139](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L139) |

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:68](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L68)


Returns the rendering scale.

##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:79](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L79)


Sets the rendering scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Render scale value (0.01 or more) |

##### Returns

`void`

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:153](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L153)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/context/core/RedGPUContextSizeManager.ts:158](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L158) |
| `width` | `number` | [src/context/core/RedGPUContextSizeManager.ts:157](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L157) |
| `x` | `number` | [src/context/core/RedGPUContextSizeManager.ts:155](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L155) |
| `y` | `number` | [src/context/core/RedGPUContextSizeManager.ts:156](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L156) |

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:90](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L90)


Returns the set width value.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:101](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L101)


Sets the width. (px, %, or number)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Width value |

##### Returns

`void`

## Methods

### setSize()

> **setSize**(`w`, `h`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:259](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L259)


Sets the size of the element and updates the canvas style.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | Width (default: current width) |
| `h` | `string` \| `number` | Height (default: current height) |

#### Returns

`void`

***

### calculateSizeFromString()

> `static` **calculateSizeFromString**(`rect`, `key`, `value`): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:236](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L236)


Converts string value (px, %) to pixel number.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rect` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} | Reference Rect object |
| `rect.height` | `number` | - |
| `rect.width` | `number` | - |
| `rect.x` | `number` | - |
| `rect.y` | `number` | - |
| `key` | `string` | Key to reference |
| `value` | `string` | String value to convert |

#### Returns

`number`

***

### getPixelDimension()

> `static` **getPixelDimension**(`parentRect`, `key`, `value`): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:219](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L219)


Calculates and returns the pixel size based on the parent Rect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentRect` | `ParentRect` | Parent Rect |
| `key` | `string` | Key to reference (width or height) |
| `value` | `string` \| `number` | Value (number or string) |

#### Returns

`number`

***

### validatePositionValue()

> `static` **validatePositionValue**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:190](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L190)


Validates if the input value is a valid position value. (number, px, %)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Value to validate |

#### Returns

`void`

***

### validateSizeValue()

> `static` **validateSizeValue**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:169](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextSizeManager.ts#L169)


Validates if the input value is a valid size value. (positive number, px, %)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Value to validate |

#### Returns

`void`
