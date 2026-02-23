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
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Rec. 709 Luminance</b></td>
      <td><code>color.getLuminance</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[VFX 표준]</b> 인지적 밝기 분석용. HDTV 표준 가중치 적용.</td>
    </tr>
    <tr>
      <td><b>YCoCg Transform</b></td>
      <td><code>color.rgbToYCoCg / YCoCgToRgb</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[AA 표준]</b> TAA 및 Bloom용. RGB 대비 색상 채널 분리 우수.</td>
    </tr>
    <tr>
      <td><b>sRGB Transform</b></td>
      <td><code>color.linearToSrgbVec3 / 4</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[출력 표준]</b> Gamma 2.2 보정 수행. 최종 Canvas 출력을 위한 필수 전처리.</td>
    </tr>
    <tr>
      <td><b>Linear Transform</b></td>
      <td><code>color.srgbToLinearVec3 / 4</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[입력 보정]</b> 비-linear 텍스처나 입력값을 물리 기반 조명 연산 공간으로 변환.</td>
    </tr>
    <tr>
      <td><b>Tint Blend Mode</b></td>
      <td><code>color.getTintBlendMode</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[블렌딩 표준]</b> 23종의 포토샵 규격 블렌딩 모드 지원. <code>getTintBlendMode</code> 정규화 완료.</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (Color)
- `src/systemCodeManager/shader/color/`: 모든 함수 CamelCase 및 명시적 타입 접미사(`Vec3/4`) 적용 완료.
- `src/systemCodeManager/shader/color/getTintBlendMode.wgsl`: 23종 블렌딩 모드 통합 구현. `get_tint_blend_mode`에서 리네임 완료.
- **[휘도 계산 적용]**: `fxaa`, `taa`, `vibrance`, `filmGrain`, `threshold`, `colorBalance`, `skyBox` 등 엔진 전역 적용 완료.
- **[틴트 블렌드 적용]**: `phongMaterial`, `bitmapMaterial`, `colorMaterial` 등 모든 재질 셰이더 적용 완료.
- `toneMapping/fragment.wgsl`, `pbrMaterial/fragment.wgsl`, `colorMaterial/fragment.wgsl` 내 `linearToSrgbVec3/4` 계열 적용 완료.

---

### 2. Mathematics & Randomization (수학적 상수 및 해시)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Common Constants</b></td>
      <td><code>math.PI / EPSILON / FLT_MAX / ...</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[수치 일관성]</b> 14종 핵심 상수 전역 통합. 정밀도 향상 및 나눗셈 연산 최적화.</td>
    </tr>
    <tr>
      <td><b>Stable Hash (Grid)</b></td>
      <td><code>math.hash.getHashXX</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[절차적 생성]</b> 정수 변환 기반의 안정적인 해시. GPU 아키텍처와 무관한 동일 격자 패턴 보장.</td>
    </tr>
    <tr>
      <td><b>Bitcast Hash (Bit)</b></td>
      <td><code>math.hash.getBitHashXX</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[고정밀 난수]</b> IEEE 754 비트 레벨 조작 해시. 극소량의 변화에도 민감한 난수가 필요한 고품질 노이즈용.</td>
    </tr>
    <tr>
      <td><b>Dither Noise</b></td>
      <td><code>math.getInterleavedGradientNoise</code></td>
      <td align="center">Frag/Comp</td>
      <td align="center">✅ 완료</td>
      <td><b>[성능 특화]</b> Jorge Jimenez 알고리즘. SSAO, SSR의 샘플링 노이즈 제거를 위한 초고속 디더링.</td>
    </tr>
    <tr>
      <td><b>Safe Math</b></td>
      <td><code>math.safe.safeDiv</code></td>
      <td align="center">Common</td>
      <td align="center">Medium</td>
      <td><b>[Priority 3]</b> 0 나누기 방지 패턴(max(d, EPSILON))을 함수로 추상화하여 가독성 향상.</td>
    </tr>
    <tr>
      <td><b>Safe Normalize</b></td>
      <td><code>math.safe.safeNormalize</code></td>
      <td align="center">Common</td>
      <td align="center">Medium</td>
      <td><b>[Priority 3]</b> 제로 벡터 정규화 시 NaN 방어 로직이 포함된 유틸리티 도입 예정.</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (Math)
- `pbrMaterial`, `phongMaterial`, `filmGrain`, `skyAtmosphere`, `zoomBlur`, `ssao_ao`, `particle/compute.wgsl` 적용 완료.
- `src/systemCodeManager/shader/depth/getLinearizeDepth.wgsl`: `math.EPSILON` 재귀 인클루드 적용.
- **[수치 안정성 강화]**: `lighting`, `color`, `KHR` 라이브러리 내 파편화된 매직 넘버(`0.0001`, `0.001` 등)를 `math.EPSILON`으로 통일 및 분모 방어 로직 전역 적용 완료.

---

### 3. Vector & Directional Analysis (방향 및 시선 분석)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>View Direction</b></td>
      <td><code>math.direction.getViewDirection</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[시선 벡터]</b> 카메라와 픽셀 위치를 기반으로 한 시선 벡터 계산. PBR/Phong 필수 요소.</td>
    </tr>
    <tr>
      <td><b>Ray Direction</b></td>
      <td><code>math.direction.getRayDirection</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[광선 추적]</b> 카메라 기준 픽셀 투사 벡터 계산. 볼륨 환경 효과에 사용.</td>
    </tr>
    <tr>
      <td><b>Reflection Vec</b></td>
      <td><code>math.direction.getReflectionVector...</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[반사 벡터]</b> 시선 및 법선 기반의 환경 맵 샘플링용 반사 벡터 계산.</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (Vector)
- `pbrMaterial/fragment.wgsl`: `getViewDirection`, `getReflectionVectorFromViewDirection` 적용 완료.
- `phongMaterial/fragment.wgsl`: `getViewDirection` 적용 완료.
- `src/postEffect/effects/fog/heightFog/wgsl/uniformStructCode.wgsl`: `getRayDirection` 적용 완료.

---

### 4. Space Reconstruction & Depth (깊이 및 공간 복구)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Linear Depth</b></td>
      <td><code>depth.getLinearizeDepth</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[공간 분석]</b> WebGPU의 비선형 Depth를 선형 거리로 변환. `linearizeDepth` 명칭 현대화 완료.</td>
    </tr>
    <tr>
      <td><b>Get NDC</b></td>
      <td><code>math.reconstruct.getNDCFromDepth</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[좌표 변환]</b> 스크린 UV와 Depth를 조합하여 NDC 좌표 복구. 후처리 공간 변환의 기초 데이터.</td>
    </tr>
    <tr>
      <td><b>Position Rec.</b></td>
      <td><code>math.reconstruct.getXXXPosition...</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[역투영 표준]</b> NDC -> World/View 공간 복구. 픽셀 미분 없이 깊이값만으로 정확한 3D 위치 추적.</td>
    </tr>
    <tr>
      <td><b>Normal Rec.</b></td>
      <td><code>math.reconstruct.getXXXNormal...</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[G-Buffer 복구]</b> GNormalBuffer RGB 데이터를 정규화된 월드/뷰 법선 벡터로 변환.</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (Depth & Reconstruction)
- `src/systemCodeManager/shader/depth/getLinearizeDepth.wgsl`: 표준 함수 구현 및 `getXXXX` 명칭 통일 완료.
- `SYSTEM_UNIFORM.wgsl`, `ssr`, `ssao`, `fog`, `skyAtmosphere`, `taa` 등 엔진 전역 적용 완료.
- **[MSAA 대응]**: 컴퓨트 셰이더 기반 포스트 이펙트(`skyAtmosphere`, `taa`)에서 MSAA 뎁스 샘플링 로직 표준화 완료.

---

### 5. Surface Basis & Shadow Mapping (그림자 및 기저)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>TBN Basis</b></td>
      <td><code>math.tnb.getTBNXXX</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[기저 표준]</b> Gram-Schmidt 및 Cotangent 기반 탄젠트 공간 구축. WebGPU 스크린 Y-Down 특성 반영.</td>
    </tr>
    <tr>
      <td><b>TBN Cotangent</b></td>
      <td><code>math.tnb.getTBNFromCotangent</code></td>
      <td align="center">Frag Only</td>
      <td align="center">✅ 완료</td>
      <td>미분(dpdx/dy) 기반 TBN 구축. 프래그먼트 스테이지 전용.</td>
    </tr>
    <tr>
      <td><b>Normal Decoding</b></td>
      <td><code>math.tnb.get...</code></td>
      <td align="center">Common</td>
      <td align="center">High</td>
      <td><b>[Priority 2]</b> 모든 재질의 노멀 매핑 로직을 <code>math.tnb</code>로 단일화.</td>
    </tr>
    <tr>
      <td><b>Shadow Coord</b></td>
      <td><code>shadow.getShadowCoord</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[그림자 변환]</b> 월드 좌표를 샘플링용 [0, 1] 범위로 변환. 엔진 전역 명칭 통일 완료.</td>
    </tr>
    <tr>
      <td><b>Shadow Depth</b></td>
      <td><code>entryPoint.shadow.mesh.entryPointShadowVertex</code><br/><code>entryPoint.shadow.billboard.entryPointShadowVertex</code></td>
      <td align="center">Vert Only</td>
      <td align="center">✅ 완료</td>
      <td><b>[그림자 엔트리]</b> Mesh/Billboard 전용 섀도우 맵 렌더링 엔트리 포인트 통합 완료.</td>
    </tr>
    <tr>
      <td><b>Shadow Sync</b></td>
      <td><code>shadow.get...</code></td>
      <td align="center">Frag Only</td>
      <td align="center">High</td>
      <td><b>[Priority 2]</b> 모든 재질의 그림자 가시성 로직을 표준 라이브러리(<code>shadow.</code>)로 교체.</td>
    </tr>
    <tr>
      <td><b>Shadow Vis.</b></td>
      <td><code>shadow.getDirectionalShadowVisibility</code></td>
      <td align="center">Frag Only</td>
      <td align="center">✅ 완료</td>
      <td><b>[가시성 표준]</b> 3x3 PCF 필터링 및 최소 가시성 보정(레거시) 포함.</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (Basis & Shadow)
- `src/systemCodeManager/shader/shadow/`: 그림자 관련 파일 전량 전용 폴더로 집결 및 `shadow.` 네임스페이스 확정.
- **[버텍스 셰이더 적용]**: `meshVertex`, `meshVertexPbr`, `meshVertexPbrSkin`, `particleVertex`, `spriteSheet2D/3D`, `textField2D/3D` 내 `#redgpu_include shadow.XXXX` 적용 완료.
- **[그림자 패스 통합]**: `meshVertexPbrSkin`, `entryPointShadowVertex`, `instanceMeshVertex_shadow` 내 투영 로직 통합 및 엔트리 포인트 명칭 정규화 완료.
- **[프래그먼트 적용]**: `pbrMaterial`, `phongMaterial`, `bitmapMaterial`, `textFieldMaterial` 내 `InputData` 필드명 및 호출부 통일 완료.

---

### 6. Lighting & Material BRDF/BTDF (물리 기반 조명)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Disney Diffuse</b></td>
      <td><code>lighting.getDiffuseBRDFDisney</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[확산광 모델]</b> 거칠기 고려 레트로-리플렉션 모델. 물리적 사실감 극대화 및 에너지 보존 적용.</td>
    </tr>
    <tr>
      <td><b>PBR Specular</b></td>
      <td><code>lighting.getSpecularBRDF</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[반사광 모델]</b> Cook-Torrance (GGX 분포 + Smith 기하 차폐). 고정밀 반사 연산.</td>
    </tr>
    <tr>
      <td><b>Light Distance</b></td>
      <td><code>lighting.getLightDistanceAttenuation</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[에너지 감쇄]</b> glTF 2.0 표준 윈도잉 및 $Radius^2$ 정규화 적용. 물리적 정확도와 편의성 결합.</td>
    </tr>
    <tr>
      <td><b>Light Angle</b></td>
      <td><code>lighting.getLightAngleAttenuation</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[원뿔 감쇄]</b> 스폿라이트 내부/외부 원뿔 각도 기반의 부드러운 페이드 처리.</td>
    </tr>
    <tr>
      <td><b>Transmission</b></td>
      <td><code>lighting.getTransmissionRefraction</code></td>
      <td align="center">Frag/Comp</td>
      <td align="center">✅ 완료</td>
      <td><b>[투과 굴절]</b> 배경 굴절 샘플링 및 분산(Dispersion) 처리. 범용 광학 함수.</td>
    </tr>
    <tr>
      <td><b>Lighting Loop</b></td>
      <td><code>lighting.get...Contribution</code></td>
      <td align="center">Medium</td>
      <td align="center">Medium</td>
      <td><b>[Priority 2]</b> 재질별 파편화된 조명 합산 루프 구조 및 변수명 표준화 예정.</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (Lighting)
- `src/systemCodeManager/shader/lighting/getLightDistanceAttenuation.wgsl`: 표준 감쇄 함수 구현 및 $Radius^2$ 보정 적용 완료.
- `src/systemCodeManager/shader/lighting/getLightAngleAttenuation.wgsl`: 스폿라이트 각도 감쇄 구현 완료.
- **[재질 통합]**: `pbrMaterial`, `phongMaterial` 내 조명 루프 구조 일치화 및 `NdotL` 네이밍 컨벤션 정규화.
- **[오류 수정]**: `phongMaterial` 스펙큘러 중복 감쇄($1/d^4$) 및 조명 누수 현상 해결.
- **[검증 예제]**: `examples/3d/light/pointLightWithGltf/`, `examples/3d/light/spotLightWithGltf/` 생성 완료.

---

### 7. Environmental & Atmospheric Effects (대기 및 안개)
| 대상 기능 | 명칭 (Include Path) | 상태 | 적용 범위 및 기술 비고 |
| :--- | :--- | :---: | :--- |
| **Height Fog** | `math.getHeightFogFactor` | **High** | **[환경 감쇄]** 고도 기반 안개 수식의 수치 안정화 및 모듈화 예정. 거리/고도 복합 감쇄 지원. |
| **Linear/Exp Fog** | `math.getFogFactor` | **Medium** | **[기본 안개]** 일반적인 선형/지수 안개 공식 라이브러리화 예정. |
| **Scatter Utils** | `math.getScatteringXxx` | **Medium** | **[대기 산란]** Rayleigh 및 Mie 산란 기본 수식 모듈화 예정. 대기 효과 최적화 핵심. |

---

### 8. System Infrastructure & Utility (엔진 시스템 함수)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Motion Vector</b></td>
      <td><code>math.getMotionVector</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[시간적 안정성]</b> 프레임 간 Clip Space 좌표 기반 모션 계산. TAA 및 Motion Blur 필수 데이터.</td>
    </tr>
    <tr>
      <td><b>IsFinite Helper</b></td>
      <td><code>math.getIsFinite</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[수학 유틸리티]</b> Scalar 및 Vec3에 대한 NaN/Inf 체크 헬퍼 함수 통합.</td>
    </tr>
    <tr>
      <td><b>PostEffect Uniform</b></td>
      <td><code>SystemCodeManager.POST_EFFECT_SYSTEM_UNIFORM</code></td>
      <td align="center">Compute</td>
      <td align="center">✅ 완료</td>
      <td><b>[후처리 표준]</b> 포스트 이펙트 전용 공통 시스템 유니폼 구조체.</td>
    </tr>
    <tr>
      <td><b>Billboard Matrix</b></td>
      <td><code>math.billboard.getBillboardMatrix</code></td>
      <td align="center">Vertex</td>
      <td align="center">✅ 완료</td>
      <td><b>[통합 빌보드]</b> 표준(Scale 추출) 및 고속(대각 성분) 모드 통합. 언리얼 엔진 스타일의 단일화된 로직.</td>
    </tr>
    <tr>
      <td><b>Picking System</b></td>
      <td><code>entryPoint.mesh.entryPointPickingVertex / fragment</code><br/><code>entryPoint.billboard.entryPointPickingVertex</code><br/><code>entryPoint.empty.entryPointPickingVertex</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[피킹 표준]</b> Mesh/Billboard/Empty 전용 피킹 통합. 기하 변환 로직 차이로 인해 의도적으로 분리 관리.</td>
    </tr>
    <tr>
      <td><b>Billboard System</b></td>
      <td><code>entryPoint.billboard.entryPointPickingVertex / entryPoint.empty.entryPointShadowVertex</code></td>
      <td align="center">Vertex</td>
      <td align="center">✅ 완료</td>
      <td><b>[빌보드 표준]</b> 카메라 정면을 향하는 기저 변환 및 빌보드용 피킹/그림자 셰이더 통합 완료.</td>
    </tr>
    <tr>
      <td><b>System Output</b></td>
      <td><code>systemStruct.FragmentOutput</code></td>
      <td align="center">Frag Only</td>
      <td align="center">✅ 완료</td>
      <td><b>[출력 표준]</b> G-Buffer 구성을 포함한 최종 프래그먼트 출력 구조체 통합 완료.</td>
    </tr>
    <tr>
      <td><b>Shadow Output</b></td>
      <td><code>entryPoint.mesh.entryPointShadowVertex</code><br/><code>entryPoint.empty.entryPointShadowVertex</code></td>
      <td align="center">Vert Only</td>
      <td align="center">✅ 완료</td>
      <td><b>[그림자 표준]</b> 섀도우 맵 렌더링을 위한 정점 셰이더 출력 구조체 통합 완료. (빌보드는 <code>empty</code> 공용 사용)</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (System)
- `src/systemCodeManager/shader/math/billboard/getBillboardMatrix.wgsl`: 표준(Standard) 및 빠른(Fast) 스케일 옵션을 포함하는 통합 빌보드 행렬 계산 함수 구현 완료.
- **[빌보드 통합]**: `getBillboardMatrixNoScaleRatio`를 폐지하고 `getBillboardMatrix(..., mode)` 형태의 단일 API로 통합하여 유지보수성 향상.
- **[셰이더 적용]**: `calcBillboard`, `particleVertex`, `sprite3DVertex`, `textField3DVertex` 등 엔진 전역 빌보드 셰이더 적용 완료.
- `src/systemCodeManager/shader/math/getMotionVector.wgsl`: 표준 함수 구현 및 이동 완료.
- **[엔트리 포인트 통합]**: 모든 시스템 엔트리 포인트 셰이더를 `src/systemCodeManager/shader/entryPoint/` 하위로 집결시키고, 객체 타입별(`mesh/`, `billboard/`, `empty/`)로 구조화하여 관리 효율성 확보 완료.
- **[빌보드 시스템 통합]**: 빌보드 전용 피킹 및 그림자 셰이더를 `SystemCodeManager`를 통해 일원화하여 관리 완료.
- **[네임스페이스 구축]**: `SystemCodeManager.entryPoint`, `SystemCodeManager.systemStruct` 네임스페이스를 신설하여 시스템 코드를 구조화함.
- **[구조체 표준화]**: `FragmentOutput` 및 `OutputShadowData`를 `systemStruct`로 통합하고, 관련 파일을 `src/systemCodeManager/shader/systemStruct/`로 구조화하여 일관성 확보 완료.
- **[메시 규격 최적화]**: `meshVertexBasicUniform.wgsl`을 `src/display/mesh/core/shader/`로 이동하여 TypeScript 바인드 그룹 정의와 WGSL 구조체 규격을 응집력 있게 관리.
- **[레거시 인프라 완전 폐지]**: 파편화되어 있던 `SystemCode.ts`, `SystemVertexCode` (index.ts), `SystemFragmentCode`를 모두 폐지 및 삭제. 모든 전역 시스템 셰이더 상수 및 공통 라이브러리 관리를 `SystemCodeManager`로 전면 일원화하여 아키텍처 단순화 완료.
- **[엔진 내부 참조 정규화]**: `View3D.ts`, `PostEffectManager.ts`, `SkyAtmosphere.ts`, `TAA.ts`, `index.ts` 등 엔진 핵심부의 직접적인 `.wgsl` 임포트를 제거하고 `SystemCodeManager` 참조 기반으로 100% 전환 완료.
- **[모션 벡터 적용]**: 모든 렌더링 프래그먼트 셰이더 적용 완료.
- **`lighting.getTransmissionRefraction`**: `pbrMaterial` 내 KHR_materials_transmission 구현부 적용 완료. `math.getIsFinite`를 통한 안정성 강화.

---

### 9. Displacement Mapping (변위 매핑)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Pos. Displacement</b></td>
      <td><code>displacement.getDisplacementPosition</code></td>
      <td align="center">Vertex</td>
      <td align="center">✅ 완료</td>
      <td><b>[기하 변형]</b> 로컬 공간 정점 위치 이동. 0.5 베이스라인 기반 확장/수축 지원.</td>
    </tr>
    <tr>
      <td><b>Normal Displacement</b></td>
      <td><code>displacement.getDisplacementNormal</code></td>
      <td align="center">Vertex</td>
      <td align="center">✅ 완료</td>
      <td><b>[법선 보정]</b> 변형된 지형에 맞는 월드 법선 재계산. TBN 기저 기반 섭동(Perturbation) 적용.</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (Displacement)
- `src/systemCodeManager/shader/displacement/`: 파편화된 `calcDisplacements.wgsl`을 기능별로 분리하고 전용 라이브러리로 승격.
- **[명칭 정규화]**: `calcDisplacement...`에서 `getDisplacement...`로 변경하여 엔진 표준 명명 규칙(CamelCase, get 접두어) 준수.
- **[수학적 정밀도]**: `getDisplacementNormal` 내에 WebGPU V-Down 좌표계 보정 로직과 월드 공간 TBN 기반 섭동 로직을 통합하여 회전에 안전한 노멀 계산 보장.
- **[셰이더 적용]**: `meshVertex`, `instanceMeshVertex_head`, `entryPointShadowVertex` 등 엔진 전역 적용 완료.

---

### 10. glTF KHR Extensions (glTF 표준 확장)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%;">대상 기능</th>
      <th style="width: 25%;">명칭 (Include Path)</th>
      <th style="width: 15%;">Stage</th>
      <th style="width: 10%;">상태</th>
      <th style="width: 35%;">기술 비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Texture Trans</b></td>
      <td><code>KHR.KHR_texture_transform.get...</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[좌표 표준화]</b> <code>KHR_texture_transform</code> 규격 기반 TRS 행렬 합성.</td>
    </tr>
    <tr>
      <td><b>Sheen Charlie</b></td>
      <td><code>KHR.KHR_materials_sheen.get...</code></td>
      <td align="center">Frag/Comp</td>
      <td align="center">✅ 완료</td>
      <td><b>[천 재질]</b> Charlie 모델 기반 DFG, E, Lambda, IBL 통합 연산 완료.</td>
    </tr>
    <tr>
      <td><b>Anisotropy Spec</b></td>
      <td><code>KHR.KHR_materials_anisotropy.get...</code></td>
      <td align="center">Common</td>
      <td align="center">✅ 완료</td>
      <td><b>[이방성]</b> <code>KHR_materials_anisotropy</code> 규격 기반 GGX 분포 및 가시성 통합.</td>
    </tr>
    <tr>
      <td><b>Clearcoat</b></td>
      <td><code>KHR.KHR_materials_clearcoat</code></td>
      <td align="center">High</td>
      <td align="center">High</td>
      <td><b>[Priority 4]</b> <code>pbrMaterial</code> 내 클리어코트 레이어 및 노멀 연산 분리 예정.</td>
    </tr>
    <tr>
      <td><b>Specular/IOR</b></td>
      <td><code>KHR.KHR_materials_specular</code></td>
      <td align="center">Medium</td>
      <td align="center">Medium</td>
      <td><b>[Priority 4]</b> F0 조정 및 IOR, Volume 로직 라이브러리 분리 예정.</td>
    </tr>
  </tbody>
</table>

#### 📂 상세 적용 이력 (KHR)
- `src/systemCodeManager/shader/KHR/`: 공식 확장명 접두어(KHR_)를 포함한 계층 폴더 구조 확립 완료.
- **[Anisotropy/Sheen]**: `pbrMaterial` 내 하드코딩된 로직을 라이브러리로 완전 이주 및 동기화 완료.

---

### 2.6 포스트 이펙트 MSAA 대응 표준 (Post-Effect MSAA Standard)
컴퓨트 셰이더 기반 포스트 이펙트에서 MSAA 뎁스 텍스처를 처리할 때의 표준 가이드라인입니다.

- **상태 동기화**: `view.sampleCount` 대신 `antialiasingManager.useMSAA`를 기준으로 바리안트를 결정하여 시스템 전체의 안티앨리어싱 상태와 동기화합니다.
- **셰이더 바리안트**: 템플릿 리터럴을 활용하여 `texture_depth_multisampled_2d`와 `texture_depth_2d`를 조건부 선언합니다.
- **데이터 로드**: `fetchDepth`와 같은 헬퍼 함수를 통해 `textureLoad(depthTexture, pos, 0)` 등 샘플 인덱스 처리를 캡슐화합니다.
- **리소스 캐싱**: `useMSAA` 상태별로 `BindGroupLayout` 및 `Pipeline`을 캐싱하여 런타임 상태 변화에 따른 오버헤드를 최소화합니다.

---

## ⚠️ 안정성 및 유지보수 가이드
- **Include Scope (Critical)**: `SinglePassPostEffect` 계열에서 함수 정의가 포함된 `#redgpu_include`를 사용할 경우, 반드시 `uniformStructCode.wgsl` (전역 스코프)에 배치해야 합니다. `computeCode.wgsl` (함수 내부 스코프)에 배치 시 문법 에러가 발생합니다.
- **Include Once**: 동일 경로 중복 치환 방지를 위해 전처리기 규격을 엄수하십시오.
- **Stage Compliance**: 모든 라이브러리는 파일 헤더에 명시된 `[Stage]`를 준수해야 합니다. Fragment Only 함수를 Vertex 단계에서 사용 시 컴파일 에러가 발생합니다.
- **Naming Standard**: `math.getXXXX`, `lighting.getXXXX`, `color.getXXXX`, `depth.getXXXX`, `shadow.getXXXX`, `KHR.KHR_xxxx.getXXXX` 등 명칭 규칙을 엄격히 준수합니다.
- **Verification**: 모듈화 단계마다 기존 결과물과의 시각적 차이를 엄격히 검증해야 합니다.

---
**최종 업데이트:** 2026-02-19
**상태:** 조명, 그림자, KHR 확장 인프라 표준화 및 Stage 명시 완료
**프로젝트:** RedGPU
