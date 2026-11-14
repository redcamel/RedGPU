---
title: General Effects
order: 4
---

# 일반 이펙트

가우시안 블러, 색조 보정, 샤픈, 컨볼루션 등 `RedGPU.PostEffect` 네임스페이스가 제공하는 사용자 커스텀 LDR 후처리 효과들을 관리합니다.

## 1. 사용 방법

이펙트 인스턴스를 생성한 후 `view.postEffectManager.addEffect()` 를 통해 등록합니다. 여러 개의 이펙트를 추가하면 등록된 순서대로 파이프라인 체인이 형성됩니다.

```javascript
// 1. 이펙트 생성 및 추가
const gaussianBlur = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
view.postEffectManager.addEffect(gaussianBlur);

// 2. 특정 이펙트 제거 또는 전체 초기화
view.postEffectManager.removeEffect(gaussianBlur);
view.postEffectManager.removeAllEffect();
```

## 2. 주요 이펙트 예시

### 2.1 가우시안 블러

화면을 부드럽게 흐리게 처리하는 가장 대표적인 블러 효과입니다.

<iframe src="/RedGPU/examples/postEffect/blur/gaussianBlur/" style="width:100%; height:500px;"></iframe>

### 2.2 그레이스케일

화면의 채도를 제거하여 흑백 이미지로 변환합니다.

<iframe src="/RedGPU/examples/postEffect/adjustments/grayscale/" style="width:100%; height:500px;"></iframe>

## 3. 전체 지원 목록

모든 일반 이펙트는 `RedGPU.PostEffect` 네임스페이스 하위에 위치합니다.

| 카테고리             | 클래스 명              | 설명                                           |
|:---------------------|:-----------------------|:-----------------------------------------------|
| **Blur**             | `Blur`, `GaussianBlur` | 가우시안 블러 (가장 일반적인 흐림 효과)        |
|                      | `BlurX`, `BlurY`       | 단방향(가로/세로) 블러                         |
|                      | `DirectionalBlur`      | 지정된 각도 방향으로 흐려지는 효과             |
|                      | `RadialBlur`           | 중심에서 바깥쪽으로 원형으로 흐려지는 효과     |
|                      | `ZoomBlur`             | 중심에서 바깥쪽으로 확대되며 흐려지는 효과     |
| **Adjustments**      | `BrightnessContrast`   | 밝기와 대비 조절                               |
|                      | `HueSaturation`        | 색조와 채도 조절                               |
|                      | `ColorBalance`         | 색상 균형(미드톤, 쉐도우, 하이라이트) 조절     |
|                      | `ColorTemperatureTint` | 색온도와 틴트 조절                             |
|                      | `Vibrance`             | 활기(채도가 낮은 부분 위주로 보정) 조절        |
|                      | `Grayscale`            | 흑백 이미지로 변환                             |
|                      | `Invert`               | 색상 반전                                      |
|                      | `Threshold`            | 임계값을 기준으로 이진화                       |
| **Visual / Utility** | `Sharpen`              | 선명도 강조                                    |
|                      | `Convolution`          | 커널 기반 필터 (Sharpen, Edge, Emboss 등 지원) |

---

## 관련 예제

- [명도·대비 (Brightness & Contrast)](/RedGPU/examples/postEffect/adjustments/brightnessContrast/)
- [가우시안 블러 (Gaussian Blur)](/RedGPU/examples/postEffect/blur/gaussianBlur/)
- [샤픈 (Sharpen)](/RedGPU/examples/postEffect/sharpen/)
- [컨볼루션 (Convolution)](/RedGPU/examples/postEffect/convolution/)

---

## 다음 학습 추천

- **[안티앨리어싱](../antialiasing/index.md)**
