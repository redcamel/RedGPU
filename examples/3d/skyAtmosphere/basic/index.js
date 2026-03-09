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

        // View 속성에 직접 설정
        view.skyAtmosphere = skyAtmosphere;
        view.toneMappingManager.exposure = 1.5;

        // 2. 카메라 설정
        view.rawCamera.nearClipping = 1;
        view.rawCamera.farClipping = 2000000;
        controller.pan = -90; // [KO] 태양 방향으로 카메라 회전 [EN] Pan camera to sun direction
        controller.tilt = -10;
        controller.distance = 1500;
        controller.speedDistance = 100;

        // 이동 제한
        // controller.minTilt = -88;
        // controller.maxTilt = 0;
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

        const GRID_X = 9;
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

        // [KO] InstancingMesh를 루프 밖에서 한 번만 생성하여 효율적으로 사용
        // [EN] Create InstancingMesh only once outside the loop for efficiency
        const instanceMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 250, 250, sphereGeo, spherePhongMat);
        // [KO] glTF 라인(i=1)이 Z=0이므로, 인스턴싱 라인(i=3)은 Z = 2 * STEP_X
        instanceMesh.z = STEP_X * 2;
        instanceMesh.y = FIXED_Y;
        scene.addChild(instanceMesh);

        for (let i = 0; i < GRID_X; i++) {
            for (let j = 0; j < GRID_Z; j++) {
                let mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, sphereColorMat);
                // [KO] X축 중앙 정렬 [EN] Center alignment on X-axis
                mesh.x = (j - (GRID_Z - 1) / 2) * STEP_Z;

                if (i === 0) {
                    // [KO] 컬러 메쉬 [EN] Color Mesh
                    mesh.material = sphereColorMat;
                    mesh.z = -STEP_X;
                    mesh.y = FIXED_Y;
                    mesh.scaleX = mesh.scaleY = mesh.scaleZ = FIXED_SCALE;
                    scene.addChild(mesh);

                } else if (i === 1) {
                    // [KO] glTF 모델 (Z=0 센터 배치) [EN] glTF Model (Z=0 Center placement)
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
                        }
                    );
                } else if (i === 2) {
                    // [KO] 퐁 메쉬 [EN] Phong Mesh
                    mesh.material = spherePhongMat;
                    mesh.z = STEP_X;
                    mesh.y = FIXED_Y;
                    mesh.scaleX = mesh.scaleY = mesh.scaleZ = FIXED_SCALE;
                    scene.addChild(mesh);

                } else if (i === 3) {
                    // [KO] 인스턴싱 데이터 할당 (Z = 2 * STEP_X 위치의 컨테이너 기준)
                    for (let k = 0; k < 5; k++) {
                        const child = instanceMesh.instanceChildren[j * 5 + k];
                        child.x = mesh.x;
                        child.y = 0;
                        child.z = (k - 2) * 100;
                        child.scaleX = child.scaleY = child.scaleZ = 5;
                    }

                } else if (i === 4) {
                    // [KO] 텍스트 필드 테스트 [EN] Text field test
                    const textField = new RedGPU.Display.TextField3D(redGPUContext, `Distance: ${j * 2}km`);
                    textField.x = mesh.x;
                    textField.z = STEP_X * 3;
                    textField.y = TEXT_Y;
                    textField.worldSize = 100;
                    textField.color = '#000';
                    textField.fontSize = 60;
                    scene.addChild(textField);

                } else if (i === 5) {
                    // [KO] Sprite3D 테스트 [EN] Sprite3D test
                    const sprite = new RedGPU.Display.Sprite3D(redGPUContext, spriteMat);
                    sprite.x = mesh.x;
                    sprite.z = STEP_X * 4;
                    sprite.y = FIXED_Y;
                    sprite.worldSize = 300;
                    scene.addChild(sprite);
                } else if (i === 6) {
                    // [KO] SpriteSheet3D 테스트 [EN] SpriteSheet3D test
                    const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
                    spriteSheet.x = mesh.x;
                    spriteSheet.z = STEP_X * 5;
                    spriteSheet.y = FIXED_Y;
                    spriteSheet.worldSize = 300;
                    scene.addChild(spriteSheet);
                } else if (i === 7) {
                    // [KO] ParticleEmitter 테스트 [EN] ParticleEmitter test
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
                    // [KO] Line3D 테스트 [EN] Line3D test
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

        renderTestPane(view, skyAtmosphere);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView, skyAtmosphere) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane({title: 'SkyAtmosphere Basic (UE5 Aligned)', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    // 0. General Controls
    const state = {enabled: true};
    pane.addBinding(state, 'enabled', {label: 'Enable Atmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
    pane.addBinding(skyAtmosphere, 'useGround', {label: 'useGround (physics)'});
    pane.addBinding(skyAtmosphere, 'showGround', {label: 'showGround'});

    // 1. Cinematic Presets
    const f_presets = pane.addFolder({title: '1. Cinematic Presets', expanded: false});
    const apply = (el, az, exp, intensity, solarMult, limb) => {
        skyAtmosphere.sunElevation = el;
        skyAtmosphere.sunAzimuth = az;
        targetView.toneMappingManager.exposure = exp;
        skyAtmosphere.sunIntensity = intensity;
        skyAtmosphere.solarIntensityMult = solarMult;
        skyAtmosphere.sunLimbDarkening = limb;
        pane.refresh();
    };
    f_presets.addButton({title: 'High Noon'}).on('click', () => apply(90, 0, 1.0, 22.0, 500.0, 0.4));
    f_presets.addButton({title: 'Golden Sunset'}).on('click', () => apply(3.5, 0, 1.8, 22.0, 150.0, 0.8));
    f_presets.addButton({title: 'Eerie Twilight'}).on('click', () => apply(-4, 0, 4.0, 10.0, 50.0, 1.2));

    // 2. Sun Configuration
    const f_sun = pane.addFolder({title: '2. Sun Configuration'});
    f_sun.addBinding(skyAtmosphere, 'sunElevation', {min: -90, max: 90, step: 0.0001, label: 'sunElevation'});
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', {min: -360, max: 360, step: 0.0001, label: 'sunAzimuth'});
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', {min: 0, max: 100, step: 0.001, label: 'sunIntensity'});
    f_sun.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01, label: 'sunLimbDarkening'});
    f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.0001, label: 'sunSize'});

    // 3. Planet
    const f_geo = pane.addFolder({title: '3. Planet', expanded: false});
    f_geo.addBinding(skyAtmosphere, 'bottomRadius', {min: 1000, max: 10000, step: 0.01, label: 'bottomRadius (km)'});
    f_geo.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 10, max: 200, step: 0.01, label: 'atmosphereHeight (km)'});
    f_geo.addBinding(skyAtmosphere, 'seaLevel', {min: -10, max: 10, step: 0.01, label: 'seaLevel (km)'});

    // 4. Rayleigh
    const f_rayleigh = pane.addFolder({title: '4. Rayleigh', expanded: false});
    const rayleighProxy = {
        get r() { return skyAtmosphere.rayleighScattering[0]; },
        set r(v) {
            const t = [...skyAtmosphere.rayleighScattering];
            t[0] = v;
            skyAtmosphere.rayleighScattering = t;
        },
        get g() { return skyAtmosphere.rayleighScattering[1]; },
        set g(v) {
            const t = [...skyAtmosphere.rayleighScattering];
            t[1] = v;
            skyAtmosphere.rayleighScattering = t;
        },
        get b() { return skyAtmosphere.rayleighScattering[2]; },
        set b(v) {
            const t = [...skyAtmosphere.rayleighScattering];
            t[2] = v;
            skyAtmosphere.rayleighScattering = t;
        }
    };
    f_rayleigh.addBinding(rayleighProxy, 'r', {min: 0, max: 0.1, step: 0.0001, label: 'rayleighScattering.r'});
    f_rayleigh.addBinding(rayleighProxy, 'g', {min: 0, max: 0.1, step: 0.0001, label: 'rayleighScattering.g'});
    f_rayleigh.addBinding(rayleighProxy, 'b', {min: 0, max: 0.1, step: 0.0001, label: 'rayleighScattering.b'});
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {min: 0.1, max: 50, step: 0.001, label: 'rayleighExponentialDistribution (km)'});

    // 5. Mie
    const f_mie = pane.addFolder({title: '5. Mie', expanded: false});
    f_mie.addBinding(skyAtmosphere, 'mieScattering', {min: 0, max: 0.1, step: 0.00001, label: 'mieScattering'});
    f_mie.addBinding(skyAtmosphere, 'mieAbsorption', {min: 0, max: 0.1, step: 0.00001, label: 'mieAbsorption'});
    f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 20, step: 0.001, label: 'mieExponentialDistribution (km)'});
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.0001, label: 'mieAnisotropy (g)'});
    f_mie.addBinding(skyAtmosphere, 'mieGlow', {min: 0, max: 0.999, step: 0.001, label: 'mieGlow'});
    f_mie.addBinding(skyAtmosphere, 'mieHalo', {min: 0, max: 0.999, step: 0.001, label: 'mieHalo (g)'});

    // 6. Absorption (Ozone)
    const f_ozone = pane.addFolder({title: '6. Absorption (Ozone)', expanded: false});
    const absorptionProxy = {
        get r() { return skyAtmosphere.absorptionCoefficient[0]; },
        set r(v) {
            const t = [...skyAtmosphere.absorptionCoefficient];
            t[0] = v;
            skyAtmosphere.absorptionCoefficient = t;
        },
        get g() { return skyAtmosphere.absorptionCoefficient[1]; },
        set g(v) {
            const t = [...skyAtmosphere.absorptionCoefficient];
            t[1] = v;
            skyAtmosphere.absorptionCoefficient = t;
        },
        get b() { return skyAtmosphere.absorptionCoefficient[2]; },
        set b(v) {
            const t = [...skyAtmosphere.absorptionCoefficient];
            t[2] = v;
            skyAtmosphere.absorptionCoefficient = t;
        }
    };
    f_ozone.addBinding(absorptionProxy, 'r', {min: 0, max: 0.01, step: 0.0001, label: 'absorptionCoefficient.r'});
    f_ozone.addBinding(absorptionProxy, 'g', {min: 0, max: 0.01, step: 0.0001, label: 'absorptionCoefficient.g'});
    f_ozone.addBinding(absorptionProxy, 'b', {min: 0, max: 0.01, step: 0.0001, label: 'absorptionCoefficient.b'});
    f_ozone.addBinding(skyAtmosphere, 'absorptionTipAltitude', {min: 0, max: 100, step: 0.01, label: 'absorptionTipAltitude (km)'});
    f_ozone.addBinding(skyAtmosphere, 'absorptionTentWidth', {min: 1, max: 50, step: 0.01, label: 'absorptionTentWidth (km)'});

    // 7. Ground Properties
    const f_ground = pane.addFolder({title: '7. Ground Properties', expanded: false});
    const groundAlbedoProxy = {
        get r() { return skyAtmosphere.groundAlbedo[0]; },
        set r(v) {
            const t = [...skyAtmosphere.groundAlbedo];
            t[0] = v;
            skyAtmosphere.groundAlbedo = t;
        },
        get g() { return skyAtmosphere.groundAlbedo[1]; },
        set g(v) {
            const t = [...skyAtmosphere.groundAlbedo];
            t[1] = v;
            skyAtmosphere.groundAlbedo = t;
        },
        get b() { return skyAtmosphere.groundAlbedo[2]; },
        set b(v) {
            const t = [...skyAtmosphere.groundAlbedo];
            t[2] = v;
            skyAtmosphere.groundAlbedo = t;
        }
    };
    f_ground.addBinding(groundAlbedoProxy, 'r', {min: 0, max: 1, step: 0.001, label: 'groundAlbedo.r'});
    f_ground.addBinding(groundAlbedoProxy, 'g', {min: 0, max: 1, step: 0.001, label: 'groundAlbedo.g'});
    f_ground.addBinding(groundAlbedoProxy, 'b', {min: 0, max: 1, step: 0.001, label: 'groundAlbedo.b'});
    f_ground.addBinding(skyAtmosphere, 'groundAmbient', {min: 0, max: 10, step: 0.001, label: 'groundAmbient'});

    // 8. Volumetric & Artistic
    const f_vol = pane.addFolder({title: '8. Volumetric & Artistic', expanded: false});
    f_vol.addBinding(skyAtmosphere, 'skyLuminanceFactor', {min: 0, max: 10, step: 0.1, label: 'skyLuminanceFactor'});
    f_vol.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1, label: 'aerialPerspectiveDistanceScale (km)'});
    f_vol.addBinding(skyAtmosphere, 'heightFogDensity', {min: 0, max: 10, step: 0.001, label: 'heightFogDensity'});
    f_vol.addBinding(skyAtmosphere, 'heightFogFalloff', {min: 0.001, max: 10, step: 0.0001, label: 'heightFogFalloff'});
    f_vol.addBinding(skyAtmosphere, 'heightFogAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'heightFogAnisotropy (g)'});
};
