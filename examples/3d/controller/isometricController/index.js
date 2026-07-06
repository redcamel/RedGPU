import * as RedGPU from "../../../../dist/index.js?t=1783324948992";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783324948992";

/**
 * [KO] Isometric Controller 예제
 * [EN] Isometric Controller example
 *
 * [KO] 아이소메트릭 뷰(직교 투영)를 제공하는 카메라 컨트롤러의 사용법을 보여줍니다.
 * [EN] Demonstrates how to use a camera controller that provides an isometric view (orthographic projection).
 */

// [KO] 캔버스 생성 및 문서에 추가
// [EN] Create canvas and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 타겟 메시 2개 생성
        // [EN] Create 2 target meshes
        const targetGeometry = new RedGPU.Primitive.Box(redGPUContext);
        const targetMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        const targetMaterial2 = new RedGPU.Material.PhongMaterial(redGPUContext);
        targetMaterial.color.setColorByRGB(255, 0, 0);
        targetMaterial2.color.setColorByRGB(0, 255, 0);
        const targetMesh = new RedGPU.Display.Mesh(redGPUContext, targetGeometry, targetMaterial);
        const targetMesh2 = new RedGPU.Display.Mesh(redGPUContext, targetGeometry, targetMaterial2);
        targetMesh.x = 1
        targetMesh2.x = -1

        // [KO] IsometricController 생성
        // [EN] Create IsometricController
        const isometricController = new RedGPU.Camera.IsometricController(redGPUContext);

        // [KO] 씬(Scene) 생성 및 메쉬 추가
        // [EN] Create Scene and add meshes
        const scene = new RedGPU.Display.Scene();
        scene.addChild(targetMesh);
        scene.addChild(targetMesh2);

        // [KO] 조명 설정
        // [EN] Light setup
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 뷰(View3D) 생성 (Isometric 컨트롤러 연결)
        // [EN] Create View3D (linked with Isometric controller)
        const view = new RedGPU.Display.View3D(redGPUContext, scene, isometricController);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 주변 환경을 채울 여러 메쉬 추가
        // [EN] Add multiple meshes to fill the surrounding environment
        const addMeshesToScene = (scene, count = 500) => {
            // [KO] Box 지오메트리를 생성 (가로, 세로, 높이 1)
            // [EN] Create Box geometry (width, height, depth 1)
            const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
            
            // [KO] 성능 최적화를 위해 다채로운 색상의 재사용 가능한 매질(Material) 풀 생성
            // [EN] Create a reusable material pool with diverse colors for performance optimization
            const materialPool = Array.from({ length: 20 }).map(() => {
                const mat = new RedGPU.Material.PhongMaterial(redGPUContext);
                mat.color.setColorByRGB(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
                return mat;
            });

            // [KO] 격자(Grid) 기반 위치 계산 (겹침 방지)
            // [EN] Calculate grid-based positions (to prevent overlap)
            const step = 2; 
            
            // [KO] 박스 크기(1)보다 큰 간격을 설정
            // [EN] Set interval larger than box size (1)
            const range = 300;
            const positions = [];
            for (let x = -range / 2; x < range / 2; x += step) {
                for (let z = -range / 2; z < range / 2; z += step) {
                    positions.push({ x, z });
                }
            }

            // [KO] 위치 목록을 무작위로 섞음 (Fisher-Yates Shuffle)
            // [EN] Randomly shuffle the position list (Fisher-Yates Shuffle)
            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }

            // [KO] 생성할 개수만큼 중복되지 않는 위치에 배치
            // [EN] Place at non-overlapping positions up to the desired count
            const limit = Math.min(count, positions.length);
            for (let i = 0; i < limit; i++) {
                const pos = positions[i];
                const randomMaterial = materialPool[Math.floor(Math.random() * materialPool.length)];
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, randomMaterial);

                // [KO] Box의 높이가 1이므로 y 위치를 0.5로 설정하여 바닥에 맞춤
                // [EN] Set y position to 0.5 to align with the floor, since Box height is 1
                mesh.setPosition(pos.x, 0.5, pos.z);
                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene, 1000);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 로직
            // [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // [KO] 테스트용 GUI 렌더링
        // [EN] Render GUI for testing
        renderTestPane(redGPUContext, isometricController, targetMesh);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Camera.IsometricController} controller
 * @param {RedGPU.Display.Mesh} targetMesh
 */
const renderTestPane = (redGPUContext, controller) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            {
                // [KO] 두 번째 컨트롤러 및 뷰 설정 (멀티 뷰 테스트용)
                // [EN] Second controller and view setup (for multi-view test)
                const controller2 = new RedGPU.Camera.IsometricController(redGPUContext);
                const view1 = redGPUContext.viewList[0];
                const view2 = new RedGPU.Display.View3D(redGPUContext, view1.scene, controller2);
                view2.axis = true;
                view2.grid = true;
                
                // [KO] 뷰 레이아웃 설정 유틸리티
                // [EN] View layout setting utility
                const ViewLayoutManager = {
                    setSingleView: (view) => {
                        view.setSize('100%', '100%');
                        view.setPosition(0, 0);
                    },
                    setSplitView: (view1, view2, isMobile) => {
                        if (isMobile) {
                            view1.setSize('100%', '50%');
                            view1.setPosition(0, 0);
                            view2.setSize('100%', '50%');
                            view2.setPosition(0, '50%');
                        } else {
                            view1.setSize('50%', '100%');
                            view1.setPosition(0, 0);
                            view2.setSize('50%', '100%');
                            view2.setPosition('50%', 0);
                        }
                    }
                };

                // [KO] 컨트롤러 동기화 유틸리티
                // [EN] Controller synchronization utility
                const syncControllers = (source, target) => {
                    ['zoom', 'viewHeight'].forEach(prop => target[prop] = source[prop]);
                };

                // [KO] 테스트 모드 핸들러 맵
                // [EN] Test mode handlers map
                const testModeHandlers = {
                    singleView: (controlsFolders) => {
                        ViewLayoutManager.setSingleView(view1);
                        controlsFolders.forEach(controlsFolder => controlsFolder.hidden = false);
                    },
                    multiViewSharedControl: (controlsFolders) => {
                        ViewLayoutManager.setSplitView(view1, view2, redGPUContext.detector.isMobile);
                        redGPUContext.addView(view2);
                        view2.camera = controller;
                        controlsFolders.forEach(controlsFolder => controlsFolder.hidden = false);
                    },
                    multiViewIndependentControl: (controlsFolders) => {
                        ViewLayoutManager.setSplitView(view1, view2, redGPUContext.detector.isMobile);
                        redGPUContext.addView(view2);
                        view2.camera = controller2;
                        syncControllers(controller, controller2);
                        controlsFolders.forEach(controlsFolder => controlsFolder.hidden = true);
                    }
                };

                // [KO] 테스트 모드 폴더 설정
                // [EN] Test mode selection folder setup
                const folder = pane.addFolder({title: 'Test Mode'});
                const testModes = {testMode: 'singleView'};
                folder.addBinding(testModes, 'testMode', {
                    label: 'Test Mode',
                    options: {
                        singleView: 'singleView',
                        multiViewSharedControl: 'multiViewSharedControl',
                        multiViewIndependentControl: 'multiViewIndependentControl'
                    }
                }).on('change', (ev) => {
                    redGPUContext.removeAllViews();
                    redGPUContext.addView(view1);
                    view1.camera = controller;
                    testModeHandlers[ev.value]([cameraFolder, zoomFolder, viewFolder, targetFolder]);
                });
            }

            // [KO] 카메라 이동 설정 폴더
            // [EN] Camera movement settings folder
            const cameraFolder = pane.addFolder({
                title: 'Movement Settings',
            });
            cameraFolder.addBinding(controller, 'moveSpeed', {
                min: 1,
                max: 200,
                step: 1
            });
            cameraFolder.addBinding(controller, 'moveSpeedInterpolation', {
                min: 0.0001,
                max: 1,
                step: 0.0001
            });
            cameraFolder.addBinding(controller, 'mouseMoveSpeed', {
                min: 0.1,
                max: 10,
                step: 0.1
            });
            cameraFolder.addBinding(controller, 'mouseMoveSpeedInterpolation', {
                min: 0.0001,
                max: 1,
                step: 0.0001
            });

            // [KO] 줌 설정 폴더
            // [EN] Zoom settings folder
            const zoomFolder = pane.addFolder({
                title: 'Zoom Settings',
            });
            zoomFolder.addBinding(controller, 'zoom', {
                min: 0.1,
                max: 10,
                step: 0.1,
            });
            zoomFolder.addBinding(controller, 'zoomInterpolation', {
                min: 0.0001,
                max: 1,
                step: 0.0001
            });
            zoomFolder.addBinding(controller, 'speedZoom', {
                min: 0.01,
                max: 1.0,
                step: 0.01,
            });
            zoomFolder.addBinding(controller, 'minZoom', {
                min: 0.1,
                max: 2,
                step: 0.1,
            });
            zoomFolder.addBinding(controller, 'maxZoom', {
                min: 1,
                max: 20,
                step: 0.1,
            });

            // [KO] 뷰 설정 폴더
            // [EN] View settings folder
            const viewFolder = pane.addFolder({
                title: 'View Settings',
            });
            viewFolder.addBinding(controller, 'viewHeight', {
                min: 1,
                max: 500,
                step: 1,
            });
            viewFolder.addBinding(controller, 'viewHeightInterpolation', {
                min: 0.0001,
                max: 1,
                step: 0.0001
            });

            // [KO] 타겟 위치 (읽기 전용)
            // [EN] Target Position (Read-only)
            const targetFolder = pane.addFolder({
                title: 'Target Position',
            });
            targetFolder.addBinding(controller, 'targetX', {
                readonly: true,
            })
            targetFolder.addBinding(controller, 'targetY', {
                readonly: true,
            })
            targetFolder.addBinding(controller, 'targetZ', {
                readonly: true,
            })

            // [KO] 이동 키 매핑 변경
            // [EN] Movement keys mapping change
            const moveFolder = pane.addFolder({
                title: 'Movement Keys',
            });
            const keyBindings = controller.keyNameMapper;

            for (const key in keyBindings) {
                moveFolder.addBinding(keyBindings, key, {
                    label: key,
                }).on('change', (ev) => {
                    controller[`set${key.charAt(0).toUpperCase()}${key.substr(1)}`](ev.value);
                });
            }

            const update = () => {
                pane.refresh()
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }
    });
};
