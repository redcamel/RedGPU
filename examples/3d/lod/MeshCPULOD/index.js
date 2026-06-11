import * as RedGPU from "../../../../dist/index.js?t=1781137785306";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781137785306";

/**
 * [KO] Mesh CPU LOD 예제
 * [EN] Mesh CPU LOD example
 *
 * [KO] CPU 기반의 LOD(Level of Detail) 기능을 개별 Mesh 객체들에 적용하여 거리별 최적화 성능을 시연합니다.
 * [EN] Demonstrates CPU-based LOD (Level of Detail) on individual Mesh objects for distance-based optimization performance.
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

        // 4. 머티리얼 설정
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = texture;

        // 5. CPU LOD 테스트 생성
        createMeshCPULODTest(redGPUContext, scene, material);

        // 6. 렌더링 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 7. 테스트 GUI 설정
        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] CPU LOD 테스트를 위한 다수의 메시를 생성합니다.
 * [EN] Creates multiple meshes for CPU LOD test.
 */
const createMeshCPULODTest = (redGPUContext, scene, material) => {
    const maxNum = redGPUContext.detector.isMobile ? 1000 : 5000;
    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32, 32);

    for (let i = 0; i < maxNum; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.setPosition(
            Math.random() * 140 - 70,
            Math.random() * 140 - 70,
            Math.random() * 140 - 70
        );
        mesh.setRotation(
            Math.random() * 360,
            Math.random() * 360,
            Math.random() * 360
        );

        // 초기 LOD 단계 설정
        mesh.LODManager.addLOD(25, new RedGPU.Primitive.Sphere(redGPUContext, 1, 5, 5, 5)); // 중해상도
        mesh.LODManager.addLOD(50, new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2)); // 저해상도 (박스)
        mesh.LODManager.addLOD(70, new RedGPU.Primitive.Circle(redGPUContext, 1)); // 최저해상도 (원형)

        scene.addChild(mesh);
    }
};

/**
 * [KO] 테스트용 GUI를 렌더링하고 LOD 설정을 제어합니다.
 * [EN] Renders the GUI for testing and controls LOD settings.
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lodFolder = pane.addFolder({title: 'CPU LOD Settings', expanded: true});

            // LOD 정보 상태 관리 객체
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

            const baseInfo = {baseMesh: "Sphere (32x32x32)"};
            lodFolder.addBinding(baseInfo, "baseMesh", {label: "Base Mesh (LOD 0)", readonly: true});

            // 모든 메시의 LOD를 일괄 변경하는 헬퍼 함수
            const updateAllLODs = (distance, action, geometryFactory) => {
                scene.children.forEach(mesh => {
                    if (mesh instanceof RedGPU.Display.Mesh) {
                        if (action === 'add') {
                            const exists = mesh.LODManager.LODList.some(lod => lod.distance === distance);
                            if (!exists) mesh.LODManager.addLOD(distance, geometryFactory());
                        } else {
                            mesh.LODManager.removeLOD(distance);
                        }
                    }
                });
            };

            // LOD 레이어 토글 바인딩
            const setupLODToggle = (distance, label, geometryFactory) => {
                lodFolder.addBinding(lodState, `lod${distance}`, {label})
                    .on('change', (ev) => {
                        updateAllLODs(distance, ev.value ? 'add' : 'remove', geometryFactory);
                        pane.refresh();
                    });
            };

            setupLODToggle(25, 'LOD 25 (Sphere 5x5)', () => new RedGPU.Primitive.Sphere(redGPUContext, 1, 5, 5, 5));
            setupLODToggle(50, 'LOD 50 (Box)', () => new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2));
            setupLODToggle(70, 'LOD 70 (Circle)', () => new RedGPU.Primitive.Circle(redGPUContext, 1));

            lodFolder.addBinding(lodState, 'lodCount', {label: 'Active LOD Steps', readonly: true});
            lodFolder.addBinding(lodState, 'lodDistances', {label: 'Distances', readonly: true});

            const infoFolder = pane.addFolder({title: 'Scene Info', expanded: true});
            infoFolder.addBinding({meshCount: scene.numChildren}, 'meshCount', {
                label: 'Mesh Count',
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`
            });
        }
    });
};
