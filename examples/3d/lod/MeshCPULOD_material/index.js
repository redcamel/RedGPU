import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 3;

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

        createTest(redGPUContext, scene);

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
        document.body.appendChild(errorMessage);
    }
);

async function createTest(redGPUContext, scene) {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");

    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf';

    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const materialLOD0 = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const materialLOD1 = new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00');
        const materialLOD2 = new RedGPU.Material.PhongMaterial(redGPUContext, '#0000ff');

        const gltf = result.resultMesh.children[0];
        const maxNum = redGPUContext.detector.isMobile ? 1000 : 10000;

        for (let i = 0; i < maxNum; i++) {
            const mesh = new RedGPU.Display.Mesh(
                redGPUContext,
                gltf.geometry,
                gltf.material
            );
            mesh.setPosition(
                Math.random() * 140 - 70,
                Math.random() * 140 - 70,
                Math.random() * 140 - 70
            );
            scene.addChild(mesh);
        }
        setDebugButtons(RedGPU, redGPUContext);
        const pane = new Pane();

        const baseInfo = {baseMesh: "Base Mesh (Sphere 32x32)"};
        pane.addBinding(baseInfo, "baseMesh", {
            label: "Base Mesh",
            readonly: true,
        });

        const hasLOD = (distance) => {
            return scene.children[0].LODManager.LODList.some(lod => lod.distance === distance);
        };

        const addLODIfNeeded = (distance, createGeometry, material) => {
            if (!hasLOD(distance)) {
                scene.children.forEach(mesh =>
                    mesh.LODManager.addLOD(distance, createGeometry(), material)
                );
            }
        };

        const removeLODIfExists = (distance) => {
            if (hasLOD(distance)) {
                scene.children.forEach(mesh => mesh.LODManager.removeLOD(distance));
            }
        };

        const distanceLOD0 = 25;
        const distanceLOD1 = 50;
        const distanceLOD2 = 70;

        const lodState = {
            [`lod${distanceLOD0}`]: true,
            [`lod${distanceLOD1}`]: true,
            [`lod${distanceLOD2}`]: true,
            lodCount: 0,
            lodDistances: '',
        };

        const updateLODInfo = () => {
            const list = scene.children[0].LODManager.LODList;
            lodState.lodCount = list.length;
            lodState.lodDistances = list
                .map(lod => lod.distance)
                .sort((a, b) => a - b)
                .join(', ');
        };

        addLODIfNeeded(distanceLOD0, () => gltf.geometry, materialLOD0);
        addLODIfNeeded(distanceLOD1, () => new RedGPU.Primitive.Sphere(redGPUContext), materialLOD1);
        addLODIfNeeded(distanceLOD2, () => new RedGPU.Primitive.Box(redGPUContext), materialLOD2);
        updateLODInfo();

        [
            {dist: distanceLOD0, label: `LOD ${distanceLOD0}`, createGeo: () => gltf.geometry, mat: materialLOD0},
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
        ].forEach(config => {
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
    });
}
