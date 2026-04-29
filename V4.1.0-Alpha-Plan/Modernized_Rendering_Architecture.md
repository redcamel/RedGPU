# RedGPU Modernized Rendering Architecture Spec & Plan (V4.1.0)

본 문서는 RedGPU의 렌더링 파이프라인을 현대적인 **FrameGraph(RenderGraph)** 기반으로 개편하고, 이를 첫 번째로 적용할 **후처리(Post-processing) 시스템**의 상세 설계 및 구현 계획을 통합하여 담고 있습니다.

---

## 1. FrameGraph 아키텍처 (Core Architecture)

### 1.1. 개념 및 동작 원리
FrameGraph는 복잡한 렌더링 파이프라인을 **지향 비순환 그래프(Directed Acyclic Graph, DAG)** 형태로 관리하는 추상화 레이어입니다.

1. **Setup Phase**: 모든 렌더 패스를 등록하고, 리소스(Texture, Buffer)의 읽기/쓰기 의존성을 선언합니다.
2. **Compile Phase**: 그래프를 분석하여 사용되지 않는 패스를 제거(Culling)하고, 리소스의 수명(Lifetime)을 계산하여 동일한 메모리를 재사용(Aliasing)하도록 최적화합니다.
3. **Execute Phase**: 최적화된 순서대로 GPU 커맨드를 기록하고 제출합니다.

### 1.2. 도입 목표
- **메모리 최적화**: 리소스 앨리어싱을 통해 VRAM 사용량을 획기적으로 절감합니다.
- **의존성 자동화**: 패스 간 리소스 전달 및 장벽(Barrier) 관리를 시스템이 자동 수행합니다.
- **성능 향상**: 불필요한 Pass 전환을 최소화하고 Single Encoder 기반 제출을 지향합니다.

---

## 2. 후처리 시스템 현대화 (Post-processing Modernization)

### 2.1. 현재 구조의 한계
- 각 이펙트가 고유의 출력 텍스처를 가져 메모리가 낭비됨.
- 패스 순서가 하드코딩되어 확장이 어려움.
- 패스마다 개별 `submit`을 호출하여 CPU-GPU 동기화 비용 발생.

### 2.2. 개선 계획 (Phase 1 ~ 4)
- **Phase 1 (Resource)**: 동적 리소스 풀링 시스템 도입 및 리사이즈 최적화.
- **Phase 2 (Modular)**: 모든 효과를 `IPostEffectPass` 인터페이스로 통합하여 유연한 리스트 순회 구조로 변경.
- **Phase 3 (Performance)**: 모든 후처리 패스를 하나의 `GPUCommandEncoder`에 기록하여 한 번의 `submit`으로 처리.
- **Phase 4 (Standardization)**: 물리적 조명 단위 정규화 및 네이밍 컨벤션 준수.

---

## 3. 상세 설계 명세 (Implementation Detail)

### 3.1. 통합 Pass 인터페이스 (`IPostEffectPass`)
```typescript
interface IPostEffectPass {
    enabled: boolean;
    readonly name: string;
    // 리소스 의존성 선언
    readonly inputDependencies: {
        depth: boolean;
        normal: boolean;
        motion: boolean;
    };
    
    render(
        view: View3D,
        sourceView: GPUTextureView,
        targetView: GPUTextureView,
        commandEncoder: GPUCommandEncoder
    ): void;
}
```

### 3.2. 동적 리소스 풀링 (`PostEffectResourcePool`)
- 고정된 핑퐁 방식 대신, 요청 시점에 최적의 리소스를 할당하고 수명이 다하면 즉시 반환하는 풀링 시스템을 사용합니다.
- **Aliasing**: 수명이 겹치지 않는 서로 다른 패스의 리소스들이 물리적으로 동일한 텍스처 메모리를 공유하게 됩니다.

### 3.3. 실행 루프 (Unified Loop)
```typescript
// PostEffectManager 내 가상 로직
for (const pass of this.#passes) {
    if (!pass.enabled) continue;
    const target = this.#resourcePool.getTexture(format, width, height);
    pass.render(view, currentSource, target.createView(), commandEncoder);
    this.#resourcePool.tryRelease(currentSource); // 수명 종료 시 반납
    currentSource = target.createView();
}
```

---

## 4. 로드맵 및 우선순위

1. **Core Utilities**: `PostEffectResourcePool` 구현 및 `PostEffectManager` 루프 개편.
2. **Standard Effects**: `Bloom`, `Blur`, `FilmGrain` 등 단순 효과 전환 및 검증.
3. **Complex Effects**: `SSAO`, `SSR`, `TAA`를 래핑하여 통합 파이프라인에 편입.
4. **Engine Expansion**: 후처리의 검증된 구조를 메인 렌더러(Shadow, Main Scene)로 확장하여 완전한 FrameGraph 완성.

---
**Plan Version**: 1.0.0 (Unified)  
**Target Version**: RedGPU V4.1.0-Alpha  
**Author**: Gemini CLI Architect
