import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

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

        // [KO] 조명, HDR IBL 및 SkyAtmosphere 설정
        // [EN] Configure lighting, HDR IBL, and SkyAtmosphere
        const sunLight = new RedGPU.Light.DirectionalLight();
        sunLight.elevation = 2;
        sunLight.azimuth = -90;
        scene.lightManager.addDirectionalLight(sunLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        view.ibl = ibl;

        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        createAtmosphereTestEnvironment(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(view, skyAtmosphere, sunLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

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

            if (i === 0) {
                const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, sphereColorMat);
                mesh.setPosition(posX, FIXED_Y, posZ);
                mesh.setScale(10);
                scene.addChild(mesh);
            } else if (i === 1) {
                const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
                new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
                    const helmet = result.resultMesh;
                    helmet.setPosition(posX, FIXED_Y, posZ);
                    helmet.setScale(150);
                    scene.addChild(helmet);
                });
            } else if (i === 2) {
                const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, spherePhongMat);
                mesh.setPosition(posX, FIXED_Y, posZ);
                mesh.setScale(10);
                scene.addChild(mesh);
            } else if (i === 3) {
                for (let k = 0; k < 5; k++) {
                    const child = instanceMesh.instanceChildren[j * 5 + k];
                    child.setPosition(posX + (k - 2) * 100, 0, posZ);
                    child.setScale(5);
                }
            } else if (i === 4) {
                const textField = new RedGPU.Display.TextField3D(redGPUContext, `Distance: ${j * 2}km`);
                textField.setPosition(posX, 300, posZ);
                textField.worldSize = 100;
                textField.color = '#fff';
                scene.addChild(textField);
            } else if (i === 5) {
                const sprite = new RedGPU.Display.Sprite3D(redGPUContext, spriteMat);
                sprite.setPosition(posX, FIXED_Y, posZ);
                sprite.worldSize = 300;
                scene.addChild(sprite);
            } else if (i === 6) {
                const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
                spriteSheet.setPosition(posX, FIXED_Y, posZ);
                spriteSheet.worldSize = 300;
                scene.addChild(spriteSheet);
            } else if (i === 7) {
                const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
                emitter.material.diffuseTexture = particleTexture;
                emitter.setPosition(posX, FIXED_Y, posZ);
                emitter.particleNum = 200;
                emitter.maxEndScale = 500;
                scene.addChild(emitter);
            } else if (i === 8) {
                const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#00ff00');
                line.addPoint(0, -100, 0);
                line.addPoint(0, 100, 0);
                line.setPosition(posX, FIXED_Y, posZ);
                scene.addChild(line);
            }
        }
    }
};

const renderTestPane = (targetView, skyAtmosphere, sunLight) => {
    new RedGPUExampleHelper(targetView.redGPUContext, {
        gui: (pane) => {
            const state = {
                useSkyAtmosphere: true,
                skyLuminanceFactor: {
                    r: skyAtmosphere.skyLuminanceFactor.r,
                    g: skyAtmosphere.skyLuminanceFactor.g,
                    b: skyAtmosphere.skyLuminanceFactor.b
                },
                rayleighScattering: {
                    r: skyAtmosphere.rayleighScattering.r,
                    g: skyAtmosphere.rayleighScattering.g,
                    b: skyAtmosphere.rayleighScattering.b
                },
                mieScattering: {
                    r: skyAtmosphere.mieScattering.r,
                    g: skyAtmosphere.mieScattering.g,
                    b: skyAtmosphere.mieScattering.b
                },
                mieAbsorption: {
                    r: skyAtmosphere.mieAbsorption.r,
                    g: skyAtmosphere.mieAbsorption.g,
                    b: skyAtmosphere.mieAbsorption.b
                },
                absorption: {
                    r: skyAtmosphere.absorption.r,
                    g: skyAtmosphere.absorption.g,
                    b: skyAtmosphere.absorption.b
                },
                groundAlbedo: {
                    r: skyAtmosphere.groundAlbedo.r,
                    g: skyAtmosphere.groundAlbedo.g,
                    b: skyAtmosphere.groundAlbedo.b
                }
            };

            pane.addBinding(state, 'useSkyAtmosphere').on('change', (ev) => {
                targetView.skyAtmosphere = ev.value ? skyAtmosphere : null;
            });

            const f_sun = pane.addFolder({title: 'Sun (DirectionalLight)', expanded: true});
            f_sun.addBinding(sunLight, 'elevation', {min: -90, max: 90, step: 0.0001});
            f_sun.addBinding(sunLight, 'azimuth', {min: -360, max: 360, step: 0.0001});
            f_sun.addBinding(sunLight, 'lux', {min: 0, max: 200000, step: 100});
            f_sun.addBinding(sunLight, 'intensityMultiplier', {min: 0, max: 10, step: 0.1});

            const f_atmo = pane.addFolder({title: 'SkyAtmosphere', expanded: true});
            f_atmo.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01});
            f_atmo.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01});
            f_atmo.addBinding(skyAtmosphere, 'multiScatteringFactor', {min: 0, max: 10, step: 0.01});
            f_atmo.addBinding(state, 'skyLuminanceFactor', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.skyLuminanceFactor.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });

            const f_aerial = f_atmo.addFolder({title: 'Aerial Perspective', expanded: true});
            f_aerial.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1});
            f_aerial.addBinding(skyAtmosphere, 'aerialPerspectiveStartDepth', {min: 0, max: 100, step: 0.1});

            const f_clouds = f_atmo.addFolder({title: 'Clouds', expanded: false});
            f_clouds.addBinding(skyAtmosphere, 'cloudCoverage', {min: 0, max: 1, step: 0.01});
            f_clouds.addBinding(skyAtmosphere, 'cloudDensity', {min: 0, max: 1, step: 0.01});
            f_clouds.addBinding(skyAtmosphere, 'cloudHeight', {min: 0.1, max: 20, step: 0.1});
            f_clouds.addBinding(skyAtmosphere, 'cloudTimeMultiplier', {min: -10000, max: 10000, step: 0.01});

            const f_scattering = f_atmo.addFolder({title: 'Scattering & Planet', expanded: false});

            const f_rayleigh = f_scattering.addFolder({title: 'Rayleigh', expanded: true});
            f_rayleigh.addBinding(state, 'rayleighScattering', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.rayleighScattering.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });
            f_rayleigh.addBinding(skyAtmosphere, 'rayleighScatteringScale', {min: 0, max: 0.2, step: 0.0001});
            f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {min: 0.1, max: 100, step: 0.1});

            const f_mie = f_scattering.addFolder({title: 'Mie', expanded: true});
            f_mie.addBinding(state, 'mieScattering', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.mieScattering.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });
            f_mie.addBinding(skyAtmosphere, 'mieScatteringScale', {min: 0, max: 0.1, step: 0.0001});
            f_mie.addBinding(state, 'mieAbsorption', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.mieAbsorption.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });
            f_mie.addBinding(skyAtmosphere, 'mieAbsorptionScale', {min: 0, max: 0.1, step: 0.0001});
            f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.001});
            f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 100, step: 0.1});

            const f_ozone = f_scattering.addFolder({title: 'Ozone', expanded: true});
            f_ozone.addBinding(state, 'absorption', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.absorption.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });
            f_ozone.addBinding(skyAtmosphere, 'absorptionScale', {min: 0, max: 0.1, step: 0.0001});
            f_ozone.addBinding(skyAtmosphere, 'absorptionTipAltitude', {min: 0, max: 100, step: 0.1});
            f_ozone.addBinding(skyAtmosphere, 'absorptionTentWidth', {min: 1, max: 50, step: 0.1});

            const f_planet = f_scattering.addFolder({title: 'Planet', expanded: true});
            f_planet.addBinding(skyAtmosphere, 'groundRadius', {min: 1000, max: 10000, step: 1});
            f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1});
            f_planet.addBinding(state, 'groundAlbedo', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.groundAlbedo.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });
        }
    });
};
