import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] InstancedMesh GPU LOD 예제
 * [EN] InstancedMesh GPU LOD example
 *
 * [KO] GPU 기반의 LOD(Level of Detail) 기능을 InstancingMesh에 적용하여 거리별 최적화 성능을 시연합니다.
 * [EN] Demonstrates GPU-based LOD (Level of Detail) on InstancingMesh for distance-based optimization performance.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;

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

        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/UV_Grid_Sm.jpg'
        );

        const {instancingMesh, initializeInstances} = createInstancedLODTest(redGPUContext, scene, material);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, instancingMesh, initializeInstances);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createInstancedLODTest = (redGPUContext, scene, material) => {
    const limitSize = RedGPU.Display.InstancingMesh.getLimitSize(redGPUContext);
    const maxInstanceCount = redGPUContext.detector.isMobile ? 100000 : Math.min(limitSize, 1000000);
    const instanceCount = redGPUContext.detector.isMobile ? 20000 : 200000;

    // [KO] 기본 메시(LOD 0) 생성 및 거리별 GPU LOD 단계(25, 50, 70) 등록
    // [EN] Create base mesh (LOD 0) and register distance-based GPU LOD levels (25, 50, 70)
    const instancingMesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxInstanceCount,
        instanceCount,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 32, 32, 32),
        material
    );
    instancingMesh.LODManager.addLOD(25, new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 8, 8, 8));
    instancingMesh.LODManager.addLOD(50, new RedGPU.Primitive.Box(redGPUContext));
    instancingMesh.LODManager.addLOD(70, new RedGPU.Primitive.Circle(redGPUContext, 0.5));
    scene.addChild(instancingMesh);

    const initializeInstances = () => {
        for (let i = 0; i < instancingMesh.instanceCount; i++) {
            const child = instancingMesh.instanceChildren[i];
            if (child.x === 0) {
                child.setPosition(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250
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

const renderTestPane = (redGPUContext, instancingMesh, initializeInstances) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lodFolder = pane.addFolder({title: 'LODManager (Base: Sphere 32x32)', expanded: true});
            const lodState = {
                lod25_Sphere8x8: true,
                lod50_Box: true,
                lod70_Circle: true,
                get lodCount() {
                    return instancingMesh.LODManager.LODList.length;
                },
                get distances() {
                    return instancingMesh.LODManager.LODList.map((lod) => lod.distance).join(', ');
                }
            };

            const setupLODToggle = (key, distance, geometryFactory) => {
                lodFolder.addBinding(lodState, key).on('change', (ev) => {
                    if (ev.value) {
                        instancingMesh.LODManager.addLOD(distance, geometryFactory());
                    } else {
                        instancingMesh.LODManager.removeLOD(distance);
                    }
                    pane.refresh();
                });
            };

            setupLODToggle('lod25_Sphere8x8', 25, () => new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 8, 8, 8));
            setupLODToggle('lod50_Box', 50, () => new RedGPU.Primitive.Box(redGPUContext));
            setupLODToggle('lod70_Circle', 70, () => new RedGPU.Primitive.Circle(redGPUContext, 0.5));
            lodFolder.addBinding(lodState, 'lodCount', {readonly: true});
            lodFolder.addBinding(lodState, 'distances', {readonly: true});

            const instancingFolder = pane.addFolder({title: 'InstancingMesh', expanded: true});
            instancingFolder.addBinding(instancingMesh, 'instanceCount', {
                min: 0,
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
