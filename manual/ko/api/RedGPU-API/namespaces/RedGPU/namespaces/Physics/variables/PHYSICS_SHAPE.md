[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / PHYSICS\_SHAPE

# Variable: PHYSICS\_SHAPE

> `const` **PHYSICS\_SHAPE**: `object`

Defined in: [src/physics/PhysicsShape.ts:13](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/PhysicsShape.ts#L13)

**`Experimental`**

물리 시뮬레이션에서 사용하는 충돌체 형상(Shape) 상수입니다.

::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
:::

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-box"></a> `BOX` | `"box"` | `'box'` | 박스 형태의 충돌체 | [src/physics/PhysicsShape.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/PhysicsShape.ts#L18) |
| <a id="property-capsule"></a> `CAPSULE` | `"capsule"` | `'capsule'` | 캡슐 형태의 충돌체 | [src/physics/PhysicsShape.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/PhysicsShape.ts#L28) |
| <a id="property-cylinder"></a> `CYLINDER` | `"cylinder"` | `'cylinder'` | 원기둥 형태의 충돌체 | [src/physics/PhysicsShape.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/PhysicsShape.ts#L33) |
| <a id="property-heightfield"></a> `HEIGHTFIELD` | `"heightfield"` | `'heightfield'` | 높이맵 형태의 충돌체 | [src/physics/PhysicsShape.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/PhysicsShape.ts#L38) |
| <a id="property-mesh"></a> `MESH` | `"mesh"` | `'mesh'` | 삼각형 메시(Trimesh) 형태의 충돌체 | [src/physics/PhysicsShape.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/PhysicsShape.ts#L43) |
| <a id="property-sphere"></a> `SPHERE` | `"sphere"` | `'sphere'` | 구 형태의 충돌체 | [src/physics/PhysicsShape.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/PhysicsShape.ts#L23) |
