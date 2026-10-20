import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Lake Character Walking 예제
 * [EN] Lake Character Walking Example
 *
 * [KO] 스킨드 메시(Soldier GLTF) 캐릭터가 경사 해변과 호숫가를 걸을 때 발생하는 발걸음 파동 및 실시간 수체 상호작용을 시연합니다.
 * [EN] Demonstrates footstep ripples and real-time water interaction as a skinned GLTF character walks along the sloped beach and lake.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 9.0;
        controller.tilt = -10;
        controller.pan = 180;
        controller.speedDistance = 0.2;
        controller.minDistance = 3;
        controller.maxDistance = 25;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 32;
        directionalLight.azimuth = 145;
        directionalLight.color.setColorByHEX('#fffbf0');
        directionalLight.lux = 75000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] Z축 이동에 따라 자연스럽게 수심이 깊어지는 경사 해변/수중 지형 생성
        // [EN] Create sloped beach and seabed terrain where water depth increases along Z-axis
        createBeachEnvironment(redGPUContext, scene);

        const getLakeFloorHeight = (x, z) => {
            return -1.212 - (z - 0.156) * 0.158384;
        };

        // [KO] 호수 수체(Lake) 생성 및 선형('rgba8unorm') 듀얼 노멀 바인딩
        // [EN] Create Lake water body and bind linear ('rgba8unorm') dual normal textures
        const lake = new RedGPU.Water.Lake(redGPUContext, 160, 160, 80, 80);
        lake.waterLevel = 0.5;
        lake.waterMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        lake.waterMaterial.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        scene.addWater(lake);

        let characterMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';
        let lastTime = null;

        // [KO] 로컬 스킨드 메시(Soldier.glb) 로드 및 수체 상호작용 재귀 등록
        // [EN] Load local skinned mesh (Soldier.glb) and recursively register for water interaction
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../../assets/gltf/Soldier.glb',
            (loader) => {
                characterMesh = loader.resultMesh;
                characterMesh.x = 0;
                characterMesh.z = -12;
                characterMesh.y = getLakeFloorHeight(characterMesh.x, characterMesh.z);

                characterMesh.setCastShadowRecursively(true);
                characterMesh.setReceiveShadowRecursively(true);
                scene.addChild(characterMesh);

                characterMesh.setEnableWaterInteractionRecursively(true, 1.4);
                lake.interactionFollowTarget = characterMesh;

                controller.centerX = characterMesh.x;
                controller.centerY = characterMesh.y + 1.2;
                controller.centerZ = characterMesh.z;

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
                    [
                        ['Idle', 'Walk'], ['Idle', 'Run'],
                        ['Walk', 'Idle'], ['Walk', 'Run'],
                        ['Run', 'Idle'], ['Run', 'Walk'],
                    ].forEach(([from, to]) => {
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

                renderTestPane(redGPUContext, lake, characterController, directionalLight);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (characterMesh && characterController) {
                const dt = lastTime !== null ? time - lastTime : 0;
                lastTime = time;

                if (dt > 0) {
                    characterController.update(view, time);

                    controller.centerX = characterMesh.x;
                    controller.centerY = characterMesh.y + 1.2;
                    controller.centerZ = characterMesh.z;

                    if (characterController.isRunning) {
                        targetStateName = 'Run';
                    } else if (characterController.isMoving) {
                        targetStateName = 'Walk';
                    } else {
                        targetStateName = 'Idle';
                    }
                }
            }
        });
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createBeachEnvironment = (redGPUContext, scene) => {
    const sandTexture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        '../../../../assets/water/damp_beach_sand_diff_1k.jpg'
    );
    const sandNormal = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        '../../../../assets/water/damp_beach_sand_nor_gl_1k.jpg',
        true,
        null,
        null,
        'rgba8unorm'
    );
    const sandSampler = new RedGPU.Resource.Sampler(redGPUContext, {
        addressModeU: RedGPU.GPU_ADDRESS_MODE.REPEAT,
        addressModeV: RedGPU.GPU_ADDRESS_MODE.REPEAT,
        minFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
        magFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
        mipmapFilter: RedGPU.GPU_MIPMAP_FILTER_MODE.LINEAR
    });

    const seabedMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    seabedMaterial.baseColorTexture = sandTexture;
    seabedMaterial.baseColorTextureSampler = sandSampler;
    seabedMaterial.normalTexture = sandNormal;
    seabedMaterial.normalTextureSampler = sandSampler;
    seabedMaterial.textureScale = [40, 40];
    seabedMaterial.baseColorFactor = [0.55, 0.52, 0.48, 1.0];
    seabedMaterial.roughnessFactor = 0.88;
    seabedMaterial.metallicFactor = 0.0;

    const seabedMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 200, 2.0, 200),
        seabedMaterial
    );
    seabedMesh.setPosition(0, -2.2, 0);
    seabedMesh.rotationX = 9.0;
    seabedMesh.receiveShadow = true;
    scene.addChild(seabedMesh);

    const beachMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    beachMaterial.baseColorTexture = sandTexture;
    beachMaterial.baseColorTextureSampler = sandSampler;
    beachMaterial.normalTexture = sandNormal;
    beachMaterial.normalTextureSampler = sandSampler;
    beachMaterial.textureScale = [40, 8];
    beachMaterial.baseColorFactor = [1.0, 0.98, 0.95, 1.0];
    beachMaterial.roughnessFactor = 0.95;
    beachMaterial.metallicFactor = 0.0;

    const beachMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 200, 2.0, 40),
        beachMaterial
    );
    beachMesh.setPosition(0, 0.35, -30);
    beachMesh.rotationX = 13.5;
    beachMesh.castShadow = true;
    beachMesh.receiveShadow = true;
    scene.addChild(beachMesh);
};

const renderTestPane = (redGPUContext, lake, characterController, directionalLight) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lakeFolder = pane.addFolder({title: 'Lake', expanded: true});
            lakeFolder.addBinding(lake, 'interactionEnabled');
            lakeFolder.addBinding(lake, 'rippleWaveSpeed', {min: 0.05, max: 0.8, step: 0.01});
            lakeFolder.addBinding(lake, 'rippleDamping', {min: 0.001, max: 0.05, step: 0.001});
            lakeFolder.addBinding(lake, 'rippleNormalStrength', {min: 0.0, max: 4.0, step: 0.1});
            lakeFolder.addBinding(lake, 'interactionDomainSize', {min: 8.0, max: 48.0, step: 2.0});
            lakeFolder.addBinding(lake, 'maxPenetration', {min: 0.05, max: 1.0, step: 0.05});
            lakeFolder.addBinding(lake, 'waterLevel', {min: -1.0, max: 2.0, step: 0.05});

            const charFolder = pane.addFolder({title: 'SimpleCharacterController', expanded: true});
            charFolder.addBinding(characterController, 'speed', {min: 1.0, max: 8.0, step: 0.2});
            charFolder.addBinding(characterController, 'runSpeed', {min: 3.0, max: 15.0, step: 0.5});
            charFolder.addBinding(characterController, 'jumpForce', {min: 4.0, max: 16.0, step: 0.5});

            const lightFolder = pane.addFolder({title: 'DirectionalLight', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
};
