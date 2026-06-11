import * as RedGPU from "../../../../dist/index.js?t=1781143364605";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781143364605";

/**
 * [KO] Screen To World 예제
 * [EN] Screen To World example
 *
 * [KO] 2D 화면 좌표(마우스 좌표 등)를 3D 월드 좌표로 변환하는 방법을 시연합니다.
 * [EN] Demonstrates how to transform 2D screen coordinates (like mouse coordinates) into 3D world coordinates.
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

        // 3. [KO] 데모 요소 설정 (타겟 메시, 마우스 이벤트, 정보 표시 UI)
        // [EN] Setup Demo Elements (Target Mesh, Mouse Events, Info UI)
        const demo = setupSimpleDemo(redGPUContext, scene, view);

        // 4. [KO] 조명 설정
        // [EN] Setup Lighting
        setupLighting(scene);

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 정보 표시 UI 업데이트
            // [EN] Update Info Display UI
            updateInfoDisplay(demo);
        };

        renderer.start(redGPUContext, render);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
        document.body.innerHTML = `<div style="color: red; padding: 20px;">오류: ${failReason}</div>`;
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
 * [KO] 간단한 데모 씬을 설정합니다.
 * [EN] Sets up a simple demo scene.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {RedGPU.Display.View3D} view
 * @returns {object} Demo object
 */
function setupSimpleDemo(redGPUContext, scene, view) {
    // [KO] 타겟 메시 생성 (빨간색 구체)
    // [EN] Create target mesh (red sphere)
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.color.setColorByRGB(255, 100, 100);

    const targetMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.8, 16, 16),
        material
    );
    scene.addChild(targetMesh);

    // [KO] 정보 표시용 오버레이 UI 생성
    // [EN] Create information display overlay UI
    const infoDisplay = createInfoDisplay();

    // [KO] 마우스 데이터 상태 객체
    // [EN] Mouse data state object
    const mouseData = {
        screen: {x: 0, y: 0},
        world: {x: 0, y: 0, z: 0},
        isInCanvas: false
    };

    // [KO] 마우스 이벤트 리스너 등록
    // [EN] Register mouse event listeners
    setupMouseEvents(canvas, view, targetMesh, mouseData);

    return {
        targetMesh,
        infoDisplay,
        mouseData,
        view
    };
}

/**
 * [KO] 마우스 이벤트를 설정하여 3D 위치를 실시간으로 업데이트합니다.
 * [EN] Sets up mouse events to update 3D position in real-time.
 * @param {HTMLCanvasElement} canvas
 * @param {RedGPU.Display.View3D} view
 * @param {RedGPU.Display.Mesh} targetMesh
 * @param {object} mouseData
 */
function setupMouseEvents(canvas, view, targetMesh, mouseData) {
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();

        // [KO] 마우스의 화면 좌표 계산 (CSS 픽셀)
        // [EN] Calculate mouse screen coordinates (CSS pixels)
        mouseData.screen.x = event.clientX - rect.left;
        mouseData.screen.y = event.clientY - rect.top;
        mouseData.isInCanvas = true;

        // [KO] 🌍 Screen to World 변환 수행
        // [EN] 🌍 Perform Screen to World transformation
        const worldCoords = view.screenToWorld(mouseData.screen.x, mouseData.screen.y);

        mouseData.world.x = worldCoords[0];
        mouseData.world.y = worldCoords[1];
        mouseData.world.z = worldCoords[2];

        // [KO] 타겟 메시를 변환된 월드 좌표로 이동
        // [EN] Move target mesh to the transformed world coordinates
        targetMesh.setPosition(worldCoords[0], worldCoords[1], worldCoords[2]);
    });

    canvas.addEventListener('mouseleave', () => {
        mouseData.isInCanvas = false;
    });

    canvas.addEventListener('mouseenter', () => {
        mouseData.isInCanvas = true;
    });

    // [KO] 클릭 시 좌표를 콘솔에 출력
    // [EN] Log coordinates to console on click
    canvas.addEventListener('click', () => {
        console.log('🎯 클릭 위치 (Clicked Position):');
        console.log(`Screen: (${mouseData.screen.x}, ${mouseData.screen.y})`);
        console.log(`World: (${mouseData.world.x.toFixed(3)}, ${mouseData.world.y.toFixed(3)}, ${mouseData.world.z.toFixed(3)})`);
    });
}

/**
 * [KO] 정보 표시용 DOM 엘리먼트를 생성합니다.
 * [EN] Creates a DOM element for information display.
 * @returns {HTMLDivElement}
 */
function createInfoDisplay() {
    const infoDisplay = document.createElement('div');
    Object.assign(infoDisplay.style, {
        position: 'absolute',
        top: '68px',
        right: '16px',
        color: '#333',
        fontSize: '12px',
        padding: '16px',
        minWidth: '280px',
        maxWidth: '320px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        lineHeight: '1.4'
    });
    document.body.appendChild(infoDisplay);
    return infoDisplay;
}

/**
 * [KO] 현재 좌표 정보를 UI에 업데이트합니다.
 * [EN] Updates current coordinate information on the UI.
 * @param {object} demo
 */
function updateInfoDisplay(demo) {
    const {targetMesh, mouseData, view} = demo;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // [KO] World to Screen 역변환 수행 (검증용)
    // [EN] Perform World to Screen reverse transformation (for validation)
    const targetScreenPoint = targetMesh.getScreenPoint(view);

    demo.infoDisplay.innerHTML = `
        <div style="border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 12px;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #2563eb;">
                🖱️ Mouse Information
            </div>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 11px;">
                <span style="color: #6b7280;">CSS Pixel:</span>
                <span style=" color: #dc2626;">(${mouseData.screen.x.toFixed(0)}, ${mouseData.screen.y.toFixed(0)})</span>
                
                <span style="color: #6b7280;">Device Pixel:</span>
                <span style=" color: #dc2626;">(${(mouseData.screen.x * devicePixelRatio).toFixed(0)}, ${(mouseData.screen.y * devicePixelRatio).toFixed(0)})</span>
                
                <span style="color: #6b7280;">World Coord:</span>
                <span style=" color: #059669;">(${mouseData.world.x.toFixed(2)}, ${mouseData.world.y.toFixed(2)}, ${mouseData.world.z.toFixed(2)})</span>
                
                <span style="color: #6b7280;">Status:</span>
                <span style="color: ${mouseData.isInCanvas ? '#059669' : '#dc2626'};">
                    ${mouseData.isInCanvas ? '✅ Inside Canvas' : '❌ Outside Canvas'}
                </span>
            </div>
        </div>
        
        <div style="border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 12px;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #dc2626;">
                🎯 Target Mesh
            </div>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 11px;">
                <span style="color: #6b7280;">World Position:</span>
                <span style=" color: #059669;">(${targetMesh.x.toFixed(2)}, ${targetMesh.y.toFixed(2)}, ${targetMesh.z.toFixed(2)})</span>
                
                <span style="color: #6b7280;">Screen Position:</span>
                <span style=" color: #dc2626;">(${targetScreenPoint[0].toFixed(1)}, ${targetScreenPoint[1].toFixed(1)})</span>
            </div>
        </div>
        
        <div style="border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 12px;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #7c3aed;">
                🖥️ Display Information
            </div>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 11px;">
                <span style="color: #6b7280;">Device Pixel Ratio:</span>
                <span style="">${devicePixelRatio}x</span>
                
                <span style="color: #6b7280;">Canvas Size:</span>
                <span style="">${canvas.width} × ${canvas.height}</span>
                
                <span style="color: #6b7280;">ViewPort Size:</span>
                <span style="">${view.pixelRectArray[2]} × ${view.pixelRectArray[3]}</span>
            </div>
        </div>
        
        <div style="font-size: 10px; color: #6b7280; text-align: center; line-height: 1.5;">
            💡 Move your mouse to control the red sphere<br>
            ScreenToWorld transformation applied in real-time
        </div>
    `;
}

/**
 * [KO] 장면에 조명을 설정합니다.
 * [EN] Sets up lighting in the scene.
 * @param {RedGPU.Display.Scene} scene
 */
function setupLighting(scene) {
    const directionalLight = new RedGPU.Light.DirectionalLight();
    directionalLight.direction = [-0.5, -1, -0.5];
    directionalLight.intensity = 0.8;
    scene.lightManager.addDirectionalLight(directionalLight);
}
