import * as RedGPU from "../../../../dist/index.js?t=1783323470979";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783323470979";

/**
 * [KO] Free Controller 예제
 * [EN] Free Controller example
 *
 * [KO] 자유로운 이동과 회전이 가능한 FreeController의 사용법을 보여줍니다.
 * [EN] Demonstrates how to use FreeController for free movement and rotation.
 */

// [KO] 캔버스 생성 및 문서에 추가
// [EN] Create canvas and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(canvas, (redGPUContext) => {
    // [KO] FreeController 생성 (마우스 및 키보드 조작 지원)
    // [EN] Create FreeController (supports mouse and keyboard controls)
    const controller = new RedGPU.Camera.FreeController(redGPUContext);
    controller.z = 10;
    controller.y = 10;
    controller.tilt = -45;

    // [KO] 환경 맵(IBL) 로드 및 하늘 상자(SkyBox) 생성
    // [KO] HDR 이미지의 밝기에 맞춰 루미넌스 값을 25000으로 설정
    // [EN] Load environment map (IBL) and create SkyBox
    // [EN] Set luminance to 25000 to match the brightness of the HDR image
    const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);
    
    // [KO] 장면(Scene) 생성 및 방향성 조명(DirectionalLight) 추가
    // [EN] Create scene and add DirectionalLight
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
    
    // [KO] 하늘 상자 적용
    // [EN] Apply skybox
    view.skybox = skybox; 
    redGPUContext.addView(view);

    // [KO] 장면에 여러 개의 구형 메쉬를 추가하는 헬퍼 함수
    // [EN] Helper function to add multiple spherical meshes to the scene
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
            
            // [KO] 무작위 위치에 메쉬 배치
            // [EN] Place mesh at random position
            mesh.setPosition(
                Math.random() * 500 - 250,
                Math.random() * 500 - 250,
                Math.random() * 500 - 250
            );
            scene.addChild(mesh);
        }
    };

    // [KO] 장면에 1000개의 메쉬 추가
    // [EN] Add 1000 meshes to the scene
    addMeshesToScene(scene, 1000);

    // [KO] 렌더러 생성 및 렌더 루프 시작
    // [EN] Create renderer and start render loop
    const renderer = new RedGPU.Renderer();
    const render = (time) => {
        // [KO] 매 프레임 실행될 로직
        // [EN] Logic to be executed every frame
    };
    renderer.start(redGPUContext, render);

    // [KO] 테스트용 GUI 렌더링
    // [EN] Render GUI for testing
    renderTestPane(redGPUContext, controller);
}, (failReason) => {
    // [KO] 초기화 실패 시 에러 처리 (콘솔 출력 및 화면 메시지 표시)
    // [EN] Error handling on initialization failure (Console output and screen message display)
    console.error('초기화 실패:', failReason);
    const errorMessage = document.createElement('div');
    errorMessage.innerHTML = failReason;
    document.body.appendChild(errorMessage);
});

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Camera.FreeController} controller
 */
const renderTestPane = (redGPUContext, controller) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            {
                // [KO] 두 번째 컨트롤러 및 뷰 설정 (멀티 뷰 테스트용)
                // [EN] Second controller and view setup (for multi-view test)
                const controller2 = new RedGPU.Camera.FreeController(redGPUContext);
                const view1 = redGPUContext.viewList[0];
                const view2 = new RedGPU.Display.View3D(redGPUContext, view1.scene, controller2);
                view2.axis = true;
                view2.grid = true;
                view2.skybox = view1.skybox;

                // [KO] 뷰 레이아웃 설정 유틸리티 (단일 뷰 / 화면 분할)
                // [EN] View layout setting utility (single view / split screen)
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

                // [KO] 컨트롤러 동기화 유틸리티 (위치 및 회전값 복사)
                // [EN] Controller synchronization utility (copy position and rotation values)
                const syncControllers = (source, target) => {
                    ['x', 'y', 'z', 'tilt', 'pan'].forEach(prop => target[prop] = source[prop]);
                };

                // [KO] 테스트 모드별 뷰 및 컨트롤러 매핑 핸들러
                // [EN] View and controller mapping handlers by test mode
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

                // [KO] 테스트 모드 선택용 폴더 설정
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
                    // [KO] 모드 변경 시 뷰 초기화 및 재설정
                    // [EN] Initialize and reset views when mode changes
                    redGPUContext.removeAllViews();
                    redGPUContext.addView(view1);
                    view1.camera = controller;
                    testModeHandlers[ev.value](controlsFolder);
                });
            }
            
            // [KO] 컨트롤러 조작 파라미터 조정 폴더
            // [EN] Controller manipulation parameters adjustment folder
            const controlsFolder = pane.addFolder({
                title: 'Control Parameters'
            });

            // [KO] 이동 속도
            // [EN] Movement speed
            controlsFolder.addBinding(controller, 'moveSpeed', {
                min: 1, max: 1000, step: 1
            });

            // [KO] 이동 보간(관성) 속도
            // [EN] Movement interpolation (inertia) speed
            controlsFolder.addBinding(controller, 'moveSpeedInterpolation', {
                min: 0.0001, max: 1, step: 0.0001
            });

            // [KO] 회전 속도
            // [EN] Rotation speed
            controlsFolder.addBinding(controller, 'rotationSpeed', {
                min: 1, max: 720, step: 1
            });

            // [KO] 회전 보간(관성) 속도
            // [EN] Rotation interpolation (inertia) speed
            controlsFolder.addBinding(controller, 'rotationSpeedInterpolation', {
                min: 0.0001, max: 1, step: 0.0001
            });

            // [KO] 마우스 감도
            // [EN] Mouse sensitivity
            controlsFolder.addBinding(controller, 'mouseSensitivity', {
                min: 0.01, max: 1.0, step: 0.01
            });

            // [KO] 최대 가속도
            // [EN] Maximum acceleration
            controlsFolder.addBinding(controller, 'maxAcceleration', {
                min: 0.1, max: 10, step: 0.1
            });

            const keyBindings = controller.keyNameMapper;

            // [KO] 이동 키 매핑 변경 폴더
            // [EN] Movement key mapping change folder
            const moveFolder = pane.addFolder({
                title: 'Movement Keys'
            });

            for (const key in keyBindings) {
                moveFolder.addBinding(keyBindings, key, {
                    label: key
                }).on('change', (ev) => {
                    // [KO] 키 바인딩 동적 업데이트 (예: setForward(value))
                    // [EN] Dynamic key binding update (e.g., setForward(value))
                    controller[`set${key.charAt(0).toUpperCase()}${key.substr(1)}`](ev.value);
                });
            }
        }
    });
};
