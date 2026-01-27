[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [RedGPUContext](../../../README.md) / [Core](../README.md) / RedGPUContextSizeManager

# Class: RedGPUContextSizeManager

Defined in: [src/context/core/RedGPUContextSizeManager.ts:22](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L22)


Class that manages canvas size and rendering scale.


You can set the size in pixels (px) or percentages (%), and it provides rendering resolution adjustment functions.

## Constructors

### Constructor

> **new RedGPUContextSizeManager**(`redGPUContext`, `width`, `height`): `RedGPUContextSizeManager`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:43](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L43)


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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:96](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L96)


Returns the set height value.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:107](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L107)


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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:136](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L136)


Returns the dimension information of the canvas's parent DOM element.

##### Returns

`DOMRect`

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/context/core/RedGPUContextSizeManager.ts:115](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L115)


Returns the actual pixel rect to be rendered as an array. [x, y, w, h]

##### Returns

\[`number`, `number`, `number`, `number`\]

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:123](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L123)


Returns the actual pixel rect to be rendered as an object.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/context/core/RedGPUContextSizeManager.ts:128](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L128) |
| `width` | `number` | [src/context/core/RedGPUContextSizeManager.ts:127](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L127) |
| `x` | `number` | [src/context/core/RedGPUContextSizeManager.ts:125](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L125) |
| `y` | `number` | [src/context/core/RedGPUContextSizeManager.ts:126](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L126) |

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:55](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L55)


Returns the rendering scale.

##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:66](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L66)


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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:140](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L140)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/context/core/RedGPUContextSizeManager.ts:145](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L145) |
| `width` | `number` | [src/context/core/RedGPUContextSizeManager.ts:144](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L144) |
| `x` | `number` | [src/context/core/RedGPUContextSizeManager.ts:142](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L142) |
| `y` | `number` | [src/context/core/RedGPUContextSizeManager.ts:143](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L143) |

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:77](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L77)


Returns the set width value.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:88](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L88)


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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:246](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L246)


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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:223](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L223)


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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:206](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L206)


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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:177](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L177)


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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:156](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L156)


Validates if the input value is a valid size value. (positive number, px, %)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Value to validate |

#### Returns

`void`
