# [Infrastructure] Shader Common Library Master Specification

## 1. 개요 (Overview)
RedGPU 엔진 전반에 사용되는 공통 셰이더 함수(Chunks) 및 수학적 로직을 `SystemCodeManager`로 통합 관리하기 위한 기술 표준 명세입니다. 본 문서는 엔진의 기초 물리 환경인 표준 좌표계 정의부터 구현 완료된 항목의 히스토리, 향후 구현될 로드맵 후보군을 일원화하여 관리합니다.

---

## 📐 엔진 표준 좌표계 (Engine Standard Coordinate Systems)
RedGPU는 WebGPU의 네이티브 사양을 준수하면서도 상호운용성을 극대화하기 위해 다음 좌표계를 표준으로 채택합니다.

### 2.1 3D 공간 좌표계 (World & Local Space)
- **오른손 좌표계 (Right-handed System)**: 뷰/월드 공간에서 표준 오른손 법칙을 준수합니다.
- **Y-Up**: +Y축이 위쪽 방향을 가리킵니다.
    - **+X**: 오른쪽 (Right)
    - **+Y**: 위 (Up)
    - **+Z**: 사용자 쪽 (Forward/Near, 카메라 시선은 -Z 방향)

### 2.2 UV 좌표계 (Texture Coordinates)
- **좌측 상단 원점 (Top-Left Origin)**: WebGPU 표준에 따라 (0, 0)은 텍스처의 좌측 상단입니다.
- **V-Down**: V값이 커질수록 아래쪽으로 이동합니다.
    - **U (0 to 1)**: 좌측 -> 우측 증가
    - **V (0 to 1)**: 상단 -> 하단 증가

### 2.3 NDC (Normalized Device Coordinates)
- **X/Y 범위**: -1.0(좌/하) ~ 1.0(우/상) (Y-Up 기준)
- **Z 범위 (Depth)**: **0.0(Near) ~ 1.0(Far)** (WebGPU 표준 준수)

### 2.4 노멀 매핑 및 glTF 호환성 표준 (Normal Mapping & glTF Compatibility)
RedGPU의 V-Down(Top-Left) 환경과 고유한 TBN 기저 시스템 하에서 자산의 출처(glTF vs Native)에 관계없이 일관된 법선 방향을 보장하기 위한 표준 사양입니다.

- **Z-Reconstruction (법선 복구)**: $Z = \sqrt{max(0.0, 1.0 - (X^2 + Y^2))}$ 공식을 사용하여 단위 벡터 정밀도를 보장합니다.
- **TBN 기저 시스템**: $N \times T = B$ 순환 순서를 준수하는 오른손 법칙 기저를 사용합니다. `getTBNFromCotangent`에서 생성된 비탄젠트($B$)는 월드 공간의 위(+Y)를 향합니다.
- **명시적 데이터 가공 (Explicit Processing)**: 
    - 유연성을 위해 `getNormalFromNormalMap`은 순수 수학 함수로 유지하며, 채널 가공은 재질에서 명시적으로 수행합니다.
    - **glTF (Y-Up)**: 엔진의 V-Down 환경과 맞추기 위해 재질에서 `1.0 - Green` 처리를 수행합니다.
    - **Native (Y-Down)**: 별도의 반전 없이 그대로 사용합니다.
- **Normal Scale 표준화**: 
    - 가공된 Y-Down 기반 노멀 데이터를 월드 공간의 비탄젠트(Up) 방향과 일치시키기 위해 시스템적으로 **`-u_normalScale`**을 적용합니다 (NormalTangentTest 통과 규격).
    - **중요**: 노멀 맵이 없는 경우에도 버텍스 노멀에 `-u_normalScale`을 동일하게 적용하여 `NdotV` 등 각도 기반 계산의 일관성을 유지해야 합니다.
- **Iridescence (무지개빛) 표준**:
    - `lighting.getIridescentFresnel`은 Airy's 공식을 기반으로 한 순수 물리 모델을 따릅니다.
    - 임의의 시각적 보정(smoothstep, pow 등)을 배제하여 glTF 2.0 물리 표준과의 호환성을 보장합니다.

### 2.5 전역 좌표계 일관성 보정 (Global Coordinate Consistency)
`src/systemCodeManager/` 내의 모든 라이브러리는 다음의 보정 원칙을 공유하여 수학적 충돌을 방지합니다.

- **NDC & Screen Alignment**: 
    - WebGPU의 스크린 Y-Down 특성을 NDC Y-Up으로 보정하기 위해 `getNDCFromDepth`에서 `(1.0 - uv.y)`를 적용합니다.
    - `getMotionVector` 역시 동일한 원리로 Y축을 반전시켜 UV 공간의 모션과 일치시킵니다.
- **Shadow Mapping Alignment**:
    - `getShadowCoord`에서 `y * -0.5 + 0.5` 처리를 통해 월드 Up(+Y)이 그림자 맵의 상단(V=0)에 매핑되도록 V-Down 시스템과 동기화합니다.
- **View & Ray Analysis**:
    - `getViewDirection`(Pixel $\to$ Cam)과 `getRayDirection`(Cam $\to$ Pixel)을 명확히 분리하여, 반사 벡터(`getReflectionVector...`) 계산 시 물리적 정확도를 보장합니다.

---

## 📝 기능 카테고리별 통합 현황 및 로드맵

### 1. Color Space & Conversion (색상 변환 및 처리)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **Rec. 709 Luminance** | `color.getLuminance` | ✅ 완료 | **[VFX 표준]** 인지적 밝기 분석용. HDTV 표준 가중치(0.2126, 0.7152, 0.0722) 적용. |
| **YCoCg Transform** | `color.rgbToYCoCg / YCoCgToRgb` | ✅ 완료 | **[AA 표준]** TAA의 이력 압축 및 Bloom의 휘도 추출용. RGB 대비 색상 채널 분리가 우수함. |
| **sRGB Transform** | `color.linearToSrgbVec3 / 4` | ✅ 완료 | **[출력 표준]** Gamma 2.2 보정 수행. 최종 Canvas 출력을 위한 필수 전처리. |
| **Linear Transform** | `color.srgbToLinearVec3 / 4` | ✅ 완료 | **[입력 보정]** 비-linear 텍스처나 입력값을 물리 기반 조명 연산 공간으로 변환. |
| **Tint Blend Mode** | `color.getTintBlendMode` | ✅ 완료 | **[블렌딩 표준]** 23종의 포토샵 규격 블렌딩 모드 지원. `getTintBlendMode`로 명칭 정규화 완료. |

#### 📂 상세 적용 이력 (Color)
- `src/systemCodeManager/shader/color/getLuminance.wgsl`: 표준 함수 구현 및 CamelCase 적용 완료.
- `src/systemCodeManager/shader/color/getTintBlendMode.wgsl`: 23종 블렌딩 모드 통합 구현. `get_tint_blend_mode`에서 리네임 완료.
- **[휘도 계산 적용]**: `fxaa`, `taa`, `vibrance`, `filmGrain`, `threshold`, `colorBalance`, `skyBox` 등 엔진 전역 적용 완료.
- **[틴트 블렌드 적용]**: `phongMaterial`, `bitmapMaterial`, `colorMaterial` 등 모든 재질 셰이더 적용 완료.
- `toneMapping/fragment.wgsl`, `pbrMaterial/fragment.wgsl`, `colorMaterial/fragment.wgsl` 내 `linearToSrgbVec3/4` 계열 적용 완료.

---

### 2. Mathematics & Randomization (수학적 상수 및 해시)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **Common Constants** | `math.PI/PI2/INV_PI/INV_PI2/SQRT2/E/FLT_MAX/...` | ✅ 완료 | **[수치 일관성]** 14종 핵심 상수 전역 통합. 정밀도 향상 및 나눗셈 연산 최적화. |
| **Stable Hash (Grid)** | `math.hash.getHashXX` | ✅ 완료 | **[절차적 생성]** 정수 변환 기반의 안정적인 해시. GPU 아키텍처와 무관한 동일 격자 패턴 보장. |
| **Bitcast Hash (Bit)** | `math.hash.getBitHashXX` | ✅ 완료 | **[고정밀 난수]** IEEE 754 비트 레벨 조작 해시. 극소량의 변화에도 민감한 난수가 필요한 고품질 노이즈용. |
| **Dither Noise** | `math.getInterleavedGradientNoise` | ✅ 완료 | **[성능 특화]** Jorge Jimenez 알고리즘. SSAO, SSR의 샘플링 노이즈 제거를 위한 초고속 디더링. |
| **Safe Math** | `math.safeDivision` | ✅ 완료 | **[안정성]** 0 나누기 방지 표준화. 모든 나눗셈 분모에 `math.EPSILON` 방어 로직 적용 및 매직 넘버 제거. |

#### 📂 상세 적용 이력 (Math)
- `pbrMaterial`, `phongMaterial`, `filmGrain`, `skyAtmosphere`, `zoomBlur`, `ssao_ao`, `particle/compute.wgsl` 적용 완료.
- `src/systemCodeManager/shader/depth/getLinearizeDepth.wgsl`: `math.EPSILON` 재귀 인클루드 적용.
- **[수치 안정성 강화]**: `lighting`, `color`, `KHR` 라이브러리 내 파편화된 매직 넘버(`0.0001`, `0.001` 등)를 `math.EPSILON`으로 통일 및 분모 방어 로직 전역 적용 완료.

---

### 3. Vector & Directional Analysis (방향 및 시선 분석)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **View Direction** | `math.direction.getViewDirection` | ✅ 완료 | **[시선 벡터]** 카메라와 픽셀 위치를 기반으로 한 시선 벡터 계산. PBR/Phong 조명 필수 요소. |
| **Ray Direction** | `math.direction.getRayDirection` | ✅ 완료 | **[광선 추적]** 카메라 기준 픽셀 투사 벡터 계산. HeightFog 등 볼륨 환경 효과에 사용. |
| **Reflection Vec** | `math.direction.getReflectionVector...`| ✅ 완료 | **[반사 벡터]** 시선 및 법선 기반의 환경 맵 샘플링용 반사 벡터 계산. |

---

### 4. Space Reconstruction & Depth (깊이 및 공간 복구)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **Linear Depth** | `depth.getLinearizeDepth` | ✅ 완료 | **[공간 분석]** WebGPU의 비선형 Depth(0~1)를 선형 거리로 변환. `linearizeDepth` 명칭 현대화 완료. |
| **Get NDC** | `math.reconstruct.getNDCFromDepth` | ✅ 완료 | **[좌표 변환]** 스크린 UV와 Depth를 조합하여 NDC 좌표 복구. 후처리 공간 변환의 기초 데이터. |
| **Position Rec.** | `math.reconstruct.getXXXPosition...` | ✅ 완료 | **[역투영 표준]** NDC -> World/View 공간 복구. 픽셀 미분 없이 깊이값만으로 정확한 3D 위치 추적. |
| **Normal Rec.** | `math.reconstruct.getXXXNormal...` | ✅ 완료 | **[G-Buffer 복구]** GNormalBuffer RGB 데이터를 정규화된 월드/뷰 법선 벡터로 변환. |

---

### 5. Surface Basis & Shadow Mapping (그림자 및 기저)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **TBN Basis** | `math.tnb.getTBNXXX` | ✅ 완료 | **[기저 표준]** Gram-Schmidt 및 Cotangent 기반 탄젠트 공간 구축. WebGPU 스크린 Y-Down 특성 반영. |
| **Normal Decode** | `math.tnb.getNormalFromNormalMap` | ✅ 완료 | **[순수 함수]** Unpack, Z-Recon, Transform만 수행하는 수학 유틸리티. 가공은 재질에서 담당. |
| **Shadow Coord** | `shadow.getShadowCoord` | ✅ 완료 | **[그림자 변환]** 월드 좌표를 샘플링용 [0, 1] 범위로 변환. 엔진 전역 명칭 통일 완료. |
| **Shadow Depth Pos**| `shadow.getShadowClipPosition`| ✅ 완료 | **[그림자 투영]** Shadow Pass 전용. World -> LightClipSpace 변환 및 투영 절차 규격화. |
| **Shadow Visibility**| `shadow.getDirectionalShadowVisibility`| ✅ 완료 | **[가시성 표준]** 3x3 PCF 포함. 거리에 따른 최소 가시성 보정(레거시) 유지. |

---

### 6. Lighting & Material BRDF/BTDF (물리 기반 조명)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **Disney Diffuse** | `lighting.getDiffuseBRDFDisney` | ✅ 완료 | **[확산광 모델]** 거칠기 고려 레트로-리플렉션 모델. 물리적 사실감 극대화 및 에너지 보존 적용. |
| **PBR Specular** | `lighting.getSpecularBRDF` | ✅ 완료 | **[반사광 모델]** Cook-Torrance (GGX 분포 + Smith 기하 차폐). 고정밀 반사 연산. |
| **Light Distance** | `lighting.getLightDistanceAttenuation` | ✅ 완료 | **[에너지 감쇄]** glTF 2.0 표준 윈도잉 및 $Radius^2$ 정규화 적용. 물리적 정확도와 편의성 결합. |
| **Light Angle** | `lighting.getLightAngleAttenuation` | ✅ 완료 | **[원뿔 감쇄]** 스폿라이트 내부/외부 원뿔 각도 기반의 부드러운 페이드 처리. |
| **BTDF Utils** | `lighting.getSpecularBTDF / getDiffuseBTDF` | ✅ 완료 | **[투과 모델]** Transmission 확장을 위한 굴절 및 확산 투과 계산식 모듈화. |
| **Fresnel Utils** | `lighting.getFresnelXxx / getConductorFresnel / getIridescentFresnel` | ✅ 완료 | **[프레넬 표준]** Schlick, Conductor, Iridescent 등 재질별 특성 분리. |
| **Transmission** | `lighting.getTransmissionRefraction` | ✅ 완료 | **[투과 굴절]** 배경 굴절 샘플링 및 분산(Dispersion) 처리. (범용 광학 함수) |

#### 📂 상세 적용 이력 (Lighting)
- `src/systemCodeManager/shader/lighting/getTransmissionRefraction.wgsl`: `KHR_materials_transmission` 기반 배경 굴절 로직 통합 완료.
- `src/systemCodeManager/shader/lighting/getLightDistanceAttenuation.wgsl`: 표준 감쇄 함수 구현 및 $Radius^2$ 보정 적용 완료.
- `src/systemCodeManager/shader/lighting/getLightAngleAttenuation.wgsl`: 스폿라이트 각도 감쇄 구현 완료. 매직 넘버 제거 완료.

---

### 8. System Infrastructure & Utility (엔진 시스템 함수)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **Motion Vector** | `math.getMotionVector` | ✅ 완료 | **[시간적 안정성]** 프레임 간 Clip Space 좌표 기반 모션 계산. TAA 및 Motion Blur 필수 데이터. |
| **IsFinite Helper** | `math.getIsFinite` | ✅ 완료 | **[수학 유틸리티]** Scalar 및 Vec3에 대한 NaN/Inf 체크 헬퍼 함수 통합. |

---

### 9. glTF KHR Extensions (KHR 표준 확장)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **Texture Transform** | `KHR.KHR_texture_transform.getKHRTextureTransformUV` | ✅ 완료 | **[좌표 표준화]** `KHR_texture_transform` 규격 기반 TRS 행렬 합성. |
| **Sheen Charlie** | `KHR.KHR_materials_sheen.getSheenIBL` | ✅ 완료 | **[천 재질]** `KHR_materials_sheen` 규격 기반 Charlie 모델 통합 연산. |
| **Anisotropy Spec** | `KHR.KHR_materials_anisotropy.getAnisotropicSpecularBRDF` | ✅ 완료 | **[이방성]** `KHR_materials_anisotropy` 규격 기반 GGX 분포 및 가시성 통합. |

#### 📂 상세 적용 이력 (KHR)
- `src/systemCodeManager/shader/KHR/KHR_texture_transform/getKHRTextureTransformUV.wgsl`: glTF 표준 확장 통합 및 `pbrMaterial` 적용 완료.
- `src/systemCodeManager/shader/KHR/KHR_materials_sheen/`: Charlie 모델 기반 DFG, E, Lambda, IBL 기능 분리 및 통합 완료.
- `src/systemCodeManager/shader/KHR/KHR_materials_anisotropy/`: 이방성 NDF, 가시성, Specular BRDF 라이브러리화 및 `pbrMaterial` 적용 완료.

---

## ⚠️ 안정성 및 유지보수 가이드
- **Include Scope (Critical)**: `SinglePassPostEffect` 계열에서 함수 정의가 포함된 `#redgpu_include`를 사용할 경우, 반드시 `uniformStructCode.wgsl` (전역 스코프)에 배치해야 합니다. `computeCode.wgsl` (함수 내부 스코프)에 배치 시 문법 에러가 발생합니다.
- **Include Once**: 동일 경로 중복 치환 방지를 위해 전처리기 규격을 엄수하십시오.
- **Naming Standard**: `math.getXXXX`, `lighting.getXXXX`, `color.getXXXX`, `depth.getXXXX`, `shadow.getXXXX`, `KHR.KHR_xxxx.getXXXX` 등 명칭 규칙을 엄격히 준수합니다.
- **Verification**: 모듈화 단계마다 기존 결과물과의 시각적 차이를 엄격히 검증해야 합니다.

---
**최종 업데이트:** 2026-02-19
**상태:** 조명, 그림자, KHR 확장 인프라 표준화 완료
**프로젝트:** RedGPU
