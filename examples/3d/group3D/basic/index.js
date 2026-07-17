import * as RedGPU from "../../../../dist/index.js?t=1784264851335";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1784264851335";

/**
 * [KO] Group3D Basic 예제
 * [EN] Group3D Basic example
 *
 * [KO] Group3D를 사용하여 3D 객체들을 그룹화하고 계층 구조(Hierarchy)에 따른 변환 전파를 시연합니다.
 * [EN] Demonstrates grouping 3D objects and transformation propagation through the hierarchy using Group3D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;
        controller.tilt = -15;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 기본 라이트 추가
        // [EN] Add Basic Light
        const light = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff');
        scene.lightManager.addDirectionalLight(light);

        // 3. [KO] 3D 계층 구조 생성 (Root Group -> Parent Mesh -> Child Mesh)
        // [EN] Create 3D Hierarchy (Root Group -> Parent Mesh -> Child Mesh)

        // [KO] 루트 그룹 (부모들의 부모)
        // [EN] Root Group (Parent of parents)
        const rootGroup = new RedGPU.Display.Group3D();
        scene.addChild(rootGroup);

        // [KO] 부모 메시 (그룹의 자식이자 하위 메시의 부모)
        // [EN] Parent Mesh (Child of group and parent of sub-mesh)
        const parentMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        parentMaterial.baseColorFactor = [0.2, 0.6, 1.0, 1.0]; // Blueish
        
        const parentMesh = new RedGPU.Display.Mesh(
            redGPUContext, 
            new RedGPU.Primitive.Box(redGPUContext), 
            parentMaterial
        );
        rootGroup.addChild(parentMesh);

        // [KO] 자식 메시 (부모 메시의 자식)
        // [EN] Child Mesh (Child of parent mesh)
        const childMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        childMaterial.baseColorFactor = [1.0, 0.4, 0.4, 1.0]; // Reddish
        
        const childMesh = new RedGPU.Display.Mesh(
            redGPUContext, 
            new RedGPU.Primitive.Box(redGPUContext, 0.5, 0.5, 0.5), 
            childMaterial
        );
        childMesh.setPosition(1.5, 1.5, 0);
        parentMesh.addChild(childMesh);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, rootGroup, parentMesh, childMesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 계층 구조의 각 단계를 제어하기 위한 GUI를 구성합니다.
 * [EN] Configures GUI to control each level of the hierarchy.
 */
const renderTestPane = (redGPUContext, rootGroup, parent, child) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            /**
             * [KO] 공용 변환 제어 폴더 생성 함수
             * [EN] Function to create common transform control folders
             */
            const addTransformFolder = (target, title, expanded = false) => {
                const folder = pane.addFolder({title, expanded});
                
                // Position
                const pos = folder.addFolder({title: 'Position'});
                pos.addBinding(target, 'x', {min: -5, max: 5, step: 0.1});
                pos.addBinding(target, 'y', {min: -5, max: 5, step: 0.1});
                pos.addBinding(target, 'z', {min: -5, max: 5, step: 0.1});
                
                // Rotation
                const rot = folder.addFolder({title: 'Rotation'});
                rot.addBinding(target, 'rotationX', {min: 0, max: 360, step: 1, label: 'Rotation X'});
                rot.addBinding(target, 'rotationY', {min: 0, max: 360, step: 1, label: 'Rotation Y'});
                rot.addBinding(target, 'rotationZ', {min: 0, max: 360, step: 1, label: 'Rotation Z'});
                
                // Scale
                const sca = folder.addFolder({title: 'Scale'});
                sca.addBinding(target, 'scaleX', {min: 0.1, max: 3, step: 0.1, label: 'Scale X'});
                sca.addBinding(target, 'scaleY', {min: 0.1, max: 3, step: 0.1, label: 'Scale Y'});
                sca.addBinding(target, 'scaleZ', {min: 0.1, max: 3, step: 0.1, label: 'Scale Z'});
                
                return folder;
            };

            addTransformFolder(rootGroup, '1. Root Group3D', true);
            addTransformFolder(parent, '2. Parent Mesh', true);
            addTransformFolder(child, '3. Child Mesh', true);
        }
    });
};
