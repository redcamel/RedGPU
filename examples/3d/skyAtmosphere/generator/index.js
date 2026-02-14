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
        const skyAtmosphere = new RedGPU.PostEffect.SkyAtmosphere(redGPUContext);
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

        // 3. LUT 텍스처 시각화 (위치 조정)
        const transmittance = skyAtmosphere.transmittanceTexture;
        const multiScat = skyAtmosphere.multiScatteringTexture;
        const skyView = skyAtmosphere.skyViewTexture;

        if (transmittance) createLUTSprite(transmittance, 'Transmittance LUT', -6, 6);
        if (multiScat) createLUTSprite(multiScat, 'Multi-Scat LUT', 0, 6);
        if (skyView) createLUTSprite(skyView, 'Sky-View LUT (Zenith:Top)', 6, 6);

        const infoLabel = new RedGPU.Display.TextField3D(redGPUContext, '3D Camera Volume LUT (Aerial Perspective) is active in background');
        infoLabel.x = 0; infoLabel.y = 1;
        infoLabel.worldSize = 0.6;
        infoLabel.color = '#ccc';
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
    const pane = new Pane({ title: 'Atmosphere Generator Verifier' });
    
    const f_sun = pane.addFolder({ title: 'Sun Position' });
    f_sun.addBinding(skyAtmosphere, 'sunElevation', { min: -90, max: 90, label: 'Sun Elevation' });
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', { min: -360, max: 360, label: 'Sun Azimuth' });

    const f_artistic = pane.addFolder({ title: 'Artistic Controls' });
    f_artistic.addBinding(skyAtmosphere, 'exposure', { min: 0, max: 10, label: 'Exposure' });
    f_artistic.addBinding(skyAtmosphere, 'sunIntensity', { min: 0, max: 100, label: 'Sun Intensity' });
};
