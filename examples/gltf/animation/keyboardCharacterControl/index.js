import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";
import * as RedGPU from "../../../../dist/index.js?t=1792986333865";

/**
 * [KO] Keyboard Character Control 예제
 * [EN] Keyboard Character Control example
 *
 * [KO] 키보드(WASD/방향키, Shift)로 GLTF 캐릭터를 이동시키고 상태 머신으로 애니메이션을 제어합니다.
 * [EN] Controls GLTF character movement with the keyboard (WASD/Arrow keys, Shift) and animation transitions via a state machine.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

let characterController = null;

const WALK_SPEED = 3.0;
const RUN_SPEED = 7.0;

let stateMachine = null;
let targetStateName = 'Idle';
let lastTime = null;
let updateState = null;

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();

        const dirLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(dirLight);

        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 5;
        controller.pan = 110;
        controller.distance = 4;

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        loadCharacter(redGPUContext, scene, view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (timestamp) => {
            updateCharacter(timestamp, view, scene.getChildAt(0));
            if (updateState) updateState();
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU init failed:', failReason);
        const div = document.createElement('div');
        div.innerHTML = failReason;
        document.body.appendChild(div);
    }
);

function loadCharacter(redGPUContext, scene, view) {
    // [KO] 캐릭터 모델 로드 (출처: https://threejs.org/examples/models/gltf/Soldier.glb)
    // [EN] Load character model (Source: https://threejs.org/examples/models/gltf/Soldier.glb)
    const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';

    new RedGPU.GLTFLoader(
        redGPUContext,
        MODEL_URL,
        (loader) => {
            console.log(loader)
            const mesh = loader.resultMesh;
            mesh.rotationY = view.camera.pan + 180 + 45;

            scene.addChild(mesh);
            view.camera.centerX = mesh.x;
            view.camera.centerY = mesh.y + 1.0;
            view.camera.centerZ = mesh.z;
            view.camera.distance = 4;

            // [KO] 캐릭터 컨트롤러 생성
            // [EN] Create character controller
            characterController = new RedGPU.Charactor.SimpleCharacterController(
                redGPUContext,
                mesh,
                view.camera,
                {
                    speed: WALK_SPEED,
                    runSpeed: RUN_SPEED,
                    rotationSpeed: 8.0,
                    floorHeight: 0.0,
                }
            );

            // [KO] 애니메이션 클립 매핑 (Soldier.glb: 0=Idle, 1=Run, 2=TPose, 3=Walk)
            // [EN] Map animation clips (Soldier.glb: 0=Idle, 1=Run, 2=TPose, 3=Walk)
            const clips = loader.parsingResult.animations;
            if (clips && clips.length > 0) {
                const idleState = clips[0];
                const runState = clips[1];
                const walkState = clips[3] || clips[2];

                idleState.name = 'Idle';
                walkState.name = 'Walk';
                runState.name = 'Run';

                // [KO] 상태 머신 및 전이 그래프 설정
                // [EN] Set up state machine and transition graph
                stateMachine = new RedGPU.AnimStateMachine(idleState);
                stateMachine.addState(walkState);
                stateMachine.addState(runState);

                const BLEND = 0.25;

                const pairs = [
                    ['Idle', 'Walk'], ['Idle', 'Run'],
                    ['Walk', 'Idle'], ['Walk', 'Run'],
                    ['Run', 'Idle'], ['Run', 'Walk'],
                ];
                pairs.forEach(([from, to]) => {
                    stateMachine.addTransition({
                        fromState: from,
                        toState: to,
                        duration: BLEND,
                        conditions: () => targetStateName === to,
                    });
                });

                loader.stopAnimation();
                loader.playAnimation(idleState);
                if (loader.activeAnimations.length > 0) {
                    loader.activeAnimations[0].animStateMachine = stateMachine;
                }
            }
        },
        RedGPUExampleHelper.loadingProgressInfoHandler
    );
}

function updateCharacter(timestamp, view, targetMesh) {
    const character = targetMesh;
    if (!character || !characterController) return;

    const dt = lastTime !== null ? timestamp - lastTime : 0;
    lastTime = timestamp;
    if (dt <= 0) return;

    characterController.update(view, timestamp);

    // [KO] OrbitController가 캐릭터 눈높이를 추적하도록 갱신
    // [EN] Update OrbitController target to track the character's eye level
    const controller = view.camera;
    controller.centerX = character.x;
    controller.centerY = character.y + 1.0;
    controller.centerZ = character.z;

    if (characterController.isRunning) targetStateName = 'Run';
    else if (characterController.isMoving) targetStateName = 'Walk';
    else targetStateName = 'Idle';
}

function renderTestPane(redGPUContext, view) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        gui: (pane) => {
            const helpFolder = pane.addFolder({title: '⌨️ Controls'});
            const config = {
                move: 'W / S / A / D (Move)',
                turn: 'Drag Mouse (Rotate Camera)',
                run: 'Hold  Shift  while moving',
                state: 'Idle',
            };
            helpFolder.addBinding(config, 'move', {readonly: true});
            helpFolder.addBinding(config, 'turn', {readonly: true});
            helpFolder.addBinding(config, 'run', {readonly: true});

            const stateBinding = helpFolder.addBinding(config, 'state', {
                readonly: true
            });
            updateState = () => {
                if (stateMachine?.currentState) {
                    const nextState = stateMachine.targetState
                        ? `${stateMachine.currentState.name} ➔ ${stateMachine.targetState.name}`
                        : stateMachine.currentState.name;
                    if (config.state !== nextState) {
                        config.state = nextState;
                        stateBinding.refresh();
                    }
                }
            };
        },
        ibl: true,
        skybox: true,
    });
}
