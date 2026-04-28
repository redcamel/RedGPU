import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // 0. 직접광 (태양광) 추가
        const sunLight = new RedGPU.Light.DirectionalLight(redGPUContext, '#ffffff', 1);
        sunLight.elevation = 90;
        sunLight.azimuth = 0;
        scene.lightManager.addDirectionalLight(sunLight);

        // 1. SkyAtmosphere 초기화
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);

        // View 속성에 직접 설정
        view.skyAtmosphere = skyAtmosphere;
        
        // 화면이 타지 않도록 톤매핑 및 노출 최적화
        view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
        view.toneMappingManager.exposure = 1.0;

        // 2. 카메라 설정
        view.rawCamera.nearClipping = 1;
        view.rawCamera.farClipping = 2000000;
        controller.pan = -90; 
        controller.tilt = -10;
        controller.distance = 1500;
        controller.speedDistance = 100;
        controller.minDistance = 10;
        controller.maxDistance = 1000000;

        redGPUContext.addView(view);

        // 3. 테스트 환경 구성 (기존 코드 유지)
        const sphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 10, 32, 32);
        const sphereColorMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
        const spherePhongMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const FIXED_SCALE = 10;
        const FIXED_Y = 100;
        const TEXT_Y = 300; 

        const GRID_X = 9;
        const GRID_Z = 50;
        const STEP_X = 1000;
        const STEP_Z = 2000;

        const particleTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle.png');
        const testTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const spriteMat = new RedGPU.Material.BitmapMaterial(redGPUContext, testTexture);
        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0);

        const instanceMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 250, 250, sphereGeo, spherePhongMat);
        instanceMesh.z = STEP_X * 2;
        instanceMesh.y = FIXED_Y;
        scene.addChild(instanceMesh);

        for (let i = 0; i < GRID_X; i++) {
            for (let j = 0; j < GRID_Z; j++) {
                let mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, sphereColorMat);
                mesh.x = (j - (GRID_Z - 1) / 2) * STEP_Z;
                if (i === 0) {
                    mesh.material = sphereColorMat;
                    mesh.z = -STEP_X;
                    mesh.y = FIXED_Y;
                    mesh.scaleX = mesh.scaleY = mesh.scaleZ = FIXED_SCALE;
                    scene.addChild(mesh);
                } else if (i === 1) {
                    mesh.z = 0;
                    mesh.y = FIXED_Y;
                    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
                    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
                        let helmet = result.resultMesh;
                        helmet.x = mesh.x;
                        helmet.z = mesh.z;
                        helmet.y = mesh.y;
                        helmet.scaleX = helmet.scaleY = helmet.scaleZ = 150;
                        scene.addChild(helmet);
                    });
                } else if (i === 2) {
                    mesh.material = spherePhongMat;
                    mesh.z = STEP_X;
                    mesh.y = FIXED_Y;
                    mesh.scaleX = mesh.scaleY = mesh.scaleZ = FIXED_SCALE;
                    scene.addChild(mesh);
                } else if (i === 3) {
                    for (let k = 0; k < 5; k++) {
                        const child = instanceMesh.instanceChildren[j * 5 + k];
                        child.x = mesh.x;
                        child.y = 0;
                        child.z = (k - 2) * 100;
                        child.scaleX = child.scaleY = child.scaleZ = 5;
                    }
                } else if (i === 4) {
                    const textField = new RedGPU.Display.TextField3D(redGPUContext, `Distance: ${j * 2}km`);
                    textField.x = mesh.x;
                    textField.z = STEP_X * 3;
                    textField.y = TEXT_Y;
                    textField.worldSize = 100;
                    textField.color = '#000';
                    textField.fontSize = 60;
                    scene.addChild(textField);
                } else if (i === 5) {
                    const sprite = new RedGPU.Display.Sprite3D(redGPUContext, spriteMat);
                    sprite.x = mesh.x;
                    sprite.z = STEP_X * 4;
                    sprite.y = FIXED_Y;
                    sprite.worldSize = 300;
                    scene.addChild(sprite);
                } else if (i === 6) {
                    const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
                    spriteSheet.x = mesh.x;
                    spriteSheet.z = STEP_X * 5;
                    spriteSheet.y = FIXED_Y;
                    spriteSheet.worldSize = 300;
                    scene.addChild(spriteSheet);
                } else if (i === 7) {
                    const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
                    emitter.material.diffuseTexture = particleTexture;
                    emitter.x = mesh.x;
                    emitter.z = STEP_X * 6;
                    emitter.y = FIXED_Y;
                    emitter.particleNum = 200;
                    emitter.minEndX = -200;
                    emitter.maxEndX = 200;
                    emitter.minEndY = -200;
                    emitter.maxEndY = 200;
                    emitter.minEndZ = -200;
                    emitter.maxEndZ = 200;
                    emitter.minStartScale = 0;
                    emitter.maxStartScale = 0;
                    emitter.minEndScale = 300;
                    emitter.maxEndScale = 500;
                    emitter.minEndAlpha = 0;
                    emitter.maxEndAlpha = 0;
                    scene.addChild(emitter);
                } else if (i === 8) {
                    const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#00ff00');
                    line.addPoint(0, -100, 0);
                    line.addPoint(0, 100, 0);
                    line.x = mesh.x;
                    line.z = STEP_X * 7;
                    line.y = FIXED_Y;
                    scene.addChild(line);
                }
            }
        }

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        // renderTestPane(view, skyAtmosphere, sunLight);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView, skyAtmosphere, sunLight) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane({title: 'SkyAtmosphere Configuration', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.rawCamera);

    // 1. Sun Configuration
    const f_sun = pane.addFolder({title: 'Sun', expanded: true});
    f_sun.addBinding(sunLight, 'elevation', {min: -90, max: 90, step: 0.1, label: 'Elevation'});
    f_sun.addBinding(sunLight, 'azimuth', {min: -360, max: 360, step: 0.1, label: 'Azimuth'});
    f_sun.addBinding(sunLight, 'intensity', {min: 0, max: 200000, step: 100, label: 'Intensity (Lux)'});
    f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'Sun Size'});
    f_sun.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01, label: 'Limb Darkening'});

    // 2. Camera & Exposure
    const f_camera = pane.addFolder({title: 'Camera & Exposure', expanded: false});
    f_camera.addBinding(targetView.postEffectManager.autoExposure, 'exposureCompensation', {min: -10, max: 10, step: 0.1, label: 'Exposure Bias'});
    f_camera.addBinding(targetView.rawCamera, 'aperture', {min: 1.0, max: 32.0, step: 0.1, label: 'Aperture'});
    f_camera.addBinding(targetView.rawCamera, 'shutterSpeed', {min: 1/8000, max: 1, step: 0.0001, label: 'Shutter (s)'});
    f_camera.addBinding(targetView.rawCamera, 'iso', {min: 50, max: 3200, step: 1, label: 'ISO'});
    f_camera.addBinding(targetView.toneMappingManager, 'exposure', {min: 0, max: 5, step: 0.01, label: 'TM Exposure'});

    // 3. Planet Properties
    const f_planet = pane.addFolder({title: 'Planet', expanded: false});
    f_planet.addBinding(skyAtmosphere, 'groundRadius', {min: 1000, max: 10000, step: 1, label: 'Radius (km)'});
    f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1, label: 'Atmo Height (km)'});
    f_planet.addBinding(skyAtmosphere, 'cameraHeight', {readonly: true, interval: 100, label: 'Cam Height (km)'});
    
    const groundProxy = {
        get albedo() { return {r: skyAtmosphere.groundAlbedo[0], g: skyAtmosphere.groundAlbedo[1], b: skyAtmosphere.groundAlbedo[2]}; },
        set albedo(v) { skyAtmosphere.groundAlbedo = [v.r, v.g, v.b]; }
    };
    f_planet.addBinding(groundProxy, 'albedo', {color: {type: 'float'}, label: 'Ground Albedo'});

    // 4. Rayleigh Scattering
    const f_rayleigh = pane.addFolder({title: 'Rayleigh', expanded: false});
    const rayleighProxy = {
        get scattering() { return {r: skyAtmosphere.rayleighScattering[0], g: skyAtmosphere.rayleighScattering[1], b: skyAtmosphere.rayleighScattering[2]}; },
        set scattering(v) { skyAtmosphere.rayleighScattering = [v.r, v.g, v.b]; }
    };
    f_rayleigh.addBinding(rayleighProxy, 'scattering', {color: {type: 'float'}, label: 'Scattering'});
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {min: 0.1, max: 50, step: 0.1, label: 'Exp Dist (km)'});

    // 5. Mie Scattering
    const f_mie = pane.addFolder({title: 'Mie', expanded: false});
    const mieScatProxy = {
        get value() { return {r: skyAtmosphere.mieScattering[0], g: skyAtmosphere.mieScattering[1], b: skyAtmosphere.mieScattering[2]}; },
        set value(v) { skyAtmosphere.mieScattering = [v.r, v.g, v.b]; }
    };
    const mieAbsProxy = {
        get value() { return {r: skyAtmosphere.mieAbsorption[0], g: skyAtmosphere.mieAbsorption[1], b: skyAtmosphere.mieAbsorption[2]}; },
        set value(v) { skyAtmosphere.mieAbsorption = [v.r, v.g, v.b]; }
    };
    f_mie.addBinding(mieScatProxy, 'value', {color: {type: 'float'}, label: 'Scattering'});
    f_mie.addBinding(mieAbsProxy, 'value', {color: {type: 'float'}, label: 'Absorption'});
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'Anisotropy (g)'});
    f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 50, step: 0.1, label: 'Exp Dist (km)'});

    // 6. Artistic Controls
    const f_artistic = pane.addFolder({title: 'Artistic', expanded: true});
    f_artistic.addBinding(skyAtmosphere, 'skyLuminanceFactor', {min: 0, max: 20, step: 0.1, label: 'Sky Luminance'});
    f_artistic.addBinding(skyAtmosphere, 'multiScatteringFactor', {min: 0, max: 10, step: 0.1, label: 'Multi Scat'});
    f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1, label: 'AP Scale (km)'});

    // Enable/Disable
    const state = {enabled: true};
    pane.addBinding(state, 'enabled', {label: 'Atmosphere Enabled'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
};
