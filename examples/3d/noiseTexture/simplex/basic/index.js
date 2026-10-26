import * as RedGPU from "../../../../../dist/index.js?t=1784264851335";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1784264851335";

/**
 * [KO] Simplex Noise (Basic) 예제
 * [EN] Simplex Noise (Basic) example
 *
 * [KO] 심플렉스 노이즈 텍스처를 생성하고 파라미터를 조절하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Simplex noise texture and adjust its parameters.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 및 컨트롤러 설정
        // [EN] Setup Camera and Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 55;
        controller.speedDistance = 2;

        // 2. [KO] 씬 및 조명 구성
        // [EN] Configure Scene and Lighting
        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.intensity = 2;
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 심플렉스 노이즈 텍스처가 적용된 지면 메시 생성
        // [EN] Create Ground Mesh with Simplex Noise Texture applied
        const geometry = new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 1000, 1000);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = new RedGPU.Resource.SimplexTexture(redGPUContext);

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        scene.addChild(mesh);

        const testData = {useAnimation: true};

        // 4. [KO] 렌더러 시작 및 애니메이션 루프 정의
        // [EN] Start Renderer and Define Animation Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (testData.useAnimation && material.diffuseTexture) {
                material.diffuseTexture.time = time;
            }
        });

        // 5. [KO] 테스트 GUI 구성
        // [EN] Configure Test GUI
        new RedGPUExampleHelper(redGPUContext, {
            gui: (pane) => {
                const targetNoiseTexture = material.diffuseTexture;

                // [KO] 프리셋 데이터 정의
                // [EN] Define Preset Data
                const PRESETS = [
                    {title: '🏔️ Mountains',
                        values: {
                            frequency: 4.0,
                            amplitude: 1.5,
                            octaves: 6,
                            persistence: 0.6,
                            lacunarity: 2.0,
                            seed: 42
                        }
                    },
                    {title: '🌊 Waves',
                        values: {
                            frequency: 8.0,
                            amplitude: 0.8,
                            octaves: 3,
                            persistence: 0.4,
                            lacunarity: 2.5,
                            seed: 123
                        }
                    },
                    {title: '🌋 Crater',
                        values: {
                            frequency: 2.0,
                            amplitude: 2.0,
                            octaves: 4,
                            persistence: 0.8,
                            lacunarity: 1.8,
                            seed: 999
                        }
                    },
                    {title: '👴 Wrinkles',
                        values: {
                            frequency: 12.0,
                            amplitude: 0.6,
                            octaves: 5,
                            persistence: 0.7,
                            lacunarity: 2.2,
                            seed: 666
                        }
                    },
                    {title: '🪨 Cobblestone',
                        values: {
                            frequency: 15.0,
                            amplitude: 1.0,
                            octaves: 2,
                            persistence: 0.3,
                            lacunarity: 3.0,
                            seed: 777
                        }
                    },
                    {title: '🏜️ Dunes',
                        values: {
                            frequency: 3.0,
                            amplitude: 1.2,
                            octaves: 4,
                            persistence: 0.5,
                            lacunarity: 1.5,
                            seed: 333
                        }
                    },
                    {title: '🪸 Coral',
                        values: {
                            frequency: 20.0,
                            amplitude: 0.7,
                            octaves: 7,
                            persistence: 0.8,
                            lacunarity: 2.8,
                            seed: 555
                        }
                    },
                    {title: '🌳 Bark',
                        values: {
                            frequency: 6.0,
                            amplitude: 1.3,
                            octaves: 5,
                            persistence: 0.6,
                            lacunarity: 2.1,
                            seed: 888
                        }
                    },
                ];

                // [KO] 프리셋 버튼 동적 생성
                // [EN] Dynamic Generation of Preset Buttons
                const f_presets = pane.addFolder({title: 'Presets', expanded: true});
                PRESETS.forEach(item => {
                    f_presets.addButton({title: item.title}).on('click', () => {
                        Object.assign(targetNoiseTexture, item.values);
                        pane.refresh();
                    });
                });

                // [KO] 노이즈 기본 파라미터 제어
                // [EN] Noise Basic Parameter Controls
                const f_params = pane.addFolder({title: 'Parameters', expanded: true});
                f_params.addBinding(targetNoiseTexture, 'frequency', {min: 0, max: 30, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'amplitude', {min: 0, max: 10, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'octaves', {min: 1, max: 8, step: 1});
                f_params.addBinding(targetNoiseTexture, 'persistence', {min: 0, max: 1, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'lacunarity', {min: 0, max: 10, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'seed', {min: 0, max: 1000, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'noiseDimension', {options: RedGPU.Resource.NOISE_DIMENSION});

                // [KO] 애니메이션 설정
                // [EN] Animation Settings
                const f_animation = pane.addFolder({title: 'Animation', expanded: true});
                f_animation.addBinding(testData, 'useAnimation');
                f_animation.addBinding(targetNoiseTexture, 'animationSpeed', {min: 0, max: 1, step: 0.001});
                f_animation.addBinding(targetNoiseTexture, 'animationX', {min: -1, max: 1, step: 0.001});
                f_animation.addBinding(targetNoiseTexture, 'animationY', {min: -1, max: 1, step: 0.001});
            }
        });
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);