---
title: Physics (Rapier)
order: 1
---

# 물리 엔진 플러그인 (Rapier)

RedGPU는 고성능 WASM 기반 물리 엔진인 **Rapier**를 플러그인 형태로 지원합니다. 이 플러그인을 통해 3D 공간에서의 강체(Rigid Body) 시뮬레이션, 정밀한 충돌 감지, 캐릭터 컨트롤러 등을 엔진과 완벽하게 통합하여 사용할 수 있습니다.

::: warning 실험적 기능 (Experimental)
물리 엔진 플러그인은 현재 **실험적 단계**에 있습니다. 개발 과정에서 API 명세나 동작 방식이 예고 없이 변경될 수 있으니 주의하여 사용하시기 바랍니다.
:::

## 1. 초기화 및 설정

물리 엔진은 메인 엔진 번들과 분리되어 있으므로 별도로 임포트해야 합니다. WASM 바이너리를 로드하는 과정이 포함되어 있어 초기화는 비동기로 진행됩니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
import { RapierPhysics } from "https://redcamel.github.io/RedGPU/dist/plugins/physics/rapier/index.js";

// 1. 물리 엔진 인스턴스 생성
const physicsEngine = new RapierPhysics();

// 2. 엔진 초기화 (WASM 로드 및 월드 생성)
await physicsEngine.init();

// 3. 씬(Scene)에 물리 엔진 등록
// 등록 시 씬 내부의 객체들과 물리 시뮬레이션이 연결될 준비가 완료됩니다.
scene.physicsEngine = physicsEngine;
```

## 2. 시뮬레이션 자동 통합

RedGPU는 씬(Scene)에 등록된 물리 엔진을 렌더링 루프와 동기화하여 **자동으로 업데이트**합니다. 따라서 개발자가 별도의 `step()` 함수를 매 프레임 호출할 필요가 없습니다.

```javascript
// 씬에 물리 엔진을 등록하는 것만으로 자동 시뮬레이션이 시작됩니다.
scene.physicsEngine = physicsEngine;
```

기본적으로 초당 60회(60FPS)의 고정된 간격으로 물리 연산이 수행되어, 주사율이 다른 모니터 환경에서도 일관된 물리 법칙이 적용됩니다.

## 3. 물리 바디(Body) 생성 및 연결

일반적인 메쉬 객체에 물리적 특성을 부여하려면 `createBody()`를 사용합니다. RedGPU의 물리 시스템은 생성된 바디의 상태(위치, 회전)를 메쉬의 트랜스폼에 자동으로 동기화합니다.

```typescript
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(box);

// 메쉬에 동적(Dynamic) 물리 특성 부여
const body = physicsEngine.createBody(box, {
    type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, // 물리 법칙의 영향을 받음
    shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,        // 박스 형태의 충돌체
    mass: 1.0,                                      // 질량 (kg)
    restitution: 0.5                                // 탄성 (0 ~ 1)
});

// 외부에서 힘(충격량) 적용 예시
body.applyImpulse([0, 10, 0]);
```

### 복합 콜라이더 (Compound Shapes)
`createBody` 호출 시 전달된 메쉬에 자식 메쉬들이 포함되어 있다면, RedGPU는 계층 구조를 자동으로 분석하여 모든 자식의 형상을 포함하는 **복합 콜라이더**를 생성합니다.

## 4. 주요 상수 및 설정

### PHYSICS_BODY_TYPE
물체가 월드와 상호작용하는 방식을 정의합니다.
- `DYNAMIC`: 중력과 충돌에 반응하며 자유롭게 움직입니다.
- `STATIC`: 공간에 고정되어 움직이지 않으며 다른 물체와 충돌만 합니다. (바닥, 벽 등)
- `KINEMATIC_POSITION`: 물리 법칙은 무시하고 코드로 직접 위치를 제어하며, 다른 물체를 밀어낼 수 있습니다.

### PHYSICS_SHAPE
기본 제공되는 충돌체 형상입니다.
- `BOX`, `SPHERE`, `CAPSULE`, `CYLINDER`: 표준 프리미티브 형상.
- `HEIGHTFIELD`: 지형 데이터를 위한 높이맵 형상.
- `MESH`: 복잡한 메쉬 데이터 기반의 정밀 콜라이더.

---

## 5. 라이브 예제

분야별 예제를 통해 물리 엔진의 실제 활용법을 확인해 보세요.

### 5.1 기초 및 형상
- [기본 시뮬레이션 및 중력 테스트](https://redcamel.github.io/RedGPU/examples/physics/basic/)
- [다양한 충돌체 형상 (Shapes)](https://redcamel.github.io/RedGPU/examples/physics/shapes/)
- [지형(Heightfield) 시뮬레이션](https://redcamel.github.io/RedGPU/examples/physics/heightField/)

### 5.2 컨트롤러 및 상호작용
- [키네마틱(Kinematic) 캐릭터 제어](https://redcamel.github.io/RedGPU/examples/physics/characterController/)
- [고급 캐릭터 컨트롤러 (계단/경사로)](https://redcamel.github.io/RedGPU/examples/physics/advancedCharacterController/)
- [마우스 클릭 및 레이캐스트 상호작용](https://redcamel.github.io/RedGPU/examples/physics/raycast/)

### 5.3 조인트 및 고급 물리
- [기본 조인트 (Joints)](https://redcamel.github.io/RedGPU/examples/physics/joints/)
- [회전 조인트 (Revolute)](https://redcamel.github.io/RedGPU/examples/physics/revoluteJoint/)
- [스프링 및 유연한 연결 (Spring)](https://redcamel.github.io/RedGPU/examples/physics/springJoint/)

---

## 핵심 요약
1. `RapierPhysics`를 별도로 임포트하고 **비동기 초기화**가 필요합니다.
2. `scene.physicsEngine` 등록 후 렌더 루프에서 `step(dt)`을 호출해야 시뮬레이션이 동작합니다.
3. `createBody`는 메쉬의 계층 구조를 자동으로 물리 월드에 반영합니다.