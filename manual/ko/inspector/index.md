---
title: Inspector
order: 12
---

# 인스펙터 (Inspector)

> [!WARNING]
> **인스펙터는 현재 개발 단계(Work In Progress)입니다.**
> 일부 지표는 아직 실험적이며 정확하지 않을 수 있습니다. 특히 **총 메모리(Video Memory) 추적**과 **드로우 콜(Draw Calls) 수**는 아직 안정적이지 않으므로 참고용으로만 사용하시기
> 바랍니다.

`RedGPUInspector`는 RedGPU 애플리케이션의 **성능 분석 및 실시간 씬 디버깅**을 위한 개발 도구 패키지입니다.

FPS, GPU 메모리 사용량, 드로우 콜 수, 씬 오브젝트 계층 구조 등을 실시간으로 모니터링할 수 있는 GUI 패널을 화면에 렌더링하여, 개발 과정에서 발생하는 성능 문제를 빠르게 파악하고 디버깅하는 데 도움을
줍니다.

## 인스펙터 아키텍처

인스펙터는 RedGPU 코어 엔진과 **분리된 별도의 패키지**로 설계되었습니다. 이는 프로덕션 배포 시 인스펙터 코드가 번들에 포함되지 않도록 하여 최종 파일 크기를 최소화하기 위함입니다.

```
RedGPU Core (dist/index.js)
    ↕ 분리된 독립 패키지
RedGPUInspector (inspector/dist/index.js)
```

## 도입 방법

### CDN

`import` 구문으로 미리 불러온 뒤 바로 사용할 수 있습니다. ESM(ES Modules)을 지원하는 환경에서 가장 단순한 방법입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
import RedGPUInspector from "https://redcamel.github.io/RedGPU/inspector/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    // ... 씬, 카메라, 메시 구성 ...

    const inspector = new RedGPUInspector(redGPUContext);

    // useDebugPanel을 true로 설정하면 GUI 패널이 활성화됩니다.
    inspector.useDebugPanel = true;
});
```

## API 레퍼런스

### `new RedGPUInspector(redGPUContext)`

인스펙터 인스턴스를 생성합니다.

| 파라미터            | 타입              | 설명                                |
|:----------------|:----------------|:----------------------------------|
| `redGPUContext` | `RedGPUContext` | `RedGPU.init()` 콜백에서 전달받은 엔진 컨텍스트 |

### `inspector.useDebugPanel`

디버그 패널의 표시 여부를 제어하는 `getter/setter` 속성입니다.

```javascript
// 패널 활성화
inspector.useDebugPanel = true;

// 패널 비활성화
inspector.useDebugPanel = false;

// 현재 상태 확인
console.log(inspector.useDebugPanel); // true | false
```

## 패널 기능

인스펙터 패널은 여러 탭으로 구성되어 다양한 정보를 제공합니다.

### 성능 모니터

실시간 FPS 및 프레임 타임 정보를 수집 및 그래프로 표시합니다.

| 지표               | 설명                               |
|:-----------------|:---------------------------------|
| **FPS**          | 현재 프레임 레이트                       |
| **Avg FPS**      | 평균 프레임 레이트                       |
| **1% Low FPS**   | 하위 1% 구간의 최저 FPS (스터터링 지표)       |
| **0.1% Low FPS** | 하위 0.1% 구간의 최저 FPS (극단적 스파이크 지표) |
| **Frame Time**   | 프레임당 소요 시간 (ms)                  |

### 렌더링 통계 (State)

현재 렌더링 프레임의 GPU 워크로드 정보를 표시합니다.

| 지표               | 설명                                           |
|:-----------------|:---------------------------------------------|
| **Draw Calls**   | 현재 프레임의 총 드로우 콜 수 ⚠️ *(불안정, 참고용)*            |
| **Triangles**    | 렌더링된 총 삼각형 수                                 |
| **Points**       | 렌더링된 총 포인트 수                                 |
| **3D Objects**   | 씬에 등록된 3D 오브젝트 총 수                           |
| **3D Groups**    | 씬에 등록된 3D 그룹 총 수                             |
| **Instances**    | 총 인스턴스 수                                     |
| **Video Memory** | 현재 GPU가 사용 중인 총 비디오 메모리 (MB) ⚠️ *(불안정, 참고용)* |

### GPU 메모리 리소스 (Resources)

GPU에 업로드된 각 리소스 종류별 개수 및 메모리 사용량을 표시합니다.

| 리소스               | 설명             |
|:------------------|:---------------|
| **BitmapTexture** | 일반 비트맵(2D) 텍스처 |
| **CubeTexture**   | 큐브맵(스카이박스) 텍스처 |
| **HDRTexture**    | HDR 텍스처 (IBL용) |
| **UniformBuffer** | 유니폼 버퍼 오브젝트    |
| **VertexBuffer**  | 정점(Vertex) 버퍼  |
| **IndexBuffer**   | 인덱스 버퍼         |
| **StorageBuffer** | 스토리지 버퍼        |
| **GPUBuffer**     | 기타 GPU 버퍼      |

### 씬 계층 구조 (Hierarchy)

씬(Scene) 내부의 오브젝트 트리를 실시간으로 탐색하고, 현재 활성화된 뷰(View)별로 분류하여 표시합니다.

### 커맨드 배치 통계 (Command Batch)

렌더링 파이프라인의 각 단계(Phase)별 커맨드 버퍼, 렌더 패스, 컴퓨트 패스 수를 표시합니다. GPU 렌더링 패스 최적화 상태를 진단할 때 유용합니다.

## 실전 활용 팁

> [!TIP]
> **드로우 콜 최적화**: Draw Calls 수가 지나치게 많다면 인스턴싱(`InstancedMesh`) 도입을 검토하세요. 동일한 Geometry/Material을 사용하는 오브젝트들을 인스턴싱으로 묶으면
> 드로우 콜이 대폭 감소합니다.

> [!TIP]
> **메모리 누수 탐지**: Resources 탭에서 씬 전환 등 특정 동작 후 리소스의 `count`가 계속 증가한다면 리소스가 정상적으로 해제되지 않는 것입니다.

