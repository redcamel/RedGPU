# [Checklist] Shader Library Consistency & System Coordinates

## 1. 개요 (Overview)
RedGPU 엔진의 표준 좌표계(Right-handed, Y-Up, V-Down, NDC Y-Up)와 glTF 2.0 물리 표준이 `SystemCodeManager` 내의 개별 셰이더 라이브러리에 일관되게 적용되었는지 점검하기 위한 체크리스트입니다.

---

## 🔍 일관성 점검 및 수정 대상 리스트

### 1. 노멀 맵 디코딩 표준화 (Normal Map Decoding)
*   **대상**: `src/systemCodeManager/shader/math/tnb/getNormalFromNormalMap.wgsl`
*   **문제점**: 라이브러리 함수 내부에서 glTF 표준인 Green(Y) 채널 반전을 처리하지 않음. 이로 인해 각 재질(`pbrMaterial` 등)에서 개별적으로 `1.0 - g` 처리를 하고 있어 로직이 파편화됨.
*   **체크사항**:
    - [ ] 함수 내부에서 `sampledNormal.y = 1.0 - sampledNormal.y` 처리를 강제하여 엔진 표준화.
    - [ ] 기존 재질들에서 중복된 반전 로직 제거.

### 2. TBN 기저 구축 일관성 (TBN Basis Construction)
*   **대상**: 
    - `math.tnb.getTBN`
    - `math.tnb.getTBNFromVertexTangent`
    - `math.tnb.getTBNFromCotangent`
*   **문제점**: 외적(Cross Product) 순서와 행렬 구성 방식이 엔진 명세($N 	imes T = B$)를 따르고 있으나, 일반적인 그래픽스 공식($T 	imes B = N$)과 혼용될 경우 Handedness(좌/우수계)가 뒤집힐 위험이 있음.
*   **체크사항**:
    - [ ] 세 가지 방식의 TBN 결과가 동일한 방향성을 가지는지 전수 검증.
    - [ ] `VertexTangent`의 `w` 성분(Handedness)이 모든 TBN 생성 함수에서 올바르게 반영되는지 확인.

### 3. 스크린 공간 미분과 좌표계 (Derivatives & Screen Space)
*   **대상**: `src/systemCodeManager/shader/math/tnb/getTBNFromCotangent.wgsl`
*   **문제점**: WebGPU의 스크린 좌표계는 **Y-Down**임. `dpdy`를 사용하여 TBN을 구할 때, 월드 Y-Up과 충돌하여 Bitangent 방향이 반전될 수 있음.
*   **체크사항**:
    - [ ] `dpdy(uv)` 결과가 스크린 Y-Down 환경에서 올바른 탄젠트 평면을 형성하는지 테스트.
    - [ ] 미러링된 UV를 가진 모델에서 미분 기반 TBN이 깨지지 않는지 검증.

### 4. 물리적 그림자 가시성 (Physical Shadow Visibility)
*   **대상**: `src/systemCodeManager/shader/shadow/getDirectionalShadowVisibility.wgsl`
*   **문제점**: `minVisibility = 0.2 + depthFactor * 0.6`과 같은 레거시 보정값이 포함되어 있음. 이는 물리 기반 렌더링(PBR)의 조명 감도를 인위적으로 왜곡함.
*   **체크사항**:
    - [ ] 레거시 보정 로직을 라이브러리에서 분리하거나 옵션화.
    - [ ] 순수 물리 가시성(0.0 ~ 1.0)만 반환하도록 함수 구조 개선.

### 5. 역투영 및 공간 복구 일관성 (Space Reconstruction)
*   **대상**: 
    - `math.reconstruct.getNDCFromDepth`
    - `math.reconstruct.getWorldPositionFromDepth`
*   **상태**: 현재 양호 (V-Down -> NDC Y-Up 보정 적용됨).
*   **체크사항**:
    - [ ] 향후 추가될 `getViewNormal` 등의 함수에서도 동일한 Y-축 반전 공식이 유지되는지 감시.

---

## 📅 업데이트 히스토리
- **2026-02-18**: 문서 최초 생성. 주요 파편화 지점 5개 항목 리스트업.
