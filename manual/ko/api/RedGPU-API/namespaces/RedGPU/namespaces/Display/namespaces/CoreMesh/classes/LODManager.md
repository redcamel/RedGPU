[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / LODManager

# Class: LODManager

Defined in: [src/display/mesh/core/LODManager.ts:64](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/LODManager.ts#L64)

거리 기반 LOD(Level of Detail) 관리를 담당하는 매니저 클래스입니다.


카메라와의 거리(또는 임의의 거리 값)에 따라 적절한 LOD 레벨을 선택하고, LOD 목록이 갱신될 때 콜백을 호출합니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
// Mesh를 통해 접근합니다.
const lodManager = mesh.LODManager;
lodManager.addLOD(10, nearGeometry, material);
```

## Constructors

### Constructor

> **new LODManager**(`ownner`, `callback`): `LODManager`

Defined in: [src/display/mesh/core/LODManager.ts:74](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/LODManager.ts#L74)

LODManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ownner` | `any` | - |
| `callback` | () => `void` | LOD 목록이 변경될 때마다 호출되는 콜백 함수 |

#### Returns

`LODManager`

## Accessors

### LODList

#### Get Signature

> **get** **LODList**(): `LODEntry`[]

Defined in: [src/display/mesh/core/LODManager.ts:90](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/LODManager.ts#L90)

현재 등록된 모든 LOD 레벨 목록을 반환합니다.

##### Remarks

반환되는 배열은 내부 배열의 복사본이므로, 외부에서 수정해도
LODManager 내부 상태에는 영향을 주지 않습니다.

##### Returns

`LODEntry`[]

LOD 레벨 정보 배열(복사본)

## Methods

### addLOD()

> **addLOD**(`distance`, `geometry`, `material`): `void`

Defined in: [src/display/mesh/core/LODManager.ts:108](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/LODManager.ts#L108)

새로운 LOD 레벨을 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | 이 LOD가 사용될 기준 거리(양수) |
| `geometry` | `LODGeometry` | 해당 LOD 거리에서 사용할 지오메트리 |
| `material` | [`ABaseMaterial`](../../../../Material/namespaces/Core/classes/ABaseMaterial.md) |  |

#### Returns

`void`

#### Remarks

- LOD 레벨은 최대 8개까지만 허용됩니다.
- 동일한 `distance` 값을 가진 LOD는 중복 추가할 수 없습니다.

#### Throws

LOD 레벨이 8개를 초과하는 경우

#### Throws

동일한 거리의 LOD가 이미 존재하는 경우

***

### clearLOD()

> **clearLOD**(): `void`

Defined in: [src/display/mesh/core/LODManager.ts:175](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/LODManager.ts#L175)

모든 LOD 레벨을 제거합니다.

#### Returns

`void`

#### Remarks

LOD 목록이 초기화된 후 콜백이 호출됩니다.

***

### getLOD()

> **getLOD**(`currentDistance`): `LODEntry`

Defined in: [src/display/mesh/core/LODManager.ts:148](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/LODManager.ts#L148)

현재 거리 값에 대해 가장 적절한 LOD 엔트리를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `currentDistance` | `number` | 기준이 되는 현재 거리 값 |

#### Returns

`LODEntry`

선택된 LOD 엔트리, LOD가 하나도 없는 경우 `undefined`

#### Remarks

- `currentDistance`가 가장 작은 `distance`보다 작으면 해당 LOD를 반환합니다.
- 그 외에는 조건을 만족하는 마지막 LOD 또는 가장 멀리 있는 LOD를 반환합니다.
- 실제 지오메트리는 반환값의 `geometry` 필드에서 접근할 수 있습니다.

***

### removeLOD()

> **removeLOD**(`distance`): `void`

Defined in: [src/display/mesh/core/LODManager.ts:164](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/LODManager.ts#L164)

지정한 거리의 LOD 레벨을 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | 제거할 LOD 레벨의 기준 거리 |

#### Returns

`void`

#### Remarks

지정한 거리와 정확히 일치하는 LOD만 제거됩니다.
일치하는 LOD가 없으면 아무 작업도 수행하지 않습니다.
