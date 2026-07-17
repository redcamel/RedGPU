[**RedGPU API v4.3.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / LightManager

# Class: LightManager

Defined in: [src/light/core/LightManager.ts:30](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L30)

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

Defined in: [src/light/core/LightManager.ts:175](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L175)

Returns the currently set AmbientLight.

##### Returns

[`AmbientLight`](../../../classes/AmbientLight.md)

AmbientLight instance or null

#### Set Signature

> **set** **ambientLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:190](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L190)

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

Defined in: [src/light/core/LightManager.ts:151](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L151)

Returns the number of registered directional lights.

##### Returns

`number`

Number of directional lights

***

### directionalLights

#### Get Signature

> **get** **directionalLights**(): [`DirectionalLight`](../../../classes/DirectionalLight.md)[]

Defined in: [src/light/core/LightManager.ts:163](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L163)

Returns the array of registered directional lights.

##### Returns

[`DirectionalLight`](../../../classes/DirectionalLight.md)[]

Array of registered DirectionalLights

***

### limitClusterLightCount

#### Get Signature

> **get** **limitClusterLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:103](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L103)

Returns the maximum allowable count for cluster lights (Point + Spot).

##### Returns

`number`

Maximum number of cluster lights

***

### limitDirectionalLightCount

#### Get Signature

> **get** **limitDirectionalLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:139](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L139)

Returns the maximum allowable count for directional lights.

##### Returns

`number`

Maximum number of directional lights

***

### pointLightCount

#### Get Signature

> **get** **pointLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:127](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L127)

Returns the number of registered point lights.

##### Returns

`number`

Number of point lights

***

### pointLights

#### Get Signature

> **get** **pointLights**(): [`PointLight`](../../../classes/PointLight.md)[]

Defined in: [src/light/core/LightManager.ts:115](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L115)

Returns the array of registered point lights.

##### Returns

[`PointLight`](../../../classes/PointLight.md)[]

Array of registered PointLights

***

### spotLightCount

#### Get Signature

> **get** **spotLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:91](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L91)

Returns the number of registered spot lights.

##### Returns

`number`

Number of spot lights

***

### spotLights

#### Get Signature

> **get** **spotLights**(): [`SpotLight`](../../../classes/SpotLight.md)[]

Defined in: [src/light/core/LightManager.ts:79](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L79)

Returns the array of registered spot lights.

##### Returns

[`SpotLight`](../../../classes/SpotLight.md)[]

Array of registered SpotLights

## Methods

### addDirectionalLight()

> **addDirectionalLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:261](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L261)

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

Defined in: [src/light/core/LightManager.ts:236](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L236)

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

Defined in: [src/light/core/LightManager.ts:211](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L211)

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

### destroy()

> **destroy**(): `void`

Defined in: [src/light/core/LightManager.ts:396](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L396)

Destroys the LightManager instance and cleans up all lights and debuggers.

#### Returns

`void`

***

### getDirectionalLightProjectionMatrix()

> **getDirectionalLightProjectionMatrix**(`view`): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/light/core/LightManager.ts:373](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L373)

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

Defined in: [src/light/core/LightManager.ts:358](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L358)

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

Defined in: [src/light/core/LightManager.ts:388](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L388)

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

Defined in: [src/light/core/LightManager.ts:329](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L329)

Removes all DirectionalLights.

#### Returns

`void`

***

### removeAllLight()

> **removeAllLight**(): `void`

Defined in: [src/light/core/LightManager.ts:340](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L340)

Removes all lights in the scene.

Removes all point, spot, and directional lights, and sets ambient light to null.

#### Returns

`void`

***

### removeAllPointLight()

> **removeAllPointLight**(): `void`

Defined in: [src/light/core/LightManager.ts:321](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L321)

Removes all PointLights.

#### Returns

`void`

***

### removeAllSpotLight()

> **removeAllSpotLight**(): `void`

Defined in: [src/light/core/LightManager.ts:313](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L313)

Removes all SpotLights.

#### Returns

`void`

***

### removeDirectionalLight()

> **removeDirectionalLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:304](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L304)

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

Defined in: [src/light/core/LightManager.ts:291](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L291)

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

Defined in: [src/light/core/LightManager.ts:278](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/light/core/LightManager.ts#L278)

Removes a specific SpotLight.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](../../../classes/SpotLight.md) | SpotLight instance to remove |

#### Returns

`void`
