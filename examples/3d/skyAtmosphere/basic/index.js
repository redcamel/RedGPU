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
        const sunLight = new RedGPU.Light.DirectionalLight(redGPUContext, '#ffffff', 100000);
        sunLight.elevation = 5;
        sunLight.azimuth = 0;
        scene.lightManager.addDirectionalLight(sunLight);

        // 1. SkyAtmosphere 초기화
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);

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

        renderTestPane(view, skyAtmosphere, sunLight);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView, skyAtmosphere, sunLight) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane({title: 'SkyAtmosphere Basic', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.rawCamera);

    const f_sun = pane.addFolder({title: 'Sun Configuration', expanded: true});
    f_sun.addBinding(sunLight, 'elevation', {min: -90, max: 90, step: 0.0001, label: 'sunElevation'});
    f_sun.addBinding(sunLight, 'azimuth', {min: -360, max: 360, step: 0.0001, label: 'sunAzimuth'});
    f_sun.addBinding(sunLight, 'intensity', {min: 0, max: 200000, step: 1, label: 'sunIntensity (Lux)'});
    f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'sunSize'});
    f_sun.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01, label: 'sunLimbDarkening'});

    const f_camera = pane.addFolder({title: 'Camera Exposure', expanded: false});
    f_camera.addBinding(targetView.rawCamera, 'exposureCompensation', {min: -10, max: 10, step: 0.1, label: 'Exposure Bias'});
    f_camera.addBinding(targetView.rawCamera, 'aperture', {min: 1.0, max: 32.0, step: 0.1, label: 'Aperture (f-stop)'});
    f_camera.addBinding(targetView.rawCamera, 'shutterSpeed', {min: 1/4000, max: 1, step: 0.0001, label: 'Shutter Speed (s)'});
    f_camera.addBinding(targetView.rawCamera, 'iso', {min: 50, max: 3200, step: 1, label: 'ISO'});

    const f_planet = pane.addFolder({title: 'Planet', expanded: false});
    f_planet.addBinding(skyAtmosphere, 'groundRadius', {min: 1000, max: 10000, step: 1, label: 'groundRadius (km)'});
    f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1, label: 'atmosphereHeight (km)'});
    f_planet.addBinding(skyAtmosphere, 'cameraHeight', {readonly: true, interval: 100, label: 'cameraHeight (km)'});
    
    const groundState = {
        albedo: {
            r: skyAtmosphere.groundAlbedo[0],
            g: skyAtmosphere.groundAlbedo[1],
            b: skyAtmosphere.groundAlbedo[2]
        }
    };
    f_planet.addBinding(groundState, 'albedo', {color: {type: 'float'}, label: 'groundAlbedo'}).on('change', (ev) => {
        skyAtmosphere.groundAlbedo = [ev.value.r, ev.value.g, ev.value.b];
    });

    const f_rayleigh = pane.addFolder({title: 'Rayleigh', expanded: false});
    const rayleighState = {
        scat: {
            r: skyAtmosphere.rayleighScattering[0],
            g: skyAtmosphere.rayleighScattering[1],
            b: skyAtmosphere.rayleighScattering[2]
        }
    };
    f_rayleigh.addBinding(rayleighState, 'scat', {color: {type: 'float'}, label: 'rayleighScattering'}).on('change', (ev) => {
        skyAtmosphere.rayleighScattering = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {min: 0.1, max: 100, step: 0.1, label: 'rayleighExponentialDistribution (km)'});

    const f_mie = pane.addFolder({title: 'Mie', expanded: false});
    const mieState = {
        scat: {
            r: skyAtmosphere.mieScattering[0],
            g: skyAtmosphere.mieScattering[1],
            b: skyAtmosphere.mieScattering[2]
        },
        abs: {
            r: skyAtmosphere.mieAbsorption[0],
            g: skyAtmosphere.mieAbsorption[1],
            b: skyAtmosphere.mieAbsorption[2]
        }
    };
    f_mie.addBinding(mieState, 'scat', {color: {type: 'float'}, label: 'mieScattering'}).on('change', (ev) => {
        skyAtmosphere.mieScattering = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_mie.addBinding(mieState, 'abs', {color: {type: 'float'}, label: 'mieAbsorption'}).on('change', (ev) => {
        skyAtmosphere.mieAbsorption = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'mieAnisotropy (g)'});
    f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 100, step: 0.1, label: 'mieExponentialDistribution (km)'});

    const f_absorption = pane.addFolder({title: 'Absorption (Ozone)', expanded: false});
    const absorptionState = {
        coeff: {
            r: skyAtmosphere.absorptionCoefficient[0],
            g: skyAtmosphere.absorptionCoefficient[1],
            b: skyAtmosphere.absorptionCoefficient[2]
        }
    };
    f_absorption.addBinding(absorptionState, 'coeff', {color: {type: 'float'}, label: 'absorptionCoefficient'}).on('change', (ev) => {
        skyAtmosphere.absorptionCoefficient = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_absorption.addBinding(skyAtmosphere, 'absorptionTipAltitude', {min: 0, max: 100, step: 0.1, label: 'absorptionTipAltitude (km)'});
    f_absorption.addBinding(skyAtmosphere, 'absorptionTentWidth', {min: 1, max: 50, step: 0.1, label: 'absorptionTentWidth (km)'});

    const f_artistic = pane.addFolder({title: 'Artistic Controls', expanded: true});
    f_artistic.addBinding(skyAtmosphere, 'skyLuminanceFactor', {min: 0, max: 100, step: 0.1, label: 'skyLuminanceFactor'});
    f_artistic.addBinding(skyAtmosphere, 'multiScatteringFactor', {min: 0, max: 10, step: 0.1, label: 'multiScatteringFactor'});
    f_artistic.addBinding(skyAtmosphere, 'transmittanceMinLightElevationAngle', {min: -90, max: 90, step: 0.1, label: 'minLightElevationAngle'});
    f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1, label: 'aerialPerspectiveDistanceScale (km)'});
    f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveStartDepth', {min: 0, max: 100, step: 0.1, label: 'aerialPerspectiveStartDepth (km)'});

    const f_tonemapping = pane.addFolder({title: 'ToneMapping (Global)', expanded: false});
    f_tonemapping.addBinding(targetView.toneMappingManager, 'mode', {
        options: {
            LINEAR: RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR,
            KHRONOS_PBR_NEUTRAL: RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL,
            ACES_FILMIC_NARKOWICZ: RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_NARKOWICZ,
            ACES_FILMIC_HILL: RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL,
        },
        label: 'mode'
    });
    f_tonemapping.addBinding(targetView.toneMappingManager, 'exposure', {min: 0, max: 10, step: 0.01, label: 'exposure'});
    f_tonemapping.addBinding(targetView.toneMappingManager, 'contrast', {min: 0, max: 2, step: 0.01, label: 'contrast'});
    f_tonemapping.addBinding(targetView.toneMappingManager, 'brightness', {min: -1, max: 1, step: 0.01, label: 'brightness'});

    const state = {enabled: true};
    pane.addBinding(state, 'enabled', {label: 'Enable Atmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
};
