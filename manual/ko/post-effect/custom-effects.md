---
title: Custom Effects
order: 2
---

# 일반 이펙트 추가

대부분의 후처리 효과는 사용자가 직접 이펙트 객체를 생성한 후 `PostEffectManager` 의 `addEffect` 메서드를 통해 추가합니다.

## 1. 이펙트 추가 방법 (addEffect)

블룸(Bloom), 블러(Blur), 색상 보정(Adjustments) 등은 `addEffect` 를 사용하여 파이프라인에 등록합니다. 등록된 순서대로 후처리 체인이 구성됩니다.

```javascript
// 1. 이펙트 객체 생성
const bloom = new RedGPU.PostEffect.OldBloom(redGPUContext);

// 2. 관리자에 추가
view.postEffectManager.addEffect(bloom);
```

## 2. 주요 커스텀 이펙트 예시

### 2.1 블룸 (OldBloom)
빛이 번지는 효과를 주어 환상적인 분위기를 연출합니다.

```javascript
const bloom = new RedGPU.PostEffect.OldBloom(redGPUContext);
bloom.bloomStrength = 1.5; // 강도 조절
view.postEffectManager.addEffect(bloom);
```

### 2.2 블러 (Blur)
화면을 흐리게 만듭니다. 가우시안 블러, 방향성 블러 등 다양한 유형을 제공합니다.

```javascript
const blur = new RedGPU.PostEffect.Blur(redGPUContext);
view.postEffectManager.addEffect(blur);
```

### 2.3 색상 보정 (Adjustments)
밝기, 대비, 채도 등을 정밀하게 조정할 수 있습니다.

```javascript
const gray = new RedGPU.PostEffect.Grayscale(redGPUContext);
view.postEffectManager.addEffect(gray);
```

## 핵심 요약
- `addEffect` 를 통해 사용자가 원하는 순서대로 이펙트를 쌓을 수 있습니다.
- 각 이펙트 객체는 생성 시 `redGPUContext` 를 인자로 받습니다.

## 다음 학습 추천
- **[톤 매핑](./tone-mapping.md)**
- **[빌트인 이펙트](./builtin-effects.md)**
