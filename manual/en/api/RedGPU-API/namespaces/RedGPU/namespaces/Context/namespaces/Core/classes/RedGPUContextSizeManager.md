[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextSizeManager

# Class: RedGPUContextSizeManager

Defined in: [src/context/core/RedGPUContextSizeManager.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L86)

Class that controls canvas dimensions in pixels (`px`) or percentages (`%`) and manages the rendering resolution scale (`renderScale`).

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
const sizeManager = redGPUContext.sizeManager;
sizeManager.renderScale = 0.5;
sizeManager.setSize('100%', '100%');
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new RedGPUContextSizeManager**(`redGPUContext`, `width?`, `height?`): `RedGPUContextSizeManager`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L107)

Creates a RedGPUContextSizeManager instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width?` | `string` \| `number` | `'100%'` | Initial width (default: `'100%'`) |
| `height?` | `string` \| `number` | `'100%'` | Initial height (default: `'100%'`) |

#### Returns

`RedGPUContextSizeManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:159](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L159)

Gets or sets the configured height value (number or `px`/`%` string).

##### Returns

`string` \| `number`

Configured height value

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L163)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

***

***

### parentDomRect

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **parentDomRect**(): `ParentRect`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:204](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L204)

Returns the available dimension and position of the canvas's parent DOM element. Returns viewport dimensions if the parent is missing or `body`/`html`.

##### Returns

`ParentRect`

Position and dimension information of the parent DOM element

***

***

### pixelRectArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/context/core/RedGPUContextSizeManager.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L175)

Returns the rendering area in physical pixels as an `[x, y, width, height]` array.

##### Returns

\[`number`, `number`, `number`, `number`\]

Physical pixel rect tuple (`[number, number, number, number]`)

***

***

### pixelRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L187)

Returns the rendering area in physical pixels as an object.

##### Returns

`IRedGPURectObject`

Physical pixel rect object

***

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L124)

Gets or sets the rendering resolution scale factor (clamped to `0.01` if less than or equal to 0).

##### Returns

`number`

Current rendering scale factor

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:128](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L128)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### screenRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **screenRectObject**(): `IRedGPURectObject`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L233)

Returns the screen area information in CSS logical pixels as an object.

##### Returns

`IRedGPURectObject`

CSS pixel rect object

***

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L143)

Gets or sets the configured width value (number or `px`/`%` string).

##### Returns

`string` \| `number`

Configured width value

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:147](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L147)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:349](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L349)

Destroys the RedGPUContextSizeManager instance and releases the canvas reference.

#### Returns

`void`

***

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:364](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L364)

Sets the canvas dimensions and updates styles and child `View3D` sizes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | Width (default: currently configured `width`) |
| `h?` | `string` \| `number` | Height (default: currently configured `height`) |

#### Returns

`void`

***

***

### calculateSizeFromString()

> `static` **calculateSizeFromString**(`rect`, `key`, `value`): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:332](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L332)

Converts a string (`px`, `%`) value to a pixel number based on the reference rect object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rect` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} | Reference rect object |
| `rect.height` | `number` | - |
| `rect.width` | `number` | - |
| `rect.x` | `number` | - |
| `rect.y` | `number` | - |
| `key` | `string` | Property key to reference (`'width'` or `'height'`) |
| `value` | `string` | String value to convert |

#### Returns

`number`

Converted number value in pixels

***

***

### getPixelDimension()

> `static` **getPixelDimension**(`parentRect`, `key`, `value`): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:311](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L311)

Calculates and returns the pixel dimension from a number or string (`px`, `%`) value based on `parentRect`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentRect` | `ParentRect` | Reference parent rect object |
| `key` | `string` | Property key to reference (`'width'` or `'height'`) |
| `value` | `string` \| `number` | Size or position value to calculate |

#### Returns

`number`

Calculated value in pixels

***

***

### validatePositionValue()

> `static` **validatePositionValue**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L279)

Validates whether the input value is a valid position value (number, `px`, `%`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Position value to validate |

#### Returns

`void`

#### Throws

Throws an error if the value is not a number or valid `px`/`%` format

***

***

### validateSizeValue()

> `static` **validateSizeValue**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L253)

Validates whether the input value is a valid size value (positive number, `px`, `%`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Size value to validate |

#### Returns

`void`

#### Throws

Throws an error if the value is not a positive number or valid `px`/`%` format

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

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../classes/RedGPUContext.md)

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

***

</details>
