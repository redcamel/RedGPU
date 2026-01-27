---
title: LOD (Level of Detail)
order: 9
---

# LOD

**LOD**(Level of Detail) 는 카메라 와 객체 간의 거리에 따라 서로 다른 정밀도의 모델(Geometry) 을 보여주는 최적화 기법입니다.
가까이 있는 물체는 고해상도 모델을, 멀리 있는 물체는 저해상도 모델을 사용함으로써 시각적 품질을 유지하면서 렌더링 성능을 극대화할 수 있습니다.

RedGPU 는 `Mesh` 와 `InstancingMesh` 모두에 **`LODManager`** 를 내장하여 일관된 방식으로 LOD 를 지원합니다.

## 학습 가이드

객체 타입에 따라 LOD 동작 방식에 차이가 있습니다. 상황에 맞는 문서를 참고하세요.

1. **[Mesh LOD](./mesh-lod.md)** : 일반적인 단일 객체에 적용 (CPU 기반)
2. **[Instancing Mesh LOD](./instanced-lod.md)** : 대량의 인스턴싱 객체에 적용 (GPU 기반)

---

[다음 단계: Mesh LOD 배우기](./mesh-lod.md)