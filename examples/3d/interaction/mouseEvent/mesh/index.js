import * as RedGPU from "../../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1778922031603";
import {createEventInfoBox, updateEventInfoBoxStyle, updateEventInfo} from "../eventInfoBox.js";

/**
 * [KO] Mesh 마우스 이벤트 예제
 * [EN] Mesh mouse event example
 *
 * [KO] Mesh 객체에 설정된 다양한 마우스 이벤트(CLICK, DOWN, MOVE, OVER, OUT 등) 처리 방법을 보여줍니다.
 * [EN] Demonstrates how to handle various mouse events (CLICK, DOWN, MOVE, OVER, OUT, etc.) set on Mesh objects.
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
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 2. UI 요소 (이벤트 정보 표시 박스) 생성
        const infoBox = createEventInfoBox(isMobile);

        // 3. 샘플 메시 생성 및 배치
        const {updateLayout} = createSampleMeshes(redGPUContext, scene, infoBox);

        // 4. 리사이즈 핸들러 설정
        /**
         * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the screen size changes.
         */
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.pixelRectObject;
            const aspect = width / height;
            const isMobile = detector.isMobile;
            const baseDistance = isMobile ? 10 : 9.5;

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
 * [KO] 인터랙션 테스트를 위한 샘플 메시들을 생성합니다.
 * [EN] Creates sample meshes for interaction testing.
 * @param {import("../../../../../dist/index.js").RedGPUContext} redGPUContext
 * @param {import("../../../../../dist/index.js").Scene} scene
 * @param {HTMLElement} infoBox
 * @returns {{meshes: Array<import("../../../../../dist/index.js").Mesh>, updateLayout: Function}}
 */
const createSampleMeshes = (redGPUContext, scene, infoBox) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg');
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const meshes = [];
    const labels = [];

    // 정의된 모든 피킹 이벤트 타입에 대해 메시와 레이블 생성
    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName) => {
        // 머티리얼 설정
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        material.useTint = true;

        // 메시 생성
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.name = `Mesh_${eventName}`;
        scene.addChild(mesh);

        // 이벤트 리스너 등록
        mesh.addListener(eventName, (e) => {
            updateEventInfo(infoBox, eventName, e);

            // 이벤트 발생 시 색상 변경 애니메이션
            TweenMax.to(material.tint, 0.5, {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255),
                roundProps: "r,g,b",
                ease: Power2.easeOut
            });
        });

        // 레이블 생성
        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = eventName;
        label.fontSize = 32;
        label.worldSize = 0.5;
        scene.addChild(label);

        meshes.push(mesh);
        labels.push(label);
    });

    /**
     * [KO] 메시와 레이블의 배치를 업데이트합니다.
     * [EN] Update the layout of meshes and labels.
     */
    const updateLayout = () => {
        const isMobile = redGPUContext.detector.isMobile;
        const radius = isMobile ? 2.5 : 3;
        const labelRadius = radius + 1.5;
        const total = meshes.length;

        meshes.forEach((mesh, index) => {
            const angle = (index / total) * Math.PI * 2;
            mesh.x = Math.cos(angle) * radius;
            mesh.y = Math.sin(angle) * radius;

            const label = labels[index];
            label.x = Math.cos(angle) * labelRadius;
            label.y = Math.sin(angle) * labelRadius;
        });
    };

    updateLayout();
    return {meshes, updateLayout};
};

/**
 * [KO] 예제 도우미 패널을 렌더링합니다.
 * [EN] Renders the example helper panel.
 * @param {import("../../../../../dist/index.js").RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
