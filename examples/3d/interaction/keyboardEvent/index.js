import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Keyboard Event 예제
 * [EN] Keyboard Event example
 *
 * [KO] keyboardKeyBuffer와 SimpleCharacterController를 사용하여 실시간 키보드 입력으로 3D 객체를 제어하는 방법을 시연합니다.
 * [EN] Demonstrates how to control a 3D object with real-time keyboard input using keyboardKeyBuffer and SimpleCharacterController.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.tilt = -25;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.axis = true;
        redGPUContext.addView(view);

        const ambientLight = new RedGPU.Light.AmbientLight();
        ambientLight.intensity = 0.5;
        scene.lightManager.ambientLight = ambientLight;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.color.setColorByHEX('#00cc99');
        const box = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1),
            material
        );
        box.y = 0.5;
        scene.addChild(box);

        // [KO] 키보드 기반 3D 캐릭터 컨트롤러 생성 (WASD/방향키 이동, Shift 달리기, Space 점프, Q/E 회전)
        // [EN] Create keyboard-based 3D character controller (WASD/Arrows move, Shift run, Space jump, Q/E turn)
        const characterController = new RedGPU.Charactor.SimpleCharacterController(
            redGPUContext,
            box,
            controller,
            {
                speed: 5.0,
                runSpeed: 10.0,
                rotationSpeed: 8.0,
                floorHeight: 0.5,
                gravity: 9.8,
                jumpForce: 6.0
            }
        );

        const {keyboardKeyBuffer} = redGPUContext;
        const inputState = {
            pressedKeys: 'None'
        };

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // [KO] 매 프레임 캐릭터 컨트롤러 업데이트 및 카메라 추적
            // [EN] Update character controller and camera tracking each frame
            characterController.update(view, time);
            controller.centerX = box.x;
            controller.centerY = box.y;
            controller.centerZ = box.z;

            const activeKeys = [];
            for (const key in keyboardKeyBuffer) {
                if (keyboardKeyBuffer[key]) {
                    activeKeys.push(key === ' ' ? 'Space' : key);
                }
            }
            inputState.pressedKeys = activeKeys.length ? activeKeys.join(', ') : 'None';
        });

        renderTestPane(redGPUContext, characterController, inputState);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, characterController, inputState) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const inputFolder = pane.addFolder({title: 'Keyboard Input (WASD / Space / Shift / Q,E)', expanded: true});
            inputFolder.addBinding(inputState, 'pressedKeys', {readonly: true, interval: 50});
            inputFolder.addBinding(characterController, 'isMoving', {readonly: true, interval: 50});
            inputFolder.addBinding(characterController, 'isRunning', {readonly: true, interval: 50});
            inputFolder.addBinding(characterController, 'isGrounded', {readonly: true, interval: 50});

            const controllerFolder = pane.addFolder({title: 'SimpleCharacterController', expanded: true});
            controllerFolder.addBinding(characterController, 'useKeyboard');
            controllerFolder.addBinding(characterController, 'orientRotationToMovement');
            controllerFolder.addBinding(characterController, 'useControllerRotationYaw');
            controllerFolder.addBinding(characterController, 'speed', {min: 1, max: 20, step: 0.5});
            controllerFolder.addBinding(characterController, 'runSpeed', {min: 1, max: 30, step: 0.5});
            controllerFolder.addBinding(characterController, 'rotationSpeed', {min: 1, max: 20, step: 0.5});
            controllerFolder.addBinding(characterController, 'jumpForce', {min: 1, max: 15, step: 0.5});
            controllerFolder.addBinding(characterController, 'gravity', {min: 1, max: 30, step: 0.5});
        }
    });
};
