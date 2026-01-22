---
title: Tone Mapping
order: 3
---

# 톤 매핑

**톤 매핑**(Tone Mapping) 은 HDR(High Dynamic Range) 이미지의 넓은 밝기 범위를 디스플레이 가능한 범위로 변환하는 과정입니다. RedGPU의 후처리 파이프라인에서 가장 먼저 실행되는 핵심 단계입니다.

## 1. ToneMappingManager

`ToneMappingManager` 는 각 뷰(**View3D**)에 내장되어 있습니다. 별도의 인스턴스 생성 없이 `view.toneMappingManager` 를 통해 직접 설정할 수 있습니다.

## 2. 주요 설정 항목

톤 매핑을 통해 씬의 전반적인 노출과 대비를 조절하여 원하는 시각적 분위기를 연출할 수 있습니다.

### 2.1 톤 매핑 모드 (mode)
다양한 변환 알고리즘을 지원합니다.

```javascript
// ACES Filmic 알고리즘 적용 (영화 같은 색감)
view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

### 2.2 노출과 대비 (exposure, contrast)
이미지의 밝기와 명암 대비를 조절합니다.

```javascript
// 노출 및 대비 설정
view.toneMappingManager.exposure = 1.2;
view.toneMappingManager.contrast = 1.1;
```

## 3. 사용 예시

```javascript
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

// 톤 매핑 설정
const tm = view.toneMappingManager;
tm.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;
tm.exposure = 1.0;
tm.contrast = 1.0;
```

## 핵심 요약
- **톤 매핑** 은 후처리 파이프라인의 **첫 번째 단계**입니다.
- `View3D` 에 내장되어 있어 즉시 사용 가능합니다.
- 전체적인 노출과 색감을 결정하는 데 매우 중요한 역할을 합니다.

## 다음 학습 추천
- **[빌트인 이펙트](./builtin-effects.md)**
- **[일반 이펙트 추가](./custom-effects.md)**
