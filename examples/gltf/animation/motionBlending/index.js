import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";
import * as RedGPU from "../../../../dist/index.js?t=1783326645983";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

let stateMachine = null;
let targetStateName = 'Idle';

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 카메라 및 뷰 세팅
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;
        controller.distance = 4;
        controller.panY = 1.0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 조명 추가
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // Soldier 모델 로드
        const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
        loadGLTF(view, MODEL_URL);

        // 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // 매 프레임 필요한 추가 연산이 있다면 여기에 기입
        });

        // GUI 패널 렌더링
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
            scene.addChild(mesh);
            RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);

            // 모델에 담긴 애니메이션 클립 목록 조회
            const clips = loader.parsingResult.animations;
            console.log("Loaded clips:", clips.map((c, i) => `${i}: ${c.name || 'unnamed'}`));

            if (clips && clips.length > 0) {
                // Soldier.glb의 보편적 애니메이션 구조 매핑
                // 0: Idle, 1: Run, 2: Walk, 3: WalkWithWeapon 등
                // clips[]는 이미 ClipAnimState 배열이므로 바로 사용
                const idleState = clips[0];
                const runState = clips[1];
                const walkState = clips[3] || clips[2]; // WalkWithWeapon 또는 Walk 적용

                // 상태 이름 설정 (GLTF 파일 내 이름을 그대로 사용하거나 덮어쓰기)
                idleState.name = "Idle";
                walkState.name = "Walk";
                runState.name = "Run";

                // 상태 머신 초기화 (기본 상태: Idle)
                stateMachine = new RedGPU.AnimStateMachine(idleState);
                stateMachine.addState(walkState);
                stateMachine.addState(runState);

                // 전이 조건 및 기본 지속 시간 0.5초 세팅
                const defaultDuration = 0.5;

                // Idle ➔ Walk / Run
                stateMachine.addTransition({
                    fromState: 'Idle', toState: 'Walk', duration: defaultDuration,
                    conditions: () => targetStateName === 'Walk'
                });
                stateMachine.addTransition({
                    fromState: 'Idle', toState: 'Run', duration: defaultDuration,
                    conditions: () => targetStateName === 'Run'
                });

                // Walk ➔ Idle / Run
                stateMachine.addTransition({
                    fromState: 'Walk', toState: 'Idle', duration: defaultDuration,
                    conditions: () => targetStateName === 'Idle'
                });
                stateMachine.addTransition({
                    fromState: 'Walk', toState: 'Run', duration: defaultDuration,
                    conditions: () => targetStateName === 'Run'
                });

                // Run ➔ Idle / Walk
                stateMachine.addTransition({
                    fromState: 'Run', toState: 'Idle', duration: defaultDuration,
                    conditions: () => targetStateName === 'Idle'
                });
                stateMachine.addTransition({
                    fromState: 'Run', toState: 'Walk', duration: defaultDuration,
                    conditions: () => targetStateName === 'Walk'
                });

                // Idle 상태부터 재생 시작, 상태 머신 주입
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

            // 전이 페이드 시간 설정
            f.addBinding(config, 'fadeDuration', {
                min: 0.1, max: 3.0, step: 0.1, label: 'Fade Duration (s)'
            }).on('change', (ev) => {
                if (stateMachine) {
                    stateMachine.transitions.forEach(t => {
                        t.duration = ev.value;
                    });
                }
            });

            // 실시간 상태 표시
            const currentStateBinding = f.addBinding(config, 'currentState', {
                readonly: true,
                label: 'Current State'
            });

            // 상태 모니터링 주기적 갱신
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

            // 상태 전이 촉발 버튼
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
