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
*   **대상**: `KHR.KHR_texture_transform.getKHRTextureTransformUV`
*   **결과**: ✅ 완료.
    - `KHR_texture_transform` 확장 규격에 따른 TRS(Translation, Rotation, Scale) 행렬 합성 방식 준수.
    - 파편화된 `get_transformed_uv` 로직을 `KHR` 전용 공통 라이브러리로 통합.
    - 멀티 UV(UV0, UV1) 대응을 위한 `texCoord_index` 처리 및 `u32` 기반의 안정적인 선택 로직 검증.

### 9. 수치적 안정성 및 0 나누기 방어 (Numerical Stability)
*   **대상**: 엔진 전역 셰이더 함수
*   **결과**: ✅ 완료.
    - 파편화된 매직 넘버(`0.0001`, `0.001` 등)를 제거하고 시스템 표준 `math.EPSILON`으로 일원화.
    - `getIridescentFresnel`, `getTransmissionRefraction`, `getAnisotropicVisibility` 등 모든 나눗셈 연산의 분모에 `max(..., EPSILON)` 방어 로직 적용 확인.
    - IOR 최소 임계값(`1.0 + EPSILON`) 설정을 통해 굴절 벡터 계산 시의 수치적 발산 방지 검증.

### 10. glTF 확장 규격 표준화 (KHR Extensions)
*   **대상**: `MaterialsSheen`, `MaterialsAnisotropy`
*   **결과**: ✅ 완료.
    - `KHR_materials_sheen`: Charlie 모델 기반 DFG, E, Lambda, IBL 기능 분리 및 라이브러리화 완료.
    - `KHR_materials_anisotropy`: 이방성 NDF, 가시성, Specular BRDF 라이브러리화 및 `pbrMaterial` 통합 완료.
    - 모든 확장 규격 함수를 `KHR.KHR_xxxx` 네임스페이스와 전용 폴더 구조로 계층화하여 관리.

### 11. 디스플레이스먼트 매핑 일관성 (Displacement Mapping)
*   **대상**: `displacement.getDisplacementPosition`, `displacement.getDisplacementNormal`
*   **결과**: ✅ 완료.
    - **파일 분리**: `calcDisplacements.wgsl`을 기능별 개별 파일로 분리하고 전용 폴더(`shader/displacement/`)로 이동.
    - **명칭 표준화**: `get` 접두어 기반 CamelCase 명칭 규칙 적용 완료.
    - **좌표계 최적화**: WebGPU의 V-Down 환경에 맞춰 `ddy` 부호(down - up)를 교정하고, 월드 공간 TBN 기반 섭동 로직을 통해 회전 시의 법선 왜곡 문제 해결.
    - **시스템 통합**: `SystemCodeManager.displacement` 네임스페이스를 통해 라이브러리화 완료.

### 12. 시스템 셰이더 중복 제거 및 일원화 (System Shader Redundancy Cleanup)
*   **대상**: `src/resources/systemCode/SystemCode.ts`, `src/resources/systemCode/shader/vertex/index.ts` (SystemVertexCode)
*   **결과**: ✅ 완료.
    - **레거시 인덱스 파일 완전 삭제**: `SystemCode.ts` 및 `SystemVertexCode` (index.ts)를 폐지하여 셰이더 관리 포인트를 `SystemCodeManager`로 일원화.
    - **내부 의존성 정리**: `View3D.ts`, `src/index.ts` 등 엔진 핵심부에서 사용하던 레거시 참조를 `SystemCodeManager`로 전환 완료.
    - **아키텍처 정규화**: 모든 시스템 및 공통 라이브러리 접근을 단일 레지스트리로 통합하여 셰이더 인프라의 투명성과 유지보수성을 극대화함.

### 13. TypeScript 임포트 정규화 및 직접 참조 제거 (TypeScript Import Normalization)
*   **대상**: 엔진 전반의 `.ts` 파일
*   **결과**: ✅ 완료.
    - `View3D.ts`, `PostEffectManager.ts`, `SkyAtmosphere.ts`, `TAA.ts` 등에서 시스템 WGSL 파일(`SYSTEM_UNIFORM`, `POST_EFFECT_SYSTEM_UNIFORM` 등)을 직접 `import` 하던 로직을 모두 제거.
    - 모든 공통 셰이더 리소스 접근을 `SystemCodeManager` 속성 참조로 일원화하여, 향후 셰이더 경로 변경 시 `SystemCodeManager.ts` 한 곳만 수정하면 되는 구조 확립.

### 14. 시스템 구조체 및 유니폼 파일 정규화 (System Structs & Uniforms Normalization)
*   **대상**: `SYSTEM_UNIFORM.wgsl`, `POST_EFFECT_SYSTEM_UNIFORM.wgsl`
*   **결과**: ✅ 완료.
    - **디렉토리 집결**: 모든 전역 시스템 데이터 규격 파일을 `src/systemCodeManager/shader/systemStruct/` 하위로 이동하여 관리 일원화.
    - **명명 규칙 정규화**: 시스템 차원의 핵심 유니폼 파일명을 대문자로 통일하여 가시성 및 중요도 명시.
    - **경로 최적화**: `src/resources/systemCode/` 등 불필요해진 레거시 경로 삭제 완료.

### 15. 클러스터 라이팅 명칭 및 모듈화 정규화 (Cluster Lighting Normalization)
*   **대상**: `src/light/clusterLight/` 전역
*   **결과**: ✅ 완료.
    - **명칭 정규화**: `ClusterLightCell` (데이터 단위), `ClusterLightGrid` (데이터 컨테이너), `ClusterCellBounds` (기하 영역 단위), `ClusterBoundsGrid` (기하 영역 컨테이너)로 계층적 명칭 확립.
    - **캡슐화 및 폴더링**: `core`, `pass/bound`, `pass/light` 구조로 세분화하여 모듈 내부 응집도 향상.
    - **전역 레지스트리 정화**: `ClusterCellBounds` 등 특정 패스 전용 구조체를 `SystemCodeManager`에서 제거하고, TypeScript에서 문자열 결합 방식으로 주입하여 전역 네임스페이스 오염 방지.
    - **최적화**: 해상도 변경 감지(Dirty Checking) 기반의 클러스터 경계 재계산 로직 적용.

### 16. 셰이더 수학 상수 통합 (Shader Constant Integration)
*   **대상**: 엔진 전역 `.wgsl` 파일
*   **결과**: ✅ 완료.
    - **EPSILON 통일**: 하드코딩된 `0.0001`, `1e-4` 등의 값을 시스템 표준 `math.EPSILON`(1e-6)으로 일원화하여 연산 정밀도 및 일관성 확보.
    - **수학 라이브러리 활용**: `#redgpu_include math.EPSILON`, `math.PI2` 등을 활용하여 매직 넘버 제거 및 중앙 관리 체계 확립.

### 17. 정점 셰이더 I/O 명칭 정규화 (Vertex Shader I/O Normalization)
*   **대상**: `src/display/**/shader/*.wgsl` 및 시스템 엔트리 포인트
*   **결과**: ✅ 완료.
    - **입력 구조체**: 모든 정점 셰이더의 입력을 `InputData`로 통일.
    - **출력 구조체**: 모든 정점 셰이더의 출력을 `VertexOutput`으로 통일.
    - **호환성 확보**: 시스템 엔트리 포인트(`mesh`, `billboard`, `empty` 등)와 디스플레이 객체 간의 타입 불일치를 해결하여 공통 라이브러리 활용도 극대화.

### 18. 공중 투시 시스템 통합 (Aerial Perspective Integration)
*   **대상**: `skyAtmosphere.getAerialPerspective`
*   **결과**: ✅ 완료.
    - **모듈화**: `ColorMaterial` 내에 파편화되어 있던 공중 투시 로직을 시스템 공통 라이브러리(`skyAtmosphere`)로 이주 완료.
    - **범용성**: `getAerialPerspective(color, worldPos)` 인터페이스를 통해 모든 재질에서 단 한 줄로 대기 산란 효과를 적용할 수 있도록 구현.
    - **호출부 최적화**: 함수 내부의 조건문을 제거하고 호출 측(머티리얼)에서 `useSkyAtmosphere` 활성 여부를 체크하도록 구조를 변경하여 런타임 성능 최적화.
    - **물리적 정합성**: `SkyAtmosphere` 시스템의 태양 강도, 노출, LUT 데이터를 활용하여 하늘 배경과 오브젝트 간의 물리적 밝기 동기화 확인.

### 19. 대기 태양광 조명 연동 (Atmosphere Sun Light Integration)
*   **대상**: `skyAtmosphere.getAtmosphereSunLight`
*   **결과**: ✅ 완료.
    - **데이터 공유**: `SkyAtmosphere` 시스템의 태양 위치(Surface-to-Light 벡터), 카메라 고도, 대기 파라미터를 모든 머티리얼이 접근 가능한 `systemUniforms`에 공유.
    - **조명 통합**: `PhongMaterial`, `PBRMaterial`의 조명 루프에 대기 태양광(Sun Light) 계산 로직을 통합하여, 하늘의 태양 위치와 물체의 음영이 실시간으로 연동되도록 구현.
    - **물리적 색상**: 투과율 LUT 샘플링을 통해 태양 고도에 따른 실시간 색상 변화(노을 효과 등)를 물리적으로 재현.
    - **표준 준수**: 언리얼 엔진 등 상용 엔진에서 사용하는 `SunDirection` 명칭과 `Surface-to-Light` 벡터 데이터 성격을 일관되게 적용.

### 20. 레거시 별칭 제거 및 네임스페이스 단일화 (Legacy Alias Cleanup)
*   **대상**: `SystemCodeManager.ts` 및 전역 `.wgsl` 인클루드
*   **결과**: ✅ 완료.
    - **별칭 삭제**: `calcTintBlendMode`, `getBillboardMatrix` 등 `SystemCodeManager` 하단에 존재하던 중복 별칭들을 전량 제거.
    - **경로 정규화**: 모든 셰이더 코드(`textField`, `sprite`, `particle`, `mesh`) 내의 `#redgpu_include` 경로를 `math.billboard`, `systemStruct`, `skyAtmosphere` 등 표준 네임스페이스 기반으로 전수 교체 완료.
    - **유지보수성**: 코드베이스 내의 셰이더 참조 경로를 일원화하여 향후 라이브러리 변경 시 영향 범위를 최소화함.

### 21. Phong 조명 계산 통합 (Phong Lighting Unification)
*   **대상**: `lighting.getPhongLight`
*   **결과**: ✅ 완료.
    - **공식 표준화**: Lambert Diffuse 및 Phong Specular 계산식을 시스템 라이브러리로 추출하여 물리적 일관성 확보.
    - **코드 중복 제거**: `PhongMaterial` 내의 Directional, SkyAtmosphere Sun, Point/Spot Light 계산 루프를 하나의 공통 함수로 통합 완료.
    - **안정성**: 입사광 반사 로직(`reflect(-L, N)`)을 내장하여 호출부의 방향성 계산 오류 가능성 제거.

### 22. 인스턴싱 메쉬 시스템 정규화 (InstancingMesh Normalization)
*   **대상**: `src/display/instancingMesh/` 전역 및 셰이더
*   **결과**: ✅ 완료.
    - **데이터 정렬 최적화**: `InstanceUniforms` 구조체를 16바이트 단위로 재정렬하고 명시적 패딩(`vec2<f32>`)을 추가하여 버퍼 오프셋 오염 방지.
    - **그룹 노말 행렬 도입**: `instanceGroupNormalModelMatrix`를 추가하여 인스턴스 그룹 전체의 변환이 법선(Normal)에 정확히 반영되도록 수정.
    - **월드 좌표 계산 교정**: 버텍스 셰이더에서 그룹 변환 행렬을 누락하던 문제를 수정하여 공중 투시(`getAerialPerspective`) 및 그림자가 올바른 위치에서 연산되도록 보장.
    - **셰이더 동기화**: 컬링 컴퓨트 셰이더(`instanceCullingCompute.wgsl`)와 렌더링 셰이더 간의 데이터 구조를 100% 일치시켜 파이프라인 무결성 확보.

### 23. 머티리얼별 대기 효과 개별 제어 (Per-Material Atmosphere Control)
*   **대상**: `ABaseMaterial` 및 모든 프래그먼트 셰이더
*   **결과**: ✅ 완료.
    - **속성 추가**: `ABaseMaterial`에 `useAtmosphere` 속성을 추가하고 기본값을 `true`로 설정.
    - **유니폼 동기화**: 모든 재질의 `Uniforms` 구조체에 `useAtmosphere: u32` 필드를 추가하여 런타임 제어 기반 마련.
    - **런타임 최적화**: 셰이더 내에서 `systemUniforms.useSkyAtmosphere`와 `uniforms.useAtmosphere`를 동시에 체크하도록 수정하여, 시스템이 켜져 있어도 특정 객체만 대기 효과를 제외할 수 있는 유연성 확보.

### 24. IBL 대기 산란 동기화 (IBL Atmospheric Synchronization)
*   **대상**: `PBRMaterial` 및 `SYSTEM_UNIFORM`
*   **결과**: ✅ 완료.
    - **전역 바인딩 확장**: `skyViewTexture`를 시스템 유니폼 그룹(Group 0, Binding 16)에 추가하여 모든 재질에서 실시간 하늘 데이터를 참조할 수 있도록 인프라 확장.
    - **물리적 필터링**: PBR 셰이더 내에서 IBL(Diffuse/Specular) 샘플링 시, 반사/법선 방향의 대기 투과율(`Transmittance`)과 산란광(`Sky-View`)을 합성하는 물리적 필터 적용.
    - **대기 주변광 폴백(Fallback)**: IBL 텍스처가 없는 경우, `SkyAtmosphere` 시스템에서 계산된 실시간 주변광(`skyAtmosphereAmbientColor`)을 기초값으로 사용하여 물체가 대기색을 머금도록 보완.
    - **시각적 정합성**: 정적인 HDR 텍스처 사용 여부와 관계없이 대기 상태(노을 등)에 따라 반사광의 색상과 밝기가 실시간으로 변조되어 환경과 완벽히 동기화됨.

### 25. 실시간 대기 조도 LUT 생성 (Atmosphere Irradiance LUT)
*   **대상**: `AtmosphereIrradianceGenerator` 및 `PBRMaterial`
*   **결과**: ✅ 완료.
    - **제너레이터 신설**: `Sky-View LUT`를 입력으로 받아 하늘 반구의 총 에너지를 물리적으로 적분하는 `AtmosphereIrradianceGenerator` 구현.
    - **데이터 구조**: 표면 법선의 Zenith 각도에 따른 1D 조도 데이터를 생성하여 메모리 및 연산 효율성 극대화.
    - **PBR 연동**: IBL 텍스처가 없는 경우, 이 실시간 조도 LUT를 샘플링하여 주변광(Diffuse)의 기초 소스로 사용하도록 셰이더 폴백 로직 강화.
    - **완전한 독립성**: 이제 수동으로 HDR 파일을 설정하지 않아도, 대기 시스템만으로 물체의 앞면과 뒷면, 그림자 영역까지 대기색에 물드는 하이엔드 조명 효과 완성.

---

## 🚀 향후 파편화 제거 대상 (Normalization Roadmap)

시스템 인프라 정규화의 다음 단계로, 아래 항목을 최우선 순위로 관리합니다.

### 1. 샘플러 프리셋 관리 및 직접 생성 금지 (Sampler Preset Standardization)
*   **현황**: `View3D.ts`, `PostEffect` 및 개별 텍스처 로직에서 `new Sampler()`를 통해 개별적으로 샘플러를 생성하여 중복 리소스 발생 및 관리의 어려움 존재.
*   **목표**:
    *   `ResourceManager`에 정의된 **`PRESET_Sampler_XXXX`** 형태의 정적 프리셋만 사용하도록 코드베이스 전체 강제.
    *   컴포넌트 수준에서의 임의 샘플러 생성을 제거하여 GPU 샘플러 슬롯 낭비 방지 및 일관된 필터링 품질 확보.

---

## 📅 업데이트 히스토리
- **2026-02-18**: 문서 최초 생성. 주요 파편화 지점 5개 항목 리스트업.
- **2026-02-19**: 전 항목 점검 완료 및 KHR 라이브러리 통합, 전역 수치 안정성(EPSILON) 강화, 명명 규칙(CamelCase) 정규화 완료.
- **2026-02-23**: 디스플레이스먼트 라이브러리 리팩토링 및 좌표계 보정 로직 반영. 모든 레거시 인덱스 파일(`SystemCode`, `SystemVertexCode`) 삭제 및 `SystemCodeManager` 기반 전면 일원화. 엔진 전반의 TypeScript 직접 임포트 정규화 및 시스템 유니폼 파일 구조 정규화 작업 완료. 조명 구조체(`DirectionalLight`, `AmbientLight`), 투영 행렬 구조체(`Projection`), 시간 구조체(`Time`) 파일 분리 및 모듈화 완료. `SYSTEM_UNIFORM` 및 `POST_EFFECT_SYSTEM_UNIFORM` 내 구조체 통합과 `SystemUniformUpdater`를 통한 업데이트 로직 단일화 완료. 특히 `RenderViewStateData`로 시간 계산 로직을 중앙화하여 렌더링 경로 간 데이터 정합성 확보. 쉐이더 코드 내 투영 행렬 접근 경로(`projection.XXXX`) 일괄 갱신 완료.
- **2026-02-24**: 클러스터 라이팅 시스템 대규모 리팩토링 완료. `ClusterLightManager` 도입을 통한 `View3D` 비대함 해결 및 캡슐화 강화. `ClusterLightCell`, `ClusterLightGrid`, `ClusterCellBounds`, `ClusterBoundsGrid`로 명칭 체계 정규화 및 모듈화된 폴더 구조(`core`, `pass/bound`, `pass/light`) 확립. 해상도 기반 Dirty Checking 최적화 및 WGSL 인코딩 손상 파일 전수 복구 완료. 셰이더 수학 상수 통합 및 정점 셰이더 I/O 명칭 정규화(`InputData`/`VertexOutput`)를 통해 엔진 전역의 인터페이스 일관성 확보. 공중 투시(Aerial Perspective) 모듈화 및 `SystemCodeManager` 내 레거시 별칭 제거를 통한 네임스페이스 기반 경로 단일화 완료. `InstancingMesh` 시스템의 데이터 정렬 최적화 및 그룹 노말 행렬 도입을 통한 물리적 정합성 강화 완료. `getAerialPerspective` 호출부 최적화 및 머티리얼별 `useAtmosphere` 개별 제어 기능 구현 완료.
 `getAerialPerspective` 호출부 최적화를 통해 대기 시스템 비활성 시의 성능 오버헤드 제거 완료.
