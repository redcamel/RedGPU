# [Infrastructure] Shader Common Library Master (Consolidation & Roadmap)

## 1. 개요 (Overview)
RedGPU 엔진의 WGSL 셰이더 코드 전반에 산재한 공통 함수들을 단일 라이브러리로 통합하고, 이를 체계적으로 관리하기 위한 `SystemCodeManager` 인프라 구축 및 향후 고도화 로드맵을 통합 관리합니다.

---

## 📝 1단계: 통합 및 표준화 상세 현황 (Current Status)

### 1.1 Color Chunks (색상 변환 및 처리)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 / 비고 |
| :--- | :--- | :---: | :--- |
| **Rec. 709 Luminance** | `color.get_luminance` | ✅ 완료 | **[VFX 표준]** FXAA, TAA, FilmGrain의 인지적 밝기 분석용. HDTV 표준 가중치(0.2126, 0.7152, 0.0722) 적용. |
| **YCoCg Transform** | `color.rgb_to_ycocg` / `ycocg_to_rgb` | ✅ 완료 | **[AA 표준]** TAA의 이력 압축 및 Bloom의 휘도 추출용. RGB 대비 색상 채널 분리가 우수하여 아티팩트 감소. |
| **sRGB Transform** | `color.linear_to_srgb_vec3/4` | ✅ 완료 | **[출력 표준]** 모든 Post-process 최종 단계에서 감마 보정(Gamma 2.2) 수행. 최종 Canvas 출력 필수 규격. |
| **Linear Transform** | `color.srgb_to_linear_vec3/4` | ✅ 완료 | **[입력 보정]** 비-sRGB 텍스처나 수치 입력값을 조명 연산을 위한 선형 공간으로 변환. 물리 기반 렌더링 필수 전처리. |

#### 📂 상세 적용 이력 (Color)
- `src/antialiasing/fxaa/wgsl/fxaa.wgsl`: `color.get_luminance` 적용.
- `src/antialiasing/taa/wgsl/computeCode.wgsl`: `color.rgb_to_ycocg`, `color.ycocg_to_rgb` 적용.
- `src/postEffect/effects/adjustments/vibrance/wgsl/fragment.wgsl`: `color.get_luminance` 적용.
- `src/postEffect/effects/bloom/oldBloom/wgsl/fragment.wgsl`: `color.rgb_to_ycocg`, `color.ycocg_to_rgb` 적용.
- `src/toneMapping/shader/fragment.wgsl`: `color.linear_to_srgb_vec3` 적용.
- `src/material/pbrMaterial/fragment.wgsl`: `color.linear_to_srgb_vec3/4` (Color Space 보정).
- `src/material/colorMaterial/fragment.wgsl`: `color.linear_to_srgb_vec4` 적용.
- `src/systemCodeManager/shader/color/linear_to_srgb_vec4.wgsl`: `color.linear_to_srgb_vec3` 재귀 인클루드.
- `src/systemCodeManager/shader/color/srgb_to_linear_vec4.wgsl`: `color.srgb_to_linear_vec3` 재귀 인클루드.

---

### 1.2 Math & Random Chunks (해시 및 고속 노이즈)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 / 비고 |
| :--- | :--- | :---: | :--- |
| **Stable Hash (Grid)** | `math.hash.getHashXX` | ✅ 완료 | **[절차적 생성]** 정수 변환 기반의 안정적인 해시. GPU 아키텍처에 관계없이 동일한 격자 패턴 보장. |
| **Bitcast Hash (Bit)** | `math.hash.getBitHashXX` | ✅ 완료 | **[고정밀 난수]** IEEE 754 비트 레벨 조작 해시. 극소량의 변화에도 민감한 난수가 필요한 고품질 노이즈용. |
| **Dither Noise** | `math.getInterleavedGradientNoise` | ✅ 완료 | **[성능 특화]** Jorge Jimenez 알고리즘. SSAO, SSR의 샘플링 노이즈 및 밴딩 제거를 위한 초고속 디더링 구현. |

#### 📂 상세 적용 이력 (Math & Random)
- `src/postEffect/effects/filmGrain/wgsl/fragment.wgsl`: `math.hash.getBitHash1D` 적용.
- `src/postEffect/effects/skyAtmosphere/wgsl/computeCode.wgsl`: `math.hash.getHash1D_vec2` 적용.
- `src/postEffect/effects/blur/zoomBlur/wgsl/fragment.wgsl`: `math.getInterleavedGradientNoise` 적용.
- `src/display/paticle/shader/compute.wgsl`: `math.hash` 관련 함수 전역 적용.
- `src/postEffect/effects/ssao/ssao_ao/wgsl/computeCode.wgsl`: `math.getInterleavedGradientNoise` 적용.

---

### 1.3 Math Constants & Utils (수학적 상수 및 범용 유틸리티)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 / 비고 |
| :--- | :--- | :---: | :--- |
| **Common Constants** | `math.PI/PI2/INV_PI/...` | ✅ 완료 | **[수치 일관성]** 7종 핵심 상수 전역 통합. 파일별로 다른 PI 정의로 인한 미세한 렌더링 오차 원천 차단. |
| **Safe Math** | `math.safeDivision` | ⏳ 대기 | **[안정성 강화]** 0으로 나누기 방지. 분모가 0에 근접할 때 EPSILON으로 보정하여 나노(NaN) 에러 방지. |
| **UV Transform** | `math.transform_uv` | **Low** | **[좌표 표준화]** Offset, Scale, Rotation 통합 변환. Scale -> Rotate -> Offset 순서의 엔진 표준 연산 순서 강제. |

#### 📂 상세 적용 이력 (Math Constants)
- `src/material/pbrMaterial/fragment.wgsl`: `math.PI`, `math.PI2`, `math.INV_PI` 적용.
- `src/material/phongMaterial/fragment.wgsl`: `math.PI`, `math.EPSILON` 적용.
- `src/postEffect/effects/skyAtmosphere/core/skyAtmosphereFn.wgsl`: `math.PI`, `math.PI2` 적용.
- `src/resources/texture/ibl/core/brdf/brdfShaderCode.wgsl`: `math.PI`, `math.PI2` 적용.
- `src/display/paticle/shader/compute.wgsl`: `math.PI`, `math.EPSILON` 적용.
- `src/systemCodeManager/shader/depth/linearizeDepth.wgsl`: `math.EPSILON` 재귀 인클루드.

---

### 1.4 Vector & Direction (방향 벡터 및 반사)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 / 비고 |
| :--- | :--- | :---: | :--- |
| **View Direction** | `math.direction.getViewDirection` | ✅ 완료 | **[시선 벡터]** 카메라와 픽셀 위치를 기반으로 한 정규화된 시선 벡터 계산. PBR 및 Phong 조명 필수 요소. |
| **Ray Direction** | `math.direction.getRayDirection` | ✅ 완료 | **[광선 추적]** Raymarching 등을 위한 카메라 기준 픽셀 투사 벡터 계산. HeightFog 등 볼륨 효과에 사용. |
| **Reflection Vec** | `math.direction.getReflectionVectorFromViewDirection` | ✅ 완료 | **[반사 벡터]** 시선 벡터와 법선 벡터를 기반으로 환경 맵 샘플링을 위한 반사 벡터 계산. |

#### 📂 상세 적용 이력 (Vector)
- `src/material/pbrMaterial/fragment.wgsl`: `getViewDirection`, `getReflectionVectorFromViewDirection` 적용.
- `src/material/phongMaterial/fragment.wgsl`: `getViewDirection` 적용.
- `src/postEffect/effects/fog/heightFog/wgsl/uniformStructCode.wgsl`: `getRayDirection` 적용.

---

### 1.5 Depth & Reconstruction (깊이 및 공간 복구)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 / 비고 |
| :--- | :--- | :---: | :--- |
| **Linear Depth** | `depth.linearizeDepth` | ✅ 완료 | **[공간 분석]** WebGPU의 비선형 Clip Depth(0~1)를 선형 거리로 변환. SSAO, SSR, Fog 계산의 정밀도 핵심. |
| **Get NDC** | `math.reconstruct.getNDCFromDepth` | ✅ 완료 | **[좌표 변환]** 스크린 UV와 Depth를 조합하여 NDC 공간 좌표 복구. 모든 후처리 공간 변환의 기초 데이터 생성. |
| **Position Rec.** | `math.reconstruct.getXXXPositionFromDepth` | ✅ 완료 | **[역투영 표준]** NDC -> World/View 공간 복구. 픽셀 미분 없이 깊이값만으로 정확한 3D 위치 추적. |
| **Normal Rec.** | `math.reconstruct.getXXXNormalFromGNormalBuffer` | ✅ 완료 | **[G-Buffer 복구]** GBuffer RGB(0.5 bias) 데이터를 정규화된 월드/뷰 법선 벡터로 변환. |

#### 📂 상세 적용 이력 (Depth & Reconstruction)
- `src/resources/systemCode/shader/SYSTEM_UNIFORM.wgsl`: `depth.linearizeDepth` 적용.
- `src/postEffect/effects/ssr/wgsl/uniformStructCode.wgsl`: `depth.linearizeDepth`, `math.reconstruct.getViewPositionFromDepth` 적용.
- `src/postEffect/effects/ssao/ssao_ao/wgsl/computeCode.wgsl`: `math.reconstruct.getViewPositionFromDepth` 적용.
- `src/postEffect/effects/fog/heightFog/wgsl/uniformStructCode.wgsl`: `depth.linearizeDepth`, `math.reconstruct.getWorldPositionFromDepth` 적용.
- `src/resources/texture/ibl/core/utils/equirectangularToCubeShaderCode.wgsl`: `math.reconstruct.getNDCFromDepth` 적용.
- `src/postEffect/effects/ssr/wgsl/computeCode.wgsl`: `math.reconstruct.getWorldNormalFromGNormalBuffer` 적용.
- `src/postEffect/effects/ssao/ssao_ao/wgsl/computeCode.wgsl`: `math.reconstruct.getViewNormalFromGNormalBuffer` 적용.

---

### 1.6 Basis & Shadow (좌표계 기저 및 그림자)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 / 비고 |
| :--- | :--- | :---: | :--- |
| **TBN Basis** | `math.tnb.getTBNXXX` | ✅ 완료 | **[기저 표준]** Gram-Schmidt 및 Cotangent 기반 탄젠트 공간 구축. glTF 표준 및 미러링 대응 규격. |
| **Normal Decode** | `math.tnb.getNormalFromNormalMap` | ✅ 완료 | **[맵핑 표준]** Z-Reconstruction 공식을 포함한 법선 복구. 텍스처 압축 손실을 수학적으로 보정하여 품질 향상. |
| **Shadow Coord** | `math.getShadowCoord` | ✅ 완료 | **[그림자 변환]** 월드 좌표를 그림자 샘플링용 [0, 1] 범위로 변환. 엔진 전역 명칭 통일 (`shadowPos` -> `shadowCoord`). |
| **Shadow Visibility**| `math.getDirectionalShadowVisibility` | ✅ 완료 | **[가시성 표준]** 3x3 PCF 필터링 포함. 레거시 위치(`fragment/`)에서 수학 라이브러리(`math/`)로 이동 완료. |
| **Shadow Depth Pos**| `math.getShadowClipPosition`| ⏳ 대기 | **[그림자 투영]** Shadow Pass 전용. World -> LightClipSpace 변환 규격화 및 셰이더 레벨 Depth Bias 기반 마련. |

#### 📂 상세 적용 이력 (Basis & Shadow)
- `src/systemCodeManager/shader/math/getShadowCoord.wgsl`: 표준 함수 구현 및 내부 명칭(`shadowCoordNDC`) 통일.
- `src/systemCodeManager/shader/math/getDirectionalShadowVisibility.wgsl`: 현대화 및 표준 주석 보강.
- **[버텍스 셰이더 적용]**: `meshVertex.wgsl`, `meshVertexPbr.wgsl`, `meshVertexPbrSkin.wgsl`, `particleVertex.wgsl`, `spriteSheet2DVertex.wgsl`, `spriteSheet3DVertex.wgsl`, `sprite3DVertex.wgsl`, `textField2DVertex.wgsl`, `textField3DVertex.wgsl` 적용 완료.
- **[구조체 필드명 통일]**: `meshVertex_output.wgsl`, `meshVertexPbr_output.wgsl`, `instanceMeshVertex_output_basic.wgsl`, `instanceMeshVertex_output_Pbr.wgsl` 등 모든 출력 구조체 `shadowCoord`로 통일.
- **[프래그먼트 셰이더 적용]**: `pbrMaterial`, `phongMaterial`, `bitmapMaterial`, `textFieldMaterial` 내 `InputData` 필드명 및 호출부 통일 완료.
- `src/material/pbrMaterial/fragment.wgsl`: `math.tnb` 관련 함수 전역 적용.
- `src/resources/texture/ibl/core/`: `prefilter`, `brdf`, `irradiance` 내 `math.tnb.getTBN` 통합 완료.

---

### 1.7 Lighting & BRDF (물리 기반 조명 및 레이어 결합)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 / 비고 |
| :--- | :--- | :---: | :--- |
| **Disney Diffuse** | `lighting.diffuse_brdf_disney` | ✅ 완료 | **[반사 모델]** 거칠기(Roughness)를 고려한 확산광 모델. 레트로-리플렉션 효과를 포함하여 물리적 사실감 극대화. |
| **PBR Specular** | `lighting.specular_brdf` | ✅ 완료 | **[반사 모델]** Cook-Torrance 모델. GGX 분포와 Smith 기하 차폐를 결합한 고정밀 반사광 계산. |
| **BTDF Utils** | `lighting.specular_btdf` / `diffuse` | ✅ 완료 | **[투과 모델]** Transmission 확장을 위한 굴절(Refraction) 및 확산 투과 계산식 모듈화. |
| **Fresnel Utils** | `lighting.fresnel_xxx` | ✅ 완료 | **[프레넬 표준]** Schlick 근사, Conductor(금속), Iridescent(박막 간섭) 등 재질별 광학 반사 특성 분리 구현. |
| **Fresnel Mix/Coat** | `lighting.fresnel_mix` / `coat` | ✅ 완료 | **[레이어 결합]** Clearcoat 및 다중 레이어 합성용. 에너지 보존 법칙에 따라 하위 레이어의 빛 감쇄량을 정확히 계산. |

#### 📂 상세 적용 이력 (Lighting & BRDF)
- `src/material/pbrMaterial/fragment.wgsl`:
    - 약 500라인 이상의 하드코딩된 조명 로직을 `lighting.xxx` 시리즈로 전량 교체.
    - 투과(Transmission) 로직에 `lighting.specular_btdf` 및 `lighting.diffuse_btdf` 적용.
    - 클리어코트, 이리데선스 등 확장 레이어의 에너지 보존 로직 표준화.
- `src/systemCodeManager/shader/lighting/specular_brdf.wgsl`: 하이라이트 선명도 최적화(`max(..., 1e-4)`) 적용.

---

### 1.8 System & Utility (엔진 시스템 함수)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 / 비고 |
| :--- | :--- | :---: | :--- |
| **Motion Vector** | `calculateMotionVector` | ✅ 완료 | **[TAA/MotionBlur]** 현재 및 이전 프레임의 Clip Space 좌표를 이용하여 G-Buffer용 모션 벡터 계산. |
| **Backgroud Refraction** | `calcPrePathBackground` | ✅ 완료 | **[투과 처리]** Transmission 재질을 위해 백그라운드 텍스처를 굴절률과 거칠기를 고려하여 샘플링. |

#### 📂 상세 적용 이력 (System)
- **`calculateMotionVector`**: `meshVertex` 계열 출력 및 `pbrMaterial`, `phongMaterial`, `bitmapMaterial`, `colorMaterial`, `line`, `grid` 등 모든 렌더링 프래그먼트 셰이더 적용 완료.
- **`calcPrePathBackground`**: `pbrMaterial` 내 KHR_materials_transmission 구현에 적용 완료.

---

## 🚀 2단계: 향후 고도화 로드맵 (Roadmap & Candidates)

차기 리팩토링 단계에서 라이브러리화가 필요한 핵심 그래픽스 로직 후보군입니다.

### 2.1 신규 조명 모델 및 확장
| 후보 기능 | 명칭 (Proposed Path) | 우선순위 | 기대 효과 |
| :--- | :--- | :---: | :--- |
| **Anisotropy Spec** | `lighting.anisotropy_ggx` | **High** | 이방성 GGX 분포 및 가시성 함수 통합. PBR 확장 필수 로직. |
| **Sheen Model** | `lighting.sheen_charlie` | **High** | Charlie Sheen 모델 기반 패브릭 조명 라이브러리화. |
| **Sheen/Clearcoat** | `lighting.layer_xxx` | Medium | 복합 레이어 조명 계산식의 재사용성 확보. |

### 2.2 수학 및 공간 변환 유틸리티
| 후보 기능 | 명칭 (Proposed Path) | 우선순위 | 기대 효과 |
| :--- | :--- | :---: | :--- |
| **Shadow Depth Pos**| `math.getShadowClipPosition`| **Medium** | World -> LightClipSpace 변환 규격화 및 셰이더 레벨 Depth Bias 기반 마련. |
| **Distance Falloff** | `math.getLightAttenuation` | **High** | Inverse Square 기반 물리적 감쇄 표준화. Phong/PBR 통합 적용. |
| **Spotlight Cone** | `math.getSpotlightFactor` | Medium | 스폿라이트 내부/외부 원뿔 감쇄 로직 통합. |
| **Safe Math** | `math.safeDivision` | **Medium** | 0 나누기 방지 (`NaN` 에러 방어) 유틸리티 구축. |
| **UV Transform** | `math.transform_uv` | **Low** | Offset, Scale, Rotation 통합 변환. 엔진 표준 연산 순서 강제. |

### 2.3 대기 및 안개 시스템 (Environment)
| 후보 기능 | 명칭 (Proposed Path) | 우선순위 | 기대 효과 |
| :--- | :--- | :---: | :--- |
| **Height Fog** | `math.getHeightFogFactor` | **High** | 고도 기반 안개 수식의 수치 안정화 및 모듈화. |
| **Linear/Exp Fog** | `math.getFogFactor` | Medium | 일반적인 선형/지수 안개 공식 라이브러리화. |
| **Scatter Utils** | `math.scattering_xxx` | Medium | 대기 산란(Rayleigh, Mie) 기본 수식 모듈화. |

---

## ⚠️ 안정성 가이드 (Precautions)
- **Include Once**: 동일 경로(`#redgpu_include`)의 중복 치환을 방지하기 위해 전처리기 규격을 반드시 준수하십시오.
- **Naming Convention**:
    - `math.xxx`: 순수 수학적 변환 및 계산
    - `lighting.xxx`: 조명 모델 및 BRDF 관련
    - `depth.xxx`: 깊이 및 공간 복구 관련
- **Validation**: 각 모듈화 단계마다 기존 결과물(NormalTangentTest 등)과 시각적 차이가 없는지 엄격히 검증해야 합니다.

---
**최종 업데이트:** 2026-02-18
**상태:** 현황 및 로드맵 통합 마스터 문서 수립 완료
**프로젝트:** RedGPU
