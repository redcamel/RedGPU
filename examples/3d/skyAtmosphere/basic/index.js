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
        view.rawCamera.nearClipping = 0.1;
        view.rawCamera.farClipping = 2000000;
        controller.pan = -90; // [KO] 태양 방향으로 카메라 회전 [EN] Pan camera to sun direction
        controller.tilt = -10;
        controller.distance = 2000;

        // 이동 제한
        controller.minTilt = -88;
        controller.maxTilt = 88;
        controller.minDistance = 10;
        controller.maxDistance = 1000000;

        redGPUContext.addView(view);

        // 3. 테스트 환경 구성
        const sphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 10, 32, 32);
        const sphereMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff');

        const FIXED_SCALE = 10;

        const GRID_X = 4;

        const GRID_Z = 250;

        const STEP_X = 2000; // [KO] 층간 간격 확대 (2km) [EN] Increase layer spacing

        const STEP_Z = 1000;


        for (let i = 0; i < GRID_X; i++) {

            for (let j = 0; j < GRID_Z; j++) {

                const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, sphereMat);


                mesh.x = j * STEP_Z;

                mesh.z = (i - (GRID_X - 1) / 2) * STEP_X;


                // [KO] 현실적인 대기권 내 고도 설정

                // [EN] Realistic atmospheric altitudes

                let heightValue = 0;

                if (i === 0) heightValue = 100;   // 해수면 (0.1km)

                else if (i === 1) heightValue = 500;  // 저고도 (2km)

                else if (i === 2) heightValue = 1000;  // 중고도 (5km)

                else if (i === 3) heightValue = 2000; // 고고도 (10km)


                mesh.y = heightValue;

                mesh.scaleX = mesh.scaleY = mesh.scaleZ = FIXED_SCALE;


                mesh.ignoreFrustumCulling = true;

                scene.addChild(mesh);

            }

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
    const pane = new Pane({title: 'SkyAtmosphere Post-Effect Verifier', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    const state = {enabled: true};
    pane.addBinding(state, 'enabled', {label: 'Enable Atmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });

    // 1. Sun & Exposure
    const f_sun = pane.addFolder({title: '1. Sun & Exposure'});
    f_sun.addBinding(skyAtmosphere, 'sunElevation', {min: -90, max: 90, step: 0.01, label: 'Elevation'});
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', {min: -360, max: 360, step: 0.01, label: 'Azimuth'});
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', {min: 0, max: 100, step: 0.1, label: 'Intensity'});
    f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'Sun Size'});
    f_sun.addBinding(skyAtmosphere, 'exposure', {min: 0, max: 10, step: 0.01, label: 'Exposure'});

    // 2. Atmosphere Geometry
    const f_geo = pane.addFolder({title: '2. Atmosphere Geometry', expanded: false});
    f_geo.addBinding(skyAtmosphere, 'earthRadius', {min: 1000, max: 10000, step: 1, label: 'Earth Radius (km)'});
    f_geo.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 10, max: 200, step: 1, label: 'Atmo Height (km)'});

    // 3. Rayleigh Scattering
    const f_rayleigh = pane.addFolder({title: '3. Rayleigh Scattering', expanded: false});
    const rayleighProxy = {
        get r() {
            return skyAtmosphere.rayleighScattering[0];
        }, set r(v) {
            const t = skyAtmosphere.rayleighScattering;
            t[0] = v;
            skyAtmosphere.rayleighScattering = t;
        },
        get g() {
            return skyAtmosphere.rayleighScattering[1];
        }, set g(v) {
            const t = skyAtmosphere.rayleighScattering;
            t[1] = v;
            skyAtmosphere.rayleighScattering = t;
        },
        get b() {
            return skyAtmosphere.rayleighScattering[2];
        }, set b(v) {
            const t = skyAtmosphere.rayleighScattering;
            t[2] = v;
            skyAtmosphere.rayleighScattering = t;
        }
    };
    f_rayleigh.addBinding(rayleighProxy, 'r', {min: 0, max: 0.1, label: 'Scat R'});
    f_rayleigh.addBinding(rayleighProxy, 'g', {min: 0, max: 0.1, label: 'Scat G'});
    f_rayleigh.addBinding(rayleighProxy, 'b', {min: 0, max: 0.1, label: 'Scat B'});
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighScaleHeight', {min: 0.1, max: 50, label: 'Scale Height (km)'});

    // 4. Mie Scattering
    const f_mie = pane.addFolder({title: '4. Mie Scattering', expanded: false});
    f_mie.addBinding(skyAtmosphere, 'mieScattering', {min: 0, max: 0.1, step: 0.0001, label: 'Scat Coeff'});
    f_mie.addBinding(skyAtmosphere, 'mieExtinction', {min: 0, max: 0.1, step: 0.0001, label: 'Ext Coeff'});
    f_mie.addBinding(skyAtmosphere, 'mieScaleHeight', {min: 0.1, max: 20, label: 'Scale Height (km)'});
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, label: 'Anisotropy (g)'});
    f_mie.addBinding(skyAtmosphere, 'mieGlow', {min: 0, max: 0.999, label: 'Glow'});
    f_mie.addBinding(skyAtmosphere, 'mieHalo', {min: 0, max: 0.999, label: 'Halo'});

    // 5. Ozone Layer
    const f_ozone = pane.addFolder({title: '5. Ozone Layer', expanded: false});
    const ozoneProxy = {
        get r() {
            return skyAtmosphere.ozoneAbsorption[0];
        }, set r(v) {
            const t = skyAtmosphere.ozoneAbsorption;
            t[0] = v;
            skyAtmosphere.ozoneAbsorption = t;
        },
        get g() {
            return skyAtmosphere.ozoneAbsorption[1];
        }, set g(v) {
            const t = skyAtmosphere.ozoneAbsorption;
            t[1] = v;
            skyAtmosphere.ozoneAbsorption = t;
        },
        get b() {
            return skyAtmosphere.ozoneAbsorption[2];
        }, set b(v) {
            const t = skyAtmosphere.ozoneAbsorption;
            t[2] = v;
            skyAtmosphere.ozoneAbsorption = t;
        }
    };
    f_ozone.addBinding(ozoneProxy, 'r', {min: 0, max: 0.01, label: 'Abs R'});
    f_ozone.addBinding(ozoneProxy, 'g', {min: 0, max: 0.01, label: 'Abs G'});
    f_ozone.addBinding(ozoneProxy, 'b', {min: 0, max: 0.01, label: 'Abs B'});
    f_ozone.addBinding(skyAtmosphere, 'ozoneLayerCenter', {min: 0, max: 100, label: 'Center (km)'});
    f_ozone.addBinding(skyAtmosphere, 'ozoneLayerWidth', {min: 1, max: 50, label: 'Width (km)'});

    // 6. Ground Properties
    const f_ground = pane.addFolder({title: '6. Ground Properties', expanded: false});
    const groundAlbedoProxy = {
        get r() {
            return skyAtmosphere.groundAlbedo[0];
        }, set r(v) {
            const t = skyAtmosphere.groundAlbedo;
            t[0] = v;
            skyAtmosphere.groundAlbedo = t;
        },
        get g() {
            return skyAtmosphere.groundAlbedo[1];
        }, set g(v) {
            const t = skyAtmosphere.groundAlbedo;
            t[1] = v;
            skyAtmosphere.groundAlbedo = t;
        },
        get b() {
            return skyAtmosphere.groundAlbedo[2];
        }, set b(v) {
            const t = skyAtmosphere.groundAlbedo;
            t[2] = v;
            skyAtmosphere.groundAlbedo = t;
        }
    };
    f_ground.addBinding(groundAlbedoProxy, 'r', {min: 0, max: 1, label: 'Albedo R'});
    f_ground.addBinding(groundAlbedoProxy, 'g', {min: 0, max: 1, label: 'Albedo G'});
    f_ground.addBinding(groundAlbedoProxy, 'b', {min: 0, max: 1, label: 'Albedo B'});
    f_ground.addBinding(skyAtmosphere, 'groundAmbient', {min: 0, max: 10, label: 'Ambient'});
    f_ground.addBinding(skyAtmosphere, 'groundShininess', {min: 1, max: 2048, label: 'Shininess'});
    f_ground.addBinding(skyAtmosphere, 'groundSpecular', {min: 0, max: 100, label: 'Specular'});

    // 7. Volumetric & Artistic
    const f_vol = pane.addFolder({title: '7. Volumetric & Artistic', expanded: false});
    f_vol.addBinding(skyAtmosphere, 'multiScatteringAmbient', {min: 0, max: 1, label: 'Multi-Scat Ambient'});
    f_vol.addBinding(skyAtmosphere, 'horizonHaze', {min: 0, max: 10, label: 'Horizon Haze'});
    f_vol.addBinding(skyAtmosphere, 'heightFogDensity', {min: 0, max: 10, label: 'Fog Density'});
    f_vol.addBinding(skyAtmosphere, 'heightFogFalloff', {min: 0.001, max: 10, label: 'Fog Falloff'});

    const f_presets = pane.addFolder({title: 'Cinematic Presets', expanded: false});
    const apply = (el, az, exp, intensity) => {
        skyAtmosphere.sunElevation = el;
        skyAtmosphere.sunAzimuth = az;
        skyAtmosphere.exposure = exp;
        skyAtmosphere.sunIntensity = intensity;
        pane.refresh();
    };
    f_presets.addButton({title: 'High Noon'}).on('click', () => apply(90, 0, 1.0, 22.0));
    f_presets.addButton({title: 'Golden Sunset'}).on('click', () => apply(3.5, 0, 1.8, 22.0));
    f_presets.addButton({title: 'Eerie Twilight'}).on('click', () => apply(-4, 0, 4.0, 10.0));
};
