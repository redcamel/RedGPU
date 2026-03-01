import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] UV Transform 예제
 * [EN] UV Transform example
 *
 * [KO] 텍스처 UV 좌표의 오프셋(이동)과 스케일(크기)을 변환하는 기능을 시연합니다.
 * [EN] Demonstrates how to transform the offset (translation) and scale (size) of texture UV coordinates.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    async (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.tilt = -20;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // Lights
        const ambientLight = new RedGPU.Light.AmbientLight();
        ambientLight.intensity = 0.5;
        scene.lightManager.ambientLight = ambientLight;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.x = 10; directionalLight.y = 20; directionalLight.z = 10;
        scene.lightManager.addDirectionalLight(directionalLight);

        // Textures & Materials
        const textureGrid = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const textureHTest = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg');
        const repeatSampler = new RedGPU.Resource.Sampler(redGPUContext);
        repeatSampler.addressModeU = 'repeat'; repeatSampler.addressModeV = 'repeat';

        const materialTop = new RedGPU.Material.BitmapMaterial(redGPUContext, textureGrid);
        materialTop.diffuseTextureSampler = repeatSampler;
        const materialBottom = new RedGPU.Material.BitmapMaterial(redGPUContext, textureHTest);
        materialBottom.diffuseTextureSampler = repeatSampler;

        // Primitives
        const rows = [
            [
                { name: 'Box', geo: new RedGPU.Primitive.Box(redGPUContext) },
                { name: 'Capsule', geo: new RedGPU.Primitive.Capsule(redGPUContext) },
                { name: 'Sphere', geo: new RedGPU.Primitive.Sphere(redGPUContext) },
                { name: 'Cylinder', geo: new RedGPU.Primitive.Cylinder(redGPUContext) }
            ],
            [
                { name: 'Cone', geo: new RedGPU.Primitive.Cone(redGPUContext) },
                { name: 'Torus', geo: new RedGPU.Primitive.Torus(redGPUContext,0.7) },
                { name: 'TorusKnot', geo: new RedGPU.Primitive.TorusKnot(redGPUContext, 0.7, 0.2) },
                { name: 'Plane', geo: new RedGPU.Primitive.Plane(redGPUContext) }
            ],
            [
                { name: 'Ground', geo: new RedGPU.Primitive.Ground(redGPUContext) },
                { name: 'Circle', geo: new RedGPU.Primitive.Circle(redGPUContext, 1, 64, 0, Math.PI * 2, false) },
                { name: 'Ring', geo: new RedGPU.Primitive.Ring(redGPUContext, 0.5, 1, 64, 1, 0, Math.PI * 2, false) }
            ]
        ];

        // Radial Mode Support
        const radialGeos = {
            'Circle': new RedGPU.Primitive.Circle(redGPUContext, 1, 64, 0, Math.PI * 2, true),
            'Ring': new RedGPU.Primitive.Ring(redGPUContext, 0.5, 1, 64, 1, 0, Math.PI * 2, true),
            'Cylinder': new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 1, 32, 1, true, true, 0, Math.PI * 2, true, true),
            'Cone': new RedGPU.Primitive.Cone(redGPUContext, 1, 1, 32, 1, true, 0, Math.PI * 2, true)
        };

        const trioGapX = 2.6; // Wider gap within a pair to prevent overlap
        const itemGapX = 7.0; // Wider gap between items
        const rowGapY = 3.5;

        rows.forEach((primitives, rowIndex) => {
            const y = 3.5 - rowIndex * rowGapY;
            const startX = -(primitives.length - 1) * itemGapX / 2;

            primitives.forEach((item, index) => {
                const x = startX + index * itemGapX;
                const isRadialSupported = !!radialGeos[item.name];

                // Name Label
                const nameLabel = new RedGPU.Display.TextField3D(redGPUContext);
                nameLabel.text = item.name; nameLabel.worldSize = 0.7; nameLabel.color = '#ffffff';
                nameLabel.setPosition(x, y + 1.2, 0);
                scene.addChild(nameLabel);

                // Planar Mesh (Left)
                const planarMesh = new RedGPU.Display.Mesh(redGPUContext, item.geo, materialTop);
                planarMesh.setPosition(x - trioGapX / 2, y, 0);
                scene.addChild(planarMesh);

                // Radial or Plain Mesh (Right)
                const radialMesh = new RedGPU.Display.Mesh(redGPUContext, radialGeos[item.name] || item.geo, materialBottom);
                radialMesh.setPosition(x + trioGapX / 2, y, 0);
                scene.addChild(radialMesh);

                // Mode Labels (Only shown if Radial is supported)
                if (isRadialSupported) {
                    const planarLabel = new RedGPU.Display.TextField3D(redGPUContext);
                    planarLabel.text = 'Planar'; planarLabel.worldSize = 0.5; planarLabel.color = '#aaaaaa';
                    planarLabel.setPosition(x - trioGapX / 2, y - 1.1, 0);
                    scene.addChild(planarLabel);

                    const radialLabel = new RedGPU.Display.TextField3D(redGPUContext);
                    radialLabel.text = 'Radial'; radialLabel.worldSize = 0.5; radialLabel.color = '#aaaaaa';
                    radialLabel.setPosition(x + trioGapX / 2, y - 1.1, 0);
                    scene.addChild(radialLabel);
                }
            });
        });

        const renderer = new RedGPU.Renderer();
        const scrollInfo = { autoScroll: true, speedU: 0.001, speedV: 0.002, offsetU: 0, offsetV: 0, scaleU: 1, scaleV: 1 };

        renderer.start(redGPUContext, () => {
            if (scrollInfo.autoScroll) {
                scrollInfo.offsetU += scrollInfo.speedU; scrollInfo.offsetV += scrollInfo.speedV;
                if (scrollInfo.offsetU > 2) scrollInfo.offsetU -= 4; if (scrollInfo.offsetV > 2) scrollInfo.offsetV -= 4;
                if (scrollInfo.offsetU < -2) scrollInfo.offsetU += 4; if (scrollInfo.offsetV < -2) scrollInfo.offsetV += 4;
                materialTop.textureOffset = [scrollInfo.offsetU, scrollInfo.offsetV];
                materialBottom.textureOffset = [scrollInfo.offsetU, scrollInfo.offsetV];
            }
        });

        renderTestPane(redGPUContext, { materialTop, materialBottom, scrollInfo });
    },
    (failReason) => console.error(failReason)
);

async function renderTestPane(redGPUContext, testTarget) {
    const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    const { materialTop, materialBottom, scrollInfo } = testTarget;

    const folderScroll = pane.addFolder({ title: 'Auto Scroll Control' });
    folderScroll.addBinding(scrollInfo, 'autoScroll', { label: 'Use Auto Scroll' });
    folderScroll.addBinding(scrollInfo, 'speedU', { min: -0.01, max: 0.01, step: 0.0001, label: 'Speed U' });
    folderScroll.addBinding(scrollInfo, 'speedV', { min: -0.01, max: 0.01, step: 0.0001, label: 'Speed V' });

    const folderManual = pane.addFolder({ title: 'Manual UV Transform' });
    folderManual.addBinding(scrollInfo, 'offsetU', { min: -2, max: 2, step: 0.0001, label: 'Offset U' }).on('change', (ev) => { if (!scrollInfo.autoScroll) { materialTop.textureOffset = [ev.value, materialTop.textureOffset[1]]; materialBottom.textureOffset = [ev.value, materialBottom.textureOffset[1]]; } });
    folderManual.addBinding(scrollInfo, 'offsetV', { min: -2, max: 2, step: 0.0001, label: 'Offset V' }).on('change', (ev) => { if (!scrollInfo.autoScroll) { materialTop.textureOffset = [materialTop.textureOffset[0], ev.value]; materialBottom.textureOffset = [materialBottom.textureOffset[0], ev.value]; } });
    folderManual.addBinding(scrollInfo, 'scaleU', { min: 0.1, max: 10, step: 0.0001, label: 'Scale U' }).on('change', (ev) => { materialTop.textureScale = [ev.value, materialTop.textureScale[1]]; materialBottom.textureScale = [ev.value, materialBottom.textureScale[1]]; });
    folderManual.addBinding(scrollInfo, 'scaleV', { min: 0.1, max: 10, step: 0.0001, label: 'Scale V' }).on('change', (ev) => { materialTop.textureScale = [materialTop.textureScale[0], ev.value]; materialBottom.textureScale = [materialBottom.textureScale[0], ev.value]; });

    pane.addButton({ title: 'Reset Transform' }).on('click', () => {
        scrollInfo.offsetU = 0; scrollInfo.offsetV = 0; scrollInfo.scaleU = 1; scrollInfo.scaleV = 1;
        materialTop.textureOffset = [0, 0]; materialBottom.textureOffset = [0, 0];
        materialTop.textureScale = [1, 1]; materialBottom.textureScale = [1, 1];
        pane.refresh();
    });
    setInterval(() => { if (scrollInfo.autoScroll) pane.refresh(); }, 100);
}
