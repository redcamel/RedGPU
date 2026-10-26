import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] SkyAtmosphere 기본 예제
 * [EN] SkyAtmosphere Basic Example
 *
 * [KO] 물리 기반 대기 산란(SkyAtmosphere)과 태양 광원(DirectionalLight)을 연동하여 실시간 하늘 배경, 절차적 구름, 대기 산란 및 간접 조명(IBL)을 제어하는 방법을 시연합니다.
 * [EN] Demonstrates how to control real-time sky background, procedural clouds, atmospheric scattering, and indirect lighting (IBL) by linking physically based atmospheric scattering (SkyAtmosphere) with a sun light source (DirectionalLight).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;
        controller.distance = 15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 태양 광원(DirectionalLight) 및 SkyAtmosphere 생성 후 뷰에 설정
        // [EN] Create sun light source (DirectionalLight) and SkyAtmosphere, then assign to the view
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 0;
        scene.lightManager.addDirectionalLight(directionalLight);

        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EnvironmentTest/glTF/EnvironmentTest.gltf');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionTest/glTF-Binary/TransmissionTest.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF-Binary/ClearcoatWicker.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF-Binary/Corset.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlassHurricaneCandleHolder/glTF-Binary/GlassHurricaneCandleHolder.glb');

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(view, skyAtmosphere, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => {
        const mesh = scene.addChild(v['resultMesh']);
        if (url.includes('Corset')) {
            mesh.setScale(40);
            mesh.z = 2;
            mesh.y = -2;
        }
        if (url.includes('ClearcoatWicker')) {
            mesh.setScale(3);
            mesh.x = -6;
            mesh.y = -1.5;
        }
        if (url.includes('TransmissionTest')) {
            mesh.setScale(5);
        }
        if (url.includes('MosquitoInAmber')) {
            mesh.setScale(20);
            mesh.x = 8;
        }
        if (url.includes('GlassHurricaneCandleHolder')) {
            mesh.setScale(12);
            mesh.x = 5;
            mesh.y = -2;
        }
    }, RedGPUExampleHelper.loadingProgressInfoHandler);
}

const renderTestPane = (targetView, skyAtmosphere, sunSource) => {
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
            f_sun.addBinding(sunSource, 'elevation', {min: -90, max: 90, step: 0.0001});
            f_sun.addBinding(sunSource, 'azimuth', {min: -360, max: 360, step: 0.0001});
            f_sun.addBinding(sunSource, 'lux', {min: 0, max: 200000, step: 100});
            f_sun.addBinding(sunSource, 'intensityMultiplier', {min: 0, max: 10, step: 0.1});

            const f_atmo = pane.addFolder({title: 'SkyAtmosphere', expanded: true});
            f_atmo.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01});
            f_atmo.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01});
            f_atmo.addBinding(skyAtmosphere, 'multiScatteringFactor', {min: 0, max: 10, step: 0.01});
            f_atmo.addBinding(state, 'skyLuminanceFactor', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.skyLuminanceFactor.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });

            const f_clouds = f_atmo.addFolder({title: 'Clouds', expanded: true});
            f_clouds.addBinding(skyAtmosphere, 'cloudCoverage', {min: 0, max: 1, step: 0.01});
            f_clouds.addBinding(skyAtmosphere, 'cloudDensity', {min: 0, max: 1, step: 0.01});
            f_clouds.addBinding(skyAtmosphere, 'cloudHeight', {min: 0.1, max: 20, step: 0.1});
            f_clouds.addBinding(skyAtmosphere, 'cloudTimeMultiplier', {min: -10000, max: 10000, step: 0.01});

            const f_aerial = f_atmo.addFolder({title: 'Aerial Perspective', expanded: false});
            f_aerial.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1});
            f_aerial.addBinding(skyAtmosphere, 'aerialPerspectiveStartDepth', {min: 0, max: 100, step: 0.1});

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
