import * as RedGPU from "../../../../dist/index.js?t=1781131404967";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781131404967";

/**
 * [KO] Mesh LookAt 예제
 * [EN] Mesh LookAt example
 *
 * [KO] 메시가 특정 목표 지점이나 움직이는 객체를 항상 바라보도록 설정하는 LookAt 기능을 시연합니다.
 * [EN] Demonstrates the LookAt function that makes a mesh always face a specific target point or moving object.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 샘플 메시 군집 생성
        // [EN] Create Sample Mesh Swarm
        createSampleMeshes(redGPUContext, scene);

        // 4. [KO] 목표 지점을 표시할 타겟 객체 생성
        // [EN] Create Target Object to visualize target point
        const targetObject = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 0.2),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
        );
        scene.addChild(targetObject);

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const targetPosition = [0, 0, 0];
        const render = (time) => {
            // [KO] 타겟 객체의 위치를 시간에 따라 변화시킴
            // [EN] Change target object position over time
            targetPosition[0] = Math.sin(time / 1000) * 8;
            targetPosition[1] = Math.cos(time / 1000) * 8;
            targetPosition[2] = Math.sin(time / 1000) * 8;
            targetObject.setPosition(...targetPosition);

            // [KO] 모든 자식 메시들이 타겟을 바라보게 함
            // [EN] Make all meshes look at the target
            scene.children.forEach(child => {
                if (child !== targetObject && child instanceof RedGPU.Display.Mesh) {
                    child.lookAt(...targetPosition);
                }
            });
        };
        renderer.start(redGPUContext, render);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 구성합니다.
 * [EN] Configures GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};

/**
 * [KO] 수많은 샘플 메시들을 무작위 위치에 생성합니다.
 * [EN] Creates many sample meshes at random positions.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createSampleMeshes = (redGPUContext, scene) => {
    // [KO] 성능을 위해 지오메트리와 재질을 루프 밖에서 생성하여 공유함
    // [EN] Create geometry and materials outside the loop and share them for performance
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 2);
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png')
    );
    const material2 = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');

    for (let i = 0; i < 100; i++) {
        // [KO] 본체 메시
        // [EN] Base Mesh
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        
        // [KO] 앞방향을 표시할 보조 메시
        // [EN] Sub-mesh to indicate front direction
        const frontIndicator = new RedGPU.Display.Mesh(redGPUContext, geometry, material2);
        frontIndicator.setScale(0.2, 0.2, 0.5);

        frontIndicator.setPosition(0, 0, -1.1);
        mesh.addChild(frontIndicator);

        // [KO] 무작위 위치 배치
        // [EN] Set random position
        mesh.setPosition(
            Math.random() * 30 - 15,
            Math.random() * 30 - 15,
            Math.random() * 30 - 15
        );
        scene.addChild(mesh);
    }
};
