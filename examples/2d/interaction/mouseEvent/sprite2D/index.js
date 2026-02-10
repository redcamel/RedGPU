import * as RedGPU from "../../../../../dist/index.js?t=1770699661827";

/**
 * [KO] Sprite2D Mouse Event 예제
 * [EN] Sprite2D Mouse Event example
 *
 * [KO] Sprite2D 객체에서 발생하는 마우스 이벤트를 처리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to handle mouse events on Sprite2D objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        // [KO] 정보 표시용 HTML 요소 생성
        // [EN] Create HTML element for displaying information
        const infoBox = document.createElement('div');
        const updateInfoBoxStyle = () => {
            const isMobile = redGPUContext.detector.isMobile;
            Object.assign(infoBox.style, {
                position: 'absolute',
                bottom: isMobile ? '100px' : '70px',
                left: '12px',
                width: isMobile ? 'calc(100% - 64px)' : 'auto',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: isMobile ? '12px' : '11px',
                lineHeight: '1.6',
                pointerEvents: 'none',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                display: 'none',
                userSelect: 'none',
                zIndex: '100',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            });
        };
        updateInfoBoxStyle();
        document.body.appendChild(infoBox);

        const updateInfo = (eventName, e) => {
            infoBox.style.display = 'block';
            infoBox.innerHTML = `[Event Info]
Object: ${e.target.name || e.target.constructor.name}
Event: ${eventName}
Distance: ${e.distance !== undefined ? e.distance.toFixed(4) : 'N/A'}
World Point: [${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}]
Local Point: [${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}]
Face Index: ${e.faceIndex}
UV: [${e.uv ? e.uv[0].toFixed(3) : 'N/A'}, ${e.uv ? e.uv[1].toFixed(3) : 'N/A'}]`;
        };

        createSampleSprite2D(redGPUContext, scene, updateInfo);

        let centerX = redGPUContext.screenRectObject.width / 2;
        let centerY = redGPUContext.screenRectObject.height / 2;

        /**
         * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the screen size changes.
         */
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            centerX = width / 2;
            centerY = height / 2;
            updateInfoBoxStyle();
        };

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            const radius = 250;
            const numChildren = view.scene.children.length;

            view.scene.children.forEach((sprite2D, index) => {
                const angle = (index / numChildren) * Math.PI * 2;
                const endX = centerX + Math.cos(angle) * radius;
                const endY = centerY + Math.sin(angle) * radius;

                sprite2D.setPosition(
                    sprite2D.x + (endX - sprite2D.x) * 0.3,
                    sprite2D.y + (endY - sprite2D.y) * 0.3
                );
            });
        };
        renderer.start(redGPUContext, render);

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
 * [KO] 샘플 Sprite2D 객체들을 생성하고 이벤트를 등록합니다.
 * [EN] Creates sample Sprite2D objects and registers events.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {function} updateInfo
 */
const createSampleSprite2D = async (redGPUContext, scene, updateInfo) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg');

    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);
        scene.addChild(sprite2D);
        sprite2D.addListener(eventName, (e) => {
            updateInfo(eventName, e);
            // [KO] 머티리얼의 tint 색상을 무작위로 변경
            // [EN] Randomly change the tint color of the material
            sprite2D.material.useTint = true;
            sprite2D.material.tint.r = Math.floor(Math.random() * 255);
            sprite2D.material.tint.g = Math.floor(Math.random() * 255);
            sprite2D.material.tint.b = Math.floor(Math.random() * 255);
        });

        const label = new RedGPU.Display.TextField2D(redGPUContext);
        label.text = `Hello ${eventName} Event!`;
        label.padding = 20;
        label.borderRadius = 16;
        label.background = 'rgba(104,54,54,0.4)';
        label.y = 0;
        sprite2D.addChild(label);
    });
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770699661827');
    const {setDebugButtons} = await import("../../../../exampleHelper/createExample/panes/index.js?t=1770699661827");
    setDebugButtons(RedGPU, redGPUContext);
};