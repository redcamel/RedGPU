---
title: Built-in Effects
order: 4
---

# 빌트인 이펙트

빌트인 이펙트 (Built-in Effects)는 3D 씬의 G-Buffer (깊이·노말 버퍼)를 활용하여 톤 매핑 이전의 HDR 단계에서 실행되는 내장 공간 광원 효과입니다. 일반 이펙트처럼 인스턴스를 직접
생성하여 `addEffect()`로 등록하는 대신, `view.builtInEffectManager`의 불리언 속성 (`useSSAO`, `useSSR`, `useDOF`, `useBloom`)으로 즉시 활성화하고
내장 인스턴스 (`ssao`, `ssr`, `dof`, `bloom`)를
통해 세부 옵션을 조절합니다.

---

## 1. SSAO (화면 공간 주변광 차폐)

`SSAO`(Screen Space Ambient Occlusion)는 깊이 (Depth)와 법선 (Normal) 버퍼를 기반으로 물체 사이의 구석진 부분이나 맞닿은 경계면에 자연스러운 차폐 음영을 생성하여 입체감을
높입니다.

```javascript
// 1. SSAO 활성화
view.builtInEffectManager.useSSAO = true;

// 2. 세부 옵션 조절
const ssao = view.builtInEffectManager.ssao;
ssao.radius = 0.25;     // 차폐 샘플링 반경 (기본값: 0.25)
ssao.intensity = 1.0;   // 음영 강도 (기본값: 1.0)
ssao.contrast = 1.5;    // 음영 대비 (기본값: 1.5)
ssao.useBlur = true;    // 노이즈 제거용 가우시안 블러 사용 여부 (기본값: true)
```

<iframe src="/RedGPU/examples/postEffect/ssao/" style="width:100%; height:500px;"></iframe>

---

## 2. SSR (화면 공간 반사)

`SSR`(Screen Space Reflection)은 화면 공간의 깊이 및 법선 정보를 따라 레이 마칭 (Ray Marching)을 수행하여 바닥이나 금속·유리 표면에 주변 물체가 실시간으로 비치는 반사 효과를
구현합니다.

- **적용 방법**: `view.builtInEffectManager.useSSR = true`를 활성화하고, 반사를 표현할 객체의 머티리얼 (`PhongMaterial`, `PBRMaterial` 등)에서
  `material.useSSR = true`를 함께 설정합니다.

```javascript
// 1. 뷰의 SSR 후처리 활성화
view.builtInEffectManager.useSSR = true;

// 2. 반사를 적용할 재질에 useSSR 활성화
material.useSSR = true;

// 3. 세부 옵션 조절
const ssr = view.builtInEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // 반사 강도 (기본값: 1.0)
ssr.maxDistance = 15.0;        // 최대 반사 추적 거리 (기본값: 15.0)
ssr.maxSteps = 64;             // 레이 마칭 스텝 수 (기본값: 64)
```

<iframe src="/RedGPU/examples/postEffect/ssr/" style="width:100%; height:500px;"></iframe>

---

## 관련 예제

- [SSAO (화면 공간 주변광 차폐)](/RedGPU/examples/postEffect/ssao/)
- [SSR (화면 공간 반사)](/RedGPU/examples/postEffect/ssr/)

---

## 다음 학습 추천

- **[안티앨리어싱](../antialiasing/index.md)**