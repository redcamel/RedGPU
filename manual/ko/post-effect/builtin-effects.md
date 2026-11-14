---
title: Built-in Effects
order: 2
---

# 빌트인 이펙트

빌트인 이펙트(Built-in Effects)는 3D 씬의 G-Buffer(깊이·노말·모션 벡터)와 물리적 렌더링 파이프라인에 통합되어 실행되는 엔진 표준 후처리 효과입니다. 일반 이펙트처럼 인스턴스를 직접 생성하여
`addEffect()` 로 등록하는 대신, `view.builtInEffectManager` 의 활성화 속성과 내장 인스턴스를 통해 제어합니다.

---

## 1. 지원 목록 요약

| 구분            | 실행 단계 | 활성화 속성              | 내장 인스턴스         | 주요 역할                                    |
|:----------------|:----------|:-------------------------|:----------------------|:---------------------------------------------|
| **화면 공간**   | HDR       | `useSSAO`                | `ssao`                | GTAO 기반 화면 공간 주변광 차폐              |
|                 | HDR       | `useSSR`                 | `ssr`                 | 화면 공간 레이 마칭 반사                     |
| **대기**        | HDR       | `useFog`                 | `fog`                 | 3D 거리 기반 안개 감쇠                       |
|                 | HDR       | `useHeightFog`           | `heightFog`           | 고도 기반 대기 안개 감쇠                     |
| **노출 · 광학** | HDR       | `camera.useAutoExposure` | `autoExposure`        | 256-bin 히스토그램 기반 자동 노출            |
|                 | HDR       | `useDOF`                 | `dof`                 | 35mm 물리 렌즈 기반 피사계 심도              |
|                 | HDR       | `useBloom`               | `bloom`               | 5-Mip Dual-Filter HDR 빛 번짐                |
|                 | HDR       | `useLensFlare`           | `lensFlare`           | 화면 하이라이트 및 태양 광학 플레어          |
| **카메라 렌즈** | LDR       | `useChromaticAberration` | `chromaticAberration` | 가장자리 색수차 (`intensity`, `startOffset`) |
|                 | LDR       | `useLensDistortion`      | `lensDistortion`      | 배럴/핀쿠션 왜곡 (`distortion`)              |
|                 | LDR       | `useVignetting`          | `vignetting`          | 주변부 감광 (`intensity`)                    |
|                 | LDR       | `useFilmGrain`           | `filmGrain`           | 해상도 독립 필름 노이즈 (`applyPreset`)      |

---

## 2. SSAO

`SSAO` 는 깊이(Depth)와 법선(Normal) 버퍼를 기반으로 물체 사이의 구석진 부분이나 맞닿은 경계면에 자연스러운 차폐 음영을 생성하여 입체감을 높입니다.

```javascript
// 1. SSAO 활성화
view.builtInEffectManager.useSSAO = true;

// 2. 세부 옵션 조절
const ssao = view.builtInEffectManager.ssao;
ssao.radius = 0.5;      // 차폐 샘플링 반경 (기본값: 0.5)
ssao.intensity = 1.0;   // 음영 강도 (기본값: 1.0)
ssao.contrast = 1.0;    // 음영 대비 (기본값: 1.0)
ssao.useBlur = true;    // 노이즈 제거용 양방향 디노이저 사용 여부 (기본값: true)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/" style="width:100%; height:500px;"></iframe>

---

## 3. SSR

`SSR` 은 화면 공간의 깊이 및 법선 정보를 따라 레이 마칭(Ray Marching)을 수행하여 바닥이나 금속·유리 표면에 주변 물체가 실시간으로 비치는 반사 효과를 구현합니다.

- **적용 방법**: `view.builtInEffectManager.useSSR = true` 를 활성화하면 별도의 머티리얼 플래그 없이 재질의 `roughness` 와 `metallic` 값에 따라 반사가
  자동으로 반영됩니다.

```javascript
// 1. 뷰의 SSR 후처리 활성화
view.builtInEffectManager.useSSR = true;

// 2. 세부 옵션 조절
const ssr = view.builtInEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // 반사 강도 (기본값: 1.0)
ssr.maxDistance = 15.0;        // 최대 반사 추적 거리 (기본값: 15.0)
ssr.maxSteps = 64;             // 레이 마칭 스텝 수 (기본값: 64)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/screenSpace/ssr/" style="width:100%; height:500px;"></iframe>

---

## 4. 광학 · 노출 · 대기 · 렌즈 이펙트 활용 예시

```javascript
const builtIn = view.builtInEffectManager;

// HDR 광학 이펙트 및 프리셋 적용
builtIn.useDOF = true;
builtIn.dof.setCinematic();

builtIn.useBloom = true;
builtIn.bloom.setNatural();

builtIn.useLensFlare = true;
builtIn.lensFlare.setNatural();

// 자동 노출 보정 (camera.useAutoExposure가 true일 때 동작)
builtIn.autoExposure.exposureCompensation = 0.5;

// LDR 카메라 렌즈 이펙트
builtIn.useChromaticAberration = true;
builtIn.chromaticAberration.intensity = 0.3;

builtIn.useVignetting = true;
builtIn.vignetting.intensity = 0.4;
```

---

## 관련 예제

- [SSAO (화면 공간 주변광 차폐)](/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/)
- [SSR (화면 공간 반사)](/RedGPU/examples/postEffect/builtIn/screenSpace/ssr/)
- [AutoExposure (자동 노출)](/RedGPU/examples/postEffect/builtIn/lens/autoExposure/)
- [DOF (피사계 심도)](/RedGPU/examples/postEffect/builtIn/lens/dof/)
- [Bloom (HDR 블룸)](/RedGPU/examples/postEffect/builtIn/lens/bloom/)
- [LensFlare (SkyAtmosphere)](/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/)
- [Fog (거리 기반 안개)](/RedGPU/examples/postEffect/builtIn/fog/fog/)
- [HeightFog (고도 기반 안개)](/RedGPU/examples/postEffect/builtIn/fog/heightFog/)

---

## 다음 학습 추천

- **[톤 매핑](./tone-mapping.md)**
