---
title: MSAA
order: 2
---

# MSAA

**MSAA**(Multisample Antialiasing) 는 지오메트리의 경계 (Edge) 영역을 여러 번 샘플링하여 외곽선 계단 현상을 제거하는 GPU 하드웨어 기반 안티앨리어싱 기법입니다. 일반 디스플레이
환경 (`devicePixelRatio <= 1.0`)에서 기본값으로 활성화됩니다.

## 1. 특징 및 사용법

`redGPUContext.antialiasingManager.useMSAA` 속성으로 활성화하며, 켜는 즉시 `TAA` 와 `FXAA` 는 자동 해제됩니다.

- **외곽선 특화**: 폴리곤 경계선을 선명하고 깔끔하게 정돈합니다.
- **제약 사항**: G-Buffer 전체를 멀티샘플링하므로 메모리 대역폭 소모가 크며, 폴리곤 내부의 텍스처 자글거림이나 셰이더 알리어싱은 처리하지 않습니다.

```javascript
// 전역 MSAA 활성화 (다른 AA는 자동 비활성화)
redGPUContext.antialiasingManager.useMSAA = true;
```

---

## 2. 실습 예제

MSAA를 켜고 끄면서 지오메트리 외곽선의 변화를 비교합니다.

<ClientOnly>
<CodePen title="RedGPU - MSAA Example" slugHash="antialiasing-msaa">
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
    
    const ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 60);
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

    // 초기 상태: MSAA 활성화
    redGPUContext.antialiasingManager.useMSAA = true;

    // UI: MSAA 토글
    const btn = document.createElement('button');
    btn.textContent = 'MSAA: ON';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', left: '20px',
        padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        manager.useMSAA = !manager.useMSAA;
        
        btn.textContent = `MSAA: ${manager.useMSAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useMSAA ? '#00aaff' : '#555';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        sphere.rotationY += 0.01;
        box.rotationY += 0.01;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 관련 예제

- [Hello World 3D](/RedGPU/examples/3d/helloWorld/)
- [내장 프리미티브 모음](/RedGPU/examples/3d/primitive/primitives/)

---

## 다음 단계

- **[FXAA](./fxaa.md)** : 후처리 기반 고속 근사 안티앨리어싱
- **[TAA](./taa.md)** : 시간축 누적 기반 안티앨리어싱
