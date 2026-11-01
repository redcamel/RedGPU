import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Height Fog 예제
 * [EN] Height Fog example
 *
 * [KO] 내장(Built-in) 포스트 이펙트를 사용하여 선형 HDR 공간에서 3D 광선-고도 해석적 선적분 기반 안개(Height Fog) 효과를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply Analytical 3D Ray-Height Line Integral fog (Height Fog) in Linear HDR space using the built-in post effect.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 28;
        controller.speedDistance = 1;
        controller.tilt = -18;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] BuiltInEffectManager를 통한 고도 기반 안개(HeightFog) 활성화
        // [KO] - 기본값(언리얼 엔진 표준): density = 0.02, baseHeight = 0, falloff = 0.2, nearDistance = 0, farDistance = 50
        // [EN] Enable altitude-based HeightFog via BuiltInEffectManager
        // [EN] - Default values (Unreal Engine standard): density = 0.02, baseHeight = 0, falloff = 0.2, nearDistance = 0, farDistance = 50
        view.builtInEffectManager.useHeightFog = true;
        const heightFog = view.builtInEffectManager.heightFog;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        createValleyScene(redGPUContext, scene);

        const autoRotateState = {autoRotate: true};
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (autoRotateState.autoRotate) {
                controller.pan += 0.15;
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

const createValleyScene = (redGPUContext, scene) => {
    const terrain = new RedGPU.Primitive.Ground(redGPUContext, 200, 200, 512, 512);
    const terrainMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#2d4a2d');

    const terrainNoise = new RedGPU.Resource.SimplexTexture(redGPUContext, 512, 512, {
        mainLogic: `
            let noise1 = getSimplexNoiseByDimension(base_uv * 2.0, uniforms);
            let noise2 = getSimplexNoiseByDimension(base_uv * 4.0, uniforms) * 0.5;
            let heightValue = (noise1 + noise2) * 0.35 + 0.5;
            let finalColor = vec4<f32>(heightValue, heightValue, heightValue, 1.0);
        `
    });
    terrainNoise.frequency = 1.8;
    terrainNoise.amplitude = 1.4;
    terrainNoise.octaves = 6;

    terrainMaterial.displacementTexture = terrainNoise;
    terrainMaterial.displacementScale = 10.0;

    const terrainMesh = new RedGPU.Display.Mesh(redGPUContext, terrain, terrainMaterial);
    terrainMesh.y = -12;
    scene.addChild(terrainMesh);

    const towerData = [
        {x: 0, z: 0, height: 15, radius: 1.1, color: '#8B7355'},
        {x: -10, z: -8, height: 11, radius: 0.85, color: '#A0522D'},
        {x: 12, z: -6, height: 13, radius: 0.9, color: '#708090'},
        {x: -8, z: 12, height: 9, radius: 0.75, color: '#8FBC8F'},
        {x: 10, z: 14, height: 17, radius: 1.0, color: '#696969'},
        {x: -18, z: 4, height: 12, radius: 0.8, color: '#8B7355'},
        {x: 20, z: 4, height: 10, radius: 0.8, color: '#A0522D'}
    ];

    towerData.forEach((item) => {
        const baseY = -7;
        const pillarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, item.radius * 0.75, item.radius, item.height, 8);
        const pillarMat = new RedGPU.Material.PhongMaterial(redGPUContext, item.color);
        const pillarMesh = new RedGPU.Display.Mesh(redGPUContext, pillarGeom, pillarMat);
        pillarMesh.setPosition(item.x, baseY + item.height * 0.5, item.z);
        scene.addChild(pillarMesh);

        const beaconGeom = new RedGPU.Primitive.Sphere(redGPUContext, item.radius * 0.45, 16, 16);
        const beaconMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#FFD700');
        beaconMat.emissiveColor.setColorByHEX('#FFAA22');
        beaconMat.emissiveStrength = 2.5;
        const beaconMesh = new RedGPU.Display.Mesh(redGPUContext, beaconGeom, beaconMat);
        beaconMesh.setPosition(item.x, baseY + item.height + item.radius * 0.5, item.z);
        scene.addChild(beaconMesh);
    });

    const bridgeGeom = new RedGPU.Primitive.Box(redGPUContext, 22, 0.5, 2.4);
    const bridgeMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#8B4513');
    const bridgeMesh = new RedGPU.Display.Mesh(redGPUContext, bridgeGeom, bridgeMat);
    bridgeMesh.setPosition(1, 0.5, -7);
    scene.addChild(bridgeMesh);

    for (let i = -2; i <= 2; i++) {
        const supportGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.35, 0.4, 8, 8);
        const supportMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#5c3a1e');
        const supportMesh = new RedGPU.Display.Mesh(redGPUContext, supportGeom, supportMat);
        supportMesh.setPosition(1 + i * 4.5, -3.5, -7);
        scene.addChild(supportMesh);
    }

    const treePositions = [
        {x: -14, z: -16, height: 8, radius: 0.35},
        {x: -6, z: -20, height: 9, radius: 0.4},
        {x: 16, z: -15, height: 8.5, radius: 0.35},
        {x: 4, z: -24, height: 10, radius: 0.45},
        {x: 22, z: 12, height: 11, radius: 0.45},
        {x: -22, z: -6, height: 9.5, radius: 0.4},
        {x: 14, z: 22, height: 12, radius: 0.5},
        {x: -16, z: 20, height: 11.5, radius: 0.5}
    ];

    treePositions.forEach((pos) => {
        const baseY = -7;
        const trunkGeom = new RedGPU.Primitive.Cylinder(redGPUContext, pos.radius * 0.6, pos.radius, pos.height, 8);
        const trunkMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#4a3219');
        const trunkMesh = new RedGPU.Display.Mesh(redGPUContext, trunkGeom, trunkMat);
        trunkMesh.setPosition(pos.x, baseY + pos.height * 0.5, pos.z);
        scene.addChild(trunkMesh);

        const crownRadius = pos.radius * 3.2;
        const crownGeom = new RedGPU.Primitive.Sphere(redGPUContext, crownRadius, 12, 12);
        const crownMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#2d6b2d');
        const crownMesh = new RedGPU.Display.Mesh(redGPUContext, crownGeom, crownMat);
        crownMesh.setPosition(pos.x, baseY + pos.height + crownRadius * 0.5, pos.z);
        scene.addChild(crownMesh);
    });
};

const renderTestPane = (redGPUContext, view, heightFog, autoRotateState) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const config = {
                fogColor: {
                    r: heightFog.fogColor.r,
                    g: heightFog.fogColor.g,
                    b: heightFog.fogColor.b
                }
            };

            const heightFogFolder = pane.addFolder({title: 'PostEffect', expanded: true});

            heightFogFolder.addBinding(view.builtInEffectManager, 'useHeightFog').on('change', (ev) => {
                controls.forEach((c) => c.disabled = !ev.value);
                scenarioFolder.disabled = !ev.value;
            });

            heightFogFolder.addBinding(autoRotateState, 'autoRotate');

            const controls = [
                heightFogFolder.addBinding(heightFog, 'fogType', {
                    options: {
                        EXPONENTIAL: RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL,
                        EXPONENTIAL_SQUARED: RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL_SQUARED
                    }
                }),
                heightFogFolder.addBinding(heightFog, 'density', {min: 0, max: 0.2, step: 0.001}),
                heightFogFolder.addBinding(heightFog, 'baseHeight', {min: -10, max: 10, step: 0.1}),
                heightFogFolder.addBinding(heightFog, 'falloff', {min: 0.001, max: 1, step: 0.005}),
                heightFogFolder.addBinding(heightFog, 'nearDistance', {
                    min: 0,
                    max: 50,
                    step: 0.5
                }).on('change', (ev) => {
                    if (heightFog.farDistance <= ev.value) {
                        heightFog.farDistance = ev.value + 1;
                        pane.refresh();
                    }
                }),
                heightFogFolder.addBinding(heightFog, 'farDistance', {
                    min: 1,
                    max: 100,
                    step: 0.5
                }).on('change', (ev) => {
                    if (ev.value <= heightFog.nearDistance) {
                        heightFog.farDistance = heightFog.nearDistance + 1;
                        pane.refresh();
                    }
                }),
                heightFogFolder.addBinding(heightFog, 'maxOpacity', {min: 0, max: 1, step: 0.01}),
                heightFogFolder.addBinding(config, 'fogColor', {picker: 'inline', view: 'color'}).on('change', (ev) => {
                    heightFog.fogColor.setColorByRGB(
                        Math.floor(ev.value.r),
                        Math.floor(ev.value.g),
                        Math.floor(ev.value.b)
                    );
                })
            ];

            const scenarioFolder = heightFogFolder.addFolder({title: 'Presets', expanded: true});

            const applyPreset = (density, baseHeight, falloff, nearDistance, farDistance, maxOpacity, fogColor, fogType) => {
                heightFog.density = density;
                heightFog.baseHeight = baseHeight;
                heightFog.falloff = falloff;
                heightFog.nearDistance = nearDistance;
                heightFog.farDistance = farDistance;
                heightFog.maxOpacity = maxOpacity;
                heightFog.fogType = fogType;
                heightFog.fogColor.setColorByRGB(fogColor.r, fogColor.g, fogColor.b);
                config.fogColor.r = fogColor.r;
                config.fogColor.g = fogColor.g;
                config.fogColor.b = fogColor.b;
                pane.refresh();
            };

            scenarioFolder.addButton({title: 'Default (Unreal)'}).on('click', () => {
                applyPreset(0.02, 0, 0.2, 0, 50, 1, {
                    r: 200,
                    g: 210,
                    b: 255
                }, RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL);
            });
            scenarioFolder.addButton({title: 'Dawn Valley'}).on('click', () => {
                applyPreset(0.035, 1.0, 0.25, 0, 55, 1, {
                    r: 255,
                    g: 240,
                    b: 215
                }, RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL);
            });
            scenarioFolder.addButton({title: 'Mysterious Forest'}).on('click', () => {
                applyPreset(0.05, 2.5, 0.2, 0, 45, 0.9, {
                    r: 180,
                    g: 205,
                    b: 185
                }, RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL);
            });
            scenarioFolder.addButton({title: 'Ancient Ruins'}).on('click', () => {
                applyPreset(0.04, 1.5, 0.3, 2, 60, 0.95, {
                    r: 215,
                    g: 195,
                    b: 165
                }, RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL_SQUARED);
            });
        }
    });
};
