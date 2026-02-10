import * as RedGPU from "../../../../dist/index.js?t=1770699661827";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Keyboard Interaction 예제
 * [EN] Keyboard Interaction example
 *
 * [KO] keyboardKeyBuffer를 사용하여 매 프레임 키보드 상태를 체크하고 객체를 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to check keyboard state every frame and control an object using keyboardKeyBuffer.
 */

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const ambientLight = new RedGPU.Light.AmbientLight();
        ambientLight.intensity = 0.5;
        scene.lightManager.ambientLight = ambientLight;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 제어할 박스 메쉬 생성
        // [EN] Create a box mesh to control
        const box = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.PhongMaterial(redGPUContext)
        );
        box.material.color.setColorByHEX('#00CC99');
        scene.addChild(box);

        const speed = 0.1;
        let lastTime = 0;

        // [KO] 실시간 키 상태를 표시하기 위한 데이터 객체
        // [EN] Data object for displaying real-time key states
        const {keyboardKeyBuffer} = redGPUContext;
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

        const render = (time) => {
            const deltaTime = lastTime ? Math.min((time - lastTime) / 16.666, 2) : 1;
            lastTime = time;

            // [KO] 카메라 각도에 따른 이동 방향 벡터 계산
            // [EN] Calculate movement direction vectors based on camera angle
            const panRad = controller.pan * Math.PI / 180;
            const forwardX = -Math.sin(panRad);
            const forwardZ = -Math.cos(panRad);
            const rightX = Math.cos(panRad);
            const rightZ = -Math.sin(panRad);

            let moveX = 0;
            let moveZ = 0;

            // [KO] 입력 처리
            // [EN] Handle input
            if (keyboardKeyBuffer['w'] || keyboardKeyBuffer['W'] || keyboardKeyBuffer['ArrowUp']) {
                moveX += forwardX;
                moveZ += forwardZ;
            }
            if (keyboardKeyBuffer['s'] || keyboardKeyBuffer['S'] || keyboardKeyBuffer['ArrowDown']) {
                moveX -= forwardX;
                moveZ -= forwardZ;
            }
            if (keyboardKeyBuffer['a'] || keyboardKeyBuffer['A'] || keyboardKeyBuffer['ArrowLeft']) {
                moveX -= rightX;
                moveZ -= rightZ;
            }
            if (keyboardKeyBuffer['d'] || keyboardKeyBuffer['D'] || keyboardKeyBuffer['ArrowRight']) {
                moveX += rightX;
                moveZ += rightZ;
            }

            // [KO] 이동 적용 (정규화 및 속도 반영)
            // [EN] Apply movement (normalization and speed)
            const moveLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
            const currentSpeed = speed * deltaTime;
            if (moveLen > 0) {
                box.x += (moveX / moveLen) * currentSpeed;
                box.z += (moveZ / moveLen) * currentSpeed;
            }

            // [KO] 상승/하강 (Space)
            // [EN] Lift/Fall (Space)
            if (keyboardKeyBuffer[' ']) {
                box.y += currentSpeed;
            } else {
                if (box.y > 0) box.y = Math.max(0, box.y - currentSpeed * 0.5);
            }

            // [KO] 회전 (Q, E)
            // [EN] Rotation (Q, E)
            const rotationAmount = 2 * deltaTime;
            if (keyboardKeyBuffer['q'] || keyboardKeyBuffer['Q']) box.rotationY += rotationAmount;
            if (keyboardKeyBuffer['e'] || keyboardKeyBuffer['E']) box.rotationY -= rotationAmount;

            // [KO] 카메라 추적 및 UI 갱신
            // [EN] Camera tracking and UI update
            controller.centerX = box.x;
            controller.centerY = box.y;
            controller.centerZ = box.z;

            activeKeysState.update();
        };

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, activeKeysState);
    },
    (failReason) => {
        console.error(failReason);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {Object} activeKeysState
 */
const renderTestPane = async (redGPUContext, activeKeysState) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770699661827');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770699661827");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

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
};
