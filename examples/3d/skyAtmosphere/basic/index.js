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
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
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
        controller.distance = 1500;

        // 이동 제한
        controller.minTilt = -88;
        controller.maxTilt = 88;
        controller.minDistance = 10;
        controller.maxDistance = 1000000;

        redGPUContext.addView(view);

        // 3. 테스트 환경 구성
        const sphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 10, 32, 32);
        const sphereColorMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
        const spherePhongMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const FIXED_SCALE = 10;
        const FIXED_Y = 100;
        const TEXT_Y = 300; // [KO] 텍스트 필드 높이 [EN] Text field height

        const GRID_X = 7;
        const GRID_Z = 50;
        const STEP_X = 1000;
        const STEP_Z = 2000;

        const particleTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle.png');
        const testTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const spriteMat = new RedGPU.Material.BitmapMaterial(redGPUContext, testTexture);
        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
            redGPUContext,
            '../../../assets/spriteSheet/spriteSheet.png',
            5, 3, 15, 0
        );

        for (let i = 0; i < GRID_X; i++) {
            for (let j = 0; j < GRID_Z; j++) {
                let mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, sphereColorMat);
                mesh.x = j * STEP_Z;

                if (i === 0) {
                    // [KO] 컬러 메쉬 [EN] Color Mesh
                    mesh.material = sphereColorMat;
                    mesh.z = -STEP_X;
                    mesh.y = FIXED_Y;
                    mesh.scaleX = mesh.scaleY = mesh.scaleZ = FIXED_SCALE;
                    scene.addChild(mesh);

                } else if (i === 1) {
                    // [KO] glTF 모델 [EN] glTF Model
                    mesh.z = STEP_X;
                    mesh.y = FIXED_Y;
                    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
                    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
                            let helmet = result.resultMesh;
                            helmet.x = mesh.x;
                            helmet.z = mesh.z;
                            helmet.y = mesh.y;
                            helmet.scaleX = helmet.scaleY = helmet.scaleZ = 150;
                            scene.addChild(helmet);
                        }
                    );
                } else if (i === 2) {
                    // [KO] 퐁 메쉬 [EN] Phong Mesh
                    mesh.material = spherePhongMat;
                    mesh.z = STEP_X * 2;
                    mesh.y = FIXED_Y;
                    mesh.scaleX = mesh.scaleY = mesh.scaleZ = FIXED_SCALE;
                    scene.addChild(mesh);

                } else if (i === 3) {
                    // [KO] 중앙 배치 및 높이 조절된 텍스트 필드 [EN] Centered and height-adjusted text field
                    const textField = new RedGPU.Display.TextField3D(redGPUContext, `Distance: ${j * 2}km`);
                    textField.x = j * STEP_Z;
                    textField.z = 0; // [KO] 중앙 배치 [EN] Center placement
                    textField.y = TEXT_Y; // [KO] 조금 높게 [EN] Slightly higher
                    textField.worldSize = 100;
                    textField.color = '#000';
                    textField.fontSize = 60;
                    scene.addChild(textField);
                } else if (i === 4) {
                    // [KO] Sprite3D 테스트 [EN] Sprite3D test
                    const sprite = new RedGPU.Display.Sprite3D(redGPUContext, spriteMat);
                    sprite.x = j * STEP_Z;
                    sprite.z = -STEP_X * 2;
                    sprite.y = FIXED_Y;
                    sprite.worldSize = 300;
                    scene.addChild(sprite);
                } else if (i === 5) {
                    // [KO] SpriteSheet3D 테스트 [EN] SpriteSheet3D test
                    const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
                    spriteSheet.x = j * STEP_Z;
                    spriteSheet.z = -STEP_X * 3;
                    spriteSheet.y = FIXED_Y;
                    spriteSheet.worldSize = 300;
                    scene.addChild(spriteSheet);
                } else if (i === 6) {
                    // [KO] ParticleEmitter 테스트 [EN] ParticleEmitter test
                    const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
                    emitter.material.diffuseTexture = particleTexture;
                    emitter.x = j * STEP_Z;
                    emitter.z = STEP_X * 3;
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
                }
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
