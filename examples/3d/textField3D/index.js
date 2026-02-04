/**
 * [KO] TextField3D 예제
 * [EN] TextField3D example
 *
 * [KO] 3D 공간에서 TextField3D의 사용법과 빌보드, 스타일링 기능을 시연합니다.
 * [EN] Demonstrates the usage of TextField3D in 3D space, including features like billboard and styling.
 * @packageDocumentation
 */
import * as RedGPU from "../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(canvas, (redGPUContext) => {
    // [KO] 카메라 컨트롤러 설정
    // [EN] Camera controller setup
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 6;
    controller.speedDistance = 0.5;

    // [KO] 씬 및 뷰 설정
    // [EN] Scene and View setup
    const scene = new RedGPU.Display.Scene();
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    redGPUContext.addView(view);

    // [KO] 메인 텍스트 필드 생성
    // [EN] Create main text field
    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.text = textField3D.name.split(' ').join('<br/>');
    textField3D.color = 'red';
    textField3D.worldSize = 1.0;
    scene.addChild(textField3D);

    // [KO] 추가 인스턴스들을 원형으로 배치
    // [EN] Arrange additional instances in a circle
    const spriteCount = 10;
    const radius = 5;

    for (let i = 0; i < spriteCount; i++) {
        const angle = (i / spriteCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const instance = new RedGPU.Display.TextField3D(redGPUContext);
        instance.text = instance.name.split(' ').join('<br/>');
        instance.color = 'red';
        instance.x = x;
        instance.z = z;
        instance.worldSize = 1.0;
        scene.addChild(instance);
    }

    // [KO] 렌더러 생성 및 시작
    // [EN] Create and start renderer
    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext);

    // [KO] 테스트용 GUI 설정
    // [EN] Setup GUI for testing
    renderTestPane(redGPUContext, scene);
}, (failReason) => {
    console.error('Initialization failed:', failReason);
    const errorMessage = document.createElement('div');
    errorMessage.innerHTML = failReason;
    document.body.appendChild(errorMessage);
});

/**
 * [KO] 테스트를 위한 Tweakpane GUI를 설정합니다.
 * [EN] Sets up the Tweakpane GUI for testing.
 *
 * [KO] TextField3D의 빌보드 모드, 픽셀 사이즈, 각종 스타일 속성(폰트, 색상, 정렬 등)을 실시간으로 제어할 수 있는 UI를 생성합니다.
 * [EN] Creates a UI to control TextField3D's billboard mode, pixel size, and various style properties (font, color, alignment, etc.) in real-time.
 *
 * @param redGPUContext -
 * [KO] RedGPU 렌더링 컨텍스트
 * [EN] RedGPU rendering context
 * @param scene -
 * [KO] 제어할 텍스트 필드들이 포함된 씬
 * [EN] Scene containing the text fields to control
 */
const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {setDebugButtons, setSeparator} = await import("../../exampleHelper/createExample/panes/index.js?t=1769835266959");

    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    const folder = pane.addFolder({title: 'TextField3D', expanded: true});

    const target = scene.children.find(c => c instanceof RedGPU.Display.TextField3D);
    const updateAll = (key, value) => {
        scene.children.forEach(c => {
            if (c instanceof RedGPU.Display.TextField3D) c[key] = value;
        });
    };

    const OPTIONS = {
        fontFamily: ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'],
        fontWeight: ['normal', 'bold', 'bolder', 'lighter'],
        fontStyle: ['normal', 'italic', 'oblique'],
        wordBreak: ['normal', 'break-all', 'keep-all', 'break-word'],
        verticalAlign: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom'],
        textAlign: ['left', 'right', 'center', 'justify'],
        background: ['transparent', '#000', '#fff', '#f00', '#0f0', '#00f'],
        color: ['#fff', '#000', '#f00', '#0f0', '#00f'],
        boxSizing: ['content-box', 'border-box'],
    };

    // [KO] 빌보드 및 크기 설정
    // [EN] Billboard & Size Settings
    folder.addBinding(target, 'useBillboard').on('change', (evt) => {
        updateAll('useBillboard', evt.value);
        updateUI();
    });
    const usePixelSize = folder.addBinding(target, 'usePixelSize').on('change', (evt) => {
        updateAll('usePixelSize', evt.value);
        updateUI();
    });
    const worldSize = folder.addBinding(target, 'worldSize', {min: 0.01, max: 10, step: 0.01}).on('change', (evt) => {
        updateAll('worldSize', evt.value);
    });

    setSeparator(folder);

    // [KO] 스타일 설정
    // [EN] Style Settings
    const styleFolder = folder.addFolder({title: 'Styles', expanded: true});
    
    styleFolder.addBinding(target, 'fontSize', {min: 0, max: 128, step: 1}).on('change', (evt) => {
        updateAll('fontSize', evt.value);
    });
    styleFolder.addBinding(target, 'padding', {min: 0, max: 32, step: 1}).on('change', (evt) => {
        updateAll('padding', evt.value);
    });

    Object.keys(OPTIONS).forEach((key) => {
        styleFolder.addBinding(target, key, {
            options: OPTIONS[key].reduce((obj, value) => {
                obj[value] = value;
                return obj;
            }, {}),
        }).on('change', (evt) => {
            updateAll(key, evt.value);
        });
    });

    // [KO] UI 활성화 상태 업데이트
    // [EN] Update UI activation state
    const updateUI = () => {
        const isBillboard = target.useBillboard;
        const isPixel = target.usePixelSize;

        usePixelSize.disabled = !isBillboard;
        worldSize.disabled = isBillboard && isPixel;
    };

    const refresh = () => {
        pane.refresh();
        requestAnimationFrame(refresh);
    };

    refresh();
    updateUI();
};
