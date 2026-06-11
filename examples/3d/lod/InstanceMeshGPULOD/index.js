import * as RedGPU from "../../../../dist/index.js?t=1781144235516";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781144235516";

/**
 * [KO] InstancedMesh GPU LOD 예제
 * [EN] InstancedMesh GPU LOD example
 *
 * [KO] GPU 기반의 LOD(Level of Detail) 기능을 InstancedMesh에 적용하여 거리별 최적화 성능을 시연합니다.
 * [EN] Demonstrates GPU-based LOD (Level of Detail) on InstancedMesh for distance-based optimization performance.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;

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

        // 4. 머티리얼 설정
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = texture;

        // 5. 인스턴싱 LOD 테스트 생성
        const {instancingMesh, initializeInstances} = createInstancedLODTest(redGPUContext, scene, material);

        // 6. 렌더링 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 7. 테스트 GUI 설정
        renderTestPane(redGPUContext, instancingMesh, initializeInstances);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 인스턴싱 LOD 테스트를 위한 메시를 생성합니다.
 * [EN] Creates meshes for instancing LOD test.
 */
const createInstancedLODTest = (redGPUContext, scene, material) => {
    const maxInstanceCount = redGPUContext.detector.isMobile ? 100000 : Math.min(RedGPU.Display.InstancingMesh.getLimitSize(redGPUContext), 1000000);
    const instanceCount = redGPUContext.detector.isMobile ? 20000 : 200000;

    // 기본 메시 (LOD 0) 설정 - 고해상도 구체
    const instancingMesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxInstanceCount,
        instanceCount,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 32, 32, 32),
        material
    );
    scene.addChild(instancingMesh);

    // 추가 LOD 단계 설정
    instancingMesh.LODManager.addLOD(25, new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 8, 8, 8)); // 중해상도
    instancingMesh.LODManager.addLOD(50, new RedGPU.Primitive.Box(redGPUContext)); // 저해상도 (박스)
    instancingMesh.LODManager.addLOD(70, new RedGPU.Primitive.Circle(redGPUContext, 0.5)); // 최저해상도 (원형)

    const initializeInstances = () => {
        for (let i = 0; i < instancingMesh.instanceCount; i++) {
            const child = instancingMesh.instanceChildren[i];
            if (child.x === 0) {
                child.setPosition(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                );
                child.setScale(Math.random() * 2 + 1);
                child.setRotation(
                    Math.random() * 360,
                    Math.random() * 360,
                    Math.random() * 360
                );
            }
        }
    };

    initializeInstances();

    return {instancingMesh, initializeInstances};
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext, instancingMesh, initializeInstances) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lodFolder = pane.addFolder({title: 'GPU LOD Settings', expanded: true});

            // LOD 정보 상태 관리 객체
            const lodState = {
                lod25: true,
                lod50: true,
                lod70: true,
                get lodCount() { return instancingMesh.LODManager.LODList.length; },
                get lodDistances() {
                    return instancingMesh.LODManager.LODList
                        .map(lod => lod.distance)
                        .sort((a, b) => a - b)
                        .join(', ');
                }
            };

            const baseInfo = {baseMesh: "Sphere (32x32)"};
            lodFolder.addBinding(baseInfo, "baseMesh", {label: "Base Mesh (LOD 0)", readonly: true});

            // LOD 레이어 토글 바인딩
            const setupLODToggle = (distance, label, geometryFactory) => {
                lodFolder.addBinding(lodState, `lod${distance}`, {label})
                    .on('change', (ev) => {
                        if (ev.value) {
                            instancingMesh.LODManager.addLOD(distance, geometryFactory());
                        } else {
                            instancingMesh.LODManager.removeLOD(distance);
                        }
                        pane.refresh();
                    });
            };

            setupLODToggle(25, 'LOD 25 (Sphere 8x8)', () => new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 8, 8, 8));
            setupLODToggle(50, 'LOD 50 (Box)', () => new RedGPU.Primitive.Box(redGPUContext));
            setupLODToggle(70, 'LOD 70 (Circle)', () => new RedGPU.Primitive.Circle(redGPUContext, 0.5));

            lodFolder.addBinding(lodState, 'lodCount', {label: 'Active LOD Steps', readonly: true});
            lodFolder.addBinding(lodState, 'lodDistances', {label: 'Distances', readonly: true});

            const instancingFolder = pane.addFolder({title: 'Instancing Options', expanded: true});
            instancingFolder.addBinding(instancingMesh, 'instanceCount', {
                min: 0,
                max: instancingMesh.maxInstanceCount,
                step: 1,
                label: 'Instance Count'
            }).on('change', initializeInstances);

            instancingFolder.addBinding(instancingMesh, 'maxInstanceCount', {
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
