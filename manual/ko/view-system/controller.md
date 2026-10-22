---
title: Camera Controller
order: 5
---

# Camera Controller

앞서 배운 **Camera** 가 '눈'이라면, **Controller** 는 그 눈이나 캐릭터를 움직이는 '조종간'입니다.
사용자 입력 (마우스, 터치, 키보드)을 감지하여 카메라의 시점이나 3D 캐릭터의 이동·점프를 실시간으로 제어하는 **상호작용 모듈**(Interaction Module) 입니다. 이를 사용하면 복잡한 행렬 연산
없이도 직관적인 3D 내비게이션 환경을 구축할 수 있습니다.

## 1. 컨트롤러 유형

RedGPU는 다양한 인터랙션 시나리오에 대응하는 표준 카메라 컨트롤러와 3D 캐릭터 이동 컨트롤러를 제공합니다.

| 클래스명                        | 네임스페이스       | 조작 방식                                               | 주요 용도                                                        |
|:--------------------------------|:-------------------|:--------------------------------------------------------|:-----------------------------------------------------------------|
| **`OrbitController`**           | `RedGPU.Camera`    | **좌클릭**: 회전 / **휠**: 줌                           | 제품 360도 뷰어, 캐릭터 관찰, 특정 대상 중심 탐색                |
| **`FollowController`**          | `RedGPU.Camera`    | 타겟 메시 자동 추적 (보간)                              | TPS(3인칭) 게임, 캐릭터 추적 카메라                              |
| **`FreeController`**            | `RedGPU.Camera`    | **W,A,S,D**: 이동 / **마우스**: 회전                    | FPS 게임, 건축물 내부 투어, 오픈월드 디버깅                      |
| **`IsometricController`**       | `RedGPU.Camera`    | 고정된 쿼터뷰 각도 유지                                 | 전략 시뮬레이션(RTS), 아이소메트릭 뷰                            |
| **`SimpleCharacterController`** | `RedGPU.Charactor` | **W,A,S,D**: 이동 / **Shift**: 달리기 / **Space**: 점프 | 3인칭 캐릭터 보행, 점프·중력 물리 및 지형(`Landscape`) 고도 안착 |

::: tip [카메라 인스턴스 관리]
`RedGPU.Camera` 소속의 카메라 컨트롤러 클래스들은 내부적으로 전용 **Camera** 인스턴스를 생성하여 소유합니다.
따라서 별도의 카메라를 만들 필요 없이 `View3D` 생성 시 카메라 인자 자리에 컨트롤러를 전달하면 자동으로 연결됩니다.
:::

## 2. OrbitController 주요 설정

가장 널리 사용되는 `OrbitController`의 주요 속성은 다음과 같습니다.

* **`centerX`, `centerY`, `centerZ`** (`number`, 기본값: `0`): 카메라가 공전할 기준이 되는 중심 타겟 좌표입니다.
* **`distance`** (`number`, 기본값: `15`): 중심 타겟으로부터 카메라가 떨어져 있는 거리 (줌 거리)입니다.
* **`minDistance`, `maxDistance`** (`number`): 마우스 휠이나 핀치 줌을 통해 당기거나 밀 수 있는 최소/최대 줌 한계치입니다.
* **`pan`, `tilt`** (`number`): 카메라의 수평 회전각 (`pan`)과 수직 회전각 (`tilt`) 각도 값입니다.
* **`minTilt`, `maxTilt`** (`number`, 기본값: `-90` ~ `90`): 카메라가 수직 방향으로 회전할 수 있는 최소/최대 한계 각도입니다.
* **`speedRotation`, `speedDistance`** (`number`): 마우스 드래그 회전 감도 및 휠 줌 감도 속도입니다.

```javascript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);

// 중심 타겟을 Y축 위로 조금 올리고 카메라 거리를 가깝게 조정
controller.centerY = 2;
controller.distance = 10;

// 너무 가깝거나 너무 멀어지지 않도록 범위 고정
controller.minDistance = 2;
controller.maxDistance = 30;

// 수직 회전 각도 제한
controller.minTilt = -60;
controller.maxTilt = 60;
```

---

## 3. 캐릭터 컨트롤러 (`SimpleCharacterController`) 및 지형 안착

`RedGPU.Charactor.SimpleCharacterController`는 3D 캐릭터 메시 (`targetMesh`)에 키보드 기반 이동, 카메라 시점 기준 회전 보간, 중력 가속도 및 점프를 부여합니다.
특히 `getFloorHeight` 콜백에 `landscape.getHeightAt(x, z)`를 연결하면 굴곡진 오픈월드 지형 표면을 따라 자연스럽게 걷고 점프하는 캐릭터를 즉시 구현할 수 있습니다.

| 옵션/속성명                       | 기본값         | 설명                                                                      |
|:----------------------------------|:---------------|:--------------------------------------------------------------------------|
| **`speed` / `runSpeed`**          | `5.0` / `10.0` | 기본 걷기 속도 및 달리기(Shift) 이동 속도                                 |
| **`rotationSpeed`**               | `8.0`          | 이동 방향으로 캐릭터가 회전할 때의 보간 속도                              |
| **`gravity` / `jumpForce`**       | `9.8` / `5.0`  | 중력 가속도 및 점프(Space) 초기 수직 속도                                 |
| **`floorHeight` / `floorOffset`** | `0.0` / `0.0`  | 기본 바닥 Y 높이 및 지면 안착 시 추가할 수직 오프셋                       |
| **`getFloorHeight`**              | `null`         | `(x, z) => number` 형태로 현재 위치의 동적 지형 고도를 반환하는 콜백 함수 |
| **`orientRotationToMovement`**    | `true`         | 이동 진행 방향으로 캐릭터 정면을 자동 회전 정렬할지 여부                  |

```javascript
// 1. 캐릭터를 추적할 FollowController 생성 및 View3D 연결
const followController = new RedGPU.Camera.FollowController(redGPUContext, characterMesh);
followController.distance = 8;
followController.height = 3;
const view = new RedGPU.Display.View3D(redGPUContext, scene, followController);

// 2. SimpleCharacterController 생성 및 지형(Landscape) 고도 동기화
const charController = new RedGPU.Charactor.SimpleCharacterController(
    redGPUContext,
    characterMesh,
    followController.camera,
    {
        speed: 5.0,
        runSpeed: 10.0,
        jumpForce: 6.0,
        gravity: 15.0,
        // 월드 (x, z) 위치의 지형 고도를 실시간 조회하여 캐릭터 발바닥 높이 동기화
        getFloorHeight: (x, z) => landscape.getHeightAt(x, z)
    }
);

// 3. 렌더링 루프에서 매 프레임 캐릭터 컨트롤러 갱신
renderer.start(redGPUContext, (time) => {
    charController.update(view, time);
});
```

---

## 4. 컨트롤러 샘플 체험하기

각 컨트롤러의 실제 동작을 아래 미리보기를 통해 직접 체험해 보시기 바랍니다.

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

## 다음 단계

이제 화면을 구성하고 움직이는 방법까지 모두 익혔습니다.
이어지는 **기본 객체** 섹션으로 넘어가서, 메시를 정교하게 만들고 **텍스처**(Texture) 등을 통해 3D 물체를 더욱 실감 나게 표현하는 방법을 알아봅니다.

- **[기본 객체 개요](../basic-objects/)**
