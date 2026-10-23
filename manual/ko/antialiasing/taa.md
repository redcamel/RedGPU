---
title: TAA
order: 1
---

# TAA

**TAA**(Temporal Antialiasing) 는 카메라를 서브픽셀 단위로 미세하게 흔들며 (Jittering) 렌더링한 이전 프레임과 현재 프레임을 시간축으로 누적·합성하여 계단 현상을 제거하는
기법입니다. 지오메트리 외곽선뿐만 아니라 텍스처와 셰이더 하이라이트의 자글거림까지 억제합니다.

## 1. 특징 및 사용법

`redGPUContext.antialiasingManager.useTAA` 속성으로 전역 활성화하며, 켜는 즉시 `MSAA` 와 `FXAA` 는 자동 해제됩니다. 시간축 누적 과정에서 발생할 수 있는 미세한 흐림
현상은 내장된 대비 적응형 샤프닝 패스 (`TAACASPass`)로 복원하며, 개별 `View3D` 의 `view.taa` 인스턴스에서 제어합니다.

- **`view.taa.sharpness`** (`number`, 기본값: `0.5`, 범위: `0.0 ~ 1.0`): 뷰별 대비 적응형 샤프닝 강도를 조절합니다.
- **`view.taa.reset()`**: 카메라 순간 이동이나 씬 전환 시 이전 프레임 히스토리 버퍼를 즉시 초기화하여 잔상 (Ghosting)을 방지합니다.

```javascript
// 1. 전역 TAA 활성화 (다른 AA는 자동 비활성화)
redGPUContext.antialiasingManager.useTAA = true;

// 2. 뷰별 샤프닝 강도 조절 (0.0 ~ 1.0, 기본값: 0.5)
view.taa.sharpness = 0.5;

// 3. 카메라 순간 이동 시 히스토리 버퍼 초기화
view.taa.reset();
```

---

## 2. 실습 예제

그리드 패턴, 와이어프레임 외곽선, 텍스처 표면에서 TAA 활성화 여부에 따른 품질 차이를 확인합니다.

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

    // 초기 상태: TAA 활성화
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
        manager.useTAA = !manager.useTAA;
        
        btn.textContent = `TAA: ${manager.useTAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useTAA ? '#00aaff' : '#555';
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

## 다음 단계

- **[MSAA](./msaa.md)** : 하드웨어 멀티샘플링 안티앨리어싱
- **[FXAA](./fxaa.md)** : 후처리 기반 고속 근사 안티앨리어싱
