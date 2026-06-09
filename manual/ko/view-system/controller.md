---
title: Camera Controller
order: 5
---

# Camera Controller

앞서 배운 **Camera** 가 '눈'이라면, **Controller** 는 그 눈을 움직이는 '조종간'입니다.
사용자 입력(마우스, 터치, 키보드)을 감지하여 카메라의 위치와 회전을 실시간으로 제어하는 **상호작용 모듈**(Interaction Module) 입니다. 이를 사용하면 복잡한 행렬 연산 없이도 직관적인 3D 내비게이션 환경을 구축할 수 있습니다.

## 1. 컨트롤러 유형

RedGPU는 다양한 인터랙션 시나리오에 대응하는 표준 컨트롤러를 제공합니다.

| 클래스명 | 조작 방식 | 주요 용도 |
| :--- | :--- | :--- |
| **`OrbitController`** | **좌클릭**: 회전<br>**휠**: 줌 | 제품 360도 뷰어, 캐릭터 관찰, 특정 대상 중심 탐색 |
| **`FollowController`** | 타겟 자동 추적 (부드러운 보간) | TPS(3인칭) 게임, 캐릭터 추적 카메라 |
| **`FreeController`** | **W,A,S,D**: 이동<br>**마우스**: 시선 회전 | FPS 게임, 건축물 내부 투어, 디버깅 |
| **`IsometricController`** | 고정된 45도 각도 유지 | 전략 시뮬레이션(RTS), 아이소메트릭 뷰 |

::: tip [카메라 인스턴스 관리]
모든 **Controller** 클래스는 내부적으로 전용 **Camera** 인스턴스를 생성하여 소유합니다.
따라서 **Controller** 를 생성하면 별도의 카메라를 만들 필요가 없으며, `View3D` 생성 시 카메라 인자 자리에 컨트롤러를 전달하면 자동으로 연결됩니다.
:::

## 2. 주요 API 및 설정

각 컨트롤러는 마우스나 터치 조작 시의 속도, 범위 제한, 줌 한계 등을 세밀하게 조절할 수 있는 독자적인 프로퍼티를 제공합니다. 가장 널리 사용되는 `OrbitController`의 주요 속성은 다음과 같습니다.

### OrbitController 주요 속성

* **`centerX`, `centerY`, `centerZ`** (`number`, 기본값: `0`):
  * 카메라가 공전할 기준이 되는 중심 타겟 좌표입니다.
* **`distance`** (`number`, 기본값: `15`):
  * 중심 타겟으로부터 카메라가 떨어져 있는 거리(줌 거리)입니다.
* **`minDistance`, `maxDistance`** (`number`):
  * 마우스 휠이나 핀치 줌을 통해 당기거나 밀 수 있는 최소/최대 줌 한계치입니다.
* **`pan`, `tilt`** (`number`):
  * 카메라의 수평 회전각(`pan`)과 수직 회전각(`tilt`, 틸트) 각도 값입니다.
* **`minTilt`, `maxTilt`** (`number`, 기본값: `-90` ~ `90`):
  * 카메라가 수직 방향(위/아래)으로 회전할 수 있는 최소/최대 한계 각도입니다.
* **`speedRotation`, `speedDistance`** (`number`):
  * 카메라 마우스 드래그 회전 감도 및 휠 줌 감도 속도입니다.

```javascript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);

// 중심 타겟을 Y축 위로 조금 올리고 카메라 거리를 가깝게 조정
controller.centerY = 2;
controller.distance = 10;

// 너무 가깝거나 너무 멀어지지 않도록 범위 고정
controller.minDistance = 2;
controller.maxDistance = 30;

// 수직으로 끝까지 고꾸라지지 않게 제한
controller.minTilt = -60;
controller.maxTilt = 60;
```

---

## 3. 컨트롤러 샘플 체험하기

각 컨트롤러의 실제 동작을 아래 미리보기를 통해 직접 체험해 보시기 바랍니다.

### OrbitController (궤도 회전)
특정 대상을 중심으로 회전하며 관찰하기에 최적화되어 있습니다.
<iframe src="/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### FreeController (자유 이동)
1인칭 시점에서 **W, A, S, D** 키와 마우스를 이용해 공간을 자유롭게 탐색합니다.
<iframe src="/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### IsometricController (쿼터뷰)
고정된 각도를 유지하여 전략 시뮬레이션이나 인포그래픽에 적합합니다.
<iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>


### FollowController (타겟 추적)
캐릭터나 움직이는 물체를 부드럽게 따라가는 시점을 제공합니다.
<iframe src="/RedGPU/examples/3d/controller/followController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

---

## 다음 단계

이제 화면을 구성하고 움직이는 방법까지 모두 익혔습니다. 하지만 지금까지 화면에 띄운 물체들은 단순한 색상만 가지고 있었습니다.

이제 **기본 객체** 섹션으로 넘어가서, 메시를 정교하게 만들고 텍스트와 이미지를 입힌 **텍스처**(Texture) 등을 통해 3D 물체를 더욱 실감 나게 표현하는 방법을 알아봅니다.

- **[기본 객체 개요](../basic-objects/)**