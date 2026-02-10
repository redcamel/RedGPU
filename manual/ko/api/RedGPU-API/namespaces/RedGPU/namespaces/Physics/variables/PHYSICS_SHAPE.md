[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / PHYSICS\_SHAPE

# Variable: PHYSICS\_SHAPE

> `const` **PHYSICS\_SHAPE**: `object`

Defined in: [src/physics/PhysicsShape.ts:13](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/PhysicsShape.ts#L13)

**`Experimental`**

물리 시뮬레이션에서 사용하는 충돌체 형상(Shape)의 종류를 정의합니다.


::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.

:::

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-box"></a> `BOX` | `"box"` | `'box'` | 박스 형태의 충돌체
| <a id="property-capsule"></a> `CAPSULE` | `"capsule"` | `'capsule'` | 캡슐 형태의 충돌체
| <a id="property-cylinder"></a> `CYLINDER` | `"cylinder"` | `'cylinder'` | 원기둥 형태의 충돌체
| <a id="property-heightfield"></a> `HEIGHTFIELD` | `"heightfield"` | `'heightfield'` | 높이맵 형태의 충돌체 (지형 등에 사용)
| <a id="property-mesh"></a> `MESH` | `"mesh"` | `'mesh'` | 임의의 메시 형태의 충돌체 (Trimesh)
| <a id="property-sphere"></a> `SPHERE` | `"sphere"` | `'sphere'` | 구 형태의 충돌체
