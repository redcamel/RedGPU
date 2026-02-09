[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / LightManager

# Class: LightManager

Defined in: [src/light/LightManager.ts:30](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L30)


Class that manages all lights within a scene.
::: warning

This class is automatically created by the system. <br/> Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
// 씬에서 라이트 매니저 접근 (Access light manager from scene)
const lightManager = scene.lightManager;

// 조명 추가 예시 (Example of adding a light)
lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
```

## Constructors

### Constructor

> **new LightManager**(): `LightManager`

#### Returns

`LightManager`

## Accessors

### ambientLight

#### Get Signature

> **get** **ambientLight**(): [`AmbientLight`](AmbientLight.md)

Defined in: [src/light/LightManager.ts:180](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L180)


Returns the currently set AmbientLight.

##### Returns

[`AmbientLight`](AmbientLight.md)


AmbientLight instance or null

#### Set Signature

> **set** **ambientLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:195](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L195)


Sets the AmbientLight.

##### Throws


Throws an error if a value that is not an AmbientLight instance is passed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`AmbientLight`](AmbientLight.md) | AmbientLight instance to set |

##### Returns

`void`

***

### directionalLightCount

#### Get Signature

> **get** **directionalLightCount**(): `number`

Defined in: [src/light/LightManager.ts:156](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L156)


Returns the number of registered directional lights.

##### Returns

`number`


Number of directional lights

***

### directionalLights

#### Get Signature

> **get** **directionalLights**(): [`DirectionalLight`](DirectionalLight.md)[]

Defined in: [src/light/LightManager.ts:168](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L168)


Returns the array of registered directional lights.

##### Returns

[`DirectionalLight`](DirectionalLight.md)[]


Array of registered DirectionalLights

***

### limitClusterLightCount

#### Get Signature

> **get** **limitClusterLightCount**(): `number`

Defined in: [src/light/LightManager.ts:108](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L108)


Returns the maximum allowable count for cluster lights (Point + Spot).

##### Returns

`number`


Maximum number of cluster lights

***

### limitDirectionalLightCount

#### Get Signature

> **get** **limitDirectionalLightCount**(): `number`

Defined in: [src/light/LightManager.ts:144](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L144)


Returns the maximum allowable count for directional lights.

##### Returns

`number`


Maximum number of directional lights

***

### pointLightCount

#### Get Signature

> **get** **pointLightCount**(): `number`

Defined in: [src/light/LightManager.ts:132](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L132)


Returns the number of registered point lights.

##### Returns

`number`


Number of point lights

***

### pointLights

#### Get Signature

> **get** **pointLights**(): [`PointLight`](PointLight.md)[]

Defined in: [src/light/LightManager.ts:120](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L120)


Returns the array of registered point lights.

##### Returns

[`PointLight`](PointLight.md)[]


Array of registered PointLights

***

### spotLightCount

#### Get Signature

> **get** **spotLightCount**(): `number`

Defined in: [src/light/LightManager.ts:96](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L96)


Returns the number of registered spot lights.

##### Returns

`number`


Number of spot lights

***

### spotLights

#### Get Signature

> **get** **spotLights**(): [`SpotLight`](SpotLight.md)[]

Defined in: [src/light/LightManager.ts:84](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L84)


Returns the array of registered spot lights.

##### Returns

[`SpotLight`](SpotLight.md)[]


Array of registered SpotLights

## Methods

### addDirectionalLight()

> **addDirectionalLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:266](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L266)


Adds a DirectionalLight.

* ### Example
```typescript
scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](DirectionalLight.md) | DirectionalLight instance to add |

#### Returns

`void`

#### Throws


Throws an error if the maximum number of directional lights is exceeded.

***

### addPointLight()

> **addPointLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:241](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L241)


Adds a PointLight.

* ### Example
```typescript
scene.lightManager.addPointLight(new RedGPU.Light.PointLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](PointLight.md) | PointLight instance to add |

#### Returns

`void`

#### Throws


Throws an error if the total count combined with SpotLights exceeds the cluster limit.

***

### addSpotLight()

> **addSpotLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:216](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L216)


Adds a SpotLight.

* ### Example
```typescript
scene.lightManager.addSpotLight(new RedGPU.Light.SpotLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](SpotLight.md) | SpotLight instance to add |

#### Returns

`void`

#### Throws


Throws an error if the total count combined with PointLights exceeds the cluster limit.

***

### removeAllDirectionalLight()

> **removeAllDirectionalLight**(): `void`

Defined in: [src/light/LightManager.ts:334](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L334)


Removes all DirectionalLights.

#### Returns

`void`

***

### removeAllLight()

> **removeAllLight**(): `void`

Defined in: [src/light/LightManager.ts:345](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L345)


Removes all lights in the scene.


Removes all point, spot, and directional lights, and sets ambient light to null.

#### Returns

`void`

***

### removeAllPointLight()

> **removeAllPointLight**(): `void`

Defined in: [src/light/LightManager.ts:326](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L326)


Removes all PointLights.

#### Returns

`void`

***

### removeAllSpotLight()

> **removeAllSpotLight**(): `void`

Defined in: [src/light/LightManager.ts:318](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L318)


Removes all SpotLights.

#### Returns

`void`

***

### removeDirectionalLight()

> **removeDirectionalLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:309](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L309)


Removes a specific DirectionalLight.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](DirectionalLight.md) | DirectionalLight instance to remove |

#### Returns

`void`

***

### removePointLight()

> **removePointLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:296](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L296)


Removes a specific PointLight.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](PointLight.md) | PointLight instance to remove |

#### Returns

`void`

***

### removeSpotLight()

> **removeSpotLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:283](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/light/LightManager.ts#L283)


Removes a specific SpotLight.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](SpotLight.md) | SpotLight instance to remove |

#### Returns

`void`
