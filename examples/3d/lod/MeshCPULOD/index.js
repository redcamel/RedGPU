import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

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

        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/UV_Grid_Sm.jpg'
        );

        const lodGeometries = createMeshCPULODTest(redGPUContext, scene, material);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, scene, lodGeometries);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createMeshCPULODTest = (redGPUContext, scene, material) => {
    const maxNum = redGPUContext.detector.isMobile ? 1000 : 5000;
    const baseGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32, 32);
    const lod25Geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 5, 5, 5);
    const lod50Geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const lod70Geometry = new RedGPU.Primitive.Circle(redGPUContext, 1);

    // [KO] 다수의 개별 Mesh 생성 및 거리별 CPU LOD 단계(25, 50, 70) 등록
    // [EN] Create multiple individual Meshes and register distance-based CPU LOD levels (25, 50, 70)
    for (let i = 0; i < maxNum; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, baseGeometry, material);
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

        mesh.LODManager.addLOD(25, lod25Geometry);
        mesh.LODManager.addLOD(50, lod50Geometry);
        mesh.LODManager.addLOD(70, lod70Geometry);
        scene.addChild(mesh);
    }

    return {lod25Geometry, lod50Geometry, lod70Geometry};
};

const renderTestPane = (redGPUContext, scene, lodGeometries) => {
    const {lod25Geometry, lod50Geometry, lod70Geometry} = lodGeometries;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lodFolder = pane.addFolder({title: 'LODManager (Base: Sphere 32x32)', expanded: true});
            const lodState = {
                lod25_Sphere5x5: true,
                lod50_Box: true,
                lod70_Circle: true,
                get lodCount() {
                    return scene.children[0]?.LODManager.LODList.length || 0;
                },
                get distances() {
                    return (scene.children[0]?.LODManager.LODList || []).map((lod) => lod.distance).join(', ');
                }
            };

            const updateAllLODs = (distance, enabled, geometry) => {
                scene.children.forEach((mesh) => {
                    if (mesh instanceof RedGPU.Display.Mesh) {
                        if (enabled) {
                            const exists = mesh.LODManager.LODList.some((lod) => lod.distance === distance);
                            if (!exists) mesh.LODManager.addLOD(distance, geometry);
                        } else {
                            mesh.LODManager.removeLOD(distance);
                        }
                    }
                });
            };

            const setupLODToggle = (key, distance, geometry) => {
                lodFolder.addBinding(lodState, key).on('change', (ev) => {
                    updateAllLODs(distance, ev.value, geometry);
                    pane.refresh();
                });
            };

            setupLODToggle('lod25_Sphere5x5', 25, lod25Geometry);
            setupLODToggle('lod50_Box', 50, lod50Geometry);
            setupLODToggle('lod70_Circle', 70, lod70Geometry);
            lodFolder.addBinding(lodState, 'lodCount', {readonly: true});
            lodFolder.addBinding(lodState, 'distances', {readonly: true});
        }
    });
};
