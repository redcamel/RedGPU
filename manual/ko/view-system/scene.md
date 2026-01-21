---
title: Scene
order: 3
---
<script setup>
const sceneGraph = `
    graph TD
        Scene["RedGPU.Display.Scene (Root Node)"]
        LightMgr["LightManager (Uniform Buffer)"]
        Children["Child Nodes (Mesh, Group)"]
        BgColor["Background Property"]
        Ambient["AmbientLight"]
        DirLight["DirectionalLight"]

        Scene -->|Owns| LightMgr
        Scene -->|Contains| Children
        Scene -->|Configures| BgColor
        
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        
        %% 커스텀 클래스 적용
        class Scene mermaid-main;
        class LightMgr mermaid-system;
`
</script>

# Scene

**Scene**은 렌더링될 모든 3D 객체(Mesh, Group, Light)를 포함하는 **씬 그래프**(Scene Graph)의 최상위 루트 노드(Root Node)입니다.
RedGPU의 렌더링 엔진은 View가 참조하고 있는 Scene을 순회하며 렌더링 목록(Render List)을 작성합니다.

## 1. 아키텍처 및 역할

`RedGPU.Display.Scene`은 단순한 컨테이너 역할을 넘어 다음과 같은 핵심 기능을 수행합니다.

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

- **Scene Graph Management**: `addChild()`, `removeChild()` 메서드를 통해 계층적인 객체 구조를 관리합니다.
- **Light Uniform Management**: 내장된 `LightManager`를 통해 씬 전체에 영향을 주는 조명 데이터를 GPU 버퍼(Uniform Buffer)로 관리합니다.
- **Global Environment**: 배경색(Background Color) 등 씬 전역에 적용되는 환경 설정을 담당합니다. (Skybox는 View 단위로 처리됨에 유의)

## 2. 생성 및 설정

Scene은 초기화 시 별도의 인자를 요구하지 않으며, 생성 직후 객체 추가 및 환경 설정이 가능합니다.

```javascript
// 1. Scene 인스턴스 생성
const scene = new RedGPU.Display.Scene();

// 2. 배경색 설정 (Render Pass의 Clear Color로 사용됨)
scene.useBackgroundColor = true;
scene.backgroundColor.setColorByHEX('#5259c3'); // Hex Code 입력
```

## 3. 조명 시스템 통합

Scene은 생성과 동시에 내부적으로 `LightManager` 인스턴스를 생성합니다. 
모든 광원 객체는 반드시 이 매니저를 통해 등록되어야 하며, 등록된 데이터는 렌더링 시점에 셰이더로 바인딩됩니다.

```javascript
// Ambient Light (전역 환경광) 설정
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

// Directional Light (방향성 광원) 추가
const dirLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(dirLight);
```

## 4. View와의 관계

Scene과 View는 **N:M (다대다)** 관계를 가질 수 있습니다.
- **Data (Model)**: Scene은 렌더링될 데이터(객체, 조명)를 보유합니다.
- **Presentation (View)**: View는 Scene 데이터를 참조하여 특정 시점(Camera)과 영역(Viewport)에 그립니다.

즉, 하나의 Scene 인스턴스를 여러 View가 공유하여 서로 다른 각도에서 렌더링하는 것이 가능합니다.

```javascript
// Shared Data: 하나의 Scene 인스턴스 생성
const scene = new RedGPU.Display.Scene();

// Presentation 1: 메인 뷰
const view1 = new RedGPU.Display.View3D(redGPUContext, scene, camera1);

// Presentation 2: 서브 뷰 (동일한 scene 참조)
// view1과 view2는 같은 객체들을 렌더링하지만, 시점(Camera)이나 설정은 다를 수 있습니다.
const view2 = new RedGPU.Display.View3D(redGPUContext, scene, camera2);
```

## 5. 실습 예제

배경색이 설정된 Scene에 객체를 배치하고 렌더링하는 기본 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    // 1. Scene 생성
    const scene = new RedGPU.Display.Scene();
    
    // 2. 배경색(Clear Color) 설정
    scene.useBackgroundColor = true;
    scene.backgroundColor.setColorByHEX('#1a1a2e'); // Dark Navy

    // 3. 뷰 및 컨트롤러 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);
    
    // 4. 테스트 객체 추가
    const box = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#e94560')
    );
    scene.addChild(box);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationY += 1;
        box.rotationX += 0.5;
    });
});
```

## 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - Scene Background" slugHash="scene-background">
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

RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();

    // Scene Configuration
    scene.useBackgroundColor = true;
    scene.backgroundColor.setColorByHEX('#222831'); // Dark Gray

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    
    const box = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(box);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationY += 1;
        box.rotationZ += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 관련 문서

- **[GLTF Loader](../loader/gltf-loader.md)**: 외부 모델 리소스를 Scene으로 로드하는 방법.