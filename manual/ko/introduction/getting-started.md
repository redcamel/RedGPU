
RedGPU는 차세대 웹 그래픽 API인 **WebGPU**를 기반으로 처음부터 새롭게 설계된 고성능 3D 엔진입니다. 이 가이드는 RedGPU를 사용하여 첫 번째 3D 애플리케이션을 구축하는 과정을 단계별로 안내합니다.

## 1. 환경 준비 (Prerequisites)

WebGPU는 최신 기술이므로 시작하기 전에 다음 환경을 확인해야 합니다.

- **브라우저 지원**: Chrome 113+, Edge 113+, Safari(개발자 프리뷰) 등 WebGPU를 지원하는 최신 브라우저를 사용하세요.
- **보안 컨텍스트**: WebGPU API는 보안 환경(`https://`) 또는 로컬 개발 환경(`http://localhost`)에서만 접근 가능합니다.

## 2. 엔진 연결 (Installation)

별도의 설치 과정 없이, 제공되는 배포용 URL을 통해 즉시 프로젝트에 통합할 수 있습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
```

## 3. 첫 번째 3D 장면 만들기

가장 기본적인 형태인 '회전하는 큐브'를 통해 RedGPU의 작동 방식을 파악해 보겠습니다.

### HTML 구조 (`index.html`)

렌더링 결과가 출력될 `<canvas>` 엘리먼트와 모듈 방식의 스크립트 연결이 필요합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RedGPU - Quick Start</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; }
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

RedGPU는 `init`을 통한 비동기 초기화 이후, **Scene(공간) - Camera(시점) - Mesh(객체)**를 구성하고 **View3D**를 통해 최종 화면에 출력하는 구조를 가집니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// 1. RedGPU 시스템 초기화
RedGPU.init(
    canvas,
    (redContext) => {
        // 2. 씬(Scene) 생성: 3D 객체들이 위치할 가상 공간
        const scene = new RedGPU.Display.Scene(redContext);

        // 3. 카메라 생성: 원근 투영(Perspective) 카메라 설정
        const camera = new RedGPU.Camera.PerspectiveCamera(redContext);
        camera.z = -5; // 카메라를 원점으로부터 뒤로 배치

        // 4. 메시(Mesh) 생성: 형태(Box)와 외관(Color) 정의
        const geometry = new RedGPU.Primitive.Box(redContext); 
        const material = new RedGPU.Material.ColorMaterial(redContext, '#00CC99');
        const mesh = new RedGPU.Display.Mesh(redContext, geometry, material);
        
        scene.addChild(mesh); // 씬에 메시 추가

        // 5. 뷰(View3D) 설정: 특정 씬과 카메라를 조합하여 화면 영역 정의
        const view = new RedGPU.Display.View3D(redContext, scene, camera);
        redContext.addView(view);

        // 6. 렌더러(Renderer) 생성 및 애니메이션 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redContext, (time) => {
            // 매 프레임마다 회전 애니메이션 적용
            mesh.rotationX += 1;
            mesh.rotationY += 1;
        });
    },
    (error) => {
        console.error('RedGPU 초기화 실패:', error);
    }
);
```

## 동적 샘플 실행 (Live Demo)

아래 데모는 CodePen을 통해 실시간으로 실행되는 예제입니다. **Result** 탭에서 결과를 확인하고, **JS** 탭을 눌러 코드를 직접 수정해 볼 수 있습니다.

<ClientOnly>
<CodePen title="RedGPU Quick Start - Rotating Cube" slugHash="getting-started">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(
    canvas,
    (redContext) => {
        const scene = new RedGPU.Display.Scene(redContext);
        const camera = new RedGPU.Camera.PerspectiveCamera(redContext);
        camera.z = -5;

        const geometry = new RedGPU.Primitive.Box(redContext); 
        const material = new RedGPU.Material.ColorMaterial(redContext, "#00CC99");
        const mesh = new RedGPU.Display.Mesh(redContext, geometry, material);
        
        scene.addChild(mesh);

        const view = new RedGPU.Display.View3D(redContext, scene, camera);
        redContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redContext, (time) => {
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

## 주요 구성 요소 이해

| 핵심 클래스 | 역할 설명 |
| :--- | :--- |
| **`RedGPU.init`** | WebGPU 시스템을 초기화하고 엔진의 코어 컨텍스트를 생성합니다. |
| **`RedGPU.Renderer`** | 등록된 뷰들을 물리적으로 GPU에 드로잉하는 역할을 담당합니다. |
| **`RedGPU.Display.Scene`** | 메시, 라이트 등이 배치되는 3D 공간의 루트 컨테이너입니다. |
| **`RedGPU.Display.View3D`** | 어떤 씬을 어떤 카메라로 렌더링할지 정의하는 화면 단위입니다. |
| **`RedGPU.Display.Mesh`** | 지오메트리(형태)와 머티리얼(재질)이 결합된 실제 가시 객체입니다. |

<script setup>
const mermaidGraph = `
    Renderer[RedGPU.Renderer] -->|Draws| View[RedGPU.Display.View3D]
    View -->|Composes| Scene[RedGPU.Display.Scene]
    View -->|Uses| Camera[RedGPU.Camera]
    Scene -->|Contains| Mesh[RedGPU.Display.Mesh]
    Mesh -->|Combines| Geo[Geometry] & Mat[Material]

    %% 커스텀 클래스 적용
    class Renderer mermaid-system;
    class View mermaid-main;
    class Geo,Mat mermaid-component;
`
</script>

<ClientOnly>
<MermaidResponsive :definition="mermaidGraph" />
</ClientOnly>

## 다음 학습 추천

- **[RedGPU Context](../core-concepts/redgpu-context.md)**: 컨텍스트 관리 및 설정 옵션 상세 가이드.
- **[기본 지오메트리](../core-concepts/geometry.md)**: 기본 도형 생성 및 파라미터 활용법.
- **[API Reference](../../api/index.md)**: 전체 클래스 명세 확인.````