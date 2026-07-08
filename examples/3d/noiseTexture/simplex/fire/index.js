import * as RedGPU from "../../../../../dist/index.js?t=1783496184998";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1783496184998";

/**
 * [KO] Simplex Noise (Fire) 예제
 * [EN] Simplex Noise (Fire) example
 *
 * [KO] 심플렉스 노이즈를 사용하여 불꽃 효과를 생성하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create fire effects using Simplex noise.
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

        // 3. [KO] 커스텀 불꽃 효과 노이즈 텍스처 설정
        // [EN] Configure Custom Fire Effect Noise Texture
        const geometry = new RedGPU.Primitive.Plane(redGPUContext, 50, 50, 1000, 1000);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);

        material.diffuseTexture = new RedGPU.Resource.SimplexTexture(redGPUContext, 1024, 1024, {
            // [KO] 불꽃 모양 및 움직임을 시뮬레이션하는 복합 쉐이더 메인 로직
            // [EN] Complex shader main logic simulating flame shape and movement
            mainLogic: `
				let flame_uv = vec2<f32>(
					base_uv.x + sin(uniforms.time * uniforms.flickerSpeed + base_uv.y * 5.0) * uniforms.turbulence,
					base_uv.y + uniforms.time * uniforms.fireSpeed 
				);

				let main_noise = getSimplexNoiseByDimension(flame_uv, uniforms);

				let detail_factor = base_uv.y * 0.8;
				let detail_uv = vec2<f32>(
					base_uv.x * 2.0 + sin(uniforms.time * 3.0 + base_uv.y * 8.0) * 0.05 * detail_factor,
					base_uv.y * 1.5 + uniforms.time * uniforms.fireSpeed * 0.8
				);
				let detail_noise = getSimplexNoiseByDimension(detail_uv, uniforms) * 0.3;

				let flame_shape = smoothstep(1.0 - uniforms.fireHeight, 1.0, base_uv.y);

				let combined_noise = main_noise + detail_noise;
				let fire_intensity = combined_noise * flame_shape * uniforms.fireIntensity;

				let flame_heat = fire_intensity * (1.2 - base_uv.y * 0.5);

				let inner_flame = vec3<f32>(1.0, 0.8, 0.2);
				let outer_flame = vec3<f32>(1.0, 0.4, 0.1);
				let flame_edge = vec3<f32>(0.6, 0.1, 0.0);

				var fire_color: vec3<f32>;
				if (flame_heat > 0.6) {
					fire_color = mix(outer_flame, inner_flame, (flame_heat - 0.6) / 0.4);
				} else if (flame_heat > 0.2) {
					fire_color = mix(flame_edge, outer_flame, (flame_heat - 0.2) / 0.4);
				} else {
					fire_color = flame_edge * (flame_heat / 0.2);
				}

				let alpha = clamp(fire_intensity, 0.0, 1.0);
				let finalColor = vec4<f32>(fire_color, alpha);
			`,
            // [KO] 불꽃 제어를 위한 전용 유니폼 구조체 정의
            // [EN] Dedicated uniform struct for fire control
            uniformStruct: `
				fireHeight: f32,
				fireIntensity: f32,
				flickerSpeed: f32,
				turbulence: f32,
				fireSpeed: f32,
			`,
            // [KO] 초기 파라미터 기본값 설정
            // [EN] Setup initial parameter defaults
            uniformDefaults: {
                fireHeight: 1,
                fireIntensity: 1.2,
                flickerSpeed: 1.0,
                turbulence: 0.1,
                fireSpeed: 0.8
            }
        });

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(0, 0, 0);
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

                // [KO] 불꽃 프리셋 데이터 정의
                // [EN] Define Fire Preset Data
                const PRESETS = [
                    {title: '🕯️ Candle Flame',
                        values: {
                            frequency: 3.5,
                            amplitude: 0.7,
                            octaves: 3,
                            persistence: 0.35,
                            lacunarity: 1.9,
                            seed: 101
                        },
                        uniforms: {
                            fireHeight: 0.6,
                            fireIntensity: 0.8,
                            flickerSpeed: 1.8,
                            turbulence: 0.04,
                            fireSpeed: 0.5
                        }
                    },
                    {title: '🔥 Torch Fire',
                        values: {
                            frequency: 5.5,
                            amplitude: 1.0,
                            octaves: 4,
                            persistence: 0.45,
                            lacunarity: 2.0,
                            seed: 202
                        },
                        uniforms: {
                            fireHeight: 0.75,
                            fireIntensity: 1.1,
                            flickerSpeed: 2.5,
                            turbulence: 0.08,
                            fireSpeed: 0.8
                        }
                    },
                    {title: '🌋 Volcano Fire',
                        values: {
                            frequency: 7.0,
                            amplitude: 1.4,
                            octaves: 5,
                            persistence: 0.65,
                            lacunarity: 2.3,
                            seed: 303
                        },
                        uniforms: {
                            fireHeight: 0.85,
                            fireIntensity: 1.6,
                            flickerSpeed: 4.0,
                            turbulence: 0.18,
                            fireSpeed: 1.2
                        }
                    },
                    {title: '🔥 Campfire',
                        values: {
                            frequency: 4.8,
                            amplitude: 0.9,
                            octaves: 4,
                            persistence: 0.5,
                            lacunarity: 2.1,
                            seed: 404
                        },
                        uniforms: {
                            fireHeight: 0.68,
                            fireIntensity: 1.0,
                            flickerSpeed: 2.2,
                            turbulence: 0.07,
                            fireSpeed: 0.7
                        }
                    },
                    {title: '🔥 Dragon Breath',
                        values: {
                            frequency: 9.0,
                            amplitude: 1.8,
                            octaves: 6,
                            persistence: 0.7,
                            lacunarity: 2.5,
                            seed: 505
                        },
                        uniforms: {
                            fireHeight: 0.9,
                            fireIntensity: 2.2,
                            flickerSpeed: 5.5,
                            turbulence: 0.25,
                            fireSpeed: 1.8
                        }
                    },
                    {title: '🌙 Spirit Fire',
                        values: {
                            frequency: 2.8,
                            amplitude: 0.6,
                            octaves: 2,
                            persistence: 0.3,
                            lacunarity: 1.7,
                            seed: 606
                        },
                        uniforms: {
                            fireHeight: 0.55,
                            fireIntensity: 0.7,
                            flickerSpeed: 1.2,
                            turbulence: 0.03,
                            fireSpeed: 0.3
                        }
                    },
                    {title: '⚡ Lightning Fire',
                        values: {
                            frequency: 12.0,
                            amplitude: 1.5,
                            octaves: 3,
                            persistence: 0.8,
                            lacunarity: 3.0,
                            seed: 707
                        },
                        uniforms: {
                            fireHeight: 0.8,
                            fireIntensity: 1.8,
                            flickerSpeed: 8.0,
                            turbulence: 0.15,
                            fireSpeed: 2.5
                        }
                    },
                    {title: '🍃 Gentle Breeze',
                        values: {
                            frequency: 3.0,
                            amplitude: 0.5,
                            octaves: 2,
                            persistence: 0.25,
                            lacunarity: 1.6,
                            seed: 808
                        },
                        uniforms: {
                            fireHeight: 0.5,
                            fireIntensity: 0.6,
                            flickerSpeed: 1.0,
                            turbulence: 0.02,
                            fireSpeed: 0.4
                        }
                    },
                ];

                // [KO] 프리셋 버튼 동적 생성
                // [EN] Dynamic Generation of Preset Buttons
                const f_presets = pane.addFolder({title: 'Fire Presets', expanded: true});
                PRESETS.forEach(item => {
                    f_presets.addButton({title: item.title}).on('click', () => {
                        Object.assign(targetNoiseTexture, item.values);
                        if (item.uniforms) {
                            for (const key in item.uniforms) targetNoiseTexture.updateUniform(key, item.uniforms[key]);
                        }
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

                // [KO] 불꽃 전용 설정 및 커스텀 유니폼 제어
                // [EN] Fire Specific Settings and Custom Uniform Controls
                const f_fire = pane.addFolder({title: 'Fire Settings', expanded: true});
                const FIRE_CONFIG = {
                    fireHeight: {min: 0, max: 1, step: 0.01},
                    fireIntensity: {min: 0, max: 3, step: 0.01},
                    flickerSpeed: {min: 0, max: 10, step: 0.1},
                    turbulence: {min: 0, max: 0.5, step: 0.01},
                    fireSpeed: {min: 0, max: 2, step: 0.01}
                };
                Object.keys(FIRE_CONFIG).forEach(key => {
                    f_fire.addBinding({[key]: targetNoiseTexture.getUniform(key)}, key, FIRE_CONFIG[key]).on('change', (ev) => {
                        targetNoiseTexture.updateUniform(key, ev.value);
                    });
                });

                // [KO] 애니메이션 제어
                // [EN] Animation Controls
                const f_animation = pane.addFolder({title: 'Animation', expanded: true});
                f_animation.addBinding(testData, 'useAnimation');
            }
        });
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);