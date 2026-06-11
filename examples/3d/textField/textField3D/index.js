import * as RedGPU from "../../../../dist/index.js?t=1781143364605";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781143364605";

/**
 * [KO] TextField3D 예제
 * [EN] TextField3D example
 *
 * [KO] 3D 공간에서 고해상도 텍스트를 표현하는 TextField3D의 사용법과 스타일링, 빌보드 기능을 시연합니다.
 * [EN] Demonstrates the usage of TextField3D for high-resolution text in 3D space, including styling and billboard features.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas, 
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 6;
        controller.speedDistance = 0.5;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        
        // [KO] 배경색 설정
        // [EN] Set Background Color
        scene.useBackgroundColor = true
        scene.backgroundColor.setColorByHEX('#2a2a2a');
        
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 메인 텍스트 필드 생성
        // [EN] Create Main TextField3D
        const mainTextField = new RedGPU.Display.TextField3D(redGPUContext);
        mainTextField.text = 'Main<br/>TextField3D';
        mainTextField.color = '#ff4444';
        mainTextField.worldSize = 1.2;
        scene.addChild(mainTextField);

        // 4. [KO] 추가 인스턴스들을 원형으로 배치
        // [EN] Arrange Additional Instances in a Circle
        const count = 10;
        const radius = 5;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const instance = new RedGPU.Display.TextField3D(redGPUContext);
            instance.text = `Child ${i}`;
            instance.color = '#ffffff';
            instance.worldSize = 0.8;
            instance.setPosition(x, 0, z);
            scene.addChild(instance);
        }

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 로직
            // [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, scene);
    }, 
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 실시간 스타일 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time style control.
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'TextField3D Control', expanded: true});

            const target = scene.children.find(c => c instanceof RedGPU.Display.TextField3D);
            
            /**
             * [KO] 모든 TextField3D 인스턴스의 속성을 일괄 업데이트합니다.
             * [EN] Batch updates properties for all TextField3D instances.
             */
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
            const transformFolder = folder.addFolder({title: 'Transform & Billboard'});
            transformFolder.addBinding(target, 'useBillboard', { label: 'Use Billboard' }).on('change', (evt) => {
                updateAll('useBillboard', evt.value);
                updateUI();
            });
            const usePixelSizeBinding = transformFolder.addBinding(target, 'usePixelSize', { label: 'Use Pixel Size' }).on('change', (evt) => {
                updateAll('usePixelSize', evt.value);
                updateUI();
            });
            const worldSizeBinding = transformFolder.addBinding(target, 'worldSize', {
                min: 0.1, max: 10, step: 0.1,
                label: 'World Size'
            }).on('change', (evt) => {
                updateAll('worldSize', evt.value);
            });

            folder.addBlade({view: 'separator'});

            // [KO] 스타일 설정
            // [EN] Style Settings
            const styleFolder = folder.addFolder({title: 'Styles', expanded: true});

            styleFolder.addBinding(target, 'fontSize', {
                min: 1, max: 128, step: 1,
                label: 'Font Size'
            }).on('change', (evt) => {
                updateAll('fontSize', evt.value);
            });

            styleFolder.addBinding(target, 'padding', {
                min: 0, max: 32, step: 1,
                label: 'Padding'
            }).on('change', (evt) => {
                updateAll('padding', evt.value);
            });

            Object.keys(OPTIONS).forEach((key) => {
                styleFolder.addBinding(target, key, {
                    options: OPTIONS[key].reduce((obj, value) => {
                        obj[value] = value;
                        return obj;
                    }, {}),
                    label: key.replace(/([A-Z])/g, ' $1').trim()
                }).on('change', (evt) => {
                    updateAll(key, evt.value);
                });
            });

            // [KO] UI 활성화 상태 업데이트
            // [EN] Update UI activation state
            const updateUI = () => {
                const isBillboard = target.useBillboard;
                usePixelSizeBinding.disabled = !isBillboard;
                worldSizeBinding.disabled = isBillboard && target.usePixelSize;
            };

            updateUI();
        }
    });
};
