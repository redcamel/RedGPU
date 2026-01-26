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

MSAA를 켜고 끄면서 지오메트리 외곽선의 변화를 비교해 보세요.

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
    
    // 외곽선 확인을 위한 밝은색 물체
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 2, 32),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffdd00')
    );
    mesh.rotationX = 45;
    mesh.rotationZ = 45;
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
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
        cursor: 'pointer', background: '#ffdd00', color: 'black', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        if (manager.useMSAA) {
            manager.useMSAA = false; // 끄기
        } else {
            manager.useMSAA = true; // 켜기
        }
        
        btn.textContent = `MSAA: ${manager.useMSAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useMSAA ? '#ffdd00' : '#ccc';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 0.01;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **하드웨어 지원**: GPU의 내장 기능을 사용합니다.
- **경계선 특화**: 물체의 테두리를 부드럽게 만드는 데 탁월합니다.
- **기본값**: 일반 디스플레이 환경에서는 기본적으로 활성화됩니다.
