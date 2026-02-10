import * as RedGPU from "../../../../../dist/index.js?t=1770697269592";

/**
 * [KO] SpriteSheet3D Mouse Event 예제
 * [EN] SpriteSheet3D Mouse Event example
 *
 * [KO] SpriteSheet3D 객체에서 발생하는 마우스 이벤트를 처리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to handle mouse events on SpriteSheet3D objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const isMobile = redGPUContext.detector.isMobile;
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = isMobile ? 12 : 9.5;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
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
Object: ${e.target.name || 'SpriteSheet3D'}
Event: ${eventName}
Distance: ${e.distance ? e.distance.toFixed(4) : 'N/A'}
World Point: [${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}]
Local Point: [${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}]
Face Index: ${e.faceIndex}
UV: [${e.uv ? e.uv[0].toFixed(3) : 'N/A'}, ${e.uv ? e.uv[1].toFixed(3) : 'N/A'}]`;
        };

        const { updateLayout } = createSampleSprite3D(redGPUContext, scene, infoBox, updateInfo);

        redGPUContext.onResize = (resizeEvent) => {
            const { width, height } = resizeEvent.pixelRectObject;
            const aspect = width / height;
            const isMobile = redGPUContext.detector.isMobile;
            const baseDistance = isMobile ? 7.5 : 9.5;
            controller.distance = aspect < 1 ? baseDistance / aspect : baseDistance;
            updateInfoBoxStyle();
            updateLayout();
        };
        redGPUContext.onResize({
            target: redGPUContext,
            screenRectObject: redGPUContext.screenRectObject,
            pixelRectObject: redGPUContext.pixelRectObject
        });

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

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
 * [KO] 샘플 SpriteSheet3D를 생성합니다.
 * [EN] Creates sample SpriteSheet3D.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {HTMLElement} infoBox
 * @param {function} updateInfo
 * @returns {{sprites: Array<RedGPU.Display.SpriteSheet3D>, updateLayout: function}}
 */
const createSampleSprite3D = (redGPUContext, scene, infoBox, updateInfo) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const sprites = [];
    const labels = [];

    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        
        // [KO] SpriteSheet3D는 내부에서 자동 생성된 머티리얼을 사용합니다.
        // [EN] SpriteSheet3D uses an internally auto-generated material.
        const material = spriteSheet.material;
        material.useTint = true;

        spriteSheet.name = `SpriteSheet3D_${eventName}`;
        spriteSheet.primitiveState.cullMode = 'none';
        spriteSheet.worldSize = 1.0;

        scene.addChild(spriteSheet);
        spriteSheet.addListener(eventName, (e) => {
            updateInfo(eventName, e);
            // [KO] 인스턴스의 실제 머티리얼 틴트를 애니메이션합니다.
            // [EN] Animate the actual material tint of the instance.
            TweenMax.to(material.tint, 0.5, {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255),
                roundProps: "r,g,b",
                ease: Power2.easeOut
            });
        });

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = eventName;
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);

        sprites.push(spriteSheet);
        labels.push(label);
    });

    const updateLayout = () => {
        const isMobile = redGPUContext.detector.isMobile;
        const radius = isMobile ? 2.5 : 3;
        const labelRadius = radius + 1.25;
        const total = sprites.length;
        sprites.forEach((sprite, index) => {
            const angle = (index / total) * Math.PI * 2;
            sprite.x = Math.cos(angle) * radius;
            sprite.y = Math.sin(angle) * radius;

            const label = labels[index];
            label.x = Math.cos(angle) * labelRadius;
            label.y = Math.sin(angle) * labelRadius;
        });
    };

    updateLayout();
    return { sprites, updateLayout };
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const renderTestPane = async (redGPUContext, scene) => {
    const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
    const pane = new Pane();
    const { setDebugButtons } = await import("../../../../exampleHelper/createExample/panes/index.js?t=1770697269592");
    setDebugButtons(RedGPU, redGPUContext);
    const folder = pane.addFolder({ title: 'SpriteSheet3D', expanded: true });
    
    const child = scene.children.find(c => c instanceof RedGPU.Display.SpriteSheet3D);
    const controls = {
        useBillboard: child.useBillboard,
        usePixelSize: child.usePixelSize,
        pixelSize: child.pixelSize,
        worldSize: child.worldSize,
    };

    const useBillboardBinding = folder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.useBillboard = evt.value;
        });
        updateControlsState();
    });

    const usePixelSizeBinding = folder.addBinding(controls, 'usePixelSize').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.usePixelSize = evt.value;
        });
        updateControlsState();
    });

    const pixelSizeBinding = folder.addBinding(controls, 'pixelSize', {min: 1, max: 256, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.pixelSize = evt.value;
        });
    });

    const worldSizeBinding = folder.addBinding(controls, 'worldSize', {min: 0.01, max: 5, step: 0.01}).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.worldSize = evt.value;
        });
    });

    const updateControlsState = () => {
        const {useBillboard, usePixelSize} = controls;

        if (!useBillboard) {
            usePixelSizeBinding.element.style.opacity = 0.25;
            usePixelSizeBinding.element.style.pointerEvents = 'none';
            pixelSizeBinding.element.style.opacity = 0.25;
            pixelSizeBinding.element.style.pointerEvents = 'none';
            worldSizeBinding.element.style.opacity = 1;
            worldSizeBinding.element.style.pointerEvents = 'painted';
        } else {
            usePixelSizeBinding.element.style.opacity = 1;
            usePixelSizeBinding.element.style.pointerEvents = 'painted';

            if (usePixelSize) {
                pixelSizeBinding.element.style.opacity = 1;
                pixelSizeBinding.element.style.pointerEvents = 'painted';
                worldSizeBinding.element.style.opacity = 0.25;
                worldSizeBinding.element.style.pointerEvents = 'none';
            } else {
                pixelSizeBinding.element.style.opacity = 0.25;
                pixelSizeBinding.element.style.pointerEvents = 'none';
                worldSizeBinding.element.style.opacity = 1;
                worldSizeBinding.element.style.pointerEvents = 'painted';
            }
        }
    };

    updateControlsState();
};
