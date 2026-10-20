import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Character Walking 예제
 * [EN] Character Walking Example
 *
 * [KO] 스키닝 캐릭터(Soldier.glb)의 해변/수중 보행에 따른 실시간 동적 물결(Ripple) 생성과 파동 시뮬레이션 도메인 추적(interactionFollowTarget)을 시연합니다.
 * [EN] Demonstrates real-time dynamic ripple generation and wave simulation domain tracking (interactionFollowTarget) as a skinned character (Soldier.glb) walks through the beach and shallow water.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 28;
        controller.tilt = -13;
        controller.pan = 28;
        controller.speedDistance = 0.25;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            30000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.lux = 30000;
        directionalLight.elevation = 26;
        directionalLight.azimuth = 148;
        directionalLight.color.setColorByHEX('#fffcf0');
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 해변 지형, 수중 암초, 해안 바위, 고대 신전 기둥 및 부유 바위 환경 생성
        // [EN] Create beach terrain, submerged reefs, shoreline boulders, temple colonnade, and floating rocks
        const beachEnvironment = createBeachEnvironment(redGPUContext, scene);

        // [KO] 호수(Lake) 수체 생성 및 선형('rgba8unorm') 듀얼 노멀 텍스처 바인딩
        // [EN] Create Lake water body and bind linear ('rgba8unorm') dual normal textures
        const lake = new RedGPU.Water.Lake(redGPUContext, 240, 240, 120, 120);
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

        if (beachEnvironment.floatingRocks && beachEnvironment.floatingRocks.length > 0) {
            beachEnvironment.floatingRocks.forEach((rock) => {
                rock.enableWaterInteraction = true;
            });
        }

        let characterMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';
        let lastTime = null;

        const getLakeFloorHeight = (x, z) => {
            return -1.212 - (z - 0.156) * 0.158384;
        };

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
                controller.distance = 9.0;
                controller.tilt = -10;
                controller.pan = 180;

                characterController = new RedGPU.Charactor.SimpleCharacterController(
                    redGPUContext,
                    characterMesh,
                    view.camera,
                    {
                        speed: 3.5,
                        runSpeed: 7.5,
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
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const floatingRocks = beachEnvironment.floatingRocks;
            const count = floatingRocks.length;
            const t = time * 0.001;
            for (let i = 0; i < count; i++) {
                const rock = floatingRocks[i];
                rock.y = rock.originalY + Math.sin(t * 1.5 + i);
            }

            if (characterMesh && characterController) {
                const dt = lastTime !== null ? time - lastTime : 0;
                lastTime = time;
                if (dt > 0) {
                    characterController.update(view, time);

                    controller.centerX = characterMesh.x;
                    controller.centerY = characterMesh.y + 1.2;
                    controller.centerZ = characterMesh.z;

                    if (characterController.isRunning) targetStateName = 'Run';
                    else if (characterController.isMoving) targetStateName = 'Walk';
                    else targetStateName = 'Idle';
                }
            }
        });

        new RedGPUExampleHelper(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createBeachEnvironment = (redGPUContext, scene) => {
    const floatingRocks = [];

    const gravelAlbedo = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/terrain/terrainTest_001/layer/gravel.jpg');
    const gravelNormal = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/terrain/terrainTest_001/layer/gravel_normal.jpg', true, null, null, 'rgba8unorm');
    const gravelOrm = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/terrain/terrainTest_001/layer/gravel_orm.jpg', true, null, null, 'rgba8unorm');

    const rockAlbedo = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/terrain/terrainTest_001/layer/rock.jpg');
    const rockNormal = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/terrain/terrainTest_001/layer/rock_normal.jpg', true, null, null, 'rgba8unorm');
    const rockOrm = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/terrain/terrainTest_001/layer/rock_orm.jpg', true, null, null, 'rgba8unorm');

    const terrainRepeatSampler = new RedGPU.Resource.Sampler(redGPUContext, {
        addressModeU: RedGPU.GPU_ADDRESS_MODE.REPEAT,
        addressModeV: RedGPU.GPU_ADDRESS_MODE.REPEAT,
        magFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
        minFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
        mipmapFilter: RedGPU.GPU_MIPMAP_FILTER_MODE.LINEAR,
        maxAnisotropy: 16
    });

    const seabedMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    seabedMaterial.baseColorTexture = gravelAlbedo;
    seabedMaterial.normalTexture = gravelNormal;
    seabedMaterial.metallicRoughnessTexture = gravelOrm;
    seabedMaterial.occlusionTexture = gravelOrm;
    seabedMaterial.baseColorTextureSampler = terrainRepeatSampler;
    seabedMaterial.normalTextureSampler = terrainRepeatSampler;
    seabedMaterial.textureScale = [18, 18];
    seabedMaterial.baseColorFactor = [1.15, 1.1, 1.0, 1.0];
    seabedMaterial.roughnessFactor = 0.92;
    seabedMaterial.metallicFactor = 0.0;

    const seabedMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 280, 2.0, 280),
        seabedMaterial
    );
    seabedMesh.setPosition(0, -2.2, 0);
    seabedMesh.rotationX = 9.0;
    seabedMesh.receiveShadow = true;
    scene.addChild(seabedMesh);

    const beachMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    beachMaterial.baseColorTexture = gravelAlbedo;
    beachMaterial.normalTexture = gravelNormal;
    beachMaterial.metallicRoughnessTexture = gravelOrm;
    beachMaterial.occlusionTexture = gravelOrm;
    beachMaterial.baseColorTextureSampler = terrainRepeatSampler;
    beachMaterial.normalTextureSampler = terrainRepeatSampler;
    beachMaterial.textureScale = [36, 6];
    beachMaterial.baseColorFactor = [1.32, 1.25, 1.15, 1.0];
    beachMaterial.roughnessFactor = 0.95;
    beachMaterial.metallicFactor = 0.0;

    const beachMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 280, 2.0, 40),
        beachMaterial
    );
    beachMesh.setPosition(0, 0.35, -30);
    beachMesh.rotationX = 13.5;
    beachMesh.castShadow = true;
    beachMesh.receiveShadow = true;
    scene.addChild(beachMesh);

    const rockMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rockMaterial.baseColorTexture = rockAlbedo;
    rockMaterial.normalTexture = rockNormal;
    rockMaterial.metallicRoughnessTexture = rockOrm;
    rockMaterial.occlusionTexture = rockOrm;
    rockMaterial.baseColorTextureSampler = terrainRepeatSampler;
    rockMaterial.normalTextureSampler = terrainRepeatSampler;
    rockMaterial.textureScale = [1.4, 1.4];
    rockMaterial.baseColorFactor = [1.2, 1.16, 1.12, 1.0];
    rockMaterial.roughnessFactor = 0.82;
    rockMaterial.metallicFactor = 0.04;

    const rockStack = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 2.2, 3.0, 8.5, 18),
        rockMaterial
    );
    rockStack.setPosition(11.5, 2.2, -0.5);
    rockStack.rotationY = 25;
    rockStack.rotationZ = -4;
    rockStack.castShadow = true;
    rockStack.receiveShadow = true;
    scene.addChild(rockStack);

    const rockStackSub = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2.6, 24, 24),
        rockMaterial
    );
    rockStackSub.setPosition(7.8, 1.0, -4.2);
    rockStackSub.setScale(1.3, 0.9, 1.2);
    rockStackSub.rotationX = 40;
    rockStackSub.rotationY = -25;
    rockStackSub.castShadow = true;
    rockStackSub.receiveShadow = true;
    scene.addChild(rockStackSub);

    const sphereGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 20, 20);
    [
        {x: -11, y: -0.9, z: -4, scale: [3.2, 1.3, 2.8], rotX: 35, rotY: 15},
        {x: -9.5, y: -1.7, z: 4, scale: [3.8, 1.5, 3.4], rotX: -25, rotY: 45},
        {x: -6.5, y: -2.8, z: 11, scale: [4.4, 2.0, 4.0], rotX: 40, rotY: -30},
        {x: 5.5, y: -1.4, z: 4, scale: [2.6, 1.2, 2.6], rotX: 20, rotY: 60},
        {x: 1.5, y: -2.6, z: 10, scale: [3.6, 1.7, 3.0], rotX: -30, rotY: -15},
    ].forEach((info) => {
        const reefMesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeom, rockMaterial);
        reefMesh.setPosition(info.x, info.y, info.z);
        reefMesh.setScale(info.scale[0], info.scale[1], info.scale[2]);
        reefMesh.rotationX = info.rotX;
        reefMesh.rotationY = info.rotY;
        reefMesh.castShadow = true;
        reefMesh.receiveShadow = true;
        scene.addChild(reefMesh);
    });

    [
        {x: -14, y: 0.5, z: -8, scale: [2.4, 1.8, 2.2], rotX: 30, rotY: 25},
        {x: -6, y: 0.38, z: -8.5, scale: [1.8, 1.3, 1.6], rotX: -35, rotY: -40},
        {x: 13, y: 0.48, z: -7, scale: [2.6, 1.7, 2.4], rotX: 45, rotY: 10},
        {x: 2.5, y: 0.28, z: -7.5, scale: [2.0, 1.2, 1.8], rotX: -20, rotY: 55},
    ].forEach((info) => {
        const boulderMesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeom, rockMaterial);
        boulderMesh.setPosition(info.x, info.y, info.z);
        boulderMesh.setScale(info.scale[0], info.scale[1], info.scale[2]);
        boulderMesh.rotationX = info.rotX;
        boulderMesh.rotationY = info.rotY;
        boulderMesh.castShadow = true;
        boulderMesh.receiveShadow = true;
        scene.addChild(boulderMesh);
    });

    const floatReefGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 16, 16);
    const floatReef1 = new RedGPU.Display.Mesh(redGPUContext, floatReefGeom, rockMaterial);
    floatReef1.setPosition(-2.5, 0.46, 6);
    floatReef1.originalY = 0.46;
    floatReef1.castShadow = true;
    scene.addChild(floatReef1);
    floatingRocks.push(floatReef1);

    const floatReef2 = new RedGPU.Display.Mesh(redGPUContext, floatReefGeom, rockMaterial);
    floatReef2.setPosition(7.5, 0.38, 8);
    floatReef2.originalY = 0.38;
    floatReef2.scaleX = 0.85;
    floatReef2.scaleZ = 0.85;
    floatReef2.castShadow = true;
    scene.addChild(floatReef2);
    floatingRocks.push(floatReef2);

    const marbleMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    marbleMaterial.baseColorFactor = [1.7, 1.68, 1.62, 1.0];
    marbleMaterial.roughnessFactor = 0.18;
    marbleMaterial.metallicFactor = 0.05;

    const terracottaMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    terracottaMaterial.baseColorFactor = [1.75, 0.52, 0.32, 1.0];
    terracottaMaterial.roughnessFactor = 0.28;
    terracottaMaterial.metallicFactor = 0.05;

    const platformMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 8.5, 0.8, 6.0),
        marbleMaterial
    );
    platformMesh.setPosition(-3.2, 0.7, 2.0);
    platformMesh.rotationY = 22;
    platformMesh.castShadow = true;
    platformMesh.receiveShadow = true;
    scene.addChild(platformMesh);

    const obeliskMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.65, 1.1, 13.5, 16),
        terracottaMaterial
    );
    obeliskMesh.setPosition(-3.2, 6.8, 2.0);
    obeliskMesh.rotationY = 22;
    obeliskMesh.castShadow = true;
    obeliskMesh.receiveShadow = true;
    scene.addChild(obeliskMesh);

    const columnGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.5, 0.5, 9.0, 24);
    const capGeom = new RedGPU.Primitive.Box(redGPUContext, 1.3, 0.45, 1.3);
    [
        {x: -5.8, z: 0.6},
        {x: -1.0, z: 3.2},
        {x: 3.8, z: 1.2},
        {x: 6.8, z: 3.5},
    ].forEach((p) => {
        const column = new RedGPU.Display.Mesh(redGPUContext, columnGeom, marbleMaterial);
        column.setPosition(p.x, 4.3, p.z);
        column.castShadow = true;
        column.receiveShadow = true;
        scene.addChild(column);

        const cap = new RedGPU.Display.Mesh(redGPUContext, capGeom, marbleMaterial);
        cap.setPosition(p.x, 8.8, p.z);
        cap.castShadow = true;
        cap.receiveShadow = true;
        scene.addChild(cap);
    });

    const beam = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 5.5, 0.6, 1.2),
        marbleMaterial
    );
    beam.setPosition(-3.4, 9.3, 1.9);
    beam.rotationY = 28;
    beam.castShadow = true;
    beam.receiveShadow = true;
    scene.addChild(beam);

    const strawMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.45, 0.55, 12.0, 20),
        marbleMaterial
    );
    strawMesh.setPosition(0.5, 1.2, -1.2);
    strawMesh.rotationZ = 34;
    strawMesh.rotationX = 18;
    strawMesh.castShadow = true;
    strawMesh.receiveShadow = true;
    scene.addChild(strawMesh);

    return {floatingRocks};
};
