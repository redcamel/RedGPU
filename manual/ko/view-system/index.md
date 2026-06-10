---
title: View System
order: 3
---

# View System

앞서 학습한 **RedGPUContext** 가 엔진이 실행될 '환경'이라면, **View System** 은 그 환경 위에서 실제 콘텐츠가 어떻게 보여질지를 결정하는 '틀'입니다.

RedGPU 의 **View System** 은 엔진의 핵심 아키텍처로서 다음과 같은 역할을 수행합니다.

*   **장면 구성**: 3D 공간 내 객체와 조명의 계층적 배치 정의
*   **파이프라인 제어**: 렌더링 프로세스 및 데이터 흐름 관리
*   **화면 출력**: 최종 결과물을 브라우저 화면에 표시

## 핵심 구성 요소

RedGPU의 렌더링 파이프라인을 구성하는 4가지 핵심 모듈입니다.

* **View3D** (`RedGPU.Display.View3D`)
  * **역할**: 화면 출력 영역(Viewport/Scissor) 지정
  * **기능**: 스카이박스 및 포스트 이펙트 적용, 디버깅 도구 관리
* **Scene** (`RedGPU.Display.Scene`)
  * **역할**: 렌더링될 객체의 계층 구조 관리
  * **기능**: 조명 데이터 및 씬 배경색 관리
* **Camera** (`RedGPU.Camera.*`)
  * **역할**: 3D 공간을 2D 화면으로 변환
  * **기능**: 투영(Projection) 및 뷰(View) 행렬 계산, 절두체 정보 제공
* **Controller** (`RedGPU.Camera.*Controller`)
  * **역할**: 사용자 입력 감지 및 카메라 연동
  * **기능**: 마우스/터치/키보드 입력을 통한 카메라 트랜스폼 실시간 갱신

---

## 관계 이해하기

학습을 시작하기 전, 이 요소들이 서로 어떻게 연결되는지 이해하는 것이 중요합니다.

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

1.  **RedGPUContext** 는 하나 이상의 **View3D** 를 가집니다. (예: 게임 화면과 미니맵)
2.  각 **View3D** 는 무엇을 보여줄지(**Scene**)와 어디서 볼지(**Camera**)를 연결합니다.
3.  **Controller** 는 사용자의 입력을 받아 **Camera** 를 움직입니다.

이러한 구조 덕분에 하나의 **Scene** 을 여러 개의 **View3D** 를 통해 서로 다른 각도에서 동시에 볼 수 있습니다.



---

## 학습 로드맵

각 모듈의 상세한 사용법과 설정 방법은 다음 순서로 학습하는 것을 권장합니다.

1. **[View3D](./view3d.md)** : 화면 렌더링의 기본 단위와 레이아웃 설정 방법.
2. **[Scene](./scene.md)** : 무대를 구성하고 조명을 관리하는 컨테이너.
3. **[Camera](./camera.md)** : 3D 좌표를 화면 좌표로 변환하는 시점의 이해.
4. **[Controller](./controller.md)** : 마우스와 터치를 통한 인터랙티브한 카메라 조작.
