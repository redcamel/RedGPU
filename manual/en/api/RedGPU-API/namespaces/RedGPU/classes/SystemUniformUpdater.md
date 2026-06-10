[**RedGPU API v4.1.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / SystemUniformUpdater

# Class: SystemUniformUpdater

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:22](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/renderer/helperFunc/SystemUniformUpdater.ts#L22)

A utility class for updating system uniform data.

Maps WGSL structure data commonly used globally in the system, such as cameras, lights, and shadows, to Float32Array/Uint32Array buffers.

## Constructors

### Constructor

> **new SystemUniformUpdater**(): `SystemUniformUpdater`

#### Returns

`SystemUniformUpdater`

## Methods

### updateAmbientLight()

> `static` **updateAmbientLight**(`ambientLight`, `ambientLightMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:384](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/renderer/helperFunc/SystemUniformUpdater.ts#L384)

Updates AmbientLight information to uniform data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ambientLight` | [`AmbientLight`](../namespaces/Light/classes/AmbientLight.md) | AmbientLight instance to update |
| `ambientLightMembers` | `any` | WGSL AmbientLight structure member information |
| `uniformDataF32` | `Float32Array` | Target Float32Array buffer |
| `uniformDataU32` | `Uint32Array` | Target Uint32Array buffer |

#### Returns

`void`

***

### updateCamera()

> `static` **updateCamera**(`camera`, `cameraMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:40](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/renderer/helperFunc/SystemUniformUpdater.ts#L40)

Updates camera information to uniform data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `camera` | [`Camera2D`](../namespaces/Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../namespaces/Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../namespaces/Camera/classes/OrthographicCamera.md) | Camera instance to update |
| `cameraMembers` | `any` | WGSL camera structure member information |
| `uniformDataF32` | `Float32Array` | Target Float32Array buffer |
| `uniformDataU32` | `Uint32Array` | Target Uint32Array buffer |

#### Returns

`void`

***

### updateDirectionalLights()

> `static` **updateDirectionalLights**(`directionalLights`, `directionalLightsMemberList`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:339](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/renderer/helperFunc/SystemUniformUpdater.ts#L339)

Updates DirectionalLight array information to uniform data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `directionalLights` | [`DirectionalLight`](../namespaces/Light/classes/DirectionalLight.md)[] | Array of DirectionalLight to update |
| `directionalLightsMemberList` | `any` | Member list of WGSL DirectionalLight structure array |
| `uniformDataF32` | `Float32Array` | Target Float32Array buffer |
| `uniformDataU32` | `Uint32Array` | Target Uint32Array buffer |

#### Returns

`void`

***

### updateProjection()

> `static` **updateProjection**(`projectionInfo`, `projectionMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:273](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/renderer/helperFunc/SystemUniformUpdater.ts#L273)

Updates projection-related matrix information to uniform data.

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
| `uniformDataF32` | `Float32Array` | Target Float32Array buffer |
| `uniformDataU32` | `Uint32Array` | Target Uint32Array buffer |

#### Returns

`void`

***

### updateShadow()

> `static` **updateShadow**(`shadowManager`, `shadowMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:117](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/renderer/helperFunc/SystemUniformUpdater.ts#L117)

Updates shadow configuration information to uniform data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shadowManager` | `any` | Shadow manager instance |
| `shadowMembers` | `any` | WGSL shadow structure member information |
| `uniformDataF32` | `Float32Array` | Target Float32Array buffer |
| `uniformDataU32` | `Uint32Array` | Target Uint32Array buffer |

#### Returns

`void`

***

### updateSkyAtmosphere()

> `static` **updateSkyAtmosphere**(`skyAtmosphere`, `systemMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:155](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/renderer/helperFunc/SystemUniformUpdater.ts#L155)

Updates SkyAtmosphere information to uniform data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `skyAtmosphere` | [`SkyAtmosphere`](../namespaces/Display/classes/SkyAtmosphere.md) | SkyAtmosphere instance |
| `systemMembers` | `any` | - |
| `uniformDataF32` | `Float32Array` | Target Float32Array buffer |
| `uniformDataU32` | `Uint32Array` | Target Uint32Array buffer |

#### Returns

`void`

***

### updateTime()

> `static` **updateTime**(`timeInfo`, `timeMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:222](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/renderer/helperFunc/SystemUniformUpdater.ts#L222)

Updates time-related information to uniform data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timeInfo` | [`RenderViewStateData`](../namespaces/Display/namespaces/CoreView/classes/RenderViewStateData.md) \| \{ `deltaTime`: `number`; `frameIndex`: `number`; `sinTime`: `number`; `time`: `number`; \} | Time information object |
| `timeMembers` | `any` | WGSL time structure member information |
| `uniformDataF32` | `Float32Array` | Target Float32Array buffer |
| `uniformDataU32` | `Uint32Array` | Target Uint32Array buffer |

#### Returns

`void`
