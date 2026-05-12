import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper2/dist/index.js";

/**
 * [KO] Screen To World 예제
 * [EN] Screen To World example
 *
 * [KO] 2D 화면 좌표(마우스 좌표 등)를 3D 월드 좌표로 변환하는 방법을 보여줍니다.
 * [EN] Demonstrates how to transform 2D screen coordinates (like mouse coordinates) into 3D world coordinates.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.tilt = -45;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 간단한 screenToWorld 데모 설정
        const demo = setupSimpleDemo(redGPUContext, scene, view);

        // 라이팅 설정
        setupLighting(scene);

        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            updateInfoDisplay(demo);
        };

        renderer.start(redGPUContext, render);
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
        document.body.innerHTML = `<div style="color: red; padding: 20px;">오류: ${failReason}</div>`;
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        guiCallback: (pane) => {
            // [KO] 필요한 경우 여기에 추가 컨트롤을 구현할 수 있습니다.
            // [EN] Additional controls can be implemented here if needed.
        }
    });
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
    // 🎯 단일 타겟 메시 (구체)
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.color.setColorByRGB(255, 100, 100); // 빨간색

    const targetMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.8, 16, 16),
        material
    );
    scene.addChild(targetMesh);

    // 📊 정보 표시 UI
    const infoDisplay = createInfoDisplay();

    // 🖱️ 마우스 추적 데이터
    const mouseData = {
        screen: {x: 0, y: 0},
        world: {x: 0, y: 0, z: 0},
        isInCanvas: false
    };

    // 마우스 이벤트 설정
    setupMouseEvents(canvas, view, targetMesh, mouseData);

    return {
        targetMesh,
        infoDisplay,
        mouseData,
        view
    };
}

/**
 * [KO] 마우스 이벤트를 설정하여 3D 위치를 업데이트합니다.
 * [EN] Sets up mouse events to update 3D position.
 * @param {HTMLCanvasElement} canvas
 * @param {RedGPU.Display.View3D} view
 * @param {RedGPU.Display.Mesh} targetMesh
 * @param {object} mouseData
 */
function setupMouseEvents(canvas, view, targetMesh, mouseData) {
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();

        // CSS 픽셀 좌표 계산
        mouseData.screen.x = event.clientX - rect.left;
        mouseData.screen.y = event.clientY - rect.top;
        mouseData.isInCanvas = true;

        // 🌍 Screen to World 변환
        const worldCoords = view.screenToWorld(mouseData.screen.x, mouseData.screen.y);

        mouseData.world.x = worldCoords[0];
        mouseData.world.y = worldCoords[1];
        mouseData.world.z = worldCoords[2];

        // 타겟 메시 위치 업데이트
        targetMesh.setPosition(worldCoords[0], worldCoords[1], worldCoords[2]);
    });

    canvas.addEventListener('mouseleave', () => {
        mouseData.isInCanvas = false;
    });

    canvas.addEventListener('mouseenter', () => {
        mouseData.isInCanvas = true;
    });

    // 클릭으로 월드 좌표 로깅
    canvas.addEventListener('click', (event) => {
        console.log('🎯 클릭 위치:');
        console.log(`Screen: (${mouseData.screen.x}, ${mouseData.screen.y})`);
        console.log(`World: (${mouseData.world.x.toFixed(3)}, ${mouseData.world.y.toFixed(3)}, ${mouseData.world.z.toFixed(3)})`);
    });
}

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

function updateInfoDisplay(demo) {
    const {targetMesh, mouseData, view} = demo;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // 화면 좌표 계산 (World to Screen 역변환 테스트)
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

function setupLighting(scene) {
    // 방향성 라이트
    const directionalLight = new RedGPU.Light.DirectionalLight();
    directionalLight.direction = [-0.5, -1, -0.5];
    directionalLight.intensity = 0.8;
    scene.lightManager.addDirectionalLight(directionalLight);
}
