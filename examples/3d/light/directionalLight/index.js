import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper2/dist/index.js";

/**
 * [KO] Directional Light Lighting Studio 예제 (UE5 스타일)
 * [EN] Directional Light Lighting Studio Example (UE5 Style)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 35;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        
        redGPUContext.addView(view);

        const light = createDirectionalLight(scene);
        createMaterialStudio(redGPUContext, scene);
        createStudioEnvironment(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPaneWithLightControl(redGPUContext, light, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createDirectionalLight = (scene) => {
    // [KO] DirectionalLight는 별도의 룩스 설정을 하지 않고 기본 물리 단위를 사용합니다.
    // [EN] DirectionalLight uses default physical units without a separate lux setting.
    const direction = [-1, -1, -1];
    const light = new RedGPU.Light.DirectionalLight(direction, '#fff');
    light.enableDebugger = true;
    scene.lightManager.addDirectionalLight(light);
    return light;
};

const createStudioEnvironment = (redGPUContext, scene) => {
    const studioMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    studioMaterial.baseColorFactor = [0.5, 0.5, 0.5, 1.0];
    studioMaterial.roughnessFactor = 0.5;

    // Floor
    const floorGeo = new RedGPU.Primitive.Plane(redGPUContext, 100, 100);
    const floor = new RedGPU.Display.Mesh(redGPUContext, floorGeo, studioMaterial);
    floor.rotationX = -90;
    floor.y = -6;
    scene.addChild(floor);

    // Back Wall
    const wallGeo = new RedGPU.Primitive.Plane(redGPUContext, 100, 60);
    const wall = new RedGPU.Display.Mesh(redGPUContext, wallGeo, studioMaterial);
    wall.z = -25;
    wall.y = 24;
    scene.addChild(wall);
};

const createMaterialStudio = (redGPUContext, scene) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2.5, 32, 32, 32);
    const rows = 2;
    const cols = 5;
    const spacing = 8;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const metallic = row === 1 ? 1.0 : 0.0;
            const roughness = col / (cols - 1);
            
            const material = new RedGPU.Material.PBRMaterial(redGPUContext);
            material.baseColorFactor = metallic === 1.0 ? [1.0, 1.0, 1.0, 1.0] : [1.0, 0.0, 0.0, 1.0];
            material.metallicFactor = metallic;
            material.roughnessFactor = roughness;

            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            const x = col * spacing - ((cols - 1) * spacing) / 2;
            const y = row * spacing - ((rows - 1) * spacing) / 2;
            
            mesh.setPosition(x, y + 2, 0);
            scene.addChild(mesh);
        }
    }
};

const renderTestPaneWithLightControl = (redGPUContext, light, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        ibl: true,
        guiCallback: (pane) => {
            const autoExposure = view.postEffectManager.autoExposure;

            // 1. Light Folder
            const lightConfig = {
                color: {r: light.color.r, g: light.color.g, b: light.color.b},
                directionX: light.direction[0],
                directionY: light.direction[1],
                directionZ: light.direction[2],
            };

            const lightFolder = pane.addFolder({title: 'Light: Directional', expanded: true});
            
            const lightPropFolder = lightFolder.addFolder({title: 'Color', expanded: true});
            
            lightPropFolder.addBinding(lightConfig, 'color', {picker: 'inline', view: 'color'}).on('change', (evt) => {
                const {r, g, b} = evt.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            const lightPosFolder = lightFolder.addFolder({title: 'Direction', expanded: true});
            lightPosFolder.addBinding(lightConfig, 'directionX', {min: -1, max: 1, step: 0.01, label: 'Dir X'}).on('change', () => { light.direction = [lightConfig.directionX, lightConfig.directionY, lightConfig.directionZ]; });
            lightPosFolder.addBinding(lightConfig, 'directionY', {min: -1, max: 1, step: 0.01, label: 'Dir Y'}).on('change', () => { light.direction = [lightConfig.directionX, lightConfig.directionY, lightConfig.directionZ]; });
            lightPosFolder.addBinding(lightConfig, 'directionZ', {min: -1, max: 1, step: 0.01, label: 'Dir Z'}).on('change', () => { light.direction = [lightConfig.directionX, lightConfig.directionY, lightConfig.directionZ]; });
            
            lightFolder.addBinding(light, 'enableDebugger', {label: 'Show Debugger'});
        }
    });
};