---
title: Physics (Rapier)
order: 1
---

# 물리 엔진 플러그인 (Rapier)

RedGPU는 고성능 WASM 기반 물리 엔진인 **Rapier**를 플러그인 형태로 지원합니다. 3D 공간에서의 충돌 감지, 중력, 강체(Rigid Body) 시뮬레이션 등을 손쉽게 구현할 수 있습니다.

## 1. 초기화 및 설정

물리 엔진을 사용하려면 먼저 `RapierPhysics` 인스턴스를 생성하고 초기화해야 합니다. WASM 파일을 로드하므로 `init()` 메서드는 비동기로 동작합니다.

```javascript
import { RapierPhysics } from "https://redcamel.github.io/RedGPU/dist/plugins/physics/rapier/index.js";

// 1. 물리 엔진 인스턴스 생성
const physicsEngine = new RapierPhysics();

// 2. 물리 엔진 초기화 (WASM 로드)
await physicsEngine.init();

// 3. 씬에 물리 엔진 등록
scene.physicsEngine = physicsEngine;
```

## 2. 물리 바디(Body) 생성

메시 객체에 물리적 특성을 부여하려면 `createBody()` 메서드를 사용합니다.

```javascript
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(box);

// 메시와 연동되는 물리 바디 생성
physicsEngine.createBody(box, {
    type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, // 동적 바디 (중력/힘의 영향 받음)
    shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,        // 충돌 박스 형태
    mass: 1,                                        // 질량
    restitution: 0.5                                // 탄성
});
```

## 3. 주요 속성 및 타입

### PHYSICS_BODY_TYPE
물체의 물리적 동작 방식을 결정합니다.

- **`DYNAMIC`**: 중력과 외부 힘에 반응하며 움직이는 물체 (박스, 캐릭터 등)
- **`STATIC`**: 움직이지 않는 고정된 물체 (바닥, 벽 등)
- **`KINEMATIC`**: 코드에 의해서만 움직이며 다른 물체에 힘을 전달하는 물체

### PHYSICS_SHAPE
충돌 영역의 형태를 정의합니다.

- **`BOX`**, **`SPHERE`**, **`CAPSULE`**, **`CYLINDER`**, **`CONE`**, **`PLANE`** 등

## 4. 라이브 예제

RedGPU가 제공하는 다양한 물리 엔진 활용 사례들을 확인해 보세요.

### 4.1 기본 시뮬레이션
- **[기본 낙하 및 충돌](https://redcamel.github.io/RedGPU/examples/physics/basic/)**: 기본적인 중력과 상자 충돌을 시연합니다.
- **[다양한 기본 도형](https://redcamel.github.io/RedGPU/examples/physics/shapes/)**: 구, 캡슐, 원기둥 등 여러 형태의 충돌체를 확인합니다.
- **[키네마틱(Kinematic) 제어](https://redcamel.github.io/RedGPU/examples/physics/kinematic/)**: 코드로 직접 움직임을 제어하는 물리 바디 활용 예제입니다.

### 4.2 캐릭터 및 컨트롤러
- **[캐릭터 컨트롤러](https://redcamel.github.io/RedGPU/examples/physics/characterController/)**: 1인칭/3인칭 시점의 캐릭터 물리 이동 제어.
- **[고급 캐릭터 컨트롤러](https://redcamel.github.io/RedGPU/examples/physics/advancedCharacterController/)**: 계단 오르기, 경사면 처리 등이 포함된 정교한 컨트롤러.
- **[래그돌(Ragdoll)](https://redcamel.github.io/RedGPU/examples/physics/ragdoll/)**: 관절로 연결된 인간형 캐릭터의 물리 시뮬레이션.

### 4.3 차량 및 탈것
- **[레이캐스트 차량](https://redcamel.github.io/RedGPU/examples/physics/raycastVehicle/)**: 물리 엔진 기반의 자동차 서스펜션 및 주행 시뮬레이션.

### 4.4 관절 및 제약 조건 (Joints)
- **[기본 조인트](https://redcamel.github.io/RedGPU/examples/physics/joints/)**: 객체 간의 물리적 연결.
- **[회전 조인트 (Revolute)](https://redcamel.github.io/RedGPU/examples/physics/revoluteJoint/)**: 힌지처럼 특정 축을 기준으로 회전하는 연결.
- **[스프링 조인트 (Spring)](https://redcamel.github.io/RedGPU/examples/physics/springJoint/)**: 탄성이 있는 연결 효과.

### 4.5 고급 효과 및 최적화
- **[부력(Buoyancy)](https://redcamel.github.io/RedGPU/examples/physics/buoyancy/)**: 액체 내에서의 부력 효과.
- **[소프트 바디(Soft Body)](https://redcamel.github.io/RedGPU/examples/physics/softBody/)**: 천이나 젤리처럼 변형 가능한 물체.
- **[폭발(Explosion)](https://redcamel.github.io/RedGPU/examples/physics/explosion/)**: 충격량 전파를 통한 폭발 연출.
- **[메시 콜라이더(Mesh Collider)](https://redcamel.github.io/RedGPU/examples/physics/meshCollider/)**: 복잡한 지오메트리 형태 그대로의 충돌 영역 처리.

---

## 핵심 요약

- **RapierPhysics**를 통해 WASM 기반의 강력한 물리 연산을 지원합니다.
- `scene.physicsEngine`에 등록하면 매 프레임 시뮬레이션이 자동으로 업데이트됩니다.
- 메시 객체에 `createBody`를 호출하여 물리적 특성을 즉시 연결할 수 있습니다.
