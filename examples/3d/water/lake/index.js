import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

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
        view.grid = false;
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 26;
        directionalLight.azimuth = 148;
        directionalLight.color.setColorByHEX('#fffcf0');
        scene.lightManager.addDirectionalLight(directionalLight);

        const beachEnvironment = createBeachEnvironment(redGPUContext, scene);

        const lake = new RedGPU.Display.Water.WaterLake(redGPUContext, 240, 240, 120, 120);
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

        const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
        new RedGPU.GLTFLoader(
            redGPUContext,
            MODEL_URL,
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
                controller.pan = 0;

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
                console.log('🚶 [Character] Soldier loaded and ready for lake water interaction.');
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        const render = (time) => {

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
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, lake, directionalLight, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

function createBeachEnvironment(redGPUContext, scene) {
    const floatingRocks = [];

    const gravelAlbedo = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel.jpg');
    const gravelNormal = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel_normal.jpg', true, null, null, 'rgba8unorm');
    const gravelOrm = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel_orm.jpg', true, null, null, 'rgba8unorm');

    const rockAlbedo = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock.jpg');
    const rockNormal = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock_normal.jpg', true, null, null, 'rgba8unorm');
    const rockOrm = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock_orm.jpg', true, null, null, 'rgba8unorm');

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

    const seabedGeometry = new RedGPU.Primitive.Box(redGPUContext, 280, 2.0, 280);
    const seabedMesh = new RedGPU.Display.Mesh(redGPUContext, seabedGeometry, seabedMaterial);
    seabedMesh.x = 0;
    seabedMesh.y = -2.2;
    seabedMesh.z = 0;
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

    const beachGeometry = new RedGPU.Primitive.Box(redGPUContext, 280, 2.0, 40);
    const beachMesh = new RedGPU.Display.Mesh(redGPUContext, beachGeometry, beachMaterial);
    beachMesh.x = 0;
    beachMesh.y = 0.35;
    beachMesh.z = -30;
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

    const rockStackGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 2.2, 3.0, 8.5, 18);
    const rockStack = new RedGPU.Display.Mesh(redGPUContext, rockStackGeom, rockMaterial);
    rockStack.x = 11.5;
    rockStack.y = 2.2;
    rockStack.z = -0.5;
    rockStack.rotationY = 25;
    rockStack.rotationZ = -4;
    rockStack.castShadow = true;
    rockStack.receiveShadow = true;
    scene.addChild(rockStack);

    const rockStackSubGeom = new RedGPU.Primitive.Sphere(redGPUContext, 2.6, 24, 24);
    const rockStackSub = new RedGPU.Display.Mesh(redGPUContext, rockStackSubGeom, rockMaterial);
    rockStackSub.x = 7.8;
    rockStackSub.y = 1.0;
    rockStackSub.z = -4.2;
    rockStackSub.scaleX = 1.3;
    rockStackSub.scaleY = 0.9;
    rockStackSub.scaleZ = 1.2;
    rockStackSub.rotationX = 40;
    rockStackSub.rotationY = -25;
    rockStackSub.castShadow = true;
    rockStackSub.receiveShadow = true;
    scene.addChild(rockStackSub);

    const submergedReefs = [
        {x: -11, y: -0.9, z: -4, scale: [3.2, 1.3, 2.8], rotX: 35, rotY: 15},
        {x: -9.5, y: -1.7, z: 4, scale: [3.8, 1.5, 3.4], rotX: -25, rotY: 45},
        {x: -6.5, y: -2.8, z: 11, scale: [4.4, 2.0, 4.0], rotX: 40, rotY: -30},
        {x: 5.5, y: -1.4, z: 4, scale: [2.6, 1.2, 2.6], rotX: 20, rotY: 60},
        {x: 1.5, y: -2.6, z: 10, scale: [3.6, 1.7, 3.0], rotX: -30, rotY: -15},
    ];

    submergedReefs.forEach((info) => {
        const reefGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 20, 20);
        const reefMesh = new RedGPU.Display.Mesh(redGPUContext, reefGeom, rockMaterial);
        reefMesh.x = info.x;
        reefMesh.y = info.y;
        reefMesh.z = info.z;
        reefMesh.scaleX = info.scale[0];
        reefMesh.scaleY = info.scale[1];
        reefMesh.scaleZ = info.scale[2];
        reefMesh.rotationX = info.rotX;
        reefMesh.rotationY = info.rotY;
        reefMesh.castShadow = true;
        reefMesh.receiveShadow = true;
        scene.addChild(reefMesh);
    });

    const shorelineBoulders = [
        {x: -14, y: 0.5, z: -8, scale: [2.4, 1.8, 2.2], rotX: 30, rotY: 25},
        {x: -6, y: 0.38, z: -8.5, scale: [1.8, 1.3, 1.6], rotX: -35, rotY: -40},
        {x: 13, y: 0.48, z: -7, scale: [2.6, 1.7, 2.4], rotX: 45, rotY: 10},
        {x: 2.5, y: 0.28, z: -7.5, scale: [2.0, 1.2, 1.8], rotX: -20, rotY: 55},
    ];

    shorelineBoulders.forEach((info) => {
        const boulderGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 20, 20);
        const boulderMesh = new RedGPU.Display.Mesh(redGPUContext, boulderGeom, rockMaterial);
        boulderMesh.x = info.x;
        boulderMesh.y = info.y;
        boulderMesh.z = info.z;
        boulderMesh.scaleX = info.scale[0];
        boulderMesh.scaleY = info.scale[1];
        boulderMesh.scaleZ = info.scale[2];
        boulderMesh.rotationX = info.rotX;
        boulderMesh.rotationY = info.rotY;
        boulderMesh.castShadow = true;
        boulderMesh.receiveShadow = true;
        scene.addChild(boulderMesh);
    });

    const floatReefGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 16, 16);
    const floatReef1 = new RedGPU.Display.Mesh(redGPUContext, floatReefGeom, rockMaterial);
    floatReef1.x = -2.5;
    floatReef1.y = 0.46;
    floatReef1.originalY = 0.46;
    floatReef1.z = 6;
    floatReef1.castShadow = true;
    scene.addChild(floatReef1);
    floatingRocks.push(floatReef1);

    const floatReef2 = new RedGPU.Display.Mesh(redGPUContext, floatReefGeom, rockMaterial);
    floatReef2.x = 7.5;
    floatReef2.y = 0.38;
    floatReef2.originalY = 0.38;
    floatReef2.z = 8;
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

    const platformGeom = new RedGPU.Primitive.Box(redGPUContext, 8.5, 0.8, 6.0);
    const platformMesh = new RedGPU.Display.Mesh(redGPUContext, platformGeom, marbleMaterial);
    platformMesh.x = -3.2;
    platformMesh.y = 0.7;
    platformMesh.z = 2.0;
    platformMesh.rotationY = 22;
    platformMesh.castShadow = true;
    platformMesh.receiveShadow = true;
    scene.addChild(platformMesh);

    const obeliskGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.65, 1.1, 13.5, 16);
    const obeliskMesh = new RedGPU.Display.Mesh(redGPUContext, obeliskGeom, terracottaMaterial);
    obeliskMesh.x = -3.2;
    obeliskMesh.y = 6.8;
    obeliskMesh.z = 2.0;
    obeliskMesh.rotationY = 22;
    obeliskMesh.castShadow = true;
    obeliskMesh.receiveShadow = true;
    scene.addChild(obeliskMesh);

    const columnGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.5, 0.5, 9.0, 24);
    const colonnadeCoords = [
        {x: -5.8, z: 0.6, h: 9.0},
        {x: -1.0, z: 3.2, h: 9.0},
        {x: 3.8, z: 1.2, h: 8.5},
        {x: 6.8, z: 3.5, h: 8.5},
    ];

    colonnadeCoords.forEach((p, idx) => {
        const column = new RedGPU.Display.Mesh(redGPUContext, columnGeom, marbleMaterial);
        column.x = p.x;
        column.y = 4.3;
        column.z = p.z;
        column.castShadow = true;
        column.receiveShadow = true;
        scene.addChild(column);

        const capGeom = new RedGPU.Primitive.Box(redGPUContext, 1.3, 0.45, 1.3);
        const cap = new RedGPU.Display.Mesh(redGPUContext, capGeom, marbleMaterial);
        cap.x = p.x;
        cap.y = 8.8;
        cap.z = p.z;
        cap.castShadow = true;
        cap.receiveShadow = true;
        scene.addChild(cap);
    });

    const beamGeom = new RedGPU.Primitive.Box(redGPUContext, 5.5, 0.6, 1.2);
    const beam = new RedGPU.Display.Mesh(redGPUContext, beamGeom, marbleMaterial);
    beam.x = -3.4;
    beam.y = 9.3;
    beam.z = 1.9;
    beam.rotationY = 28;
    beam.castShadow = true;
    beam.receiveShadow = true;
    scene.addChild(beam);

    const strawGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.45, 0.55, 12.0, 20);
    const strawMesh = new RedGPU.Display.Mesh(redGPUContext, strawGeom, marbleMaterial);
    strawMesh.x = 0.5;
    strawMesh.y = 1.2;
    strawMesh.z = -1.2;
    strawMesh.rotationZ = 34;
    strawMesh.rotationX = 18;
    strawMesh.castShadow = true;
    strawMesh.receiveShadow = true;
    scene.addChild(strawMesh);

    return {floatingRocks};
}

function renderTestPane(redGPUContext, lake, directionalLight, view) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        directionalShadow: true,
        skybox: true,
        ibl: true,
        gui: (pane) => {

            const basicFolder = pane.addFolder({title: 'WaterLake Controller', expanded: true});
            basicFolder.addBinding(lake, 'waterLevel', {min: -3, max: 4, step: 0.05});

            basicFolder.addBinding(lake.waterMaterial, 'debugMode', {
                options: {
                    'PBR Water (Full) (0)': 0,
                    'Screen Space Reflection Only (15)': 15,
                    'Underwater Caustics Only (14)': 14,
                    'Sun Specular Glitter Only (13)': 13,
                    'Sky Reflection Color Only (12)': 12,
                    'Fresnel Factor Mask (11)': 11,
                    'Refraction Offset View (10)': 10,
                    'Wave Normal Map View (9)': 9,
                    'Water Albedo Only (8)': 8,
                    'Extinction Absorption Mask (7)': 7,
                    'Scene Passthrough (6)': 6,
                    'Depth Fade Mask (5)': 5,
                    'Delta Depth Water Mask (4)': 4,
                    'Linear Water Depth (3)': 3,
                    'Linear Scene Depth (2)': 2,
                    'Raw Scene Depth (1)': 1
                }
            });
            basicFolder.addBinding(lake.waterMaterial, 'debugMaxDepth', {
                min: 0.5,
                max: 30.0,
                step: 0.5
            });

            const interactionFolder = pane.addFolder({title: 'Water Interaction (Dynamic Ripples)', expanded: true});
            interactionFolder.addBinding(lake, 'interactionEnabled');
            interactionFolder.addBinding(lake, 'interactionDomainSize', {min: 16.0, max: 64.0, step: 2.0});
            if (typeof lake.maxPenetration === 'number') {
                interactionFolder.addBinding(lake, 'maxPenetration', {
                    min: 0.05,
                    max: 1.5,
                    step: 0.05
                });
            }
            interactionFolder.addBinding(lake.waveSimulator, 'waveSpeed', {min: 0.1, max: 0.45, step: 0.01});
            interactionFolder.addBinding(lake.waveSimulator, 'damping', {min: 0.005, max: 0.08, step: 0.001});
            interactionFolder.addBinding(lake.waveSimulator, 'normalStrength', {min: 0.5, max: 5.0, step: 0.1});
            interactionFolder.addBinding(lake.waterMaterial, 'rippleNormalStrength', {min: 0.0, max: 3.0, step: 0.1});

            const causticsFolder = pane.addFolder({title: 'Underwater Caustics', expanded: true});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 2.0, step: 0.05});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsScale', {min: 0.2, max: 3.0, step: 0.05});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsSpeed', {min: 0.0, max: 3.0, step: 0.05});

            const swellFolder = pane.addFolder({title: 'Micro Swell', expanded: false});
            swellFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 0.15, step: 0.005});
            swellFolder.addBinding(lake, 'waveWavelength', {min: 2.0, max: 60.0, step: 1.0});
            swellFolder.addBinding(lake, 'waveSpeed', {min: 0.0, max: 5.0, step: 0.1});

            const waveFolder = pane.addFolder({title: 'Waves & Refraction', expanded: true});
            waveFolder.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 1.0, step: 0.01});

            const layer1Folder = waveFolder.addFolder({title: 'Layer 1: Base Swell', expanded: false});
            layer1Folder.addBinding(lake.waterMaterial, 'normalScale', {min: 0.0, max: 1.0, step: 0.01});
            layer1Folder.addBinding(lake.waterMaterial, 'normalTiling', {min: 1.0, max: 120.0, step: 1.0});
            layer1Folder.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.2, step: 0.005});
            layer1Folder.addBinding(lake.waterMaterial, 'invertNormalY');

            const layer2Folder = waveFolder.addFolder({title: 'Layer 2: Micro Ripple (RNM)', expanded: true});
            layer2Folder.addBinding(lake.waterMaterial, 'normalDetailScale', {min: 0.0, max: 1.0, step: 0.01});
            layer2Folder.addBinding(lake.waterMaterial, 'normalDetailTiling', {min: 1.0, max: 200.0, step: 1.0});
            layer2Folder.addBinding(lake.waterMaterial, 'normalDetailWindSpeed', {min: 0.0, max: 0.2, step: 0.005});
            layer2Folder.addBinding(lake.waterMaterial, 'invertNormalDetailY');

            const colorFolder = pane.addFolder({title: 'Water Color & Optics', expanded: false});
            const colorParams = {
                baseColor: {
                    r: lake.waterMaterial.baseColor.r,
                    g: lake.waterMaterial.baseColor.g,
                    b: lake.waterMaterial.baseColor.b
                },
                deepColor: {
                    r: lake.waterMaterial.deepColor.r,
                    g: lake.waterMaterial.deepColor.g,
                    b: lake.waterMaterial.deepColor.b
                }
            };
            colorFolder.addBinding(colorParams, 'baseColor', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                lake.waterMaterial.baseColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            colorFolder.addBinding(colorParams, 'deepColor', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                lake.waterMaterial.deepColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            colorFolder.addBinding(lake.waterMaterial, 'extinctionFactor', {min: 0.01, max: 2.0, step: 0.01});
            colorFolder.addBinding(lake.waterMaterial, 'turbidity', {min: 0.0, max: 1.0, step: 0.01});
            colorFolder.addBinding(lake.waterMaterial, 'opacity', {min: 0.0, max: 1.0, step: 0.05});
            colorFolder.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.05, max: 10.0, step: 0.05});

            const reflectionFolder = pane.addFolder({title: 'Sky Reflection & Fresnel', expanded: true});
            reflectionFolder.addBinding(lake.waterMaterial, 'roughness', {min: 0.0, max: 1.0, step: 0.01});
            reflectionFolder.addBinding(lake.waterMaterial, 'specularFactor', {min: 0.0, max: 2.0, step: 0.05});

            const ssrFolder = pane.addFolder({title: 'Screen Space Reflection', expanded: true});
            ssrFolder.addBinding(lake.waterMaterial, 'enableSSR');
            ssrFolder.addBinding(lake.waterMaterial, 'ssrMaxDistance', {min: 5.0, max: 60.0, step: 1.0});
            ssrFolder.addBinding(lake.waterMaterial, 'ssrStepCount', {min: 8, max: 96, step: 8});
            ssrFolder.addBinding(lake.waterMaterial, 'ssrThickness', {min: 0.1, max: 2.0, step: 0.05});
        }
    });
}
