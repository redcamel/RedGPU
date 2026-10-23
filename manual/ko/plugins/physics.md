---
title: Physics (Rapier)
order: 1
---

# 물리 엔진 플러그인

`RapierPhysics` 플러그인은 WASM 기반 물리 엔진인 **Rapier** 를 `IPhysicsEngine` 인터페이스로 연동하여, 강체 (Rigid Body) 시뮬레이션, 충돌 감지, 캐릭터 컨트롤러 및
복합 콜라이더 동기화를 처리합니다.

> [!WARNING]
> 물리 엔진 플러그인은 현재 **실험적 단계**(Experimental)에 있으며, 개발 과정에서 API 명세나 동작 방식이 변경될 수 있습니다.

## 1. 초기화 및 자동 시뮬레이션 통합

물리 엔진은 코어 번들 용량 최적화를 위해 별도 모듈로 분리되어 있으며, WASM 바이너리 로드를 위해 비동기로 초기화 (`await physicsEngine.init()`)합니다.

`scene.physicsEngine` 에 인스턴스를 할당하면 렌더 루프에서 매 프레임 (기본 60FPS 고정 간격) 물리 연산과 메쉬 트랜스폼 동기화가 자동으로 수행되므로 별도의 `step()` 호출이 필요하지
않습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
import { RapierPhysics } from "https://redcamel.github.io/RedGPU/dist/plugins/physics/rapier/index.js";

// 1. 물리 엔진 인스턴스 생성 및 WASM 비동기 초기화
const physicsEngine = new RapierPhysics();
await physicsEngine.init();

// 2. Scene에 물리 엔진 등록 (렌더 루프와 자동 동기화 시작)
scene.physicsEngine = physicsEngine;
```

---

## 2. 물리 바디 생성 및 연결

`physicsEngine.createBody(mesh, params)` 를 호출하여 `Mesh` 에 물리 바디를 생성하고 위치·회전 동기화를 연결합니다. 전달된 메쉬에 자식 메쉬가 포함되어 있으면 계층 구조를
분석하여 모든 자식의 형상을 포함하는 **복합 콜라이더**(Compound Collider)를 자동으로 생성합니다.

```javascript
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(box);

// 메쉬에 동적(Dynamic) 물리 특성 부여
const body = physicsEngine.createBody(box, {
  type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
  shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
  mass: 1.0,
  restitution: 0.5
});

// 외부 충격량(Impulse) 적용
body.applyImpulse([0, 10, 0]);
```

---

## 3. 상수 및 설정 옵션 명세

### 3.1 `PHYSICS_BODY_TYPE` 및 `PHYSICS_SHAPE`

| 구분                    | 상수명                                                    | 설명                                                                  |
|:------------------------|:----------------------------------------------------------|:----------------------------------------------------------------------|
| **`PHYSICS_BODY_TYPE`** | **`DYNAMIC`**                                             | 중력과 충돌에 반응하며 자유롭게 움직이는 강체                         |
| **`PHYSICS_BODY_TYPE`** | **`STATIC`**                                              | 공간에 고정되어 움직이지 않으며 다른 물체와 충돌만 수행 (바닥, 벽 등) |
| **`PHYSICS_BODY_TYPE`** | **`KINEMATIC`**                                           | 물리 법칙의 영향을 받지 않고 코드로 직접 움직임을 제어 (기본값)       |
| **`PHYSICS_BODY_TYPE`** | **`KINEMATIC_POSITION`**                                  | 위치·회전값을 직접 지정하여 제어하며 다른 동적 물체를 밀어냄          |
| **`PHYSICS_BODY_TYPE`** | **`KINEMATIC_VELOCITY`**                                  | 속도(Velocity)를 지정하여 움직임을 제어                               |
| **`PHYSICS_SHAPE`**     | **`BOX`** / **`SPHERE`** / **`CAPSULE`** / **`CYLINDER`** | 기본 기하학 충돌체 형상 (직육면체, 구, 캡슐, 원기둥)                  |
| **`PHYSICS_SHAPE`**     | **`HEIGHTFIELD`**                                         | 그리드 기반 높이맵 지형 데이터를 위한 충돌체 형상 (`heightData` 필수) |
| **`PHYSICS_SHAPE`**     | **`MESH`**                                                | 메쉬의 실제 정점·인덱스 기하구조를 그대로 사용하는 정밀 콜라이더      |

### 3.2 `BodyParams` (`createBody` 설정 옵션)

| 속성명               | 기본값      | 설명                                                                                  |
|:---------------------|:------------|:--------------------------------------------------------------------------------------|
| **`type`**           | `KINEMATIC` | 바디의 물리적 동작 타입 (`PHYSICS_BODY_TYPE`)                                         |
| **`shape`**          | `BOX`       | 충돌체 형상 (`PHYSICS_SHAPE`)                                                         |
| **`mass`**           | `1.0`       | 질량 (kg)                                                                             |
| **`friction`**       | `0.5`       | 마찰 계수 (`0.0 ~ 1.0`)                                                               |
| **`restitution`**    | `0.0`       | 탄성 계수 (`0.0 ~ 1.0`, `1.0` 이면 완전 탄성 충돌)                                    |
| **`linearDamping`**  | `0.0`       | 선형 이동에 대한 공기 저항 등 감쇠 계수                                               |
| **`angularDamping`** | `0.0`       | 회전에 대한 감쇠 계수                                                                 |
| **`isSensor`**       | `false`     | `true` 설정 시 물리적 충돌 반응 없이 겹침(Overlap) 이벤트만 발생                      |
| **`enableCCD`**      | `false`     | 연속 충돌 감지(Continuous Collision Detection) 활성화 여부 (고속 물체의 벽 관통 방지) |
| **`heightData`**     | `undefined` | `shape` 가 `HEIGHTFIELD` 일 때 전달하는 지형 높이 데이터 객체                         |

---

## 4. 라이브 예제

- **기초 및
  형상**: [기본 시뮬레이션 및 중력](/RedGPU/examples/physics/basic/) · [충돌체 형상](/RedGPU/examples/physics/shapes/) · [지형 Heightfield](/RedGPU/examples/physics/heightField/)
- **컨트롤러 및
  상호작용**: [키네마틱 캐릭터 제어](/RedGPU/examples/physics/characterController/) · [고급 캐릭터 컨트롤러](/RedGPU/examples/physics/advancedCharacterController/) · [클릭 및 레이캐스트](/RedGPU/examples/physics/raycast/)
-

**조인트**: [기본 조인트](/RedGPU/examples/physics/joints/) · [회전 조인트](/RedGPU/examples/physics/revoluteJoint/) · [스프링 조인트](/RedGPU/examples/physics/springJoint/)

---

## 다음 단계

- **[인스펙터](../inspector/index.md)** : 실시간 성능 모니터링 및 씬 계층 구조 디버깅 도구
