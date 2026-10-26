[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / LODManager

# Class: LODManager

Defined in: [src/display/mesh/core/LODManager.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L58)

거리 기반 LOD(Level of Detail)를 관리하는 클래스입니다.

카메라와의 거리에 따라 적절한 지오메트리 및 재질 레벨을 선택하고, LOD 목록이 변경될 때 콜백을 호출합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// Mesh 인스턴스를 통해 접근
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

LODManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `owner` | `any` | LODManager를 소유하는 대상 객체 |
| `callback` | () => `void` | LOD 목록이 변경될 때 호출되는 콜백 함수 |

#### Returns

`LODManager`

## Accessors

### LODList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODList**(): `LODEntry`[]

Defined in: [src/display/mesh/core/LODManager.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L89)

등록된 모든 LOD 레벨 목록의 복사본을 반환합니다.

##### Returns

`LODEntry`[]

LOD 레벨 정보 배열 복사본

## Methods

### addLOD()

> **addLOD**(`distance`, `geometry`, `material`): `void`

Defined in: [src/display/mesh/core/LODManager.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L115)

새로운 LOD 레벨을 추가합니다. 최대 8개까지 등록할 수 있으며 동일한 거리는 중복 등록할 수 없습니다.

#### Example
```typescript
mesh.LODManager.addLOD(20, lowPolyGeometry, material);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | 이 LOD가 활성화될 기준 거리 (1 이상의 양수) |
| `geometry` | `LODGeometry` | 해당 LOD 거리에서 사용할 지오메트리 |
| `material` | [`ABaseMaterial`](../../../../Material/namespaces/Core/classes/ABaseMaterial.md) | 해당 LOD 거리에서 사용할 재질 |

#### Returns

`void`

#### Throws

LOD 레벨이 8개를 초과하거나 동일한 거리의 LOD가 이미 존재할 경우 Error 발생

***

### clearLOD()

> **clearLOD**(): `void`

Defined in: [src/display/mesh/core/LODManager.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L179)

등록된 모든 LOD 레벨을 제거합니다.

#### Returns

`void`

***

### getLOD()

> **getLOD**(`currentDistance`): `LODEntry`

Defined in: [src/display/mesh/core/LODManager.ts:155](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L155)

현재 거리 값에 해당하는 LOD 엔트리를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `currentDistance` | `number` | 기준이 되는 현재 거리 값 |

#### Returns

`LODEntry`

선택된 LOD 엔트리 (등록된 LOD가 없으면 `undefined`)

***

### removeLOD()

> **removeLOD**(`distance`): `void`

Defined in: [src/display/mesh/core/LODManager.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/LODManager.ts#L170)

지정한 기준 거리의 LOD 레벨을 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | 제거할 LOD 레벨의 기준 거리 |

#### Returns

`void`
