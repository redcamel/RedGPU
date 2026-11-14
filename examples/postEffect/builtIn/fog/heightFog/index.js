import * as RedGPU from "../../../../../dist/index.js?t=1794639759027";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1794639759027";

/**
 * [KO] Height Fog 예제
 * [EN] Height Fog example
 *
 * [KO] 고도 기반 안개(Height Fog) 이펙트를 사용하여 기준 높이(baseHeight)와 안개 두께(height), 거리에 따른 대기 안개 효과를 시연합니다.
 * [EN] Demonstrates altitude- and distance-based atmospheric fog using Height Fog with baseHeight and height controls.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 34;
        controller.speedDistance = 1;
        controller.tilt = -18;
        controller.pan = 25;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] HeightFog 이펙트 활성화 및 초기 고도 구간(baseHeight ~ baseHeight + height) 설정
        // [EN] Enable HeightFog effect and configure initial altitude band (baseHeight to baseHeight + height)
        view.builtInEffectManager.useHeightFog = true;
        const heightFog = view.builtInEffectManager.heightFog;
        heightFog.density = 0.035;
        heightFog.baseHeight = 0;
        heightFog.height = 12;
        heightFog.nearDistance = 0;
        heightFog.farDistance = 65;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        createHeightFogTestScene(redGPUContext, scene);

        const autoRotateState = {autoRotate: true};
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (autoRotateState.autoRotate) {
                controller.pan += 0.12;
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

const createHeightFogTestScene = (redGPUContext, scene) => {
    // [KO] 1. 고도 기준면 확인용 3단 계단식 분지 지형 (Y = -8 심연 바닥, Y = -4 중간 단상, Y = 0 기준 대지)
    // [EN] 1. 3-tier stepped basin terrain for altitude reference (Y = -8 deep floor, Y = -4 mid terrace, Y = 0 base ground)
    const deepFloorGeom = new RedGPU.Primitive.Ground(redGPUContext, 160, 160, 1, 1);
    const deepFloorMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#243038');
    const deepFloorMesh = new RedGPU.Display.Mesh(redGPUContext, deepFloorGeom, deepFloorMat);
    deepFloorMesh.y = -8;
    scene.addChild(deepFloorMesh);

    const terracePositions = [
        {x: -22, z: -22, w: 28, d: 28, y: -4, color: '#34495e'},
        {x: 22, z: -22, w: 28, d: 28, y: -4, color: '#34495e'},
        {x: -22, z: 22, w: 28, d: 28, y: -4, color: '#34495e'},
        {x: 22, z: 22, w: 28, d: 28, y: -4, color: '#34495e'},
        {x: -36, z: 0, w: 24, d: 80, y: 0, color: '#4a607a'},
        {x: 36, z: 0, w: 24, d: 80, y: 0, color: '#4a607a'},
        {x: 0, z: -36, w: 50, d: 24, y: 0, color: '#4a607a'}
    ];

    terracePositions.forEach((item) => {
        const slabHeight = item.y - (-8);
        const geom = new RedGPU.Primitive.Box(redGPUContext, item.w, slabHeight, item.d);
        const mat = new RedGPU.Material.PhongMaterial(redGPUContext, item.color);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geom, mat);
        mesh.setPosition(item.x, -8 + slabHeight * 0.5, item.z);
        scene.addChild(mesh);
    });

    // [KO] 2. 2m 간격 눈금 마디가 있는 고도 측정 타워 (Y = -8부터 최고 Y = +22까지 수직 배치)
    // [EN] 2. Graduated altitude towers with 2m segments (extending vertically from Y = -8 up to Y = +22)
    const towerSpecs = [
        {x: 0, z: 0, topY: 22, radius: 1.4},
        {x: -10, z: -8, topY: 16, radius: 1.0},
        {x: 11, z: -7, topY: 18, radius: 1.0},
        {x: -11, z: 10, topY: 12, radius: 1.0},
        {x: 12, z: 11, topY: 20, radius: 1.0},
        {x: -20, z: -18, topY: 18, radius: 1.1},
        {x: 20, z: -18, topY: 14, radius: 1.1},
        {x: 0, z: -24, topY: 20, radius: 1.2}
    ];

    const segmentHeight = 2;
    const bandGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 1.08, 1.08, 0.18, 16);
    const bandZeroMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#00e5ff');
    bandZeroMat.emissiveColor.setColorByHEX('#00e5ff');
    bandZeroMat.emissiveStrength = 1.8;

    const bandStepMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#ffd166');
    bandStepMat.emissiveColor.setColorByHEX('#ffaa00');
    bandStepMat.emissiveStrength = 1.2;

    towerSpecs.forEach((tower) => {
        const segGeom = new RedGPU.Primitive.Cylinder(redGPUContext, tower.radius, tower.radius, segmentHeight - 0.08, 16);
        for (let y = -8; y < tower.topY; y += segmentHeight) {
            const isAboveZero = y >= 0;
            const isEvenStep = ((y + 8) / segmentHeight) % 2 === 0;
            const segColor = isAboveZero
                ? (isEvenStep ? '#d8e2dc' : '#9db4c0')
                : (isEvenStep ? '#5c6b73' : '#3d474d');

            const segMat = new RedGPU.Material.PhongMaterial(redGPUContext, segColor);
            const segMesh = new RedGPU.Display.Mesh(redGPUContext, segGeom, segMat);
            segMesh.setPosition(tower.x, y + segmentHeight * 0.5, tower.z);
            scene.addChild(segMesh);

            const levelY = y + segmentHeight;
            if (levelY === 0 || levelY % 4 === 0) {
                const ringMesh = new RedGPU.Display.Mesh(
                    redGPUContext,
                    bandGeom,
                    levelY === 0 ? bandZeroMat : bandStepMat
                );
                ringMesh.setScale(tower.radius, 1, tower.radius);
                ringMesh.setPosition(tower.x, levelY, tower.z);
                scene.addChild(ringMesh);
            }
        }

        const beaconGeom = new RedGPU.Primitive.Sphere(redGPUContext, tower.radius * 0.55, 16, 16);
        const beaconMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff6b6b');
        beaconMat.emissiveColor.setColorByHEX('#ff4d4d');
        beaconMat.emissiveStrength = 2.5;
        const beaconMesh = new RedGPU.Display.Mesh(redGPUContext, beaconGeom, beaconMat);
        beaconMesh.setPosition(tower.x, tower.topY + tower.radius * 0.6, tower.z);
        scene.addChild(beaconMesh);
    });

    // [KO] 3. 고도별 안개 농도 변화를 연속적으로 보여주는 나선형 고도 마커 구체 (Y = -6 ~ +18, 2m 간격)
    // [EN] 3. Spiral altitude marker spheres showing continuous fog density gradient (Y = -6 to +18, 2m steps)
    const markerSphereGeom = new RedGPU.Primitive.Sphere(redGPUContext, 0.85, 20, 20);
    const palette = [
        '#00b4d8', '#0096c7', '#48cae4', '#90e0ef',
        '#06d6a0', '#8ac926', '#ffca3a', '#ff924c',
        '#ff595e', '#f15bb5', '#9b5de5', '#c77dff', '#ffffff'
    ];

    for (let i = 0; i < 13; i++) {
        const y = -6 + i * 2;
        const angle = i * 0.48;
        const radius = 6.5;
        const mat = new RedGPU.Material.PhongMaterial(redGPUContext, palette[i]);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, markerSphereGeom, mat);
        mesh.setPosition(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        scene.addChild(mesh);
    }
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
                presetFolder.disabled = !ev.value;
            });
            heightFogFolder.addBinding(autoRotateState, 'autoRotate');

            const controls = [
                heightFogFolder.addBinding(heightFog, 'fogType', {
                    options: {
                        EXPONENTIAL: RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL,
                        EXPONENTIAL_SQUARED: RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL_SQUARED
                    }
                }),
                heightFogFolder.addBinding(heightFog, 'density', {min: 0, max: 0.15, step: 0.001}),
                heightFogFolder.addBinding(heightFog, 'baseHeight', {min: -8, max: 12, step: 0.5}),
                heightFogFolder.addBinding(heightFog, 'height', {min: 0.5, max: 30, step: 0.5}),
                heightFogFolder.addBinding(heightFog, 'nearDistance', {
                    min: 0,
                    max: 40,
                    step: 0.5
                }).on('change', (ev) => {
                    if (heightFog.farDistance <= ev.value) {
                        heightFog.farDistance = ev.value + 1;
                        pane.refresh();
                    }
                }),
                heightFogFolder.addBinding(heightFog, 'farDistance', {
                    min: 1,
                    max: 120,
                    step: 1
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

            const presetFolder = heightFogFolder.addFolder({title: 'Presets', expanded: true});
            const applyPreset = (density, baseHeight, height, nearDistance, farDistance, maxOpacity, fogColor, fogType) => {
                heightFog.density = density;
                heightFog.baseHeight = baseHeight;
                heightFog.height = height;
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

            presetFolder.addButton({title: 'Grid Base (Y: 0 ~ 12)'}).on('click', () => {
                applyPreset(0.035, 0, 12, 0, 65, 1, {
                    r: 200,
                    g: 210,
                    b: 255
                }, RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL);
            });
            presetFolder.addButton({title: 'Deep Basin Mist (Y: -8 ~ 0)'}).on('click', () => {
                applyPreset(0.05, -8, 8, 0, 70, 0.95, {
                    r: 160,
                    g: 220,
                    b: 235
                }, RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL);
            });
            presetFolder.addButton({title: 'Golden Dawn (Y: -4 ~ 14)'}).on('click', () => {
                applyPreset(0.04, -4, 18, 0, 65, 1, {
                    r: 255,
                    g: 225,
                    b: 185
                }, RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL);
            });
            presetFolder.addButton({title: 'High Cloud Sea (Y: 6 ~ 20)'}).on('click', () => {
                applyPreset(0.06, 6, 14, 0, 80, 0.95, {
                    r: 215,
                    g: 225,
                    b: 250
                }, RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL_SQUARED);
            });
        }
    });
};
