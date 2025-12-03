import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {

        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;
        controller.minDistance = 3;
        controller.maxDistance = 50;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.color.setColorByRGB(255, 255, 220);
        directionalLight.intensity = 0.7;
        directionalLight.direction = [-0.4, -1, -0.3];
        scene.lightManager.addDirectionalLight(directionalLight);
        directionalLight.enableDebugger = true;

        const pointLight = new RedGPU.Light.PointLight();
        pointLight.color.setColorByRGB(255, 120, 120);
        pointLight.intensity = 1.3;
        pointLight.radius = 6.0;
        pointLight.setPosition(-6, 4, 2);
        scene.lightManager.addPointLight(pointLight);
        pointLight.enableDebugger = true;

        const spotLight = new RedGPU.Light.SpotLight();
        spotLight.color.setColorByRGB(120, 160, 255);
        spotLight.intensity = 1.6;
        spotLight.radius = 12.0;
        spotLight.setPosition(6, 5, 1);
        spotLight.direction = [-0.8, -0.7, -0.3];
        spotLight.innerCutoff = 10.0;
        spotLight.outerCutoff = 18.0;
        scene.lightManager.addSpotLight(spotLight);
        spotLight.enableDebugger = true;

        const centerSphere = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 32, 32),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff')
        );
        centerSphere.enableDebugger = true;
        centerSphere.setPosition(0, 0, 0);
        scene.addChild(centerSphere);

        const rotatingBox = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, 0.8, 0.8, 0.8),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#ffff88')
        );
        rotatingBox.enableDebugger = true;
        rotatingBox.setPosition(2.5, 1.5, 0);
        centerSphere.addChild(rotatingBox);

        const testBoxes = [];
        const positions = [
            [-2.5, 0, -2.5, '#ff8888'],
            [2.5, 0, -2.5, '#88ff88'],
            [-2.5, 0, 2.5, '#8888ff'],
            [2.5, 0, 2.5, '#ffaa88']
        ];

        positions.forEach(([x, y, z, color], index) => {
            const box = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Box(redGPUContext, 0.8, 1.2, 0.8),
                new RedGPU.Material.PhongMaterial(redGPUContext, color)
            );
            box.enableDebugger = true;
            box.setPosition(x, y, z);
            scene.addChild(box);
            testBoxes.push(box);
        });

        const groundPlane = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Plane(redGPUContext, 16, 16),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#dddddd')
        );
        groundPlane.enableDebugger = true;
        groundPlane.setPosition(0, -1.5, -2);
        groundPlane.rotationX = -Math.PI / 2;
        scene.addChild(groundPlane);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            rotatingBox.rotationX += 0.02;
            rotatingBox.rotationY += 0.015;
            rotatingBox.rotationZ += 0.01;

            centerSphere.rotationY += 0.005;

            testBoxes.forEach((box, index) => {
                box.rotationY += 0.01 * (index + 1);
            });
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view);

    },
    (failReason) => {
        console.error('초기화 실패:', failReason);

        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const {setDebugButtons} = await import( "../../../exampleHelper/createExample/panes/index.js" );
    setDebugButtons(redGPUContext);
    const pane = new Pane();
    const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    targetView.ibl = ibl;
    targetView.skybox = skybox;
    const TEST_DATA = {
        grid: !!targetView.grid,
        axis: !!targetView.axis,
        volumeType: 'OBB'
    }
    pane.addBinding(TEST_DATA, 'grid').on('change', (ev) => {
        targetView.grid = ev.value;
    });
    pane.addBinding(TEST_DATA, 'axis').on('change', (ev) => {
        targetView.axis = ev.value;
    });

    pane.addBinding(TEST_DATA, 'volumeType', {
        label: 'Mesh Volume Type',
        options: {
            'OBB': 'OBB',
            'AABB': 'AABB',
            'BOTH': 'BOTH'
        }
    }).on('change', (evt) => {
        console.log('Volume type changed to:', evt.value);

        // 헬퍼 함수: 재귀적으로 모든 메시의 디버그 모드 업데이트
        const updateDebugMode = (object, mode) => {
            // 현재 객체가 메시이고 디버거가 활성화된 경우
            if (object.drawDebugger && object.enableDebugger) {
                object.drawDebugger.debugMode = mode;
                console.log(`✅ Updated ${object.name || 'Unnamed'} to ${mode}`);
            }

            // 자식 객체들도 재귀적으로 처리
            if (object.children && Array.isArray(object.children)) {
                object.children.forEach(child => updateDebugMode(child, mode));
            }
        };

        // 씬의 모든 자식 객체에 적용
        updateDebugMode(targetView.scene, evt.value);
    });

    setDirectionalLightPanel(pane, targetView)
    setPointLightPanel(pane, targetView)
    setSpotLightPanel(pane, targetView)

};

const setSpotLightPanel = (pane, targetView) => {
    const light = targetView.scene.lightManager.spotLights[0];
    const lightFolder = pane.addFolder({title: 'Spot Light', expanded: true});
    const lightConfig = {
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    // Position 컨트롤 (X, Y, Z)
    const positionFolder = lightFolder.addFolder({title: 'Position', expanded: true});
    ['X', 'Y', 'Z'].forEach((axis) => {
        positionFolder.addBinding(light, axis.toLowerCase(), {
            min: -15, max: 15, step: 0.1  // 범위를 늘려서 더 자유롭게 배치 가능
        });
    });

    // Direction 컨트롤 (X, Y, Z)
    const directionFolder = lightFolder.addFolder({title: 'Direction', expanded: true});
    ['X', 'Y', 'Z'].forEach((axis) => {
        directionFolder.addBinding(light, `direction${axis}`, {
            min: -1, max: 1, step: 0.01
        });
    });

    // Light Properties
    lightFolder.addBinding(light, 'radius', {
        min: 0.1, max: 20, step: 0.1
    });

    lightFolder.addBinding(light, 'intensity', {
        min: 0, max: 2, step: 0.01
    });

    // Cutoff Angles (SpotLight 특화)
    lightFolder.addBinding(light, 'innerCutoff', {
        min: 0, max: 90, step: 0.5
    });

    lightFolder.addBinding(light, 'outerCutoff', {
        min: 0, max: 90, step: 0.5
    });

    // Color 컨트롤
    lightFolder.addBinding(lightConfig, "color", {
        picker: "inline",
        view: "color",
        expanded: true
    }).on("change", (ev) => {
        const {r, g, b} = ev.value;
        light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
    });

    // Debug 컨트롤
    lightFolder.addBinding(light, 'enableDebugger');
};

const setPointLightPanel = (pane, targetView) => {
    const light = targetView.scene.lightManager.pointLights[0];
    const lightFolder = pane.addFolder({title: 'Point Light', expanded: true});
    const lightConfig = {
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    ['X', 'Y', 'Z'].forEach((axis) => {
        lightFolder.addBinding(light, axis.toLowerCase(), {
            min: -15, max: 15, step: 0.01  // 범위를 늘려서 더 자유롭게 배치 가능
        });
    });

    lightFolder.addBinding(light, 'radius', {
        min: 0.1, max: 20, step: 0.01
    });

    lightFolder.addBinding(light, 'intensity', {
        min: 0, max: 2, step: 0.01
    });

    lightFolder.addBinding(lightConfig, "color", {
        picker: "inline",
        view: "color",
        expanded: true
    }).on("change", (ev) => {
        const {r, g, b} = ev.value;
        light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
    });

    lightFolder.addBinding(light, 'enableDebugger');
};

const setDirectionalLightPanel = (pane, targetView) => {
    const light = targetView.scene.lightManager.directionalLights[0];
    const lightFolder = pane.addFolder({title: 'Directional Light', expanded: true});
    const lightConfig = {
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    // Direction 컨트롤 폴더 추가로 더 명확하게 구분
    const directionFolder = lightFolder.addFolder({title: 'Direction', expanded: true});
    ['X', 'Y', 'Z'].forEach((axis, index) => {
        directionFolder.addBinding(light, `direction${axis}`, {
            min: -3, max: 3, step: 0.01
        });
    });

    lightFolder.addBinding(light, 'intensity', {
        min: 0, max: 2, step: 0.01
    });

    lightFolder.addBinding(lightConfig, "color", {picker: "inline", view: "color", expanded: true})
        .on("change", (ev) => {
            const {r, g, b} = ev.value;
            light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
        });

    lightFolder.addBinding(light, 'enableDebugger');
}
