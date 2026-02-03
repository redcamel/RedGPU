import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    async (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // Lighting
        const ambientLight = new RedGPU.Light.AmbientLight();
        ambientLight.intensity = 0.5;
        scene.lightManager.ambientLight = ambientLight;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.x = 10; directionalLight.y = 20; directionalLight.z = 10;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 단일 비트맵 텍스처 생성
        // [EN] Create a single bitmap texture
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        
        // [KO] 공용 머티리얼 설정 (모든 메시가 이 두 머티리얼 중 하나를 공유함)
        // [EN] Set up shared materials (All meshes share one of these two materials)
        const phongMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        phongMaterial.diffuseTexture = texture;
        
        const bitmapMaterial = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        const primitives = [
            { name: 'Box', geo: new RedGPU.Primitive.Box(redGPUContext) },
            { name: 'Sphere', geo: new RedGPU.Primitive.Sphere(redGPUContext) },
            { name: 'Torus', geo: new RedGPU.Primitive.Torus(redGPUContext) },
            { name: 'TorusKnot', geo: new RedGPU.Primitive.TorusKnot(redGPUContext) },
            { name: 'Cylinder', geo: new RedGPU.Primitive.Cylinder(redGPUContext) },
            { name: 'Plane', geo: new RedGPU.Primitive.Plane(redGPUContext) }
        ];

        primitives.forEach((item, index) => {
            const x = (index - (primitives.length - 1) / 2) * 2.5;
            
            // [KO] 상단: PhongMaterial 메시 (텍스처 적용됨)
            // [EN] Top: PhongMaterial meshes (Texture applied)
            const pMesh = new RedGPU.Display.Mesh(redGPUContext, item.geo, phongMaterial);
            pMesh.x = x; pMesh.y = 1.25;
            scene.addChild(pMesh);

            // [KO] 하단: BitmapMaterial 메시 (텍스처 적용됨)
            // [EN] Bottom: BitmapMaterial meshes (Texture applied)
            const bMesh = new RedGPU.Display.Mesh(redGPUContext, item.geo, bitmapMaterial);
            bMesh.x = x; bMesh.y = -1.25;
            scene.addChild(bMesh);
        });

        const renderer = new RedGPU.Renderer();
        const scrollInfo = {
            autoScroll: true,
            speedU: 0.001,
            speedV: 0.002,
            offsetU: 0,
            offsetV: 0,
            scaleU: 1,
            scaleV: 1
        };

        renderer.start(redGPUContext, (time) => {
            if (scrollInfo.autoScroll) {
                scrollInfo.offsetU += scrollInfo.speedU;
                scrollInfo.offsetV += scrollInfo.speedV;
                
                // 순환 처리
                if (scrollInfo.offsetU > 2) scrollInfo.offsetU -= 4;
                if (scrollInfo.offsetV > 2) scrollInfo.offsetV -= 4;
                if (scrollInfo.offsetU < -2) scrollInfo.offsetU += 4;
                if (scrollInfo.offsetV < -2) scrollInfo.offsetV += 4;
                
                const offset = [scrollInfo.offsetU, scrollInfo.offsetV];
                phongMaterial.textureOffset = offset;
                bitmapMaterial.textureOffset = offset;
            }
        });

        renderTestPane(redGPUContext, {
            phongMaterial,
            bitmapMaterial,
            scrollInfo
        });
    },
    (failReason) => console.error(failReason)
);

async function renderTestPane(redGPUContext, testTarget) {
    const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js");
    
    setDebugButtons(RedGPU, redGPUContext);
    
    const pane = new Pane();
    const { phongMaterial, bitmapMaterial, scrollInfo } = testTarget;

    const folderScroll = pane.addFolder({ title: 'Auto Scroll Control' });
    folderScroll.addBinding(scrollInfo, 'autoScroll', { label: 'Use Auto Scroll' });
    folderScroll.addBinding(scrollInfo, 'speedU', { min: -0.01, max: 0.01, step: 0.0001, label: 'Speed U' });
    folderScroll.addBinding(scrollInfo, 'speedV', { min: -0.01, max: 0.01, step: 0.0001, label: 'Speed V' });

    const folderManual = pane.addFolder({ title: 'Manual UV Transform' });
    
    // [KO] Offset 슬라이더
    folderManual.addBinding(scrollInfo, 'offsetU', { min: -2, max: 2, step: 0.01, label: 'Offset U' }).on('change', (ev) => {
        if (!scrollInfo.autoScroll) {
            const val = [ev.value, scrollInfo.offsetV];
            phongMaterial.textureOffset = val;
            bitmapMaterial.textureOffset = val;
        }
    });
    folderManual.addBinding(scrollInfo, 'offsetV', { min: -2, max: 2, step: 0.01, label: 'Offset V' }).on('change', (ev) => {
        if (!scrollInfo.autoScroll) {
            const val = [scrollInfo.offsetU, ev.value];
            phongMaterial.textureOffset = val;
            bitmapMaterial.textureOffset = val;
        }
    });

    folderManual.addBinding(scrollInfo, 'scaleU', { min: 0.1, max: 10, step: 0.1, label: 'Scale U' }).on('change', (ev) => {
        const val = [ev.value, scrollInfo.scaleV];
        phongMaterial.textureScale = val;
        bitmapMaterial.textureScale = val;
    });
    folderManual.addBinding(scrollInfo, 'scaleV', { min: 0.1, max: 10, step: 0.1, label: 'Scale V' }).on('change', (ev) => {
        const val = [scrollInfo.scaleU, ev.value];
        phongMaterial.textureScale = val;
        bitmapMaterial.textureScale = val;
    });

    pane.addButton({ title: 'Reset Transform' }).on('click', () => {
        scrollInfo.offsetU = 0; scrollInfo.offsetV = 0;
        scrollInfo.scaleU = 1; scrollInfo.scaleV = 1;
        phongMaterial.textureOffset = [0, 0];
        bitmapMaterial.textureOffset = [0, 0];
        phongMaterial.textureScale = [1, 1];
        bitmapMaterial.textureScale = [1, 1];
        pane.refresh();
    });

    setInterval(() => {
        if (scrollInfo.autoScroll) pane.refresh();
    }, 100);
}