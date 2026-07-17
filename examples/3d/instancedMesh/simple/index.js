import * as RedGPU from "../../../../dist/index.js?t=1784264851335";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1784264851335";

/**
 * [KO] InstancedMesh 기본 예제
 * [EN] InstancedMesh simple example
 *
 * [KO] InstancedMesh를 사용하여 수많은 객체를 효율적으로 렌더링하는 방법을 보여줍니다.
 * [EN] Demonstrates how to efficiently render a large number of objects using InstancedMesh.
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
        view.grid = true;

        // 4. 머티리얼 설정
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = texture;

        // 5. 인스턴싱 테스트 생성
        const {mesh, initializeInstances} = createInstancedTest(redGPUContext, scene, material);

        // 6. 렌더링 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 7. 테스트 GUI 설정
        renderTestPane(redGPUContext, mesh, initializeInstances);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 인스턴싱 테스트를 위한 메시를 생성합니다.
 * [EN] Creates meshes for instancing test.
 */
const createInstancedTest = (redGPUContext, scene, material) => {
    const maxInstanceCount = redGPUContext.detector.isMobile ? 100000 : Math.min(RedGPU.Display.InstancingMesh.getLimitSize(redGPUContext), 1000000);
    const instanceCount = redGPUContext.detector.isMobile ? 20000 : 200000;

    const mesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxInstanceCount,
        instanceCount,
        new RedGPU.Primitive.Plane(redGPUContext),
        material
    );
    scene.addChild(mesh);

    const initializeInstances = () => {
        for (let i = 0; i < mesh.instanceCount; i++) {
            const child = mesh.instanceChildren[i];
            if (child.x === 0) {
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

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext, mesh, initializeInstances) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Instancing Options', expanded: true});
            folder.addBinding(mesh, 'instanceCount', {min: 100, max: mesh.maxInstanceCount, step: 1})
                .on('change', initializeInstances);
            folder.addBinding(mesh, 'maxInstanceCount', {
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`,
                label: 'Max Instances'
            });
            folder.addBinding({limitSize: RedGPU.Display.InstancingMesh.getLimitSize(redGPUContext)}, 'limitSize', {
                readonly: true,
                format: (v) => `${Math.floor(v).toLocaleString()}`,
                label: 'Hardware Limit'
            });
        }
    });
};
