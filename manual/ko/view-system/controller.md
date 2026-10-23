---
title: Camera Controller
order: 5
---

<script setup>
const controllerGraph = `
    graph LR
        Input["사용자 입력 (마우스 · 터치 · 키보드)"]
        Controller["Controller (Orbit / Free / Follow / Isometric)"]
        Camera["내장 Camera (뷰 · 투영 행렬 갱신)"]
        View["View3D (화면 렌더링)"]

        Input -->|이벤트 감지| Controller
        Controller -->|실시간 제어| Camera
        Controller -.->|뷰에 직접 등록| View

        %% 회색조 스타일 일괄 적용
        style Input fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Camera fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`
</script>

# Camera Controller

앞서 배운 `Camera` 가 '눈'이라면, **Controller** 는 그 눈을 움직이는 '조종간'입니다. 사용자 입력 (마우스, 터치, 키보드)을 감지하여 카메라의 위치와 회전을 실시간으로 제어하는 **상호작용
모듈**(Interaction Module)이며, 복잡한 행렬 연산 없이도 직관적인 3D 내비게이션 환경을 구축할 수 있습니다.

## 1. 아키텍처 및 역할

<ClientOnly>
  <MermaidResponsive :definition="controllerGraph" />
</ClientOnly>

RedGPU는 다양한 인터랙션 시나리오에 대응하는 4가지 표준 컨트롤러 (`AController`)를 제공합니다.

| 클래스명                  | 조작 방식                                    | 주요 용도                                         |
|:--------------------------|:---------------------------------------------|:--------------------------------------------------|
| **`OrbitController`**     | **좌클릭**: 회전 / **휠**: 줌                | 제품 360도 뷰어, 캐릭터 관찰, 특정 대상 중심 탐색 |
| **`FollowController`**    | 타겟 메시 자동 추적 (부드러운 보간)          | 3인칭(TPS) 게임, 이동 캐릭터 추적 카메라          |
| **`FreeController`**      | **W, A, S, D**: 이동 / **마우스**: 시선 회전 | 1인칭(FPS) 시점, 건축물 내부 투어, 월드 디버깅    |
| **`IsometricController`** | 고정된 쿼터뷰 각도 유지                      | 전략 시뮬레이션(RTS), 아이소메트릭 뷰             |

::: tip [카메라 인스턴스 관리]
모든 컨트롤러 클래스는 내부적으로 전용 `Camera` 인스턴스를 생성하여 소유합니다. 따라서 컨트롤러를 생성하면 별도의 카메라를 만들 필요가 없으며,
`new RedGPU.Display.View3D(redGPUContext, scene, controller)` 형태로 카메라 인자 자리에 컨트롤러를 전달하면 자동으로 연결됩니다.
:::

---

## 2. 컨트롤러 샘플 체험하기

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

## 관련 예제

- [OrbitController](/RedGPU/examples/3d/controller/orbitController/)
- [FreeController](/RedGPU/examples/3d/controller/freeController/)
- [FollowController](/RedGPU/examples/3d/controller/followController/)
- [IsometricController](/RedGPU/examples/3d/controller/isometricController/)

---

## 다음 단계

이제 화면을 구성하고 시점을 움직이는 방법까지 모두 익혔습니다. 다음 **기본 객체** 섹션에서는 지오메트리와 재질을 결합한 `Mesh`, 계층 구조 (`Group3D`), 그리고 이미지를 입히는 `Texture`
를 통해 3D 물체를 본격적으로 다루는 방법을 알아봅니다.

- **[기본 객체 개요](../basic-objects/index.md)** : `Mesh`, `Scene Graph`, `Texture` 를 통한 3D 객체 구성 방법
