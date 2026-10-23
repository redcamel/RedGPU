---
title: Instancing Mesh LOD
order: 3
---

# Instancing Mesh LOD

`InstancingMesh` 의 LOD는 각 인스턴스와 카메라 간의 거리를 GPU 셰이더에서 병렬로 판정하여 지오메트리 버퍼를 분기합니다. CPU 거리 계산 오버헤드 없이 수만 개의 인스턴스에 거리별 LOD를
적용할 수 있습니다.

## 1. 동작 원리 및 사용법

일반 `Mesh` 와 동일하게 `instancedMesh.LODManager.addLOD(distance, geometry)` 메서드를 사용합니다. 등록된 LOD 레벨 수만큼 내부 서브 드로우 콜 (Sub Draw
Call)이 구성되며, GPU에서 인스턴스별 거리에 맞는 지오메트리로 분류하여 렌더링합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. InstancingMesh 생성 (기본 거리 0 ~ 30 구간: Sphere 32x32)
const instancedMesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    2000, 2000,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32), 
    material
);

// 2. 거리별 LOD 레벨 등록 (GPU에서 인스턴스별 거리 판정)
instancedMesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8)); // 거리 30 이상
instancedMesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));    // 거리 60 이상

scene.addChild(instancedMesh);
```

---

## 2. 실습 예제

2,000개의 인스턴스가 카메라 거리에 따라 구 (Sphere)에서 박스 (Box)로 개별 전환되는 모습을 확인합니다.

<ClientOnly>
<CodePen title="RedGPU - Instancing LOD Example" slugHash="lod-instancing">
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

    // 1. InstancingMesh 생성 (기본 거리 0 ~ 30: Sphere 32x32)
    const maxCount = 2000;
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);
    
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = texture;

    const mesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxCount,
        maxCount,
        geometry,
        material
    );
    scene.addChild(mesh);

    // 2. LOD 레벨 추가
    mesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
    mesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

    // 3. 인스턴스 위치 랜덤 배치
    const range = 100;
    for (let i = 0; i < maxCount; i++) {
        const instance = mesh.instanceChildren[i];
        instance.setPosition(
            Math.random() * range * 2 - range,
            Math.random() * range * 2 - range,
            Math.random() * range * 2 - range
        );
        instance.scale = Math.random() * 1.5 + 1.0;
    }

    // 4. 카메라 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 150;
    controller.speedDistance = 5;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 5. 렌더링 루프
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 0.002;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 다음 단계

- **[안티앨리어싱](../antialiasing/index.md)** : 화면 외곽선 계단 현상 제거
