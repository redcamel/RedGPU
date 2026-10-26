[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / LODManager

# Class: LODManager

Defined in: [src/display/mesh/core/LODManager.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L58)

Class that manages distance-based LOD (Level of Detail).

Selects the appropriate geometry and material level based on distance from the camera, and invokes a callback when the LOD list changes.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Access via Mesh instance
const lodManager = mesh.LODManager;
lodManager.addLOD(10, nearGeometry, material);
```

## See

 - [Mesh CPU LOD example](https://redcamel.github.io/RedGPU/examples/3d/lod/MeshCPULOD/)
 - [Mesh CPU LOD material example](https://redcamel.github.io/RedGPU/examples/3d/lod/MeshCPULOD_material/)
 - [InstancingMesh GPU LOD example](https://redcamel.github.io/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)
 - [InstancingMesh GPU LOD material example](https://redcamel.github.io/RedGPU/examples/3d/lod/InstanceMeshGPULOD_material/)

## Constructors

### Constructor

> **new LODManager**(`owner`, `callback`): `LODManager`

Defined in: [src/display/mesh/core/LODManager.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L74)

Creates a LODManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `owner` | `any` | Target object that owns the LODManager |
| `callback` | () => `void` | Callback function invoked when the LOD list changes |

#### Returns

`LODManager`

## Accessors

### LODList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODList**(): `LODEntry`[]

Defined in: [src/display/mesh/core/LODManager.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L89)

Returns a copy of all registered LOD levels.

##### Returns

`LODEntry`[]

Copy of the LOD level entry array

## Methods

### addLOD()

> **addLOD**(`distance`, `geometry`, `material`): `void`

Defined in: [src/display/mesh/core/LODManager.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L115)

Adds a new LOD level. Up to 8 levels can be registered, and duplicate distances are not allowed.

#### Example
```typescript
mesh.LODManager.addLOD(20, lowPolyGeometry, material);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | Threshold distance at which this LOD activates (positive number >= 1) |
| `geometry` | `LODGeometry` | Geometry to use at this LOD distance |
| `material` | [`ABaseMaterial`](../../../../Material/namespaces/Core/classes/ABaseMaterial.md) | Material to use at this LOD distance |

#### Returns

`void`

#### Throws

Throws Error if LOD levels exceed 8 or if a LOD with the same distance already exists

***

### clearLOD()

> **clearLOD**(): `void`

Defined in: [src/display/mesh/core/LODManager.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L179)

Removes all registered LOD levels.

#### Returns

`void`

***

### getLOD()

> **getLOD**(`currentDistance`): `LODEntry`

Defined in: [src/display/mesh/core/LODManager.ts:155](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L155)

Returns the LOD entry corresponding to the current distance value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `currentDistance` | `number` | Current distance value to evaluate |

#### Returns

`LODEntry`

Selected LOD entry (`undefined` if no LOD is registered)

***

### removeLOD()

> **removeLOD**(`distance`): `void`

Defined in: [src/display/mesh/core/LODManager.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L170)

Removes the LOD level with the specified threshold distance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | Threshold distance of the LOD level to remove |

#### Returns

`void`
