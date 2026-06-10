import * as RedGPU from "../../../../../dist/index.js?t=1781134103100";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781134103100";

/**
 * [KO] Voronoi Noise (Basic) 예제
 * [EN] Voronoi Noise (Basic) example
 *
 * [KO] 보로노이 노이즈 텍스처를 생성하고 다양한 패턴과 파라미터를 조절하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Voronoi noise texture and adjust various patterns and parameters.
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

        // 3. [KO] 보로노이 노이즈 텍스처가 적용된 지면 메시 생성
        // [EN] Create Ground Mesh with Voronoi Noise Texture applied
        const geometry = new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 1000, 1000);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = new RedGPU.Resource.VoronoiTexture(redGPUContext);

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

                // [KO] 보로노이 프리셋 데이터 정의 (값 및 메서드 호출)
                // [EN] Define Voronoi Preset Data (Values and Method Calls)
                const PRESETS = [
                    {
                        title: '🔲 Classic Cells',
                        values: {
                            frequency: 8.0,
                            distanceScale: 1.0,
                            octaves: 1,
                            persistence: 0.5,
                            lacunarity: 2.0,
                            seed: 0,
                            jitter: 1.0
                        },
                        calls: ['setEuclideanDistance', 'setF1Output']
                    },
                    {
                        title: '🕸️ Crack Pattern',
                        values: {
                            frequency: 12.0,
                            distanceScale: 2.0,
                            octaves: 2,
                            persistence: 0.4,
                            lacunarity: 2.5,
                            seed: 123,
                            jitter: 0.8
                        },
                        calls: ['setEuclideanDistance', 'setCrackPattern']
                    },
                    {
                        title: '🎨 Stained Glass',
                        values: {
                            frequency: 6.0,
                            distanceScale: 1.0,
                            octaves: 1,
                            persistence: 0.5,
                            lacunarity: 2.0,
                            seed: 42,
                            jitter: 0.7,
                            cellIdColorIntensity: 0.8
                        },
                        calls: ['setEuclideanDistance', 'setCellIdColorOutput']
                    },
                    {
                        title: '🗺️ Biome Map',
                        values: {
                            frequency: 4.0,
                            distanceScale: 1.0,
                            octaves: 1,
                            persistence: 0.5,
                            lacunarity: 2.0,
                            seed: 100,
                            jitter: 0.8
                        },
                        calls: ['setEuclideanDistance', 'setCellIdOutput']
                    },
                    {
                        title: '🌈 Colorful Mosaic',
                        values: {
                            frequency: 15.0,
                            distanceScale: 1.0,
                            octaves: 1,
                            persistence: 0.5,
                            lacunarity: 2.0,
                            seed: 777,
                            cellIdColorIntensity: 1.0,
                            jitter: 0.3
                        },
                        calls: ['setManhattanDistance', 'setCellIdColorOutput']
                    },
                    {
                        title: '🏺 Ceramic Tiles',
                        values: {
                            frequency: 15.0,
                            distanceScale: 1.5,
                            octaves: 1,
                            persistence: 0.3,
                            lacunarity: 2.0,
                            seed: 456,
                            jitter: 0.6
                        },
                        calls: ['setManhattanDistance', 'setF1Output']
                    },
                    {
                        title: '🎲 Circuit Board',
                        values: {
                            frequency: 20.0,
                            distanceScale: 1.2,
                            octaves: 3,
                            persistence: 0.6,
                            lacunarity: 2.2,
                            seed: 789,
                            jitter: 0.4
                        },
                        calls: ['setChebyshevDistance', 'setF2Output']
                    },
                    {
                        title: '🪨 Stone Wall',
                        values: {
                            frequency: 6.0,
                            distanceScale: 2.5,
                            octaves: 4,
                            persistence: 0.7,
                            lacunarity: 1.8,
                            seed: 999,
                            jitter: 0.9
                        },
                        calls: ['setEuclideanDistance', 'setSmoothBlend']
                    },
                    {
                        title: '🧊 Ice Crystals',
                        values: {
                            frequency: 10.0,
                            distanceScale: 1.8,
                            octaves: 2,
                            persistence: 0.5,
                            lacunarity: 3.0,
                            seed: 333,
                            jitter: 0.2
                        },
                        calls: ['setEuclideanDistance', 'setF2Output']
                    },
                    {
                        title: '🌐 Honeycomb',
                        values: {
                            frequency: 25.0,
                            distanceScale: 0.8,
                            octaves: 1,
                            persistence: 0.3,
                            lacunarity: 2.0,
                            seed: 666,
                            jitter: 0.1
                        },
                        calls: ['setEuclideanDistance', 'setCrackPattern']
                    },
                    {
                        title: '🗿 Volcanic Rock',
                        values: {
                            frequency: 4.0,
                            distanceScale: 3.0,
                            octaves: 5,
                            persistence: 0.8,
                            lacunarity: 2.1,
                            seed: 555,
                            jitter: 1.0
                        },
                        calls: ['setManhattanDistance', 'setSmoothBlend']
                    },
                ];

                // [KO] 프리셋 버튼 동적 생성
                // [EN] Dynamic Generation of Preset Buttons
                const f_presets = pane.addFolder({title: 'Voronoi Presets', expanded: true});
                PRESETS.forEach(item => {
                    f_presets.addButton({title: item.title}).on('click', () => {
                        Object.assign(targetNoiseTexture, item.values);
                        if (item.calls) item.calls.forEach(method => targetNoiseTexture[method]());
                        pane.refresh();
                    });
                });

                // [KO] 기본 노이즈 파라미터 제어
                // [EN] Noise Basic Parameter Controls
                const f_basic = pane.addFolder({title: 'Basic Parameters', expanded: true});
                f_basic.addBinding(targetNoiseTexture, 'frequency', {min: 0.1, max: 50, step: 0.1});
                f_basic.addBinding(targetNoiseTexture, 'distanceScale', {min: 0.1, max: 5, step: 0.01});
                f_basic.addBinding(targetNoiseTexture, 'octaves', {min: 1, max: 8, step: 1});
                f_basic.addBinding(targetNoiseTexture, 'persistence', {min: 0, max: 1, step: 0.01});
                f_basic.addBinding(targetNoiseTexture, 'lacunarity', {min: 1, max: 5, step: 0.01});
                f_basic.addBinding(targetNoiseTexture, 'seed', {min: 0, max: 1000, step: 1});

                // [KO] 보로노이 특화 파라미터 설정
                // [EN] Voronoi Specific Parameter Settings
                const f_voronoi = pane.addFolder({title: 'Voronoi Specific', expanded: true});
                f_voronoi.addBinding(targetNoiseTexture, 'distanceType', {
                    options: {
                        'Euclidean (원형)': RedGPU.Resource.VORONOI_DISTANCE_TYPE.EUCLIDEAN,
                        'Manhattan (다이아몬드)': RedGPU.Resource.VORONOI_DISTANCE_TYPE.MANHATTAN,
                        'Chebyshev (사각형)': RedGPU.Resource.VORONOI_DISTANCE_TYPE.CHEBYSHEV
                    }
                });
                f_voronoi.addBinding(targetNoiseTexture, 'outputType', {
                    options: {
                        'F1 (첫번째 거리)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.F1,
                        'F2 (두번째 거리)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.F2,
                        'F2-F1 (크랙 패턴)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.F2_MINUS_F1,
                        'F1+F2 (블렌딩)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.F1_PLUS_F2,
                        'Cell ID (셀 ID)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.CELL_ID,
                        'Cell ID Color (컬러 셀 ID)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.CELL_ID_COLOR
                    }
                });
                f_voronoi.addBinding(targetNoiseTexture, 'jitter', {min: 0, max: 1, step: 0.01});
                f_voronoi.addBinding(targetNoiseTexture, 'cellIdColorIntensity', {
                    min: 0.1,
                    max: 2.0,
                    step: 0.01,
                    label: 'Color Intensity'
                });

                // [KO] 유틸리티 및 퀵 액션 설정
                // [EN] Utilities and Quick Actions Setup
                const f_utils = pane.addFolder({title: 'Quick Actions'});
                const f_dist = f_utils.addFolder({title: 'Distance Types'});
                f_dist.addButton({title: '🔵 Euclidean'}).on('click', () => {
                    targetNoiseTexture.setEuclideanDistance();
                    pane.refresh();
                });
                f_dist.addButton({title: '💎 Manhattan'}).on('click', () => {
                    targetNoiseTexture.setManhattanDistance();
                    pane.refresh();
                });
                f_dist.addButton({title: '🪲 Chebyshev'}).on('click', () => {
                    targetNoiseTexture.setChebyshevDistance();
                    pane.refresh();
                });

                const f_cellId = f_utils.addFolder({title: 'Cell ID Presets'});
                f_cellId.addButton({title: '🎨 Stained Glass'}).on('click', () => {
                    targetNoiseTexture.setStainedGlassPattern();
                    pane.refresh();
                });
                f_cellId.addButton({title: '🌈 Mosaic'}).on('click', () => {
                    targetNoiseTexture.setMosaicPattern();
                    pane.refresh();
                });
                f_cellId.addButton({title: '🗺️ Biome Map'}).on('click', () => {
                    targetNoiseTexture.setBiomeMapPattern();
                    pane.refresh();
                });

                f_utils.addButton({title: '🎲 Random Seed'}).on('click', () => {
                    targetNoiseTexture.randomizeSeed();
                    pane.refresh();
                });

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