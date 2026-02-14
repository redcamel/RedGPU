import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // 1. SkyAtmosphere 초기화
        const skyAtmosphere = new RedGPU.PostEffect.SkyAtmosphere(redGPUContext);
        skyAtmosphere.sunElevation = 5; 
        skyAtmosphere.sunAzimuth = 0;   
        skyAtmosphere.exposure = 1.5;
        skyAtmosphere.horizonHaze = 0.8;
        
        // View 속성에 직접 설정
        view.skyAtmosphere = skyAtmosphere;

        // 2. 카메라 설정
        view.camera.farClipping = 2000000;
        controller.pan = -90 + skyAtmosphere.sunAzimuth;
        controller.tilt = -skyAtmosphere.sunElevation;
        controller.distance = 400;
        
        // 이동 제한
        controller.minTilt = -88;
        controller.maxTilt = -1; 
        controller.minDistance = 10;
        controller.maxDistance = 1000000;
        
        redGPUContext.addView(view);

        // 3. 테스트 환경 구성
        const sphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 10, 32, 32);
        const sphereMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff');

        for (let i = 0; i < 30; i++) {
            const dist = 500 * Math.pow(1.4, i);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, sphereMat);
            const angle = i * 137.5 * (Math.PI / 180); 
            
            mesh.x = Math.cos(angle) * dist;
            mesh.z = Math.sin(angle) * dist;
            
            const scale = 5 + (dist / 1000) * 15; 
            mesh.scaleX = mesh.scaleY = mesh.scaleZ = scale;
            mesh.y = (10 * scale) + 50; 
            scene.addChild(mesh);

            const label = new RedGPU.Display.TextField3D(redGPUContext, `${(dist / 1000).toFixed(1)}km`);
            label.x = mesh.x;
            label.y = mesh.y + (10 * scale) + (scale * 2);
            label.z = mesh.z;
            label.usePixelSize = true;
            label.worldSize = 14;
            label.color = '#ffffff';
            scene.addChild(label);
        }

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        renderTestPane(view, skyAtmosphere);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView, skyAtmosphere) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane({ title: 'SkyAtmosphere Post-Effect Verifier', expanded: true });
    
    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    const state = { enabled: true };
    pane.addBinding(state, 'enabled', { label: 'Enable Atmosphere' }).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });

    const f_sun = pane.addFolder({ title: '1. Sun & Exposure' });
    f_sun.addBinding(skyAtmosphere, 'sunElevation', { min: -90, max: 90, step: 0.01, label: 'Elevation' });
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', { min: -360, max: 360, step: 0.01, label: 'Azimuth' });
    f_sun.addBinding(skyAtmosphere, 'exposure', { min: 0, max: 10, step: 0.01, label: 'Exposure' });
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', { min: 0, max: 100, step: 0.1, label: 'Sun Intensity' });

    const f_art = pane.addFolder({ title: '2. Artistic Controls' });
    f_art.addBinding(skyAtmosphere, 'horizonHaze', { min: 0, max: 5, step: 0.01, label: 'Horizon Haze' });
    f_art.addBinding(skyAtmosphere, 'groundAmbient', { min: 0, max: 10, step: 0.01, label: 'Ground Ambient' });
    
    const f_presets = pane.addFolder({ title: '3. Cinematic Presets' });
    const apply = (el, az, exp, intensity) => {
        skyAtmosphere.sunElevation = el;
        skyAtmosphere.sunAzimuth = az;
        skyAtmosphere.exposure = exp;
        skyAtmosphere.sunIntensity = intensity;
        pane.refresh();
    };
    f_presets.addButton({ title: 'High Noon' }).on('click', () => apply(90, 0, 1.0, 22.0));
    f_presets.addButton({ title: 'Golden Sunset' }).on('click', () => apply(3.5, 0, 1.8, 22.0));
    f_presets.addButton({ title: 'Eerie Twilight' }).on('click', () => apply(-4, 0, 4.0, 10.0));
};
