---
title: Tone Mapping
order: 3
---

# 톤 매핑 (Tone Mapping)

톤 매핑은 HDR (High Dynamic Range) 이미지의 넓은 밝기 범위를 표준 디바이스 (LDR)에서 표현 가능한 범위로 자연스럽게 변환하는 필수적인 후처리 기법입니다. 씬의 전체적인 노출, 대비, 색감을
최종
조율하여 렌더링 결과물의 완성도를 결정합니다.

## 1. ToneMappingManager 설정

모든 톤 매핑 관련 매개변수는 `view.toneMappingManager` 속성을 통해 동적으로 조절할 수 있습니다. `View3D` 인스턴스 생성 시 내장되므로 직접 생성할 필요가 없습니다.

| 속성명           | 기본값                | 범위           | 설명                                                           |
|:-----------------|:----------------------|:---------------|:---------------------------------------------------------------|
| **`mode`**       | `KHRONOS_PBR_NEUTRAL` | -              | 톤 매핑 알고리즘 유형 (`RedGPU.ToneMapping.TONE_MAPPING_MODE`) |
| **`contrast`**   | `1.0`                 | `0.0` ~ `2.0`  | 명암 대비 강도                                                 |
| **`brightness`** | `0.0`                 | `-1.0` ~ `1.0` | 암부 및 명부의 부가적인 밝기 보정                              |

```javascript
// 대비와 밝기를 미세하게 조정하여 시각 효과 강조
const tm = view.toneMappingManager;
tm.contrast = 1.05;
tm.brightness = 0.02;
```

---

## 2. 지원 알고리즘 (TONE_MAPPING_MODE)

원하는 비주얼 스타일에 따라 톤 매핑 모드를 실시간으로 변경할 수 있습니다. 상수값은 `RedGPU.ToneMapping.TONE_MAPPING_MODE`에 정의되어 있습니다.

```javascript
// ACES Filmic 알고리즘을 적용해 영화 같은 연출 적용
view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

| 모드 상수                   | 설명                                                                                                   | 비교 이미지                             |
|:----------------------------|:-------------------------------------------------------------------------------------------------------|:----------------------------------------|
| **`LINEAR`**                | 아무런 보정을 거치지 않고 디바이스 범위로 출력합니다. 암부와 밝은 영역의 디테일 손실이 클 수 있습니다. | ![Linear](/toneMapping/linear.jpg)      |
| **`KHRONOS_PBR_NEUTRAL`**   | 물리 기반 렌더링(PBR)의 색상 충실도를 유지하는 표준 알고리즘 (기본값)                                  | ![Khronos](/toneMapping/khronos.jpg)    |
| **`ACES_FILMIC_HILL`**      | 시네마틱 영화 산업 표준인 ACES 알고리즘의 Hill 근사 버전으로 높은 대비를 만듭니다.                     | ![ACES Hill](/toneMapping/acesHill.jpg) |
| **`ACES_FILMIC_NARKOWICZ`** | ACES 알고리즘의 Narkowicz 수학적 근사 버전으로 더욱 드라마틱한 대비를 만듭니다.                        | ![ACES Nark](/toneMapping/acesNark.jpg) |

> [!TIP]
> **실시간 테스트 안내**: RedGPU의 모든 예제 화면 UI에 위치한 **`TONE MAPPING`** 드롭다운 메뉴를 통해 현재 실행 중인 씬에서 4가지 톤 매핑 모드를 즉시 전환하며 비교해 볼 수
있습니다.
>
> ![Tone Mapping Control](/toneMapping/toneMappingControl.png)

---

## 다음 학습 추천

- **[빌트인 이펙트](./builtin-effects.md)** : 물리 기반 입체감을 부여하는 SSAO 및 실시간 SSR 활성화하기
- **[일반 이펙트](./general-effects.md)** : 톤 매핑 전후 단계에 블룸, 블러, 그레이스케일 추가하기
