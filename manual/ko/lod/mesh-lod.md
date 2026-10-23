---
title: Mesh LOD
order: 2
---

# Mesh LOD

`Mesh` 의 LOD는 CPU에서 매 프레임 카메라와의 거리를 계산하고, `mesh.LODManager` 에 등록된 조건에 맞는 지오메트리로 렌더링 대상을 교체합니다.

## 1. 동작 원리 및 사용법

`mesh.LODManager.addLOD(distance, geometry)` 메서드로 전환 거리와 교체할 지오메트리를 등록합니다. `LODManager` 는 등록된 레벨 중 현재 카메라 거리 이하에서 가장 큰
거리값을 가진 레벨의 지오메트리를 선택합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 기본 메시 생성 (거리 0 ~ 10 구간)
const mesh = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
    material
);

// 2. 거리별 LOD 레벨 등록
mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8)); // 거리 10 이상
mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));    // 거리 20 이상

scene.addChild(mesh);
```

---

## 2. 실습 예제

카메라 줌인·줌아웃에 따라 구체 (32세그먼트 ➔ 8세그먼트)에서 박스로 지오메트리가 전환되는 과정을 확인합니다.

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

    const ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 100);
    scene.lightManager.ambientLight = ambientLight;

    // 1. 재질 및 텍스처 설정
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = texture;

    // 2. 기본 메시 생성 (거리 0 ~ 10)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
        material
    );
    scene.addChild(mesh);

    // 3. LOD 레벨 추가
    mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
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
    const renderer = new RedGPU.Renderer();
    const render = () => {
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

---

## 다음 단계

- **[Instancing Mesh LOD](./instanced-lod.md)** : 대량 인스턴싱 메시에 GPU 기반 LOD 적용
