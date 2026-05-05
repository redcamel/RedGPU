import * as RedGPU from "../../../dist/index.js?t=1770713934910";
import RedGPUInspector from "../../../inspector/dist/index.js?t=1770713934910";
import RedGPUInspector2 from "../../../inspector2/dist/index.js?t=1770713934910";

/**
 * [KO] Hello World 3D 예제
 * [EN] Hello World 3D example
 *
 * [KO] 가장 기본적인 RedGPU 3D 씬 구성 방법을 보여줍니다.
 * [EN] Demonstrates the most basic way to set up a RedGPU 3D scene.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        const inspector = new RedGPUInspector();
        const inspector2 = new RedGPUInspector2();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직
            // [EN] Logic to be executed every frame
            inspector.render(redGPUContext, time);
            inspector2.render(redGPUContext, time);
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view, inspector, inspector2);
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);

        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} view
 * @param {RedGPU.RedGPUInspector} inspector
 * @param {RedGPU.RedGPUInspector} inspector2
 */
const renderTestPane = async (redGPUContext, view, inspector, inspector2) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const {
        setRedGPUTest_pane,
        setDebugButtons
    } = await import("../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext, inspector)
    
    // 새 인스펙터 버튼 추가 (기본 디버그 버튼 옆에 배치하기 위해 수동 추가)
    const checkContainer = () => {
        const rightContainer = document.querySelector('.navigation-bar > div:last-child');
        if (rightContainer) {
            const button2 = document.createElement('div');
            button2.className = 'nav-button example-setting-button';
            button2.innerText = 'New Inspector';
            button2.style.fontSize = '10px';
            button2.style.padding = '0 10px';
            button2.style.whiteSpace = 'nowrap';
            button2.style.color = '#fdb48d';
            button2.style.opacity = inspector2.useDebugPanel ? '1' : '0.25';
            
            button2.addEventListener('click', () => {
                inspector2.useDebugPanel = !inspector2.useDebugPanel;
                button2.style.opacity = inspector2.useDebugPanel ? '1' : '0.25';
            });
            
            // Debug Panel 버튼 앞에 삽입
            const debugBtn = Array.from(rightContainer.children).find(el => el.innerText === 'Debug Panel' || el.querySelector('img[src*="debug.svg"]'));
            if (debugBtn) {
                rightContainer.insertBefore(button2, debugBtn);
            } else {
                rightContainer.appendChild(button2);
            }
        } else {
            setTimeout(checkContainer, 100);
        }
    };
    checkContainer();

    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, true);
};
