---
title: View System
order: 3
---

<script setup>
const viewSystemArchGraph = `
    graph TD
        Context["RedGPUContext"]
        
        subgraph MainView ["View3D (메인 뷰)"]
            View1["View3D 인스턴스"]
            Camera1["Camera (메인 카메라)"]
            View1 -->|소유| Camera1
        end
        
        subgraph MiniView ["View3D (미니맵 뷰)"]
            View2["View3D 인스턴스"]
            Camera2["Camera (탑다운 카메라)"]
            View2 -->|소유| Camera2
        end
        
        Scene["Scene (3D 무대)"]
        Meshes["Mesh / Light / 환경"]
        Controller1["Controller"]
        Controller2["Controller"]
        
        Context -->|등록 및 렌더링| View1
        Context -->|등록 및 렌더링| View2
        
        View1 -->|참조| Scene
        View2 -->|공유 참조| Scene
        
        Controller1 -->|시점 제어| Camera1
        Controller2 -->|시점 제어| Camera2
        
        Scene -->|포함| Meshes

        %% 회색조 스타일 적용
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style MainView fill:#f4f4f5,stroke:#d4d4d8,color:#27272a,stroke-width:1px
        style MiniView fill:#f4f4f5,stroke:#d4d4d8,color:#27272a,stroke-width:1px
        style View1 fill:#fafafa,stroke:#d4d4d8,color:#18181b,stroke-width:1px
        style View2 fill:#fafafa,stroke:#d4d4d8,color:#18181b,stroke-width:1px
        style Camera1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Camera2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Meshes fill:#fafafa,stroke:#e4e4e7,color:#3f3f46,stroke-width:1px
`
</script>

# View System

앞서 학습한 `RedGPUContext` 가 엔진이 실행될 '환경'이라면, **View System** 은 그 환경 위에서 실제 콘텐츠가 어떻게 보여질지를 결정하는 '틀'입니다.

## 1. 아키텍처 및 역할

RedGPU의 **View System** 은 3D 공간 데이터와 카메라 시점을 결합하여 화면에 출력하는 핵심 아키텍처로서 다음과 같은 역할을 수행합니다:

- **장면 구성**: 3D 공간 내 객체와 조명의 계층적 배치 정의 (`Scene`)
- **시점 및 입력 제어**: 3D 공간을 2D 화면으로 투영하고 사용자 입력에 따라 시점 갱신 (`Camera`, `AController`)
- **화면 출력 및 환경 분리**: 뷰포트 영역 지정 및 뷰별 독립 환경·후처리 적용 (`View3D`)

<ClientOnly>
  <MermaidResponsive :definition="viewSystemArchGraph" />
</ClientOnly>

1. `RedGPUContext` 는 하나 이상의 `View3D` 를 가집니다 (예: 메인 게임 화면과 미니맵).
2. 각 `View3D` 는 무엇을 보여줄지 (`Scene`)와 어디서 볼지 (`Camera`)를 연결합니다.
3. 컨트롤러 (`OrbitController` 등)는 사용자의 입력을 받아 `Camera` 를 움직입니다.

이러한 구조 덕분에 하나의 `Scene` 을 여러 개의 `View3D` 를 통해 서로 다른 각도에서 동시에 볼 수 있습니다.

---

## 2. 핵심 구성 요소

RedGPU의 렌더링 파이프라인을 구성하는 4가지 핵심 모듈입니다.

| 모듈              | 주요 역할 및 기능                                                                                                                                            |
|:------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`View3D`**      | 화면 출력 영역(Viewport)을 지정하고, 스카이박스(`skybox`), 환경광(`ibl`), 후처리(`postEffectManager`) 및 디버깅 도구(`grid`, `axis`)를 뷰 단위로 관리합니다. |
| **`Scene`**       | 렌더링될 3D 객체들의 계층 구조(Scene Graph), 조명(`lightManager`), 그림자(`shadowManager`) 및 지형·수체를 통합 관리합니다.                                   |
| **`Camera`**      | 3D 공간을 2D 화면으로 변환하는 투영(Projection) 및 뷰(View) 행렬을 계산하고 자동 노출(`useAutoExposure`)을 관리합니다.                                       |
| **`AController`** | 마우스·터치·키보드 입력을 감지하여 카메라 트랜스폼을 실시간으로 갱신합니다 (`OrbitController`, `FreeController`, `FollowController` 등).                     |

---

## 3. 학습 로드맵

각 모듈의 상세한 사용법과 설정 방법은 다음 순서로 학습하는 것을 권장합니다.

1. **[View3D](./view3d.md)** : 화면 렌더링의 기본 단위와 뷰포트 레이아웃 설정 방법
2. **[Scene](./scene.md)** : 무대를 구성하고 객체와 조명을 관리하는 루트 컨테이너
3. **[Camera](./camera.md)** : 3D 좌표를 화면 좌표로 변환하는 시점의 이해
4. **[Camera Controller](./controller.md)** : 마우스·터치·키보드를 통한 인터랙티브한 카메라 조작

---

## 관련 예제

- [단일 뷰 (Single View)](/RedGPU/examples/3d/view/singleView/)
- [다중 뷰 (Multi View)](/RedGPU/examples/3d/view/multiView/)
- [Scene 구성](/RedGPU/examples/3d/scene/)
- [OrbitController](/RedGPU/examples/3d/controller/orbitController/)

---

## 다음 단계

먼저 View System의 가장 핵심적인 렌더링 단위인 `View3D` 의 생성 방법과 레이아웃 제어부터 살펴봅니다.

- **[View3D](./view3d.md)** : 화면 렌더링의 기본 단위와 뷰포트 레이아웃 설정
