---
title: FXAA
order: 3
---

# FXAA

**FXAA**(Fast Approximate Antialiasing) 는 렌더링이 완료된 2D 이미지에서 명암 대비가 큰 경계선을 검출하여 부드럽게 블러링하는 후처리 (Post-Processing) 방식의
안티앨리어싱 기법입니다.

## 1. 특징 및 사용법

`redGPUContext.antialiasingManager.useFXAA` 속성으로 활성화하며, 켜는 즉시 `TAA` 와 `MSAA` 는 자동 해제됩니다.

- **초경량 연산**: 추가적인 멀티샘플링 버퍼나 히스토리 버퍼를 요구하지 않아 모바일 및 저사양 기기에 적합합니다.
- **제약 사항**: 이미지 픽셀 단위로 경계를 뭉개므로 고주파 텍스처 디테일이 미세하게 흐려질 수 있습니다.

```javascript
// 전역 FXAA 활성화 (다른 AA는 자동 비활성화)
redGPUContext.antialiasingManager.useFXAA = true;
```

---

## 2. 실습 예제

FXAA가 지오메트리 외곽선과 텍스처 경계를 어떻게 처리하는지 확인합니다.

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

    // 초기 상태: FXAA 활성화
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
        manager.useFXAA = !manager.useFXAA;
        
        btn.textContent = `FXAA: ${manager.useFXAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useFXAA ? '#00aaff' : '#555';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        scene.children.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh) mesh.rotationY += 0.01;
        });
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 다음 단계

- **[플러그인 시스템](../plugins/index.md)** : 외부 확장 기능 활용
