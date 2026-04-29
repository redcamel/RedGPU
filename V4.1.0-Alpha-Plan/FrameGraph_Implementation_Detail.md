# RedGPU FrameGraph 상세 구현 계획 (Implementation Detail)

본 문서는 `Modernized_Rendering_Architecture.md`에서 정의한 설계를 바탕으로, 실제 FrameGraph 시스템을 구축하기 위한 하위 수준의 기술 명세와 구현 단계별 가이드를 제공합니다.

---

## 1. 핵심 클래스 설계 (Core Class Definitions)

### 1.1. `FrameGraph` (Orchestrator)
그래프의 전체 생명주기를 관리하는 메인 엔진입니다.
- `addPass<T>(name: string, setup: (builder: FrameGraphBuilder, pass: T) => void)`: 새로운 패스를 등록합니다.
- `compile()`: 등록된 패스들 간의 의존성을 분석하고 리소스 수명을 계산합니다.
- `execute(commandEncoder: GPUCommandEncoder)`: 최적화된 순서대로 패스를 실행합니다.

### 1.2. `FrameGraphBuilder` (Interface for Pass)
패스 내부의 `setup` 단계에서 사용되며, 리소스의 읽기/쓰기를 선언하는 인터페이스입니다.
- `createTexture(desc: TextureDescriptor): TextureHandle`: 가상 텍스처를 생성합니다.
- `read(handle: ResourceHandle)`: 특정 리소스를 입력으로 사용함을 선언합니다.
- `write(handle: ResourceHandle)`: 특정 리소스에 결과를 기록함을 선언합니다.

### 1.3. `ResourceRegistry` (Runtime Resource Map)
실행 시점에 가상 핸들을 실제 GPU 리소스(`GPUTexture`, `GPUBuffer`)와 매핑해주는 역할을 합니다.
- `getTexture(handle: TextureHandle): GPUTexture`: 핸들에 할당된 실제 물리 리소스를 반환합니다.

---

## 2. 핸들 시스템 (Resource Handle System)

직접적인 리소스 포인터를 전달하는 대신 **추상화된 핸들**을 사용하여 컴파일 시점에 리소스를 지연 할당합니다.

```typescript
type TextureHandle = {
    readonly id: number;
    readonly type: 'texture';
    // 컴파일 타임 데이터
    desc: GPUTextureDescriptor;
};

type BufferHandle = {
    readonly id: number;
    readonly type: 'buffer';
    desc: GPUBufferDescriptor;
};
```

---

## 3. 그래프 컴파일 과정 (Compilation Pipeline)

### Step 1: 의존성 그래프 구축 (DAG Construction)
각 패스의 `read`/`write` 선언을 기반으로 인접 리스트(Adjacency List)를 생성합니다.
- 패스 A가 텍스처 T를 쓰고, 패스 B가 T를 읽는다면 `A -> B`의 엣지가 생성됩니다.

### Step 2: 위상 정렬 (Topological Sort)
순환 참조가 없는지 확인하고, 실행 가능한 순서대로 패스를 나열합니다.

### Step 3: 리소스 수명 분석 (Lifetime Analysis)
각 리소스 핸들이 **처음으로 쓰이는 패스**와 **마지막으로 읽히는 패스**의 인덱스를 계산합니다.
- `ResourceRange[handleId] = { firstPass: number, lastPass: number }`

### Step 4: 앨리어싱 및 풀링 (Aliasing & Pooling)
수명 범위(`ResourceRange`)가 겹치지 않는 리소스들을 동일한 물리적 메모리에 할당하도록 계획합니다.

---

## 4. 실행 엔진 (Execution Engine)

### 4.1. `TransientResourcePool`
컴파일 단계에서 계산된 수명 정보를 바탕으로 리소스를 관리합니다.
- 실행 프레임 동안만 유효한 리소스들을 관리하며, 프레임 종료 시 또는 수명 종료 시 풀에 반납합니다.

### 4.2. 패스 실행 (Pass Invocation)
```typescript
for (const node of this.#sortedNodes) {
    // 1. 이 패스에서 수명이 시작되는 리소스 할당
    this.#allocateResources(node);
    
    // 2. 패스 실행
    node.execute(this.#registry, commandEncoder);
    
    // 3. 이 패스에서 수명이 끝나는 리소스 반납
    this.#releaseResources(node);
}
```

---

## 5. 구현 단계 (Implementation Phases)

1. **[Core]** Handle 시스템 및 `FrameGraphBuilder` 기본 인터페이스 구현.
2. **[Logic]** DFS 기반 위상 정렬 및 기본 수명 분석 로직 구현.
3. **[Resource]** `TransientResourcePool` 구현 (Texture 우선).
4. **[Integration]** `PostEffectManager`에 시험 적용하여 SSAO -> Blur -> ToneMapping 파이프라인 검증.
5. **[Advanced]** Buffer 핸들 추가 및 메인 렌더링 패스(Shadow Map 등) 통합.

---
**Document Status**: Draft  
**Target Version**: RedGPU V4.1.0-Alpha  
**Author**: Gemini CLI Architect
