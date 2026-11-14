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

## 4. AutoExposure

`AutoExposure` 는 256-bin 로그 휘도 히스토그램(Log-Luminance Histogram)을 컴퓨트 셰이더로 실시간 분석하여, 밝은 야외와 어두운 실내 사이를 이동할 때 인간의 눈이 빛에 적응하는
현상(Eye Adaptation)을 시뮬레이션합니다.

- **활성화 조건**: `camera.useAutoExposure = true` 설정 시 동작합니다 (기본값: `true`).
- **주요 속성**: `exposureCompensation` (노출 보정 EV), `minEV100` / `maxEV100` (노출 클램프 범위), `adaptationSpeedUp` /
  `adaptationSpeedDown` (명암 적응 속도), `meteringMode` (`METERING_MODE.CENTER_WEIGHTED` / `METERING_MODE.AVERAGE`).

```javascript
// 1. 카메라 자동 노출 활성화 확인
view.camera.useAutoExposure = true;

// 2. 세부 노출 파라미터 조절
const autoExposure = view.builtInEffectManager.autoExposure;
autoExposure.exposureCompensation = 0.5; // 노출 보정 바이어스 (기본값: 0.0)
autoExposure.minEV100 = -2.0;            // 최소 EV100 한계 (기본값: -2.0)
autoExposure.maxEV100 = 16.0;            // 최대 EV100 한계 (기본값: 16.0)
autoExposure.adaptationSpeedUp = 3.0;    // 밝아질 때의 적응 속도 (기본값: 3.0)
autoExposure.adaptationSpeedDown = 1.0;  // 어두워질 때의 적응 속도 (기본값: 1.0)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/lens/autoExposure/" style="width:100%; height:500px;"></iframe>

---

## 5. DOF

`DOF` 는 35mm 풀프레임 센서(`24mm`) 기하광학 Thin-Lens 공식에 기반한 피사계 심도(Depth of Field) 효과입니다. 전경·배경 Dual-Buffer 분리 개더링과 9-Point Zone
연속 자동 초점(`useAutoFocus`)을 지원하며, 7종의 카메라 렌즈 프리셋을 내장하고 있습니다.

- **내장 프리셋**: `setCinematic()` (`85mm f/1.4`), `setGameDefault()` (`65mm f/2.0`), `setPortrait()` (`85mm f/1.4`),
  `setLandscape()` (`24mm f/8.0`), `setMacro()` (`105mm f/2.0`), `setSports()` (`135mm f/2.8`), `setNightMode()`
  (`75mm f/1.2`).

```javascript
// 1. DOF 활성화 및 렌즈 프리셋 적용
view.builtInEffectManager.useDOF = true;
const dof = view.builtInEffectManager.dof;
dof.setCinematic();

// 2. 수동/자동 초점 및 광학 파라미터 조절
dof.useAutoFocus = true;     // GPU 9-Point Zone 연속 자동 초점 활성화
dof.focusDistance = 10.0;    // 수동 초점 거리 (m, useAutoFocus가 false일 때 적용)
dof.focalLength = 85.0;      // 렌즈 초점 거리 (mm)
dof.aperture = 1.4;          // 조리개 F-Stop (값이 작을수록 심도가 얕아짐)
dof.bladeCount = 8;          // 조리개 날 수 (0: 원형 보케, 5~9: 정다각형 보케)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/lens/dof/" style="width:100%; height:500px;"></iframe>

---

## 6. Bloom

`Bloom` 은 5단계 밉체인 피라미드(13-Tap Dual-Grid 다운샘플 + 9-Tap Tent 업샘플)와 Soft-Knee HDR 임계값 곡선을 통해 강렬한 광원 및 금속 스페큘러 하이라이트가 주변으로
부드럽게 번지는 빛 산란을 구현합니다.

- **내장 프리셋**: `setNatural()` (기본), `setCinematic()`, `setNeonGlow()`, `setDreamy()`, `setSubtle()`.

```javascript
// 1. Bloom 활성화 및 프리셋 적용
view.builtInEffectManager.useBloom = true;
const bloom = view.builtInEffectManager.bloom;
bloom.setNatural();

// 2. 세부 파라미터 조절
bloom.threshold = 1.0;       // 선형 HDR 휘도 임계값 (기본값: 1.0)
bloom.softKnee = 0.5;        // 임계값 전이 곡선 비율 (기본값: 0.5)
bloom.intensity = 0.675;     // 블룸 합성 강도 (기본값: 0.675)
bloom.radius = 0.65;         // 다단계 밉 확산 반경 비율 (기본값: 0.65)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/lens/bloom/" style="width:100%; height:500px;"></iframe>

---

## 7. LensFlare

`LensFlare` 는 화면 공간 HDR 하이라이트(다중 코팅 고스트, 프레넬 할로, 방사형 색수차)와 주광원(`DirectionalLight` / `SkyAtmosphere`)의 9-Tap 깊이 차폐 기반 해석적
태양 플레어(회절 스타버스트, 아나모픽 스트릭, 렌즈 먼지 산란)를 결합한 하이브리드 광학 효과입니다.

- **내장 프리셋**: `setCinematic()` (기본), `setNatural()`, `setAnamorphic()`, `setSolarMax()`, `setSubtle()`.

```javascript
// 1. LensFlare 활성화 및 프리셋 적용
view.builtInEffectManager.useLensFlare = true;
const lensFlare = view.builtInEffectManager.lensFlare;
lensFlare.setCinematic();

// 2. 세부 광학 요소 조절
lensFlare.intensity = 1.1;           // 전체 플레어 합성 강도
lensFlare.ghostCount = 8;            // 다중 반사 고스트 개수 (0 ~ 12)
lensFlare.starburstIntensity = 1.0;  // 태양 회절 스타버스트 강도
lensFlare.anamorphicIntensity = 0.0; // 수평 아나모픽 스트릭 강도
```

<iframe src="/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/" style="width:100%; height:500px;"></iframe>

---

## 8. 대기 및 카메라 렌즈 이펙트 활용 예시

```javascript
const builtIn = view.builtInEffectManager;

// HDR 대기 안개 이펙트
builtIn.useFog = true;
builtIn.fog.nearDistance = 10;
builtIn.fog.farDistance = 100;

// LDR 카메라 렌즈 이펙트
builtIn.useChromaticAberration = true;
builtIn.chromaticAberration.intensity = 0.3;

builtIn.useVignetting = true;
builtIn.vignetting.intensity = 0.4;

builtIn.useFilmGrain = true;
builtIn.filmGrain.applyPreset(RedGPU.PostEffect.BuiltIn.FILM_GRAIN_PRESET.CINEMA);
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
