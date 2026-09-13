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

    // 1. 연속 수심 경사 지반 (Gradual Deep Trench Basin: 0m 연안 -> 5.5m 심해)
    const gridTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
    const basinMaterial = new RedGPU.Material.BitmapMaterial(redGPUContext, gridTexture);
    const basinGeometry = new RedGPU.Primitive.Box(redGPUContext, 32, 1, 32);
    const basinMesh = new RedGPU.Display.Mesh(redGPUContext, basinGeometry, basinMaterial);
    basinMesh.x = 0;
    basinMesh.y = -2.2;
    basinMesh.z = 0;
    basinMesh.rotationX = 11; // 북쪽(z=-14)은 수심 0.2m, 남쪽(z=+14)은 수심 5.0m로 하강
    scene.addChild(basinMesh);

    // 2. 수심 단계별 단차 큐브들 (Stepped Depth Stages: 얕은 연안 옥색 -> 깊은 심해 남색 대비)
    const depthCubes = [
        {x: -9, y: 0.2, z: -9, color: '#ffeb3b', desc: 'Shallow (0.3m)'},     // 극천해 (투명 굴절 & 연한 옥색)
        {x: -9, y: -0.9, z: -3, color: '#ff9800', desc: 'Low-Mid (1.4m)'},     // 얕은 중수심 (맑고 짙은 에메랄드 옥색)
        {x: -9, y: -2.0, z: 3, color: '#f44336', desc: 'High-Mid (2.5m)'},    // 깊은 중수심 (짙은 청록 -> 심해 남색 전이)
        {x: -9, y: -3.2, z: 9, color: '#9c27b0', desc: 'Deep (3.7m)'},        // 심해 트렌치 (짙은 심해 남색 지배)
        {x: -9, y: -4.4, z: 13, color: '#3f51b5', desc: 'Abyss (4.9m)'},       // 최심해 (완전한 심해의 어둠)
    ];
    depthCubes.forEach((st) => {
        const mat = new RedGPU.Material.ColorMaterial(redGPUContext, st.color);
        const geom = new RedGPU.Primitive.Box(redGPUContext, 3.2, 3.2, 3.2);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geom, mat);
        mesh.x = st.x;
        mesh.y = st.y;
        mesh.z = st.z;
        scene.addChild(mesh);
        objects.push(mesh);
    });

    // 3. 수면 비스듬히 관통하는 기둥 (Broken Straw Effect - 굴절 꺾임 극대화)
    const strawMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff3d00');
    const strawGeometry = new RedGPU.Primitive.Cylinder(redGPUContext, 0.45, 0.45, 14, 24);
    const strawMesh = new RedGPU.Display.Mesh(redGPUContext, strawGeometry, strawMaterial);
    strawMesh.x = 2;
    strawMesh.y = 0.3;
    strawMesh.z = -1;
    strawMesh.rotationZ = 35;
    strawMesh.rotationX = 25;
    scene.addChild(strawMesh);

    // 4. 수면을 관통하여 솟아오른 바위/구체들 (Piercing Rocks & Spheres)
    const colors = ['#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#f1c40f', '#1abc9c'];
    const positions = [
        [7, 0.2, -7],
        [7, -0.8, 1],
        [7, -2.5, 9],
        [-2, 0.8, -7],
        [0, -0.6, 5]
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

    // 5. 연안 경사 지형 (Depth Fade 시각적 검증용 비스듬한 해변 경사면)
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
            // [폴더 1] 수체 기초 설정 (PBR Base & Dual-tone Colors)
            const basicFolder = pane.addFolder({title: 'WaterBodyLake (Base & Dual-tone)', expanded: true});
            basicFolder.addBinding(lake, 'waterLevel', {min: -3, max: 4, step: 0.05});
            basicFolder.addBinding(lake.waterMaterial, 'opacity', {min: 0.0, max: 1.0, step: 0.02});

            const colorParams = {
                baseColor: {
                    r: lake.waterMaterial.baseColor.r,
                    g: lake.waterMaterial.baseColor.g,
                    b: lake.waterMaterial.baseColor.b
                },
                deepColor: {
                    r: lake.waterMaterial.deepColor.r,
                    g: lake.waterMaterial.deepColor.g,
                    b: lake.waterMaterial.deepColor.b
                }
            };
            basicFolder.addBinding(colorParams, 'baseColor', {
                view: 'color',
                label: 'Shallow (연안 옥색)'
            }).on('change', (ev) => {
                const {r, g, b} = ev.value;
                lake.waterMaterial.baseColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            basicFolder.addBinding(colorParams, 'deepColor', {
                view: 'color',
                label: 'Deep (심해 남색)'
            }).on('change', (ev) => {
                const {r, g, b} = ev.value;
                lake.waterMaterial.deepColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
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

            // [폴더 5] Step 4: 수중 굴절 및 Beer-Lambert 듀얼 톤 흡수
            const refractionFolder = pane.addFolder({title: 'Step 4: Refraction & Beer-Lambert', expanded: true});
            refractionFolder.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 0.1, step: 0.002});
            refractionFolder.addBinding(lake.waterMaterial, 'extinctionFactor', {min: 0.0, max: 2.0, step: 0.02});

            // [폴더 6] 대기 및 환경광 (Sky Atmosphere & IBL)
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

            // [폴더 7] 카메라 시점 프리셋 (수심 그라데이션 및 Step 4 집중 조망)
            const cameraFolder = pane.addFolder({title: 'Camera Presets (Step 4 Focus)', expanded: true});
            cameraFolder.addButton({title: 'Trench Slope (옥색 ➔ 심해 남색 조망)'}).on('click', () => {
                view.camera.tilt = -28;
                view.camera.pan = 32;
                view.camera.distance = 28;
            });
            cameraFolder.addButton({title: 'Shallow Coastline (맑은 연안 옥색)'}).on('click', () => {
                view.camera.tilt = -38;
                view.camera.pan = 0;
                view.camera.distance = 15;
            });
            cameraFolder.addButton({title: 'Deep Abyss (심해 남색 트렌치)'}).on('click', () => {
                view.camera.tilt = -34;
                view.camera.pan = 180;
                view.camera.distance = 20;
            });
            cameraFolder.addButton({title: 'Top-down (UV Grid Refraction)'}).on('click', () => {
                view.camera.tilt = -75;
                view.camera.pan = 0;
                view.camera.distance = 22;
            });
            cameraFolder.addButton({title: 'Piercing Rod (Broken Straw Effect)'}).on('click', () => {
                view.camera.tilt = -16;
                view.camera.pan = 48;
                view.camera.distance = 16;
            });
            cameraFolder.addButton({title: 'Stepped Depths (수심별 단차 큐브)'}).on('click', () => {
                view.camera.tilt = -32;
                view.camera.pan = 180;
                view.camera.distance = 24;
            });
        }
    });
}
