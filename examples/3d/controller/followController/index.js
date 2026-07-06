import * as RedGPU from "../../../../dist/index.js?t=1783323470979";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783323470979";

/**
 * [KO] Follow Controller 예제
 * [EN] Follow Controller example
 *
 * [KO] 특정 대상을 따라다니는 카메라 컨트롤러(FollowController)의 사용법을 보여줍니다.
 * [EN] Demonstrates how to use a camera controller (FollowController) that follows a specific target.
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
        // [KO] 타겟 메시 생성 (빨간색 박스)
        // [EN] Create target mesh (red box)
        const targetMesh = new RedGPU.Display.Mesh(redGPUContext);
        targetMesh.material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        targetMesh.geometry = new RedGPU.Primitive.Box(redGPUContext);

        // [KO] 타겟의 자식 메시 (녹색 박스) - 타겟의 앞쪽 방향을 표시
        // [EN] Child mesh of target (green box) - indicates the front direction of the target
        const targetMesh2 = new RedGPU.Display.Mesh(redGPUContext);
        targetMesh2.material = new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00');
        targetMesh2.geometry = new RedGPU.Primitive.Box(redGPUContext);
        
        // [KO] 타겟의 앞쪽에 배치
        // [EN] Placed in front of the target
        targetMesh2.z = -2; 
        targetMesh2.setScale(0.5);
        targetMesh.addChild(targetMesh2);

        // [KO] FollowController 생성 (각각 다른 타겟을 추적하도록 2개 생성)
        // [EN] Create FollowController (Create 2 to track different targets respectively)
        const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
        const controller2 = new RedGPU.Camera.FollowController(redGPUContext, targetMesh2);

        // [KO] 환경 맵(IBL) 로드 및 하늘 상자(SkyBox) 생성 
        // [KO] HDR 이미지의 밝기에 맞춰 루미넌스 값을 25000으로 설정
        // [EN] Load environment map (IBL) and create SkyBox 
        // [EN] Set luminance to 25000 to match the brightness of the HDR image
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);
        
        // [KO] 씬(Scene) 생성 및 조명, 타겟 추가
        // [EN] Create scene and add light, target
        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);
        scene.addChild(targetMesh);

        // [KO] 첫 번째 뷰(View3D) 생성 및 설정 (controller 연결)
        // [EN] Create and configure the first view (linked with controller)
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        view.skybox = skybox;
        redGPUContext.addView(view);

        // [KO] 두 번째 뷰(View3D) 생성 및 설정 (controller2 연결)
        // [EN] Create and configure the second view (linked with controller2)
        const view2 = new RedGPU.Display.View3D(redGPUContext, scene, controller2);
        view2.axis = true;
        view2.grid = true;
        view2.skybox = skybox;
        redGPUContext.addView(view2);

        // [KO] 모바일 여부에 따라 뷰 화면 분할 설정
        // [EN] Set view screen split based on whether it is mobile
        if (redGPUContext.detector.isMobile) {
            // [KO] 모바일: 위아래 분할
            // [EN] Mobile: Top/Bottom split
            view.setSize('100%', '50%');
            
            // [KO] 상단
            // [EN] Top
            view.setPosition(0, 0);         
            view2.setSize('100%', '50%');
            
            // [KO] 하단
            // [EN] Bottom
            view2.setPosition(0, '50%');     
        } else {
            // [KO] 데스크톱: 좌우 분할
            // [EN] Desktop: Left/Right split
            view.setSize('50%', '100%');
            
            // [KO] 좌측
            // [EN] Left
            view.setPosition(0, 0);         
            view2.setSize('50%', '100%');
            
            // [KO] 우측
            // [EN] Right
            view2.setPosition('50%', 0);     
        }

        // [KO] 배경 메시 추가 (환경 표시용 헬퍼 함수)
        // [EN] Add background meshes (Helper function for environment display)
        const addMeshesToScene = (scene, count = 100) => {
            // [KO] 구의 반경을 3으로 설정하여 메쉬 크기 증가
            // [EN] Increase mesh size by setting sphere radius to 3
            const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 3);
            
            // [KO] 성능 최적화를 위해 다채로운 색상의 재사용 가능한 매질(Material) 풀 생성
            // [EN] Create a reusable material pool with diverse colors for performance optimization
            const materialPool = Array.from({ length: 20 }).map(() => {
                const mat = new RedGPU.Material.ColorMaterial(redGPUContext);
                mat.color.setColorByRGB(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
                return mat;
            });

            for (let i = 0; i < count; i++) {
                const randomMaterial = materialPool[Math.floor(Math.random() * materialPool.length)];
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, randomMaterial);

                mesh.setPosition(
                    Math.random() * 100 - 50,
                    Math.random() * 100 - 50,
                    Math.random() * 100 - 50
                );

                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene, 100);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 타겟 메시를 원형 경로로 이동시키고 Y축으로 살짝 진동시킴
            // [EN] Move target mesh in a circular path and slightly vibrate on the Y-axis
            const t = time * 0.001;
            const radius = 20;
            targetMesh.x = Math.sin(t * 0.5) * radius;
            targetMesh.z = Math.cos(t * 0.5) * radius;
            targetMesh.y = Math.sin(t * 0.5) * 5;

            // [KO] 타겟이 항상 원점(0, 0, 0)을 바라보게 설정
            // [EN] Target always looks at the origin (0, 0, 0)
            targetMesh.lookAt(0, 0, 0);
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
 * @param {RedGPU.Camera.FollowController} controller
 */
const renderTestPane = (redGPUContext, controller) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] FollowController 설정 폴더
            // [EN] FollowController settings folder
            const followFolder = pane.addFolder({
                title: 'Follow Controller',
                expanded: true,
            });

            // [KO] 타겟과의 거리 및 보간(관성) 속도
            // [EN] Distance from target and interpolation (inertia) speed
            followFolder.addBinding(controller, 'distance', {
                min: 1,
                max: 50,
                step: 0.5,
            });
            followFolder.addBinding(controller, 'distanceInterpolation', {
                min: 0.01,
                max: 1,
                step: 0.01,
            });

            // [KO] 카메라 높이 및 보간 속도
            // [EN] Camera height and interpolation speed
            followFolder.addBinding(controller, 'height', {
                min: -10,
                max: 20,
                step: 0.5,
            });
            followFolder.addBinding(controller, 'heightInterpolation', {
                min: 0.01,
                max: 1,
                step: 0.01,
            });
            followFolder.addBinding(controller, 'interpolation', {
                min: 0.01,
                max: 1,
                step: 0.01,
            });

            // [KO] 카메라 회전 각도 설정 폴더
            // [EN] Camera rotation angle settings folder
            const rotationFolder = pane.addFolder({
                title: 'Camera Rotation',
                expanded: true,
            });

            rotationFolder.addBinding(controller, 'pan', {
                min: -180,
                max: 180,
                step: 1,
            });
            rotationFolder.addBinding(controller, 'panInterpolation', {
                min: 0.01,
                max: 1,
                step: 0.01,
            });

            rotationFolder.addBinding(controller, 'tilt', {
                min: -89,
                max: 89,
                step: 1,
            });
            rotationFolder.addBinding(controller, 'tiltInterpolation', {
                min: 0.01,
                max: 1,
                step: 0.01,
            });

            // [KO] 타겟의 회전(Rotation)을 따라갈지 여부
            // [EN] Whether to follow the target's rotation
            rotationFolder.addBinding(controller, 'followTargetRotation', {
                label: 'Follow Target Rotation',
            });

            // [KO] 타겟 오프셋(바라보는 중심점 이동) 설정 폴더
            // [EN] Target offset (move center of looking) settings folder
            const offsetFolder = pane.addFolder({
                title: 'Target Look At Offset',
                expanded: true,
            });

            offsetFolder.addBinding(controller, 'targetOffsetX', {
                label: 'Offset X',
                min: -5,
                max: 5,
                step: 0.1,
            });

            offsetFolder.addBinding(controller, 'targetOffsetY', {
                label: 'Offset Y',
                min: -5,
                max: 5,
                step: 0.1,
            });

            offsetFolder.addBinding(controller, 'targetOffsetZ', {
                label: 'Offset Z',
                min: -5,
                max: 5,
                step: 0.1,
            });

            offsetFolder.addButton({
                title: 'Reset Offset',
            }).on('click', () => {
                controller.setTargetOffset(0, 0, 0);
                pane.refresh();
            });

            // [KO] 프리셋 설정 폴더
            // [EN] Presets setup folder
            const presetFolder = pane.addFolder({
                title: 'Presets',
            });

            presetFolder.addButton({
                title: 'Reset All Delays',
            }).on('click', () => {
                controller.interpolation = 0.02;
                controller.distanceInterpolation = 0.02;
                controller.heightInterpolation = 0.02;
                controller.panInterpolation = 0.02;
                controller.tiltInterpolation = 0.02;
                pane.refresh();
            });

            presetFolder.addButton({
                title: 'Behind View',
            }).on('click', () => {
                controller.distance = 15;
                controller.height = 5;
                controller.pan = 0;
                controller.tilt = 20;
                controller.setTargetOffset(0, 0, 0);
                pane.refresh();
            });

            presetFolder.addButton({
                title: 'Top View',
            }).on('click', () => {
                controller.distance = 20;
                controller.height = 20;
                controller.pan = 0;
                controller.tilt = 60;
                controller.setTargetOffset(0, 0, 0);
                pane.refresh();
            });

            presetFolder.addButton({
                title: 'Side View',
            }).on('click', () => {
                controller.distance = 15;
                controller.height = 5;
                controller.pan = 90;
                controller.tilt = 10;
                controller.setTargetOffset(0, 0, 0);
                pane.refresh();
            });

            const update = () => {
                pane.refresh()
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }
    });
};
