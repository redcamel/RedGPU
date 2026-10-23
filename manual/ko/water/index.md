---
title: Water
order: 13
---

# 수체 시스템

RedGPU의 **물리 기반 수체**(Water) 시스템은 불투명 지오메트리 및 지형 (`Landscape`) 렌더링 완료 직후 화면 색상·깊이 버퍼를 캡처하여, 수심별 빛 감쇠 (Beer-Lambert), 굴절
(Refraction), 수중 커스틱 (Caustics), 화면 공간 반사 (**SSR**), 실시간 물결 파동 인터랙션을 수행하는 렌더링 파이프라인입니다.

---

## 주요 구성 요소

| 클래스                | 역할 및 설명                                                                                                                       |
|:----------------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| **[Lake](./lake.md)** | 수면 메쉬 지오메트리, 정점 파도 및 실시간 2D 파동 방정식 수면 인터랙션을 제어하는 호수 수체 클래스입니다.                          |
| **`LakeMaterial`**    | 수심 색상(`baseColor`, `deepColor`), 탁도, 노멀 맵, 수중 커스틱, 화면 공간 반사(SSR) 등 광학 속성을 제어하는 수체 전용 재질입니다. |

---

## 관련 예제

- [기본 호수 (Basic Lake)](/RedGPU/examples/3d/water/lake/basicLake/)
- [호수 광학 재질 (Lake Material)](/RedGPU/examples/3d/water/lake/lakeMaterial/)
- [수면 파동 인터랙션 (Water Interaction)](/RedGPU/examples/3d/water/lake/interaction/)
- [지형과 호수 통합 (Lake with Landscape)](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)

---

## 다음 단계

- **[물리 기반 호수 수체](./lake.md)** : `Lake` 와 `LakeMaterial` 을 활용한 광학 수면 재질 제어 및 실시간 파동 인터랙션 설정
