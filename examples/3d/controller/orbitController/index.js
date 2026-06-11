import * as RedGPU from "../../../../dist/index.js?t=1781143364605";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781143364605";

/**
 * [KO] Orbit Controller 예제
 * [EN] Orbit Controller example
 *
 * [KO] OrbitController를 사용하여 타겟을 중심으로 궤도를 도는 카메라 컨트롤을 시연합니다.
 * [EN] Demonstrates camera control orbiting around a target using OrbitController.
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
        // [KO] OrbitController 생성 (마우스/터치 드래그로 타겟을 중심으로 회전)
        // [EN] Create OrbitController (rotate around target using mouse/touch drag)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // [KO] 환경 맵(IBL) 로드 및 하늘 상자(SkyBox) 생성 
        // [KO] HDR 이미지의 밝기에 맞춰 루미넌스 값을 25000으로 설정
        // [EN] Load environment map (IBL) and create SkyBox
        // [EN] Set luminance to 25000 to match the brightness of the HDR image
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);
        
        // [KO] 씬(Scene) 생성 및 조명 설정
        // [EN] Create scene and set up light
        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 뷰(View3D) 생성 및 설정
        // [EN] Create and configure View3D
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        
        // [KO] 축 표시
        // [EN] Show axis
        view.axis = true; 
        
        // [KO] 그리드 표시
        // [EN] Show grid
        view.grid = true; 
        
        // [KO] 하늘 상자 표시
        // [EN] Show skybox
        view.skybox = skybox; 
        redGPUContext.addView(view);

        // [KO] 씬에 여러 메쉬 추가하는 헬퍼 함수
        // [EN] Helper function to add multiple meshes to the scene
        const addMeshesToScene = (scene, count = 500) => {
            // [KO] 구의 반경을 5로 설정하여 메쉬 크기 증가
            // [EN] Increase mesh size by setting sphere radius to 5
            const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 5);
            
            // [KO] 성능 최적화를 위해 다채로운 색상의 재사용 가능한 매질(Material) 풀 생성
            // [EN] Create a reusable material pool with diverse colors for performance optimization
            const materialPool = Array.from({ length: 20 }).map(() => {
                const mat = new RedGPU.Material.PhongMaterial(redGPUContext);
                mat.color.setColorByRGB(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
                return mat;
            });

            for (let i = 0; i < count; i++) {
                const randomMaterial = materialPool[Math.floor(Math.random() * materialPool.length)];
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, randomMaterial);

                mesh.setPosition(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250
                );

                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene, 1000);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직
            // [EN] Logic to be executed every frame
        };
        renderer.start(redGPUContext, render);

        // [KO] 테스트용 GUI 렌더링
        // [EN] Render GUI for testing
        renderTestPane(redGPUContext, controller);
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
 * @param {RedGPU.Camera.OrbitController} controller
 */
const renderTestPane = (redGPUContext, controller) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            {
                // [KO] 두 번째 컨트롤러 및 뷰 설정 (멀티 뷰 테스트용)
                // [EN] Second controller and view setup (for multi-view test)
                const controller2 = new RedGPU.Camera.OrbitController(redGPUContext);
                const view1 = redGPUContext.viewList[0];
                const view2 = new RedGPU.Display.View3D(redGPUContext, view1.scene, controller2);
                view2.axis = true;
                view2.grid = true;
                view2.skybox = view1.skybox;

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
                    ['tilt', 'pan', 'distance', 'centerX', 'centerY', 'centerZ'].forEach(prop => target[prop] = source[prop]);
                };

                // [KO] 테스트 모드 핸들러 맵
                // [EN] Test mode handlers map
                const testModeHandlers = {
                    singleView: (controlsFolder) => {
                        ViewLayoutManager.setSingleView(view1);
                        controlsFolder.hidden = false;
                    },
                    multiViewSharedControl: (controlsFolder) => {
                        ViewLayoutManager.setSplitView(view1, view2, redGPUContext.detector.isMobile);
                        redGPUContext.addView(view2);
                        view2.camera = controller;
                        controlsFolder.hidden = false;
                    },
                    multiViewIndependentControl: (controlsFolder) => {
                        ViewLayoutManager.setSplitView(view1, view2, redGPUContext.detector.isMobile);
                        redGPUContext.addView(view2);
                        view2.camera = controller2;
                        syncControllers(controller, controller2);
                        controlsFolder.hidden = true;
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
                    testModeHandlers[ev.value](controlsFolder);
                });
            }
            
            // [KO] 중심점(Center) 위치 설정 폴더
            // [EN] Center position setting folder
            const centerFolder = pane.addFolder({
                title: 'Center Position'
            });
            centerFolder.addBinding(controller, 'centerX', {
                label: 'Center X',
                min: -50,
                max: 50,
                step: 0.5
            });
            centerFolder.addBinding(controller, 'centerY', {
                label: 'Center Y',
                min: -50,
                max: 50,
                step: 0.5
            });
            centerFolder.addBinding(controller, 'centerZ', {
                label: 'Center Z',
                min: -50,
                max: 50,
                step: 0.5
            });

            // [KO] 거리 및 줌 설정 폴더
            // [EN] Distance & Zoom setting folder
            const distanceFolder = pane.addFolder({
                title: 'Distance & Zoom'
            });
            distanceFolder.addBinding(controller, 'distance', {
                label: 'Distance',
                min: 0.1,
                max: 100,
                step: 0.5
            });
            distanceFolder.addBinding(controller, 'speedDistance', {
                label: 'Speed Distance',
                min: 0.01,
                max: 10,
                step: 0.1
            });
            distanceFolder.addBinding(controller, 'distanceInterpolation', {
                label: 'Delay Distance',
                min: 0.01,
                max: 1,
                step: 0.01
            });

            // [KO] 카메라 회전(Pan & Tilt) 설정 폴더
            // [EN] Camera rotation (Pan & Tilt) setting folder
            const rotationFolder = pane.addFolder({
                title: 'Rotation'
            });
            rotationFolder.addBinding(controller, 'pan', {
                label: 'Pan',
                min: -360,
                max: 360,
                step: 1
            });
            rotationFolder.addBinding(controller, 'tilt', {
                label: 'Tilt',
                min: -90,
                max: 90,
                step: 1
            });
            rotationFolder.addBinding(controller, 'minTilt', {
                label: 'Min Tilt',
                min: -90,
                max: 90,
                step: 1
            });
            rotationFolder.addBinding(controller, 'maxTilt', {
                label: 'Max Tilt',
                min: -90,
                max: 90,
                step: 1
            });
            rotationFolder.addBinding(controller, 'speedRotation', {
                label: 'Speed Rotation',
                min: 0.01,
                max: 10,
                step: 0.1
            });
            rotationFolder.addBinding(controller, 'rotationInterpolation', {
                label: 'Delay Rotation',
                min: 0.01,
                max: 1,
                step: 0.01
            });

            // [KO] 기타 조작 파라미터 조정용 빈 폴더 변수
            // [EN] Empty folder variable for other control parameter adjustments
            const controlsFolder = pane.addFolder({
                title: 'Control Parameters'
            });
        }
    });
};
