import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781144235516";
import * as RedGPU from "../../../../dist/index.js?t=1781144235516";

/**
 * Keyboard Character Control 예제
 *
 * - WASD / 방향키 : 캐릭터 이동 (카메라 기준 방향)
 * - Shift         : 달리기 (Run)
 * - 이동 없음      : Idle
 * - 카메라는 FollowController로 캐릭터를 자동 추적
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// ──────────────────────────────────────────
// 키 입력 상태
// ──────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
});
window.addEventListener('keyup', e => {
    keys[e.code] = false;
});

const isMoving = () => keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD']
    || keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight'];
const isRunning = () => isMoving() && (keys['ShiftLeft'] || keys['ShiftRight']);

// 이동 속도 (단위/ms)
const WALK_SPEED = 0.003;
const RUN_SPEED = 0.007;

// ──────────────────────────────────────────
// 상태 변수
// ──────────────────────────────────────────
let stateMachine = null;   // AnimStateMachine
let targetStateName = 'Idle';
let lastTime = null;

// ──────────────────────────────────────────
// RedGPU 초기화
// ──────────────────────────────────────────
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // ── 씬 ──────────────────────────────
        const scene = new RedGPU.Display.Scene();

        // ── 조명 ────────────────────────────
        const dirLight = new RedGPU.Light.DirectionalLight();
        dirLight.intensity = 1.5;
        scene.lightManager.addDirectionalLight(dirLight);

        // ── FollowController ─────────────────
        // const controller = new RedGPU.Camera.FollowController(redGPUContext);
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        // controller.distance = 5;
        // controller.height   = 2;
        // controller.tilt     = 5;

        // ── View ─────────────────────────────
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // ── GLTF 로드 ────────────────────────
        loadCharacter(redGPUContext, scene, view);

        // ── 렌더 루프 ────────────────────────
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (timestamp) => {
            updateCharacter(timestamp, controller, scene.getChildAt(0));
        });

        // ── GUI ──────────────────────────────
        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU init failed:', failReason);
        const div = document.createElement('div');
        div.innerHTML = failReason;
        document.body.appendChild(div);
    }
);

// ──────────────────────────────────────────
// GLTF 캐릭터 로드
// ──────────────────────────────────────────
function loadCharacter(redGPUContext, scene, view) {
    const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';

    new RedGPU.GLTFLoader(
        redGPUContext,
        MODEL_URL,
        (loader) => {
            const mesh = loader.resultMesh;

            // character(빈 Mesh) 의 자식으로 추가
            scene.addChild(mesh);
            view.camera.targetMesh = mesh;
            // mesh.x = 50
            // mesh.z = 50
            // FollowController 가 이미 character 를 추적 중이므로
            // 별도 fitMeshToScreenCenter 불필요

            // ── 애니메이션 클립 매핑 ─────────
            const clips = loader.parsingResult.animations;
            // Soldier.glb: 0=Idle, 1=Run, 2=TPose, 3=Walk
            if (clips && clips.length > 0) {
                const idleState = clips[0];
                const runState = clips[1];
                const walkState = clips[3] || clips[2];

                idleState.name = 'Idle';
                walkState.name = 'Walk';
                runState.name = 'Run';

                // ── 상태 머신 ──────────────────
                stateMachine = new RedGPU.AnimStateMachine(idleState);
                stateMachine.addState(walkState);
                stateMachine.addState(runState);

                const BLEND = 0.25; // 전이 시간 (초)

                // Idle ↔ Walk ↔ Run 전이 그래프
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

                // 기존 자동 재생 정지 후, 재생 시작 + 상태 머신 주입
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

// ──────────────────────────────────────────
// 매 프레임 캐릭터 이동 처리
// ──────────────────────────────────────────
function updateCharacter(timestamp, followController, targetMesh) {
    const character = targetMesh
    if (!character) return;

    const dt = lastTime !== null ? timestamp - lastTime : 0;
    lastTime = timestamp;
    if (dt <= 0) return;

    // ── 상태 전이 판단 ────────────────────
    if (isRunning()) targetStateName = 'Run';
    else if (isMoving()) targetStateName = 'Walk';
    else targetStateName = 'Idle';

    if (!isMoving()) return;

    // ── 이동 방향 계산 (카메라 수평 방향 기준) ──
    const speed = isRunning() ? RUN_SPEED : WALK_SPEED;

    // 카메라의 수평 방위각(yaw)을 구함
    // FollowController 에 pan 프로퍼티가 없으면 rotationY 직접 계산
    const camYaw = followController.pan !== undefined
        ? (followController.pan * Math.PI / 180)
        : 0;

    // WASD 입력 벡터 (로컬)
    let fx = 0, fz = 0;
    if (keys['KeyW'] || keys['ArrowUp']) fz -= 5;
    if (keys['KeyS'] || keys['ArrowDown']) fz += 5;
    if (keys['KeyA'] || keys['ArrowLeft']) fx -= 5;
    if (keys['KeyD'] || keys['ArrowRight']) fx += 5;

    // 정규화
    const len = Math.sqrt(fx * fx + fz * fz);
    if (len === 0) return;
    fx /= len;
    fz /= len;

    // 카메라 방위각 기준으로 월드 방향 변환
    const sinY = Math.sin(camYaw);
    const cosY = Math.cos(camYaw);
    const worldX = fx * cosY - fz * sinY;
    const worldZ = fx * sinY + fz * cosY;

    // 캐릭터 이동
    character.x += worldX * speed * dt;
    character.z += worldZ * speed * dt;

    // 캐릭터가 진행 방향을 향해 회전 (Y축)
    const targetAngle = Math.atan2(worldX, worldZ) * (180 / Math.PI);
    // 부드러운 회전 보간 (lerp)
    let delta = targetAngle - character.rotationY;
    // -180 ~ 180 범위로 정규화
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    character.rotationY += delta * Math.min(1, dt * 0.015);
}

// ──────────────────────────────────────────
// GUI 패널
// ──────────────────────────────────────────
function renderTestPane(redGPUContext, view) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        gui: (pane) => {
            // 조작 안내
            const helpFolder = pane.addFolder({title: '⌨️ Controls'});
            const config = {
                move: 'W / A / S / D  or  Arrow Keys',
                run: 'Hold  Shift  while moving',
                state: 'Idle',
            };
            helpFolder.addBinding(config, 'move', {readonly: true, label: 'Move'});
            helpFolder.addBinding(config, 'run', {readonly: true, label: 'Run'});

            // 현재 상태 모니터
            const stateBinding = helpFolder.addBinding(config, 'state', {
                readonly: true, label: 'Anim State'
            });
            setInterval(() => {
                if (stateMachine?.currentState) {
                    config.state = stateMachine.targetState
                        ? `${stateMachine.currentState.name} ➔ ${stateMachine.targetState.name}`
                        : stateMachine.currentState.name;
                    stateBinding.refresh();
                }
            }, 100);

            // 카메라 설정
            const {camera} = view;
            if (camera) {
                const camFolder = pane.addFolder({title: '📷 Camera'});
                const camConfig = {distance: 5, height: 2};

                camFolder.addBinding(camConfig, 'distance', {
                    min: 2, max: 15, step: 0.5, label: 'Distance'
                }).on('change', ev => {
                    camera.distance = ev.value;
                });

                camFolder.addBinding(camConfig, 'height', {
                    min: 0, max: 6, step: 0.25, label: 'Height'
                }).on('change', ev => {
                    camera.height = ev.value;
                });
            }
        },
        ibl: true,
        skybox: true,
    });
}
