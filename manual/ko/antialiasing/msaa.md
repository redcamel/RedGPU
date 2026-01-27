---
title: MSAA
order: 2
---

# MSAA (Multisample AA)

**MSAA**(Multisample Antialiasing) 는 하드웨어(GPU) 레벨에서 지원하는 가장 표준적인 안티앨리어싱 방식입니다. 지오메트리의 경계(Edge) 부분을 여러 번 샘플링하여 부드럽게 처리합니다.

## 1. 특징 및 장점

- **표준 품질**: 오랫동안 사용되어 온 검증된 방식으로, 물체의 외곽선을 매우 깔끔하게 정리합니다.
- **성능 밸런스**: 텍스처 내부까지 처리하는 슈퍼 샘플링(SSAA)보다는 가볍지만, 후처리 방식(FXAA)보다는 메모리를 더 사용합니다.
- **제약**: 지오메트리의 외곽선만 부드럽게 처리하므로, 텍스처 내부의 자글거림이나 쉐이더 알리어싱은 해결하지 못합니다.

## 2. 사용법

`antialiasingManager.useMSAA` 를 통해 활성화합니다. 이를 켜면 FXAA나 TAA는 자동으로 비활성화됩니다.

```javascript
// MSAA 활성화 (다른 AA는 꺼짐)
redGPUContext.antialiasingManager.useMSAA = true;
```

## 3. 실습 예제: MSAA 적용

MSAA를 켜고 끄면서 지오메트리 외곽선과 하이라이트의 변화를 비교해 보세요.

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
        if (manager.useMSAA) {
            manager.useMSAA = false; // 끄기
        } else {
            manager.useMSAA = true; // 켜기
        }
        
        btn.textContent = `MSAA: ${manager.useMSAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useMSAA ? '#00aaff' : '#ccc';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        sphere.rotationY += 0.01;
        box.rotationY += 0.01;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **하드웨어 지원**: GPU의 내장 기능을 사용합니다.
- **경계선 특화**: 물체의 테두리를 부드럽게 만드는 데 탁월합니다.
- **기본값**: 일반 디스플레이 환경에서는 기본적으로 활성화됩니다.