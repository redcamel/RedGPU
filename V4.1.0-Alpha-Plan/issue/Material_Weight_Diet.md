# [Optimization] Weight Diet: Material System Consolidation

## 📌 개요 (Overview)
RedGPU 프로젝트의 핵심 구성 요소인 재질(Material) 시스템 내의 중복 로직을 제거하고, 구조적 설계를 표준화하여 전체 코드 용량 감축 및 유지보수 효율성을 극대화합니다.

## 🎯 목표 (Goals)
- **재질 시스템 경량화**: `DefineForFragment` 보일러플레이트 제거 및 유니폼 업데이트 자동화.
- **WGSL 표준화**: 셰이더 내 중복되는 구조체 선언을 `#redgpu_include` 기반으로 단일화.
- **유지보수성 향상**: 텍스처 및 샘플러 바인딩 관리를 베이스 클래스에서 일관되게 처리.

## 🛠️ 주요 작업 항목 (Task List)
- [ ] **유니폼 업데이트 자동화 (Proxy/Decorator)**:
  - 클래스 메타데이터 기반으로 속성 변경 시 `updateUniform` 자동 호출.
  - Getter/Setter의 반복적인 유니폼 업데이트 상용구 제거.
- [ ] **재질 WGSL 구조체 단일화**:
  - `fragment.wgsl` 내 중복 `Uniforms` 구조체를 `SystemCodeManager` 라이브러리로 이관.
  - `#redgpu_include materialStruct.PhongMaterial` 형식 도입.
- [ ] **탄젠트 데이터 활용 및 노멀 맵 최적화**:
  - 기존 셰이더 내 탄젠트 실시간 계산 로직을 제거하고, 정점 데이터의 `Tangent` 속성을 사용하도록 WGSL 업데이트.
  - TBN 행렬 구성 시 정점 탄젠트 정보를 활용하여 정확도 향상 및 연산 부하 감소.
- [ ] **`ABaseMaterial` 기능 확장**:
  - 텍스처 및 샘플러 바인딩 관리를 베이스 클래스에서 일관되게 처리하여 하위 클래스의 구현 복잡도 완화.

## 🔍 개선 전략 (Improvement Strategy)
- **Uniform 메타데이터화**: 재질 속성의 오프셋, 타입 정보를 데코레이터나 정적 맵으로 관리하여 코드량 60% 절감 목표.
- **Shader Chunk 라이브러리화**: 색상 변환, 조명 감쇄 등 공통 헬퍼 함수들을 100% 모듈화하여 셰이더 유지보수성 강화.

## 📊 예상 성과 (Expected Outcomes)
| 대상 카테고리 | 현재 평균 LOC | 목표 평균 LOC | 감축률 (%) | 주요 절감 원인 |
| :--- | :---: | :---: | :---: | :--- |
| **Material Class** | ~250 | ~100 | **~60%** | 유니폼 업데이트 자동화 및 상용구 제거 |
| **Material WGSL** | ~1,000 | ~800 | **~20%** | 구조체 라이브러리화 및 #redgpu_include 활용 |

---
**우선순위:** 🟠 높음 (High) | **난이도:** 🟡 보통 (Normal) | **대상 버전:** V4.1.0-Alpha
