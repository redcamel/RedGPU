import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Height Fog 예제
 * [EN] Height Fog example
 *
 * [KO] 포스트 이펙트를 사용하여 월드 높이(Y축)와 거리 기반 안개(Height Fog) 효과를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply world-height (Y-axis) and distance-based fog (Height Fog) effects using post effects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.speedDistance = 1;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] HeightFog 포스트 이펙트 생성 및 뷰에 추가
        // [EN] Create HeightFog post effect and add it to the view
        const heightFog = new RedGPU.PostEffect.HeightFog(redGPUContext);
        heightFog.density = 1.8;
        heightFog.fogColor.setColorByRGB(255, 245, 220);
        heightFog.baseHeight = -2;
        heightFog.thickness = 6;
        heightFog.falloff = 1;
        view.postEffectManager.addEffect(heightFog);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        createGroundLevelScene(redGPUContext, scene);

        const autoRotateState = {autoRotate: true};
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const {children} = scene;
            const len = children.length;
            for (let i = 0; i < len; i++) {
                const child = children[i];
                const {userData} = child;
                if (userData) {
                    if (userData.isFloating) {
                        const floatSpeed = 0.001 + (i % 3) * 0.0003;
                        const floatAmount = 0.2 + (i % 2) * 0.15;
                        child.y = userData.baseY + Math.sin(time * floatSpeed + i) * floatAmount;
                    }
                    if (userData.isRotating) {
                        child.rotationY += 0.002 + (i % 3) * 0.001;
                    }
                    if (userData.isLantern) {
                        const flickerSpeed = 0.003 + (i % 4) * 0.001;
                        child.material.emissiveStrength = 0.7 + Math.sin(time * flickerSpeed + i * 2) * 0.3;
                    }
                }
            }

            if (autoRotateState.autoRotate) {
                controller.pan += 0.2;
            }
        });

        renderTestPane(redGPUContext, view, heightFog, autoRotateState);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createGroundLevelScene = (redGPUContext, scene) => {
    const terrain = new RedGPU.Primitive.Ground(redGPUContext, 200, 200, 1024, 1024);
    const terrainMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#2d4a2d');

    const terrainNoise = new RedGPU.Resource.SimplexTexture(redGPUContext, 512, 512, {
        mainLogic: `
            let noise1 = getSimplexNoiseByDimension(base_uv * 2.0, uniforms);
            let noise2 = getSimplexNoiseByDimension(base_uv * 4.0, uniforms) * 0.5;
            let heightValue = (noise1 + noise2) * 0.3 + 0.7;
            let finalColor = vec4<f32>(heightValue, heightValue, heightValue, 1.0);
        `
    });
    terrainNoise.frequency = 1.8;
    terrainNoise.amplitude = 1.5;
    terrainNoise.octaves = 8;

    terrainMaterial.displacementTexture = terrainNoise;
    terrainMaterial.displacementScale = 13.0;

    const terrainMesh = new RedGPU.Display.Mesh(redGPUContext, terrain, terrainMaterial);
    terrainMesh.y = -4;
    scene.addChild(terrainMesh);

    const forestPositions = [
        {x: -15, z: -20, height: 3, radius: 0.3, density: 'dense'},
        {x: -10, z: -25, height: 4, radius: 0.4, density: 'dense'},
        {x: 20, z: -15, height: 3.5, radius: 0.35, density: 'dense'},
        {x: 0, z: -30, height: 6, radius: 0.5, density: 'medium'},
        {x: 25, z: 10, height: 7, radius: 0.45, density: 'medium'},
        {x: -30, z: 5, height: 6.5, radius: 0.4, density: 'medium'},
        {x: 15, z: 20, height: 9, radius: 0.6, density: 'sparse'},
        {x: -20, z: 25, height: 10, radius: 0.55, density: 'sparse'}
    ];

    const treeColors = {
        dense: '#1a3d1a',
        medium: '#2d5a2d',
        sparse: '#4a7c4a'
    };

    forestPositions.forEach((pos) => {
        const treeHeight = pos.height + Math.random() * 2;
        const tree = new RedGPU.Primitive.Cylinder(redGPUContext, pos.radius, treeHeight, 8);
        const treeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, treeColors[pos.density]);
        const treeMesh = new RedGPU.Display.Mesh(redGPUContext, tree, treeMaterial);

        treeMesh.x = pos.x + (Math.random() - 0.5) * 4;
        treeMesh.z = pos.z + (Math.random() - 0.5) * 4;
        treeMesh.y = treeHeight / 2 - 2;
        treeMesh.userData = {isRotating: pos.density === 'sparse'};
        scene.addChild(treeMesh);

        const crownSize = pos.radius * (1.5 + Math.random() * 0.5);
        const crown = new RedGPU.Primitive.Sphere(redGPUContext, crownSize, 12, 12);
        const crownMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#2d6b2d');
        const crownMesh = new RedGPU.Display.Mesh(redGPUContext, crown, crownMaterial);
        crownMesh.setPosition(treeMesh.x, treeMesh.y + treeHeight / 2 + crownSize * 0.7, treeMesh.z);
        scene.addChild(crownMesh);
    });

    const monuments = [
        {x: 0, z: 0, y: 1, height: 8, type: 'obelisk'},
        {x: -12, z: -8, y: 4, height: 5, type: 'pillar'},
        {x: 18, z: -5, y: 7, height: 6, type: 'statue'},
        {x: -8, z: 15, y: 10, height: 4, type: 'altar'}
    ];

    monuments.forEach((monument) => {
        let monumentGeom;
        let monumentColor;

        switch (monument.type) {
            case 'obelisk':
                monumentGeom = new RedGPU.Primitive.Box(redGPUContext, 1.5, monument.height, 1.5);
                monumentColor = '#8B7355';
                break;
            case 'pillar':
                monumentGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.8, monument.height, 12);
                monumentColor = '#A0522D';
                break;
            case 'statue':
                monumentGeom = new RedGPU.Primitive.Box(redGPUContext, 2, monument.height, 1.2);
                monumentColor = '#696969';
                break;
            case 'altar':
                monumentGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 2, monument.height * 0.3, 8);
                monumentColor = '#8FBC8F';
                break;
        }

        const monumentMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, monumentColor);
        const monumentMesh = new RedGPU.Display.Mesh(redGPUContext, monumentGeom, monumentMaterial);
        monumentMesh.setPosition(monument.x, monument.y, monument.z);
        monumentMesh.userData = {isRotating: monument.type === 'obelisk'};
        scene.addChild(monumentMesh);
    });

    const lanternPositions = [
        {x: -5, z: -10, y: 0.5},
        {x: 8, z: -12, y: 2.5},
        {x: -15, z: 8, y: 5.5},
        {x: 12, z: 15, y: 8.5}
    ];

    lanternPositions.forEach((pos) => {
        const lanternPole = new RedGPU.Primitive.Cylinder(redGPUContext, 0.15, 3, 8);
        const poleMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#654321');
        const poleMesh = new RedGPU.Display.Mesh(redGPUContext, lanternPole, poleMaterial);
        poleMesh.setPosition(pos.x, pos.y + 1.5, pos.z);
        scene.addChild(poleMesh);

        const lantern = new RedGPU.Primitive.Sphere(redGPUContext, 0.4, 12, 12);
        const lanternMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#FFD700');
        lanternMaterial.emissiveColor.setColorByHEX('#FFD700');
        lanternMaterial.emissiveStrength = 0.8;

        const lanternMesh = new RedGPU.Display.Mesh(redGPUContext, lantern, lanternMaterial);
        lanternMesh.setPosition(pos.x, pos.y + 3.2, pos.z);
        lanternMesh.userData = {isLantern: true};
        scene.addChild(lanternMesh);
    });

    const bridge = new RedGPU.Primitive.Box(redGPUContext, 20, 0.5, 2.5);
    const bridgeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#8B4513');
    const bridgeMesh = new RedGPU.Display.Mesh(redGPUContext, bridge, bridgeMaterial);
    bridgeMesh.setPosition(5, 3.5, 2);
    scene.addChild(bridgeMesh);

    for (let i = -2; i <= 2; i++) {
        const pillar = new RedGPU.Primitive.Cylinder(redGPUContext, 0.4, 6, 8);
        const pillarMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#654321');
        const pillarMesh = new RedGPU.Display.Mesh(redGPUContext, pillar, pillarMaterial);
        pillarMesh.setPosition(5 + i * 5, 0.5, 2);
        scene.addChild(pillarMesh);
    }

    const testHeights = [0, 2, 4, 6, 8, 10];
    testHeights.forEach((height, index) => {
        const testSphere = new RedGPU.Primitive.Sphere(redGPUContext, 0.8, 16, 16);
        const intensity = Math.min(255, 100 + height * 20);
        const testMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        testMaterial.color.setColorByRGB(
            intensity,
            Math.min(255, intensity + 20),
            Math.min(255, intensity + 40)
        );

        const testMesh = new RedGPU.Display.Mesh(redGPUContext, testSphere, testMaterial);
        testMesh.setPosition(-25 + index * 3, height, 30);
        testMesh.userData = {isFloating: true, baseY: height};
        scene.addChild(testMesh);
    });
};

const renderTestPane = (redGPUContext, view, heightFog, autoRotateState) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const config = {
                HeightFog: true,
                fogColor: {
                    r: heightFog.fogColor.r,
                    g: heightFog.fogColor.g,
                    b: heightFog.fogColor.b
                }
            };

            const heightFogFolder = pane.addFolder({title: 'PostEffect', expanded: true});

            heightFogFolder.addBinding(config, 'HeightFog').on('change', (ev) => {
                if (ev.value) {
                    view.postEffectManager.addEffect(heightFog);
                } else {
                    view.postEffectManager.removeAllEffect();
                }
                controls.forEach((c) => c.disabled = !ev.value);
                scenarioFolder.disabled = !ev.value;
            });

            heightFogFolder.addBinding(autoRotateState, 'autoRotate');

            const controls = [
                heightFogFolder.addBinding(heightFog, 'fogType', {
                    options: {
                        EXPONENTIAL: RedGPU.PostEffect.HeightFog.EXPONENTIAL,
                        EXPONENTIAL_SQUARED: RedGPU.PostEffect.HeightFog.EXPONENTIAL_SQUARED
                    }
                }),
                heightFogFolder.addBinding(heightFog, 'density', {min: 0, max: 5, step: 0.1}),
                heightFogFolder.addBinding(heightFog, 'baseHeight', {min: -5, max: 8, step: 0.1}),
                heightFogFolder.addBinding(heightFog, 'thickness', {min: 0.1, max: 50, step: 0.5}),
                heightFogFolder.addBinding(heightFog, 'falloff', {min: 0.001, max: 2, step: 0.01}),
                heightFogFolder.addBinding(heightFog, 'startDepth', {min: 0, max: 100, step: 1}),
                heightFogFolder.addBinding(heightFog, 'endDepth', {min: 0, max: 200, step: 1}),
                heightFogFolder.addBinding(config, 'fogColor').on('change', (ev) => {
                    heightFog.fogColor.setColorByRGB(
                        Math.round(ev.value.r),
                        Math.round(ev.value.g),
                        Math.round(ev.value.b)
                    );
                })
            ];

            const scenarioFolder = heightFogFolder.addFolder({title: 'Presets', expanded: true});

            const applyPreset = (density, baseHeight, thickness, falloff, fogColor, fogType) => {
                heightFog.density = density;
                heightFog.baseHeight = baseHeight;
                heightFog.thickness = thickness;
                heightFog.falloff = falloff;
                heightFog.fogType = fogType;
                heightFog.fogColor.setColorByRGB(fogColor.r, fogColor.g, fogColor.b);
                config.fogColor = fogColor;
                pane.refresh();
            };

            scenarioFolder.addButton({title: 'Dawn Valley'}).on('click', () => {
                applyPreset(1.8, -2, 6, 1.0, {r: 255, g: 245, b: 220}, RedGPU.PostEffect.HeightFog.EXPONENTIAL);
            });
            scenarioFolder.addButton({title: 'Mysterious Forest'}).on('click', () => {
                applyPreset(2.5, -1, 8, 1.4, {r: 180, g: 200, b: 180}, RedGPU.PostEffect.HeightFog.EXPONENTIAL);
            });
            scenarioFolder.addButton({title: 'Ancient Ruins'}).on('click', () => {
                applyPreset(2.0, 0, 7, 1.2, {r: 200, g: 190, b: 160}, RedGPU.PostEffect.HeightFog.EXPONENTIAL);
            });
            scenarioFolder.addButton({title: 'Moonlit Mist'}).on('click', () => {
                applyPreset(1.5, -1.5, 9, 0.8, {r: 160, g: 170, b: 200}, RedGPU.PostEffect.HeightFog.EXPONENTIAL);
            });
        }
    });
};
