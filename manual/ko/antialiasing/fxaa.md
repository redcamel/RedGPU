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

## 3. 실습 예제: FXAA On/Off 비교

`useFXAA` 속성을 토글하며 외곽선의 변화를 관찰해 보세요.

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
    
    // 1. 선명한 대비를 위해 검은 배경에 흰색 라인 객체 배치
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.3, 128, 64),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 2. FXAA 활성화 (기본 설정이 무엇이든 FXAA로 강제 전환됨)
    redGPUContext.antialiasingManager.useFXAA = true;

    // UI: FXAA 토글
    const btn = document.createElement('button');
    btn.textContent = 'FXAA: ON';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', left: '20px',
        padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', background: '#00CC99', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        // FXAA 토글 (꺼질 때는 MSAA를 켜는 것이 아니라 아예 끄는 상태로 전환)
        // 예제 단순화를 위해 토글 시 useFXAA = false만 수행 (모두 꺼짐)
        if (manager.useFXAA) {
             // FXAA 끄기 (모든 AA 꺼짐 상태가 됨)
             // 명시적으로 끄는 API는 없으므로 다른걸 켜거나 해야 하는데
             // API 상 false 대입이 가능하므로 false 대입
             manager.useFXAA = false; 
        } else {
             manager.useFXAA = true;
        }
        
        btn.textContent = `FXAA: ${manager.useFXAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useFXAA ? '#00CC99' : '#ccc';
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

- **후처리 방식**: 렌더링된 이미지 위에서 동작합니다.
- **배타적 실행**: FXAA를 켜면 MSAA, TAA는 꺼집니다.
- **전역 제어**: `redGPUContext` 단위로 제어됩니다.