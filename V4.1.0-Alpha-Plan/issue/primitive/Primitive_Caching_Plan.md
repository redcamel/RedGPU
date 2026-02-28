# [Optimization] Primitive Generator & Constructor Refactoring

## 1. 개요 (Overview)
하위 프리미티브 클래스(Box, Sphere 등)의 생성자에서 발생하던 `ReferenceError: Must call super constructor...` 문제를 해결하고, 베이스 클래스인 `Primitive`에서 리소스 캐싱 및 데이터 설정을 통합 관리하도록 구조를 현대화합니다.

## 2. 변경 전 현황 (AS-IS)
- `#makeData`가 클래스 내부의 프라이빗 필드로 정의되어 초기화 순서 문제(`this` 접근 에러) 발생.
- 모든 하위 클래스가 생성자 내에서 동일한 캐시 체크 및 할당 로직(`_setData`)을 중복 수행.

## 3. 개선 설계 (Proposed & Implemented Design)

### 3.1 베이스 클래스 (`Primitive.ts`) - 캐싱 및 캡슐화 강화
베이스 클래스의 생성자가 캐싱 파이프라인의 제어권을 직접 가집니다. 또한, 내부 데이터를 설정하는 메서드를 `#setData` 프라이빗 메서드로 전환하여 완벽한 캡슐화를 실현했습니다.

```typescript
// Primitive.ts
class Primitive {
    constructor(redGPUContext: RedGPUContext, uniqueKey: string, makeData: () => Geometry) {
        validateRedGPUContext(redGPUContext);
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState;
        let geometry = cachedBufferState[uniqueKey];
        
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = makeData();
        }
        this.#setData(geometry); // 프라이빗 메서드로 데이터 설정
    }

    #setData(geometry: Geometry) {
        // ... 버퍼 및 렌더 정보 설정 로직 (완전 캡슐화)
    }
}
```

### 3.2 하위 클래스 및 파일 레벨 제너레이터
데이터 생성 로직을 클래스 선언부 아래의 독립적인 `makeData` 함수로 이관하여 `this` 의존성을 제거하고, 생성자는 `super` 호출 한 줄로 간소화되었습니다.

```typescript
// Box.ts 예시
class Box extends Primitive {
    constructor(redGPUContext, width, ...) {
        const uniqueKey = `PRIMITIVE_BOX_...`;
        // 부모 생성자에게 모든 로직을 위임
        super(redGPUContext, uniqueKey, () => makeData(uniqueKey, redGPUContext, width, ...));
    }
}

// 클래스 외부(파일 하단)에서 정의
const makeData = (function () {
    return function (uniqueKey, redGPUContext, ...) {
        // ... 정점 생성 로직
    };
})();
```

## 4. 변경의 핵심 (Core Changes)
- **생성자 주입 (Constructor Injection)**: 하위 클래스가 부모에게 생성 전략을 전달하는 IoC(제어의 역전) 구조 확립.
- **완벽한 은닉화**: `_setData` (Internal)를 `#setData` (Private)로 변경하여 하위 클래스나 외부에서의 의도치 않은 상태 변경 차단.
- **초기화 순서 해결**: 기하 구조 생성 로직을 파일 레벨로 분리하여 `super()` 호출 전 `this` 접근 문제를 근본적으로 해결.

## 5. 기대 효과 (Expected Benefits)
- **유지보수 극대화**: 캐싱 로직 수정 시 `Primitive` 클래스 한 곳만 수정하면 전역 반영.
- **코드 다이어트**: 각 프리미티브 파일의 클래스 본문 크기 약 50% 이상 감소.
- **구조적 견고함**: WebGPU 리소스의 생성, 캐싱, 할당 라이프사이클이 베이스 클래스에 의해 엄격히 통제됨.

---
**상태:** 구현 및 검증 완료 (Implemented & Verified)
**대상:** `src/primitive/**`
