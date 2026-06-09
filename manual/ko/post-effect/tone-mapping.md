---
title: 톤 매핑 (Tone Mapping)
order: 3
---

# 톤 매핑 (Tone Mapping)

톤 매핑은 HDR(High Dynamic Range) 이미지의 넓은 밝기 범위를 표준 디바이스(LDR)에서 표현 가능한 범위로 자연스럽게 변환하는 필수적인 후처리 기법입니다. 씬의 전체적인 노출, 대비, 색감을 최종
조율하여 렌더링 결과물의 완성도를 결정합니다.

## 1. 동작 원리: 스마트 톤 매핑 전환 (Smart Transition)

RedGPU의 톤 매핑은 단순히 파이프라인의 시작 또는 끝에 고정되어 실행되지 않습니다. 효율적인 HDR 연산과 LDR 후처리 간의 전환을 위해 `PostEffectManager`가 내부적으로 타이밍을 자동으로
제어합니다.

- **HDR 영역 보존**: 씬 렌더링 직후 `SkyAtmosphere`, `SSAO`, `SSR` 등 깊이 정보 및 광범위한 색역을 필요로 하는 효과들은 톤 매핑 이전의 **HDR 원본 데이터 상태**에서
  계산됩니다.
- **자동 전환 타이밍**: 사용자가 추가한 일반 이펙트(`view.postEffectManager.addEffect()`) 루프를 순회하다가 **최초의 LDR(Low Dynamic Range) 효과를 만나는
  시점에 즉시** 톤 매핑을 수행합니다.
- **기본 예외 처리**: 만약 일반 이펙트 체인 내에 LDR 효과가 하나도 등록되어 있지 않다면, 파이프라인 루프의 맨 마지막 단계에서 톤 매핑이 자동으로 적용됩니다.

---

## 2. ToneMappingManager 설정

모든 톤 매핑 관련 매개변수는 `view.toneMappingManager` 속성들을 통해 동적으로 조절할 수 있습니다. `View3D` 인스턴스 생성 시 내장되므로 직접 생성할 필요가 없습니다.

### 2.1 속성 정보

| 속성명              | 기본값                   | 범위             | 설명                                                    |
|:-----------------|:----------------------|:---------------|:------------------------------------------------------|
| **`mode`**       | `KHRONOS_PBR_NEUTRAL` | -              | 톤 매핑 알고리즘 유형 (`RedGPU.ToneMapping.TONE_MAPPING_MODE`) |
| **`contrast`**   | `1.0`                 | `0.0` ~ `2.0`  | 명암 대비 강도                                              |
| **`brightness`** | `0.0`                 | `-1.0` ~ `1.0` | 암부 및 명부의 부가적인 밝기 보정                                   |

```javascript
// 대비와 밝기를 미세하게 조정하여 시각 효과 강조
const tm = view.toneMappingManager;
tm.contrast = 1.05;
tm.brightness = 0.02;
```

---

## 3. 지원 알고리즘 (TONE_MAPPING_MODE)

원하는 비주얼 스타일에 따라 톤 매핑 모드를 실시간으로 변경할 수 있습니다. 상수값은 `RedGPU.ToneMapping.TONE_MAPPING_MODE` 네임스페이스 하위에 선언되어 있습니다.

```javascript
// ACES Filmic 알고리즘을 적용해 영화 같은 연출 적용
view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

| 모드 상수                       | 설명                                                          | 비교 이미지                                  |
|:----------------------------|:------------------------------------------------------------|:----------------------------------------|
| **`LINEAR`**                | 아무런 보정을 거치지 않고 디바이스 범위로 출력합니다. 암부와 밝은 영역의 디테일 손실이 클 수 있습니다. | ![Linear](/toneMapping/linear.jpg)      |
| **`KHRONOS_PBR_NEUTRAL`**   | 물리 기반 렌더링(PBR)의 색상 충실도를 유지하는 표준 알고리즘 (기본값)                  | ![Khronos](/toneMapping/khronos.jpg)    |
| **`ACES_FILMIC_HILL`**      | 시네마틱 영화 산업 표준인 ACES 알고리즘의 Hill 근사 버전으로 높은 대비를 만듭니다.         | ![ACES Hill](/toneMapping/acesHill.jpg) |
| **`ACES_FILMIC_NARKOWICZ`** | ACES 알고리즘의 Narkowicz 수학적 근사 버전으로 더욱 드라마틱한 대비를 만듭니다.         | ![ACES Nark](/toneMapping/acesNark.jpg) |

---

## 4. 핵심 요약

- 톤 매핑 설정은 `ToneMappingManager`가 담당하고, 실행 및 순서 전환은 `PostEffectManager`가 자동으로 최적화하여 처리합니다.
- 고품질 HDR 효과(SSAO, SSR) 연산 보존을 위해 이펙트 체인 진행 도중 스마트하게 분기하여 작동합니다.
- 물리적 정확도가 최우선인 씬에는 기본값인 `KHRONOS_PBR_NEUTRAL`을, 연출 중심의 씬에는 `ACES_FILMIC_` 계열을 권장합니다.

## 5. 다음 학습 추천

- **[빌트인 이펙트](./builtin-effects.md)** : 물리 기반 입체감을 부여하는 SSAO 및 실시간 SSR 활성화하기
- **[일반 이펙트](./general-effects.md)** : 톤 매핑 전후 단계에 블룸, 블러, 그레이스케일 추가하기