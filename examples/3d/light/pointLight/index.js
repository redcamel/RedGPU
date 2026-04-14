import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

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
        view.grid = true;
        view.axis = true;
        
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

const renderTestPaneWithLightControl = async (redGPUContext, light, view) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext);

    const camera = view.rawCamera;
    const toneMappingManager = view.toneMappingManager;

    // 1. Light Folder (UE5 Style)
    const lightConfig = {
        intensity: light.intensity,
        radius: light.radius,
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
        x: light.x,
        y: light.y,
        z: light.z,
    };

    const lightFolder = pane.addFolder({title: 'Light: Point Light', expanded: true});
    
    const lightPropFolder = lightFolder.addFolder({title: 'Intensity & Color', expanded: true});
    lightPropFolder.addBinding(lightConfig, 'intensity', {
        label: 'Intensity (Lumen)',
        min: 0, 
        max: 50000, 
        step: 10
    }).on('change', (evt) => { light.intensity = evt.value; });
    
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

    // 2. Camera Folder (UE5 Style)
    const cameraConfig = {
        aperture: camera.aperture,
        shutterSpeed: 1 / camera.shutterSpeed,
        iso: camera.iso,
        useAutoExposure: camera.useAutoExposure,
        ev100: camera.ev100,
        exposure: camera.exposure,
        autoExposureMultiplier: toneMappingManager.autoExposureMultiplier
    };
    const cameraFolder = pane.addFolder({title: 'Camera: Physical Settings', expanded: true});
    cameraFolder.addBinding(cameraConfig, 'useAutoExposure', {label: 'Auto Exposure'}).on('change', (evt) => { camera.useAutoExposure = evt.value; });
    
    const lensFolder = cameraFolder.addFolder({title: 'Lens & Sensor', expanded: true});
    lensFolder.addBinding(cameraConfig, 'aperture', {min: 1.0, max: 32.0, step: 0.1, label: 'Aperture (f-stop)'}).on('change', (evt) => { camera.aperture = evt.value; });
    lensFolder.addBinding(cameraConfig, 'shutterSpeed', {min: 1, max: 4000, step: 1, label: 'Shutter Speed (1/s)'}).on('change', (evt) => { camera.shutterSpeed = 1 / evt.value; });
    lensFolder.addBinding(cameraConfig, 'iso', {min: 100, max: 6400, step: 100, label: 'ISO (Sensitivity)'}).on('change', (evt) => { camera.iso = evt.value; });
    
    const exposureMonitor = cameraFolder.addFolder({title: 'Exposure Status', expanded: true});
    exposureMonitor.addBinding(cameraConfig, 'ev100', {readonly: true, format: (v) => v.toFixed(2), label: 'EV100'});
    exposureMonitor.addBinding(cameraConfig, 'autoExposureMultiplier', {readonly: true, format: (v) => v.toFixed(4), label: 'Exposure Mult'});

    // 3. Post Process Folder (UE5 Style)
    const tmConfig = {
        mode: toneMappingManager.mode,
        exposureOffset: toneMappingManager.exposure
    };
    const tmFolder = pane.addFolder({title: 'PostProcess: Color Grading', expanded: false});
    tmFolder.addBinding(tmConfig, 'mode', {
        label: 'Tone Curve',
        options: {
            Linear: RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR,
            'ACES Filmic (UE5 Style)': RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL,
            'Khronos PBR Neutral': RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL,
        }
    }).on('change', (evt) => { toneMappingManager.mode = evt.value; });
    tmFolder.addBinding(tmConfig, 'exposureOffset', {min: 0, max: 10, step: 0.01, label: 'Exposure Compensation'});

    // 실시간 모니터링 루프
    setInterval(() => {
        cameraConfig.ev100 = camera.ev100;
        cameraConfig.autoExposureMultiplier = toneMappingManager.autoExposureMultiplier;
        pane.refresh();
    }, 100);
};
