import * as RedGPU from "../../../../dist/index.js?t=1781141623471";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781141623471";

/**
 * [KO] InstancedMesh 멀티 머티리얼 GPU LOD 예제
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
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;
        controller.maxTilt = 0;
        controller.distance = 300;

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

        // 4. 머티리얼 LOD 테스트 생성
        createInstancedMaterialLODTest(redGPUContext, scene);

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
 * [KO] 머티리얼 변경을 포함한 인스턴싱 LOD 테스트를 생성합니다.
 * [EN] Creates instancing LOD test including material switching.
 */
const createInstancedMaterialLODTest = (redGPUContext, scene) => {
    const maxInstanceCount = 20000;
    const instanceCount = redGPUContext.detector.isMobile ? 5000 : 20000;
    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf';

    // GLTF 모델 로드 후 LOD 설정
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const baseMesh = result.resultMesh.children[0];

        // 각 LOD 단계별 머티리얼 생성
        const materialLOD0 = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const materialLOD1 = new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00');
        const materialLOD2 = new RedGPU.Material.PhongMaterial(redGPUContext, '#0000ff');

        const instancingMesh = new RedGPU.Display.InstancingMesh(
            redGPUContext,
            maxInstanceCount,
            instanceCount,
            baseMesh.geometry,
            baseMesh.material
        );
        scene.addChild(instancingMesh);

        /**
         * [KO] 인스턴스들의 초기 배치를 설정합니다.
         * [EN] Sets the initial layout of instances.
         */
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

        // 초기화 및 LOD 단계 추가
        instancingMesh.LODManager.addLOD(500, baseMesh.geometry, materialLOD0);
        instancingMesh.LODManager.addLOD(750, new RedGPU.Primitive.Box(redGPUContext), materialLOD1);
        instancingMesh.LODManager.addLOD(1000, new RedGPU.Primitive.Ground(redGPUContext), materialLOD2);

        initializeInstances();

        // 6. 테스트 GUI 설정
        renderTestPane(redGPUContext, instancingMesh, {
            baseMesh,
            materialLOD0,
            materialLOD1,
            materialLOD2,
            initializeInstances,
            maxInstanceCount
        });
    });
};

/**
 * [KO] 테스트용 GUI를 렌더링하고 멀티 머티리얼 LOD 설정을 제어합니다.
 * [EN] Renders the GUI for testing and controls multi-material LOD settings.
 */
const renderTestPane = (redGPUContext, instancingMesh, config) => {
    const {baseMesh, materialLOD0, materialLOD1, materialLOD2, initializeInstances, maxInstanceCount} = config;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lodFolder = pane.addFolder({title: 'Multi-Material LOD', expanded: true});

            const lodState = {
                lod500: true,
                lod750: true,
                lod1000: true,
                get lodCount() { return instancingMesh.LODManager.LODList.length; },
                get lodDistances() {
                    return instancingMesh.LODManager.LODList
                        .map(lod => lod.distance)
                        .sort((a, b) => a - b)
                        .join(', ');
                }
            };

            const baseInfo = {baseMesh: "Suzanne (GLTF)"};
            lodFolder.addBinding(baseInfo, "baseMesh", {label: "Base Mesh (LOD 0)", readonly: true});

            // LOD 단계 토글 설정
            const setupLODToggle = (distance, label, geometryFactory, material) => {
                lodFolder.addBinding(lodState, `lod${distance}`, {label})
                    .on('change', (ev) => {
                        if (ev.value) {
                            instancingMesh.LODManager.addLOD(distance, geometryFactory(), material);
                        } else {
                            instancingMesh.LODManager.removeLOD(distance);
                        }
                        pane.refresh();
                    });
            };

            setupLODToggle(500, 'LOD 500 (Red Suzanne)', () => baseMesh.geometry, materialLOD0);
            setupLODToggle(750, 'LOD 750 (Green Box)', () => new RedGPU.Primitive.Box(redGPUContext), materialLOD1);
            setupLODToggle(1000, 'LOD 1000 (Blue Ground)', () => new RedGPU.Primitive.Ground(redGPUContext), materialLOD2);

            lodFolder.addBinding(lodState, 'lodCount', {label: 'Active LOD Steps', readonly: true});
            lodFolder.addBinding(lodState, 'lodDistances', {label: 'Distances', readonly: true});

            const instancingFolder = pane.addFolder({title: 'Instancing Options', expanded: true});
            instancingFolder.addBinding(instancingMesh, 'instanceCount', {
                min: 100,
                max: maxInstanceCount,
                step: 1,
                label: 'Instance Count'
            }).on('change', initializeInstances);

            instancingFolder.addBinding({maxInstanceCount}, 'maxInstanceCount', {
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`,
                label: 'Max Instances'
            });

            instancingFolder.addBinding({limitSize: RedGPU.Display.InstancingMesh.getLimitSize(redGPUContext)}, 'limitSize', {
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`,
                label: 'Hardware Limit'
            });
        }
    });
};
