import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Waves & Optics 예제
 * [EN] Waves & Optics Example
 *
 * [KO] 듀얼 노멀 맵(Layer 1 + Detail Layer 2), 바람 시뮬레이션, 수중 굴절, 코스틱스 및 PBR 광학 제어를 시연합니다.
 * [EN] Demonstrates dual normal map blending (Layer 1 + Detail Layer 2), wind simulation, refraction, caustics, and PBR optics control.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = -13;
        controller.pan = 10;
        controller.speedDistance = 0.3;

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
        directionalLight.elevation = 30;
        directionalLight.azimuth = 145;
        directionalLight.color.setColorByHEX('#fffbf0');
        directionalLight.lux = 75000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 굴절, 수심별 빛 감쇄, 코스틱스 및 SSR 반사 관찰용 환경 생성
        // [EN] Create underwater steps and SSR landmark environment for refraction, depth attenuation, and caustics
        createUnderwaterEnvironment(redGPUContext, scene);

        // [KO] 호수(Lake) 수체 생성 및 듀얼 노멀 텍스처('rgba8unorm') 바인딩
        // [EN] Create Lake water body and bind dual normal textures ('rgba8unorm')
        const lake = new RedGPU.Water.Lake(redGPUContext, 70, 70, 80, 80);
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

        renderTestPane(redGPUContext, scene, lake, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createUnderwaterEnvironment = (redGPUContext, scene) => {
    const sandMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    sandMaterial.baseColorFactor = [0.45, 0.40, 0.32, 1.0];
    sandMaterial.roughnessFactor = 0.85;
    sandMaterial.metallicFactor = 0.0;

    const floorMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 80, 80, 20, 20),
        sandMaterial
    );
    floorMesh.y = -3.5;
    floorMesh.receiveShadow = true;
    scene.addChild(floorMesh);

    const marbleMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    marbleMaterial.baseColorFactor = [0.88, 0.85, 0.80, 1.0];
    marbleMaterial.roughnessFactor = 0.25;
    marbleMaterial.metallicFactor = 0.05;

    [
        {w: 6, h: 1.0, d: 6, x: -6, y: -0.5, z: -2},
        {w: 6, h: 1.0, d: 6, x: 0, y: -1.2, z: -2},
        {w: 6, h: 1.0, d: 6, x: 6, y: -2.0, z: -2},
        {w: 6, h: 1.0, d: 6, x: 12, y: -2.8, z: -2},
    ].forEach((step) => {
        const box = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, step.w, step.h, step.d),
            marbleMaterial
        );
        box.setPosition(step.x, step.y, step.z);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.addChild(box);
    });

    const columnMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    columnMaterial.baseColorFactor = [0.75, 0.25, 0.25, 1.0];
    columnMaterial.roughnessFactor = 0.3;
    columnMaterial.metallicFactor = 0.1;

    const colMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.6, 0.6, 6.0, 24),
        columnMaterial
    );
    colMesh.setPosition(-5.2, 0.5, 1.0);
    colMesh.castShadow = true;
    scene.addChild(colMesh);

    const metalMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    metalMaterial.baseColorFactor = [0.95, 0.80, 0.30, 1.0];
    metalMaterial.roughnessFactor = 0.15;
    metalMaterial.metallicFactor = 0.9;

    const sphereMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 1.5, 24, 24),
        metalMaterial
    );
    sphereMesh.setPosition(5.2, 0.3, 1.0);
    sphereMesh.castShadow = true;
    scene.addChild(sphereMesh);

    const darkObsidian = new RedGPU.Material.PBRMaterial(redGPUContext);
    darkObsidian.baseColorFactor = [0.12, 0.14, 0.18, 1.0];
    darkObsidian.roughnessFactor = 0.18;
    darkObsidian.metallicFactor = 0.85;

    const towerMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 1.8, 11.0, 1.8),
        darkObsidian
    );
    towerMesh.setPosition(0.0, 3.5, -5.5);
    towerMesh.castShadow = true;
    scene.addChild(towerMesh);

    const cyanMetal = new RedGPU.Material.PBRMaterial(redGPUContext);
    cyanMetal.baseColorFactor = [0.10, 0.85, 0.85, 1.0];
    cyanMetal.roughnessFactor = 0.12;
    cyanMetal.metallicFactor = 0.95;

    const towerRing = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Torus(redGPUContext, 2.5, 0.65, 32, 32),
        cyanMetal
    );
    towerRing.setPosition(0.0, 1.5, -5.5);
    towerRing.castShadow = true;
    scene.addChild(towerRing);

    const rubyMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rubyMaterial.baseColorFactor = [0.95, 0.25, 0.20, 1.0];
    rubyMaterial.roughnessFactor = 0.2;
    rubyMaterial.metallicFactor = 0.7;

    const rubyPillar = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.75, 0.75, 9.0, 24),
        rubyMaterial
    );
    rubyPillar.setPosition(-7.5, 1.5, -5.5);
    rubyPillar.castShadow = true;
    scene.addChild(rubyPillar);

    const amberMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    amberMaterial.baseColorFactor = [0.95, 0.65, 0.15, 1.0];
    amberMaterial.roughnessFactor = 0.2;
    amberMaterial.metallicFactor = 0.7;

    const amberPillar = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.75, 0.75, 9.0, 24),
        amberMaterial
    );
    amberPillar.setPosition(7.5, 1.5, -5.5);
    amberPillar.castShadow = true;
    scene.addChild(amberPillar);
};

const renderTestPane = (redGPUContext, scene, lake, directionalLight) => {
    const wind = scene.windManager;
    const mat = lake.waterMaterial;
    const colors = {
        baseColor: mat.baseColor.hex,
        deepColor: mat.deepColor.hex
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const windFolder = pane.addFolder({title: 'Wind & Flow', expanded: true});
            windFolder.addBinding(wind, 'enabled');
            windFolder.addBinding(wind, 'speed', {min: 0.0, max: 5.0, step: 0.1});
            windFolder.addBinding(wind, 'strength', {min: 0.0, max: 2.0, step: 0.05});
            windFolder.addBinding(wind, 'directionAngle', {min: 0, max: 360, step: 1});
            windFolder.addBinding(mat, 'flowRateScale', {min: 0.0, max: 0.1, step: 0.002});

            const layer1Folder = pane.addFolder({title: 'Wave Layer 1', expanded: true});
            layer1Folder.addBinding(mat, 'normalScale', {min: 0.0, max: 1.0, step: 0.02});
            layer1Folder.addBinding(mat, 'normalTiling', {min: 2.0, max: 50.0, step: 1.0});

            const layer2Folder = pane.addFolder({title: 'Wave Layer 2 (Detail)', expanded: true});
            layer2Folder.addBinding(mat, 'normalDetailScale', {min: 0.0, max: 1.0, step: 0.02});
            layer2Folder.addBinding(mat, 'normalDetailTiling', {min: 5.0, max: 80.0, step: 1.0});

            const opticsFolder = pane.addFolder({title: 'Optics & Refraction', expanded: false});
            opticsFolder.addBinding(mat, 'refractionStrength', {min: 0.0, max: 1.0, step: 0.02});
            opticsFolder.addBinding(mat, 'extinctionFactor', {min: 0.0, max: 1.0, step: 0.01});
            opticsFolder.addBinding(mat, 'depthFadeDistance', {min: 0.1, max: 5.0, step: 0.1});
            opticsFolder.addBinding(mat, 'turbidity', {min: 0.0, max: 1.0, step: 0.02});
            opticsFolder.addBinding(mat, 'specularFactor', {min: 0.0, max: 2.0, step: 0.05});
            opticsFolder.addBinding(mat, 'roughness', {min: 0.0, max: 1.0, step: 0.01});
            opticsFolder.addBinding(colors, 'baseColor').on('change', (ev) => mat.baseColor.setColorByHEX(ev.value));
            opticsFolder.addBinding(colors, 'deepColor').on('change', (ev) => mat.deepColor.setColorByHEX(ev.value));

            const causticsFolder = pane.addFolder({title: 'Caustics', expanded: false});
            causticsFolder.addBinding(mat, 'causticsStrength', {min: 0.0, max: 2.0, step: 0.05});
            causticsFolder.addBinding(mat, 'causticsScale', {min: 0.2, max: 5.0, step: 0.1});
            causticsFolder.addBinding(mat, 'causticsSpeed', {min: 0.0, max: 3.0, step: 0.1});

            const lightFolder = pane.addFolder({title: 'DirectionalLight', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
};
