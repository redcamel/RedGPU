import * as RedGPU from "../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 6;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#2a2a2a');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 메인 TextField3D 생성
        // [EN] Create main TextField3D
        const mainTextField = new RedGPU.Display.TextField3D(redGPUContext);
        mainTextField.text = 'Main<br/>TextField3D';
        mainTextField.color = '#ff4444';
        mainTextField.worldSize = 1.2;
        scene.addChild(mainTextField);

        // [KO] 추가 인스턴스들을 원형으로 배치
        // [EN] Arrange additional instances in a circle
        const count = 10;
        const radius = 5;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const instance = new RedGPU.Display.TextField3D(redGPUContext);
            instance.text = `Child ${i}`;
            instance.worldSize = 0.8;
            instance.setPosition(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            scene.addChild(instance);
        }

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
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

            const transformFolder = folder.addFolder({title: 'Transform & Billboard'});
            transformFolder.addBinding(target, 'useBillboard').on('change', (evt) => {
                updateAll('useBillboard', evt.value);
            });
            transformFolder.addBinding(target, 'usePixelSize').on('change', (evt) => {
                updateAll('usePixelSize', evt.value);
                updateUI();
            });
            const worldSizeBinding = transformFolder.addBinding(target, 'worldSize', {
                min: 0.1, max: 10, step: 0.1
            }).on('change', (evt) => {
                updateAll('worldSize', evt.value);
            });

            folder.addBlade({view: 'separator'});

            const styleFolder = folder.addFolder({title: 'Styles', expanded: true});

            styleFolder.addBinding(target, 'fontSize', {
                min: 1, max: 128, step: 1
            }).on('change', (evt) => {
                updateAll('fontSize', evt.value);
            });

            styleFolder.addBinding(target, 'padding', {
                min: 0, max: 32, step: 1
            }).on('change', (evt) => {
                updateAll('padding', evt.value);
            });

            Object.keys(OPTIONS).forEach((key) => {
                styleFolder.addBinding(target, key, {
                    options: OPTIONS[key].reduce((obj, value) => {
                        obj[value] = value;
                        return obj;
                    }, {})
                }).on('change', (evt) => {
                    updateAll(key, evt.value);
                });
            });

            const updateUI = () => {
                worldSizeBinding.disabled = target.usePixelSize;
            };

            updateUI();
        }
    });
};
