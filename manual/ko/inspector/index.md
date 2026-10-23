---
title: Inspector
order: 15
---

# 인스펙터

`RedGPUInspector` 는 FPS, GPU 메모리 사용량, 드로우 콜 수, 씬 오브젝트 계층 구조 등을 실시간으로 모니터링하고 제어하는 독립 개발 도구 패키지입니다. 프로덕션 번들 크기를 최소화하기 위해
코어 엔진 (`dist/index.js`)과 분리된 별도 패키지 (`inspector/dist/index.js`)로 제공됩니다.

> [!WARNING]
> 인스펙터는 현재 개발 단계 (Work In Progress)입니다. 특히 **Video Memory 추적**과 **Draw Calls 수**는 실험적 지표이므로 참고용으로만 사용하시기 바랍니다.

---

## 1. 초기화 및 사용법

`RedGPUInspector` 를 별도로 임포트한 뒤 `redGPUContext` 를 전달하여 인스턴스를 생성하고, `useDebugPanel` 속성으로 GUI 패널 표시 여부를 제어합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
import RedGPUInspector from "https://redcamel.github.io/RedGPU/inspector/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const inspector = new RedGPUInspector(redGPUContext);

    // GUI 디버그 패널 활성화 (비활성화 시 false)
    inspector.useDebugPanel = true;
});
```

---

## 2. 패널 탭 및 모니터링 지표

인스펙터 패널은 5개 영역으로 구성되어 프레임 성능과 GPU 리소스 상태를 실시간으로 표시합니다.

| 탭 / 영역             | 주요 지표 및 리소스                                                                                                        | 설명                                                                                                                                         |
|:----------------------|:---------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| **성능 모니터**       | `FPS`, `Avg FPS`, `1% Low FPS`, `0.1% Low FPS`, `Frame Time`                                                               | 현재·평균 프레임 레이트, 하위 1%·0.1% 스터터링/스파이크 지표 및 프레임당 소요 시간(ms)을 그래프로 표시합니다.                                |
| **렌더링 통계**       | `Draw Calls`, `Triangles`, `Points`, `3D Objects`, `3D Groups`, `Instances`, `Video Memory`                                | 현재 프레임의 드로우 콜 수(참고용), 렌더링된 삼각형·포인트 수, 씬 내 오브젝트·그룹·인스턴스 수 및 총 비디오 메모리(MB, 참고용)를 표시합니다. |
| **GPU 메모리 리소스** | `BitmapTexture`, `CubeTexture`, `HDRTexture`, `UniformBuffer`, `VertexBuffer`, `IndexBuffer`, `StorageBuffer`, `GPUBuffer` | GPU에 업로드된 텍스처 및 버퍼 종류별 생성 개수(`count`)와 메모리 점유량을 추적합니다.                                                        |
| **씬 계층 구조**      | `View3D`, `Scene`, 자식 디스플레이 객체 트리                                                                               | 현재 활성화된 뷰(`View3D` / `View2D`)별로 씬 내부 오브젝트 트리를 실시간 탐색합니다.                                                         |
| **커맨드 배치 통계**  | 커맨드 버퍼, 렌더 패스, 컴퓨트 패스                                                                                        | 렌더링 파이프라인의 각 단계(Phase)별 커맨드 버퍼 및 렌더·컴퓨트 패스 실행 횟수를 진단합니다.                                                 |

---

## 3. 실전 디버깅 팁

> [!TIP]
> - **드로우 콜 최적화**: `Draw Calls` 수치가 높다면 동일한 지오메트리·재질을 공유하는 객체들을 `InstancedMesh` 로 묶어 드로우 콜을 절감하세요.
> - **메모리 누수 탐지**: 씬 전환이나 객체 제거 후에도 **GPU 메모리 리소스** 탭의 리소스 개수 (`count`)가 계속 증가한다면, 미사용 리소스의 `destroy()` 가 누락되었는지 점검하세요.
