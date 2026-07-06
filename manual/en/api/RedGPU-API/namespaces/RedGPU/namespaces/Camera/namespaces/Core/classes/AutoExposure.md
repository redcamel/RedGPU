[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / AutoExposure

# Class: AutoExposure

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:26](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L26)

Class that performs auto-exposure and eye adaptation.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new AutoExposure**(`view`): `AutoExposure`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:65](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L65)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) |

#### Returns

`AutoExposure`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### adaptationSpeedDown

#### Get Signature

> **get** **adaptationSpeedDown**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:200](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L200)

Returns the eye adaptation speed (darkening).

##### Returns

`number`

Eye adaptation speed (downward)

#### Set Signature

> **set** **adaptationSpeedDown**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:212](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L212)

Sets the eye adaptation speed (darkening).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Eye adaptation speed (downward) to set |

##### Returns

`void`

***

### adaptationSpeedUp

#### Get Signature

> **get** **adaptationSpeedUp**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:176](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L176)

Returns the eye adaptation speed (brightening).

##### Returns

`number`

Eye adaptation speed (upward)

#### Set Signature

> **set** **adaptationSpeedUp**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:188](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L188)

Sets the eye adaptation speed (brightening).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Eye adaptation speed (upward) to set |

##### Returns

`void`

***

### adaptedLuminanceBuffer

#### Get Signature

> **get** **adaptedLuminanceBuffer**(): [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md)

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:359](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L359)

Returns the GPU storage buffer where adapted EV100 data is stored.

##### Returns

[`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md)

Storage buffer instance

***

### currentAdaptedEV100

#### Get Signature

> **get** **currentAdaptedEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:333](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L333)

Returns the currently adapted EV100 value.

##### Returns

`number`

Adapted EV100 value

#### Set Signature

> **set** **currentAdaptedEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:345](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L345)

Sets the currently adapted EV100 value. (Also updates the GPU buffer)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | EV100 value to set |

##### Returns

`void`

***

### exposureCompensation

#### Get Signature

> **get** **exposureCompensation**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:80](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L80)

Returns the exposure compensation value.

##### Returns

`number`

Exposure compensation value

#### Set Signature

> **set** **exposureCompensation**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:92](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L92)

Sets the exposure compensation value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Exposure compensation value to set |

##### Returns

`void`

***

### highPercentile

#### Get Signature

> **get** **highPercentile**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:248](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L248)

Returns the histogram analysis range (exclude top percentile).

##### Returns

`number`

High percentile value (0 - 1)

#### Set Signature

> **set** **highPercentile**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:260](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L260)

Sets the histogram analysis range (exclude top percentile).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | High percentile value to set (0 - 1) |

##### Returns

`void`

***

### lowPercentile

#### Get Signature

> **get** **lowPercentile**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:224](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L224)

Returns the histogram analysis range (exclude bottom percentile).

##### Returns

`number`

Low percentile value (0 - 1)

#### Set Signature

> **set** **lowPercentile**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:236](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L236)

Sets the histogram analysis range (exclude bottom percentile).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Low percentile value to set (0 - 1) |

##### Returns

`void`

***

### maxEV100

#### Get Signature

> **get** **maxEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:152](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L152)

Returns the maximum EV100 for auto-exposure.

##### Returns

`number`

Maximum EV100 value

#### Set Signature

> **set** **maxEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:164](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L164)

Sets the maximum EV100 for auto-exposure.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum EV100 value to set |

##### Returns

`void`

***

### maxExposureMultiplier

#### Get Signature

> **get** **maxExposureMultiplier**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:272](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L272)

Returns the maximum exposure multiplier for auto-exposure.

##### Returns

`number`

Maximum exposure multiplier

#### Set Signature

> **set** **maxExposureMultiplier**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:284](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L284)

Sets the maximum exposure multiplier for auto-exposure. (Default: 16.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum exposure multiplier to set |

##### Returns

`void`

***

### meteringMode

#### Get Signature

> **get** **meteringMode**(): [`METERING_MODE`](../enumerations/METERING_MODE.md)

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:296](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L296)

Returns the metering mode for auto-exposure.

##### Returns

[`METERING_MODE`](../enumerations/METERING_MODE.md)

Metering mode

#### Set Signature

> **set** **meteringMode**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:308](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L308)

Sets the metering mode for auto-exposure.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`METERING_MODE`](../enumerations/METERING_MODE.md) | Metering mode to set |

##### Returns

`void`

***

### minEV100

#### Get Signature

> **get** **minEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:128](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L128)

Returns the minimum EV100 for auto-exposure.

##### Returns

`number`

Minimum EV100 value

#### Set Signature

> **set** **minEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:140](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L140)

Sets the minimum EV100 for auto-exposure.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Minimum EV100 value to set |

##### Returns

`void`

***

### preExposure

#### Get Signature

> **get** **preExposure**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:320](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L320)

Returns the currently adapted exposure multiplier (preExposure).

##### Returns

`number`

Current exposure multiplier

***

### targetLuminance

#### Get Signature

> **get** **targetLuminance**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:104](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L104)

Returns the target luminance.

##### Returns

`number`

Target luminance value

#### Set Signature

> **set** **targetLuminance**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:116](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L116)

Sets the target luminance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Target luminance value to set |

##### Returns

`void`

***

### render()

> **render**(`sourceTextureInfo`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:371](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L371)

Performs auto exposure processing. (Record commands)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceTextureInfo` | [`IPostEffectResult`](../../../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | Source texture information |

#### Returns

`void`

***

### resolveReadback()

> **resolveReadback**(): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:479](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/camera/core/autoExposure/AutoExposure.ts#L479)

Asynchronously reads back data after GPU work completion. (Called by Renderer)

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
