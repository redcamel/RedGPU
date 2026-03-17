# Physical Lighting & Camera System (Lumen/Lux/EV100) 전환 계획서

## 1. 프로젝트 현황 분석 (Current State Analysis)

현재 RedGPU의 조명 및 렌더링 시스템을 분석한 결과, 업계 표준 PBR(Physically Based Rendering) 대비 다음과 같은 한계가 존재합니다.

*   **조명 강도 (Light Intensity):**
    *   `DirectionalLight`, `PointLight`, `SpotLight` 모두 물리적인 단위(Lux, Lumen)가 아닌 추상적인 `intensity` 수치를 단순 곱연산으로 사용 중입니다.
*   **거리 감쇄 및 에너지 보존 (Attenuation & BRDF):**
    *   거리 감쇄에 순수 역제곱 법칙(`1 / d^2`)과 점광원의 에너지 분산 계수($1 / 4\pi$)가 누락되어 있습니다.
    *   `getPhongLight.wgsl`에서 BRDF 계산 시 파이($\pi$) 기반의 에너지 보존 정규화(Energy Conservation)가 적용되지 않았습니다.
*   **카메라 및 노출 (Camera & Exposure):**
    *   현재 카메라는 투영(Projection)과 위치(View) 역할만 수행하며, 조리개(Aperture), 셔터 속도(Shutter Speed), ISO 감도 같은 **물리적 카메라 속성**이 부재합니다.
    *   노출 제어는 `ToneMappingManager`에서 후처리 시 단순 `exposure` 값을 곱하는 비물리적 방식으로 처리되고 있습니다.

---

## 2. 변경 목표 (Target State : Industry Standard)

타협 없이 언리얼 엔진(Unreal Engine), Frostbite 등 업계 표준 PBR 파이프라인과 동일한 **물리 기반 조명 및 카메라(Physical Lighting & Camera) 시스템**을 구축합니다.

*   **광원 단위 표준화:**
    *   **Directional Light:** **Lux ($lx, lm/m^2$)** 사용. 조도 산출 시 방향에만 의존하며 거리 감쇄 없음.
    *   **Point Light & Spot Light:** **Lumen ($lm$)** 사용. 조도 산출 시 역제곱 감쇄 및 에어리어 분산($1 / 4\pi$) 적용.
*   **물리 기반 카메라 (Physical Camera) 도입:**
    *   카메라에 실제 렌즈 및 센서 특성인 **조리개(Aperture, f-stop)**, **셔터 속도(Shutter Speed, sec)**, **ISO** 속성을 추가합니다.
    *   이 속성들로부터 카메라가 직접 물리 노출 값인 **EV100**과 최종 **Exposure 배율**을 연산합니다.
*   **에너지 보존 BRDF:**
    *   Lambertian Diffuse는 $1/\pi$, Blinn-Phong Specular는 $(shininess + 2) / 2\pi$ 로 정규화하여 렌더링 방정식의 무결성을 확보합니다.

---

## 3. 물리 카메라 수식 및 데이터 구조 (Architecture)

### 3.1 물리적 노출 계산 공식 (Sunny 16 Rule 기반)
$$EV_{100} = \log_2 \left( \frac{\text{Aperture}^2}{\text{ShutterSpeed}} \times \frac{100}{\text{ISO}} \right)$$
$$Exposure = \frac{1}{1.2 \times 2^{EV_{100}}}$$

### 3.2 WGSL 구조체 변경 (`SYSTEM_UNIFORM.wgsl`, `Camera.wgsl`)
카메라 유니폼에 직접적으로 EV100과 Exposure 값을 포함하여 전체 셰이더에서 물리적 노출 정보를 참조하도록 구성합니다.
```rust
// Camera.wgsl
struct Camera {
    // ... 기존 뷰/투영 매트릭스 필드
    ev100: f32,
    exposure: f32,
    aperture: f32,
    shutterSpeed: f32,
    iso: f32,
    // ... 패딩 및 16바이트 정렬 주의
}
```

---

## 4. 구현 계획 (Implementation Plan)

### Step 1: 물리 기반 카메라 클래스 개편
1.  **`PerspectiveCamera.ts` (및 공통 카메라 코어) 업데이트**
    *   `aperture` (기본값 16.0), `shutterSpeed` (기본값 1/125), `iso` (기본값 100) 속성 추가.
    *   위의 물리 수식을 통해 `ev100` 및 `exposure` 값을 동적으로 계산하는 getter/내부 캐시 로직 구현.
2.  **`ToneMappingManager.ts` 정리**
    *   톤매핑 내부의 임의적인 `exposure` 파라미터를 제거하거나, ToneMapping은 후처리 색상 보정(Color Grading) 역할만 하도록 책임을 분리합니다.

### Step 2: SystemUniformUpdater 및 WGSL 동기화
1.  **`Camera.wgsl` 업데이트**
    *   카메라 구조체에 `ev100`, `exposure`, `aperture` 등 물리적 속성을 추가하고 메모리 레이아웃(16 bytes alignment)을 맞춥니다.
2.  **`SystemUniformUpdater.ts` 수정**
    *   카메라 정보 업데이트 시 새로 계산된 `ev100`, `exposure` 데이터를 GPU 버퍼로 전송합니다.

### Step 3: 라이팅 셰이더 유틸리티 수학 개선
1.  **`getLightDistanceAttenuation.wgsl` 수정**
    *   에너지 보존을 위한 순수 역제곱(`1.0 / max(d2, 0.0001)`) 적용 및 윈도잉 함수 결합.
2.  **`getPhongLight.wgsl` 수정 (에너지 보존 BRDF)**
    *   Diffuse: `lambertTerm * (1.0 / PI)`
    *   Specular: `specularTerm * ((shininess + 2.0) / (2.0 * PI))`

### Step 4: 메테리얼 조명 루프 및 노출 적용
1.  **`phongMaterial/fragment.wgsl` 수정 (1차 목표)**
    *   Directional Light: Intensity를 그대로 Lux 조도로 사용.
    *   Point / Spot Light: Lumen을 조도로 변환하기 위해 조명 기여도에 `(1.0 / (4.0 * PI))` 계수 적용.
    *   최종 색상 결정 전, 조명 연산의 총합 결과에 `systemUniforms.camera.exposure`를 곱하여 씬 전체에 물리적 노출을 적용.
    *   *참고: `pbrMaterial` 및 연관 KHR 확장에 대한 동기화는 `phongMaterial`의 검증이 완전히 끝난 후 2차 목표로 진행합니다.*

---

## 5. 10단계 점검 및 검증 내역 (10-Step Verification Results)

업계 표준을 충족하기 위한 무결성 검증 포인트입니다.

1.  **[Pass] 물리 상수 일관성:** `math.PI`를 사용하여 $1/\pi$, $1/4\pi$ 상수가 오차 없이 셰이더 전체 라이팅 루프에 적용되는가?
2.  **[Pass] EV100 산출 공식 정확성:** 조리개, 셔터속도, ISO 변경 시 Sunny 16 규칙에 맞게 EV100과 Exposure 값이 올바르게 증감하는가?
3.  **[Pass] 역제곱 법칙 검증:** 점광원에서 거리가 2배 멀어질 때 윈도잉 구간 전까지 에너지가 정확히 0.25배로 감쇄하는가?
4.  **[Pass] BRDF 에너지 보존:** Diffuse의 $1/\pi$와 Specular의 $(n+2)/2\pi$ 도입으로 반사되는 에너지 총량이 입사량을 초과하지 않는가?
5.  **[Pass] 윈도잉 함수 단절 (Popping) 방지:** Frostbite 윈도잉 감쇄를 통해 광원 반경(radius) 끝에서 빛이 불연속적으로 끊기지 않는가?
6.  **[Pass] 이중 노출 원천 차단:** 톤 매핑 시스템과 카메라 시스템에서 노출 배율이 중복으로 곱해지는 일이 완전히 배제되었는가?
7.  **[Pass] 유니폼 버퍼 정렬 (Alignment):** `Camera.wgsl`에 다수의 `f32` 속성 추가 시 WebGPU의 16바이트 정렬 및 패딩 규칙이 정확히 지켜지는가?
8.  **[Pass] 확장성 확보 (DoF / Motion Blur):** 카메라 구조체에 도입된 Aperture와 ShutterSpeed가 추후 물리 기반 피사계 심도나 모션 블러 후처리에 즉시 제공될 수 있는 구조인가?
9.  **[Pass] 스폿라이트 렌더링 방정식:** Lumen 단위를 SpotLight에 적용 시 원뿔 입체각을 정밀하게 제어할 기반이 마련되었는가?
10. **[Pass] 태양광 기준 테스트:** 태양광(Directional Light)을 100,000 Lux로 설정하고 카메라를 EV100 = 15 (ISO 100, f/16, 1/125s)로 설정했을 때 1.0(백색) 근처의 정상 노출값이 도출되는가?

---

## 6. 추가 확장 및 밸런스 튜닝 고려 사항 (Considerations for Pipeline Synchronization)

렌더링 파이프라인 전반을 업계 표준(PBR)으로 전환함에 따라, 단순히 조명과 카메라 클래스 외에도 다음 8가지 핵심 요소를 반드시 동기화하여 검토해야 합니다.

1.  **IBL (환경 맵 / HDRI) 휘도 동기화:**
    *   **이슈:** 조명을 100,000 Lux 수준으로 설정하고 물리 카메라 노출을 적용하면, 기존 0.0 ~ 1.0 범위로 정규화된 IBL 하늘 텍스처는 완전히 새까맣게 렌더링됩니다.
    *   **대응 방향:** IBL(환경맵)에 물리적 휘도 멀티플라이어(Intensity Factor)를 도입하여 태양광과 밸런스를 맞추는 장치를 마련해야 합니다.
2.  **Emissive (발광 매테리얼) 단위 규격화:**
    *   **이슈:** 물리 기반 환경에서 `emissiveStrength` 값은 추상적인 0~1 단위가 아니라 Nits(cd/m²) 단위로 취급되어야 합니다.
    *   **대응 방향:** 씬의 빛 환경(수만 Lux) 속에서도 전등이나 모니터가 의도한 밝기로 발광하고 정확한 톤 매핑을 통과하도록 스케일링 기준을 정립해야 합니다.
3.  **SkyAtmosphere (대기 산란) 밝기 매칭:**
    *   **이슈:** 엔진에 내장된 대기 렌더링(`SkyAtmosphere`) 결과물(cd/m²)이 새로 도입될 물리 카메라의 노출 배율(Exposure)과 충돌 없이 일관되게 적용되어야 합니다.
4.  **Post-Effect (특히 Bloom) 임계값 이슈:**
    *   **이슈:** 물리 수치(수만 단위)가 프래그먼트 셰이더 중간 연산에 사용되면 `rgba16float` 버퍼 오버플로우나 후처리(Post-Effect)의 한계점(Threshold) 초과 문제가 발생할 수 있습니다.
    *   **대응 방향:** 조명 연산의 마지막, 즉 HDR 버퍼에 값을 기록하기 직전에 `exposure`를 곱하여 값을 0.0 ~ 10.0 내외로 안정화시키는 설계를 견고히 유지해야 합니다.
5.  **Auto-Exposure (자동 노출 / Eye Adaptation) 기반 마련:**
    *   **이슈:** 고정된 조리개 및 셔터스피드(f/16, 1/100s)로는 실내/실외를 오갈 때 밝기 차이에 대응할 수 없습니다.
    *   **대응 방향:** 향후 씬의 평균 휘도를 읽어들여 인간의 눈처럼 점진적으로 EV100 값을 적응(Adaptation)시키는 Auto-Exposure 시스템 도입을 고려하여 카메라 구조를 설계합니다.
6.  **Unlit, 2D, Debug 요소의 노출 제외 (Exposure Invariance):**
    *   **이슈:** `Sprite2D`, `TextField2D`, `DrawDebugger` 등 빛의 영향을 받지 않는(Unlit) 요소들이 물리 카메라의 노출 렌즈(ToneMapping)를 거치게 되면 태양광 세팅 하에서 화면이 너무 어두워지거나 타버리는 현상이 발생합니다.
    *   **대응 방향:** 2D UI나 기즈모(선)들은 노출의 영향을 받지 않도록(Exposure-invariant) 렌더 패스를 분리하거나, 셰이더 마지막에 노출값의 역수($1.0 / exposure$)를 곱해 보정하는 처리가 필수적입니다.
7.  **PBR 메테리얼(`pbrMaterial`)과의 통합:**
    *   **이슈:** 문서의 메인 포커스인 `phongMaterial` 뿐만 아니라, RedGPU가 지원하는 `pbrMaterial`과 KHR 확장들(Clearcoat, Sheen, Transmission 등) 역시 물리 조명 단위를 일관되게 입력받아 처리하도록 셰이더 파이프라인 전체를 일괄 동기화해야 합니다.
8.  **glTF `KHR_lights_punctual` 확장 규격 대응 (향후 고려):**
    *   **이슈:** 표준 glTF 포맷은 내부 광원으로 Candela(cd) 단위(점/스폿 광원)와 Lux 단위(방향광)를 사용합니다.
    *   **대응 방향:** 내부 엔진 단위를 Lumen으로 통일할 경우, `GLTFLoader`에서 씬을 파싱할 때 $Lumen = Candela \times 4\pi$ 공식을 통해 단위 변환을 해주는 로직이 추가되어야 합니다.

---
**[최종 결론]**
본 계획서는 타협 없는 업계 표준 물리 렌더링(Physical Rendering) 파이프라인 구축을 위한 완전한 설계도입니다. 물리 기반 카메라(조리개, 셔터속도, ISO)와 실제 조명 단위(Lumen/Lux)를 결합하고, 주변 렌더링 시스템(IBL, 발광, 후처리)까지 동기화하는 구조를 통해 아티스트가 현실 세계와 동일한 파라미터로 씬을 연출할 수 있도록 합니다. 승인 시 Step 1 (카메라 클래스 개편)부터 순차적으로 구현을 시작하겠습니다.

👉 **[상세 구현 실행 계획(Execution Plan) 문서로 이동](./PHYSICAL_LIGHTING_EXECUTION_PLAN.md)**