# [Optimization] SkyAtmosphere Resource Management Refactoring (Uniforms & LUTs)

## 1. 개요 (Overview)
현재 `SkyAtmosphere` 시스템 내의 유니폼 버퍼와 LUT 텍스처 리소스를 최적화하여 중복 코드를 제거하고 메모리 및 실행 효율을 극대화하기 위한 리팩토링 내역입니다.

## 2. 현황 및 문제점 (Current Issues)
*   **중복 리소스 생성**: 6개의 제너레이터 클래스가 각각 동일한 레이아웃의 `UniformBuffer`를 소유하고, 기능적으로 중복된 개별 LUT 텍스처 클래스를 사용함.
*   **전송 부하**: 파라미터 변경 시 `SkyAtmosphere`에서 각 제너레이터마다 개별적으로 `writeBuffer`를 호출함.
*   **코드 중복**: 동일한 텍스처 포맷 및 설정 로직이 여러 클래스에 파편화되어 존재함.

## 3. 개선 설계 (Proposed Design)

### 3.1 단일 공용 버퍼 (Shared Uniform Buffer)
*   **주체**: `SkyAtmosphere` 클래스가 단일 `UniformBuffer` 인스턴스를 소유하고 관리합니다.
*   **공유**: 모든 제너레이터는 생성 시 이 공용 버퍼를 참조로 전달받아 바인딩합니다.

### 3.2 데이터 동기화 최적화
*   **일괄 업데이트**: 파라미터 변경 시 단 한 번의 버퍼 쓰기로 모든 제너레이터 데이터를 동기화합니다.

### 3.3 LUT 텍스처 단일화 (LUT Texture Consolidation)
*   **통합 클래스**: 2D 및 3D 차원을 모두 지원하는 범용 클래스 **`SkyAtmosphereLUTTexture`** 도입.
*   **효과**: 동일한 픽셀 포맷(`rgba16float`)과 저장 공간 사용 설정을 단일 지점에서 관리하여 코드 중복을 제거하고 유지보수성을 향상시킵니다.

## 4. 변경 대상 리스트 (Target Files)

| 파일 경로 | 변경 내용 |
| :--- | :--- |
| `SkyAtmosphere.ts` | 공용 `UniformBuffer` 생성 및 파라미터 일괄 업데이트 로직 구현 |
| `SkyAtmosphereLUTTexture.ts` | **[신규]** 2D/3D 통합 LUT 텍스처 클래스 |
| `*Generator.ts` (6종) | 공용 유니폼 버퍼 및 공용 LUT 텍스처 클래스 적용 |
| `*LUTTexture.ts` (기존 5종) | **[삭제]** 통합에 따라 불필요해진 개별 클래스 파일 제거 |

## 5. 기대 효과 (Expected Benefits)
*   **GPU 메모리 절감**: 중복된 유니폼 버퍼 리소스 제거.
*   **CPU 오버헤드 감소**: 불필요한 `writeBuffer` 호출 및 JS 루프 연산 제거.
*   **코드 유지보수성**: 리소스 설정 변경 시 한 곳에서만 대응 가능.

## 6. 기술적 참고 사항 (Technical Notes)
*   **구조체 파싱 이슈 해결**: 유니폼 선언이 포함된 `transmittanceShaderCode`를 결합하여 파싱함으로써 안정적인 `UNIFORM_STRUCT` 정보를 확보함.
*   **3D 텍스처 뷰 차원 명시**: `SkyAtmosphereLUTTexture`에서 `depth`가 1보다 큰 경우 `createView` 시 `dimension: '3d'`를 명시하여 바인딩 오류를 방지함.

---
**최종 업데이트:** 2026-02-26
**상태:** 완료 (Completed)
**프로젝트:** RedGPU
