# Physical Lighting & Camera System - 구현 실행 계획 (Execution Plan)

본 문서는 `PHYSICAL_LIGHTING_SPEC_FINAL.md`의 명세를 바탕으로 시스템 전체를 물리 기반(PBR)으로 안전하게 전환하기 위한 단계별 실행 계획입니다. 각 페이즈는 독립적으로 테스트 가능하도록 구성됩니다.

---

## Phase 1: 물리 기반 카메라 기반 마련 (Physical Camera Foundation) [완료]
가장 먼저 빛을 받아들이는 '카메라'에 물리적 속성을 부여하고 GPU로 전송합니다.

1. **[완료] 카메라 클래스 개편**
   - **대상:** `src/camera/camera/PerspectiveCamera.ts`, `Camera2D.ts`, `OrthographicCamera.ts` 등
   - **작업:** `aperture`(조리개), `shutterSpeed`(셔터 속도), `iso` 속성 추가.
   - **작업:** `ev100` 및 `exposure` 자동 계산 로직(Sunny 16 Rule) 구현.
2. **[완료] GPU 유니폼 연동**
   - **대상:** `src/systemCodeManager/shader/systemStruct/Camera.wgsl`
   - **작업:** `ev100`, `exposure`, `aperture`, `shutterSpeed`, `iso` 필드 추가 및 16-byte 메모리 정렬(Alignment) 확인.
   - **대상:** `src/renderer/SystemUniformUpdater.ts`
   - **작업:** 추가된 카메라 속성을 Float32Array로 파싱하여 전달하는 로직 추가.
3. **[완료] ToneMappingManager 노출 이관**
   - **대상:** `src/toneMapping/ToneMappingManager.ts`
   - **작업:** 후처리의 임의적인 `exposure` 기능을 비활성화하거나 역할 분리. 노출 권한을 물리 카메라로 일원화.

---

## Phase 2: 라이팅 유틸리티 물리 공식 적용 (Light Math & Attenuation)
조명의 감쇄 및 반사 연산(BRDF)에 에너지 보존 법칙을 도입합니다.

1. **물리적 거리 감쇄 (Inverse Square Law)**
   - **대상:** `src/systemCodeManager/shader/lighting/getLightDistanceAttenuation.wgsl`
   - **작업:** 순수 역제곱 법칙(`1 / d^2`)과 Frostbite 방식의 윈도잉 함수 결합 적용.
2. **에너지 보존 BRDF 정규화**
   - **대상:** `src/systemCodeManager/shader/lighting/getPhongLight.wgsl`
   - **작업:** Diffuse 부분에 $1/\pi$, Specular 부분에 $(shininess + 2) / 2\pi$ 정규화 계수 적용.

---

## Phase 3: 메테리얼 조명 루프 & 물리 노출 반영 (Material & Exposure)
광원(Lux/Lumen)을 계산하고 최종 렌더링 색상에 카메라의 노출을 적용합니다. (1차로 Phong 메테리얼만 진행)

1. **Phong 메테리얼 수정**
   - **대상:** `src/material/phongMaterial/fragment.wgsl`
   - **작업:** Point/Spot Light 조명 연산에 $1/4\pi$ 적용 (Lumen -> 조도 변환).
   - **작업:** 렌더링 색상 최종 결정 시 `systemUniforms.camera.exposure`를 곱하여 물리적 노출 반영.
*(참고: `pbrMaterial` 수정은 Phong 메테리얼 안정화 이후 별도의 후속 페이즈에서 진행합니다.)*

---

## Phase 4: Auto-Exposure (Eye Adaptation) 및 엔진 편의성
수동 카메라 세팅의 한계를 극복하고 생태계 전반을 맞추기 전, 범용 렌더링 엔진으로서의 사용성을 확보하기 위해 필수적으로 자동 노출 시스템을 먼저 도입합니다.

1. **휘도 계산 및 Auto-Exposure 렌더 패스**
   - **대상:** `src/postEffect/` 관련 신규 패스 및 `ToneMappingManager`
   - **작업:** 씬의 이전 프레임 평균 휘도(Luminance)를 계산하고, 밝기 변화에 따라 동적으로 노출 배율(Exposure)을 서서히 조절하는 Eye Adaptation 후처리 패스 구현.

---

## Phase 5: 생태계 밸런스 동기화 (Ecosystem Synchronization)
물리적 조명(수만 Lux)과 카메라 자동/수동 노출이 도입됨에 따라 기존 렌더링 요소들의 밸런스를 맞춥니다.

1. **IBL (환경 맵) 휘도 스케일링**
   - **대상:** `IBL` 관련 클래스 및 환경맵 샘플링 셰이더
   - **작업:** 0~1 값인 환경맵이 물리광 속에서도 보이도록 `luminance multiplier` 변수 추가 및 연동.
2. **Emissive (발광) 단위 규격화**
   - **대상:** `phongMaterial`, `pbrMaterial` 셰이더 내부
   - **작업:** `emissiveStrength`를 물리적 Nits(cd/m²) 단위처럼 취급하여, 최종 노출값이 적용되기 전 물리 환경에 맞게 스케일링.
3. **SkyAtmosphere 동기화**
   - **대상:** `src/display/skyAtmosphere/` 관련 파일
   - **작업:** 하늘 렌더링 결과에 씬의 카메라 물리 노출(Exposure)이 올바르게 반영되도록 보정.
4. **Post-Effect (특히 Bloom) 임계값 보정**
   - **대상:** `src/postEffect/effects/oldBloom/` 등 임계값 기반 이펙트들
   - **작업:** 조명 연산의 결과가 물리 수치로 치솟았다가 HDR 버퍼에 쓰기 직전 노출을 통해 안정화됨을 고려하여, 기존 Post-Effect의 Threshold 값들이 정상적으로 작동하는지 검토 및 보정.

---

## Phase 6: Unlit 및 2D 요소 노출 분리 (Exposure Invariance)
태양광 기준의 노출 시스템 때문에 UI나 기즈모가 까맣게 타거나 어두워지는 현상을 방지합니다.

1. **2D 및 디버그 객체 노출 보정**
   - **대상:** `Sprite2D`, `TextField2D`, `DrawDebugger` 셰이더 등 (Unlit 계열)
   - **작업:** 물리 노출을 거치지 않게 하거나, 셰이더 최종 아웃풋에 역노출($1.0 / exposure$)을 곱하여 노출값의 영향을 상쇄.

---

## Phase 7: 외부 포맷 연동 (GLTF Loader)
표준 포맷을 RedGPU의 물리 시스템 규격에 맞게 변환합니다.

1. **GLTF 조명 확장 대응**
   - **대상:** `src/loader/gltf/GLTFLoader.ts` (향후 `KHR_lights_punctual` 로더 부분)
   - **작업:** 표준 Candela 단위를 점/스폿 광원 로드 시 Lumen($Lumen = cd \times 4\pi$)으로 변환하여 엔진에 주입.

---

## Phase 8: 통합 검증 및 테스트 (Integration & Verification)
1. 태양광(Directional Light) 100,000 Lux 설정 및 실내 조명(500 Lux) 설정 교차 검증.
2. 수동 노출(EV100 = 15) 및 자동 노출(Auto-Exposure) 모드 전환 테스트.
3. 씬(PBR, IBL, SkyAtmosphere, 2D) 전체의 밝기가 정상적으로 렌더링되는지 최종 점검.

---

## Phase 9: 향후 고도화 과제 (Future Enhancements)
1차 목표(Phong 기반) 검증이 완전히 끝난 후 진행할 핵심 아키텍처 고도화 작업입니다.

1. **PBR 메테리얼(`pbrMaterial`) 통합**
   - **작업:** KHR 확장들(Clearcoat, Sheen, Transmission 등)에 대한 물리 조명 단위 동기화 및 노출 적용.