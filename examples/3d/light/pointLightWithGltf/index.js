import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Point Light & glTF 상호작용 예제
 * [EN] Point Light & glTF Interaction example
 *
 * [KO] 현대적인 감쇄(Attenuation) 수식이 적용된 Point Light가 glTF PBR 모델과 어떻게 상호작용하는지 시연합니다.
 * [EN] Demonstrates how Point Light with modern attenuation formula interacts with a glTF PBR model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;
        controller.tilt = -25;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr', 10000);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // [KO] 포인트 라이트 생성 및 glTF 모델(3x3 그리드) 배치
        // [EN] Create PointLight and arrange glTF models (3x3 grid)
        const light = createPointLight(scene);

        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
        const gridSize = 3;
        const spacing = 3;

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                new RedGPU.GLTFLoader(
                    redGPUContext,
                    modelUrl,
                    (result) => {
                        const mesh = result.resultMesh;
                        const x = col * spacing - ((gridSize - 1) * spacing) / 2;
                        const z = row * spacing - ((gridSize - 1) * spacing) / 2;
                        mesh.setPosition(x, 0, z);
                        scene.addChild(mesh);
                    },
                    RedGPUExampleHelper.loadingProgressInfoHandler
                );
            }
        }

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view, light);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPointLight = (scene) => {
    const light = new RedGPU.Light.PointLight('#ff00ff', 180000);
    light.setPosition(0, 3.5, 0);
    light.radius = 10;
    light.enableDebugger = true;
    scene.lightManager.addPointLight(light);
    return light;
};

const renderTestPane = (redGPUContext, view, light) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const config = {
                showSkybox: true,
                color: {r: light.color.r, g: light.color.g, b: light.color.b}
            };

            const lightingFolder = pane.addFolder({title: 'Environment Settings', expanded: true});
            lightingFolder.addBinding(config, 'showSkybox').on('change', (ev) => {
                if (ev.value) {
                    if (!view.skybox && view.ibl) {
                        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, view.ibl.environmentTexture);
                    }
                } else {
                    view.skybox = null;
                }
            });

            if (view.ibl) {
                lightingFolder.addBinding(view.ibl, 'luminance', {
                    min: 0,
                    max: 30000,
                    step: 1
                });
            }

            const lightFolder = pane.addFolder({title: 'PointLight Control', expanded: true});
            lightFolder.addBinding(config, 'color', {picker: 'inline', view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            lightFolder.addBinding(light, 'lumen', {min: 0, max: 1000000, step: 1000});
            lightFolder.addBinding(light, 'radius', {min: 0, max: 100, step: 1});
            lightFolder.addBinding(light, 'enableDebugger');

            const transformFolder = lightFolder.addFolder({title: 'Transform', expanded: true});
            transformFolder.addBinding(light, 'x', {min: -20, max: 20, step: 0.1});
            transformFolder.addBinding(light, 'y', {min: -5, max: 30, step: 0.1});
            transformFolder.addBinding(light, 'z', {min: -20, max: 20, step: 0.1});
        }
    });
};
