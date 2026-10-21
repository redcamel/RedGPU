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

const SEABED_BOX_Y = -0.85;
const SEABED_HALF_HEIGHT = 1.0;
const SEABED_SLOPE_DEG = 2.8;
const SEABED_SLOPE_RAD = (SEABED_SLOPE_DEG * Math.PI) / 180;
const SEABED_TOP_Y = SEABED_BOX_Y + SEABED_HALF_HEIGHT * Math.cos(SEABED_SLOPE_RAD);
const SEABED_TOP_Z = SEABED_HALF_HEIGHT * Math.sin(SEABED_SLOPE_RAD);
const SEABED_TAN = Math.tan(SEABED_SLOPE_RAD);

const getLakeFloorHeight = (x, z) => {
    return SEABED_TOP_Y - (z - SEABED_TOP_Z) * SEABED_TAN;
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 8.2;
        controller.tilt = -11;
        controller.pan = 180;
        controller.speedDistance = 0.25;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            20000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // [KO] 해안가 및 수중 바닥에 드리워지는 긴 그림자를 위한 직사광 설정
        // [EN] Directional sunlight casting long shadows across the open shoreline and seabed
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.lux = 90000;
        directionalLight.elevation = 25;
        directionalLight.azimuth = 135;
        directionalLight.color.setColorByHEX('#ffe8c8');
        scene.lightManager.addDirectionalLight(directionalLight);


        // [KO] 탁 트인 완만 경사 해변 지형과 여유 있게 배치된 외곽 해안 바위·석주 생성
        // [EN] Create open sloped beach terrain with widely spaced coastal rocks and pillars
        const beachEnvironment = createBeachEnvironment(redGPUContext, scene);

        // [KO] 호수(Lake) 수체 생성 및 선형('rgba8unorm') 듀얼 노멀 텍스처 바인딩
        // [EN] Create Lake water body and bind linear ('rgba8unorm') dual normal textures
        const lake = new RedGPU.Water.Lake(redGPUContext, 240, 240, 120, 120);
        lake.waterLevel = 0.5;
        lake.waterMaterial.baseColor.setColorByHEX('#16c8b8');
        lake.waterMaterial.deepColor.setColorByHEX('#042842');
        lake.waterMaterial.causticsStrength = 1.25;
        lake.waterMaterial.refractionStrength = 0.9;
        lake.waterMaterial.roughness = 0.05;
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

        const floatingRocks = beachEnvironment.floatingRocks;
        for (let i = 0; i < floatingRocks.length; i++) {
            floatingRocks[i].enableWaterInteraction = true;
        }

        let characterMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';
        let lastTime = null;
        let onCharacterLoaded = null;

        // [KO] 로컬 스킨드 메시(Soldier.glb) 로드 — 수심 약 42cm(무릎 깊이)의 개방된 수역 중앙에서 시작
        // [EN] Load local skinned mesh (Soldier.glb) — starts knee-deep (~42cm) in the open water
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../../assets/gltf/Soldier.glb',
            (loader) => {
                characterMesh = loader.resultMesh;
                characterMesh.x = 0;
                characterMesh.z = 1.4;
                characterMesh.y = getLakeFloorHeight(characterMesh.x, characterMesh.z);

                characterMesh.setCastShadowRecursively(true);
                characterMesh.setReceiveShadowRecursively(true);
                scene.addChild(characterMesh);

                characterMesh.enableWaterInteraction = true;
                lake.interactionFollowTarget = characterMesh;

                controller.centerX = characterMesh.x;
                controller.centerY = characterMesh.y + 1.25;
                controller.centerZ = characterMesh.z;

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

                if (onCharacterLoaded) {
                    onCharacterLoaded(characterMesh);
                }
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const count = floatingRocks.length;
            const t = time * 0.001;
            for (let i = 0; i < count; i++) {
                const rock = floatingRocks[i];
                rock.y = rock.originalY + Math.sin(t * 1.6 + i * 1.4) * 0.22;
            }

            if (characterMesh && characterController) {
                const dt = lastTime !== null ? time - lastTime : 0;
                lastTime = time;
                if (dt > 0) {
                    characterController.update(view, time);

                    controller.centerX = characterMesh.x;
                    controller.centerY = characterMesh.y + 1.25;
                    controller.centerZ = characterMesh.z;

                    if (characterController.isRunning) targetStateName = 'Run';
                    else if (characterController.isMoving) targetStateName = 'Walk';
                    else targetStateName = 'Idle';
                }
            }
        });

        renderTestPane(redGPUContext, lake, directionalLight, (bindCharacterFn) => {
            if (characterMesh) {
                bindCharacterFn(characterMesh);
            } else {
                onCharacterLoaded = bindCharacterFn;
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

    // 1. 연속된 완만 경사 해변/수중 바닥 (육지 해변에서 수중까지 이음새 없이 연결)
    const seabedMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    seabedMaterial.baseColorTexture = gravelAlbedo;
    seabedMaterial.normalTexture = gravelNormal;
    seabedMaterial.metallicRoughnessTexture = gravelOrm;
    seabedMaterial.occlusionTexture = gravelOrm;
    seabedMaterial.baseColorTextureSampler = terrainRepeatSampler;
    seabedMaterial.normalTextureSampler = terrainRepeatSampler;
    seabedMaterial.textureScale = [26, 26];
    seabedMaterial.baseColorFactor = [1.0, 0.95, 0.88, 1.0];
    seabedMaterial.roughnessFactor = 0.88;
    seabedMaterial.metallicFactor = 0.0;

    const seabedMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 280, SEABED_HALF_HEIGHT * 2, 280),
        seabedMaterial
    );
    seabedMesh.setPosition(0, SEABED_BOX_Y, 0);
    seabedMesh.rotationX = SEABED_SLOPE_DEG;
    seabedMesh.receiveShadow = true;
    scene.addChild(seabedMesh);

    // 2. 자연 해안 바위 및 외곽 석주 재질 정의
    const rockMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rockMaterial.baseColorTexture = rockAlbedo;
    rockMaterial.normalTexture = rockNormal;
    rockMaterial.metallicRoughnessTexture = rockOrm;
    rockMaterial.occlusionTexture = rockOrm;
    rockMaterial.baseColorTextureSampler = terrainRepeatSampler;
    rockMaterial.normalTextureSampler = terrainRepeatSampler;
    rockMaterial.textureScale = [1.5, 1.5];
    rockMaterial.baseColorFactor = [0.94, 0.90, 0.86, 1.0];
    rockMaterial.roughnessFactor = 0.82;
    rockMaterial.metallicFactor = 0.04;

    const pillarMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    pillarMaterial.baseColorFactor = [0.90, 0.86, 0.80, 1.0];
    pillarMaterial.roughnessFactor = 0.30;
    pillarMaterial.metallicFactor = 0.05;

    // 3. 중앙 수역을 비워두고 외곽에 여유 있게 배치한 수중 석주 4기 (긴 사선 그림자 및 SSR 반사 제공)
    const pillarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.65, 0.78, 8.5, 24);
    [
        {x: 8.5, z: -2.5, heightScale: 1.0},
        {x: 11.5, z: 6.5, heightScale: 1.15},
        {x: -9.5, z: 3.5, heightScale: 0.95},
        {x: -12.0, z: 13.0, heightScale: 1.1},
    ].forEach((p) => {
        const floorY = getLakeFloorHeight(p.x, p.z);
        const pillar = new RedGPU.Display.Mesh(redGPUContext, pillarGeom, pillarMaterial);
        pillar.setPosition(p.x, floorY + 3.8 * p.heightScale, p.z);
        pillar.setScale(1.0, p.heightScale, 1.0);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.addChild(pillar);
    });

    // 4. 원경 및 좌우 해안가 외곽의 큼직한 바위 군락 (중앙 보행 경로를 방해하지 않는 개방형 구도)
    const boulderGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 24, 24);
    [
        {x: -13.5, y: 0.3, z: -5.0, scale: [4.2, 2.2, 3.6], rotX: 15, rotY: 25},
        {x: 14.0, y: 0.2, z: -6.0, scale: [3.8, 1.9, 3.2], rotX: -12, rotY: -30},
        {x: -15.0, y: -0.2, z: 9.0, scale: [5.0, 2.8, 4.2], rotX: 20, rotY: 40},
        {x: 15.5, y: -0.3, z: 12.0, scale: [4.6, 2.5, 3.8], rotX: -18, rotY: -35},
        {x: -6.5, y: -0.55, z: 11.5, scale: [2.8, 1.1, 2.4], rotX: 25, rotY: 15},
        {x: 7.0, y: -0.45, z: 9.5, scale: [2.5, 1.0, 2.2], rotX: -20, rotY: 35},
    ].forEach((b) => {
        const boulder = new RedGPU.Display.Mesh(redGPUContext, boulderGeom, rockMaterial);
        boulder.setPosition(b.x, b.y, b.z);
        boulder.setScale(b.scale[0], b.scale[1], b.scale[2]);
        boulder.rotationX = b.rotX;
        boulder.rotationY = b.rotY;
        boulder.castShadow = true;
        boulder.receiveShadow = true;
        scene.addChild(boulder);
    });

    // 5. 수면 상하 부유 바위 3개 (캐릭터 이동 시 20x20 슬라이딩 파동 도메인 진입/이탈 확인용)
    const floatRockGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 20, 20);
    [
        {x: -5.8, y: 0.44, z: 1.5, scale: 1.05},
        {x: 5.8, y: 0.44, z: 2.5, scale: 0.95},
        {x: -4.8, y: 0.44, z: 8.5, scale: 1.10},
    ].forEach((cfg) => {
        const floatRock = new RedGPU.Display.Mesh(redGPUContext, floatRockGeom, rockMaterial);
        floatRock.setPosition(cfg.x, cfg.y, cfg.z);
        floatRock.setScale(cfg.scale, cfg.scale * 0.72, cfg.scale);
        floatRock.originalY = cfg.y;
        floatRock.castShadow = true;
        floatRock.receiveShadow = true;
        scene.addChild(floatRock);
        floatingRocks.push(floatRock);
    });

    return {floatingRocks};
};

const renderTestPane = (redGPUContext, lake, directionalLight, registerCharacterBinding) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lakeFolder = pane.addFolder({title: 'Lake', expanded: true});
            lakeFolder.addBinding(lake, 'interactionEnabled');
            lakeFolder.addBinding(lake, 'rippleWaveSpeed', {min: 0.05, max: 0.8, step: 0.01});
            lakeFolder.addBinding(lake, 'rippleDamping', {min: 0.001, max: 0.05, step: 0.001});
            lakeFolder.addBinding(lake, 'rippleNormalStrength', {min: 0.0, max: 3.0, step: 0.1});
            lakeFolder.addBinding(lake, 'waterLevel', {min: -0.5, max: 1.5, step: 0.05});

            const characterFolder = pane.addFolder({title: 'Character', expanded: true});
            registerCharacterBinding((characterMesh) => {
                characterFolder.addBinding(characterMesh, 'enableWaterInteraction');
                characterFolder.addBinding(characterMesh, 'waterWaveStrength', {min: 0.0, max: 4.0, step: 0.1});
            });

            const lightFolder = pane.addFolder({title: 'DirectionalLight', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
};
