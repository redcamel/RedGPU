[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / LightManager

# Class: LightManager

Defined in: [src/light/LightManager.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L38)

Manager class that integrates and manages all lights within a `Scene`.

Manages the addition, removal, and maximum count limits of `DirectionalLight`, `PointLight`, `SpotLight`, and `AmbientLight`, and is automatically created internally when a `Scene` is created.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Access LightManager through a Scene instance
const lightManager = scene.lightManager;

// Configure DirectionalLight and AmbientLight
const directionalLight = new RedGPU.Light.DirectionalLight();
lightManager.addDirectionalLight(directionalLight);
lightManager.ambientLight = new RedGPU.Light.AmbientLight();
```

## See

 - [DirectionalLight Basic Example](https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/)
 - [PointLight Basic Example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/)
 - [SpotLight Basic Example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/)

## Constructors

### Constructor

> **new LightManager**(): `LightManager`

#### Returns

`LightManager`

## Accessors

### ambientLight

#### Get Signature

> **get** **ambientLight**(): [`AmbientLight`](AmbientLight.md)

Defined in: [src/light/LightManager.ts:157](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L157)

Gets or sets the `AmbientLight` of the scene.

#### Example
```typescript
// Set AmbientLight
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ADD8E6', 50);
```

##### Returns

[`AmbientLight`](AmbientLight.md)

`AmbientLight` instance

#### Set Signature

> **set** **ambientLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L161)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`AmbientLight`](AmbientLight.md) |

##### Returns

`void`

***

### directionalLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **directionalLightCount**(): `number`

Defined in: [src/light/LightManager.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L126)

Returns the number of currently registered directional lights.

##### Returns

`number`

Number of directional lights

***

### directionalLights

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **directionalLights**(): [`DirectionalLight`](DirectionalLight.md)[]

Defined in: [src/light/LightManager.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L138)

Returns the list of registered `DirectionalLight` instances.

##### Returns

[`DirectionalLight`](DirectionalLight.md)[]

Array of `DirectionalLight` instances

***

### limitClusterLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **limitClusterLightCount**(): `number`

Defined in: [src/light/LightManager.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L78)

Returns the maximum number of cluster lights (point + spot) available in the scene.

##### Returns

`number`

Maximum number of cluster lights

***

### limitDirectionalLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **limitDirectionalLightCount**(): `number`

Defined in: [src/light/LightManager.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L114)

Returns the maximum number of `DirectionalLight` instances available in the scene.

##### Returns

`number`

Maximum number of directional lights

***

### pointLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pointLightCount**(): `number`

Defined in: [src/light/LightManager.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L102)

Returns the number of currently registered point lights.

##### Returns

`number`

Number of point lights

***

### pointLights

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pointLights**(): [`PointLight`](PointLight.md)[]

Defined in: [src/light/LightManager.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L90)

Returns the list of registered `PointLight` instances.

##### Returns

[`PointLight`](PointLight.md)[]

Array of `PointLight` instances

***

### spotLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **spotLightCount**(): `number`

Defined in: [src/light/LightManager.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L66)

Returns the number of currently registered spot lights.

##### Returns

`number`

Number of spot lights

***

### spotLights

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **spotLights**(): [`SpotLight`](SpotLight.md)[]

Defined in: [src/light/LightManager.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L54)

Returns the list of registered `SpotLight` instances.

##### Returns

[`SpotLight`](SpotLight.md)[]

Array of `SpotLight` instances

## Methods

### addDirectionalLight()

> **addDirectionalLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:232](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L232)

Adds a `DirectionalLight` to the scene.

#### Example
```typescript
// Create and add a DirectionalLight
const directionalLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 100000);
scene.lightManager.addDirectionalLight(directionalLight);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](DirectionalLight.md) | `DirectionalLight` instance to add |

#### Returns

`void`

***

### addPointLight()

> **addPointLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:207](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L207)

Adds a `PointLight` to the scene.

#### Example
```typescript
// Create and add a PointLight
const pointLight = new RedGPU.Light.PointLight('#ffffff', 1000);
scene.lightManager.addPointLight(pointLight);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](PointLight.md) | `PointLight` instance to add |

#### Returns

`void`

***

### addSpotLight()

> **addSpotLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L182)

Adds a `SpotLight` to the scene.

#### Example
```typescript
// Create and add a SpotLight
const spotLight = new RedGPU.Light.SpotLight('#ffffff', 1000);
scene.lightManager.addSpotLight(spotLight);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](SpotLight.md) | `SpotLight` instance to add |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/light/LightManager.ts:319](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L319)

Destroys the LightManager instance and cleans up all registered lights and debugger resources.

#### Returns

`void`

***

### removeAllDirectionalLight()

> **removeAllDirectionalLight**(): `void`

Defined in: [src/light/LightManager.ts:300](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L300)

Removes all registered directional lights.

#### Returns

`void`

***

### removeAllLight()

> **removeAllLight**(): `void`

Defined in: [src/light/LightManager.ts:308](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L308)

Removes all lights in the scene, including the ambient light.

#### Returns

`void`

***

### removeAllPointLight()

> **removeAllPointLight**(): `void`

Defined in: [src/light/LightManager.ts:292](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L292)

Removes all registered point lights.

#### Returns

`void`

***

### removeAllSpotLight()

> **removeAllSpotLight**(): `void`

Defined in: [src/light/LightManager.ts:284](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L284)

Removes all registered spot lights.

#### Returns

`void`

***

### removeDirectionalLight()

> **removeDirectionalLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L275)

Removes a specific `DirectionalLight` from the scene.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](DirectionalLight.md) | `DirectionalLight` instance to remove |

#### Returns

`void`

***

### removePointLight()

> **removePointLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:262](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L262)

Removes a specific `PointLight` from the scene.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](PointLight.md) | `PointLight` instance to remove |

#### Returns

`void`

***

### removeSpotLight()

> **removeSpotLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:249](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/LightManager.ts#L249)

Removes a specific `SpotLight` from the scene.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](SpotLight.md) | `SpotLight` instance to remove |

#### Returns

`void`
