import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] SkyAtmosphere & IBL/SkyBox 연동 예제
 * [EN] SkyAtmosphere & IBL/SkyBox Integration Example
 *
 * [KO] SkyAtmosphere와 외부 HDR IBL 및 SkyBox를 함께 구성하여 대기 산란 조명과 환경맵 조명의 조합·전환을 시연합니다.
 * [EN] Demonstrates combining and switching between atmospheric scattering lighting and environment map lighting by configuring SkyAtmosphere alongside external HDR IBL and SkyBox.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // [KO] 태양 광원, SkyAtmosphere, HDR IBL 및 SkyBox 초기화 후 뷰에 설정
        // [EN] Initialize sun light, SkyAtmosphere, HDR IBL, and SkyBox, then assign to the view
        const sunLight = new RedGPU.Light.DirectionalLight();
        sunLight.elevation = 35;
        sunLight.azimuth = 0;
        scene.lightManager.addDirectionalLight(sunLight);

        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/Cannon_Exterior.hdr');
        const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        view.skyAtmosphere = skyAtmosphere;
        view.ibl = ibl;
        view.skybox = skybox;

        view.rawCamera.farClipping = 2000000;
        controller.pan = -90;
        controller.tilt = -10;
        controller.distance = 500;
        controller.speedDistance = 10;
        controller.minTilt = -88;
        controller.maxTilt = 88;
        controller.minDistance = 10;
        controller.maxDistance = 1000000;

        redGPUContext.addView(view);

        const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
        new RedGPU.GLTFLoader(
            redGPUContext,
            url,
            (result) => {
                const helmet = result.resultMesh;
                helmet.setPosition(0, 0, 0);
                helmet.setScale(150);
                scene.addChild(helmet);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

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

const renderTestPane = (targetView, skyAtmosphere, sunLight) => {
    const hdrImages = [
        {name: 'Cannon_Exterior', path: '../../../assets/hdr/Cannon_Exterior.hdr', luminance: 25000, sunLux: 100000},
        {
            name: '2K - the sky is on fire',
            path: '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            luminance: 20000,
            sunLux: 60000
        },
        {name: 'field', path: '../../../assets/hdr/field.hdr', luminance: 15000, sunLux: 60000},
        {name: 'neutral.37290948', path: '../../../assets/hdr/neutral.37290948.hdr', luminance: 20000, sunLux: 80000},
        {name: 'pisa', path: '../../../assets/hdr/pisa.hdr', luminance: 10000, sunLux: 30000}
    ];

    let currentIBL = targetView.ibl;
    let currentSkybox = targetView.skybox;

    const state = {
        iblTexture: hdrImages[0].name,
        skyboxTexture: hdrImages[0].name,
        useIBL: !!targetView.ibl,
        useSkybox: !!targetView.skybox,
        useSkyAtmosphere: !!targetView.skyAtmosphere,
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

    new RedGPUExampleHelper(targetView.redGPUContext, {
        RedGPU,
        gui: (pane) => {
            pane.addBinding(state, 'useSkyAtmosphere').on('change', (ev) => {
                targetView.skyAtmosphere = ev.value ? skyAtmosphere : null;
            });

            const f_sun = pane.addFolder({title: 'Sun (DirectionalLight)', expanded: true});
            f_sun.addBinding(sunLight, 'elevation', {min: -90, max: 90, step: 0.0001});
            f_sun.addBinding(sunLight, 'azimuth', {min: -360, max: 360, step: 0.0001});
            f_sun.addBinding(sunLight, 'lux', {min: 0, max: 200000, step: 100});
            f_sun.addBinding(sunLight, 'intensityMultiplier', {min: 0, max: 10, step: 0.1});

            const f_atmo = pane.addFolder({title: 'SkyAtmosphere', expanded: false});
            f_atmo.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01});
            f_atmo.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01});
            f_atmo.addBinding(skyAtmosphere, 'multiScatteringFactor', {min: 0, max: 10, step: 0.01});
            f_atmo.addBinding(state, 'skyLuminanceFactor', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.skyLuminanceFactor.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });

            const f_clouds = f_atmo.addFolder({title: 'Clouds', expanded: false});
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

            const f_ibl = pane.addFolder({title: 'IBL Configuration', expanded: true});
            f_ibl.addBinding(state, 'useIBL').on('change', (ev) => {
                targetView.ibl = ev.value ? currentIBL : null;
            });
            f_ibl.addBinding(state, 'iblTexture', {
                options: hdrImages.reduce((acc, item) => ({...acc, [item.name]: item.name}), {})
            }).on('change', (ev) => {
                const imageInfo = hdrImages.find(item => item.name === ev.value);
                if (imageInfo) {
                    currentIBL = new RedGPU.Resource.IBL(targetView.redGPUContext, imageInfo.path, imageInfo.luminance);
                    if (state.useIBL) targetView.ibl = currentIBL;
                    if (sunLight) {
                        sunLight.lux = imageInfo.sunLux || (imageInfo.luminance * 4);
                        pane.refresh();
                    }
                }
            });

            f_ibl.addBinding({
                get intensityMultiplier() {
                    return currentIBL.intensityMultiplier;
                },
                set intensityMultiplier(v) {
                    currentIBL.intensityMultiplier = v;
                }
            }, 'intensityMultiplier', {min: 0, max: 10, step: 0.01});

            f_ibl.addBinding({
                get luminance() {
                    return currentIBL.luminance;
                },
                set luminance(v) {
                    currentIBL.luminance = v;
                    if (sunLight) {
                        sunLight.lux = v * 4;
                        pane.refresh();
                    }
                }
            }, 'luminance', {min: 0, max: 100000, step: 1});

            const f_skybox = pane.addFolder({title: 'SkyBox Configuration', expanded: true});
            f_skybox.addBinding(state, 'useSkybox').on('change', (ev) => {
                targetView.skybox = ev.value ? currentSkybox : null;
            });
            f_skybox.addBinding(state, 'skyboxTexture', {
                options: hdrImages.reduce((acc, item) => ({...acc, [item.name]: item.name}), {})
            }).on('change', (ev) => {
                const imageInfo = hdrImages.find(item => item.name === ev.value);
                if (imageInfo) {
                    const isHDR = typeof imageInfo.path === 'string' && imageInfo.path.toLowerCase().endsWith('.hdr');
                    const newTexture = isHDR
                        ? new RedGPU.Resource.IBL(targetView.redGPUContext, imageInfo.path, imageInfo.luminance).environmentTexture
                        : new RedGPU.Resource.CubeTexture(targetView.redGPUContext, imageInfo.path, true);
                    currentSkybox.texture = newTexture;
                    currentSkybox.luminance = imageInfo.luminance;
                }
            });
            f_skybox.addBinding({
                get opacity() {
                    return currentSkybox.opacity;
                },
                set opacity(v) {
                    currentSkybox.opacity = v;
                }
            }, 'opacity', {min: 0, max: 1, step: 0.01});
            f_skybox.addBinding({
                get blur() {
                    return currentSkybox.blur;
                },
                set blur(v) {
                    currentSkybox.blur = v;
                }
            }, 'blur', {min: 0, max: 1, step: 0.01});
            f_skybox.addBinding({
                get intensityMultiplier() {
                    return currentSkybox.intensityMultiplier;
                },
                set intensityMultiplier(v) {
                    currentSkybox.intensityMultiplier = v;
                }
            }, 'intensityMultiplier', {min: 0, max: 10, step: 0.01});
        }
    });
};
