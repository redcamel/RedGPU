import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Lake Object Interaction 예제
 * [EN] Lake Object Interaction Example
 *
 * [KO] 동적 객체(구체)와 수체 간의 실시간 2D 파동 방정식(FDTD) 잔물결 시뮬레이션 및 수체 상호작용 속성을 시연합니다.
 * [EN] Demonstrates real-time 2D wave equation (FDTD) ripple simulation and water interaction properties between dynamic objects and the water body.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 18;
        controller.tilt = -14;
        controller.pan = 18;
        controller.minDistance = 4;
        controller.maxDistance = 60;
        controller.speedDistance = 0.2;

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
        directionalLight.elevation = 38;
        directionalLight.azimuth = 135;
        directionalLight.lux = 75000;
        directionalLight.color.setColorByHEX('#fffcf0');
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 수중 바닥 지형 및 SSR 반사용 포털 게이트 환경 생성
        // [EN] Create underwater floor and golden portal gate environment for SSR reflection
        createUnderwaterEnvironment(redGPUContext, scene);

        // [KO] Lake 수체 생성 및 선형('rgba8unorm') 듀얼 노멀 텍스처 바인딩
        // [EN] Create Lake water body and bind linear ('rgba8unorm') dual normal textures
        const lake = new RedGPU.Water.Lake(redGPUContext, 80, 80, 80, 80);
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

        // [KO] 실시간 수체 상호작용 객체(골드 메탈릭 구체) 생성 및 추적 타겟 지정
        // [EN] Create interactive gold metallic sphere and assign as interaction follow target
        const sphereMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        sphereMaterial.baseColorFactor = [0.95, 0.61, 0.07, 1.0];
        sphereMaterial.roughnessFactor = 0.15;
        sphereMaterial.metallicFactor = 0.85;

        const sphere = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 32, 32),
            sphereMaterial
        );
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.enableWaterInteraction = true;
        sphere.waterWaveStrength = 1.5;
        lake.interactionFollowTarget = sphere;
        scene.addChild(sphere);

        const motionState = {
            autoMove: true,
            moveSpeed: 1.2,
            moveRadius: 3.8,
            bobbingAmplitude: 0.25,
            time: 0,
        };

        let lastTimestamp = performance.now();
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (currentTimestamp) => {
            const dt = Math.min((currentTimestamp - lastTimestamp) * 0.001, 0.1);
            lastTimestamp = currentTimestamp;

            if (motionState.autoMove) {
                motionState.time += dt * motionState.moveSpeed;
                sphere.x = Math.sin(motionState.time) * motionState.moveRadius;
                sphere.z = Math.cos(motionState.time * 0.8) * (motionState.moveRadius * 0.7);
                sphere.y = Math.sin(motionState.time * 2.2) * motionState.bobbingAmplitude;
            }
        });

        renderTestPane(redGPUContext, lake, sphere, directionalLight, motionState);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createUnderwaterEnvironment = (redGPUContext, scene) => {
    const groundMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    groundMaterial.baseColorFactor = [0.17, 0.24, 0.31, 1.0];
    groundMaterial.roughnessFactor = 0.8;
    groundMaterial.metallicFactor = 0.1;

    const groundMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 60, 60, 32, 32),
        groundMaterial
    );
    groundMesh.y = -3.0;
    groundMesh.receiveShadow = true;
    scene.addChild(groundMesh);

    const pillarMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    pillarMaterial.baseColorFactor = [0.74, 0.76, 0.78, 1.0];
    pillarMaterial.roughnessFactor = 0.4;
    pillarMaterial.metallicFactor = 0.2;

    const pillarCoords = [
        [-6, -6], [6, -6], [-6, 6], [6, 6]
    ];
    for (let i = 0; i < pillarCoords.length; i++) {
        const coord = pillarCoords[i];
        const pillar = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Cylinder(redGPUContext, 0.6, 0.6, 3.5, 24),
            pillarMaterial
        );
        pillar.setPosition(coord[0], -1.25, coord[1]);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.addChild(pillar);
    }

    const gateGold = new RedGPU.Material.PBRMaterial(redGPUContext);
    gateGold.baseColorFactor = [1.0, 0.75, 0.25, 1.0];
    gateGold.roughnessFactor = 0.15;
    gateGold.metallicFactor = 0.95;

    const portalRing = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Torus(redGPUContext, 3.2, 0.70, 32, 32),
        gateGold
    );
    portalRing.setPosition(0, 1.5, -5.2);
    portalRing.castShadow = true;
    scene.addChild(portalRing);

    const towerMat = new RedGPU.Material.PBRMaterial(redGPUContext);
    towerMat.baseColorFactor = [0.85, 0.88, 0.92, 1.0];
    towerMat.roughnessFactor = 0.25;
    towerMat.metallicFactor = 0.3;

    const towerGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.75, 0.75, 8.5, 24);
    const leftGate = new RedGPU.Display.Mesh(redGPUContext, towerGeom, towerMat);
    leftGate.setPosition(-6.5, 1.2, -5.2);
    leftGate.castShadow = true;
    scene.addChild(leftGate);

    const rightGate = new RedGPU.Display.Mesh(redGPUContext, towerGeom, towerMat);
    rightGate.setPosition(6.5, 1.2, -5.2);
    rightGate.castShadow = true;
    scene.addChild(rightGate);
};

const renderTestPane = (redGPUContext, lake, sphere, directionalLight, motionState) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lakeFolder = pane.addFolder({title: 'Lake', expanded: true});
            lakeFolder.addBinding(lake, 'interactionEnabled');
            lakeFolder.addBinding(lake, 'rippleWaveSpeed', {min: 0.05, max: 0.8, step: 0.01});
            lakeFolder.addBinding(lake, 'rippleDamping', {min: 0.001, max: 0.05, step: 0.001});
            lakeFolder.addBinding(lake, 'rippleNormalStrength', {min: 0.0, max: 3.0, step: 0.1});
            lakeFolder.addBinding(lake, 'interactionDomainSize', {min: 4.0, max: 32.0, step: 1.0});
            lakeFolder.addBinding(lake, 'maxPenetration', {min: 0.05, max: 1.0, step: 0.05});
            lakeFolder.addBinding(lake, 'waterLevel', {min: -2.0, max: 2.0, step: 0.05});

            const sphereFolder = pane.addFolder({title: 'Interactive Sphere', expanded: true});
            sphereFolder.addBinding(sphere, 'enableWaterInteraction');
            sphereFolder.addBinding(sphere, 'waterWaveStrength', {min: 0.0, max: 4.0, step: 0.1});
            sphereFolder.addBinding(motionState, 'autoMove');
            sphereFolder.addBinding(motionState, 'moveSpeed', {min: 0.1, max: 3.0, step: 0.1});
            sphereFolder.addBinding(motionState, 'moveRadius', {min: 1.0, max: 8.0, step: 0.2});
            sphereFolder.addBinding(sphere, 'y', {min: -2.0, max: 4.0, step: 0.05}).on('change', () => {
                motionState.autoMove = false;
            });
            sphereFolder.addBinding(sphere, 'x', {min: -10.0, max: 10.0, step: 0.1}).on('change', () => {
                motionState.autoMove = false;
            });
            sphereFolder.addBinding(sphere, 'z', {min: -10.0, max: 10.0, step: 0.1}).on('change', () => {
                motionState.autoMove = false;
            });

            const lightFolder = pane.addFolder({title: 'DirectionalLight', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
};
