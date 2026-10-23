---
title: Getting Started
order: 1
---
<script setup>
const systemGraph = `
    Renderer["RedGPU.Renderer (렌더러)"] -->|뷰 렌더링| View["RedGPU.Display.View3D (뷰)"]
    View -->|공간 참조| Scene["RedGPU.Display.Scene (씬)"]
    View -->|시점 참조| Camera["RedGPU.Camera (카메라)"]
    Scene -->|자식 포함| Mesh["RedGPU.Display.Mesh (메시)"]
    Mesh -->|결합| Geo["Geometry (형상)"] & Mat["Material (재질)"]

    %% 회색조 스타일 적용
    style Renderer fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Scene fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Camera fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Geo fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mat fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`

const flowGraph = `
    Start(["시작"]) --> Init["RedGPU.init 초기화"] 
    Init -->|성공| Context["redGPUContext 획득"]
    Context --> Create["리소스 생성<br/>Scene, Camera, Mesh"]
    Create --> SetupView["View3D 설정"]
    SetupView --> StartLoop["렌더링 루프 시작"]
    StartLoop -->|반복| Update["프레임 업데이트"]
    Update --> Render["화면 렌더링"]
    Render --> Update

    %% 회색조 스타일 적용
    style Start fill:#fafafa,stroke:#d4d4d8,color:#52525b,stroke-width:1px
    style Init fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Context fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Create fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style SetupView fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style StartLoop fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Update fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Render fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# 시작하기

**RedGPU** 는 **WebGPU** 기반의 웹 3D 그래픽스 엔진입니다. 캔버스 초기화부터 첫 번째 3D 메시를 화면에 렌더링하기까지의 기본 과정을 살펴봅니다.

## 1. 사전 준비

실행 전 아래 WebGPU 동작 환경을 확인합니다.

- **브라우저 지원**: Chrome 113+, Edge 113+, Safari 26+, Firefox 141+ 등 WebGPU를 지원하는 브라우저가 필요합니다.
- **지원 여부 확인**: [WebGPU Report](https://webgpureport.org/)에서 현재 브라우저와 하드웨어의 WebGPU 지원 상태를 확인할 수 있습니다.
- **보안 컨텍스트**: WebGPU API는 보안 환경(`https://`) 또는 로컬 환경(`http://localhost`)에서만 작동합니다.

## 2. 엔진 도입

별도의 빌드 도구나 설치 없이 **ES Module**(ESM)로 즉시 가져올 수 있습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
```

## 3. 시스템 구조 및 실행 흐름

### 실행 프로세스

<ClientOnly>
  <MermaidResponsive :definition="flowGraph" />
</ClientOnly>

### 주요 구성 요소

| 클래스                      | 역할 정의                                                                   |
|:----------------------------|:----------------------------------------------------------------------------|
| **`RedGPU.init`**           | WebGPU 디바이스 권한을 요청하고 `RedGPUContext` 를 생성합니다.              |
| **`RedGPU.Renderer`**       | 등록된 뷰들을 매 프레임 GPU에 렌더링하는 루프를 제어합니다.                 |
| **`RedGPU.Display.Scene`**  | 메시, 조명 등 3D 객체가 배치되는 루트 컨테이너입니다.                       |
| **`RedGPU.Display.View3D`** | 특정 `Scene` 을 지정된 `Camera` 시점으로 화면에 출력하는 뷰포트 단위입니다. |

<ClientOnly>
  <MermaidResponsive :definition="systemGraph" />
</ClientOnly>

## 4. 첫 번째 3D 장면 구현

회전하는 정육면체 예제를 통해 **초기화**(Init) → **리소스 생성**(Scene/Camera/Mesh) → **뷰 설정**(View) → **렌더링 루프**(Start)로 이어지는 기본 흐름을 구성합니다.

### HTML 구조

렌더링 결과가 출력될 `<canvas>` 엘리먼트를 배치합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RedGPU - Quick Start</title>
    <style>
        body { margin: 0; overflow: hidden; background: #111; }
        canvas { display: block; width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <canvas id="redgpu-canvas"></canvas>
    <script type="module" src="./main.js"></script>
</body>
</html>
```

### JavaScript 구현

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// 1. RedGPU 시스템 초기화
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 2. 씬(Scene) 생성: 3D 객체가 배치될 공간
        const scene = new RedGPU.Display.Scene();

        // 3. 카메라 생성: 원근 투영(Perspective) 카메라 설정
        const camera = new RedGPU.Camera.PerspectiveCamera();
        camera.z = -5;
        camera.lookAt(0, 0, 0);

        // 4. 메시(Mesh) 생성: 형태(Box)와 재질(Color) 결합
        const geometry = new RedGPU.Primitive.Box(redGPUContext); 
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

        scene.addChild(mesh);

        // 5. 뷰(View3D) 설정 및 컨텍스트 등록
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        redGPUContext.addView(view);

        // 6. 렌더러(Renderer) 실행 및 프레임 루프 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            mesh.rotationX += 1;
            mesh.rotationY += 1;
        });
    },
    (error) => {
        // WebGPU 미지원 브라우저 등 초기화 실패 시 처리
        console.error('RedGPU 초기화 실패:', error);
        alert('WebGPU를 초기화할 수 없습니다. 실행 환경을 확인해 주세요.');
    }
);
```

## 라이브 데모

<ClientOnly>
  <CodePen title="RedGPU Quick Start - Rotating Cube" slugHash="getting-started">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera ();
        camera.z = -5;
camera.lookAt (0, 0, 0);

        const geometry = new RedGPU.Primitive.Box(redGPUContext); 
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        
        scene.addChild(mesh);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            mesh.rotationX += 1;
            mesh.rotationY += 1;
        });
    },
    (error) => {
        console.error("RedGPU 초기화 실패:", error);
    }
);
</pre>
  </CodePen>
</ClientOnly>

<br/>

## 다음 단계

- **[RedGPU Context](../context/index.md)** : 엔진 컨텍스트 상세 설정 및 옵션
- **[View System](../view-system/index.md)** : 화면 렌더링 뷰포트, 씬 및 카메라 구성
- **[기본 객체](../basic-objects/index.md)** : 지오메트리와 머티리얼을 결합한 메시 및 텍스처 제어
- **[조명과 그림자](../lighting-and-shadow/index.md)** : 광원, 재질 및 그림자 표현
- **[환경 설정](../environment/index.md)** : 스카이박스, IBL, 대기 산란 및 전역 바람 설정
- **[확장 객체](../extended-objects/index.md)** : 외부 3D 모델, 인스턴싱, 스프라이트 및 파티클 활용
- **[인스펙터](../inspector/index.md)** : 성능 분석 및 실시간 씬 디버깅 도구
