import * as RedGPU from "../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";

/**
 * [KO] SkyAtmosphere Generator (LUT) 예제
 * [EN] SkyAtmosphere Generator (LUT) example
 *
 * [KO] SkyAtmosphere 시스템 내부에서 실시간으로 생성되는 다양한 LUT(Look-Up Table) 텍스처들과 간접 조명(Reflection/Irradiance LUT) 결과를 시각화합니다.
 * [EN] Visualizes various LUT (Look-Up Table) textures and indirect lighting (Reflection/Irradiance LUT) results generated in real-time within the SkyAtmosphere system.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;
        controller.distance = 35;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 태양 광원(DirectionalLight) 및 SkyAtmosphere 초기화
        // [EN] Initialize sun light source (DirectionalLight) and SkyAtmosphere
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 35;
        directionalLight.azimuth = 0;
        scene.lightManager.addDirectionalLight(directionalLight);

        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        const createLUTSprite = (texture, name, x, y) => {
            if (!texture) return;

            const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
            material.diffuseTexture = texture;

            const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
            sprite.setPosition(x, y, 0);
            sprite.worldSize = 2;
            scene.addChild(sprite);

            const label = new RedGPU.Display.TextField3D(redGPUContext);
            label.text = name;
            label.setPosition(x, y - 3, 0);
            label.fontSize = 32;
            label.color = '#fff';
            scene.addChild(label);

            return sprite;
        };

        // [KO] 주요 2D LUT 시각화 및 Reflection/Irradiance LUT 검증 구체 배치
        // [EN] Visualize primary 2D LUTs and place verification spheres for Reflection/Irradiance LUTs
        createLUTSprite(skyAtmosphere.transmittanceLUT, 'Transmittance LUT', -9, 9);
        createLUTSprite(skyAtmosphere.multiScatteringLUT, 'Multi-Scattering LUT', 0, 9);
        createLUTSprite(skyAtmosphere.skyViewLUT, 'Sky-View LUT', 9, 9);

        const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 4, 32, 32);

        const metallicMat = new RedGPU.Material.PBRMaterial(redGPUContext);
        metallicMat.metallicFactor = 1.0;
        metallicMat.roughnessFactor = 0.05;
        const metallicVerifier = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, metallicMat);
        metallicVerifier.setPosition(-10, -2, 0);
        scene.addChild(metallicVerifier);

        const metallicLabel = new RedGPU.Display.TextField3D(redGPUContext);
        metallicLabel.text = 'Specular Verification<br/>(Reflection LUT)';
        metallicLabel.setPosition(-10, -8, 0);
        metallicLabel.fontSize = 24;
        metallicLabel.worldSize = 2;
        metallicLabel.color = '#00ccff';
        scene.addChild(metallicLabel);

        const diffuseMat = new RedGPU.Material.PBRMaterial(redGPUContext);
        diffuseMat.metallicFactor = 0.0;
        diffuseMat.roughnessFactor = 1.0;
        const diffuseVerifier = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, diffuseMat);
        diffuseVerifier.setPosition(10, -2, 0);
        scene.addChild(diffuseVerifier);

        const diffuseLabel = new RedGPU.Display.TextField3D(redGPUContext);
        diffuseLabel.text = 'Diffuse Verification<br/>(Irradiance LUT)';
        diffuseLabel.setPosition(10, -8, 0);
        diffuseLabel.fontSize = 24;
        diffuseLabel.worldSize = 2;
        diffuseLabel.color = '#00ccff';
        scene.addChild(diffuseLabel);

        const infoLabel = new RedGPU.Display.TextField3D(redGPUContext);
        infoLabel.text = 'Note: Aerial Perspective LUT is a 3D Volume texture utilized in the background.';
        infoLabel.setPosition(0, -15, 0);
        infoLabel.fontSize = 20;
        infoLabel.worldSize = 1;
        infoLabel.color = '#999';
        scene.addChild(infoLabel);

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

            const f_clouds = f_atmo.addFolder({title: 'Clouds', expanded: false});
            f_clouds.addBinding(skyAtmosphere, 'cloudCoverage', {min: 0, max: 1, step: 0.01});
            f_clouds.addBinding(skyAtmosphere, 'cloudDensity', {min: 0, max: 1, step: 0.01});
            f_clouds.addBinding(skyAtmosphere, 'cloudHeight', {min: 0.1, max: 20, step: 0.1});
            f_clouds.addBinding(skyAtmosphere, 'cloudTimeMultiplier', {min: -10000, max: 10000, step: 0.01});

            const f_aerial = f_atmo.addFolder({title: 'Aerial Perspective', expanded: false});
            f_aerial.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1});
            f_aerial.addBinding(skyAtmosphere, 'aerialPerspectiveStartDepth', {min: 0, max: 100, step: 0.1});

            const f_scattering = f_atmo.addFolder({title: 'Scattering & Planet', expanded: true});

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

            const f_ozone = f_scattering.addFolder({title: 'Ozone', expanded: false});
            f_ozone.addBinding(state, 'absorption', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.absorption.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });
            f_ozone.addBinding(skyAtmosphere, 'absorptionScale', {min: 0, max: 0.1, step: 0.0001});
            f_ozone.addBinding(skyAtmosphere, 'absorptionTipAltitude', {min: 0, max: 100, step: 0.1});
            f_ozone.addBinding(skyAtmosphere, 'absorptionTentWidth', {min: 1, max: 50, step: 0.1});

            const f_planet = f_scattering.addFolder({title: 'Planet', expanded: false});
            f_planet.addBinding(skyAtmosphere, 'groundRadius', {min: 1000, max: 10000, step: 1});
            f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1});
            f_planet.addBinding(state, 'groundAlbedo', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                skyAtmosphere.groundAlbedo.setColorByRGB(Math.round(r), Math.round(g), Math.round(b));
            });
        }
    });
};
