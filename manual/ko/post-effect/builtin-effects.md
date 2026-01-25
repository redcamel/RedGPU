---
title: Built-in Effects
order: 4
---

# 빌트인 이펙트 (Built-in Effects)

빌트인 이펙트는 성능 최적화와 깊이 버퍼(Depth Buffer) 활용을 위해 시스템 내부에서 자동으로 관리되는 고성능 후처리 효과입니다.

## 1. 특징 및 사용 방법

일반 이펙트와 달리 사용자가 직접 인스턴스를 생성하거나 `addEffect()`로 추가하지 않습니다. `PostEffectManager`의 속성 값을 변경하는 것만으로 즉시 제어할 수 있습니다.

- **접근 경로**: `view.postEffectManager`
- **활성화 방식**: `useSSAO`, `useSSR` 등의 불리언(Boolean) 속성 사용

## 2. SSAO (Screen Space Ambient Occlusion)

객체 사이의 구석진 부분이나 겹치는 영역에 미세한 그림자를 생성하여 입체감을 극대화합니다.

### 활성화 및 설정
```javascript
// 1. SSAO 활성화
view.postEffectManager.useSSAO = true;

// 2. 세부 설정 (필요 시)
const ssao = view.postEffectManager.ssao;
ssao.radius = 0.5;      // 그림자 반경
ssao.intensity = 1.0;   // 그림자 강도
ssao.useBlur = true;    // 그림자 노이즈 제거를 위한 블러 사용 여부
```

## 3. SSR (Screen Space Reflection)

화면상의 정보를 활용하여 실시간 반사를 구현합니다. 바닥이나 벽면에 주변 환경이 비치는 효과를 낼 때 효과적입니다.

### 활성화 및 설정
```javascript
// 1. SSR 활성화
view.postEffectManager.useSSR = true;

// 2. 세부 설정 (필요 시)
const ssr = view.postEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // 반사 강도
ssr.maxDistance = 15.0;        // 최대 반사 추적 거리
ssr.maxSteps = 64;             // 반사 계산 정밀도 (스텝 수)
```

## 핵심 요약

- 빌트인 이펙트는 **속성 설정**만으로 활성화되는 고정 단계 효과입니다.

- 시스템 내부에서 깊이 정보를 공유하므로 직접 구현하는 것보다 성능 면에서 유리합니다.

- `useSSAO`, `useSSR` 속성을 통해 개별적으로 제어할 수 있습니다.



## 다음 학습 추천
- **[일반 이펙트](./general-effects)**
- **[톤 매핑](./tone-mapping)**
