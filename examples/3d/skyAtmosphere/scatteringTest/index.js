import * as RedGPU from "../../../../dist/index.js?t=1781136546834";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781136546834";

/**
 * [KO] SkyAtmosphere 재질별 산란 시연
 * [EN] SkyAtmosphere Material Scattering example
 *
 * [KO] 물리 기반 대기 산란 시스템과 공중 투시(Aerial Perspective) 효과가 다양한 객체 타입 및 재질(Color, Phong, PBR, Sprite, Particle 등)에 어떻게 적용되는지 종합적으로 시연합니다.
 * [EN] Comprehensively demonstrates how the physics-based atmospheric scattering system and Aerial Perspective effects are applied to various object types and materials (Color, Phong, PBR, Sprite, Particle, etc.).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        view.rawCamera.farClipping = 2000000;
        controller.pan = 0;
        controller.tilt = -10;
        controller.distance = 3000;
        controller.speedDistance = 100;
        controller.minDistance = 10;
        controller.maxDistance = 1000000;

        redGPUContext.addView(view);

        // 2. 조명 및 HDR IBL 설정
        const sunLight = new RedGPU.Light.DirectionalLight();
        sunLight.elevation = 2;
        sunLight.azimuth = -90;
        scene.lightManager.addDirectionalLight(sunLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        view.ibl = ibl;

        // 3. SkyAtmosphere 설정
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        // 4. 테스트 환경 구성 (다양한 재질 및 객체 그리드 배치)
        createAtmosphereTestEnvironment(redGPUContext, scene);

        // 5. 렌더링 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. 테스트 GUI 설정
        renderTestPane(view, skyAtmosphere, sunLight);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 대기 산란 테스트를 위해 거리별로 다양한 객체들을 배치합니다.
 * [EN] Places various objects by distance to test atmospheric scattering.
 */
const createAtmosphereTestEnvironment = (redGPUContext, scene) => {
    const sphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 10, 32, 32);
    const sphereColorMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const spherePhongMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');

    const GRID_X = 9;
    const GRID_Z = 50;
    const STEP_X = 500;
    const STEP_Z = 2000;
    const FIXED_Y = 100;

    const testTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
    const spriteMat = new RedGPU.Material.BitmapMaterial(redGPUContext, testTexture);
    const particleTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle.png');
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0);

    const instanceMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 250, 250, sphereGeo, spherePhongMat);
    scene.addChild(instanceMesh);

    for (let i = 0; i < GRID_X; i++) {
        const posX = (i - (GRID_X - 1) / 2) * STEP_X;

        for (let j = 0; j < GRID_Z; j++) {
            const posZ = -j * STEP_Z;

            if (i === 0) { // ColorMaterial
                const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, sphereColorMat);
                mesh.setPosition(posX, FIXED_Y, posZ);
                mesh.setScale(10);
                scene.addChild(mesh);
            } else if (i === 1) { // GLTF Model (PBR)
                const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
                new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
                    const helmet = result.resultMesh;
                    helmet.setPosition(posX, FIXED_Y, posZ);
                    helmet.setScale(150);
                    scene.addChild(helmet);
                });
            } else if (i === 2) { // PhongMaterial
                const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, spherePhongMat);
                mesh.setPosition(posX, FIXED_Y, posZ);
                mesh.setScale(10);
                scene.addChild(mesh);
            } else if (i === 3) { // Instancing
                for (let k = 0; k < 5; k++) {
                    const child = instanceMesh.instanceChildren[j * 5 + k];
                    child.setPosition(posX + (k - 2) * 100, 0, posZ);
                    child.setScale(5);
                }
            } else if (i === 4) { // TextField3D
                const textField = new RedGPU.Display.TextField3D(redGPUContext, `Distance: ${j * 2}km`);
                textField.setPosition(posX, 300, posZ);
                textField.worldSize = 100;
                textField.color = '#fff';
                scene.addChild(textField);
            } else if (i === 5) { // Sprite3D
                const sprite = new RedGPU.Display.Sprite3D(redGPUContext, spriteMat);
                sprite.setPosition(posX, FIXED_Y, posZ);
                sprite.worldSize = 300;
                scene.addChild(sprite);
            } else if (i === 6) { // SpriteSheet3D
                const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
                spriteSheet.setPosition(posX, FIXED_Y, posZ);
                spriteSheet.worldSize = 300;
                scene.addChild(spriteSheet);
            } else if (i === 7) { // Particle
                const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
                emitter.material.diffuseTexture = particleTexture;
                emitter.setPosition(posX, FIXED_Y, posZ);
                emitter.particleNum = 200;
                emitter.maxEndScale = 500;
                scene.addChild(emitter);
            } else if (i === 8) { // Line3D
                const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#00ff00');
                line.addPoint(0, -100, 0);
                line.addPoint(0, 100, 0);
                line.setPosition(posX, FIXED_Y, posZ);
                scene.addChild(line);
            }
        }
    }
};

/**
 * [KO] 테스트용 GUI를 렌더링하고 대기 산란 속성을 제어합니다.
 * [EN] Renders the GUI for testing and controls atmospheric scattering properties.
 */
const renderTestPane = (targetView, skyAtmosphere, sunLight) => {
    new RedGPUExampleHelper(targetView.redGPUContext, {
        gui: (pane) => {
            const f_sun = pane.addFolder({title: 'Sun Configuration', expanded: true});
            f_sun.addBinding(sunLight, 'elevation', {min: -90, max: 90, step: 0.0001, label: 'sunElevation'});
            f_sun.addBinding(sunLight, 'azimuth', {min: -360, max: 360, step: 0.0001, label: 'sunAzimuth'});
            f_sun.addBinding(sunLight, 'lux', {min: 0, max: 200000, step: 1, label: 'sunIntensity (Lux)'});
            f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'sunSize'});
            f_sun.addBinding(skyAtmosphere, 'sunLimbDarkening', {
                min: 0,
                max: 10,
                step: 0.01,
                label: 'sunLimbDarkening'
            });
            f_sun.addBinding(sunLight, 'intensityMultiplier', {
                min: 0,
                max: 10,
                step: 0.1,
                label: 'Intensity Multiplier'
            });

            const f_rayleigh = pane.addFolder({title: 'Rayleigh', expanded: false});
            const rayleighState = {
                scat: {
                    r: skyAtmosphere.rayleighScattering[0],
                    g: skyAtmosphere.rayleighScattering[1],
                    b: skyAtmosphere.rayleighScattering[2]
                }
            };
            f_rayleigh.addBinding(rayleighState, 'scat', {
                color: {type: 'float'},
                label: 'rayleighScattering'
            }).on('change', (ev) => {
                skyAtmosphere.rayleighScattering = [ev.value.r, ev.value.g, ev.value.b];
            });
            f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {
                min: 0.1,
                max: 100,
                step: 0.1,
                label: 'rayleighExponentialDistribution (km)'
            });

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
            f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {
                min: 0,
                max: 0.999,
                step: 0.001,
                label: 'mieAnisotropy (g)'
            });
            f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {
                min: 0.1,
                max: 100,
                step: 0.1,
                label: 'mieExponentialDistribution (km)'
            });

            const f_artistic = pane.addFolder({title: 'Artistic Controls', expanded: true});
            const luminanceState = {
                factor: {
                    r: skyAtmosphere.skyLuminanceFactor[0],
                    g: skyAtmosphere.skyLuminanceFactor[1],
                    b: skyAtmosphere.skyLuminanceFactor[2]
                }
            };
            f_artistic.addBinding(luminanceState, 'factor', {
                color: {type: 'float'},
                label: 'skyLuminanceFactor'
            }).on('change', (ev) => {
                skyAtmosphere.skyLuminanceFactor = [ev.value.r, ev.value.g, ev.value.b];
            });
            f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {
                min: 1,
                max: 1000,
                step: 1,
                label: 'aerialPerspectiveDistanceScale (km)'
            });
        }
    });
};
