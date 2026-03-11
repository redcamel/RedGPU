/**
 * [KO] SkyAtmosphere Generator LUT 텍스처 시각화 예제
 * [EN] SkyAtmosphere Generator LUT Texture Visualization Example
 */
import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        controller.tilt = 0;
        controller.distance = 20;
        redGPUContext.addView(view);

        // 1. SkyAtmosphere 초기화 (View 속성 방식)
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        // 2. LUT 스프라이트 생성 함수
        const createLUTSprite = (texture, name, x, y) => {
            const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
            material.diffuseTexture = texture;
            const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
            sprite.x = x; sprite.y = y;
            sprite.worldSize = 4;
            scene.addChild(sprite);

            const label = new RedGPU.Display.TextField3D(redGPUContext, name);
            label.x = x; label.y = y - 2.5;
            label.worldSize = 0.8;
            label.color = '#fff';
            scene.addChild(label);
            return sprite;
        };

        // 3. LUT 텍스처 시각화 (위치 및 레이아웃 조정)
        const transmittance = skyAtmosphere.atmosphereTransmittanceTexture;
        const multiScat = skyAtmosphere.atmosphereMultiScatteringTexture;
        const skyView = skyAtmosphere.atmosphereSkyViewTexture;
        const irradiance = skyAtmosphere.atmosphereIrradianceTexture;
        const reflection = skyAtmosphere.atmosphereReflectionTexture;

        // [KO] 2D LUT들은 상단에 배치
        if (transmittance) createLUTSprite(transmittance, 'Transmittance LUT', -6, 8);
        if (multiScat) createLUTSprite(multiScat, 'Multi-Scat LUT', 0, 8);
        if (skyView) createLUTSprite(skyView, 'Sky-View LUT', 6, 8);

        // 4. 라이팅 검증을 위한 두 개의 구체 배치
        const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 2.5, 32, 32);

        // [KO] 왼쪽: 완전 금속 구체 (반사 큐브맵 확인용)
        // [EN] Left: Fully metallic sphere (to verify reflection cubemap)
        const metallicMat = new RedGPU.Material.PBRMaterial(redGPUContext);
        metallicMat.metallicFactor = 1.0;
        metallicMat.roughnessFactor = 0.0;
        const metallicVerifier = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, metallicMat);
        metallicVerifier.x = -4;
        scene.addChild(metallicVerifier);

        const metallicLabel = new RedGPU.Display.TextField3D(redGPUContext, 'Specular (Reflection)');
        metallicLabel.x = -4; metallicLabel.y = -3.5;
        metallicLabel.worldSize = 0.6;
        metallicLabel.color = '#ffcc00';
        scene.addChild(metallicLabel);

        // [KO] 오른쪽: 완전 디퓨즈 구체 (조도 큐브맵 확인용)
        // [EN] Right: Fully diffuse sphere (to verify irradiance cubemap)
        const diffuseMat = new RedGPU.Material.PBRMaterial(redGPUContext);
        diffuseMat.metallicFactor = 0.0;
        diffuseMat.roughnessFactor = 1.0;
        const diffuseVerifier = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, diffuseMat);
        diffuseVerifier.x = 4;
        scene.addChild(diffuseVerifier);

        const diffuseLabel = new RedGPU.Display.TextField3D(redGPUContext, 'Diffuse (Irradiance)');
        diffuseLabel.x = 4; diffuseLabel.y = -3.5;
        diffuseLabel.worldSize = 0.6;
        diffuseLabel.color = '#00ccff';
        scene.addChild(diffuseLabel);

        const infoLabel = new RedGPU.Display.TextField3D(redGPUContext, '3D Camera Volume LUT (Aerial Perspective) is active in background');
        infoLabel.x = 0; infoLabel.y = -6;
        infoLabel.worldSize = 0.5;
        infoLabel.color = '#999';
        scene.addChild(infoLabel);
        
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
    const pane = new Pane({title: 'SkyAtmosphere Generator', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    const f_sun = pane.addFolder({title: 'Sun Configuration', expanded: true});
    f_sun.addBinding(skyAtmosphere, 'sunElevation', {min: -90, max: 90, step: 0.0001, label: 'sunElevation'});
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', {min: -360, max: 360, step: 0.0001, label: 'sunAzimuth'});
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', {min: 0, max: 10000, step: 0.1, label: 'sunIntensity'});
    f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'sunSize'});
    f_sun.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01, label: 'sunLimbDarkening'});

    const f_planet = pane.addFolder({title: 'Planet', expanded: false});
    f_planet.addBinding(skyAtmosphere, 'bottomRadius', {min: 1000, max: 10000, step: 1, label: 'bottomRadius (km)'});
    f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1, label: 'atmosphereHeight (km)'});
    f_planet.addBinding(skyAtmosphere, 'seaLevel', {min: -10, max: 10, step: 0.01, label: 'seaLevel (km)'});
    f_planet.addBinding(skyAtmosphere, 'cameraHeight', {readonly: true, interval: 100, label: 'cameraHeight (km)'});
    f_planet.addBinding(skyAtmosphere, 'groundAmbient', {min: 0, max: 10, step: 0.01, label: 'groundAmbient'});
    
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
    f_planet.addBinding(skyAtmosphere, 'showGround', {label: 'showGround'});
    f_planet.addBinding(skyAtmosphere, 'useGround', {label: 'useGround (physics)'});

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
    f_mie.addBinding(skyAtmosphere, 'mieScattering', {min: 0, max: 1.0, step: 0.0001, label: 'mieScattering'});
    f_mie.addBinding(skyAtmosphere, 'mieAbsorption', {min: 0, max: 1.0, step: 0.0001, label: 'mieAbsorption'});
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'mieAnisotropy (g)'});
    f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 100, step: 0.1, label: 'mieExponentialDistribution (km)'});
    f_mie.addBinding(skyAtmosphere, 'mieGlow', {min: 0, max: 0.999, step: 0.01, label: 'mieGlow'});
    f_mie.addBinding(skyAtmosphere, 'mieHalo', {min: 0, max: 0.999, step: 0.001, label: 'mieHalo (g)'});

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
    f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1, label: 'aerialPerspectiveDistanceScale (km)'});

    const f_fog = pane.addFolder({title: 'Height Fog', expanded: false});
    f_fog.addBinding(skyAtmosphere, 'heightFogDensity', {min: 0, max: 10, step: 0.001, label: 'heightFogDensity'});
    f_fog.addBinding(skyAtmosphere, 'heightFogFalloff', {min: 0.001, max: 10, step: 0.001, label: 'heightFogFalloff'});
    f_fog.addBinding(skyAtmosphere, 'heightFogAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'heightFogAnisotropy (g)'});

    const state = {enabled: true};
    pane.addBinding(state, 'enabled', {label: 'Enable Atmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
};
