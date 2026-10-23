---
title: View System
order: 3
---

# View System

**View System** 은 3D 씬 (`Scene`)과 카메라 (`Camera`)를 결합하여 캔버스의 지정된 영역에 화면을 출력하는 렌더링 파이프라인입니다.

---

## 1. 핵심 구성 요소

RedGPU의 렌더링 파이프라인을 구성하는 4가지 핵심 모듈입니다.

| 모듈             | 클래스 / 네임스페이스       | 주요 역할                                                                                                     |
|:-----------------|:----------------------------|:--------------------------------------------------------------------------------------------------------------|
| **`View3D`**     | `RedGPU.Display.View3D`     | 화면 출력 영역(Viewport/Scissor) 지정, 환경광(`IBL`, `SkyBox`, `SkyAtmosphere`) 및 후처리·디버깅 도구 관리    |
| **`Scene`**      | `RedGPU.Display.Scene`      | 렌더링할 3D 객체 계층 구조(Scene Graph), 조명(`LightManager`), 그림자(`ShadowManager`) 및 지형·수체 통합 관리 |
| **`Camera`**     | `RedGPU.Camera.*`           | 3D 월드 공간을 2D 화면으로 변환하는 투영(Projection) 및 뷰(View) 행렬 계산, 물리 기반 노출 제어               |
| **`Controller`** | `RedGPU.Camera.*Controller` | 마우스·터치·키보드 입력을 감지하여 카메라 시점 및 캐릭터 트랜스폼을 실시간 갱신                               |

---

## 2. 아키텍처 관계도

```mermaid
graph TD
    Context[RedGPUContext]
    
    subgraph MainView [View3D: 메인 뷰]
        View1[View3D 인스턴스]
        Camera1[Camera: 메인 카메라]
        View1 -->|소유 (view.camera)| Camera1
    end
    
    subgraph MiniView [View3D: 미니맵 뷰]
        View2[View3D 인스턴스]
        Camera2[Camera: 탑다운 카메라]
        View2 -->|소유 (view.camera)| Camera2
    end
    
    Scene[Scene: 3D 무대]
    
    Context -->|소유 & 렌더링| View1
    Context -->|소유 & 렌더링| View2
    
    View1 -->|소유/참조 (view.scene)| Scene
    View2 -->|소유/참조 (view.scene)| Scene
    
    Controller1[Controller] -->|카메라 제어| Camera1
    Controller2[Controller] -->|카메라 제어| Camera2
    
    Scene --> Meshes[Mesh 3D / Lights]

    style Context fill:#4a154b,stroke:#fff,stroke-width:2px,color:#fff
    style View1 fill:#0f4c81,stroke:#fff,stroke-width:2px,color:#fff
    style View2 fill:#0f4c81,stroke:#fff,stroke-width:2px,color:#fff
    style Scene fill:#1f6f43,stroke:#fff,stroke-width:2px,color:#fff
    style Camera1 fill:#d9534f,stroke:#fff,stroke-width:2px,color:#fff
    style Camera2 fill:#d9534f,stroke:#fff,stroke-width:2px,color:#fff
```

1. **`RedGPUContext`** 는 하나 이상의 `View3D` 를 보유하고 순서대로 렌더링합니다.
2. 각 **`View3D`** 는 렌더링할 대상 (`Scene`)과 바라볼 시점 (`Camera`)을 연결합니다.
3. 하나의 **`Scene`** 을 여러 `View3D` 가 동시에 참조하여 다중 시점 (메인 화면, 미니맵 등)으로 출력할 수 있습니다.

---

## 3. 학습 로드맵

1. **[View3D](./view3d.md)** : 화면 렌더링의 기본 단위와 뷰포트 레이아웃 설정
2. **[Scene](./scene.md)** : 3D 객체 계층 구조와 조명·환경 매니저 관리
3. **[Camera](./camera.md)** : 원근·직교 투영 방식과 물리 카메라 노출 설정
4. **[Camera Controller](./controller.md)** : 마우스·키보드 기반 카메라 및 캐릭터 조작
