import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Basic Lake 예제
 * [EN] Basic Lake Example
 *
 * [KO] 최소한의 코드로 호수 수체(Lake)를 생성하고, 수위(waterLevel) 및 기본 PBR 물성을 실시간으로 제어하는 입문 예제입니다.
 * [EN] An introductory example creating a Lake with minimal code and controlling waterLevel and PBR properties in real time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 18;
        controller.tilt = -12;
        controller.pan = 8;
        controller.speedDistance = 0.3;

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
        directionalLight.elevation = 28;
        directionalLight.azimuth = 145;
        directionalLight.color.setColorByHEX('#fffbf0');
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 수위 비교용 바닥 지형 및 SSR 반사·굴절 관찰용 랜드마크 오브젝트 생성
        // [EN] Create floor terrain and landmark objects for comparing waterLevel, SSR reflection, and refraction
        createEnvironment(redGPUContext, scene);

        // [KO] 기본 호수(Lake) 수체 생성 및 선형('rgba8unorm') 노멀 텍스처 바인딩
        // [EN] Create basic Lake water body and bind linear ('rgba8unorm') normal textures
        const lake = new RedGPU.Water.Lake(redGPUContext, 60, 60, 180, 180);
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

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, lake, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createEnvironment = (redGPUContext, scene) => {
    const groundMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    groundMaterial.baseColorFactor = [0.32, 0.28, 0.24, 1.0];
    groundMaterial.roughnessFactor = 0.9;
    groundMaterial.metallicFactor = 0.0;

    const groundMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 80, 80, 16, 16),
        groundMaterial
    );
    groundMesh.y = -2.5;
    groundMesh.receiveShadow = true;
    scene.addChild(groundMesh);

    const pillarMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    pillarMaterial.baseColorFactor = [0.85, 0.82, 0.78, 1.0];
    pillarMaterial.roughnessFactor = 0.3;
    pillarMaterial.metallicFactor = 0.1;

    const pillarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.7, 0.7, 7.0, 24);
    [
        {x: -8.0, z: -1.0},
        {x: 8.0, z: -1.0},
        {x: 0, z: -8.0},
    ].forEach((pos) => {
        const pillar = new RedGPU.Display.Mesh(redGPUContext, pillarGeom, pillarMaterial);
        pillar.setPosition(pos.x, 1.0, pos.z);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.addChild(pillar);
    });

    const goldMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    goldMaterial.baseColorFactor = [0.95, 0.75, 0.25, 1.0];
    goldMaterial.roughnessFactor = 0.2;
    goldMaterial.metallicFactor = 0.8;

    const sphereMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 1.6, 24, 24),
        goldMaterial
    );
    sphereMesh.setPosition(-5.0, 0.4, 1.0);
    sphereMesh.castShadow = true;
    scene.addChild(sphereMesh);

    const tealMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    tealMaterial.baseColorFactor = [0.15, 0.65, 0.65, 1.0];
    tealMaterial.roughnessFactor = 0.35;
    tealMaterial.metallicFactor = 0.05;

    const boxMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 2.8, 2.8, 2.8),
        tealMaterial
    );
    boxMesh.setPosition(5.0, 0.2, 1.0);
    boxMesh.rotationY = 25;
    boxMesh.castShadow = true;
    scene.addChild(boxMesh);

    const marbleWhite = new RedGPU.Material.PBRMaterial(redGPUContext);
    marbleWhite.baseColorFactor = [0.92, 0.90, 0.88, 1.0];
    marbleWhite.roughnessFactor = 0.25;
    marbleWhite.metallicFactor = 0.1;

    const gatePillarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.75, 0.75, 8.5, 24);
    const leftGatePillar = new RedGPU.Display.Mesh(redGPUContext, gatePillarGeom, marbleWhite);
    leftGatePillar.setPosition(-6.8, 1.2, -4.5);
    leftGatePillar.castShadow = true;
    scene.addChild(leftGatePillar);

    const rightGatePillar = new RedGPU.Display.Mesh(redGPUContext, gatePillarGeom, marbleWhite);
    rightGatePillar.setPosition(6.8, 1.2, -4.5);
    rightGatePillar.castShadow = true;
    scene.addChild(rightGatePillar);

    const beamMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 16.0, 1.0, 1.4),
        marbleWhite
    );
    beamMesh.setPosition(0, 5.2, -4.5);
    beamMesh.castShadow = true;
    scene.addChild(beamMesh);

    const ringMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    ringMaterial.baseColorFactor = [1.0, 0.78, 0.28, 1.0];
    ringMaterial.roughnessFactor = 0.15;
    ringMaterial.metallicFactor = 0.95;

    const ringMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Torus(redGPUContext, 2.5, 0.65, 32, 32),
        ringMaterial
    );
    ringMesh.setPosition(0, 1.4, -4.5);
    ringMesh.castShadow = true;
    scene.addChild(ringMesh);
};

const renderTestPane = (redGPUContext, lake, directionalLight) => {
    const mat = lake.waterMaterial;
    const colors = {
        baseColor: mat.baseColor.hex,
        deepColor: mat.deepColor.hex
    };

    new RedGPUExampleHelper(redGPUContext, {
        globalWind: true,
        gui: (pane) => {
            const lakeFolder = pane.addFolder({title: 'Lake', expanded: true});
            lakeFolder.addBinding(lake, 'waterLevel', {min: -2.0, max: 2.0, step: 0.02});
            lakeFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 0.08, step: 0.001});
            lakeFolder.addBinding(lake, 'waveWavelength', {min: 4.0, max: 30.0, step: 0.5});

            const matFolder = pane.addFolder({title: 'LakeMaterial', expanded: true});
            matFolder.addBinding(colors, 'baseColor').on('change', (ev) => mat.baseColor.setColorByHEX(ev.value));
            matFolder.addBinding(colors, 'deepColor').on('change', (ev) => mat.deepColor.setColorByHEX(ev.value));
            matFolder.addBinding(mat, 'roughness', {min: 0.0, max: 1.0, step: 0.01});
            matFolder.addBinding(mat, 'opacity', {min: 0.0, max: 1.0, step: 0.01});
            matFolder.addBinding(mat, 'enableSSR');

            const normalFolder = matFolder.addFolder({title: 'Normal', expanded: true});
            normalFolder.addBinding(mat, 'normalScale', {min: 0.0, max: 1.0, step: 0.01});
            normalFolder.addBinding(mat, 'normalTiling', {min: 1.0, max: 60.0, step: 1.0});
            normalFolder.addBinding(mat, 'normalDetailScale', {min: 0.0, max: 1.0, step: 0.01});
            normalFolder.addBinding(mat, 'normalDetailTiling', {min: 1.0, max: 100.0, step: 1.0});
            normalFolder.addBinding(mat, 'flowRateScale', {min: 0.0, max: 0.2, step: 0.005});

            const lightFolder = pane.addFolder({title: 'DirectionalLight', expanded: true});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
};
