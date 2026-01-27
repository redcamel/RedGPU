---
title: Mesh LOD
order: 2
---

# Mesh LOD

일반적인 **메시**(Mesh) 객체에 LOD 를 적용하는 방법을 다룹니다.
`Mesh` 의 LOD 는 CPU 에서 카메라 와의 거리를 매 프레임 계산하여, 조건에 맞는 **지오메트리**(Geometry) 로 교체하는 방식으로 동작합니다.

## 1. 동작 원리

`Mesh` 내부의 `LODManager` 는 등록된 LOD 레벨들을 순회하며, 현재 카메라 거리보다 작거나 같은 가장 큰 거리값의 레벨을 찾습니다.
적합한 레벨을 찾으면 해당 레벨에 등록된 지오메트리 로 렌더링 대상이 교체됩니다.

## 2. 사용법

`mesh.LODManager.addLOD(distance, geometry)` 를 사용하여 거리별 지오메트리 를 등록합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 기본 메쉬 생성 (거리 0~10)
const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32), 
    material
);

// 2. LOD 레벨 추가
// 거리 10 이상: Sphere (16x16)
mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 1, 16, 16));

// 거리 20 이상: Box
mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext));

scene.addChild(mesh);
```

## 3. 실습 예제

거리에 따라 구 형태가 단순해지다가 결국 박스로 변하는 과정을 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU - Mesh LOD Example" slugHash="lod-mesh-basic">
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
    
    // 조명 추가
    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);

    const ambientLight = new RedGPU.Light.AmbientLight();
    ambientLight.intensity = 0.5;
    scene.lightManager.ambientLight = ambientLight;

    // 1. 재질 및 텍스처 설정
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = texture;

    // 2. 기본 메쉬 생성 (거리 0 ~ 10)
    // High Detail: Sphere (반지름 2, 세그먼트 32x32)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
        material
    );
    scene.addChild(mesh);

    // 3. LOD 레벨 추가
    // Level 1: 거리 10 이상 (Mid Detail - Sphere 2, 8x8)
    mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
    
    // Level 2: 거리 20 이상 (Low Detail - Box 3x3x3)
    mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

    // 4. 상태 표시 UI
    const label = document.createElement('div');
    Object.assign(label.style, {
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '16px', textAlign: 'center'
    });
    document.body.appendChild(label);

    // 5. 카메라 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 10;
    controller.speedDistance = 0.5;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 6. 렌더링 루프
    const renderer = new RedGPU.Renderer(redGPUContext);
    const render = () => {
        // 거리 계산 및 UI 업데이트 (시각적 확인용)
        const dist = Math.sqrt(
            Math.pow(view.rawCamera.x - mesh.x, 2) +
            Math.pow(view.rawCamera.y - mesh.y, 2) +
            Math.pow(view.rawCamera.z - mesh.z, 2)
        );
        
        let currentLevel = "High (Sphere 32)";
        if (dist >= 20) currentLevel = "Low (Box)";
        else if (dist >= 10) currentLevel = "Mid (Sphere 8)";

        label.innerHTML = `Distance: ${dist.toFixed(1)}m <br/> Geometry: ${currentLevel}`;
    };
    
    renderer.start(redGPUContext, render);
});
</pre>
</CodePen>
</ClientOnly>
