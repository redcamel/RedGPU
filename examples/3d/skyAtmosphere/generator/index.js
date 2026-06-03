import * as RedGPU from "../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778922031603";

/**
 * [KO] SkyAtmosphere Generator (LUT) 예제
 * [EN] SkyAtmosphere Generator (LUT) example
 *
 * [KO] SkyAtmosphere 시스템 내부에서 실시간으로 생성되는 다양한 LUT(Look-Up Table) 텍스처들을 시각화합니다.
 * [EN] Visualizes various LUT (Look-Up Table) textures generated in real-time within the SkyAtmosphere system.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;
        controller.distance = 35; // 전체 레이아웃을 보기 위해 거리 확대

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 2. SkyAtmosphere 초기화 및 설정
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        /**
         * [KO] LUT 텍스처를 시각화하기 위한 스프라이트와 레이블을 생성합니다.
         * [EN] Creates a sprite and label to visualize a LUT texture.
         */
        const createLUTSprite = (texture, name, x, y) => {
            if (!texture) return;

            const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
            material.diffuseTexture = texture;

            const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
            sprite.setPosition(x, y, 0);
            sprite.worldSize = 2; // 크기 약간 확대
            scene.addChild(sprite);

            const label = new RedGPU.Display.TextField3D(redGPUContext);
            label.text = name;
            label.setPosition(x, y - 3, 0); // 스프라이트 아래 배치
            label.fontSize = 32;
            label.color = '#fff';
            scene.addChild(label);

            return sprite;
        };

        // 3. 주요 2D LUT 시각화 (상단 배치 - 겹치지 않도록 넓은 간격 유지)
        createLUTSprite(skyAtmosphere.transmittanceLUT, 'Transmittance LUT', -9, 9);
        createLUTSprite(skyAtmosphere.multiScatLUT, 'Multi-Scat LUT', 0, 9);
        createLUTSprite(skyAtmosphere.skyViewLUT, 'Sky-View LUT', 9, 9);

        // 4. 라이팅 및 IBL 검증을 위한 구체 배치 (중단 배치)
        const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 4, 32, 32);

        // [KO] 왼쪽: 완전 금속 구체 (Reflection LUT 검증용)
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

        // [KO] 오른쪽: 완전 디퓨즈 구체 (Irradiance LUT 검증용)
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

        // 하단 안내 텍스트 (하단으로 더 배치)
        const infoLabel = new RedGPU.Display.TextField3D(redGPUContext);
        infoLabel.text = 'Note: Aerial Perspective LUT is a 3D Volume texture utilized in the background.';
        infoLabel.setPosition(0, -15, 0);
        infoLabel.fontSize = 20;
        infoLabel.worldSize =1;
        infoLabel.color = '#999';
        scene.addChild(infoLabel);

        // 5. 렌더링 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. 테스트 GUI 설정
        renderTestPane(view, skyAtmosphere);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링하고 SkyAtmosphere 속성을 제어합니다.
 * [EN] Renders the GUI for testing and controls SkyAtmosphere properties.
 */
const renderTestPane = (targetView, skyAtmosphere) => {
    new RedGPUExampleHelper(targetView.redGPUContext, {
        gui: (pane) => {
            const f_sun = pane.addFolder({title: 'Sun Configuration', expanded: true});
            f_sun.addBinding(skyAtmosphere, 'sunElevation', {min: -90, max: 90, step: 0.0001, label: 'Elevation'});
            f_sun.addBinding(skyAtmosphere, 'sunAzimuth', {min: -360, max: 360, step: 0.0001, label: 'Azimuth'});
            f_sun.addBinding(skyAtmosphere, 'sunIntensity', {min: 0, max: 10000, step: 0.1, label: 'Intensity'});
            f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'Size'});
            f_sun.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01, label: 'Limb Darkening'});

            const f_planet = pane.addFolder({title: 'Planet', expanded: false});
            f_planet.addBinding(skyAtmosphere, 'bottomRadius', {min: 1000, max: 10000, step: 1, label: 'Radius (km)'});
            f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1, label: 'Atmo Height (km)'});
            f_planet.addBinding(skyAtmosphere, 'seaLevel', {min: -10, max: 10, step: 0.01, label: 'Sea Level (km)'});
            f_planet.addBinding(skyAtmosphere, 'cameraHeight', {readonly: true, interval: 100, label: 'Cam Height (km)'});
            f_planet.addBinding(skyAtmosphere, 'groundAmbient', {min: 0, max: 10, step: 0.01, label: 'Ground Ambient'});
            
            const groundState = {
                albedo: {
                    r: skyAtmosphere.groundAlbedo[0],
                    g: skyAtmosphere.groundAlbedo[1],
                    b: skyAtmosphere.groundAlbedo[2]
                }
            };
            f_planet.addBinding(groundState, 'albedo', {color: {type: 'float'}, label: 'Ground Albedo'}).on('change', (ev) => {
                skyAtmosphere.groundAlbedo = [ev.value.r, ev.value.g, ev.value.b];
            });
            f_planet.addBinding(skyAtmosphere, 'showGround', {label: 'Show Ground'});

            const f_rayleigh = pane.addFolder({title: 'Rayleigh', expanded: false});
            const rayleighState = {
                scat: {
                    r: skyAtmosphere.rayleighScattering[0],
                    g: skyAtmosphere.rayleighScattering[1],
                    b: skyAtmosphere.rayleighScattering[2]
                }
            };
            f_rayleigh.addBinding(rayleighState, 'scat', {color: {type: 'float'}, label: 'Scattering'}).on('change', (ev) => {
                skyAtmosphere.rayleighScattering = [ev.value.r, ev.value.g, ev.value.b];
            });
            f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {min: 0.1, max: 100, step: 0.1, label: 'Exp Dist (km)'});

            const f_mie = pane.addFolder({title: 'Mie', expanded: false});
            f_mie.addBinding(skyAtmosphere, 'mieScattering', {min: 0, max: 1.0, step: 0.0001, label: 'Scattering'});
            f_mie.addBinding(skyAtmosphere, 'mieAbsorption', {min: 0, max: 1.0, step: 0.0001, label: 'Absorption'});
            f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'Anisotropy (g)'});
            f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 100, step: 0.1, label: 'Exp Dist (km)'});

            const f_absorption = pane.addFolder({title: 'Absorption (Ozone)', expanded: false});
            const absorptionState = {
                coeff: {
                    r: skyAtmosphere.absorptionCoefficient[0],
                    g: skyAtmosphere.absorptionCoefficient[1],
                    b: skyAtmosphere.absorptionCoefficient[2]
                }
            };
            f_absorption.addBinding(absorptionState, 'coeff', {color: {type: 'float'}, label: 'Coefficient'}).on('change', (ev) => {
                skyAtmosphere.absorptionCoefficient = [ev.value.r, ev.value.g, ev.value.b];
            });
            f_absorption.addBinding(skyAtmosphere, 'absorptionTipAltitude', {min: 0, max: 100, step: 0.1, label: 'Tip Altitude (km)'});
            f_absorption.addBinding(skyAtmosphere, 'absorptionTentWidth', {min: 1, max: 50, step: 0.1, label: 'Tent Width (km)'});

            const f_artistic = pane.addFolder({title: 'Artistic Controls', expanded: true});
            const skyLuminanceState = {
                factor: {
                    r: skyAtmosphere.skyLuminanceFactor[0],
                    g: skyAtmosphere.skyLuminanceFactor[1],
                    b: skyAtmosphere.skyLuminanceFactor[2]
                }
            };
            f_artistic.addBinding(skyLuminanceState, 'factor', {color: {type: 'float'}, label: 'Luminance Factor'}).on('change', (ev) => {
                skyAtmosphere.skyLuminanceFactor = [ev.value.r, ev.value.g, ev.value.b];
            });
            f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1, label: 'Aerial Distance (km)'});

            const f_fog = pane.addFolder({title: 'Height Fog', expanded: false});
            f_fog.addBinding(skyAtmosphere, 'heightFogDensity', {min: 0, max: 10, step: 0.001, label: 'Density'});
            f_fog.addBinding(skyAtmosphere, 'heightFogFalloff', {min: 0.001, max: 10, step: 0.001, label: 'Falloff'});
            f_fog.addBinding(skyAtmosphere, 'heightFogAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'Anisotropy (g)'});

            const state = {enabled: true};
            pane.addBinding(state, 'enabled', {label: 'Enable Atmosphere'}).on('change', (v) => {
                targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
            });
        }
    });
};
