---
order: 1
---
<script setup>
const systemGraph = `
    Renderer["RedGPU.Renderer"] -->|Draws| View["RedGPU.Display.View3D"]
    View -->|Composes| Scene["RedGPU.Display.Scene"]
    View -->|Uses| Camera["RedGPU.Camera"]
    Scene -->|Contains| Mesh["RedGPU.Display.Mesh"]
    Mesh -->|Combines| Geo["Geometry"] & Mat["Material"]

    %% 커스텀 클래스 적용
    class Renderer mermaid-system;
    class View mermaid-main;
    class Geo,Mat mermaid-component;
`

const flowGraph = `
    Start(["시작"]) --> Init["RedGPU.init 초기화"]
    Init -->|성공| Context["redGPUContext 획득"]
    Context --> Create["리소스 생성<br/>Scene, Camera, Mesh"]
    Create --> SetupView["View3D 설정"]
    SetupView --> StartLoop["렌더링 루프 시작"]
    StartLoop -->|Loop| Update["프레임 업데이트"]
    Update --> Render["화면 렌더링"]
    Render --> Update
`
</script>

# 시작하기 (Getting Started)

RedGPU는 차세대 웹 그래픽 표준인 **WebGPU**를 기반으로 설계된 고성능 3D 엔진입니다. 강력한 컴퓨트 셰이더(Compute Shader) 활용과 낮은 오버헤드를 통해 웹 환경에서 네이티브 수준의 몰입형 그래픽 경험을 제공합니다.

이 가이드는 RedGPU를 사용하여 첫 번째 3D 애플리케이션을 구축하는 과정을 단계별로 안내합니다.

## 1. 사전 준비 (Prerequisites)

WebGPU는 최신 기술이므로 시작하기 전에 아래 실행 환경을 확인해야 합니다.

- **브라우저 지원**: Chrome 113+, Edge 113+ 등 WebGPU를 지원하는 최신 브라우저가 필요합니다.
- **지원 여부 확인**: [WebGPU Report](https://webgpureport.org/)에서 현재 브라우저와 하드웨어의 WebGPU 지원 상태를 확인할 수 있습니다.
- **보안 컨텍스트**: WebGPU API는 보안 환경(`https://`) 또는 로컬 환경(`http://localhost`)에서만 작동합니다.

## 2. 엔진 도입 (Installation)

RedGPU는 별도의 복잡한 설치 과정 없이, ES Module(ESM)을 통해 즉시 프로젝트에 통합할 수 있습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
```

## 3. 첫 번째 3D 장면 구현

가장 기본적인 형태인 '회전하는 정육면체'를 통해 RedGPU의 핵심 작동 방식을 살펴보겠습니다.

### HTML 구조 (`index.html`)

렌더링 결과가 출력될 `<canvas>` 엘리먼트를 구성합니다.

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

### JavaScript 구현 (`main.js`)

RedGPU는 **초기화(Init)** → **리소스 생성(Scene/Camera/Mesh)** → **뷰 설정(View)** → **렌더링 루프(Start)** 순으로 흐름이 진행됩니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// 1. RedGPU 시스템 초기화
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 초기화 성공 시 엔진의 핵심인 redGPUContext 객체가 전달됩니다.

        // 2. 씬(Scene) 생성: 3D 객체들이 배치될 가상 공간
        const scene = new RedGPU.Display.Scene();

        // 3. 카메라 생성: 원근 투영(Perspective) 카메라 설정
        const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
        camera.z = -5; // 카메라를 원점으로부터 뒤로 이동

        // 4. 메시(Mesh) 생성: 형태(Box)와 재질(Color)의 결합
        const geometry = new RedGPU.Primitive.Box(redGPUContext); 
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        
        scene.addChild(mesh); // 씬에 메시 추가

        // 5. 뷰(View3D) 설정: 특정 씬을 특정 카메라로 렌더링하도록 정의
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        redGPUContext.addView(view); // 컨텍스트에 뷰 등록

        // 6. 렌더러(Renderer) 실행 및 애니메이션 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // 매 프레임마다 호출되어 애니메이션을 구현합니다.
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

## 라이브 데모 (Live Demo)

아래 대화형 예제를 통해 코드를 직접 수정하며 결과를 실시간으로 확인할 수 있습니다.

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
        const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
        camera.z = -5;

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

## 시스템 구조 및 실행 흐름

RedGPU의 주요 클래스 관계와 애플리케이션 생명 주기를 도식화한 내용입니다.

### 실행 프로세스 (Execution Flow)

<ClientOnly>
  <MermaidResponsive :definition="flowGraph" />
</ClientOnly>

### 주요 구성 요소 (Core Components)

| 클래스 | 역할 정의 |
| :--- | :--- |
| **`RedGPU.init`** | WebGPU 디바이스 권한을 요청하고 엔진의 핵심 컨텍스트를 생성합니다. |
| **`RedGPU.Renderer`** | 등록된 뷰들을 GPU 하드웨어에 그리는 렌더링 루프를 관리합니다. |
| **`RedGPU.Display.Scene`** | 메시, 조명 등 3D 객체들이 배치되는 가상 공간의 루트 컨테이너입니다. |
| **`RedGPU.Display.View3D`** | 특정 씬을 어떤 시점(Camera)에서 화면에 출력할지 결정하는 단위입니다. |

<ClientOnly>
  <MermaidResponsive :definition="systemGraph" />
</ClientOnly>

## 다음 학습 추천

기본적인 화면 구성을 익혔다면, 아래 주제들을 통해 RedGPU의 더 깊은 기능을 탐구해 보세요.

- **[RedGPU Context](../context/context.md)**: 엔진 컨텍스트 상세 설정 및 옵션 가이드.
- **[메시 (Mesh)](../basic-objects/mesh.md)**: 지오메트리와 머티리얼을 결합하여 물체를 만들고 제어하는 방법.
- **[재질 (Material)](../basic-objects/texture.md)**: 질감과 색상을 표현하는 머티리얼 활용법.
- **[API Reference](../../api/index.md)**: 전체 클래스 명세 및 기술 문서.