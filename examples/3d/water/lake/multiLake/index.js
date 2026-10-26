import * as RedGPU from "../../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Multi Lake (다중 수체) 예제
 * [EN] Multi Lake Example
 *
 * [KO] 단일 씬 내에 서로 다른 고도(waterLevel), 위치, 크기 및 광학 물성을 지닌 5개의 Lake 수체를 동시에 렌더링하고 제어하는 예제입니다.
 * [EN] Simultaneously renders and controls 5 independent Lake bodies with distinct elevations (waterLevel), locations, sizes, and optical properties within a single scene.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 75;
        controller.tilt = -20;
        controller.pan = 22;
        controller.minDistance = 6;
        controller.maxDistance = 250;
        controller.speedDistance = 0.5;

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
        directionalLight.elevation = 32;
        directionalLight.azimuth = 145;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 공용 노멀 맵 텍스처 생성 (선형 포맷 'rgba8unorm')
        // [EN] Create shared normal map textures (linear format 'rgba8unorm')
        const sharedNormalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        const sharedNormalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );

        // [KO] 5개의 독립된 수영장(Lake) 규격 정의 및 생성
        // [EN] Define and create 5 independent pool Lake instances
        const poolConfigs = [
            {x: 0, y: 4.0, z: -32, poolWidth: 32, poolHeight: 32, baseColor: '#18d8b6', deepColor: '#065279'},
            {x: -24, y: 2.0, z: -8, poolWidth: 24, poolHeight: 24, baseColor: '#00a8ff', deepColor: '#001845'},
            {x: 24, y: 2.0, z: -8, poolWidth: 24, poolHeight: 24, baseColor: '#48dbfb', deepColor: '#0abde3'},
            {x: 0, y: 0.0, z: 16, poolWidth: 38, poolHeight: 28, baseColor: '#ff9f43', deepColor: '#ee5253'},
            {x: -22, y: -2.0, z: 38, poolWidth: 22, poolHeight: 22, baseColor: '#9b59b6', deepColor: '#2c003e'},
        ];

        for (let i = 0; i < poolConfigs.length; i++) {
            const cfg = poolConfigs[i];
            const lake = new RedGPU.Water.Lake(redGPUContext, cfg.poolWidth, cfg.poolHeight);
            lake.x = cfg.x;
            lake.waterLevel = cfg.y;
            lake.z = cfg.z;

            const mat = lake.material;
            mat.normalTexture = sharedNormalTexture;
            mat.normalDetailTexture = sharedNormalDetailTexture;
            mat.baseColor.setColorByHEX(cfg.baseColor);
            mat.deepColor.setColorByHEX(cfg.deepColor);

            scene.addWater(lake);
        }

        const animatedObjects = createPrecisePoolEnvironment(redGPUContext, scene, poolConfigs);

        const renderer = new RedGPU.Renderer();
        const animCount = animatedObjects.length;
        renderer.start(redGPUContext, (time) => {
            const sec = time * 0.001;
            for (let i = 0; i < animCount; i++) {
                const item = animatedObjects[i];
                if (item.rotSpeed) {
                    item.mesh.rotationY += item.rotSpeed;
                }
                if (item.bobAmp) {
                    item.mesh.y = item.baseY + Math.sin(sec * item.bobFreq + item.phase) * item.bobAmp;
                }
            }
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPrecisePoolEnvironment = (redGPUContext, scene, poolConfigs) => {
    const animatedList = [];

    const poolRimMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    poolRimMaterial.baseColorFactor = [0.82, 0.82, 0.85, 1.0];
    poolRimMaterial.roughnessFactor = 0.35;
    poolRimMaterial.metallicFactor = 0.05;

    const poolTileMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    poolTileMaterial.baseColorFactor = [0.65, 0.72, 0.78, 1.0];
    poolTileMaterial.roughnessFactor = 0.45;
    poolTileMaterial.metallicFactor = 0.0;

    const cliffMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    cliffMaterial.baseColorFactor = [0.30, 0.28, 0.25, 1.0];
    cliffMaterial.roughnessFactor = 0.9;
    cliffMaterial.metallicFactor = 0.02;

    const goldMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    goldMaterial.baseColorFactor = [1.0, 0.78, 0.28, 1.0];
    goldMaterial.roughnessFactor = 0.15;
    goldMaterial.metallicFactor = 0.95;

    const chromeMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    chromeMaterial.baseColorFactor = [0.95, 0.95, 0.98, 1.0];
    chromeMaterial.roughnessFactor = 0.05;
    chromeMaterial.metallicFactor = 1.0;

    const copperMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    copperMaterial.baseColorFactor = [0.9, 0.45, 0.28, 1.0];
    copperMaterial.roughnessFactor = 0.2;
    copperMaterial.metallicFactor = 0.9;

    const rubyMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rubyMaterial.baseColorFactor = [0.85, 0.15, 0.25, 1.0];
    rubyMaterial.roughnessFactor = 0.25;
    rubyMaterial.metallicFactor = 0.7;

    const emeraldMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    emeraldMaterial.baseColorFactor = [0.15, 0.85, 0.45, 1.0];
    emeraldMaterial.roughnessFactor = 0.2;
    emeraldMaterial.metallicFactor = 0.8;

    const worldBaseMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 160, 160, 16, 16),
        cliffMaterial
    );
    worldBaseMesh.y = -6.0;
    scene.addChild(worldBaseMesh);

    const createWall = (sx, sy, sz, x, y, z) => {
        const wallMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, sx, sy, sz),
            poolRimMaterial
        );
        wallMesh.setPosition(x, y, z);
        wallMesh.castShadow = true;
        scene.addChild(wallMesh);
    };

    const createPillar = (material, x, baseY, z, height) => {
        const pillar = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Cylinder(redGPUContext, 0.55, 0.55, height, 16),
            material
        );
        pillar.setPosition(x, baseY + height / 2, z);
        pillar.castShadow = true;
        scene.addChild(pillar);
    };

    for (let i = 0; i < poolConfigs.length; i++) {
        const cfg = poolConfigs[i];
        const pw = cfg.poolWidth;
        const ph = cfg.poolHeight;
        const basinDepth = 2.5;
        const wallThickness = 1.5;
        const curbHeight = 0.6;
        const totalWallHeight = basinDepth + curbHeight;
        const wallCenterY = cfg.y - basinDepth + totalWallHeight / 2;

        const floorMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Ground(redGPUContext, pw, ph, 8, 8),
            poolTileMaterial
        );
        floorMesh.setPosition(cfg.x, cfg.y - basinDepth, cfg.z);
        scene.addChild(floorMesh);

        createWall(pw + wallThickness * 2, totalWallHeight, wallThickness, cfg.x, wallCenterY, cfg.z - ph / 2 - wallThickness / 2);
        createWall(pw + wallThickness * 2, totalWallHeight, wallThickness, cfg.x, wallCenterY, cfg.z + ph / 2 + wallThickness / 2);
        createWall(wallThickness, totalWallHeight, ph, cfg.x - pw / 2 - wallThickness / 2, wallCenterY, cfg.z);
        createWall(wallThickness, totalWallHeight, ph, cfg.x + pw / 2 + wallThickness / 2, wallCenterY, cfg.z);

        if (i === 0) {
            const ring = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Torus(redGPUContext, 3.2, 0.7, 32, 32),
                goldMaterial
            );
            ring.setPosition(cfg.x, cfg.y + 1.6, cfg.z);
            ring.castShadow = true;
            scene.addChild(ring);
            animatedList.push({mesh: ring, rotSpeed: 0.6, baseY: cfg.y + 1.6, bobAmp: 0.35, bobFreq: 1.5, phase: 0});

            createPillar(chromeMaterial, cfg.x - 7, cfg.y - basinDepth, cfg.z - 7, 6.5);
            createPillar(chromeMaterial, cfg.x + 7, cfg.y - basinDepth, cfg.z - 7, 6.5);
        } else if (i === 1) {
            const sphere = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Sphere(redGPUContext, 2.0, 32, 32),
                chromeMaterial
            );
            sphere.setPosition(cfg.x, cfg.y + 1.3, cfg.z);
            sphere.castShadow = true;
            scene.addChild(sphere);
            animatedList.push({
                mesh: sphere,
                rotSpeed: 0.3,
                baseY: cfg.y + 1.3,
                bobAmp: 0.35,
                bobFreq: 1.8,
                phase: 1.2
            });

            createPillar(goldMaterial, cfg.x - 5, cfg.y - basinDepth, cfg.z + 5, 5.0);
            createPillar(goldMaterial, cfg.x + 5, cfg.y - basinDepth, cfg.z + 5, 5.0);
        } else if (i === 2) {
            const torus = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Torus(redGPUContext, 2.4, 0.5, 32, 32),
                copperMaterial
            );
            torus.setPosition(cfg.x, cfg.y + 1.3, cfg.z);
            torus.castShadow = true;
            scene.addChild(torus);
            animatedList.push({
                mesh: torus,
                rotSpeed: -0.7,
                baseY: cfg.y + 1.3,
                bobAmp: 0.25,
                bobFreq: 1.2,
                phase: 2.1
            });

            const sphere = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Sphere(redGPUContext, 1.4, 24, 24),
                emeraldMaterial
            );
            sphere.setPosition(cfg.x + 4.0, cfg.y + 1.1, cfg.z - 4.0);
            sphere.castShadow = true;
            scene.addChild(sphere);
            animatedList.push({mesh: sphere, rotSpeed: 0.5, baseY: cfg.y + 1.1, bobAmp: 0.2, bobFreq: 2.0, phase: 0.8});
        } else if (i === 3) {
            const bigRing = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Torus(redGPUContext, 3.8, 0.75, 36, 36),
                goldMaterial
            );
            bigRing.setPosition(cfg.x, cfg.y + 1.8, cfg.z);
            bigRing.castShadow = true;
            scene.addChild(bigRing);
            animatedList.push({
                mesh: bigRing,
                rotSpeed: 0.45,
                baseY: cfg.y + 1.8,
                bobAmp: 0.35,
                bobFreq: 1.0,
                phase: 3.0
            });

            const rubySphere = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Sphere(redGPUContext, 1.6, 28, 28),
                rubyMaterial
            );
            rubySphere.setPosition(cfg.x - 8.0, cfg.y + 1.4, cfg.z + 3.0);
            rubySphere.castShadow = true;
            scene.addChild(rubySphere);
            animatedList.push({
                mesh: rubySphere,
                rotSpeed: 0.6,
                baseY: cfg.y + 1.4,
                bobAmp: 0.25,
                bobFreq: 1.6,
                phase: 1.9
            });

            const chromeSphere = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Sphere(redGPUContext, 1.6, 28, 28),
                chromeMaterial
            );
            chromeSphere.setPosition(cfg.x + 8.0, cfg.y + 1.4, cfg.z + 3.0);
            chromeSphere.castShadow = true;
            scene.addChild(chromeSphere);
            animatedList.push({
                mesh: chromeSphere,
                rotSpeed: -0.6,
                baseY: cfg.y + 1.4,
                bobAmp: 0.25,
                bobFreq: 1.6,
                phase: 0.4
            });
        } else if (i === 4) {
            const purpleRing = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Torus(redGPUContext, 2.2, 0.45, 32, 32),
                rubyMaterial
            );
            purpleRing.setPosition(cfg.x, cfg.y + 1.2, cfg.z);
            purpleRing.castShadow = true;
            scene.addChild(purpleRing);
            animatedList.push({
                mesh: purpleRing,
                rotSpeed: 0.8,
                baseY: cfg.y + 1.2,
                bobAmp: 0.3,
                bobFreq: 1.4,
                phase: 2.7
            });

            createPillar(copperMaterial, cfg.x - 4.0, cfg.y - basinDepth, cfg.z - 4.0, 4.5);
            createPillar(copperMaterial, cfg.x + 4.0, cfg.y - basinDepth, cfg.z + 4.0, 4.5);
        }
    }

    return animatedList;
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
