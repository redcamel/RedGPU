---
title: FXAA
order: 3
---

# FXAA (Fast Approximate AA)

**FXAA** 는 렌더링된 최종 이미지를 분석하여 경계를 찾고 흐리게 만드는 **후처리**(Post-Processing) 방식의 안티앨리어싱입니다.

## 1. 특징 및 장점

- **초고속**: 연산 비용이 매우 적어 모바일 기기에서도 부담 없이 사용할 수 있습니다.
- **메모리 절약**: MSAA처럼 추가적인 버퍼를 요구하지 않습니다.
- **제약**: 화면 전체적으로 미세한 블러(Blur)가 발생하여 텍스처가 약간 흐려 보일 수 있습니다.

## 2. 사용법

`antialiasingManager.useFXAA` 를 통해 활성화합니다. 이를 켜면 MSAA나 TAA는 자동으로 비활성화됩니다.

```javascript
// FXAA 활성화 (다른 AA는 꺼짐)
redGPUContext.antialiasingManager.useFXAA = true;
```

## 3. 실습 예제: FXAA 품질 확인

FXAA가 엣지뿐만 아니라 텍스처와 하이라이트의 자글거림을 어떻게 처리하는지 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU - FXAA Example" slugHash="antialiasing-fxaa">
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
    light.x = 10; light.y = 10; light.z = 10;
    scene.lightManager.addDirectionalLight(light);
    
    const ambientLight = new RedGPU.Light.AmbientLight();
    ambientLight.intensity = 0.3;
    scene.lightManager.ambientLight = ambientLight;

    // 1. 미세한 그리드 바닥 (패턴 알리어싱 확인용)
    const grid = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 100, 100, 50, 50),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#999999')
    );
    grid.drawMode = 'lines';
    scene.addChild(grid);

    // 2. 와이어프레임 구체 (지오메트리 엣지 확인용)
    const sphere = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Sphere(redGPUContext, 5, 32, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00aaff')
    );
    sphere.y = 5;
    sphere.x = -6;
    sphere.drawMode = 'lines';
    scene.addChild(sphere);

    // 3. 텍스처 박스 (텍스처 선명도 확인용)
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
    const boxMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    boxMaterial.diffuseTexture = texture;
    
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 6, 6, 6),
        boxMaterial
    );
    box.y = 5;
    box.x = 6;
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 25;
    controller.tilt = -15;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 2. FXAA 활성화
    redGPUContext.antialiasingManager.useFXAA = true;

    // UI: FXAA 토글
    const btn = document.createElement('button');
    btn.textContent = 'FXAA: ON';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', left: '20px',
        padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        if (manager.useFXAA) {
             manager.useFXAA = false; 
        } else {
             manager.useFXAA = true;
        }
        
        btn.textContent = `FXAA: ${manager.useFXAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useFXAA ? '#00aaff' : '#555';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        // 천천히 회전하며 텍스처 블러링 관찰
        scene.children.forEach(mesh => {
            if(mesh instanceof RedGPU.Display.Mesh) mesh.rotationY += 0.01;
        })
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **후처리 방식**: 렌더링된 이미지 위에서 동작합니다.
- **배타적 실행**: FXAA를 켜면 MSAA, TAA는 꺼집니다.
- **전역 제어**: `redGPUContext` 단위로 제어됩니다.
