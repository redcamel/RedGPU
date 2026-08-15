import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * Landscape Foliage Instancing & Culling Basic Test Example
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 자유 카메라 컨트롤러
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 150;
        controller.z = 300;
        controller.moveSpeed = 1000;

        // 2. Scene & View3D
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. Directional Light
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.intensity = 1.5;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. Landscape 지형 생성
        const landscape = new RedGPU.Display.Landscape(redGPUContext, {
            worldSize: [4000, 4000],
            componentCount: [4, 4],
            componentSizeQuads: 63,
            maxLODLevel: 4,
            wireframe: false
        });
        scene.addLandscape(landscape);

        // 5. Landscape 내부 foliageManager 가져오기
        const foliageManager = landscape.foliageManager;

        // 테스트용 PBRMaterial 식생 메시
        const grassGeometry = new RedGPU.Primitive.Box(redGPUContext, 8.0, 40.0, 8.0);
        const grassMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        grassMaterial.baseColorFactor = [0.24, 0.66, 0.28, 1.0];
        grassMaterial.roughnessFactor = 0.7;
        grassMaterial.metallicFactor = 0.0;
        const dummyGrassMesh = new RedGPU.Display.Mesh(redGPUContext, grassGeometry, grassMaterial);

        // 6. 식생 종류(Grass) 등록
        const grassType = foliageManager.addFoliageType({
            name: 'GrassSpecies',
            mesh: dummyGrassMesh,
            densityPer100m2: 50,
            maxInstances: 20000,
            cullingDistance: 3000,
            fadeStartDistance: 2200,
            minScale: [2.0, 2.0, 2.0],
            maxScale: [5.0, 8.0, 5.0],
            randomRotationY: true
        });

        // 지형 내범위에 5,000개 식생 무작위 파퓰레이션 (Zero-GC)
        grassType.populateRandomInstances(5000, {
            minX: -1500,
            minZ: -1500,
            maxX: 1500,
            maxZ: 1500
        });

        // 7. 렌더 루프 (매 프레임 Culling & FadeFactor 갱신)
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            landscape.update(controller, view.renderViewStateData);

            // 매 프레임 카메라 위치 기반 인스턴스 Culling & Distance Fade 갱신
            foliageManager.update([controller.x, controller.y, controller.z]);
        };
        renderer.start(redGPUContext, render);

        // 8. Tweakpane UI 디버그 컨트롤러
        new RedGPUExampleHelper(redGPUContext, {
            RedGPU,
            gui: (pane) => {
                const folder = pane.addFolder({title: '🌿 Foliage Manager Controls', expanded: true});

                const config = {
                    instanceCount: grassType.activeInstanceCount,
                    cullingDistance: grassType.options.cullingDistance,
                    fadeStartDistance: grassType.options.fadeStartDistance,
                };

                folder.addBinding(config, 'instanceCount', {readonly: true, label: 'Active Instances'});

                folder.addBinding(config, 'cullingDistance', {min: 50, max: 1000, step: 10, label: 'Culling Dist (m)'})
                    .on('change', (ev) => {
                        grassType.options.cullingDistance = ev.value;
                    });

                folder.addBinding(config, 'fadeStartDistance', {
                    min: 10,
                    max: 800,
                    step: 10,
                    label: 'Fade Start Dist (m)'
                })
                    .on('change', (ev) => {
                        grassType.options.fadeStartDistance = ev.value;
                    });

                folder.addButton({title: '🔄 Re-populate 10,000 Grass'}).on('click', () => {
                    grassType.populateRandomInstances(10000, {
                        minX: -1500,
                        minZ: -1500,
                        maxX: 1500,
                        maxZ: 1500
                    });
                    config.instanceCount = grassType.activeInstanceCount;
                    pane.refresh();
                });
            }
        });
    }
);
