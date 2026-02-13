import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // 초기 카메라 위치 조정 (지평선을 바라보도록)
        controller.tilt = -10;
        controller.distance = 100;
        
        view.axis = true;
        redGPUContext.addView(view);
        
        // 실제 오브젝트 배치 (Aerial Perspective 효과 확인용)
        const geometry = new RedGPU.Primitive.Box(redGPUContext, 10, 10, 10);
        const material = new RedGPU.Material.PBRMaterial(redGPUContext);
        material.color = '#ffffff';

        for (let i = 0; i < 20; i++) {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            const dist = 500 + i * 500; // 수 킬로미터 거리에 배치
            mesh.x = Math.sin(i) * 200;
            mesh.z = -dist;
            mesh.y = -5; // 지면 근처
            mesh.scaleX = mesh.scaleY = mesh.scaleZ = 1 + i * 5;
            scene.addChild(mesh);
        }

        // SkyAtmosphere 생성 및 물리적 초기값 설정
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        skyAtmosphere.sunElevation = 5; // 노을 시점
        skyAtmosphere.exposure = 1.5; 
        view.skyAtmosphere = skyAtmosphere;

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
    const pane = new Pane({ title: 'SkyAtmosphere Professional Controls' });
    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    // 1. Lighting & Presets
    const f_env = pane.addFolder({ title: '1. Environment & Sun' });
    f_env.addBinding(skyAtmosphere, 'sunElevation', { min: -90, max: 90, step: 0.1, label: 'Sun Elevation' });
    f_env.addBinding(skyAtmosphere, 'sunAzimuth', { min: -360, max: 360, step: 0.1, label: 'Sun Azimuth' });
    f_env.addBinding(skyAtmosphere, 'sunIntensity', { min: 0, max: 100, label: 'Sun Intensity' });
    f_env.addBinding(skyAtmosphere, 'exposure', { min: 0, max: 10, label: 'Exposure' });
    
    const f_presets = f_env.addFolder({ title: 'Lighting Presets', expanded: false });
    const applyPreset = (el, az, exp, haze) => {
        skyAtmosphere.sunElevation = el;
        skyAtmosphere.sunAzimuth = az;
        skyAtmosphere.exposure = exp;
        skyAtmosphere.horizonHaze = haze;
        pane.refresh();
    };
    f_presets.addButton({ title: 'High Noon' }).on('click', () => applyPreset(90, 0, 1.0, 0.1));
    f_presets.addButton({ title: 'Golden Hour' }).on('click', () => applyPreset(5, 0, 1.5, 0.5));
    f_presets.addButton({ title: 'Deep Twilight' }).on('click', () => applyPreset(-5, 0, 3.0, 1.2));
    f_presets.addButton({ title: 'Midnight' }).on('click', () => applyPreset(-25, 0, 0.5, 0.0));

    // 2. Physical Scattering
    const f_phys = pane.addFolder({ title: '2. Physical Scattering', expanded: false });
    
    // Rayleigh
    const f_ray = f_phys.addFolder({ title: 'Rayleigh (Air Molecules)' });
    const rayProxy = {
        get color() { return { r: skyAtmosphere.rayleighScattering[0], g: skyAtmosphere.rayleighScattering[1], b: skyAtmosphere.rayleighScattering[2] }; },
        set color(v) { skyAtmosphere.rayleighScattering = [v.r, v.g, v.b]; }
    };
    f_ray.addBinding(rayProxy, 'color', { label: 'Scat. Coeff', color: { type: 'float' } });
    f_ray.addBinding(skyAtmosphere, 'rayleighScaleHeight', { min: 1, max: 20, label: 'Scale Height (km)' });

    // Mie
    const f_mie = f_phys.addFolder({ title: 'Mie (Dust & Pollen)' });
    f_mie.addBinding(skyAtmosphere, 'mieScattering', { min: 0, max: 0.1, label: 'Scat. Strength' });
    f_mie.addBinding(skyAtmosphere, 'mieExtinction', { min: 0, max: 0.1, label: 'Extinction' });
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', { min: 0, max: 0.99, label: 'Directional (g)' });
    f_mie.addBinding(skyAtmosphere, 'mieScaleHeight', { min: 0.1, max: 5, label: 'Scale Height (km)' });

    // Ozone
    const f_ozo = f_phys.addFolder({ title: 'Ozone (Absorption)' });
    const ozoProxy = {
        get color() { return { r: skyAtmosphere.ozoneAbsorption[0], g: skyAtmosphere.ozoneAbsorption[1], b: skyAtmosphere.ozoneAbsorption[2] }; },
        set color(v) { skyAtmosphere.ozoneAbsorption = [v.r, v.g, v.b]; }
    };
    f_ozo.addBinding(ozoProxy, 'color', { label: 'Absorp. Coeff', color: { type: 'float' } });
    f_ozo.addBinding(skyAtmosphere, 'ozoneLayerCenter', { min: 0, max: 50, label: 'Layer Altitude' });
    f_ozo.addBinding(skyAtmosphere, 'ozoneLayerWidth', { min: 1, max: 30, label: 'Layer Width' });

    // 3. Planet & Terrain
    const f_planet = pane.addFolder({ title: '3. Planet & Terrain' });
    f_planet.addBinding(skyAtmosphere, 'earthRadius', { min: 1000, max: 10000, label: 'Planet Radius (km)' });
    f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', { min: 10, max: 150, label: 'Atmo Thickness (km)' });
    
    const albProxy = {
        get color() { return { r: skyAtmosphere.groundAlbedo[0], g: skyAtmosphere.groundAlbedo[1], b: skyAtmosphere.groundAlbedo[2] }; },
        set color(v) { skyAtmosphere.groundAlbedo = [v.r, v.g, v.b]; }
    };
    f_planet.addBinding(albProxy, 'color', { label: 'Ground Albedo', color: { type: 'float' } });
    f_planet.addBinding(skyAtmosphere, 'groundAmbient', { min: 0, max: 1, label: 'Ambient Light' });
    f_planet.addBinding(skyAtmosphere, 'groundShininess', { min: 1, max: 2048, label: 'Shininess' });
    f_planet.addBinding(skyAtmosphere, 'groundSpecular', { min: 0, max: 20, label: 'Specular' });

    // 4. Visual Polishing
    const f_art = pane.addFolder({ title: '4. Visual Polishing', expanded: true });
    f_art.addBinding(skyAtmosphere, 'horizonHaze', { min: 0, max: 5, label: 'Horizon Haze' });
    f_art.addBinding(skyAtmosphere, 'multiScatteringAmbient', { min: 0, max: 1, label: 'Multi-Scat GI' });
    
    const f_fog = f_art.addFolder({ title: 'Atmospheric Height Fog' });
    f_fog.addBinding(skyAtmosphere, 'heightFogDensity', { min: 0, max: 1, step: 0.001, label: 'Fog Density' });
    f_fog.addBinding(skyAtmosphere, 'heightFogFalloff', { min: 0.001, max: 0.5, step: 0.001, label: 'Height Falloff' });

    const f_halo = f_art.addFolder({ title: 'Sun Disk & Halo' });
    f_halo.addBinding(skyAtmosphere, 'sunSize', { min: 0.1, max: 10, label: 'Sun Disk Size' });
    f_halo.addBinding(skyAtmosphere, 'mieGlow', { min: 0, max: 0.999, label: 'Outer Glow' });
    f_halo.addBinding(skyAtmosphere, 'mieHalo', { min: 0, max: 0.999, label: 'Inner Halo' });
};
