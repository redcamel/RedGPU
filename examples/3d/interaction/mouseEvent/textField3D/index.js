import * as RedGPU from "../../../../../dist/index.js?t=1781131404967";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781131404967";
import {createEventInfoBox, updateEventInfoBoxStyle, updateEventInfo} from "../eventInfoBox.js?t=1781131404967";

/**
 * [KO] TextField3D Mouse Event 예제
 * [EN] TextField3D Mouse Event example
 *
 * [KO] TextField3D 객체에서 발생하는 마우스 이벤트를 처리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to handle mouse events on TextField3D objects.
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
        controller.tilt = -15;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 2. UI 요소 (이벤트 정보 표시 박스) 생성
        const infoBox = createEventInfoBox(isMobile);

        // 3. 샘플 TextField3D 생성 및 배치
        const {updateLayout} = createSampleTextField3D(redGPUContext, scene, infoBox);

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
 * [KO] 테스트용 TextField3D 객체들을 생성합니다.
 * [EN] Creates TextField3D objects for testing.
 */
const createSampleTextField3D = (redGPUContext, scene, infoBox) => {
    const textFields = [];

    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const textField = new RedGPU.Display.TextField3D(redGPUContext);
        textField.name = `TextField_${eventName}`;
        textField.text = eventName; // [KO] 텍스트 자체에 이벤트 명 표시 [EN] Set event name directly on text
        textField.background = 'blue';
        textField.color = 'white';
        textField.fontSize = 32;
        textField.padding = 10;
        textField.borderRadius = 10;
        textField.primitiveState.cullMode = 'none';
        textField.worldSize = 0.5;

        scene.addChild(textField);
        textField.addListener(eventName, (e) => {
            updateEventInfo(infoBox, eventName, e);
            e.target.background = getRandomHexValue();
        });

        textFields.push(textField);
    });

    const updateLayout = () => {
        const isMobile = redGPUContext.detector.isMobile;
        const radius = isMobile ? 2.5 : 3;
        const total = textFields.length;
        textFields.forEach((textField, index) => {
            const angle = (index / total) * Math.PI * 2;
            textField.x = Math.cos(angle) * radius;
            textField.y = Math.sin(angle) * radius;
        });
    };

    updateLayout();
    return {textFields, updateLayout};
};

/**
 * [KO] 무작위 16진수 색상 값을 반환합니다.
 * [EN] Returns a random hex color value.
 */
function getRandomHexValue() {
    var result = '';
    var characters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
        result += characters[Math.floor(Math.random() * 16)];
    }
    return `#${result}`;
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = async (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const child = scene.children.find(c => c instanceof RedGPU.Display.TextField3D);
            const controls = {
                useBillboard: child.useBillboard,
                usePixelSize: child.usePixelSize,
                fontSize: child.fontSize,
                worldSize: child.worldSize,
            };

            const TextField3DFolder = pane.addFolder({title: 'TextField3D', expanded: true});

            const useBillboardBinding = TextField3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
                scene.children.forEach((child) => {
                    if (child instanceof RedGPU.Display.TextField3D) child.useBillboard = evt.value;
                });
                updateControlsState();
            });

            const usePixelSizeBinding = TextField3DFolder.addBinding(controls, 'usePixelSize').on('change', (evt) => {
                scene.children.forEach((child) => {
                    if (child instanceof RedGPU.Display.TextField3D) child.usePixelSize = evt.value;
                });
                updateControlsState();
            });

            const fontSizeBinding = TextField3DFolder.addBinding(controls, 'fontSize', {
                min: 12,
                max: 128,
                step: 1
            }).on('change', (evt) => {
                scene.children.forEach((child) => {
                    if (child instanceof RedGPU.Display.TextField3D) child.fontSize = evt.value;
                });
            });

            const worldSizeBinding = TextField3DFolder.addBinding(controls, 'worldSize', {
                min: 0.01,
                max: 5,
                step: 0.01
            }).on('change', (evt) => {
                scene.children.forEach((child) => {
                    if (child instanceof RedGPU.Display.TextField3D) child.worldSize = evt.value;
                });
            });

            const updateControlsState = () => {
                const {useBillboard, usePixelSize} = controls;

                if (!useBillboard) {
                    usePixelSizeBinding.disabled = true;
                    fontSizeBinding.disabled = true;
                    worldSizeBinding.disabled = false;
                } else {
                    usePixelSizeBinding.disabled = false;

                    if (usePixelSize) {
                        fontSizeBinding.disabled = false;
                        worldSizeBinding.disabled = true;
                    } else {
                        fontSizeBinding.disabled = true;
                        worldSizeBinding.disabled = false;
                    }
                }
            };

            updateControlsState();
        }
    });
};
