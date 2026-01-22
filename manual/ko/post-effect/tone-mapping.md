---
title: Tone Mapping
order: 2
---

# 톤 매핑 (Tone Mapping)

톤 매핑은 HDR 이미지의 넓은 밝기 범위를 표준 모니터에서 표현 가능한 범위로 변환하는 과정입니다. 후처리 파이프라인의 **진입점(Entry Point)** 역할을 하며, 씬의 전체적인 분위기를 결정합니다.

## 1. ToneMappingManager

모든 설정은 `view.toneMappingManager`를 통해 이루어집니다. `View3D` 생성 시 자동으로 포함되므로 별도의 인스턴스 생성이 필요 없습니다.

### 기본값 (Default Settings)
RedGPU는 물리 기반 렌더링에 최적화된 **Khronos PBR Neutral**을 기본 알고리즘으로 채택하고 있습니다.

| 속성 | 기본값 | 설명 |
| :--- | :--- | :--- |
| `mode` | `KHRONOS_PBR_NEUTRAL` | 톤 매핑 알고리즘 (`RedGPU.ToneMapping.TONE_MAPPING_MODE`) |
| `exposure` | `1.0` | 노출값 (밝기 강도) |
| `contrast` | `1.0` | 명암 대비 (0.0 ~ 2.0) |
| `brightness` | `0.0` | 밝기 보정 (-1.0 ~ 1.0) |

## 2. 설정 변경하기

### 2.1 톤 매핑 모드 (mode)
원하는 시각적 스타일에 따라 알고리즘을 선택합니다. 모든 상수값은 `RedGPU.ToneMapping.TONE_MAPPING_MODE` 객체에 정의되어 있습니다.

```javascript
// 영화와 같은 강한 대비와 시네마틱한 색감 적용
view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

**사용 가능한 모드 상수 및 시각적 차이:**

| 모드 (Constant) | 설명 | 비교 이미지 |
| :--- | :--- | :--- |
| **LINEAR** | 보정 없는 선형 변환 | ![Linear](/toneMapping/linear.jpg) |
| **KHRONOS_PBR_NEUTRAL** | 물리 기반 표준 (기본값) | ![Khronos](/toneMapping/khronos.jpg) |
| **ACES_FILMIC_HILL** | 시네마틱한 대비 (Hill 버전) | ![ACES Hill](/toneMapping/acesHill.jpg) |
| **ACES_FILMIC_NARKOWICZ** | 시네마틱한 대비 (Narkowicz 버전) | ![ACES Nark](/toneMapping/acesNark.jpg) |

### 2.2 세부 속성 조절

```javascript
const tm = view.toneMappingManager;
tm.exposure = 1.2;    // 전체 노출 증가
tm.contrast = 1.05;   // 명암 대비 미세 조정
tm.brightness = 0.02; // 암부 밝기 보정
```

## 핵심 요약
- 톤 매핑은 설정(`ToneMappingManager`)과 실행(`PostEffectManager`)이 분리되어 관리됩니다.
- 후처리 파이프라인의 **가장 첫 번째 단계**에서 실행됩니다.
- 씬의 첫인상을 결정하는 노출과 대비를 제어하는 핵심 창구입니다.
