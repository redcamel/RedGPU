---
title: Instancing Mesh LOD
order: 3
---

# Instancing Mesh LOD

대량의 객체를 렌더링하는 **인스턴싱 메시**(Instancing Mesh) 에 LOD 를 적용하는 방법을 다룹니다.
`InstancingMesh` 의 LOD 는 각 인스턴스별 거리 계산을 **GPU 쉐이더** 내부에서 병렬로 처리하므로, 수만 개의 객체에 대해 LOD 를 적용해도 CPU 부하가 거의 없는 것이 특징입니다.

## 1. 동작 원리

`InstancingMesh` 에 LOD 를 등록하면, 내부적으로 LOD 개수만큼의 **서브 드로우 콜**(Sub Draw Call) 이 생성될 수 있습니다.
하지만 렌더링 파이프라인 최적화를 통해, GPU 에서 각 인스턴스의 카메라 거리를 판단하고 적절한 지오메트리 버퍼를 참조하여 그립니다.

## 2. 사용법

일반 `Mesh` 와 동일하게 `LODManager.addLOD` 를 사용합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. InstancingMesh 생성 (기본: Sphere High Poly)
const instancedMesh = new RedGPU.Display.InstancingMesh(
    redGPUContext, 
    10000, 10000, 
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32), 
    material
);

// 2. LOD 레벨 추가
// GPU가 각 인스턴스별로 거리를 계산하여 아래 지오메트리를 적용합니다.
instancedMesh.LODManager.addLOD(20, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
instancedMesh.LODManager.addLOD(40, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

scene.addChild(instancedMesh);
```

## 3. 실습 예제: 2,000개의 LOD 큐브

2,000개의 객체가 카메라 와의 거리에 따라 모양이 변하는 것을 확인해 보세요. 카메라를 줌인/줌아웃 하면 멀리 있는 객체들은 박스(Box) 로, 가까운 객체들은 구(Sphere) 로 표시됩니다.

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
    
    const ambientLight = new RedGPU.Light.AmbientLight();
    ambientLight.intensity = 0.5;
    scene.lightManager.ambientLight = ambientLight;

    // 1. InstancingMesh 생성
    // 기본(0~30): Sphere High (32x32)
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
    // 30 이상: Sphere Low (8x8)
    mesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
    
    // 60 이상: Box
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

    // 5. 렌더링
    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        // 전체 회전
        mesh.rotationY += 0.002;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **GPU 가속**: CPU 연산 없이 GPU 에서 거리를 판단하므로 대량의 객체에도 성능 저하가 거의 없습니다.
- **메모리 절약**: 멀리 있는 객체에 저해상도 모델을 사용하여 정점 처리 비용을 획기적으로 줄입니다.
