import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Lake Object Interaction 예제
 * [EN] Lake Object Interaction Example
 *
 * [KO] 수평 공전 구체(항적 파동)와 상하 왕복 구체(동심원 파동)를 통해 실시간 2D 파동 방정식(FDTD) 물결 생성 및 파동 간섭을 시연합니다.
 * [EN] Demonstrates real-time 2D wave equation (FDTD) ripple generation and wave interference using a horizontally orbiting sphere (wake waves) and a vertically bobbing sphere (concentric ripples).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 17;
        controller.tilt = -22;
        controller.pan = 15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 38;
        directionalLight.azimuth = 135;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 물결 굴절 관찰용 수중 바둑판 타일 플라자 및 SSR 반사용 8각 열주 아레나 생성
        // [EN] Create underwater checkered tile plaza for ripple refraction and octagonal colonnade arena for SSR
        createUnderwaterEnvironment(redGPUContext, scene);

        // [KO] Lake 수체 생성 및 선형('rgba8unorm') 듀얼 노멀 텍스처 바인딩
        // [EN] Create Lake water body and bind linear ('rgba8unorm') dual normal textures
        const lake = new RedGPU.Water.Lake(redGPUContext);
        lake.material.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        lake.material.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        scene.addWater(lake);

        const sphereGeom = new RedGPU.Primitive.Sphere(redGPUContext, 0.95, 32, 32);

        // [KO] 1. 중앙 상하 왕복 구체 (시안 메탈릭): 수면을 수직으로 관통하며 360도 동심원 파문(Concentric Ripple) 생성
        // [EN] 1. Center vertically bobbing sphere (Cyan Metallic): Pierces water vertically to generate concentric ripples
        const bobbingMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        bobbingMaterial.baseColorFactor = [0.10, 0.82, 0.88, 1.0];
        bobbingMaterial.roughnessFactor = 0.15;
        bobbingMaterial.metallicFactor = 0.85;

        const bobbingSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeom, bobbingMaterial);
        bobbingSphere.castShadow = true;
        bobbingSphere.receiveShadow = true;
        bobbingSphere.enableWaterInteraction = true;
        scene.addChild(bobbingSphere);

        // [KO] 2. 외곽 수평 공전 구체 (골드 메탈릭): 수면을 가르며 이동하여 진행 항적 파동(Wake Wave) 생성
        // [EN] 2. Outer horizontally orbiting sphere (Gold Metallic): Skims across water to generate wake waves
        const orbitMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        orbitMaterial.baseColorFactor = [0.95, 0.61, 0.07, 1.0];
        orbitMaterial.roughnessFactor = 0.15;
        orbitMaterial.metallicFactor = 0.85;

        const orbitSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeom, orbitMaterial);
        orbitSphere.castShadow = true;
        orbitSphere.receiveShadow = true;
        orbitSphere.enableWaterInteraction = true;
        scene.addChild(orbitSphere);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const sec = time * 0.001;
            bobbingSphere.y = 0.15 + Math.sin(sec * 2.6) * 0.75;
            orbitSphere.x = Math.cos(sec * 1.1) * 4.8;
            orbitSphere.z = Math.sin(sec * 1.1) * 3.8;
        });

        renderTestPane(redGPUContext, lake, orbitSphere, bobbingSphere, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createUnderwaterEnvironment = (redGPUContext, scene) => {
    const floorY = -2.8;

    const groundMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    groundMaterial.baseColorFactor = [0.18, 0.22, 0.27, 1.0];
    groundMaterial.roughnessFactor = 0.85;
    groundMaterial.metallicFactor = 0.05;

    const groundMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 100, 100),
        groundMaterial
    );
    groundMesh.y = floorY;
    groundMesh.receiveShadow = true;
    scene.addChild(groundMesh);

    // 1. 수중 6x6 바둑판 타일 플라자 (상단면 y: -1.25m, 동심원 물결 전파 시 격자 굴절 왜곡 극대화)
    const lightTileMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    lightTileMaterial.baseColorFactor = [0.92, 0.89, 0.83, 1.0];
    lightTileMaterial.roughnessFactor = 0.25;
    lightTileMaterial.metallicFactor = 0.05;

    const darkTileMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    darkTileMaterial.baseColorFactor = [0.22, 0.28, 0.35, 1.0];
    darkTileMaterial.roughnessFactor = 0.35;
    darkTileMaterial.metallicFactor = 0.15;

    const gridCount = 6;
    const tileStep = 2.0;
    const tileSize = 1.92;
    const tileTopY = -1.25;
    const tileHeight = tileTopY - floorY;
    const tileGeom = new RedGPU.Primitive.Box(redGPUContext, tileSize, tileHeight, tileSize);
    const startOffset = -((gridCount - 1) * tileStep) * 0.5;

    for (let r = 0; r < gridCount; r++) {
        for (let c = 0; c < gridCount; c++) {
            const isLight = (r + c) % 2 === 0;
            const tileMesh = new RedGPU.Display.Mesh(
                redGPUContext,
                tileGeom,
                isLight ? lightTileMaterial : darkTileMaterial
            );
            tileMesh.setPosition(
                startOffset + c * tileStep,
                floorY + tileHeight * 0.5,
                startOffset + r * tileStep
            );
            tileMesh.receiveShadow = true;
            scene.addChild(tileMesh);
        }
    }

    // 2. 8각 원형 반사 열주 아레나 (반경 7.4m: 시뮬레이션 도메인 경계 표시 및 전 방향 SSR 수직 반사 제공)
    const plinthMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    plinthMaterial.baseColorFactor = [0.78, 0.80, 0.83, 1.0];
    plinthMaterial.roughnessFactor = 0.35;
    plinthMaterial.metallicFactor = 0.1;

    const goldPillarMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    goldPillarMaterial.baseColorFactor = [0.95, 0.76, 0.28, 1.0];
    goldPillarMaterial.roughnessFactor = 0.18;
    goldPillarMaterial.metallicFactor = 0.9;

    const marblePillarMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    marblePillarMaterial.baseColorFactor = [0.88, 0.90, 0.94, 1.0];
    marblePillarMaterial.roughnessFactor = 0.22;
    marblePillarMaterial.metallicFactor = 0.25;

    const arenaRadius = 7.4;
    const columnCount = 8;
    const plinthTopY = 0.35;
    const plinthHeight = plinthTopY - floorY;
    const plinthGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.72, 0.82, plinthHeight, 24);
    const shaftHeight = 6.8;
    const shaftGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.46, 0.46, shaftHeight, 24);
    const capGeom = new RedGPU.Primitive.Box(redGPUContext, 1.25, 0.45, 1.25);

    for (let i = 0; i < columnCount; i++) {
        const angle = (i * Math.PI * 2) / columnCount + Math.PI / 8;
        const px = Math.cos(angle) * arenaRadius;
        const pz = Math.sin(angle) * arenaRadius;

        const plinth = new RedGPU.Display.Mesh(redGPUContext, plinthGeom, plinthMaterial);
        plinth.setPosition(px, floorY + plinthHeight * 0.5, pz);
        plinth.castShadow = true;
        plinth.receiveShadow = true;
        scene.addChild(plinth);

        if (pz < 4.5) {
            const isGold = i % 2 === 0;
            const shaft = new RedGPU.Display.Mesh(
                redGPUContext,
                shaftGeom,
                isGold ? goldPillarMaterial : marblePillarMaterial
            );
            shaft.setPosition(px, plinthTopY + shaftHeight * 0.5, pz);
            shaft.castShadow = true;
            shaft.receiveShadow = true;
            scene.addChild(shaft);

            const cap = new RedGPU.Display.Mesh(redGPUContext, capGeom, plinthMaterial);
            cap.setPosition(px, plinthTopY + shaftHeight + 0.22, pz);
            cap.rotationY = (-angle * 180) / Math.PI;
            cap.castShadow = true;
            scene.addChild(cap);
        }
    }
};

const renderTestPane = (redGPUContext, lake, orbitSphere, bobbingSphere, directionalLight) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lakeFolder = pane.addFolder({title: 'Lake', expanded: true});
            lakeFolder.addBinding(lake, 'interactionEnabled');
            lakeFolder.addBinding(lake, 'rippleWaveSpeed', {min: 0.05, max: 0.8, step: 0.01});
            lakeFolder.addBinding(lake, 'rippleDamping', {min: 0.001, max: 0.05, step: 0.001});
            lakeFolder.addBinding(lake, 'rippleNormalStrength', {min: 0.0, max: 3.0, step: 0.1});
            lakeFolder.addBinding(lake, 'waterLevel', {min: -2.0, max: 2.0, step: 0.05});

            const bobbingFolder = pane.addFolder({title: 'Bobbing Sphere (Vertical - Cyan)', expanded: true});
            bobbingFolder.addBinding(bobbingSphere, 'enableWaterInteraction');
            bobbingFolder.addBinding(bobbingSphere, 'waterWaveStrength', {min: 0.0, max: 4.0, step: 0.1});

            const orbitFolder = pane.addFolder({title: 'Orbiting Sphere (Horizontal - Gold)', expanded: true});
            orbitFolder.addBinding(orbitSphere, 'enableWaterInteraction');
            orbitFolder.addBinding(orbitSphere, 'waterWaveStrength', {min: 0.0, max: 4.0, step: 0.1});

            const lightFolder = pane.addFolder({title: 'DirectionalLight', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
};
