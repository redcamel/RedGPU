import * as RedGPU from "../../../../dist/index.js?t=1781136546834";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781136546834";

/**
 * [KO] TextField2D Basic 예제
 * [EN] TextField2D Basic example
 *
 * [KO] TextField2D의 기본 사용법과 스타일링 옵션을 보여줍니다.
 * [EN] Demonstrates the basic usage and styling options of TextField2D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] Scene 생성
        // [EN] Create Scene
        const scene = new RedGPU.Display.Scene();
        scene.backgroundColor.r = 255;
        scene.backgroundColor.g = 0;
        scene.backgroundColor.b = 0;
        scene.useBackgroundColor = true;

        // 2. [KO] 2D View 생성 및 등록
        // [EN] Create and register 2D View
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        // 3. [KO] TextField2D 생성
        // [EN] Create TextField2D
        const spriteCount = 10;
        const radius = 250;
        for (let i = 0; i < spriteCount; i++) {
            const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
            textField2D.text = textField2D.name.split(' ').join('<br/>');
            scene.addChild(textField2D);
        }

        // 4. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            const centerX = width / 2;
            const centerY = height / 2;

            scene.children.forEach((child, i) => {
                const angle = (i / spriteCount) * Math.PI * 2;
                child.x = Math.floor(centerX + Math.cos(angle) * radius);
                child.y = Math.floor(centerY + Math.sin(angle) * radius);
            });
        };
        redGPUContext.onResize({
            target: redGPUContext,
            screenRectObject: redGPUContext.screenRectObject,
            pixelRectObject: redGPUContext.pixelRectObject
        });

        // 5. [KO] 렌더러 시작
        // [EN] Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        // 6. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(scene, redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 처리
        // [EN] Handle initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (scene, redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const controls = {};

            const BASE_STYLES = {
                padding: 0,
                background: 'transparent',
                color: '#fff',
                fontFamily: 'Arial',
                fontSize: 16,
                fontWeight: 'normal',
                fontStyle: 'normal',
                letterSpacing: 0,
                wordBreak: 'break-all',
                verticalAlign: 'middle',
                textAlign: 'center',
                borderRadius: '10px',
                lineHeight: 1.4,
                border: '',
                boxShadow: 'none',
                boxSizing: 'border-box',
                filter: '',
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

            const updateTestData = () => {
                const child = scene.children[0];

                controls.scaleX = child.scaleX;
                controls.scaleY = child.scaleY;
                controls.scaleZ = child.scaleZ;
                controls.rotation = child.rotation;
                controls.useSmoothing = child.useSmoothing;

                Object.keys(BASE_STYLES).forEach((key) => {
                    controls[key] = child[key];
                });

                pane.refresh();
            };

            updateTestData();

            const textField2DFolder = pane.addFolder({title: 'TextField2D', expanded: true});
            textField2DFolder.addBinding(controls, 'useSmoothing').on('change', (evt) => {
                scene.children.forEach((child) => {
                    child.useSmoothing = evt.value;
                });
            });

            pane.addBlade({view: 'separator'});

            const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});

            scaleFolder.addBinding(controls, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
                scene.children.forEach((child) => {
                    child.scaleX = evt.value;
                });
            });
            scaleFolder.addBinding(controls, 'rotation', {min: 0, max: 360, step: 0.1}).on('change', (evt) => {
                scene.children.forEach((child) => {
                    child.rotation = evt.value;
                });
            });
            scaleFolder.addBinding(controls, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
                scene.children.forEach((child) => {
                    child.scaleY = evt.value;
                });
            });

            const styleFolder = pane.addFolder({title: 'Styles', expanded: true});

            styleFolder.addBinding(controls, 'fontSize', {min: 12, max: 50, step: 1}).on('change', (evt) => {
                scene.children.forEach((child) => {
                    child.fontSize = evt.value;
                });
            });
            styleFolder.addBinding(controls, 'padding', {min: 0, max: 32, step: 1}).on('change', (evt) => {
                scene.children.forEach((child) => {
                    child.padding = evt.value;
                });
            });

            Object.keys(OPTIONS).forEach((key) => {
                styleFolder.addBinding(controls, key, {
                    options: OPTIONS[key].reduce((obj, value) => {
                        obj[value] = value;
                        return obj;
                    }, {}),
                }).on('change', (evt) => {
                    scene.children.forEach((child) => {
                        child[key] = evt.value;
                    });
                });
            });

            updateTestData();
        }
    });
};
