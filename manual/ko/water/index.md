---
title: Water
order: 13
---

# 수체 시스템

RedGPU는 오픈월드 지형 (`Landscape`) 및 일반 3D 씬과 자연스럽게 어우러지는 **물리 기반 수체**(Water) 렌더링 파이프라인을 제공합니다.

불투명 지오메트리와 대규모 지형 렌더링이 완료된 직후 화면 색상 및 깊이 버퍼를 캡처하여 수심별 빛 감쇠 (Beer-Lambert), 굴절 (Refraction), 수중 커스틱 (Caustics), 화면 공간 반사
(**SSR**), 그리고 실시간 물결 파동 인터랙션을 수행합니다.

## 주요 학습 내용

- **[Lake (호수 및 수면 시뮬레이션)](./lake.md)** : `RedGPU.Water.Lake`와 `LakeMaterial`을 활용한 광학 수면 재질 제어 및 실시간 2D 파동 방정식 수면 인터랙션

---

[다음 단계: Lake 배우기](./lake.md)
