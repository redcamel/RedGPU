import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] InstancedMesh Sphere 예제
 * [EN] InstancedMesh Sphere example
 *
 * [KO] InstancingMesh를 사용하여 단일 드로우콜로 대량의 Sphere 인스턴스를 렌더링하는 방법을 시연합니다.
 * [EN] Demonstrates how to render a massive number of Sphere instances in a single draw call using InstancingMesh.
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

        // [KO] 대량 Sphere 인스턴스 렌더링을 위한 InstancingMesh 생성 및 초기화
        // [EN] Create and initialize InstancingMesh for massive Sphere instance rendering
        const {mesh, initializeInstances} = createInstancedTest(redGPUContext, scene, material);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view, mesh, initializeInstances);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createInstancedTest = (redGPUContext, scene, material) => {
    const limitSize = RedGPU.Display.InstancingMesh.getLimitSize(redGPUContext);
    const maxInstanceCount = redGPUContext.detector.isMobile ? 100000 : Math.min(limitSize, 1000000);
    const instanceCount = redGPUContext.detector.isMobile ? 20000 : 200000;

    const mesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxInstanceCount,
        instanceCount,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.5),
        material
    );
    scene.addChild(mesh);

    const initializeInstances = () => {
        for (let i = 0; i < mesh.instanceCount; i++) {
            const child = mesh.instanceChildren[i];
            if (child.x === 0 && child.y === 0 && child.z === 0) {
                child.setPosition(
                    Math.random() * 900 - 450,
                    Math.random() * 900 - 450,
                    Math.random() * 900 - 450
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
    return {mesh, initializeInstances};
};

const renderTestPane = (redGPUContext, view, mesh, initializeInstances) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'InstancingMesh', expanded: true});
            folder.addBinding(mesh, 'instanceCount', {
                min: 100,
                max: mesh.maxInstanceCount,
                step: 100
            }).on('change', initializeInstances);
            folder.addBinding(mesh, 'maxInstanceCount', {
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`
            });
            folder.addBinding({getLimitSize: RedGPU.Display.InstancingMesh.getLimitSize(redGPUContext)}, 'getLimitSize', {
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`
            });

            const statsFolder = pane.addFolder({title: 'Statistics', expanded: true});
            statsFolder.addBinding(view.renderViewStateData.renderResults, 'numDrawCalls', {
                readonly: true,
                interval: 100
            });
            statsFolder.addBinding(view.renderViewStateData.renderResults, 'numInstances', {
                readonly: true,
                interval: 100
            });
        }
    });
};
