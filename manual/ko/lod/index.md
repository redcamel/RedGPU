---
title: LOD
order: 10
---

# LOD

**LOD**(Level of Detail) 는 카메라와 객체 간의 거리에 따라 정점 수가 다른 지오메트리 (Geometry)로 전환하여 렌더링 성능을 최적화하는 기법입니다. RedGPU는 `Mesh` 와
`InstancingMesh` 에 `LODManager` 를 기본 내장하여 동일한 인터페이스로 거리별 모델을 관리합니다.

## 1. 객체별 LOD 방식 비교

| 구분                                          | 대상 클래스      | 거리 판정 주체 | 특징                                                                             |
|:----------------------------------------------|:-----------------|:---------------|:---------------------------------------------------------------------------------|
| **[Mesh LOD](./mesh-lod.md)**                 | `Mesh`           | CPU            | 매 프레임 단일 객체와 카메라의 거리를 계산하여 렌더링할 지오메트리를 교체        |
| **[Instancing Mesh LOD](./instanced-lod.md)** | `InstancingMesh` | GPU 셰이더     | 수만 개의 인스턴스별 카메라 거리를 GPU에서 병렬 판정하여 서브 드로우 콜로 렌더링 |

---

## 다음 단계

- **[Mesh LOD](./mesh-lod.md)** : 일반 단일 메시에 거리별 LOD 적용
- **[Instancing Mesh LOD](./instanced-lod.md)** : 대량 인스턴싱 메시에 GPU 기반 LOD 적용
