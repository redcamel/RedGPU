import * as RedGPU from "../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778922031603";

/**
 * [KO] Mesh CPU 멀티 머티리얼 LOD 예제
 * [EN] Mesh CPU Multi-Material LOD example
 *
 * [KO] 다수의 개별 Mesh 객체에 대해 거리별로 지오메트리와 머티리얼을 동시에 변경하는 CPU 기반 LOD 기능을 시연합니다.
 * [EN] Demonstrates CPU-based LOD functionality that simultaneously changes geometry and materials by distance for multiple individual Mesh objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 2. 조명 설정
        const light = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(light);

        // 3. IBL 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;

        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        view.grid = true;

        // 4. 메시 CPU LOD 테스트 생성
        createMeshCPUMaterialLODTest(redGPUContext, scene);

        // 5. 렌더링 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 머티리얼 변경을 포함한 다수의 Mesh 객체와 LOD 단계를 생성합니다.
 * [EN] Creates multiple Mesh objects and LOD steps including material switching.
 */
const createMeshCPUMaterialLODTest = (redGPUContext, scene) => {
    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf';

    // GLTF 모델 로드 후 메시 생성 및 LOD 설정
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const baseMeshNode = result.resultMesh.children[0];
        const maxNum = redGPUContext.detector.isMobile ? 1000 : 10000;

        // 각 LOD 단계별 머티리얼 생성
        const materialLOD0 = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const materialLOD1 = new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00');
        const materialLOD2 = new RedGPU.Material.PhongMaterial(redGPUContext, '#0000ff');

        for (let i = 0; i < maxNum; i++) {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, baseMeshNode.geometry, baseMeshNode.material);
            mesh.setPosition(
                Math.random() * 140 - 70,
                Math.random() * 140 - 70,
                Math.random() * 140 - 70
            );

            // 초기 LOD 단계 설정
            mesh.LODManager.addLOD(25, baseMeshNode.geometry, materialLOD0); // Suzanne
            mesh.LODManager.addLOD(50, new RedGPU.Primitive.Sphere(redGPUContext), materialLOD1); // Sphere
            mesh.LODManager.addLOD(70, new RedGPU.Primitive.Box(redGPUContext), materialLOD2); // Box

            scene.addChild(mesh);
        }

        // 6. 테스트 GUI 설정
        renderTestPane(redGPUContext, scene, {
            baseMeshNode,
            materialLOD0,
            materialLOD1,
            materialLOD2
        });
    });
};

/**
 * [KO] 테스트용 GUI를 렌더링하고 메시별 멀티 머티리얼 LOD 설정을 제어합니다.
 * [EN] Renders the GUI for testing and controls multi-material LOD settings for each mesh.
 */
const renderTestPane = (redGPUContext, scene, config) => {
    const {baseMeshNode, materialLOD0, materialLOD1, materialLOD2} = config;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lodFolder = pane.addFolder({title: 'CPU Multi-Material LOD', expanded: true});

            const lodState = {
                lod25: true,
                lod50: true,
                lod70: true,
                get lodCount() { return scene.children[0]?.LODManager.LODList.length || 0; },
                get lodDistances() {
                    return (scene.children[0]?.LODManager.LODList || [])
                        .map(lod => lod.distance)
                        .sort((a, b) => a - b)
                        .join(', ');
                }
            };

            const baseInfo = {baseMesh: "Suzanne (GLTF)"};
            lodFolder.addBinding(baseInfo, "baseMesh", {label: "Base Mesh (LOD 0)", readonly: true});

            // 모든 메시의 LOD를 일괄 변경하는 헬퍼 함수
            const updateAllLODs = (distance, action, geometryFactory, material) => {
                scene.children.forEach(mesh => {
                    if (mesh instanceof RedGPU.Display.Mesh) {
                        if (action === 'add') {
                            const exists = mesh.LODManager.LODList.some(lod => lod.distance === distance);
                            if (!exists) mesh.LODManager.addLOD(distance, geometryFactory(), material);
                        } else {
                            mesh.LODManager.removeLOD(distance);
                        }
                    }
                });
            };

            // LOD 단계 토글 설정
            const setupLODToggle = (distance, label, geometryFactory, material) => {
                lodFolder.addBinding(lodState, `lod${distance}`, {label})
                    .on('change', (ev) => {
                        updateAllLODs(distance, ev.value ? 'add' : 'remove', geometryFactory, material);
                        pane.refresh();
                    });
            };

            setupLODToggle(25, 'LOD 25 (Red Suzanne)', () => baseMeshNode.geometry, materialLOD0);
            setupLODToggle(50, 'LOD 50 (Green Sphere)', () => new RedGPU.Primitive.Sphere(redGPUContext), materialLOD1);
            setupLODToggle(70, 'LOD 70 (Blue Box)', () => new RedGPU.Primitive.Box(redGPUContext), materialLOD2);

            lodFolder.addBinding(lodState, 'lodCount', {label: 'Active LOD Steps', readonly: true});
            lodFolder.addBinding(lodState, 'lodDistances', {label: 'Distances', readonly: true});

            const sceneFolder = pane.addFolder({title: 'Scene Info', expanded: true});
            sceneFolder.addBinding({meshCount: scene.numChildren}, 'meshCount', {
                label: 'Mesh Count',
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`
            });
        }
    });
};
