import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 1: Basic Terrain (Hello Landscape)
 * [EN] Step 1: Basic Terrain (Hello Landscape)
 *
 * [KO] 개별 타일맵 스트리밍을 적용하기 전, 단일 16비트 하이트맵(Global Heightmap)으로 전체적인 랜드스케이프 지형 베이스를 초기화하고 기본 렌더링을 구성하는 기초 예제입니다.
 * [EN] An introductory example demonstrating how to initialize the entire landscape terrain base using a single 16-bit global heightmap before applying tiled map streaming, and configure fundamental rendering.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (자유 비행 카메라 기본 + 궤도 회전 카메라 준비)
        // [자유 비행 카메라] 8km 광활한 오픈월드 상공에서 쾌적하게 활공하며 탐색
        const freeController = new RedGPU.Camera.FreeController(redGPUContext);
        freeController.x = 0;
        freeController.y = 1350;
        freeController.z = 2800;
        freeController.tilt = -18;
        freeController.pan = 0;
        freeController.moveSpeed = 4000;

        // [궤도 회전 카메라] 지형 전체를 360도 공전 조망
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 6000;
        orbitController.tilt = -22;
        orbitController.pan = 35;
        orbitController.minDistance = 300;
        orbitController.maxDistance = 25000;
        orbitController.speedDistance = 80.0;

        // 2. 씬 및 뷰3D 생성 (기본: 전체 궤도 회전 카메라)
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // 3. IBL 환경광 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // 4. 태양광 (DirectionalLight) 설정 - 산맥과 계곡의 음영을 살려주는 황금각도
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 36;
        directionalLight.azimuth = 135;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 85000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 랜드스케이프 지형 생성 (단 5줄의 핵심 코드로 16비트 지형 렌더링)
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [8000, 8000];
        landscape.heightScale = 650;
        landscape.baseColor.setColorByHEX('#4a7c59');
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';
        scene.addLandscape(landscape);

        // 6. GUI 컨트롤 패널 생성
        renderTestPane(redGPUContext, view, freeController, orbitController, landscape, directionalLight);

        // 7. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (error) => {
        console.error('RedGPU 초기화 실패:', error);
    }
);

/**
 * [KO] Tweakpane GUI를 구성하여 카메라 모드, 랜드스케이프 및 조명 속성을 실시간 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera modes, landscape, and lighting properties in real time.
 */
function renderTestPane(redGPUContext, view, freeController, orbitController, landscape, directionalLight) {
    const params = {
        cameraMode: 'Orbit'
    };

    const resetView = () => {
        if (params.cameraMode === 'Free Flight') {
            freeController.x = 0;
            freeController.y = 1350;
            freeController.z = 2800;
            freeController.tilt = -18;
            freeController.pan = 0;
        } else {
            orbitController.centerX = 0;
            orbitController.centerY = 0;
            orbitController.centerZ = 0;
            orbitController.distance = 6000;
            orbitController.tilt = -22;
            orbitController.pan = 35;
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. 카메라 폴더
            const cameraFolder = pane.addFolder({title: 'Camera', expanded: true});

            const cameraModeBinding = cameraFolder.addBinding(params, 'cameraMode', {
                options: {
                    'Free Flight': 'Free Flight',
                    'Orbit': 'Orbit'
                }
            });

            const speedBinding = cameraFolder.addBinding(freeController, 'moveSpeed', {
                min: 1000,
                max: 12000,
                step: 200
            });
            speedBinding.hidden = true;

            const zoomSpeedBinding = cameraFolder.addBinding(orbitController, 'speedDistance', {
                min: 10,
                max: 300,
                step: 5
            });

            cameraModeBinding.on('change', (ev) => {
                const isFree = ev.value === 'Free Flight';
                view.camera = isFree ? freeController : orbitController;
                speedBinding.hidden = !isFree;
                zoomSpeedBinding.hidden = isFree;
            });

            cameraFolder.addButton({title: 'Reset Camera'}).on('click', resetView);

            // 2. 지형 설정 폴더
            const terrainFolder = pane.addFolder({title: 'Terrain', expanded: true});

            terrainFolder.addBinding(landscape, 'heightScale', {min: 0, max: 1500, step: 10});
            terrainFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 2000, step: 10});
            terrainFolder.addBinding(landscape, 'nearDetailFade', {min: 10, max: 1000, step: 10});
            terrainFolder.addBinding(landscape, 'wireframe');
            terrainFolder.addBinding(landscape, 'lodColoration');

            // 하이트맵 그림자 세부 제어
            terrainFolder.addBinding(landscape, 'enableHeightmapShadow');
            terrainFolder.addBinding(landscape, 'heightmapShadowSoftness', {min: 1, max: 20, step: 0.5});
            terrainFolder.addBinding(landscape, 'heightmapShadowDistance', {min: 500, max: 6000, step: 100});

            // 3. 조명 폴더
            const lightFolder = pane.addFolder({title: 'Light', expanded: true});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
}
