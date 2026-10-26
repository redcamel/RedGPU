import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Mesh Multi-Material CPU LOD 예제
 * [EN] Mesh Multi-Material CPU LOD example
 *
 * [KO] 다수의 개별 Mesh 객체에 대해 거리별로 지오메트리와 머티리얼을 동시에 변경하는 CPU 기반 LOD 기능을 시연합니다.
 * [EN] Demonstrates CPU-based LOD functionality that simultaneously changes geometry and materials by distance for multiple individual Mesh objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 3;

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

        createMeshCPUMaterialLODTest(redGPUContext, scene);

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

const createMeshCPUMaterialLODTest = (redGPUContext, scene) => {
    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf';

    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const baseMeshNode = result.resultMesh.children[0];
        const maxNum = redGPUContext.detector.isMobile ? 1000 : 10000;

        const lod25Geometry = baseMeshNode.geometry;
        const lod50Geometry = new RedGPU.Primitive.Sphere(redGPUContext);
        const lod70Geometry = new RedGPU.Primitive.Box(redGPUContext);

        const materialLOD0 = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const materialLOD1 = new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00');
        const materialLOD2 = new RedGPU.Material.PhongMaterial(redGPUContext, '#0000ff');

        // [KO] 다수의 개별 Mesh 생성 및 거리별 지오메트리·머티리얼 CPU LOD(25, 50, 70) 등록
        // [EN] Create multiple individual Meshes and register distance-based geometry and material CPU LOD levels (25, 50, 70)
        for (let i = 0; i < maxNum; i++) {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, baseMeshNode.geometry, baseMeshNode.material);
            mesh.setPosition(
                Math.random() * 140 - 70,
                Math.random() * 140 - 70,
                Math.random() * 140 - 70
            );

            mesh.LODManager.addLOD(25, lod25Geometry, materialLOD0);
            mesh.LODManager.addLOD(50, lod50Geometry, materialLOD1);
            mesh.LODManager.addLOD(70, lod70Geometry, materialLOD2);
            scene.addChild(mesh);
        }

        renderTestPane(redGPUContext, scene, {
            lod25Geometry,
            lod50Geometry,
            lod70Geometry,
            materialLOD0,
            materialLOD1,
            materialLOD2
        });
    });
};

const renderTestPane = (redGPUContext, scene, config) => {
    const {lod25Geometry, lod50Geometry, lod70Geometry, materialLOD0, materialLOD1, materialLOD2} = config;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lodFolder = pane.addFolder({title: 'LODManager (Base: GLTF Suzanne)', expanded: true});
            const lodState = {
                lod25_RedSuzanne: true,
                lod50_GreenSphere: true,
                lod70_BlueBox: true,
                get lodCount() {
                    return scene.children[0]?.LODManager.LODList.length || 0;
                },
                get distances() {
                    return (scene.children[0]?.LODManager.LODList || []).map((lod) => lod.distance).join(', ');
                }
            };

            const updateAllLODs = (distance, enabled, geometry, material) => {
                scene.children.forEach((mesh) => {
                    if (mesh instanceof RedGPU.Display.Mesh) {
                        if (enabled) {
                            const exists = mesh.LODManager.LODList.some((lod) => lod.distance === distance);
                            if (!exists) mesh.LODManager.addLOD(distance, geometry, material);
                        } else {
                            mesh.LODManager.removeLOD(distance);
                        }
                    }
                });
            };

            const setupLODToggle = (key, distance, geometry, material) => {
                lodFolder.addBinding(lodState, key).on('change', (ev) => {
                    updateAllLODs(distance, ev.value, geometry, material);
                    pane.refresh();
                });
            };

            setupLODToggle('lod25_RedSuzanne', 25, lod25Geometry, materialLOD0);
            setupLODToggle('lod50_GreenSphere', 50, lod50Geometry, materialLOD1);
            setupLODToggle('lod70_BlueBox', 70, lod70Geometry, materialLOD2);
            lodFolder.addBinding(lodState, 'lodCount', {readonly: true});
            lodFolder.addBinding(lodState, 'distances', {readonly: true});
        }
    });
};
