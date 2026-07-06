[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / LightManager

# Class: LightManager

Defined in: [src/light/core/LightManager.ts:30](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L30)

Class that manages all lights within a scene.
::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
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

> **get** **ambientLight**(): [`AmbientLight`](../../../classes/AmbientLight.md)

Defined in: [src/light/core/LightManager.ts:176](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L176)

Returns the currently set AmbientLight.

##### Returns

[`AmbientLight`](../../../classes/AmbientLight.md)

AmbientLight instance or null

#### Set Signature

> **set** **ambientLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:191](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L191)

Sets the AmbientLight.

##### Throws

Throws an error if a value that is not an AmbientLight instance is passed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`AmbientLight`](../../../classes/AmbientLight.md) | AmbientLight instance to set |

##### Returns

`void`

***

### directionalLightCount

#### Get Signature

> **get** **directionalLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:152](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L152)

Returns the number of registered directional lights.

##### Returns

`number`

Number of directional lights

***

### directionalLights

#### Get Signature

> **get** **directionalLights**(): [`DirectionalLight`](../../../classes/DirectionalLight.md)[]

Defined in: [src/light/core/LightManager.ts:164](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L164)

Returns the array of registered directional lights.

##### Returns

[`DirectionalLight`](../../../classes/DirectionalLight.md)[]

Array of registered DirectionalLights

***

### limitClusterLightCount

#### Get Signature

> **get** **limitClusterLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:104](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L104)

Returns the maximum allowable count for cluster lights (Point + Spot).

##### Returns

`number`

Maximum number of cluster lights

***

### limitDirectionalLightCount

#### Get Signature

> **get** **limitDirectionalLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:140](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L140)

Returns the maximum allowable count for directional lights.

##### Returns

`number`

Maximum number of directional lights

***

### pointLightCount

#### Get Signature

> **get** **pointLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:128](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L128)

Returns the number of registered point lights.

##### Returns

`number`

Number of point lights

***

### pointLights

#### Get Signature

> **get** **pointLights**(): [`PointLight`](../../../classes/PointLight.md)[]

Defined in: [src/light/core/LightManager.ts:116](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L116)

Returns the array of registered point lights.

##### Returns

[`PointLight`](../../../classes/PointLight.md)[]

Array of registered PointLights

***

### spotLightCount

#### Get Signature

> **get** **spotLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:92](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L92)

Returns the number of registered spot lights.

##### Returns

`number`

Number of spot lights

***

### spotLights

#### Get Signature

> **get** **spotLights**(): [`SpotLight`](../../../classes/SpotLight.md)[]

Defined in: [src/light/core/LightManager.ts:80](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L80)

Returns the array of registered spot lights.

##### Returns

[`SpotLight`](../../../classes/SpotLight.md)[]

Array of registered SpotLights

## Methods

### addDirectionalLight()

> **addDirectionalLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:262](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L262)

Adds a DirectionalLight.

* ### Example
```typescript
scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](../../../classes/DirectionalLight.md) | DirectionalLight instance to add |

#### Returns

`void`

#### Throws

Throws an error if the maximum number of directional lights is exceeded.

***

### addPointLight()

> **addPointLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:237](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L237)

Adds a PointLight.

* ### Example
```typescript
scene.lightManager.addPointLight(new RedGPU.Light.PointLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](../../../classes/PointLight.md) | PointLight instance to add |

#### Returns

`void`

#### Throws

Throws an error if the total count combined with SpotLights exceeds the cluster limit.

***

### addSpotLight()

> **addSpotLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:212](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L212)

Adds a SpotLight.

* ### Example
```typescript
scene.lightManager.addSpotLight(new RedGPU.Light.SpotLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](../../../classes/SpotLight.md) | SpotLight instance to add |

#### Returns

`void`

#### Throws

Throws an error if the total count combined with PointLights exceeds the cluster limit.

***

### getDirectionalLightProjectionMatrix()

> **getDirectionalLightProjectionMatrix**(`view`): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/light/core/LightManager.ts:374](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L374)

Calculates and returns the projection (orthographic) matrix of the directional light.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D instance |

#### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

mat4 projection matrix

***

### getDirectionalLightProjectionViewMatrix()

> **getDirectionalLightProjectionViewMatrix**(`view`): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/light/core/LightManager.ts:359](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L359)

Returns the projection-view matrix of the directional light.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D instance |

#### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

mat4 projection-view matrix

***

### getDirectionalLightViewMatrix()

> **getDirectionalLightViewMatrix**(`view`): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/light/core/LightManager.ts:389](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L389)

Calculates and returns the view (lookAt) matrix of the main directional light.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D instance |

#### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

mat4 view matrix

***

### removeAllDirectionalLight()

> **removeAllDirectionalLight**(): `void`

Defined in: [src/light/core/LightManager.ts:330](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L330)

Removes all DirectionalLights.

#### Returns

`void`

***

### removeAllLight()

> **removeAllLight**(): `void`

Defined in: [src/light/core/LightManager.ts:341](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L341)

Removes all lights in the scene.

Removes all point, spot, and directional lights, and sets ambient light to null.

#### Returns

`void`

***

### removeAllPointLight()

> **removeAllPointLight**(): `void`

Defined in: [src/light/core/LightManager.ts:322](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L322)

Removes all PointLights.

#### Returns

`void`

***

### removeAllSpotLight()

> **removeAllSpotLight**(): `void`

Defined in: [src/light/core/LightManager.ts:314](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L314)

Removes all SpotLights.

#### Returns

`void`

***

### removeDirectionalLight()

> **removeDirectionalLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:305](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L305)

Removes a specific DirectionalLight.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](../../../classes/DirectionalLight.md) | DirectionalLight instance to remove |

#### Returns

`void`

***

### removePointLight()

> **removePointLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:292](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L292)

Removes a specific PointLight.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](../../../classes/PointLight.md) | PointLight instance to remove |

#### Returns

`void`

***

### removeSpotLight()

> **removeSpotLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:279](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/light/core/LightManager.ts#L279)

Removes a specific SpotLight.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](../../../classes/SpotLight.md) | SpotLight instance to remove |

#### Returns

`void`
