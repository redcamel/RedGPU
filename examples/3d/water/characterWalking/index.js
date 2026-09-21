import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 설정 (3인칭 추적 뷰)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 9.0;
        controller.tilt = -10;
        controller.pan = 180;
        controller.speedDistance = 0.2;
        controller.minDistance = 3;
        controller.maxDistance = 25;

        // 2. 씬 및 뷰 생성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 3. IBL 환경 맵 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);

        // 4. 태양 방향성 라이트 추가 (조도 75,000 Lux 지정)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 32;
        directionalLight.azimuth = 145;
        directionalLight.color.setColorByHEX('#fffbf0');
        directionalLight.lux = 75000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 경사 수중 지형 생성 (Z축 이동에 따라 자연스러운 수심 변화)
        createBeachEnvironment(redGPUContext, scene);

        // 지형의 높낮이 계산 함수 (Z축으로 갈수록 깊어지는 경사로)
        const getLakeFloorHeight = (x, z) => {
            return -1.212 - (z - 0.156) * 0.158384;
        };

        // 6. 호수 수체(WaterLake) 생성 및 듀얼 노멀 바인딩
        const lake = new RedGPU.Display.Water.WaterLake(redGPUContext, 160, 160, 80, 80);
        lake.waterLevel = 0.5;

        lake.waterMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        lake.waterMaterial.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        scene.addWater(lake);

        // 7. GLTF 캐릭터(Soldier) 로딩 및 애니메이션 머신/컨트롤러 초기화
        let characterMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';
        let lastTime = null;

        const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
        new RedGPU.GLTFLoader(
            redGPUContext,
            MODEL_URL,
            (loader) => {
                characterMesh = loader.resultMesh;

                // 물 밖 해변(Z = -12)에서 시작
                characterMesh.x = 0;
                characterMesh.z = -12;
                characterMesh.y = getLakeFloorHeight(characterMesh.x, characterMesh.z);

                characterMesh.setCastShadowRecursively(true);
                characterMesh.setReceiveShadowRecursively(true);
                scene.addChild(characterMesh);

                // 스킨드 메시의 모든 자식 계층을 물 상호작용 대상으로 재귀 등록
                characterMesh.setEnableWaterInteractionRecursively(true, 1.4);

                // 카메라 추적 중심점 정렬
                controller.centerX = characterMesh.x;
                controller.centerY = characterMesh.y + 1.2;
                controller.centerZ = characterMesh.z;

                // 캐릭터 이동 컨트롤러 (WASD 이동, Shift 달리기, Space 점프)
                characterController = new RedGPU.Charactor.SimpleCharacterController(
                    redGPUContext,
                    characterMesh,
                    view.camera,
                    {
                        speed: 3.5,
                        runSpeed: 7.0,
                        gravity: 24.0,
                        jumpForce: 8.0,
                        getFloorHeight: getLakeFloorHeight,
                    }
                );

                // 애니메이션 클립 바인딩 및 상태 머신(AnimStateMachine) 구성
                const clips = loader.parsingResult.animations;
                if (clips && clips.length > 0) {
                    const idleState = clips[0];
                    const runState = clips[1];
                    const walkState = clips[3] || clips[2];

                    idleState.name = 'Idle';
                    walkState.name = 'Walk';
                    runState.name = 'Run';

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

                // Tweakpane GUI 구성 (캐릭터 로딩 완료 후 컨트롤러 바인딩)
                renderTestPane(redGPUContext, lake, characterController, directionalLight);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        // 8. 렌더러 시작 및 매 프레임 업데이트 루프 (Zero-GC 철저 준수)
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            if (characterMesh && characterController) {
                const dt = lastTime !== null ? time - lastTime : 0;
                lastTime = time;

                if (dt > 0) {
                    characterController.update(view, time);

                    // 카메라가 캐릭터 위치를 부드럽게 추적
                    controller.centerX = characterMesh.x;
                    controller.centerY = characterMesh.y + 1.2;
                    controller.centerZ = characterMesh.z;

                    // 이동 및 달리기 상태 판정 -> 애니메이션 크로스페이드 전이
                    if (characterController.isRunning) {
                        targetStateName = 'Run';
                    } else if (characterController.isMoving) {
                        targetStateName = 'Walk';
                    } else {
                        targetStateName = 'Idle';
                    }
                }
            }
        };
        renderer.start(redGPUContext, render);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 수심 변화를 체감할 수 있는 완만한 경사 지형을 생성합니다.
 */
function createBeachEnvironment(redGPUContext, scene) {
    // 1. 완만한 경사를 가진 호수 바닥 지형
    const seabedMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    seabedMaterial.baseColorFactor = [0.28, 0.26, 0.22, 1.0];
    seabedMaterial.roughnessFactor = 0.92;
    seabedMaterial.metallicFactor = 0.0;

    const seabedGeom = new RedGPU.Primitive.Box(redGPUContext, 200, 2.0, 200);
    const seabedMesh = new RedGPU.Display.Mesh(redGPUContext, seabedGeom, seabedMaterial);
    seabedMesh.x = 0;
    seabedMesh.y = -2.2;
    seabedMesh.z = 0;
    seabedMesh.rotationX = 9.0; // Z축으로 갈수록 깊어지는 경사
    seabedMesh.receiveShadow = true;
    scene.addChild(seabedMesh);

    // 2. 물 밖 해변 모래사장 지형
    const beachMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    beachMaterial.baseColorFactor = [0.65, 0.58, 0.45, 1.0];
    beachMaterial.roughnessFactor = 0.95;
    beachMaterial.metallicFactor = 0.0;

    const beachGeom = new RedGPU.Primitive.Box(redGPUContext, 200, 2.0, 40);
    const beachMesh = new RedGPU.Display.Mesh(redGPUContext, beachGeom, beachMaterial);
    beachMesh.x = 0;
    beachMesh.y = 0.35;
    beachMesh.z = -30;
    beachMesh.rotationX = 13.5;
    beachMesh.castShadow = true;
    beachMesh.receiveShadow = true;
    scene.addChild(beachMesh);
}

/**
 * [KO] Tweakpane GUI를 구성하여 수체 파동 시뮬레이션 및 캐릭터 속성을 제어합니다.
 */
function renderTestPane(redGPUContext, lake, characterController, directionalLight) {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. WaterLake (수체 파동 시뮬레이션)
            const lakeFolder = pane.addFolder({title: 'WaterLake (수체 파동 시뮬레이션)', expanded: true});

            lakeFolder.addBinding(lake, 'interactionEnabled');
            lakeFolder.addBinding(lake, 'rippleWaveSpeed', {min: 0.05, max: 0.8, step: 0.01});
            lakeFolder.addBinding(lake, 'rippleDamping', {min: 0.001, max: 0.05, step: 0.001});
            lakeFolder.addBinding(lake, 'rippleNormalStrength', {min: 0.0, max: 4.0, step: 0.1});
            lakeFolder.addBinding(lake, 'interactionDomainSize', {min: 8.0, max: 48.0, step: 2.0});
            if (typeof lake.maxPenetration === 'number') {
                lakeFolder.addBinding(lake, 'maxPenetration', {min: 0.05, max: 1.0, step: 0.05});
            }
            lakeFolder.addBinding(lake, 'waterLevel', {min: -1.0, max: 2.0, step: 0.05});

            // 2. SimpleCharacterController (캐릭터 컨트롤러)
            const charFolder = pane.addFolder({title: 'SimpleCharacterController (캐릭터 컨트롤러)', expanded: true});

            charFolder.addBinding(characterController, 'speed', {min: 1.0, max: 8.0, step: 0.2});
            charFolder.addBinding(characterController, 'runSpeed', {min: 3.0, max: 15.0, step: 0.5});
            charFolder.addBinding(characterController, 'jumpForce', {min: 4.0, max: 16.0, step: 0.5});

            // 3. DirectionalLight (직사광)
            const lightFolder = pane.addFolder({title: 'DirectionalLight (직사광)', expanded: false});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
}
