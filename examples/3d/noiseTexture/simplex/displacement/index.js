import * as RedGPU from "../../../../../dist/index.js?t=1781134103100";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781134103100";

/**
 * [KO] Simplex Noise (Displacement) 예제
 * [EN] Simplex Noise (Displacement) example
 *
 * [KO] 심플렉스 노이즈를 사용하여 디스플레이스먼트 맵 효과를 구현하는 방법을 보여줍니다.
 * [EN] Demonstrates how to implement displacement mapping effects using Simplex noise.
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
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 커스텀 심플렉스 노이즈 디스플레이스먼트 맵 설정
        // [EN] Configure Custom Simplex Noise Displacement Map
        const geometry = new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 1040, 1040);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);

        material.displacementTexture = new RedGPU.Resource.SimplexTexture(redGPUContext, 1024, 1024, {
            // [KO] 쉐이더 메인 로직 커스텀 정의 (애니메이션 및 강도 계산)
            // [EN] Custom definition of shader main logic (Animation and strength calculation)
            mainLogic: `
					let uv = vec2<f32>(
						(base_uv.x + uniforms.time * ( uniforms.animationX * uniforms.animationSpeed )) , 
						(base_uv.y + uniforms.time * ( uniforms.animationY * uniforms.animationSpeed )) 
					);
					let noiseValue = getSimplexNoiseByDimension(uv, uniforms);
					let displacement = (noiseValue - 0.5) * uniforms.strength;
					let normalizedDisplacement = clamp(displacement * 0.5 + 0.5, 0.0, 1.0);
					let finalColor = vec4<f32>(normalizedDisplacement, normalizedDisplacement, normalizedDisplacement, 1.0);
			`,
            // [KO] 커스텀 유니폼 구조체 정의
            // [EN] Custom uniform struct definition
            uniformStruct: `
				strength: f32,
			`,
            // [KO] 초기 유니폼 값 설정
            // [EN] Setup initial uniform values
            uniformDefaults: {
                strength: 2.0
            }
        });

        material.color.setColorByHEX('#0a3a0a')

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.primitiveState.cullMode = 'none';
        mesh.setPosition(0, 0, 0);
        scene.addChild(mesh);

        const testData = {useAnimation: true};

        // 4. [KO] 렌더러 시작 및 애니메이션 루프 정의
        // [EN] Start Renderer and Define Animation Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (testData.useAnimation && material.displacementTexture) {
                material.displacementTexture.time += 10;
            }
        });

        // 5. [KO] 테스트 GUI 구성
        // [EN] Configure Test GUI
        new RedGPUExampleHelper(redGPUContext, {
            gui: (pane) => {
                const targetNoiseTexture = material.displacementTexture;

                // [KO] 프리셋 데이터 정의
                // [EN] Define Preset Data
                const PRESETS = [
                    {
                        title: '🏔️ Mountain Peaks',
                        values: {
                            frequency: 3.0,
                            amplitude: 2.5,
                            octaves: 6,
                            persistence: 0.65,
                            lacunarity: 2.0,
                            seed: 42
                        },
                        uniforms: {strength: 2.5}
                    },
                    {
                        title: '🌊 Ocean Waves',
                        values: {
                            frequency: 6.0,
                            amplitude: 1.8,
                            octaves: 4,
                            persistence: 0.4,
                            lacunarity: 2.5,
                            seed: 123
                        },
                        uniforms: {strength: 1.8}
                    },
                    {
                        title: '🌋 Lava Flow',
                        values: {
                            frequency: 4.0,
                            amplitude: 3.0,
                            octaves: 5,
                            persistence: 0.8,
                            lacunarity: 1.8,
                            seed: 999
                        },
                        uniforms: {strength: 3.0}
                    },
                    {
                        title: '👤 Facial Features',
                        values: {
                            frequency: 12.0,
                            amplitude: 0.8,
                            octaves: 4,
                            persistence: 0.5,
                            lacunarity: 2.2,
                            seed: 666
                        },
                        uniforms: {strength: 0.8}
                    },
                    {
                        title: '🪨 Rock Formation',
                        values: {
                            frequency: 5.0,
                            amplitude: 2.2,
                            octaves: 4,
                            persistence: 0.6,
                            lacunarity: 3.0,
                            seed: 777
                        },
                        uniforms: {strength: 2.2}
                    },
                    {
                        title: '🏜️ Sand Waves',
                        values: {
                            frequency: 2.5,
                            amplitude: 1.5,
                            octaves: 3,
                            persistence: 0.7,
                            lacunarity: 1.5,
                            seed: 333
                        },
                        uniforms: {strength: 1.5}
                    },
                    {
                        title: '🪸 Coral Spikes',
                        values: {
                            frequency: 15.0,
                            amplitude: 1.2,
                            octaves: 6,
                            persistence: 0.85,
                            lacunarity: 2.8,
                            seed: 555
                        },
                        uniforms: {strength: 1.2}
                    },
                    {
                        title: '🌳 Tree Trunk',
                        values: {
                            frequency: 8.0,
                            amplitude: 1.0,
                            octaves: 5,
                            persistence: 0.6,
                            lacunarity: 2.1,
                            seed: 888
                        },
                        uniforms: {strength: 1.0}
                    },
                    {
                        title: '🏗️ Concrete Cracks',
                        values: {
                            frequency: 20.0,
                            amplitude: 0.4,
                            octaves: 3,
                            persistence: 0.8,
                            lacunarity: 3.5,
                            seed: 111
                        },
                        uniforms: {strength: 0.4}
                    },
                    {
                        title: '🪙 Hammered Metal',
                        values: {
                            frequency: 25.0,
                            amplitude: 0.6,
                            octaves: 4,
                            persistence: 0.4,
                            lacunarity: 2.8,
                            seed: 222
                        },
                        uniforms: {strength: 0.6}
                    },
                    {
                        title: '🧊 Ice Formations',
                        values: {
                            frequency: 7.0,
                            amplitude: 2.8,
                            octaves: 4,
                            persistence: 0.7,
                            lacunarity: 2.0,
                            seed: 444
                        },
                        uniforms: {strength: 2.8}
                    },
                    {
                        title: '🍄 Mushroom Caps',
                        values: {
                            frequency: 10.0,
                            amplitude: 1.4,
                            octaves: 3,
                            persistence: 0.6,
                            lacunarity: 1.9,
                            seed: 666
                        },
                        uniforms: {strength: 1.4}
                    },
                    {
                        title: '🌪️ Tornado Swirl',
                        values: {
                            frequency: 4.0,
                            amplitude: 4.0,
                            octaves: 5,
                            persistence: 0.9,
                            lacunarity: 1.6,
                            seed: 777
                        },
                        uniforms: {strength: 4.0}
                    },
                    {
                        title: '🦴 Bone Structure',
                        values: {
                            frequency: 18.0,
                            amplitude: 0.8,
                            octaves: 4,
                            persistence: 0.5,
                            lacunarity: 2.4,
                            seed: 999
                        },
                        uniforms: {strength: 0.8}
                    },
                    {
                        title: '🌍 Planet Surface',
                        values: {
                            frequency: 1.5,
                            amplitude: 5.0,
                            octaves: 7,
                            persistence: 0.7,
                            lacunarity: 2.2,
                            seed: 1234
                        },
                        uniforms: {strength: 5.0}
                    },
                    {
                        title: '🔥 Fire Distortion',
                        values: {
                            frequency: 30.0,
                            amplitude: 0.5,
                            octaves: 2,
                            persistence: 0.3,
                            lacunarity: 4.0,
                            seed: 555
                        },
                        uniforms: {strength: 0.5}
                    },
                ];

                // [KO] 프리셋 버튼 동적 생성
                // [EN] Dynamic Generation of Preset Buttons
                const f_presets = pane.addFolder({title: 'Presets', expanded: true});
                PRESETS.forEach(item => {
                    f_presets.addButton({title: item.title}).on('click', () => {
                        Object.assign(targetNoiseTexture, item.values);
                        if (item.uniforms) {
                            for (const key in item.uniforms) targetNoiseTexture.updateUniform(key, item.uniforms[key]);
                        }
                        pane.refresh();
                    });
                });

                // [KO] 파라미터 제어 섹션
                // [EN] Parameter Control Section
                const f_params = pane.addFolder({title: 'Parameters', expanded: true});
                f_params.addBinding(targetNoiseTexture, 'frequency', {min: 0, max: 30, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'amplitude', {min: 0, max: 10, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'octaves', {min: 1, max: 8, step: 1});
                f_params.addBinding(targetNoiseTexture, 'persistence', {min: 0, max: 1, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'lacunarity', {min: 0, max: 10, step: 0.01});
                f_params.addBinding(targetNoiseTexture, 'seed', {min: 0, max: 1000, step: 0.01});

                // [KO] 커스텀 유니폼(Strength) 제어
                // [EN] Custom Uniform (Strength) Control
                f_params.addBinding({strength: targetNoiseTexture.getUniform('strength')}, 'strength', {
                    min: 0,
                    max: 5,
                    step: 0.01
                }).on('change', (ev) => {
                    targetNoiseTexture.updateUniform('strength', ev.value);
                });
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