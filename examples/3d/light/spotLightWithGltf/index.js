import * as RedGPU from "../../../../dist/index.js?t=1770713934910";
import {
    loadingProgressInfoHandler
} from '../../../exampleHelper/createExample/loadingProgressInfoHandler.js?t=1770713934910'

/**
 * [KO] Spot Light & glTF 상호작용 예제
 * [EN] Spot Light & glTF Interaction example
 *
 * [KO] 현대적인 감쇄(Attenuation) 수식이 적용된 Spot Light가 glTF PBR 모델과 어떻게 반응하는지 보여줍니다.
 * [EN] Demonstrates how Spot Light with modern attenuation formula interacts with a glTF PBR model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // IBL 설정
        const iblUrl = '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr';
        const ibl = new RedGPU.Resource.IBL(redGPUContext, iblUrl);
        view.ibl = ibl;
        
        // 스카이박스 추가
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // 광원 생성 (Spot Light)
        const light = createSpotLight(scene);

        // glTF 모델 그리드 배치 (3x3)
        const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
        const gridSize = 3;
        const spacing = 3;

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                new RedGPU.GLTFLoader(
                    redGPUContext,
                    MODEL_URL,
                    (result) => {
                        const mesh = result.resultMesh;
                        const x = col * spacing - ((gridSize - 1) * spacing) / 2;
                        const z = row * spacing - ((gridSize - 1) * spacing) / 2;
                        mesh.setPosition(x, 0, z);
                        scene.addChild(mesh);
                        
                        // 중앙 메시 기준으로 카메라 맞춤
                        if(row === 1 && col === 1) view.camera.fitMeshToScreenCenter(mesh, view);
                    },
                    loadingProgressInfoHandler
                );
            }
        }

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext, view, light);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] Spot Light를 생성합니다.
 * [EN] Creates a Spot Light.
 */
const createSpotLight = (scene) => {
    const light = new RedGPU.Light.SpotLight('#ff0000', 2);
    light.x = 0;
    light.y = 4;
    light.z = 0;
    light.directionX = 0;
    light.directionY = -1;
    light.directionZ = 0;
    light.radius = 15;
    light.innerCutoff = 10;
    light.outerCutoff = 30;
    light.enableDebugger = true;
    scene.lightManager.addSpotLight(light);
    return light;
};

/**
 * [KO] 제어 패널을 구성합니다.
 */
const renderTestPane = async (redGPUContext, view, light) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const pane = new Pane();
    const {
        setDebugButtons,
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext);
    
    // IBL 및 Lighting 폴더 구성
    const lightingFolder = pane.addFolder({title: 'Lighting Settings', expanded: true});
    
    // IBL 설정
    const iblConfig = {
        showSkybox: true
    };

    lightingFolder.addBinding(iblConfig, 'showSkybox', {
        label: 'Show Skybox'
    }).on('change', (ev) => {
        if (ev.value) {
            if (!view.skybox && view.ibl) {
                view.skybox = new RedGPU.Display.SkyBox(redGPUContext, view.ibl.environmentTexture);
            }
        } else {
            view.skybox = null;
        }
    });

    // Spot Light 설정
    const lightFolder = pane.addFolder({title: 'Spot Light', expanded: true});
    const lightConfig = {
        x: light.x,
        y: light.y,
        z: light.z,
        directionX: light.directionX,
        directionY: light.directionY,
        directionZ: light.directionZ,
        radius: light.radius,
        innerCutoff: light.innerCutoff,
        outerCutoff: light.outerCutoff,
        intensity: light.intensity,
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    lightFolder.addBinding(lightConfig, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.x = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.y = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.z = evt.value;
    });

    lightFolder.addBinding(lightConfig, 'directionX', {min: -1, max: 1, step: 0.01}).on('change', (evt) => {
        light.directionX = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'directionY', {min: -1, max: 1, step: 0.01}).on('change', (evt) => {
        light.directionY = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'directionZ', {min: -1, max: 1, step: 0.01}).on('change', (evt) => {
        light.directionZ = evt.value;
    });

    lightFolder.addBinding(lightConfig, 'intensity', {min: 0, max: 10, step: 0.1}).on('change', (evt) => {
        light.intensity = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'radius', {min: 0, max: 30, step: 0.1}).on('change', (evt) => {
        light.radius = evt.value;
    });

    lightFolder.addBinding(lightConfig, 'innerCutoff', {min: 0, max: 90, step: 0.1}).on('change', (evt) => {
        light.innerCutoff = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'outerCutoff', {min: 0, max: 90, step: 0.1}).on('change', (evt) => {
        light.outerCutoff = evt.value;
    });

    lightFolder.addBinding(light, 'enableDebugger');
    lightFolder
        .addBinding(lightConfig, 'color', {picker: 'inline', view: 'color', expanded: true})
        .on('change', (evt) => {
            const {r, g, b} = evt.value;
            light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
        });
};
