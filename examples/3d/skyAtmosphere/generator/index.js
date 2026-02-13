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

        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

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
            label.color = '#000';
            scene.addChild(label);
            return sprite;
        };

        createLUTSprite(skyAtmosphere.skyViewTexture, 'Sky-View LUT (Zenith:Top)', -6, 6);
        createLUTSprite(skyAtmosphere.multiScatteringTexture, 'Multi-Scat LUT', 0, 6);
        createLUTSprite(skyAtmosphere.transmittanceTexture, 'Transmittance LUT', 6, 6);
        
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
    const pane = new Pane();
    
    const f_sun = pane.addFolder({ title: 'Sun Position' });
    f_sun.addBinding(skyAtmosphere, 'sunElevation', { min: -90, max: 90, label: 'Sun Elevation' });
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', { min: -360, max: 360, label: 'Sun Azimuth' });

    const f_phys = pane.addFolder({ title: 'Atmosphere Physics' });
    f_phys.addBinding(skyAtmosphere, 'earthRadius', { min: 100, max: 10000, label: 'Earth Radius (km)' });
    f_phys.addBinding(skyAtmosphere, 'atmosphereHeight', { min: 1, max: 200, label: 'Atmosphere Height (km)' });

    const f_artistic = pane.addFolder({ title: 'Artistic Controls' });
    f_artistic.addBinding(skyAtmosphere, 'horizonHaze', { min: 0, max: 2, label: 'Horizon Haze' });
    f_artistic.addBinding(skyAtmosphere, 'groundAmbient', { min: 0, max: 2, label: 'Ground Ambient' });
    const albedoProxy = {
        get color() {
            return {
                r: skyAtmosphere.groundAlbedo[0],
                g: skyAtmosphere.groundAlbedo[1],
                b: skyAtmosphere.groundAlbedo[2]
            };
        },
        set color(v) {
            skyAtmosphere.groundAlbedo = [v.r, v.g, v.b];
        }
    };
    f_artistic.addBinding(albedoProxy, 'color', { label: 'Ground Albedo', color: { type: 'float' } });
};
