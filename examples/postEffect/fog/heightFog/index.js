import * as RedGPU from "../../../../dist/index.js?t=1769499639386";

const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

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

        const heightFog = new RedGPU.PostEffect.HeightFog(redGPUContext);
        heightFog.fogType = RedGPU.PostEffect.HeightFog.EXPONENTIAL;
        heightFog.density = 1.8;
        heightFog.fogColor.setColorByRGB(255, 245, 220);
        heightFog.baseHeight = -2;
        heightFog.thickness = 6;
        heightFog.falloff = 1;
        view.postEffectManager.addEffect(heightFog);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.intensity = 0.8;
        scene.lightManager.addDirectionalLight(directionalLight);

        createGroundLevelScene(redGPUContext, scene);

        let autoRotate = true;
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            scene.children.forEach((child, index) => {
                if (child.userData) {
                    if (child.userData.isFloating) {
                        const floatSpeed = 0.001 + (index % 3) * 0.0003;
                        const floatAmount = 0.2 + (index % 2) * 0.15;
                        child.y = child.userData.baseY + Math.sin(time * floatSpeed + index) * floatAmount;
                    }

                    if (child.userData.isRotating) {
                        const rotSpeed = 0.002 + (index % 3) * 0.001;
                        child.rotationY += rotSpeed;
                    }

                    if (child.userData.isLantern) {
                        const flickerSpeed = 0.003 + (index % 4) * 0.001;
                        const brightness = 0.7 + Math.sin(time * flickerSpeed + index * 2) * 0.3;
                        child.material.emissive = brightness;
                    }
                }
            });

            if (autoRotate) {
                controller.pan += 0.2;
            }
        };

        renderer.start(redGPUContext, render);

        createHeightFogControlPanel(redGPUContext, view, heightFog, controller, () => {
            autoRotate = !autoRotate;
        });
    },
    (failReason) => {
        console.error('HeightFog 초기화 실패:', failReason);
    }
);

function createGroundLevelScene(redGPUContext, scene) {
    const terrain = new RedGPU.Primitive.Ground(redGPUContext, 200, 200, 1000, 1000);
    const terrainMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#2d4a2d');

    const terrainNoise = new RedGPU.Resource.SimplexTexture(redGPUContext, 1024, 1024, {
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
        {x: -20, z: 25, height: 10, radius: 0.55, density: 'sparse'},
    ];

    forestPositions.forEach((pos, index) => {
        const treeHeight = pos.height + Math.random() * 2;
        const tree = new RedGPU.Primitive.Cylinder(redGPUContext, pos.radius, treeHeight, 8);

        const treeColors = {
            dense: '#1a3d1a',
            medium: '#2d5a2d',
            sparse: '#4a7c4a'
        };

        const treeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, treeColors[pos.density]);
        const treeMesh = new RedGPU.Display.Mesh(redGPUContext, tree, treeMaterial);

        treeMesh.x = pos.x + (Math.random() - 0.5) * 4;
        treeMesh.z = pos.z + (Math.random() - 0.5) * 4;
        treeMesh.y = treeHeight / 2 - 2;

        treeMesh.userData = {
            isRotating: pos.density === 'sparse',
            heightLayer: pos.density
        };

        scene.addChild(treeMesh);

        const crownSize = pos.radius * (1.5 + Math.random() * 0.5);
        const crown = new RedGPU.Primitive.Sphere(redGPUContext, crownSize, 12, 12);
        const crownMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#2d6b2d');
        const crownMesh = new RedGPU.Display.Mesh(redGPUContext, crown, crownMaterial);

        crownMesh.x = treeMesh.x;
        crownMesh.z = treeMesh.z;
        crownMesh.y = treeMesh.y + treeHeight / 2 + crownSize * 0.7;
        scene.addChild(crownMesh);
    });

    const monuments = [
        {x: 0, z: 0, y: 1, height: 8, type: 'obelisk', name: 'Central Obelisk'},
        {x: -12, z: -8, y: 4, height: 5, type: 'pillar', name: 'Ancient Pillar'},
        {x: 18, z: -5, y: 7, height: 6, type: 'statue', name: 'Guardian Statue'},
        {x: -8, z: 15, y: 10, height: 4, type: 'altar', name: 'Sky Altar'},
    ];

    monuments.forEach((monument, index) => {
        let monumentGeom, monumentColor;

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
        monumentMaterial.roughness = 0.7;
        monumentMaterial.metalness = 0.1;

        const monumentMesh = new RedGPU.Display.Mesh(redGPUContext, monumentGeom, monumentMaterial);
        monumentMesh.x = monument.x;
        monumentMesh.z = monument.z;
        monumentMesh.y = monument.y;

        monumentMesh.userData = {
            monumentName: monument.name,
            heightLevel: monument.y,
            isRotating: monument.type === 'obelisk'
        };

        scene.addChild(monumentMesh);
    });

    const lanternPositions = [
        {x: -5, z: -10, y: 0.5},
        {x: 8, z: -12, y: 2.5},
        {x: -15, z: 8, y: 5.5},
        {x: 12, z: 15, y: 8.5},
    ];

    lanternPositions.forEach((pos, index) => {
        const lanternPole = new RedGPU.Primitive.Cylinder(redGPUContext, 0.15, 3, 8);
        const poleMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#654321');
        const poleMesh = new RedGPU.Display.Mesh(redGPUContext, lanternPole, poleMaterial);
        poleMesh.x = pos.x;
        poleMesh.z = pos.z;
        poleMesh.y = pos.y + 1.5;
        scene.addChild(poleMesh);

        const lantern = new RedGPU.Primitive.Sphere(redGPUContext, 0.4, 12, 12);
        const lanternMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#FFD700');
        lanternMaterial.emissive = 0.8;

        const lanternMesh = new RedGPU.Display.Mesh(redGPUContext, lantern, lanternMaterial);
        lanternMesh.x = pos.x;
        lanternMesh.z = pos.z;
        lanternMesh.y = pos.y + 3.2;

        lanternMesh.userData = {
            isLantern: true,
            heightLevel: pos.y
        };

        scene.addChild(lanternMesh);
    });

    const bridge = new RedGPU.Primitive.Box(redGPUContext, 20, 0.5, 2.5);
    const bridgeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#8B4513');
    const bridgeMesh = new RedGPU.Display.Mesh(redGPUContext, bridge, bridgeMaterial);
    bridgeMesh.x = 5;
    bridgeMesh.z = 2;
    bridgeMesh.y = 3.5;
    scene.addChild(bridgeMesh);

    for (let i = -2; i <= 2; i++) {
        const pillar = new RedGPU.Primitive.Cylinder(redGPUContext, 0.4, 6, 8);
        const pillarMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#654321');
        const pillarMesh = new RedGPU.Display.Mesh(redGPUContext, pillar, pillarMaterial);
        pillarMesh.x = 5 + i * 5;
        pillarMesh.z = 2;
        pillarMesh.y = 0.5;
        scene.addChild(pillarMesh);
    }

    const testHeights = [0, 2, 4, 6, 8, 10];
    testHeights.forEach((height, index) => {
        const testSphere = new RedGPU.Primitive.Sphere(redGPUContext, 0.8, 16, 16);
        const intensity = Math.min(255, 100 + height * 20);
        const testMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        testMaterial.r = intensity;
        testMaterial.g = intensity + 20;
        testMaterial.b = intensity + 40;

        const testMesh = new RedGPU.Display.Mesh(redGPUContext, testSphere, testMaterial);
        testMesh.x = -25 + index * 3;
        testMesh.z = 30;
        testMesh.y = height;

        testMesh.userData = {
            isFloating: true,
            baseY: height,
            testHeight: height
        };

        scene.addChild(testMesh);
    });
}

async function createHeightFogControlPanel(redGPUContext, view, heightFog, controller, toggleAutoRotate) {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769499639386');

    const pane = new Pane({title: 'Height Fog Demo', expanded: true});
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769499639386");
    setDebugButtons(RedGPU, redGPUContext);
    const PARAMS = {
        enabled: true,
        autoRotate: true,
        fogType: 'EXPONENTIAL',
        density: heightFog.density,
        baseHeight: heightFog.baseHeight,
        thickness: heightFog.thickness,
        falloff: heightFog.falloff,
        fogColor: {r: 190, g: 210, b: 235},
        cameraPreset: 'Ground Explorer'
    };

    const experienceFolder = pane.addFolder({title: 'Experience', expanded: true});

    experienceFolder.addBinding(PARAMS, 'enabled').on('change', (ev) => {
        if (ev.value) {
            view.postEffectManager.addEffect(heightFog);
        } else {
            view.postEffectManager.removeAllEffect();
        }
    });

    experienceFolder.addBinding(PARAMS, 'autoRotate').on('change', toggleAutoRotate);

    const fogFolder = pane.addFolder({title: 'Fog Settings', expanded: true});

    fogFolder.addBinding(PARAMS, 'fogType', {
        options: {
            'EXPONENTIAL': 'EXPONENTIAL',
            'EXPONENTIAL_SQUARED': 'EXPONENTIAL_SQUARED'
        }
    }).on('change', (ev) => {
        heightFog.fogType = ev.value === 'EXPONENTIAL' ?
            RedGPU.PostEffect.HeightFog.EXPONENTIAL :
            RedGPU.PostEffect.HeightFog.EXPONENTIAL_SQUARED;
    });

    fogFolder.addBinding(PARAMS, 'density', {
        min: 0, max: 4, step: 0.1
    }).on('change', (ev) => {
        heightFog.density = ev.value;
    });

    fogFolder.addBinding(PARAMS, 'baseHeight', {
        label: 'Base Height',
        min: -5, max: 8, step: 0.1
    }).on('change', (ev) => {
        heightFog.baseHeight = ev.value;
    });

    fogFolder.addBinding(PARAMS, 'thickness', {
        min: 2, max: 20, step: 0.5
    }).on('change', (ev) => {
        heightFog.thickness = ev.value;
    });

    fogFolder.addBinding(PARAMS, 'falloff', {
        min: 0.1, max: 2, step: 0.1
    }).on('change', (ev) => {
        heightFog.falloff = ev.value;
    });

    fogFolder.addBinding(PARAMS, 'fogColor').on('change', (ev) => {
        heightFog.fogColor.setColorByRGB(
            Math.round(ev.value.r),
            Math.round(ev.value.g),
            Math.round(ev.value.b)
        );
    });

    const scenarioFolder = pane.addFolder({title: 'Scenarios', expanded: true});

    scenarioFolder.addButton({title: 'Dawn Valley'}).on('click', () => {
        applyPreset(1.8, -2, 6, 1.0, {r: 255, g: 245, b: 220}, 'EXPONENTIAL');
    });

    scenarioFolder.addButton({title: 'Mysterious Forest'}).on('click', () => {
        applyPreset(2.5, -1, 8, 1.4, {r: 180, g: 200, b: 180}, 'EXPONENTIAL');
    });

    scenarioFolder.addButton({title: 'Ancient Ruins'}).on('click', () => {
        applyPreset(2.0, 0, 7, 1.2, {r: 200, g: 190, b: 160}, 'EXPONENTIAL');
    });

    scenarioFolder.addButton({title: 'Moonlit Mist'}).on('click', () => {
        applyPreset(1.5, -1.5, 9, 0.8, {r: 160, g: 170, b: 200}, 'LINEAR');
    });

    function applyPreset(density, baseHeight, thickness, falloff, fogColor, fogType) {
        PARAMS.density = density;
        PARAMS.baseHeight = baseHeight;
        PARAMS.thickness = thickness;
        PARAMS.falloff = falloff;
        PARAMS.fogColor = fogColor;
        PARAMS.fogType = fogType;

        heightFog.density = density;
        heightFog.baseHeight = baseHeight;
        heightFog.thickness = thickness;
        heightFog.falloff = falloff;
        heightFog.fogType = fogType === 'EXPONENTIAL' ?
            RedGPU.PostEffect.HeightFog.EXPONENTIAL :
            RedGPU.PostEffect.HeightFog.EXPONENTIAL_SQUARED;
        heightFog.fogColor.setColorByRGB(fogColor.r, fogColor.g, fogColor.b);

        pane.refresh();
    }
}
