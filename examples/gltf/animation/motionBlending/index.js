import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794639759027";
import * as RedGPU from "../../../../dist/index.js?t=1794639759027";

/**
 * [KO] Motion Blending 예제
 * [EN] Motion Blending example
 *
 * [KO] GLTF 애니메이션 모션 블렌딩을 시연합니다.
 * [EN] Demonstrates GLTF animation motion blending.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

let stateMachine = null;
let targetStateName = 'Idle';

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 5;
        controller.pan = 110;
        controller.distance = 3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 캐릭터 모델 로드 (출처: https://threejs.org/examples/models/gltf/Soldier.glb)
        // [EN] Load character model (Source: https://threejs.org/examples/models/gltf/Soldier.glb)
        const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
        loadGLTF(view, MODEL_URL);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const loadGLTF = (view, url) => {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (loader) => {
            const mesh = loader.resultMesh;
            mesh.rotationY = view.camera.pan + 180 + 45;
            scene.addChild(mesh);
            RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
            view.camera.distance = 2.3;

            const clips = loader.parsingResult.animations;
            console.log("Loaded clips:", clips.map((c, i) => `${i}: ${c.name || 'unnamed'}`));

            if (clips && clips.length > 0) {
                // [KO] Soldier.glb 애니메이션 클립 매핑 (0: Idle, 1: Run, 2: Walk, 3: WalkWithWeapon)
                // [EN] Map Soldier.glb animation clips (0: Idle, 1: Run, 2: Walk, 3: WalkWithWeapon)
                const idleState = clips[0];
                const runState = clips[1];
                const walkState = clips[3] || clips[2];

                idleState.name = "Idle";
                walkState.name = "Walk";
                runState.name = "Run";

                // [KO] 상태 머신 초기화 및 전이 조건 설정 (기본 지속 시간 0.5초)
                // [EN] Initialize state machine and transition conditions (default duration 0.5s)
                stateMachine = new RedGPU.AnimStateMachine(idleState);
                stateMachine.addState(walkState);
                stateMachine.addState(runState);

                const defaultDuration = 0.5;

                stateMachine.addTransition({
                    fromState: 'Idle', toState: 'Walk', duration: defaultDuration,
                    conditions: () => targetStateName === 'Walk'
                });
                stateMachine.addTransition({
                    fromState: 'Idle', toState: 'Run', duration: defaultDuration,
                    conditions: () => targetStateName === 'Run'
                });

                stateMachine.addTransition({
                    fromState: 'Walk', toState: 'Idle', duration: defaultDuration,
                    conditions: () => targetStateName === 'Idle'
                });
                stateMachine.addTransition({
                    fromState: 'Walk', toState: 'Run', duration: defaultDuration,
                    conditions: () => targetStateName === 'Run'
                });

                stateMachine.addTransition({
                    fromState: 'Run', toState: 'Idle', duration: defaultDuration,
                    conditions: () => targetStateName === 'Idle'
                });
                stateMachine.addTransition({
                    fromState: 'Run', toState: 'Walk', duration: defaultDuration,
                    conditions: () => targetStateName === 'Walk'
                });

                // [KO] Idle 상태 재생 시작 및 상태 머신 주입
                // [EN] Start playing Idle state and bind the state machine
                loader.playAnimation(idleState);
                if (loader.activeAnimations.length > 0) {
                    const playInfo = loader.activeAnimations[0];
                    playInfo.animStateMachine = stateMachine;
                }
            }
        },
        RedGPUExampleHelper.loadingProgressInfoHandler
    );
};

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        gui: (pane) => {
            const config = {
                fadeDuration: 0.5,
                targetState: 'Idle',
                currentState: 'Idle'
            };

            const f = pane.addFolder({title: 'AnimGraph Motion Blending'});

            f.addBinding(config, 'fadeDuration', {
                min: 0.1, max: 3.0, step: 0.1, label: 'Fade Duration (s)'
            }).on('change', (ev) => {
                if (stateMachine) {
                    stateMachine.transitions.forEach(t => {
                        t.duration = ev.value;
                    });
                }
            });

            const currentStateBinding = f.addBinding(config, 'currentState', {
                readonly: true,
                label: 'Current State'
            });

            let transitionTimer = null;
            const triggerTransition = (target) => {
                if (transitionTimer) clearTimeout(transitionTimer);

                targetStateName = target;
                if (stateMachine && stateMachine.currentState) {
                    if (stateMachine.currentState.name === target) {
                        config.currentState = target;
                        currentStateBinding.refresh();
                        return;
                    }

                    config.currentState = `${stateMachine.currentState.name} ➔ ${target}`;
                    currentStateBinding.refresh();

                    transitionTimer = setTimeout(() => {
                        if (stateMachine && stateMachine.currentState) {
                            config.currentState = stateMachine.currentState.name;
                            currentStateBinding.refresh();
                        }
                        transitionTimer = null;
                    }, config.fadeDuration * 1000);
                }
            };

            f.addButton({title: 'Transition to Idle'}).on('click', () => {
                triggerTransition('Idle');
            });
            f.addButton({title: 'Transition to Walk'}).on('click', () => {
                triggerTransition('Walk');
            });
            f.addButton({title: 'Transition to Run'}).on('click', () => {
                triggerTransition('Run');
            });
        },
        ibl: true,
        skybox: true,
    });
};
