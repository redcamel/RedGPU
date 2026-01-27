[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / SpotLight

# Class: SpotLight

Defined in: [src/light/lights/SpotLight.ts:25](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L25)


Class that defines a spotlight source.


This light radiates light in a specific direction from a certain position, and the spread of light can be controlled through inner/outer cutoff angles.
* ### Example
```typescript
const light = new RedGPU.Light.SpotLight('#ffffff', 2.0);
light.setPosition(0, 5, 10);
light.lookAt(0, 0, 0);
scene.lightManager.addSpotLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/" ></iframe>


Below is a list of additional sample examples to help understand the structure and behavior of SpotLight.

## See

[SpotLight Cluster Performance example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightPerformance/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new SpotLight**(`color`, `intensity`): `SpotLight`

Defined in: [src/light/lights/SpotLight.ts:91](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L91)


Creates a new SpotLight instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#fff'` | Color of the light (hex string, e.g., '#ffffff') |
| `intensity` | `number` | `1` | Intensity of the light (default: 1) |

#### Returns

`SpotLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### drawDebugger

> **drawDebugger**: `ADrawDebuggerLight`

Defined in: [src/light/core/ABaseLight.ts:20](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/core/ABaseLight.ts#L20)


Helper object for debugging visualization of the light.


Set externally, it can visually display the position or direction of the light.

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:82](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/core/ABaseLight.ts#L82)


Returns the color of the light.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)


ColorRGB object

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:93](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/core/ABaseLight.ts#L93)


Sets the color of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`ColorRGB`](../../Color/classes/ColorRGB.md) | ColorRGB object |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`color`](../namespaces/Core/classes/ABaseLight.md#color)

***

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:267](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L267)


Returns the direction vector of the light in [x, y, z] format.

##### Returns

\[`number`, `number`, `number`\]


Direction vector [x, y, z]

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:278](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L278)


Sets the direction vector of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | \[`number`, `number`, `number`\] | Direction vector in [x, y, z] format |

##### Returns

`void`

***

### directionX

#### Get Signature

> **get** **directionX**(): `number`

Defined in: [src/light/lights/SpotLight.ts:201](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L201)


Returns the X component of the direction vector.

##### Returns

`number`


X component value

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:212](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L212)


Sets the X component of the direction vector.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X component value |

##### Returns

`void`

***

### directionY

#### Get Signature

> **get** **directionY**(): `number`

Defined in: [src/light/lights/SpotLight.ts:223](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L223)


Returns the Y component of the direction vector.

##### Returns

`number`


Y component value

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:234](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L234)


Sets the Y component of the direction vector.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y component value |

##### Returns

`void`

***

### directionZ

#### Get Signature

> **get** **directionZ**(): `number`

Defined in: [src/light/lights/SpotLight.ts:245](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L245)


Returns the Z component of the direction vector.

##### Returns

`number`


Z component value

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:256](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L256)


Sets the Z component of the direction vector.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z component value |

##### Returns

`void`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:60](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/core/ABaseLight.ts#L60)


Returns whether the debugging visualization feature is enabled.

##### Returns

`boolean`


Whether enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:71](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/core/ABaseLight.ts#L71)


Enables or disables the debugging visualization feature.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | If true, enables debugging feature |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`enableDebugger`](../namespaces/Core/classes/ABaseLight.md#enabledebugger)

***

### innerCutoff

#### Get Signature

> **get** **innerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:291](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L291)


Returns the inner cutoff angle.

##### Returns

`number`


Angle (degrees)

#### Set Signature

> **set** **innerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:302](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L302)


Sets the inner cutoff angle.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `degrees` | `number` | Angle (degrees) |

##### Returns

`void`

***

### innerCutoffCos

#### Get Signature

> **get** **innerCutoffCos**(): `number`

Defined in: [src/light/lights/SpotLight.ts:338](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L338)


Returns the cosine value of the inner cutoff angle.


Used for shader calculations, etc.

##### Returns

`number`


Cosine value

***

### intensity

#### Get Signature

> **get** **intensity**(): `number`

Defined in: [src/light/core/ABaseLight.ts:104](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/core/ABaseLight.ts#L104)


Returns the intensity of the light.

##### Returns

`number`


Intensity value

#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:115](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/core/ABaseLight.ts#L115)


Sets the intensity of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Number value (e.g., 1.0) |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensity`](../namespaces/Core/classes/ABaseLight.md#intensity)

***

### outerCutoff

#### Get Signature

> **get** **outerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:313](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L313)


Returns the outer cutoff angle.

##### Returns

`number`


Angle (degrees)

#### Set Signature

> **set** **outerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:324](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L324)


Sets the outer cutoff angle.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `degrees` | `number` | Angle (degrees) |

##### Returns

`void`

***

### outerCutoffCos

#### Get Signature

> **get** **outerCutoffCos**(): `number`

Defined in: [src/light/lights/SpotLight.ts:352](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L352)


Returns the cosine value of the outer cutoff angle.


Used for shader calculations, etc.

##### Returns

`number`


Cosine value

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:168](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L168)


Returns the position of the light in [x, y, z] format.

##### Returns

\[`number`, `number`, `number`\]


Position array [x, y, z]

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/SpotLight.ts:179](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L179)


Returns the radius of the light.

##### Returns

`number`


Radius value

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:190](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L190)


Sets the radius of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Radius value (e.g., 5.0) |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/light/lights/SpotLight.ts:102](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L102)


Returns the X coordinate.

##### Returns

`number`


X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:113](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L113)


Sets the X coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/light/lights/SpotLight.ts:124](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L124)


Returns the Y coordinate.

##### Returns

`number`


Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:135](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L135)


Sets the Y coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/light/lights/SpotLight.ts:146](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L146)


Returns the Z coordinate.

##### Returns

`number`


Z coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:157](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L157)


Sets the Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

## Methods

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/light/lights/SpotLight.ts:392](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L392)


Sets the direction vector to look at a specific target position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | Target X coordinate or [x, y, z] array |
| `targetY?` | `number` | Target Y coordinate (if targetX is a number) |
| `targetZ?` | `number` | Target Z coordinate (if targetX is a number) |

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/light/lights/SpotLight.ts:369](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/lights/SpotLight.ts#L369)


Sets the position of the light.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X coordinate or [x, y, z] array |
| `y?` | `number` | Y coordinate (if x is a number) |
| `z?` | `number` | Z coordinate (if x is a number) |

#### Returns

`void`
