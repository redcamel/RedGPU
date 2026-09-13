import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] WaterBodyLake & SingleLayerWaterMaterial Step 1 예제
 * [EN] WaterBodyLake & SingleLayerWaterMaterial Step 1 Example
 *
 * [KO] 단일 노멀맵 스크롤링 애니메이션 및 태양 직사광과의 Blinn-Phong 스펙큘러 하이라이트 합성을 시연합니다.
 * [EN] Demonstrates single normal map scrolling animation and Blinn-Phong specular highlight synthesis with directional sunlight.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 설정 (수면 위/아래 및 반사광 각도 탐색)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 28;
        controller.tilt = -25;
        controller.pan = 35;
        controller.speedDistance = 0.2;

        // 2. 씬 및 뷰3D 구성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. 태양 직사광 (Directional Light) 및 환경광 (Ambient Light) 설정
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 40;
        directionalLight.azimuth = 60;
        scene.lightManager.addDirectionalLight(directionalLight);

        const ambientLight = new RedGPU.Light.AmbientLight('#c8e0f8', 800);
        scene.lightManager.ambientLight = ambientLight;

        // 4. 물밑 환경 및 수면 관통 오브젝트 구성
        const underwaterObjects = createUnderwaterEnvironment(redGPUContext, scene);

        // 5. WaterBodyLake 호수 수체 생성 (Step 1: 단일 노멀 스크롤 & 스펙큘러)
        const lake = new RedGPU.Display.Water.WaterBodyLake(
            redGPUContext,
            32, // waterWidth
            32, // waterHeight
            1,
            1
        );
        lake.waterLevel = 0.5;

        // 심리스 물결 노멀맵 텍스처 장착
        const normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/water_normal.png'
        );
        lake.waterMaterial.normalTexture = normalTexture;
        lake.waterMaterial.normalTiling = 3.5;
        lake.waterMaterial.normalScale = 1.0;
        lake.waterMaterial.windSpeed = 0.04;
        lake.waterMaterial.windDirection = [1.0, 0.3];
        lake.waterMaterial.roughness = 0.1;
        lake.waterMaterial.specularFactor = 1.0;

        scene.addChild(lake);

        // 6. 렌더러 생성 및 렌더 루프 가동
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // 물밑 오브젝트 천천히 회전 (동적 시각 검증)
            const count = underwaterObjects.length;
            for (let i = 0; i < count; i++) {
                underwaterObjects[i].rotationY += 0.5;
            }
        };
        renderer.start(redGPUContext, render);

        // 7. 실시간 튜닝 GUI 패널
        renderTestPane(redGPUContext, lake, directionalLight, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 수면 아래 및 수면을 관통하는 테스트 지형/오브젝트들을 생성합니다.
 * [EN] Creates test terrain/objects beneath and piercing through the water surface.
 */
function createUnderwaterEnvironment(redGPUContext, scene) {
    const objects = [];

    // 바닥 지반 (Lake Basin Bottom)
    const basinMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#223322');
    const basinGeometry = new RedGPU.Primitive.Box(redGPUContext, 34, 2, 34);
    const basinMesh = new RedGPU.Display.Mesh(redGPUContext, basinGeometry, basinMaterial);
    basinMesh.y = -2;
    scene.addChild(basinMesh);

    // 수면을 관통하여 솟아오른 바위/기둥들 (Piercing Rocks & Pillars)
    const colors = ['#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#f1c40f', '#1abc9c'];
    const positions = [
        [-7, 0, -7],
        [7, 0.5, -5],
        [-5, 1.2, 6],
        [6, -0.2, 7],
        [0, 0.8, 0],
        [-9, -0.5, 3]
    ];

    for (let i = 0; i < positions.length; i++) {
        const [x, y, z] = positions[i];
        const mat = new RedGPU.Material.ColorMaterial(redGPUContext, colors[i % colors.length]);
        const geom = (i % 2 === 0)
            ? new RedGPU.Primitive.Box(redGPUContext, 2.5, 4, 2.5)
            : new RedGPU.Primitive.Sphere(redGPUContext, 1.8, 16, 16);

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geom, mat);
        mesh.x = x;
        mesh.y = y;
        mesh.z = z;
        scene.addChild(mesh);
        objects.push(mesh);
    }

    // 연안 경사 지형 (Depth Fade 시각적 검증용 비스듬한 해변 경사면)
    const slopeMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#8d6e63');
    const slopeGeometry = new RedGPU.Primitive.Box(redGPUContext, 12, 1, 14);
    const slopeMesh = new RedGPU.Display.Mesh(redGPUContext, slopeGeometry, slopeMaterial);
    slopeMesh.x = 0;
    slopeMesh.y = 0.1;
    slopeMesh.z = -9;
    slopeMesh.rotationX = 18;
    scene.addChild(slopeMesh);

    return objects;
}

/**
 * [KO] WaterBodyLake 실시간 속성 제어를 위한 Tweakpane GUI를 구성합니다.
 * [EN] Configures Tweakpane GUI for real-time control of WaterBodyLake properties.
 */
function renderTestPane(redGPUContext, lake, directionalLight, view) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        skybox: true,
        ibl: true,
        gui: (pane) => {
            // [폴더 1] 수체 기초 설정 (PBR Base)
            const basicFolder = pane.addFolder({title: 'WaterBodyLake (Base)', expanded: true});
            basicFolder.addBinding(lake, 'waterLevel', {min: -3, max: 4, step: 0.05});
            basicFolder.addBinding(lake.waterMaterial, 'opacity', {min: 0.0, max: 1.0, step: 0.02});

            const colorParams = {
                baseColor: {
                    r: lake.waterMaterial.baseColor.r,
                    g: lake.waterMaterial.baseColor.g,
                    b: lake.waterMaterial.baseColor.b
                }
            };
            basicFolder.addBinding(colorParams, 'baseColor', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                lake.waterMaterial.baseColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            // [폴더 2] Step 1: 물결 노멀 및 바람 애니메이션
            const waveFolder = pane.addFolder({title: 'Step 1: Waves & Normal', expanded: true});
            waveFolder.addBinding(lake.waterMaterial, 'normalScale', {min: 0.0, max: 3.0, step: 0.05});
            waveFolder.addBinding(lake.waterMaterial, 'normalTiling', {min: 1.0, max: 20.0, step: 0.5});
            waveFolder.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.2, step: 0.005});

            const windDirection = {
                x: lake.waterMaterial.windDirection[0],
                y: lake.waterMaterial.windDirection[1]
            };
            waveFolder.addBinding(windDirection, 'x', {min: -1.0, max: 1.0, step: 0.05}).on('change', (ev) => {
                lake.waterMaterial.windDirection = [ev.value, windDirection.y];
            });
            waveFolder.addBinding(windDirection, 'y', {min: -1.0, max: 1.0, step: 0.05}).on('change', (ev) => {
                lake.waterMaterial.windDirection = [windDirection.x, ev.value];
            });

            // [폴더 3] Step 1: Cook-Torrance PBR 스펙큘러 하이라이트
            const specFolder = pane.addFolder({title: 'Step 1: Cook-Torrance PBR Specular', expanded: true});
            specFolder.addBinding(lake.waterMaterial, 'roughness', {min: 0.01, max: 1.0, step: 0.01});
            specFolder.addBinding(lake.waterMaterial, 'specularFactor', {min: 0.0, max: 3.0, step: 0.05});
            specFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            specFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            // [폴더 4] Step 3: 부드러운 해안선 감쇄 (Depth Fade / Soft Water)
            const depthFadeFolder = pane.addFolder({title: 'Step 3: Depth Fade (Soft Water)', expanded: true});
            depthFadeFolder.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.0, max: 4.0, step: 0.05});

            // [폴더 5] 대기 및 환경광 (Sky Atmosphere & IBL)
            const envFolder = pane.addFolder({title: 'Sky Atmosphere & IBL', expanded: true});
            let skyAtmosphereInstance = null;
            const envState = {
                skyAtmosphere: false,
            };
            envFolder.addBinding(envState, 'skyAtmosphere').on('change', (ev) => {
                if (ev.value) {
                    if (!skyAtmosphereInstance) {
                        skyAtmosphereInstance = new RedGPU.Display.SkyAtmosphere(redGPUContext);
                    }
                    view.skyAtmosphere = skyAtmosphereInstance;
                } else {
                    view.skyAtmosphere = null;
                }
            });

            // [폴더 5] 컬러 프리셋
            const presetFolder = pane.addFolder({title: 'Color Presets', expanded: false});
            presetFolder.addButton({title: 'Calm Alpine Lake (#1a5b8c)'}).on('click', () => {
                lake.waterMaterial.baseColor.setColorByHEX('#1a5b8c');
                lake.waterMaterial.opacity = 0.65;
                pane.refresh();
            });
            presetFolder.addButton({title: 'Tropical Turquoise (#0e869c)'}).on('click', () => {
                lake.waterMaterial.baseColor.setColorByHEX('#0e869c');
                lake.waterMaterial.opacity = 0.55;
                pane.refresh();
            });
            presetFolder.addButton({title: 'Emerald Forest Pool (#115e59)'}).on('click', () => {
                lake.waterMaterial.baseColor.setColorByHEX('#115e59');
                lake.waterMaterial.opacity = 0.75;
                pane.refresh();
            });
        }
    });
}
