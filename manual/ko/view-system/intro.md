---
title: intro
order: 1
---

# View System

RedGPU의 뷰 시스템은 3D 장면을 구성하고 화면에 출력하는 핵심 아키텍처입니다. 단순히 하나의 화면을 그리는 것을 넘어, 여러 개의 시점이나 독립적인 장면을 유연하게 관리할 수 있는 구조를 제공합니다.

## 핵심 구성 요소

3D 월드를 화면에 렌더링하기 위해서는 다음 네 가지 요소가 유기적으로 작동해야 합니다.

| 구성 요소 | 역할 | 비유 |
| :--- | :--- | :--- |
| **View3D** | 최종 렌더링 영역 및 디버깅 설정 | 창문 (Window) |
| **Scene** | 객체와 조명이 배치되는 가상 공간 | 무대 (Stage) |
| **Camera** | 공간을 바라보는 시점과 투영 방식 | 눈 (Eyes) |
| **Controller** | 사용자 입력을 카메라 움직임으로 연결 | 조종간 (Handle) |

## 시스템 아키텍처

RedGPU는 하나의 캔버스 위에 여러 개의 **View3D**를 배치할 수 있는 멀티 뷰 시스템을 지원합니다. 각 뷰는 독립적인 **Scene**과 **Camera**를 가질 수 있으며, 이를 통해 미니맵, PIP(Picture-in-Picture), 멀티 시점 뷰어 등을 쉽게 구현할 수 있습니다.

<script setup>
const viewSystemGraph = `
    graph TD
        Context["RedGPUContext (Canvas)"]
        View["View3D (Final Output)"]
        Scene["Scene (Space)"]
        Camera["Camera (Point of View)"]
        Controller["Controller (Interaction)"]

        Context --> View
        View --> Scene
        View --> Camera
        Controller -->|Controls| Camera
        View -.->|Owner| Controller
`
</script>

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

## 학습 순서

뷰 시스템을 완벽히 이해하기 위해 다음 순서로 학습하는 것을 권장합니다.

1. **[View3D](./view3d.md)**: 화면 렌더링의 기본 단위와 레이아웃 설정 방법.
2. **[Scene](./scene.md)**: 무대를 구성하고 조명을 관리하는 컨테이너.
3. **[Camera](./camera.md)**: 3D 좌표를 화면 좌표로 변환하는 시점의 이해.
4. **[Controller](./controller.md)**: 마우스와 터치를 통한 인터랙티브한 카메라 조작.
