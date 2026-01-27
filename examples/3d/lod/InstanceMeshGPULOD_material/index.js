import * as RedGPU from "../../../../dist/index.js?t=1769498378009";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;
        controller.maxTilt = 0;
        controller.distance = 300;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const light = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(light);

        const ibl = new RedGPU.Resource.IBL(view.redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
        view.ibl = ibl;
        view.skybox = newSkybox;
        view.grid = true;

        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = texture;

        createTest(redGPUContext, scene, material);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
            if (scene.children[0]) {
                // scene.children[0].rotationY += 0.001;
            }
        });
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        errorMessage.style.cssText = 'color: red; padding: 20px; ';
        document.body.appendChild(errorMessage);
    }
);

async function createTest(redGPUContext, scene, material) {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769498378009');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769498378009");

    const maxInstanceCount = 20000;
    const instanceCount = redGPUContext.detector.isMobile ? 5000 : 20000;

    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf';

    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const mesh = result.resultMesh.children[0];

        const materialLOD0 = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const materialLOD1 = new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00');
        const materialLOD2 = new RedGPU.Material.PhongMaterial(redGPUContext, '#0000ff');

        const baseMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);

        const instancingMesh = new RedGPU.Display.InstancingMesh(
            redGPUContext,
            maxInstanceCount,
            instanceCount,
            mesh.geometry,
            mesh.material
        );
        scene.addChild(instancingMesh);

        const initializeInstances = () => {
            const radius = 1000;

            for (let i = 0; i < instancingMesh.instanceCount; i++) {
                if (instancingMesh.instanceChildren[i].x === 0) {
                    const angle = Math.random() * Math.PI * 2;
                    const randomValue = Math.random();
                    const distance = Math.sqrt(randomValue) * radius;

                    const x = Math.cos(angle) * distance;
                    const z = Math.sin(angle) * distance;

                    instancingMesh.instanceChildren[i].setPosition(x, 0, z);
                    instancingMesh.instanceChildren[i].setScale(Math.random() * 8 + 1);
                }
            }
        };
        initializeInstances();
        setDebugButtons(RedGPU, redGPUContext);
        const pane = new Pane();

        pane.addBinding({baseMesh: "Base Mesh"}, "baseMesh", {
            label: "Base Mesh",
            readonly: true,
        });

        const hasLOD = (distance) => {
            return instancingMesh.LODManager.LODList.some(lod => lod.distance === distance);
        };

        const addLODIfNeeded = (distance, createGeometry, mat) => {
            if (!hasLOD(distance)) {
                instancingMesh.LODManager.addLOD(distance, createGeometry(), mat);
            }
        };

        const removeLODIfExists = (distance) => {
            if (hasLOD(distance)) {
                instancingMesh.LODManager.removeLOD(distance);
            }
        };

        const distanceLOD0 = 500;
        const distanceLOD1 = 750;
        const distanceLOD2 = 1000;

        const lodState = {
            [`lod${distanceLOD0}`]: true,
            [`lod${distanceLOD1}`]: true,
            [`lod${distanceLOD2}`]: true,
            lodCount: 0,
            lodDistances: '',
        };

        const updateLODInfo = () => {
            const list = instancingMesh.LODManager.LODList;
            lodState.lodCount = list.length;
            lodState.lodDistances = list
                .map(lod => lod.distance)
                .sort((a, b) => a - b)
                .join(', ');
        };

        addLODIfNeeded(distanceLOD0, () => mesh.geometry, materialLOD0);
        addLODIfNeeded(distanceLOD1, () => new RedGPU.Primitive.Box(redGPUContext), materialLOD1);
        addLODIfNeeded(distanceLOD2, () => new RedGPU.Primitive.Ground(redGPUContext), materialLOD2);
        updateLODInfo();

        const lodConfigs = [
            {dist: distanceLOD0, label: `LOD ${distanceLOD0}`, createGeo: () => mesh.geometry, mat: materialLOD0},
            {
                dist: distanceLOD1,
                label: `LOD ${distanceLOD1}`,
                createGeo: () => new RedGPU.Primitive.Box(redGPUContext),
                mat: materialLOD1
            },
            {
                dist: distanceLOD2,
                label: `LOD ${distanceLOD2}`,
                createGeo: () => new RedGPU.Primitive.Ground(redGPUContext),
                mat: materialLOD2
            }
        ];

        lodConfigs.forEach(config => {
            pane.addBinding(lodState, `lod${config.dist}`, {label: config.label})
                .on('change', (ev) => {
                    if (ev.value) {
                        addLODIfNeeded(config.dist, config.createGeo, config.mat);
                    } else {
                        removeLODIfExists(config.dist);
                    }
                    updateLODInfo();
                });
        });

        pane.addBinding(lodState, 'lodCount', {
            label: 'LOD Count',
            readonly: true,
            format: (v) => `${Math.floor(v).toLocaleString()}`
        });

        pane.addBinding(lodState, 'lodDistances', {
            label: 'LOD Distances',
            readonly: true,
        });

        pane.addBinding(instancingMesh, 'instanceCount', {
            min: 100,
            max: maxInstanceCount,
            step: 1
        }).on('change', initializeInstances);

        pane.addBinding({maxInstanceCount}, 'maxInstanceCount', {
            readonly: true,
            format: (v) => `${Math.floor(v).toLocaleString()}`
        });
    });
}
