---
title: Camera Controller
order: 5
---

# Camera Controller

**Controller** 는 마우스, 터치, 키보드 입력을 감지하여 카메라의 시점이나 3D 캐릭터의 이동·점프를 실시간으로 제어하는 상호작용 모듈입니다.

---

## 1. 컨트롤러 유형

RedGPU는 시나리오에 맞춘 4종의 카메라 컨트롤러와 3인칭 캐릭터 컨트롤러를 제공합니다.

| 클래스                          | 네임스페이스    | 조작 방식                                                 | 주요 용도                                                        |
|:--------------------------------|:----------------|:----------------------------------------------------------|:-----------------------------------------------------------------|
| **`OrbitController`**           | `RedGPU.Camera` | **좌클릭**: 회전 / **휠**: 줌                             | 제품 360도 뷰어, 캐릭터 관찰, 중심 타겟 기준 탐색                |
| **`FollowController`**          | `RedGPU.Camera` | 타겟 메시 자동 추적 (보간)                                | 3인칭(TPS) 카메라, 이동 객체 추적                                |
| **`FreeController`**            | `RedGPU.Camera` | **W, A, S, D**: 이동 / **마우스**: 회전                   | 1인칭(FPS) 시점, 건축물 내부 투어, 오픈월드 디버깅               |
| **`IsometricController`**       | `RedGPU.Camera` | 고정된 쿼터뷰 각도 유지                                   | 전략 시뮬레이션(RTS), 아이소메트릭 뷰                            |
| **`SimpleCharacterController`** | `RedGPU.Camera` | **W, A, S, D**: 이동 / **Space**: 점프 / **마우스**: 회전 | 3인칭 캐릭터 보행, 점프·중력 물리 및 지형(`Landscape`) 고도 안착 |

> [!TIP]
> 모든 컨트롤러 클래스는 내부적으로 전용 `Camera` 인스턴스를 생성하여 보유합니다. 별도의 카메라를 만들 필요 없이
`new RedGPU.Display.View3D(redGPUContext, scene, controller)` 형태로 카메라 인자 자리에 컨트롤러를 직접 전달하면 됩니다.

---

## 2. OrbitController 주요 설정

가장 널리 사용되는 `OrbitController` 의 주요 제어 속성입니다.

| 속성명                                | 기본값        | 설명                                               |
|:--------------------------------------|:--------------|:---------------------------------------------------|
| **`centerX`, `centerY`, `centerZ`**   | `0`           | 카메라가 공전할 중심 타겟 월드 좌표                |
| **`distance`**                        | `15`          | 중심 타겟으로부터 카메라가 떨어진 줌 거리          |
| **`minDistance` / `maxDistance`**     | `1` / `10000` | 마우스 휠·핀치 줌의 최소/최대 거리 한계            |
| **`pan` / `tilt`**                    | `0` / `-35`   | 카메라의 수평 회전각(`pan`) 및 수직 회전각(`tilt`) |
| **`minTilt` / `maxTilt`**             | `-90` / `90`  | 수직 회전 최소/최대 제한 각도                      |
| **`speedRotation` / `speedDistance`** | `3` / `2`     | 드래그 회전 감도 및 휠 줌 감도 계수                |

```javascript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);

controller.centerY = 2;
controller.distance = 10;
controller.minDistance = 2;
controller.maxDistance = 30;
controller.minTilt = -60;
controller.maxTilt = 60;
```

---

## 3. 3인칭 캐릭터 컨트롤러와 지형 안착

`RedGPU.Camera.SimpleCharacterController` 는 타겟 메시 (`targetMesh`)에 키보드 이동, 점프·중력 물리, 그리고 3인칭 궤도 카메라 추적을 결합합니다.
`update(dt, getGroundHeight)` 호출 시 `landscape.getHeightAt(x, z)` 콜백을 전달하면 굴곡진 오픈월드 지형 표면을 따라 자연스럽게 걷고 점프합니다.

| 속성 / 메서드                     | 기본값          | 설명                                                                                  |
|:----------------------------------|:----------------|:--------------------------------------------------------------------------------------|
| **`moveSpeed`**                   | `8.0`           | 캐릭터 기본 이동 속도 (초당 월드 단위)                                                |
| **`jumpForce` / `gravity`**       | `8.5` / `-24.0` | 점프(`Space`) 초기 수직 속도 및 중력 가속도                                           |
| **`distance` / `heightOffset`**   | `6.0` / `1.5`   | 캐릭터로부터의 카메라 거리 및 시선 높이 오프셋                                        |
| **`groundHeight`**                | `0.0`           | 지형 콜백이 없을 때 사용할 기본 바닥 Y 높이                                           |
| **`isMoving` / `isGrounded`**     | 읽기 전용       | 현재 캐릭터의 이동 중 여부 및 지면 착지 상태 (애니메이션 전환에 활용)                 |
| **`update(dt, getGroundHeight)`** | `Method`        | 매 프레임 캐릭터 이동, 중력, 카메라 시점 및 지형 고도(`(x, z) => number`) 동기화 수행 |

```javascript
// 1. 캐릭터 메시를 타겟으로 하는 SimpleCharacterController 생성 및 View3D 연결
const charController = new RedGPU.Camera.SimpleCharacterController(redGPUContext, characterMesh);
charController.moveSpeed = 10;
charController.distance = 8;
charController.heightOffset = 1.8;

const view = new RedGPU.Display.View3D(redGPUContext, scene, charController);
redGPUContext.addView(view);

// 2. 렌더링 루프에서 매 프레임 이동 및 지형(Landscape) 고도 동기화
let lastTime = performance.now();
renderer.start(redGPUContext, (time) => {
    const dt = (time - lastTime) * 0.001;
    lastTime = time;

    charController.update(dt, (x, z) => landscape.getHeightAt(x, z));
});
```

---

## 4. 컨트롤러 샘플 체험하기

### OrbitController
특정 대상을 중심으로 회전하며 관찰하기에 최적화되어 있습니다.
<iframe src="/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### FreeController
1인칭 시점에서 **W, A, S, D** 키와 마우스를 이용해 공간을 자유롭게 탐색합니다.
<iframe src="/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### IsometricController
고정된 각도를 유지하여 전략 시뮬레이션이나 인포그래픽에 적합합니다.
<iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### FollowController
캐릭터나 움직이는 물체를 부드럽게 따라가는 시점을 제공합니다.
<iframe src="/RedGPU/examples/3d/controller/followController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

---

## 관련 예제

- [OrbitController](/RedGPU/examples/3d/controller/orbitController/)
- [FreeController](/RedGPU/examples/3d/controller/freeController/)
- [FollowController](/RedGPU/examples/3d/controller/followController/)
- [IsometricController](/RedGPU/examples/3d/controller/isometricController/)

---

## 다음 단계

- **[기본 객체 개요](../basic-objects/index.md)** : `Mesh`, `Scene Graph`, `Texture` 를 통한 3D 객체 구성 방법
