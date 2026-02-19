# [Checklist] Shader Library Consistency & System Coordinates

## 1. 개요 (Overview)
RedGPU 엔진의 표준 좌표계(Right-handed, Y-Up, V-Down, NDC Y-Up)와 glTF 2.0 물리 표준이 `SystemCodeManager` 내의 개별 셰이더 라이브러리에 일관되게 적용되었는지 점검하기 위한 체크리스트입니다.

---

## 🔍 일관성 점검 및 수정 대상 리스트

### 1. 노멀 맵 디코딩 표준화 (Normal Map Decoding)
*   **대상**: `src/systemCodeManager/shader/math/tnb/getNormalFromNormalMap.wgsl`
*   **결과**: ✅ 완료.
    - 함수는 순수 수학 연산(Unpack, Z-Recon, Transform)만 수행하도록 유지하여 범용성 확보.
    - glTF 자산의 Green 채널 반전은 재질(`pbrMaterial`)에서 명시적으로 처리(`1.0 - g`)하도록 표준화.
    - `phongMaterial`(Native)은 엔진 표준인 Y-Down 자산으로 간주하여 반전 없이 사용.

### 2. TBN 기저 구축 일관성 (TBN Basis Construction)
*   **대상**: `math.tnb.getTBNXXX`
*   **결과**: ✅ 완료.
    - $N \times T = B$ 순서의 오른손 법칙 기저가 모든 생성 함수에서 일관되게 적용됨을 확인.
    - `VertexTangent.w`(Handedness)가 비탄젠트($B$) 방향 결정 시 올바르게 반영됨을 검증.

### 3. 스크린 공간 미분과 좌표계 (Derivatives & Screen Space)
*   **대상**: `src/systemCodeManager/shader/math/tnb/getTBNFromCotangent.wgsl`
*   **결과**: ✅ 완료.
    - WebGPU의 `dpdy`(Down) 환경에서 생성된 비탄젠트($B$)가 월드 공간의 위(+Y)를 향함을 확인.
    - 시스템적으로 `-u_normalScale`을 적용하여 Y-Down 기반 노멀 데이터와 비탄젠트 방향을 일치시킴.

### 4. 물리적 그림자 가시성 (Physical Shadow Visibility)
*   **대상**: `src/systemCodeManager/shader/shadow/getDirectionalShadowVisibility.wgsl`
*   **결과**: ✅ 완료.
    - `minVisibility` 보정 등 기존 레거시 로직 유지 (기존 시각적 결과 보존).
    - 3x3 PCF 필터링 표준화 확인.

### 5. 역투영 및 공간 복구 일관성 (Space Reconstruction)
*   **대상**: `math.reconstruct.XXX`
*   **결과**: ✅ 완료.
    - `getNDCFromDepth` 내 `(1.0 - uv.y)` 처리를 통해 WebGPU Y-Down 스크린 좌표를 NDC Y-Up으로 보정함 확인.
    - `getWorldNormalFromGNormalBuffer`의 데이터 복구 로직($g * 2.0 - 1.0$) 표준화 확인.
    - **Post-Effect MSAA**: 컴퓨트 셰이더 기반 포스트 이펙트(`skyAtmosphere`, `taa`)에서 MSAA 뎁스 텍스처를 처리하기 위한 셰이더 바리안트 및 `fetchDepth` 로직 표준화 완료.

### 6. 전역 좌표계 및 시스템 인프라 정렬 (Global Audit)
*   **결과**: ✅ 완료.
    - `src/systemCodeManager/` 내의 모든 셰이더 함수가 **"Right-handed, Y-Up, V-Down"** 표준 하에 수학적으로 일관됨을 확인.
    - **Expanded Constants**: `INV_PI2`, `SQRT2`, `FLT_MAX` 등 14종의 시스템 상수를 통합하여 연산 정밀도와 최적화 기반 마련.
    - **Vertex Normal Scale**: 노멀 맵이 없을 때에도 `-u_normalScale`을 적용하여 `NdotV` 및 `Iridescence` 각도 왜곡을 방지하도록 `pbr/phong` 재질 동기화 완료.
    - **Iridescence Logic**: 비물리적/수학적 오류(분모 제곱 누락, 임의 보정 등)를 제거하고 표준 물리 공식으로 복구 완료.

### 7. 물리 기반 투과 및 굴절 표준 (Transmission & Refraction)
*   **대상**: `lighting.getTransmissionRefraction`
*   **결과**: ✅ 완료.
    - `KHR_materials_transmission` 및 `volume` 확장 표준 규격 준수 확인.
    - `math.getIsFinite`를 도입하여 NaN/Inf에 의한 픽셀 오염 방지 로직 통합.
    - RGB 분산(Dispersion) 처리 시 채널별 IOR 안전 범위(min 1.0001) 적용 확인.
    - WebGPU 스크린 좌표계 보정(`1.0 - uv.y`)이 굴절 UV 계산에 올바르게 반영됨을 검증.

### 8. 텍스처 변환 표준 (Texture Transform Standard)
*   **대상**: `getKHRTextureTransformUV`
*   **결과**: ✅ 완료.
    - `KHR_texture_transform` 확장 규격에 따른 TRS(Translation, Rotation, Scale) 행렬 합성 방식 준수.
    - 파편화된 `get_transformed_uv` 로직을 시스템 최상위 공통 라이브러리로 통합.
    - 멀티 UV(UV0, UV1) 대응을 위한 `texCoord_index` 처리 및 `u32` 기반의 안정적인 선택 로직 검증.

---

## 📅 업데이트 히스토리
- **2026-02-18**: 문서 최초 생성. 주요 파편화 지점 5개 항목 리스트업.
- **2026-02-19**: 전 항목 점검 완료 및 `getKHRTextureTransformUV` 통합 완료.
