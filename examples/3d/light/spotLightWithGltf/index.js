import * as RedGPU from "../../../../dist/index.js?t=1781137785306";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781137785306";

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
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.speedDistance = 0.1;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 환경 및 라이트 설정
        // [EN] Configure Environment and Light
        
        // [KO] IBL 및 스카이박스 설정 (배경 조명)
        // [EN] Setup IBL and Skybox (Background lighting)
        const iblUrl = '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr';
        const ibl = new RedGPU.Resource.IBL(redGPUContext, iblUrl, 10000);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // [KO] 스포트 라이트 생성 (직접 조명)
        // [EN] Create Spot Light (Direct lighting)
        const light = createSpotLight(scene);

        // 4. [KO] glTF 모델 로딩 및 배치 (3x3 그리드)
        // [EN] Load and Arrange glTF Models (3x3 Grid)
        const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
        const gridSize = 3;
        const spacing = 5;

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
                        
                        // [KO] 중앙 메시를 기준으로 카메라 초점 맞춤
                        // [EN] Fit camera focus based on the center mesh
                        if(row === 1 && col === 1) RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
                    },
                    RedGPUExampleHelper.loadingProgressInfoHandler
                );
            }
        }

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, view, light);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 스포트 라이트를 생성하고 초기화합니다.
 * [EN] Creates and initializes a spot light.
 */
const createSpotLight = (scene) => {
    // [KO] 조명 효과를 극대화하기 위해 낮은 높이와 강한 광량으로 설정
    // [EN] Set low height and high intensity to maximize the lighting effect
    const light = new RedGPU.Light.SpotLight('#00ffff', 450000);
    light.setPosition(0, 3, 0);
    light.lookAt(0, 0, 0);
    light.radius = 40;
    light.innerCutoff = 10;
    light.outerCutoff = 35;
    light.enableDebugger = true;
    scene.lightManager.addSpotLight(light);
    return light;
};

/**
 * [KO] 실시간 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time control.
 */
const renderTestPane = (redGPUContext, view, light) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const config = {
                showSkybox: true,
                color: {r: light.color.r, g: light.color.g, b: light.color.b}
            };

            const lightingFolder = pane.addFolder({title: 'Environment Settings', expanded: true});
            
            // [KO] 환경 설정 (스카이박스 및 IBL)
            // [EN] Environment Settings (Skybox and IBL)
            lightingFolder.addBinding(config, 'showSkybox', {
                label: 'showSkybox'
            }).on('change', (ev) => {
                if (ev.value) {
                    if (!view.skybox && view.ibl) {
                        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, view.ibl.environmentTexture);
                    }
                } else {
                    view.skybox = null;
                }
            });
            
            // [KO] IBL 조도 제어 (Luminance)
            // [EN] IBL Illuminance Control (Luminance)
            if (view.ibl) {
                lightingFolder.addBinding(view.ibl, 'luminance', {
                    min: 0,
                    max: 100000,
                    step: 100
                });
            }

            // [KO] 스포트 라이트 제어
            // [EN] Spot Light Control
            const lightFolder = pane.addFolder({title: 'SpotLight Control', expanded: true});
            
            // [KO] 기본 속성 바인딩
            // [EN] Native property bindings
            lightFolder.addBinding(config, 'color', {picker: 'inline', view: 'color', label: 'color'}).on('change', (evt) => {
                const {r, g, b} = evt.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            
            lightFolder.addBinding(light, 'lumen', {min: 0, max: 1000000, step: 1000});
            lightFolder.addBinding(light, 'radius', {min: 0, max: 100, step: 1});

            // [KO] 스포트라이트 각도 설정
            // [EN] Spotlight Cutoff Angles
            const coneFolder = lightFolder.addFolder({title: 'Cone Settings', expanded: true});
            coneFolder.addBinding(light, 'innerCutoff', {min: 0, max: 90, step: 0.1}).on('change', () => {
                if (light.innerCutoff > light.outerCutoff) light.outerCutoff = light.innerCutoff;
                pane.refresh();
            });
            coneFolder.addBinding(light, 'outerCutoff', {min: 0, max: 90, step: 0.1}).on('change', () => {
                if (light.outerCutoff < light.innerCutoff) light.innerCutoff = light.outerCutoff;
                pane.refresh();
            });
            
            // [KO] 위치 제어
            // [EN] Transform Control
            const transformFolder = lightFolder.addFolder({title: 'Transform', expanded: true});
            transformFolder.addBinding(light, 'x', {min: -20, max: 20, step: 0.1}).on('change', () => pane.refresh());
            transformFolder.addBinding(light, 'y', {min: -5, max: 30, step: 0.1}).on('change', () => pane.refresh());
            transformFolder.addBinding(light, 'z', {min: -20, max: 20, step: 0.1}).on('change', () => pane.refresh());

            // [KO] 방향 벡터 제어
            // [EN] Direction Vector Control
            const dirFolder = lightFolder.addFolder({title: 'Direction Vector', expanded: false});
            dirFolder.addBinding(light, 'directionX', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionY', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionZ', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            
            lightFolder.addBinding(light, 'enableDebugger', {label: 'enableDebugger'});
        }
    });
};
