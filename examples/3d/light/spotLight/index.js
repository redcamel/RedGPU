import * as RedGPU from "../../../../dist/index.js?t=1778920968741";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778920968741";

/**
 * [KO] Spot Light Lighting Studio 예제 (UE5 스타일)
 * [EN] Spot Light Lighting Studio Example (UE5 Style)
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
        view.grid = true;
        view.axis = true;
        
        // [KO] 자동 노출 활성화 (UE5 방식)
        // [EN] Enable Auto Exposure (UE5 style)
        controller.camera.useAutoExposure = true;
        
        redGPUContext.addView(view);

        const light = createSpotLight(scene);
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

const createSpotLight = (scene) => {
    // [KO] UE5 표준 전구 밝기인 1000 Lumen으로 시작
    // [EN] Start with 1000 Lumens, the UE5 standard bulb brightness
    const light = new RedGPU.Light.SpotLight('#fff', 1000); 
    light.x = 0;
    light.y = 15;
    light.z = 10;
    light.radius = 30;
    light.lookAt(0, 0, 0);
    light.enableDebugger = true;
    scene.lightManager.addSpotLight(light);
    return light;
};

const createStudioEnvironment = (redGPUContext, scene) => {
    const studioMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#888');
    studioMaterial.specularStrength = 0.2;
    studioMaterial.shininess = 32;

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
            
            const material = new RedGPU.Material.PhongMaterial(redGPUContext, metallic === 1.0 ? '#fff' : '#ff4444');
            material.metallic = metallic;
            material.roughness = roughness;
            material.shininess = Math.pow(2, (1.0 - roughness) * 10 + 2);

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
        guiCallback: (pane) => {
            // 1. Light Folder (UE5 Style)
            const lightConfig = {
                lumen: light.lumen,
                radius: light.radius,
                innerCutoff: light.innerCutoff,
                outerCutoff: light.outerCutoff,
                color: {r: light.color.r, g: light.color.g, b: light.color.b},
                x: light.x,
                y: light.y,
                z: light.z,
                directionX: light.directionX,
                directionY: light.directionY,
                directionZ: light.directionZ,
            };

            const lightFolder = pane.addFolder({title: 'Light: Spot Light', expanded: true});
            
            const lightPropFolder = lightFolder.addFolder({title: 'Lumen & Color', expanded: true});
            lightPropFolder.addBinding(lightConfig, 'lumen', {
                label: 'Lumen',
                min: 0, 
                max: 50000, 
                step: 10
            }).on('change', (evt) => { light.lumen = evt.value; });
            
            lightPropFolder.addBinding(lightConfig, 'color', {picker: 'inline', view: 'color'}).on('change', (evt) => {
                const {r, g, b} = evt.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            const lightShapeFolder = lightFolder.addFolder({title: 'Beam Shape', expanded: true});
            lightShapeFolder.addBinding(lightConfig, 'innerCutoff', {min: 0, max: 89, step: 0.1, label: 'Inner Cone'}).on('change', (evt) => { light.innerCutoff = evt.value; });
            lightShapeFolder.addBinding(lightConfig, 'outerCutoff', {min: 0, max: 89, step: 0.1, label: 'Outer Cone'}).on('change', (evt) => { light.outerCutoff = evt.value; });
            lightShapeFolder.addBinding(lightConfig, 'radius', {min: 0, max: 100, step: 1, label: 'Attenuation Radius'}).on('change', (evt) => { light.radius = evt.value; });

            const lightPosFolder = lightFolder.addFolder({title: 'Transform & Direction', expanded: false});
            lightPosFolder.addBinding(lightConfig, 'x', {min: -30, max: 30, step: 0.1}).on('change', (evt) => { light.x = evt.value; });
            lightPosFolder.addBinding(lightConfig, 'y', {min: -10, max: 30, step: 0.1}).on('change', (evt) => { light.y = evt.value; });
            lightPosFolder.addBinding(lightConfig, 'z', {min: -30, max: 30, step: 0.1}).on('change', (evt) => { light.z = evt.value; });
            lightPosFolder.addBinding(lightConfig, 'directionX', {min: -1, max: 1, step: 0.01, label: 'Dir X'}).on('change', (evt) => { light.directionX = evt.value; });
            lightPosFolder.addBinding(lightConfig, 'directionY', {min: -1, max: 1, step: 0.01, label: 'Dir Y'}).on('change', (evt) => { light.directionY = evt.value; });
            lightPosFolder.addBinding(lightConfig, 'directionZ', {min: -1, max: 1, step: 0.01, label: 'Dir Z'}).on('change', (evt) => { light.directionZ = evt.value; });
            
            lightFolder.addBinding(light, 'enableDebugger', {label: 'Show Debugger'});
        }
    });
};