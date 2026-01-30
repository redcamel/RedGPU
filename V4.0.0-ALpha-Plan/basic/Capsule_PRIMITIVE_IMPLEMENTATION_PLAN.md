# Capsule 프리미티브 구현 계획 (Capsule Primitive Implementation Plan)

## 1. 개요
RedGPU의 물리 엔진 플러그인 생태계를 강화하고, 캐릭터 컨트롤러 및 각종 물리 시뮬레이션과의 시각적 정밀도를 보장하기 위해 전용 **Capsule Primitive**를 구현합니다. 이는 물리 엔진에서 정의하는 충돌 영역과 렌더링되는 메쉬 사이의 완벽한 일치를 제공하여 개발 효율성을 높이는 데 목적이 있습니다.

## 2. 목표 기능
물리 엔진(Rapier 등)의 파라미터 구조와 직관적으로 대응할 수 있도록 '반지름'과 '실린더 높이'를 독립적으로 제어하는 인터페이스를 제공합니다.

```typescript
const capsule = new RedGPU.Primitive.Capsule(
    redGPUContext,
    radius,           // 반지름 (기본값: 0.5)
    cylinderHeight,   // 중앙 실린더 파트의 높이 (기본값: 1.0)
    radialSegments,   // 원주 방향 분할 수 (기본값: 32)
    heightSegments,   // 실린더 파트의 높이 방향 분할 수 (기본값: 1)
    capSegments       // 상/하단 반구(Cap)의 세로 분할 수 (기본값: 12)
);
// 전체 높이(Total Height) = cylinderHeight + (radius * 2)
```

---

## 3. 아키텍처 및 구현 상세

### 3.1 위치 (`src/primitive/Capsule.ts`)
-   `APrimitive`를 상속받아 구현.
-   물리 연산과의 동기화를 고려하여 반지름 변경 시에도 실린더 축의 길이는 유지되는 구조 채택.

### 3.2 지오메트리 생성 로직
물리 엔진의 캡슐 정의 방식에 맞춰 세 파트를 정교하게 결합합니다:
1.  **Top Hemisphere**: 상단 반구 버텍스를 생성하고 `+cylinderHeight / 2` 위치로 배치.
2.  **Cylinder Body**: 상/하단 반구의 접점을 잇는 원통 면 생성.
3.  **Bottom Hemisphere**: 하단 반구 버텍스를 생성하고 `-cylinderHeight / 2` 위치로 배치.

### 3.3 물리 엔진 통합 가이드 (Physics Integration)
-   **Rapier 호환성**: Rapier의 `capsule(halfHeight, radius)` API에서 `halfHeight`는 실린더 높이의 절반을 의미합니다. RedGPU Capsule의 `cylinderHeight / 2`와 정확히 일치하도록 설계하여 물리-비주얼 간 오차를 제거합니다.
-   **원점 정렬**: 캡슐의 기하학적 중심($0,0,0$)이 물리 바디의 중심과 일치하도록 버텍스 데이터를 정렬합니다.

---

## 4. 구현 단계

### [Step 1] 물리 친화적 클래스 설계
-   `radius`와 `cylinderHeight`를 핵심 인자로 정의.
-   `src/primitive/index.ts`를 통해 엔진 전역에 노출.

### [Step 2] 심리스(Seamless) 지오메트리 구현
-   반구와 원통의 접합부에서 버텍스 및 노멀(Normal) 데이터가 끊기지 않도록 정밀 계산.
-   부드러운 곡면 쉐이딩을 위한 법선 벡터 최적화.

### [Step 3] 물리 엔진 연동 검증
-   `RapierPhysics` 플러그인을 사용하는 예제에서 실제 충돌 영역과 메쉬의 시각적 형태가 일치하는지 확인.

---

## 5. 기대 효과
-   **물리 엔진 통합성:** Rapier 및 기타 물리 엔진과의 데이터 매칭 편의성 극대화.
-   **시각적 신뢰도:** 물리적 충돌 판정 영역과 렌더링 결과물의 오차 제거.
-   **캐릭터 제작 최적화:** 캐릭터 컨트롤러 구현 시 가장 선호되는 캡슐 형상을 네이티브로 지원하여 개발 속도 향상.
