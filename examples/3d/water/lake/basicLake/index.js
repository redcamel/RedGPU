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
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 수위(waterLevel) 비교용 바닥 및 기본 프리미티브 배치
        // [EN] Place floor and basic primitives for waterLevel comparison
        createEnvironment(redGPUContext, scene);

        // [KO] 기본 호수(Lake) 수체 생성 및 선형('rgba8unorm') 노멀 텍스처 바인딩
        // [EN] Create basic Lake water body and bind linear ('rgba8unorm') normal textures
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

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, lake);
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

    const groundMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 100, 100),
        groundMaterial
    );
    groundMesh.y = -2.5;
    groundMesh.receiveShadow = true;
    scene.addChild(groundMesh);

    const pillarMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    pillarMaterial.baseColorFactor = [0.85, 0.82, 0.78, 1.0];
    pillarMaterial.roughnessFactor = 0.3;
    pillarMaterial.metallicFactor = 0.1;

    const pillarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.7, 0.7, 6.0, 24);
    [
        {x: -6.5, y: -0.5, z: -3.5},
        {x: 0.0, y: 0.5, z: -5.5},
        {x: 6.5, y: 1.5, z: -3.5},
    ].forEach((pos) => {
        const pillar = new RedGPU.Display.Mesh(redGPUContext, pillarGeom, pillarMaterial);
        pillar.setPosition(pos.x, pos.y, pos.z);
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
    sphereMesh.setPosition(-4.0, 0.2, 1.5);
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
    boxMesh.setPosition(4.0, 0.0, 1.5);
    boxMesh.rotationY = 25;
    boxMesh.castShadow = true;
    scene.addChild(boxMesh);
};

const renderTestPane = (redGPUContext, lake) => {
    const mat = lake.material;
    const colors = {
        baseColor: mat.baseColor.hex,
        deepColor: mat.deepColor.hex
    };

    new RedGPUExampleHelper(redGPUContext, {
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
        }
    });
};
