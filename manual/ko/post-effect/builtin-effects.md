---
title: Built-in Effects
order: 4
---

# 빌트인 이펙트

**빌트인 이펙트**(Built-in Effects) 는 G-Buffer와 깊이 버퍼 (Depth Buffer)를 직접 참조하여 시스템 내부에서 자동 관리되는 고정 단계 후처리 효과입니다. 별도의 인스턴스 생성이나
`addEffect()` 호출 없이 `view.postEffectManager` 의 불리언 속성 (`useSSAO`, `useSSR`)만으로 활성화합니다.

## 1. SSAO

**SSAO**(Screen Space Ambient Occlusion) 는 객체 사이의 구석진 부분이나 겹치는 영역에 미세한 환경 차폐 그림자를 생성하여 입체감을 높입니다.

```javascript
// 1. SSAO 활성화
view.postEffectManager.useSSAO = true;

// 2. 세부 설정
const ssao = view.postEffectManager.ssao;
ssao.radius = 0.5;      // 차폐 탐색 반경
ssao.intensity = 1.0;   // 그림자 강도
ssao.useBlur = true;    // 노이즈 제거용 블러 사용 여부
```

---

## 2. SSR

**SSR**(Screen Space Reflection) 은 화면 공간의 색상·깊이·법선 정보를 활용하여 바닥이나 벽면 등에 실시간 반사를 구현합니다.

::: warning [실험적 기능]
현재 SSR은 실험적 기능입니다. 사용 환경에 따라 노이즈나 화면 밖 영역의 반사 누락이 발생할 수 있으므로 결과물을 확인하며 적용하시기 바랍니다.
:::

```javascript
// 1. SSR 활성화
view.postEffectManager.useSSR = true;

// 2. 세부 설정
const ssr = view.postEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // 반사 강도
ssr.maxDistance = 15.0;        // 최대 반사 추적 거리
ssr.maxSteps = 64;             // 레이 마칭 계산 정밀도 (스텝 수)
```

---

## 다음 단계

- **[LOD](../lod/index.md)** : 카메라 거리에 따른 메시 정밀도 최적화
