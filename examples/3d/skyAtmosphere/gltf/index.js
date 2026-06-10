import * as RedGPU from "../../../../dist/index.js?t=1781132971803";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132971803";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        const sunLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(sunLight);

        // 1. SkyAtmosphere 초기화
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        sunLight.elevation = 35;
        sunLight.azimuth = 0;


        // IBL 초기화
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/Cannon_Exterior.hdr');
        const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // View 속성에 직접 설정
        view.skyAtmosphere = skyAtmosphere;
        view.ibl = ibl;
        view.skybox = skybox;


        // 2. 카메라 설정
        view.rawCamera.farClipping = 2000000;
        controller.pan = -90; 
        controller.tilt = -10;
        controller.distance = 500;
        controller.speedDistance = 10;

        // 이동 제한
        controller.minTilt = -88;
        controller.maxTilt = 88;
        controller.minDistance = 10;
        controller.maxDistance = 1000000;

        redGPUContext.addView(view);

        // 3. 테스트 환경 구성
        const FIXED_Y = 0;

        const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'

        new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
                let helmet = result.resultMesh;
                helmet.setPosition(0, FIXED_Y, 0);
                helmet.setScale(150);
                scene.addChild(helmet);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        renderTestPane(view, skyAtmosphere, sunLight);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = (targetView, skyAtmosphere, sunLight) => {
    const hdrImages = [
        {name: 'Cannon_Exterior', path: '../../../assets/hdr/Cannon_Exterior.hdr', nit: 25000},
        {name: '2K - the sky is on fire', path: '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr', nit: 25000},
        {name: 'field', path: '../../../assets/hdr/field.hdr', nit: 30000},
        {name: 'neutral.37290948', path: '../../../assets/hdr/neutral.37290948.hdr', nit: 20000},
        {name: 'pisa', path: '../../../assets/hdr/pisa.hdr', nit: 25000}
    ];

    let currentIBL = targetView.ibl;
    let currentSkybox = targetView.skybox;
    const currentSkyAtmosphere = skyAtmosphere;

    const state = {
        iblTexture: hdrImages[0].name,
        skyboxTexture: hdrImages[0].name,
        useIBL: !!targetView.ibl,
        useSkybox: !!targetView.skybox,
        useSkyAtmosphere: !!targetView.skyAtmosphere
    };

    new RedGPUExampleHelper(targetView.redGPUContext, {
        RedGPU,
        gui: (pane) => {
            pane.addBinding(state, 'useSkyAtmosphere', {label: 'useSkyAtmosphere'}).on('change', (ev) => {
                targetView.skyAtmosphere = ev.value ? currentSkyAtmosphere : null;
            });

            const f_sun = pane.addFolder({title: 'Sun Configuration', expanded: true});
            f_sun.addBinding(sunLight, 'elevation', {min: -90, max: 90, step: 0.0001, label: 'Sun Elevation'});
            f_sun.addBinding(sunLight, 'azimuth', {min: -360, max: 360, step: 0.0001, label: 'Sun Azimuth'});
            f_sun.addBinding(sunLight, 'lux', {min: 0, max: 200000, step: 1, label: 'Sun Intensity (Lux)'});

            const f_ibl = pane.addFolder({title: 'IBL Configuration', expanded: true});
            f_ibl.addBinding(state, 'useIBL', {label: 'useIBL'}).on('change', (ev) => {
                targetView.ibl = ev.value ? currentIBL : null;
            });
            f_ibl.addBinding(state, 'iblTexture', {
                options: hdrImages.reduce((acc, item) => ({...acc, [item.name]: item.name}), {}),
                label: 'texture'
            }).on('change', (ev) => {
                const imageInfo = hdrImages.find(item => item.name === ev.value);
                if (imageInfo) {
                    currentIBL = new RedGPU.Resource.IBL(targetView.redGPUContext, imageInfo.path, imageInfo.nit);
                    if (state.useIBL) targetView.ibl = currentIBL;
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
                }
            }, 'luminance', {min: 0, max: 100000, step: 1});

            const f_skybox = pane.addFolder({title: 'SkyBox Configuration', expanded: true});
            f_skybox.addBinding(state, 'useSkybox', {label: 'useSkybox'}).on('change', (ev) => {
                targetView.skybox = ev.value ? currentSkybox : null;
            });
            f_skybox.addBinding(state, 'skyboxTexture', {
                options: hdrImages.reduce((acc, item) => ({...acc, [item.name]: item.name}), {}),
                label: 'texture'
            }).on('change', (ev) => {
                const imageInfo = hdrImages.find(item => item.name === ev.value);
                if (imageInfo) {
                    const isHDR = typeof imageInfo.path === 'string' && imageInfo.path.toLowerCase().endsWith('.hdr');
                    const newTexture = isHDR
                        ? new RedGPU.Resource.IBL(targetView.redGPUContext, imageInfo.path, imageInfo.nit).environmentTexture
                        : new RedGPU.Resource.CubeTexture(targetView.redGPUContext, imageInfo.path, true);
                    currentSkybox.texture = newTexture;
                    currentSkybox.luminance = imageInfo.nit;
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
