import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

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
        // view.grid = true;
        // view.axis = true;
        

        
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
    // [KO] UE5 기본값인 10 Lux로 시작 (태양광 표준인 100,000 Lux는 UI에서 테스트 가능)
    // [EN] Start with 10 Lux, the UE5 default (Sunlight standard 100,000 Lux can be tested in UI)
    const direction = [-1, -1, -1];
    const light = new RedGPU.Light.DirectionalLight(direction, '#fff', 10);
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

const renderTestPaneWithLightControl = async (redGPUContext, light, view) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const pane = new Pane();
    const {setDebugButtons, createIblHelper} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext);
    createIblHelper(pane, view, RedGPU);

    const camera = view.rawCamera;
    const toneMappingManager = view.toneMappingManager;
    const autoExposure = view.postEffectManager.autoExposure;

    // 1. Light Folder
    const lightConfig = {
        intensity: light.intensity,
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
        directionX: light.direction[0],
        directionY: light.direction[1],
        directionZ: light.direction[2],
    };

    const lightFolder = pane.addFolder({title: 'Light: Directional', expanded: true});
    
    const lightPropFolder = lightFolder.addFolder({title: 'Intensity & Color', expanded: true});
    lightPropFolder.addBinding(lightConfig, 'intensity', {
        label: 'Intensity (Lux)',
        min: 0, 
        max: 120000, 
        step: 10
    }).on('change', (evt) => { light.intensity = evt.value; });
    
    lightPropFolder.addBinding(lightConfig, 'color', {picker: 'inline', view: 'color'}).on('change', (evt) => {
        const {r, g, b} = evt.value;
        light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
    });

    const lightPosFolder = lightFolder.addFolder({title: 'Direction', expanded: true});
    lightPosFolder.addBinding(lightConfig, 'directionX', {min: -1, max: 1, step: 0.01, label: 'Dir X'}).on('change', () => { light.direction = [lightConfig.directionX, lightConfig.directionY, lightConfig.directionZ]; });
    lightPosFolder.addBinding(lightConfig, 'directionY', {min: -1, max: 1, step: 0.01, label: 'Dir Y'}).on('change', () => { light.direction = [lightConfig.directionX, lightConfig.directionY, lightConfig.directionZ]; });
    lightPosFolder.addBinding(lightConfig, 'directionZ', {min: -1, max: 1, step: 0.01, label: 'Dir Z'}).on('change', () => { light.direction = [lightConfig.directionX, lightConfig.directionY, lightConfig.directionZ]; });
    
    lightFolder.addBinding(light, 'enableDebugger', {label: 'Show Debugger'});

    // 2. Camera Folder
    const cameraConfig = {
        aperture: camera.aperture,
        shutterSpeed: 1 / camera.shutterSpeed,
        iso: camera.iso,
        useAutoExposure: camera.useAutoExposure,
        ev100: camera.ev100,
        preExposure: autoExposure.preExposure
    };
    const cameraFolder = pane.addFolder({title: 'Camera: Physical Settings', expanded: true});
    cameraFolder.addBinding(cameraConfig, 'useAutoExposure', {label: 'Auto Exposure'}).on('change', (evt) => { camera.useAutoExposure = evt.value; });
    
    const lensFolder = cameraFolder.addFolder({title: 'Lens & Sensor', expanded: false});
    lensFolder.addBinding(cameraConfig, 'aperture', {min: 1.0, max: 32.0, step: 0.1, label: 'Aperture (f-stop)'}).on('change', (evt) => { camera.aperture = evt.value; });
    lensFolder.addBinding(cameraConfig, 'shutterSpeed', {min: 1, max: 4000, step: 1, label: 'Shutter Speed (1/s)'}).on('change', (evt) => { camera.shutterSpeed = 1 / evt.value; });
    lensFolder.addBinding(cameraConfig, 'iso', {min: 100, max: 6400, step: 100, label: 'ISO (Sensitivity)'}).on('change', (evt) => { camera.iso = evt.value; });
    
    const exposureMonitor = cameraFolder.addFolder({title: 'Exposure Status', expanded: true});
    exposureMonitor.addBinding(cameraConfig, 'ev100', {readonly: true, format: (v) => v.toFixed(2), label: 'EV100'});
    exposureMonitor.addBinding(cameraConfig, 'preExposure', {readonly: true, format: (v) => v.toFixed(4), label: 'Pre Exposure'});

    // 3. Post Process Folder
    const tmConfig = {
        mode: toneMappingManager.mode,
        exposureCompensation: autoExposure.exposureCompensation
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
    tmFolder.addBinding(tmConfig, 'exposureCompensation', {min: -5, max: 5, step: 0.01, label: 'Exposure Compensation'}).on('change', (evt) => { autoExposure.exposureCompensation = evt.value; });

    // Monitoring Loop
    setInterval(() => {
        cameraConfig.ev100 = camera.ev100;
        cameraConfig.preExposure = autoExposure.preExposure;
        pane.refresh();
    }, 100);
};
