import * as RedGPU from "../../../../dist/index.js?t=1783322366074";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783322366074";

/**
 * [KO] 키보드 인터랙션 예제
 * [EN] Keyboard interaction example
 *
 * [KO] keyboardKeyBuffer를 사용하여 실시간 키보드 입력 상태를 확인하고, 3D 객체를 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to check real-time keyboard input state and control 3D objects using keyboardKeyBuffer.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const {detector} = redGPUContext;
        const isMobile = detector.isMobile;

        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 2. 조명 설정
        const ambientLight = new RedGPU.Light.AmbientLight();
        ambientLight.lux = 500;
        scene.lightManager.ambientLight = ambientLight;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // 3. 제어할 박스 메시 생성
        const box = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.PhongMaterial(redGPUContext)
        );
        box.material.color.setColorByHEX('#00CC99');
        scene.addChild(box);

        // 4. 캐릭터 컨트롤러 설정
        const characterController = new RedGPU.Charactor.SimpleCharacterController(
            redGPUContext,
            box,
            controller,
            {
                speed: 5.0,
                runSpeed: 10.0,
                rotationSpeed: 8.0,
                floorHeight: 0.0,
                gravity: 9.8,
                jumpForce: 6.0
            }
        );
        const {keyboardKeyBuffer} = redGPUContext;

        // 실시간 키 상태 표시를 위한 객체
        const activeKeysState = {
            value: 'None',
            update: () => {
                const activeKeys = Object.entries(keyboardKeyBuffer)
                    .filter(([key, pressed]) => pressed)
                    .map(([key]) => key === ' ' ? 'Space' : key)
                    .join(', ');
                activeKeysState.value = activeKeys || 'None';
            }
        };

        // 5. 렌더 루프 함수 정의
        const render = (time) => {
            // 캐릭터 컨트롤러 업데이트 (이동, 회전, 중력 및 점프가 통합 연산됨)
            characterController.update(view, time);

            // 카메라 추적
            controller.centerX = box.x;
            controller.centerY = box.y;
            controller.centerZ = box.z;

            // UI 갱신
            activeKeysState.update();
        };

        // 6. 리사이즈 핸들러 설정
        /**
         * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the screen size changes.
         */
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.pixelRectObject;
            const aspect = width / height;
            const baseDistance = isMobile ? 12 : 15;

            // 화면 비율에 맞춰 카메라 거리 자동 조절
            controller.distance = aspect < 1 ? baseDistance / aspect : baseDistance;
        };

        // 초기 리사이즈 실행
        redGPUContext.onResize({
            target: redGPUContext,
            screenRectObject: redGPUContext.screenRectObject,
            pixelRectObject: redGPUContext.pixelRectObject
        });

        // 7. 렌더링 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, activeKeysState);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = async (redGPUContext, activeKeysState) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            pane.addBlade({
                view: 'text',
                label: 'Movement',
                value: 'WASD / Arrows',
                parse: (v) => v,
                readonly: true
            });
            pane.addBlade({
                view: 'text',
                label: 'Action',
                value: 'Space: Lift, Q/E: Rotate',
                parse: (v) => v,
                readonly: true
            });

            const activeKeysFolder = pane.addFolder({title: 'Active Keys'});
            activeKeysFolder.addBinding(activeKeysState, 'value', {
                label: 'Pressed',
                readonly: true
            });
        }
    });
};
