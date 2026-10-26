import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Spot Light & glTF 상호작용 예제
 * [EN] Spot Light & glTF Interaction example
 *
 * [KO] 현대적인 각도 감쇄 수식이 적용된 Spot Light가 glTF PBR 모델과 어떻게 상호작용하는지 시연합니다.
 * [EN] Demonstrates how Spot Light with modern angle attenuation formula interacts with a glTF PBR model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 14;
        controller.tilt = -25;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr', 10000);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // [KO] 스포트라이트 생성 및 glTF 모델(3x3 그리드) 배치
        // [EN] Create SpotLight and arrange glTF models (3x3 grid)
        const light = createSpotLight(scene);

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

const createSpotLight = (scene) => {
    const light = new RedGPU.Light.SpotLight('#00ffff', 350000);
    light.setPosition(0, 6, 0);
    light.lookAt(0, 0, 0);
    light.radius = 10;
    light.innerCutoff = 18;
    light.outerCutoff = 38;
    light.enableDebugger = true;
    scene.lightManager.addSpotLight(light);
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
                    max: 100000,
                    step: 100
                });
            }

            const lightFolder = pane.addFolder({title: 'SpotLight Control', expanded: true});
            lightFolder.addBinding(config, 'color', {picker: 'inline', view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            lightFolder.addBinding(light, 'lumen', {min: 0, max: 1000000, step: 1000});
            lightFolder.addBinding(light, 'radius', {min: 0, max: 100, step: 1});
            lightFolder.addBinding(light, 'enableDebugger');

            const coneFolder = lightFolder.addFolder({title: 'Cone Settings', expanded: true});
            coneFolder.addBinding(light, 'innerCutoff', {min: 0, max: 90, step: 0.1}).on('change', () => {
                if (light.innerCutoff > light.outerCutoff) light.outerCutoff = light.innerCutoff;
                pane.refresh();
            });
            coneFolder.addBinding(light, 'outerCutoff', {min: 0, max: 90, step: 0.1}).on('change', () => {
                if (light.outerCutoff < light.innerCutoff) light.innerCutoff = light.outerCutoff;
                pane.refresh();
            });

            const transformFolder = lightFolder.addFolder({title: 'Transform', expanded: true});
            transformFolder.addBinding(light, 'x', {min: -20, max: 20, step: 0.1}).on('change', () => pane.refresh());
            transformFolder.addBinding(light, 'y', {min: -5, max: 30, step: 0.1}).on('change', () => pane.refresh());
            transformFolder.addBinding(light, 'z', {min: -20, max: 20, step: 0.1}).on('change', () => pane.refresh());

            const dirFolder = lightFolder.addFolder({title: 'Direction Vector', expanded: false});
            dirFolder.addBinding(light, 'directionX', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionY', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionZ', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
        }
    });
};
