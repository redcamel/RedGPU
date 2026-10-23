---
title: Extended Objects
order: 7
---

# 확장 객체

외부 3D 모델 로딩, 대량 인스턴싱, 2D/3D 스프라이트와 텍스트, GPU 파티클 및 라인 렌더러를 활용하여 씬의 콘텐츠를 구성하는 방법을 다룹니다.

## 학습 주제

1. **[GLTF Loader](./model-loading/index.md)** : 외부 3D 모델 파일 (`.gltf`, `.glb`) 로드, 애니메이션 재생 및 `AnimStateMachine` 모션 블렌딩
2. **[Instancing Mesh](./instanced-mesh/index.md)** : 수만 개의 동일 객체를 단 한 번의 드로우 콜로 처리하는 고성능 GPU 인스턴싱 (`InstancingMesh`)
3. **[Sprite](./sprite/index.md)** : 빌보드 아이콘 (`Sprite3D`), 2D 스프라이트 (`Sprite2D`) 및 프레임 애니메이션 (`SpriteSheet3D` /
   `SpriteSheet2D`)
4. **[Text Field](./text-field/index.md)** : 3D 월드 및 2D 화면 내 텍스트 (`TextField3D` / `TextField2D`) 배치
5. **[Particle & Line](./particle/index.md)** : GPU 컴퓨트 셰이더 기반 파티클 (`ParticleEmitter`) 및 3D/2D 곡선 렌더러 (`Line3D` /
   `Line2D`)

---

## 관련 예제

- [glTF 모델 로딩 (DamagedHelmet)](/RedGPU/examples/gltf/models/helmets/)
- [인스턴싱 메시 (InstancingMesh)](/RedGPU/examples/3d/instancedMesh/simple/)
- [3D 스프라이트 (Sprite3D)](/RedGPU/examples/3d/sprite/sprite3D/)
- [3D 텍스트 필드 (TextField3D)](/RedGPU/examples/3d/textField/textField3D/)
- [GPU 파티클 기본](/RedGPU/examples/3d/particle/basic/)

---

## 다음 단계

- **[GLTF Loader](./model-loading/index.md)** : 외부 `.gltf` / `.glb` 모델 로드 및 스켈레탈 애니메이션 재생 배우기
