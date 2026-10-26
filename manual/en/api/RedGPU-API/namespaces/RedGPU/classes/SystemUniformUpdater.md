[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / SystemUniformUpdater

# Class: SystemUniformUpdater

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L21)

Utility class that updates system-wide WGSL uniform structure data such as camera, lights, shadows, sky atmosphere, and wind to `Float32Array`/`Uint32Array` buffers.

## Constructors

### Constructor

> **new SystemUniformUpdater**(): `SystemUniformUpdater`

#### Returns

`SystemUniformUpdater`

## Methods

### updateAmbientLight()

> `static` **updateAmbientLight**(`ambientLight`, `ambientLightMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:431](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L431)

Updates `AmbientLight` information to the system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ambientLight` | [`AmbientLight`](../namespaces/Light/classes/AmbientLight.md) | `AmbientLight` instance to update |
| `ambientLightMembers` | `any` | WGSL `AmbientLight` structure member information |
| `uniformDataF32` | `Float32Array` | Target `Float32Array` buffer |
| `uniformDataU32` | `Uint32Array` | Target `Uint32Array` buffer |

#### Returns

`void`

***

### updateCamera()

> `static` **updateCamera**(`camera`, `cameraMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L39)

Updates camera information to the system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `camera` | [`Camera2D`](../namespaces/Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../namespaces/Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../namespaces/Camera/classes/OrthographicCamera.md) | Camera instance to update |
| `cameraMembers` | `any` | WGSL camera structure member information |
| `uniformDataF32` | `Float32Array` | Target `Float32Array` buffer |
| `uniformDataU32` | `Uint32Array` | Target `Uint32Array` buffer |

#### Returns

`void`

***

### updateDirectionalLights()

> `static` **updateDirectionalLights**(`directionalLights`, `directionalLightsMemberList`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:386](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L386)

Updates `DirectionalLight` array information to the system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `directionalLights` | [`DirectionalLight`](../namespaces/Light/classes/DirectionalLight.md)[] | Array of directional lights to update (`DirectionalLight[]`) |
| `directionalLightsMemberList` | `any` | Member list of WGSL `DirectionalLight` structure array |
| `uniformDataF32` | `Float32Array` | Target `Float32Array` buffer |
| `uniformDataU32` | `Uint32Array` | Target `Uint32Array` buffer |

#### Returns

`void`

***

### updateProjection()

> `static` **updateProjection**(`projectionInfo`, `projectionMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:320](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L320)

Updates projection and view-projection matrix information to the system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionInfo` | \{ `inverseProjectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `inverseProjectionViewMatrix?`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `noneJitterProjectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `noneJitterProjectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `prevNoneJitterProjectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `projectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `projectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); \} | Projection matrix information object |
| `projectionInfo.inverseProjectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.inverseProjectionViewMatrix?` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.noneJitterProjectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.noneJitterProjectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.prevNoneJitterProjectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.projectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.projectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionMembers` | `any` | WGSL projection structure member information |
| `uniformDataF32` | `Float32Array` | Target `Float32Array` buffer |
| `uniformDataU32` | `Uint32Array` | Target `Uint32Array` buffer |

#### Returns

`void`

***

### updateShadow()

> `static` **updateShadow**(`shadowManager`, `shadowMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L116)

Updates shadow configuration and cascade matrix information to the system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shadowManager` | `any` | Shadow manager instance |
| `shadowMembers` | `any` | WGSL shadow structure member information |
| `uniformDataF32` | `Float32Array` | Target `Float32Array` buffer |
| `uniformDataU32` | `Uint32Array` | Target `Uint32Array` buffer |

#### Returns

`void`

***

### updateSkyAtmosphere()

> `static` **updateSkyAtmosphere**(`skyAtmosphere`, `systemMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:206](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L206)

Updates `SkyAtmosphere` information to the system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `skyAtmosphere` | [`SkyAtmosphere`](../namespaces/Display/classes/SkyAtmosphere.md) | `SkyAtmosphere` instance |
| `systemMembers` | `any` | WGSL system uniform structure member information |
| `uniformDataF32` | `Float32Array` | Target `Float32Array` buffer |
| `uniformDataU32` | `Uint32Array` | Target `Uint32Array` buffer |

#### Returns

`void`

***

### updateTime()

> `static` **updateTime**(`timeInfo`, `timeMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:269](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L269)

Updates time and frame-related information to the system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timeInfo` | [`RenderViewStateData`](../namespaces/Display/namespaces/CoreView/classes/RenderViewStateData.md) \| \{ `deltaTime`: `number`; `frameIndex`: `number`; `sinTime`: `number`; `time`: `number`; \} | Time information object or `RenderViewStateData` instance |
| `timeMembers` | `any` | WGSL time structure member information |
| `uniformDataF32` | `Float32Array` | Target `Float32Array` buffer |
| `uniformDataU32` | `Uint32Array` | Target `Uint32Array` buffer |

#### Returns

`void`

***

### updateWind()

> `static` **updateWind**(`windManager`, `windMembersInfo`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:469](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderer/helperFunc/SystemUniformUpdater.ts#L469)

Updates `WindManager` environmental information by directly copying it into the system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `windManager` | [`WindManager`](../namespaces/Wind/classes/WindManager.md) | `WindManager` instance to update |
| `windMembersInfo` | `any` | WGSL wind structure member information |
| `uniformDataF32` | `Float32Array` | Target `Float32Array` buffer |
| `uniformDataU32` | `Uint32Array` | Target `Uint32Array` buffer |

#### Returns

`void`
