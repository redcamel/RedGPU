# Atmosphere Irradiance 파랑끼(Blue Bleeding) 이슈 분석 및 해결 계획

## 1. 이슈 개요
- **위치:** `src/display/skyAtmosphere/core/generator/ibl/irradiance/atmosphereIrradianceShaderCode.wgsl`
- **현상:** 생성된 Irradiance(조도) 맵의 하반구(지면, Ground) 영역에 불필요한 파란색 톤(파랑끼)이 섞여 들어가는 현상 발생. 이로 인해 지면의 난반사 조명이 부자연스럽게 푸르게 보임.

## 2. 원인 분석
문제가 발생하는 핵심 원인은 큐브맵 샘플링 시 **Mip Level(LOD)을 `5.0`으로 하드코딩**하여 몬테카를로 적분을 수행하고 있기 때문입니다.

```wgsl
// [문제의 코드]
let sampleColor = textureSampleLevel(reflectionTexture, atmosphereSampler, worldSample, 5.0).rgb;
```

1. **과도한 Bleeding 현상:** 소스인 원본 큐브맵(`reflectionTexture`)의 해상도가 256x256일 때, `LOD 5.0`은 8x8 크기에 해당하는 매우 흐릿한(Blurry) 텍스처입니다.
2. **색상 오염 (Color Leakage):** 해상도가 극단적으로 낮아지면서 상반구에 있는 밝고 강한 하늘의 파란색(Blue) 빛이, 상대적으로 어두운 하반구(지면) 영역까지 넓게 침범(Bleeding)하게 됩니다.
3. **오류 결과:** 하반구를 향하는 방향(지면 반사광)의 조도(Irradiance)를 적분할 때, 원래는 어두운 땅 색상(Albedo) 위주의 빛을 읽어야 하지만, 하드코딩된 높은 LOD로 인해 크게 번져버린 상단의 파란색 하늘 빛을 함께 샘플링하게 됩니다. 이것이 결과물에 '있으면 안 되는 파랑끼'가 나타나는 원인입니다.

## 3. 해결 계획 (수정 방향)
RedGPU의 범용 IBL 처리 코드인 `irradianceShaderCode.wgsl`에서 사용하는 **표준 IBL 기법(물리 기반 동적 LOD 계산)**을 도입하여 문제를 해결합니다.

1. **하드코딩 제거:** `5.0`으로 고정된 Mip Level 상수를 제거합니다.
2. **동적 LOD 계산 로직 추가:**
   - **텍셀 입체각(saTexel):** 소스 큐브맵의 해상도 기반으로 텍셀 하나가 차지하는 입체각을 계산합니다.
   - **샘플 입체각(saSample):** 몬테카를로 적분의 코사인 가중치 PDF(Probability Density Function)를 기반으로 해당 샘플의 입체각을 도출합니다.
   - **LOD 산출:** 위 두 값을 비교(`0.5 * log2(saSample / saTexel)`)하여 노이즈를 억제하면서도 인접 영역의 과도한 색상 번짐(Bleeding)을 방지하는 최적의 `mipLevel`을 동적으로 계산하는 코드를 추가합니다.
3. **코드 교체:** 계산된 동적 `mipLevel`을 사용하여 `textureSampleLevel`을 호출하도록 쉐이더 코드를 수정합니다.
