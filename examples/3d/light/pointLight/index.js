import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper2/dist/index.js";

/**
 * [KO] Point Light Lighting Studio 예제 (UE5 스타일)
 * [EN] Point Light Lighting Studio Example (UE5 Style)
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
        
        // [KO] 자동 노출을 활성화하여 물리적 수치가 낮아도 화면에 잘 보이게 설정
        // [EN] Enable Auto Exposure to ensure visibility even with low physical values
        controller.camera.useAutoExposure = true;
        
        redGPUContext.addView(view);

        const light = createPointLight(scene);
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

const createPointLight = (scene) => {
    // [KO] 다시 1000 Lumen으로 원복하여 자동 노출 로직을 테스트합니다.
    // [EN] Revert to 1000 Lumens to test the auto exposure logic.
    const light = new RedGPU.Light.PointLight('#fff', 1000); 
    light.x = 0;
    light.y = 8;
    light.z = 10;
    light.radius = 25;
    light.enableDebugger = true;
    scene.lightManager.addPointLight(light);
    return light;
};

const createStudioEnvironment = (redGPUContext, scene) => {
    // [KO] 표준 중성 회색 머티리얼 (18% 반사율 기준)
    // [EN] Standard neutral gray material (based on 18% reflectance)
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
    
    const rows = 2; // [0: Non-Metal, 1: Metal]
    const cols = 5; // [Roughness: 0.1, 0.3, 0.5, 0.7, 1.0]
    const spacing = 8;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const metallic = row === 1 ? 1.0 : 0.0;
            const roughness = col / (cols - 1); // 0.0 to 1.0
            
            const material = new RedGPU.Material.PhongMaterial(redGPUContext, metallic === 1.0 ? '#fff' : '#ff4444');
            material.metallic = metallic;
            material.roughness = roughness;
            // [KO] Phong 모델에서 Roughness 시뮬레이션을 위해 Shininess 역산
            // [EN] Inverse calculate Shininess for Roughness simulation in Phong model
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
                color: {r: light.color.r, g: light.color.g, b: light.color.b},
                x: light.x,
                y: light.y,
                z: light.z,
            };

            const lightFolder = pane.addFolder({title: 'Light: Point Light', expanded: true});
            
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

            const lightShapeFolder = lightFolder.addFolder({title: 'Shape & Attenuation', expanded: true});
            lightShapeFolder.addBinding(lightConfig, 'radius', {
                label: 'Attenuation Radius',
                min: 0, 
                max: 100, 
                step: 1
            }).on('change', (evt) => { light.radius = evt.value; });

            const lightPosFolder = lightFolder.addFolder({title: 'Transform', expanded: false});
            lightPosFolder.addBinding(lightConfig, 'x', {min: -30, max: 30, step: 0.1}).on('change', (evt) => { light.x = evt.value; });
            lightPosFolder.addBinding(lightConfig, 'y', {min: -10, max: 30, step: 0.1}).on('change', (evt) => { light.y = evt.value; });
            lightPosFolder.addBinding(lightConfig, 'z', {min: -30, max: 30, step: 0.1}).on('change', (evt) => { light.z = evt.value; });
            
            lightFolder.addBinding(light, 'enableDebugger', {label: 'Show Debugger'});
        }
    });
};