import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Mesh LookAt 예제
 * [EN] Mesh LookAt example
 *
 * [KO] lookAt()을 사용해 다수의 메시가 움직이는 타겟을 실시간으로 바라보도록 회전시킵니다.
 * [EN] Uses lookAt() to rotate many meshes so they face a moving target in real-time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const meshes = createSampleMeshes(redGPUContext, scene, 100);

        const targetObject = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 0.2),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
        );
        scene.addChild(targetObject);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const targetX = Math.sin(time / 1000) * 8;
            const targetY = Math.cos(time / 1000) * 8;
            const targetZ = Math.sin(time / 1000) * 8;
            targetObject.setPosition(targetX, targetY, targetZ);

            // [KO] 모든 메시가 타겟 좌표를 바라보도록 회전
            // [EN] Rotate every mesh to face the target position
            for (let i = 0, len = meshes.length; i < len; i++) {
                meshes[i].lookAt(targetX, targetY, targetZ);
            }
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleMeshes = (redGPUContext, scene, count) => {
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 2);
    const bodyMaterial = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png')
    );
    const frontMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');

    const meshes = [];
    for (let i = 0; i < count; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, bodyMaterial);
        mesh.setPosition(
            Math.random() * 30 - 15,
            Math.random() * 30 - 15,
            Math.random() * 30 - 15
        );

        // [KO] 메시의 앞방향(-Z)을 표시하는 보조 메시
        // [EN] Indicator mesh marking the mesh's forward direction (-Z)
        const frontIndicator = new RedGPU.Display.Mesh(redGPUContext, geometry, frontMaterial);
        frontIndicator.setScale(0.2, 0.2, 0.5);
        frontIndicator.setPosition(0, 0, -1.1);
        mesh.addChild(frontIndicator);

        scene.addChild(mesh);
        meshes.push(mesh);
    }
    return meshes;
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
