---
title: Water
order: 13
---

# 수체 시스템

<img src="/water/lake.jpg" alt="Water" style="width:100%; max-height:280px; object-fit:cover; border-radius:8px; margin-bottom:16px;" />

RedGPU는 지형 (`Landscape`) 및 일반 3D 씬과 자연스럽게 어우러지는 물리 기반 수체 (`Water`) 시스템을 제공합니다.

불투명 지오메트리 렌더링 직후 배경의 색상 및 깊이 버퍼를 캡처하는 **2-Pass 렌더링**을 통해 수심별 빛 감쇠 (Beer-Lambert), 수중 굴절 (Refraction), 커스틱 (Caustics), 화면
공간 반사 (**SSR**), 그리고 실시간 물결 파동 인터랙션을 처리합니다.

---

## 주요 구성 요소

| 구분               | 클래스                                        | 설명                                                                               |
|:-------------------|:----------------------------------------------|:-----------------------------------------------------------------------------------|
| **호수 수면 객체** | **[`Lake`](./lake.md)** (`RedGPU.Water.Lake`) | 정점 파동과 GPU 기반 2D 파동 시뮬레이션(물체 충돌 물결)을 수행하는 호수 수면 메시  |
| **광학 수체 재질** | **`LakeMaterial`**                            | `lake.material`에 자동 할당되며 수심 색상, 탁도, 굴절, 노멀 맵, 커스틱, SSR을 제어 |

---

## 관련 예제

- [기본 호수 (Basic Lake)](/RedGPU/examples/3d/water/lake/basicLake/)
- [호수 광학 재질 (Lake Material)](/RedGPU/examples/3d/water/lake/lakeMaterial/)
- [수면 파동 인터랙션 (Water Interaction)](/RedGPU/examples/3d/water/lake/interaction/)
- [캐릭터 수면 보행 파동 (Character Walking)](/RedGPU/examples/3d/water/lake/characterWalking/)
- [다중 호수 (Multi Lake)](/RedGPU/examples/3d/water/lake/multiLake/)
- [지형과 호수 통합 (Lake with Landscape)](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)

---

[다음 단계: Lake 배우기](./lake.md)
