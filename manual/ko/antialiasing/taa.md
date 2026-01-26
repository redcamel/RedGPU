---
title: TAA
order: 1
---

# TAA (Temporal AA)

**TAA**(Temporal Antialiasing) 는 이전 프레임의 결과물을 현재 프레임과 합성하여 계단 현상을 제거하는 시간축 기반 기법입니다.
현존하는 안티앨리어싱 기법 중 가장 뛰어난 품질을 보여주며, 영화와 같은 부드러운 이미지를 만들어냅니다.

## 1. 동작 원리

카메라를 아주 미세하게 흔들면서(Jittering) 렌더링한 여러 프레임을 누적하여 평균을 냅니다. 이를 통해 픽셀 단위보다 더 정밀한 해상도 정보를 얻어냅니다.

- **장점**: 움직임이 없는 정적인 장면에서 완벽에 가까운 안티앨리어싱 품질을 제공합니다.
- **단점**: 빠르게 움직이는 물체에서 잔상(Ghosting) 현상이 발생할 수 있습니다.

## 2. 사용법

`antialiasingManager.useTAA` 를 통해 활성화합니다. 이를 켜면 MSAA나 FXAA는 자동으로 비활성화됩니다.

```javascript
// TAA 활성화 (다른 AA는 꺼짐)
redGPUContext.antialiasingManager.useTAA = true;
```

## 3. 실습 예제: TAA 품질 확인

TAA를 적용하면 복잡한 와이어프레임이나 미세한 패턴의 자글거림(Shimmering)이 획기적으로 줄어드는 것을 확인할 수 있습니다.

<ClientOnly>
<CodePen title="RedGPU - TAA Example" slugHash="antialiasing-taa">
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
    
    // 1. 복잡한 격자 무늬 바닥 (앨리어싱이 잘 보이는 패턴)
    const grid = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 100, 100, 100, 100), // 세그먼트 100x100
        new RedGPU.Material.ColorMaterial(redGPUContext, '#aaaaaa')
    );
    grid.drawMode = 'lines';
    scene.addChild(grid);

    // 2. 복잡한 와이어프레임 구체
    const sphere = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Sphere(redGPUContext, 5, 64, 64),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#00aaff')
    );
    sphere.y = 5;
    sphere.drawMode = 'lines';
    scene.addChild(sphere);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 20;
    controller.tilt = -15;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 초기 상태: TAA 활성화, MSAA 비활성화 (비교 극대화)
    redGPUContext.antialiasingManager.useMSAA = false;
    redGPUContext.antialiasingManager.useTAA = true;

    // UI: TAA 토글 버튼
    const btn = document.createElement('button');
    btn.textContent = 'TAA: ON';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', left: '20px',
        padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        if (manager.useTAA) {
            manager.useTAA = false; // TAA 끔 (모두 꺼짐 = 자글거림 최대)
        } else {
            manager.useTAA = true;  // TAA 켬
        }
        
        btn.textContent = `TAA: ${manager.useTAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useTAA ? '#00aaff' : '#555';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        // 카메라를 천천히 움직여서 TAA의 안정성을 확인
        controller.pan += 0.1;
        sphere.rotationY += 0.1;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **최고 품질**: 계단 현상을 거의 완벽하게 제거합니다.
- **자동 선택**: 고해상도 디스플레이(Retina 등)에서는 기본적으로 TAA가 활성화됩니다.
- **고비용**: 매 프레임 연산 및 메모리 오버헤드가 발생하므로 데스크탑 환경에서 권장됩니다.