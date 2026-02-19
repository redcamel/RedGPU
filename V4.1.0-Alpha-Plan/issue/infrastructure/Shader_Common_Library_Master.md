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

### 2.3 NDC (Normalized Device Coordinates)
- **X/Y 범위**: -1.0(좌/하) ~ 1.0(우/상) (Y-Up 기준)
- **Z 범위 (Depth)**: **0.0(Near) ~ 1.0(Far)** (WebGPU 표준 준수)

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
      <td><b>Rec. 709 Luma</b></td>
      <td><code>color.getLuminance</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>인지적 밝기 분석용. HDTV 표준 가중치 적용.</td>
    </tr>
    <tr>
      <td><b>YCoCg Trans</b></td>
      <td><code>color.rgbToYCoCg / YCoCgToRgb</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>TAA 및 Bloom용. RGB 대비 색상 채널 분리 우수.</td>
    </tr>
    <tr>
      <td><b>sRGB Trans</b></td>
      <td><code>color.linearToSrgbVec3 / 4</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>Gamma 2.2 보정. 명시적 타입 접미사(Vec) 적용.</td>
    </tr>
    <tr>
      <td><b>Linear Trans</b></td>
      <td><code>color.srgbToLinearVec3 / 4</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>물리 기반 조명 연산 공간으로의 입력 보정.</td>
    </tr>
    <tr>
      <td><b>Tint Blend</b></td>
      <td><code>color.getTintBlendMode</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>23종 포토샵 규격 블렌딩. 명칭 정규화 완료.</td>
    </tr>
  </tbody>
</table>

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
      <td><b>Common Const</b></td>
      <td><code>math.PI / EPSILON / FLT_MAX / ...</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>14종 핵심 상수 전역 통합.</td>
    </tr>
    <tr>
      <td><b>Stable Hash</b></td>
      <td><code>math.hash.getHashXX</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>정수 변환 기반의 안정적인 격자 해시.</td>
    </tr>
    <tr>
      <td><b>Bitcast Hash</b></td>
      <td><code>math.hash.getBitHashXX</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>IEEE 754 비트 레벨 조작 고정밀 해시.</td>
    </tr>
    <tr>
      <td><b>Dither Noise</b></td>
      <td><code>math.getInterleavedGradientNoise</code></td>
      <td align="center"><b>Frag/Comp</b></td>
      <td align="center">✅ 완료</td>
      <td>Jorge Jimenez 알고리즘. SSAO, SSR용.</td>
    </tr>
    <tr>
      <td><b>Safe Math</b></td>
      <td><code>math.safe.safeDiv</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">Medium</td>
      <td><b>[Priority 3]</b> 0 나누기 방지 패턴의 함수 추상화.</td>
    </tr>
  </tbody>
</table>

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
      <td><b>View Direct</b></td>
      <td><code>math.direction.getViewDirection</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>카메라와 픽셀 위치 기반 시선 벡터 계산.</td>
    </tr>
    <tr>
      <td><b>Ray Direct</b></td>
      <td><code>math.direction.getRayDirection</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>카메라 기준 픽셀 투사 벡터 계산. 볼륨 효과용.</td>
    </tr>
    <tr>
      <td><b>Reflection Vec</b></td>
      <td><code>math.direction.getReflectionVector...</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>시선 및 법선 기반의 환경 맵 샘플링용 반사 벡터.</td>
    </tr>
  </tbody>
</table>

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
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>WebGPU의 비선형 Depth를 선형 거리로 변환.</td>
    </tr>
    <tr>
      <td><b>Get NDC</b></td>
      <td><code>math.reconstruct.getNDCFromDepth</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>스크린 UV와 Depth를 조합하여 NDC 좌표 복구.</td>
    </tr>
    <tr>
      <td><b>Position Rec.</b></td>
      <td><code>math.reconstruct.getXXXPosition...</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td><b>[역투영 표준]</b> NDC -> World/View 공간 복구.</td>
    </tr>
  </tbody>
</table>

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
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>Gram-Schmidt 및 Cotangent 기반 탄젠트 공간 구축.</td>
    </tr>
    <tr>
      <td><b>TBN Cotangent</b></td>
      <td><code>math.tnb.getTBNFromCotangent</code></td>
      <td align="center"><b>Frag Only</b></td>
      <td align="center">✅ 완료</td>
      <td>미분(dpdx/dy) 기반 TBN 구축. 프래그먼트 전용.</td>
    </tr>
    <tr>
      <td><b>Shadow Coord</b></td>
      <td><code>shadow.getShadowCoord</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>월드 좌표를 샘플링용 [0, 1] 범위로 변환.</td>
    </tr>
    <tr>
      <td><b>Shadow Depth</b></td>
      <td><code>shadow.draw...</code></td>
      <td align="center"><b>Vert Only</b></td>
      <td align="center">High</td>
      <td><b>[Priority 1]</b> <code>drawDirectionalShadowDepth</code> 이주.</td>
    </tr>
    <tr>
      <td><b>Shadow Vis</b></td>
      <td><code>shadow.getDirectionalShadowVisibility</code></td>
      <td align="center"><b>Frag Only</b></td>
      <td align="center">✅ 완료</td>
      <td><b>[가시성 표준]</b> 3x3 PCF 필터링 포함.</td>
    </tr>
  </tbody>
</table>

---

### 6. Lighting & Material BRDF (물리 기반 조명)
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
      <td><b>PBR/Disney</b></td>
      <td><code>lighting.get...BRDF</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>Cook-Torrance 및 Disney Diffuse 모델 통합.</td>
    </tr>
    <tr>
      <td><b>Transmission</b></td>
      <td><code>lighting.getTransmissionRefraction</code></td>
      <td align="center"><b>Frag/Comp</b></td>
      <td align="center">✅ 완료</td>
      <td>배경 굴절 샘플링 및 분산(Dispersion) 처리.</td>
    </tr>
  </tbody>
</table>

---

### 9. glTF KHR Extensions (glTF 표준 확장)
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
      <td><b>TRS Trans</b></td>
      <td><code>KHR.KHR_texture_transform.get...</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td><code>KHR_texture_transform</code> 규격 기반 TRS 변환.</td>
    </tr>
    <tr>
      <td><b>Sheen Charlie</b></td>
      <td><code>KHR.KHR_materials_sheen.get...</code></td>
      <td align="center"><b>Common/Frag</b></td>
      <td align="center">✅ 완료</td>
      <td>Charlie 모델 기반 DFG, E, Lambda, IBL 통합.</td>
    </tr>
    <tr>
      <td><b>Anisotropy</b></td>
      <td><code>KHR.KHR_materials_anisotropy.get...</code></td>
      <td align="center"><b>Common</b></td>
      <td align="center">✅ 완료</td>
      <td>이방성 GGX 분포 및 가시성 통합.</td>
    </tr>
  </tbody>
</table>

---

## ⚠️ 안정성 및 유지보수 가이드
- **Include Scope**: 전역 스코프 함수 정의를 위해 `uniformStructCode.wgsl` 배치를 권장합니다.
- **Stage Compliance**: 모든 라이브러리는 파일 헤더에 명시된 `[Stage]`를 준수해야 합니다. Fragment Only 함수를 Vertex 단계에서 사용 시 컴파일 에러가 발생합니다.
- **Naming Standard**: `math.getXXXX`, `lighting.getXXXX`, `KHR.KHR_xxxx.getXXXX` 규칙을 엄격히 준수합니다.

---
**최종 업데이트:** 2026-02-19
**상태:** 조명, 그림자, KHR 확장 인프라 표준화 및 Stage 명시 완료
**프로젝트:** RedGPU
