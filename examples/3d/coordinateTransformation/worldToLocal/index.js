import * as RedGPU from "../../../../dist/index.js?t=1781134103100";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781134103100";

/**
 * [KO] World To Local 예제
 * [EN] World To Local example
 *
 * [KO] 월드 좌표계와 로컬 좌표계 간의 변환(worldToLocal, localToWorld)을 시연합니다.
 * [EN] Demonstrates transformation between world and local coordinate systems (worldToLocal, localToWorld).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.tilt = -45;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 테스트용 메시 생성 (부모-자식 구조)
        // [EN] Create Test Meshes (Parent-Child Hierarchy)
        const {parentMesh, localToWorldMesh, worldToLocalMesh} = createTestMeshes(redGPUContext, scene);

        // 4. [KO] 정보 표시용 오버레이 박스 생성
        // [EN] Create Info Overlay Boxes
        const overlayBoxes = createOverlayBoxes();

        // 5. [KO] 조명 설정
        // [EN] Setup Lighting
        setupLighting(scene);

        // 6. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 부모 메시 회전 (상속된 변환 효과 확인용)
            // [EN] Rotate parent mesh (to observe inherited transformation)
            parentMesh.rotationX += 1.2;

            // [KO] 좌표 변환 수행 및 UI 업데이트
            // [EN] Perform coordinate transformations and update UI
            updateCoordinateTests(parentMesh, localToWorldMesh, worldToLocalMesh, view, overlayBoxes);
        };

        renderer.start(redGPUContext, render);

        // 7. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
        document.body.innerHTML = `<div>오류: ${failReason}</div>`;
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
 * [KO] 계층 구조를 가진 테스트용 메시들을 생성합니다.
 * [EN] Creates hierarchical test meshes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {object} Created meshes
 */
function createTestMeshes(redGPUContext, scene) {
    const textureMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    textureMaterial.diffuseTexture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        '../../../assets/UV_Grid_Sm.jpg'
    );

    // [KO] 🔴 부모 메시
    // [EN] 🔴 Parent Mesh
    const parentMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        textureMaterial
    );
    scene.addChild(parentMesh);

    // [KO] 🟢 localToWorld 테스트용 자식 메시
    // [EN] 🟢 Child mesh for localToWorld test
    const localToWorldMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        textureMaterial
    );
    localToWorldMesh.setScale(0.5);
    localToWorldMesh.setPosition(-6, 2, 2);
    parentMesh.addChild(localToWorldMesh);

    // [KO] 🔵 worldToLocal 테스트용 자식 메시
    // [EN] 🔵 Child mesh for worldToLocal test
    const worldToLocalMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        textureMaterial
    );
    worldToLocalMesh.setPosition(6, -2, -2);
    worldToLocalMesh.setScale(0.5);
    parentMesh.addChild(worldToLocalMesh);

    return {parentMesh, localToWorldMesh, worldToLocalMesh};
}

/**
 * [KO] 화면 오버레이 정보 박스들을 생성합니다.
 * [EN] Creates on-screen info overlay boxes.
 * @returns {object} Overlay box elements
 */
function createOverlayBoxes() {
    const boxStyle = {
        position: 'absolute',
        color: '#fff',
        fontSize: '12px',
        padding: '10px',
        minWidth: '200px',
        fontFamily: 'monospace',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 1000
    };

    // [KO] 부모 메시 정보 박스
    // [EN] Parent Mesh Info Box
    const parentMeshInfoBox = document.createElement('div');
    Object.assign(parentMeshInfoBox.style, boxStyle, {
        background: 'rgba(255,107,107,0.9)',
        border: '2px solid #ff6b6b'
    });
    document.body.appendChild(parentMeshInfoBox);

    // [KO] localToWorld 테스트 박스
    // [EN] localToWorld Test Box
    const localToWorldTestBox = document.createElement('div');
    Object.assign(localToWorldTestBox.style, boxStyle, {
        background: 'rgba(78,205,196,0.9)',
        border: '2px solid #4ecdc4'
    });
    document.body.appendChild(localToWorldTestBox);

    // [KO] worldToLocal 테스트 박스
    // [EN] worldToLocal Test Box
    const worldToLocalTestBox = document.createElement('div');
    Object.assign(worldToLocalTestBox.style, boxStyle, {
        background: 'rgba(0,136,255,0.9)',
        border: '2px solid #0088ff'
    });
    document.body.appendChild(worldToLocalTestBox);

    return {
        parentMeshInfoBox,
        localToWorldTestBox,
        worldToLocalTestBox
    };
}

/**
 * [KO] 장면에 조명을 설정합니다.
 * [EN] Sets up lighting in the scene.
 * @param {RedGPU.Display.Scene} scene
 */
function setupLighting(scene) {
    const directionalLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(directionalLight);

    const ambientLight = new RedGPU.Light.AmbientLight('#404040', 0.4);
    scene.lightManager.ambientLight = ambientLight;
}

/**
 * [KO] 실시간으로 좌표 변환을 테스트하고 UI를 업데이트합니다.
 * [EN] Tests coordinate transformations and updates UI in real-time.
 */
function updateCoordinateTests(parentMesh, localToWorldMesh, worldToLocalMesh, view, overlayBoxes) {
    const {parentMeshInfoBox, localToWorldTestBox, worldToLocalTestBox} = overlayBoxes;

    // 1. [KO] 부모 메시 정보 표시
    // [EN] Display Parent Mesh Info
    const parentScreenPoint = parentMesh.getScreenPoint(view);
    parentMeshInfoBox.style.top = parentScreenPoint[1] + 'px';
    parentMeshInfoBox.style.left = parentScreenPoint[0] + 'px';
    parentMeshInfoBox.innerHTML = `
        <strong>🔴 parent Mesh</strong><br>
        Screen: (${parentScreenPoint[0].toFixed(1)}, ${parentScreenPoint[1].toFixed(1)})<br>
        World: (${parentMesh.x.toFixed(2)}, ${parentMesh.y.toFixed(2)}, ${parentMesh.z.toFixed(2)})<br>
        Rotation: (${parentMesh.rotationX.toFixed(0)}°, ${parentMesh.rotationY.toFixed(0)}°, ${parentMesh.rotationZ.toFixed(0)}°)
    `;

    // 2. [KO] localToWorld 테스트
    // [EN] localToWorld Test
    const localCoords = [-1, 1, 0]; 
    const convertedWorldCoords = localToWorldMesh.localToWorld(localCoords[0], localCoords[1], localCoords[2]);

    const localToWorldAccuracy = validateLocalToWorldAccuracy(localToWorldMesh, localCoords, convertedWorldCoords);

    const localToWorldColor = localToWorldAccuracy.isAccurate ? '#4CAF50' : '#FF9800';
    const localToWorldScreenPoint = localToWorldMesh.getScreenPoint(view);
    localToWorldTestBox.style.top = localToWorldScreenPoint[1] + 'px';
    localToWorldTestBox.style.left = localToWorldScreenPoint[0] + 'px';
    localToWorldTestBox.innerHTML = `
        <strong>🟢 localToWorld Test</strong><br>
        localToWorldMesh.localToWorld(${localCoords.join(', ')})<br>
        <br>
        Input Local: (${localCoords.join(', ')})<br>
        Result World: (${convertedWorldCoords[0].toFixed(3)}, ${convertedWorldCoords[1].toFixed(3)}, ${convertedWorldCoords[2].toFixed(3)})<br>
        Screen: (${localToWorldScreenPoint[0].toFixed(1)}, ${localToWorldScreenPoint[1].toFixed(1)})<br>
        <br>
        <div style="background: rgba(0,0,0,0.6); padding: 4px; border-radius: 4px; border-left: 3px solid ${localToWorldColor};">
            <div style="font-size: 11px; font-weight: bold; color: ${localToWorldColor};">
                ${localToWorldAccuracy.isAccurate ? '✅' : '⚠️'} 변환 정확도
            </div>
            <div style="font-size: 10px; margin-top: 2px;">
                상대 오차율: ${localToWorldAccuracy.relativeErrorPercentage.toFixed(4)}%
            </div>
        </div>
    `;

    // 3. [KO] worldToLocal 테스트
    // [EN] worldToLocal Test
    const worldCoords = [3, 0, 1]; 
    const convertedLocalCoords = worldToLocalMesh.worldToLocal(worldCoords[0], worldCoords[1], worldCoords[2]);

    const worldToLocalAccuracy = validateWorldToLocalAccuracy(worldToLocalMesh, worldCoords, convertedLocalCoords);

    const worldToLocalColor = worldToLocalAccuracy.isAccurate ? '#4CAF50' : '#FF9800';
    const worldToLocalScreenPoint = worldToLocalMesh.getScreenPoint(view);
    worldToLocalTestBox.style.top = worldToLocalScreenPoint[1] + 'px';
    worldToLocalTestBox.style.left = worldToLocalScreenPoint[0] + 'px';
    worldToLocalTestBox.innerHTML = `
        <strong>🔵 worldToLocal Test</strong><br>
        worldToLocalMesh.worldToLocal(${worldCoords.join(', ')})<br>
        <br>
        Input World: (${worldCoords.join(', ')})<br>
        Result Local: (${convertedLocalCoords[0].toFixed(3)}, ${convertedLocalCoords[1].toFixed(3)}, ${convertedLocalCoords[2].toFixed(3)})<br>
        Screen: (${worldToLocalScreenPoint[0].toFixed(1)}, ${worldToLocalScreenPoint[1].toFixed(1)})<br>
        <br>
        <div style="background: rgba(0,0,0,0.6); padding: 4px; border-radius: 4px; border-left: 3px solid ${worldToLocalColor};">
            <div style="font-size: 11px; font-weight: bold; color: ${worldToLocalColor};">
                ${worldToLocalAccuracy.isAccurate ? '✅' : '⚠️'} 변환 정확도
            </div>
            <div style="font-size: 10px; margin-top: 2px;">
                상대 오차율: ${worldToLocalAccuracy.relativeErrorPercentage.toFixed(4)}%
            </div>
        </div>
    `;
}

/**
 * [KO] localToWorld 정확성을 역변환으로 검증합니다.
 * [EN] Validates localToWorld accuracy using reverse transformation.
 */
function validateLocalToWorldAccuracy(targetMesh, inputLocalCoords, outputWorldCoords) {
    const backToLocalCoords = targetMesh.worldToLocal(outputWorldCoords[0], outputWorldCoords[1], outputWorldCoords[2]);
    const absoluteError = Math.sqrt(
        Math.pow(backToLocalCoords[0] - inputLocalCoords[0], 2) +
        Math.pow(backToLocalCoords[1] - inputLocalCoords[1], 2) +
        Math.pow(backToLocalCoords[2] - inputLocalCoords[2], 2)
    );
    const originalMagnitude = Math.sqrt(
        Math.pow(inputLocalCoords[0], 2) +
        Math.pow(inputLocalCoords[1], 2) +
        Math.pow(inputLocalCoords[2], 2)
    );
    const relativeErrorPercentage = originalMagnitude > 0 ? (absoluteError / originalMagnitude) * 100 : 0;
    return { relativeErrorPercentage, isAccurate: absoluteError < 0.001 };
}

/**
 * [KO] worldToLocal 정확성을 역변환으로 검증합니다.
 * [EN] Validates worldToLocal accuracy using reverse transformation.
 */
function validateWorldToLocalAccuracy(targetMesh, inputWorldCoords, outputLocalCoords) {
    const backToWorldCoords = targetMesh.localToWorld(outputLocalCoords[0], outputLocalCoords[1], outputLocalCoords[2]);
    const absoluteError = Math.sqrt(
        Math.pow(backToWorldCoords[0] - inputWorldCoords[0], 2) +
        Math.pow(backToWorldCoords[1] - inputWorldCoords[1], 2) +
        Math.pow(backToWorldCoords[2] - inputWorldCoords[2], 2)
    );
    const originalMagnitude = Math.sqrt(
        Math.pow(inputWorldCoords[0], 2) +
        Math.pow(inputWorldCoords[1], 2) +
        Math.pow(inputWorldCoords[2], 2)
    );
    const relativeErrorPercentage = originalMagnitude > 0 ? (absoluteError / originalMagnitude) * 100 : 0;
    return { relativeErrorPercentage, isAccurate: absoluteError < 0.001 };
}
