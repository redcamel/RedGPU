import * as RedGPU from "../../../../../dist/index.js?t=1783322366074";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1783322366074";
import {createEventInfoBox, updateEventInfoBoxStyle, updateEventInfo} from "../eventInfoBox.js?t=1783322366074";

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
        const {detector} = redGPUContext;
        const isMobile = detector.isMobile;

        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = isMobile ? 12 : 9.5;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 2. UI 요소 (이벤트 정보 표시 박스) 생성
        const infoBox = createEventInfoBox(isMobile);

        // 3. 샘플 SpriteSheet3D 생성 및 배치
        const {updateLayout} = createSampleSprite3D(redGPUContext, scene, infoBox);

        // 4. 리사이즈 핸들러 설정
        /**
         * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the screen size changes.
         */
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.pixelRectObject;
            const aspect = width / height;
            const isMobile = detector.isMobile;
            const baseDistance = isMobile ? 7.5 : 9.5;

            // 화면 비율에 맞춰 카메라 거리 자동 조절
            controller.distance = aspect < 1 ? baseDistance / aspect : baseDistance;

            // UI 스타일 및 배치 업데이트
            updateEventInfoBoxStyle(infoBox, isMobile);
            updateLayout();
        };

        // 초기 리사이즈 실행
        redGPUContext.onResize({
            target: redGPUContext,
            screenRectObject: redGPUContext.screenRectObject,
            pixelRectObject: redGPUContext.pixelRectObject
        });

        // 5. 렌더링 시작
        const renderer = new RedGPU.Renderer();
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
 */
const createSampleSprite3D = (redGPUContext, scene, infoBox) => {
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
            updateEventInfo(infoBox, eventName, e);
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
        label.fontSize = 32;
        label.worldSize = 0.5;
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
    return {sprites, updateLayout};
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = async (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});

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
                    usePixelSizeBinding.disabled = true;
                    pixelSizeBinding.disabled = true;
                    worldSizeBinding.disabled = false;
                } else {
                    usePixelSizeBinding.disabled = false;

                    if (usePixelSize) {
                        pixelSizeBinding.disabled = false;
                        worldSizeBinding.disabled = true;
                    } else {
                        pixelSizeBinding.disabled = true;
                        worldSizeBinding.disabled = false;
                    }
                }
            };

            updateControlsState();
        }
    });
};
