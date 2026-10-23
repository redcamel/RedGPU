---
title: Plugins
order: 14
---

# 플러그인

RedGPU의 **플러그인 시스템**은 코어 엔진 번들 크기를 최소화하면서 WASM 기반 물리 엔진 등 외부 확장 모듈을 `Scene` 및 렌더링 루프에 통합하는 인터페이스입니다.

---

## 제공되는 플러그인

| 플러그인                               | 핵심 클래스     | 설명                                                                                                                  |
|:---------------------------------------|:----------------|:----------------------------------------------------------------------------------------------------------------------|
| **[물리 엔진 플러그인](./physics.md)** | `RapierPhysics` | WASM 기반 Rapier 물리 엔진을 연동하여 강체(Rigid Body) 시뮬레이션, 충돌 감지, 캐릭터 컨트롤러 및 조인트를 처리합니다. |

---

## 관련 예제

- [물리 엔진 기본 시뮬레이션](/RedGPU/examples/physics/basic/)
- [충돌체 형상 (Shapes)](/RedGPU/examples/physics/shapes/)
- [키네마틱 캐릭터 컨트롤러](/RedGPU/examples/physics/characterController/)

---

## 다음 단계

- **[물리 엔진 플러그인](./physics.md)** : `RapierPhysics` 초기화 및 물리 바디 (`createBody`) 연동 방법
