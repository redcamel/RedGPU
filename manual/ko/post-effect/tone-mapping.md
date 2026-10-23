---
title: Tone Mapping
order: 3
---

# 톤 매핑

**톤 매핑**(Tone Mapping) 은 HDR (High Dynamic Range) 이미지의 넓은 밝기 범위를 표준 디스플레이 (LDR) 표현 범위로 변환하고, 씬의 노출·대비·색감을 조율하는 후처리
기법입니다.

## 1. 스마트 전환 타이밍

톤 매핑은 파이프라인의 고정 위치가 아닌, `PostEffectManager` 가 HDR 연산 보존과 LDR 후처리 전환을 고려해 최적 시점에 자동 실행합니다.

- **HDR 영역 보존**: `SkyAtmosphere`, `SSAO`, `SSR` 등 깊이 정보와 넓은 색역이 필요한 효과는 톤 매핑 이전의 HDR 원본 데이터에서 계산됩니다.
- **자동 전환**: `view.postEffectManager.addEffect()` 로 등록된 일반 이펙트 루프를 순회하다가 **최초의 LDR 효과를 만나는 시점에 즉시** 톤 매핑을 수행합니다.
- **기본 처리**: 체인 내에 LDR 효과가 없으면 루프의 마지막 단계에서 톤 매핑을 적용합니다.

---

## 2. ToneMappingManager 설정

`View3D` 생성 시 기본 내장되는 `view.toneMappingManager` 를 통해 속성을 제어합니다.

| 속성명           | 기본값                | 범위         | 설명                                                           |
|:-----------------|:----------------------|:-------------|:---------------------------------------------------------------|
| **`mode`**       | `KHRONOS_PBR_NEUTRAL` | -            | 톤 매핑 알고리즘 유형 (`RedGPU.ToneMapping.TONE_MAPPING_MODE`) |
| **`contrast`**   | `1.0`                 | `0.0 ~ 2.0`  | 명암 대비 강도                                                 |
| **`brightness`** | `0.0`                 | `-1.0 ~ 1.0` | 암부 및 명부의 부가적인 밝기 보정                              |

```javascript
const tm = view.toneMappingManager;
tm.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
tm.contrast = 1.05;
tm.brightness = 0.02;
```

---

## 3. 지원 알고리즘

상수값은 `RedGPU.ToneMapping.TONE_MAPPING_MODE` 에 정의되어 있습니다. 물리적 색상 정확도가 중요하면 기본값인 `KHRONOS_PBR_NEUTRAL` 을, 시네마틱 연출에는
`ACES_FILMIC_` 계열을 권장합니다.

| 모드 상수                   | 설명                                                                                | 비교 이미지                             |
|:----------------------------|:------------------------------------------------------------------------------------|:----------------------------------------|
| **`LINEAR`**                | 보정 없이 디바이스 범위로 그대로 출력합니다. 명암 디테일 손실이 발생할 수 있습니다. | ![Linear](/toneMapping/linear.jpg)      |
| **`KHRONOS_PBR_NEUTRAL`**   | 물리 기반 렌더링(PBR)의 색상 충실도를 유지하는 표준 알고리즘 (기본값)               | ![Khronos](/toneMapping/khronos.jpg)    |
| **`ACES_FILMIC_HILL`**      | 영화 산업 표준 ACES 알고리즘의 Hill 근사 버전으로 높은 대비를 형성합니다.           | ![ACES Hill](/toneMapping/acesHill.jpg) |
| **`ACES_FILMIC_NARKOWICZ`** | ACES 알고리즘의 Narkowicz 근사 버전으로 강렬한 대비를 형성합니다.                   | ![ACES Nark](/toneMapping/acesNark.jpg) |

---

## 다음 단계

- **[빌트인 이펙트](./builtin-effects.md)** : 물리 기반 입체감을 부여하는 `SSAO` 및 실시간 `SSR` 활성화
- **[일반 이펙트](./general-effects.md)** : 톤 매핑 전후 단계에 블룸, 블러, 그레이스케일 추가
