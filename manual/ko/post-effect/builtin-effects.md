---
title: Built-in Effects
order: 4
---

# 빌트인 이펙트

**빌트인 이펙트**(Built-in Effects) 는 성능 최적화와 깊이 버퍼(Depth Buffer) 활용을 위해 시스템 내부에서 자동으로 관리되는 효과입니다. SSAO와 SSR이 이에 해당합니다.

## 1. 빌트인 이펙트의 특징

일반적인 이펙트와 달리 사용자가 직접 인스턴스를 생성하지 않습니다. `PostEffectManager` 의 속성(Property) 값을 변경하는 것만으로 즉시 활성화하거나 비활성화할 수 있습니다.

## 2. SSAO (Screen Space Ambient Occlusion)

**SSAO** 는 객체 사이의 구석진 부분이나 겹치는 영역에 그림자를 생성하여 입체감을 극대화하는 기술입니다.

```javascript
// SSAO 활성화
view.postEffectManager.useSSAO = true;

// 세부 설정 접근 (필요 시)
const ssao = view.postEffectManager.ssao;
ssao.radius = 0.5;
```

## 3. SSR (Screen Space Reflection)

**SSR** 은 화면상에 보이는 정보를 활용하여 실시간 반사 효과를 구현하는 기술입니다. 바닥이나 벽면에 주변 환경이 비치는 효과를 낼 때 사용합니다.

```javascript
// SSR 활성화
view.postEffectManager.useSSR = true;

// 세부 설정 접근 (필요 시)
const ssr = view.postEffectManager.ssr;
ssr.reflectionStrength = 0.8;
```

## 핵심 요약
- **빌트인 이펙트** 는 인스턴스를 직접 생성하지 않고 `useSSAO`, `useSSR` 속성으로 제어합니다.
- 시스템 내부에서 깊이 정보 등을 효율적으로 공유하여 높은 성능을 유지합니다.

## 다음 학습 추천
- **[일반 이펙트 추가](./custom-effects.md)**
- **[톤 매핑](./tone-mapping.md)**
