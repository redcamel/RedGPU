import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] InstancedMesh Multi-Material GPU LOD 예제
 * [EN] InstancedMesh Multi-Material GPU LOD example
 *
 * [KO] 인스턴싱 메시에서 거리별로 지오메트리와 머티리얼을 동시에 변경하는 GPU 기반 LOD 기능을 시연합니다.
 * [EN] Demonstrates GPU-based LOD functionality that simultaneously changes geometry and materials by distance in instanced meshes.
 */

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
        view.grid = true;
        redGPUContext.addView(view);

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        createInstancedMaterialLODTest(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createInstancedMaterialLODTest = (redGPUContext, scene) => {
    const maxInstanceCount = 20000;
    const instanceCount = redGPUContext.detector.isMobile ? 5000 : 20000;
    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf';

    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const baseMesh = result.resultMesh.children[0];
        const materialLOD0 = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const materialLOD1 = new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00');
        const materialLOD2 = new RedGPU.Material.PhongMaterial(redGPUContext, '#0000ff');

        // [KO] GLTF 지오메트리 기반 InstancingMesh 생성 및 거리별 지오메트리·머티리얼 LOD(500, 750, 1000) 등록
        // [EN] Create GLTF-based InstancingMesh and register distance-based geometry and material LOD levels (500, 750, 1000)
        const instancingMesh = new RedGPU.Display.InstancingMesh(
            redGPUContext,
            maxInstanceCount,
            instanceCount,
            baseMesh.geometry,
            baseMesh.material
        );
        instancingMesh.LODManager.addLOD(500, baseMesh.geometry, materialLOD0);
        instancingMesh.LODManager.addLOD(750, new RedGPU.Primitive.Box(redGPUContext), materialLOD1);
        instancingMesh.LODManager.addLOD(1000, new RedGPU.Primitive.Ground(redGPUContext), materialLOD2);
        scene.addChild(instancingMesh);

        const initializeInstances = () => {
            const radius = 1000;
            for (let i = 0; i < instancingMesh.instanceCount; i++) {
                const child = instancingMesh.instanceChildren[i];
                if (child.x === 0) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.sqrt(Math.random()) * radius;
                    child.setPosition(
                        Math.cos(angle) * distance,
                        0,
                        Math.sin(angle) * distance
                    );
                    child.setScale(Math.random() * 8 + 1);
                }
            }
        };

        initializeInstances();

        renderTestPane(redGPUContext, instancingMesh, {
            baseMesh,
            materialLOD0,
            materialLOD1,
            materialLOD2,
            initializeInstances
        });
    });
};

const renderTestPane = (redGPUContext, instancingMesh, config) => {
    const {baseMesh, materialLOD0, materialLOD1, materialLOD2, initializeInstances} = config;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lodFolder = pane.addFolder({title: 'LODManager (Base: GLTF Suzanne)', expanded: true});
            const lodState = {
                lod500_RedSuzanne: true,
                lod750_GreenBox: true,
                lod1000_BlueGround: true,
                get lodCount() {
                    return instancingMesh.LODManager.LODList.length;
                },
                get distances() {
                    return instancingMesh.LODManager.LODList.map((lod) => lod.distance).join(', ');
                }
            };

            const setupLODToggle = (key, distance, geometryFactory, material) => {
                lodFolder.addBinding(lodState, key).on('change', (ev) => {
                    if (ev.value) {
                        instancingMesh.LODManager.addLOD(distance, geometryFactory(), material);
                    } else {
                        instancingMesh.LODManager.removeLOD(distance);
                    }
                    pane.refresh();
                });
            };

            setupLODToggle('lod500_RedSuzanne', 500, () => baseMesh.geometry, materialLOD0);
            setupLODToggle('lod750_GreenBox', 750, () => new RedGPU.Primitive.Box(redGPUContext), materialLOD1);
            setupLODToggle('lod1000_BlueGround', 1000, () => new RedGPU.Primitive.Ground(redGPUContext), materialLOD2);
            lodFolder.addBinding(lodState, 'lodCount', {readonly: true});
            lodFolder.addBinding(lodState, 'distances', {readonly: true});

            const instancingFolder = pane.addFolder({title: 'InstancingMesh', expanded: true});
            instancingFolder.addBinding(instancingMesh, 'instanceCount', {
                min: 100,
                max: instancingMesh.maxInstanceCount,
                step: 1
            }).on('change', initializeInstances);
            instancingFolder.addBinding(instancingMesh, 'maxInstanceCount', {
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`
            });
            instancingFolder.addBinding({getLimitSize: RedGPU.Display.InstancingMesh.getLimitSize(redGPUContext)}, 'getLimitSize', {
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`
            });
        }
    });
};
