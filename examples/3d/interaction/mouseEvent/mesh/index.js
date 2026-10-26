import * as RedGPU from "../../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Mesh Mouse Event 예제
 * [EN] Mesh Mouse Event example
 *
 * [KO] Mesh 객체에서 발생하는 마우스 피킹 이벤트(MOVE, DOWN, UP, OVER, OUT, CLICK) 처리 방법을 시연합니다.
 * [EN] Demonstrates how to handle mouse picking events (MOVE, DOWN, UP, OVER, OUT, CLICK) on Mesh objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const eventState = {
            type: 'None',
            target: 'None',
            pickingId: 0,
            mouseX: 0,
            mouseY: 0,
            distance: 0,
            faceIndex: -1,
            point: '0.00, 0.00, 0.00',
            localPoint: '0.00, 0.00, 0.00',
            uv: '0.000, 0.000'
        };

        createSampleMeshes(redGPUContext, scene, eventState);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, eventState);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleMeshes = (redGPUContext, scene, eventState) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg');
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const eventTypes = Object.values(RedGPU.Picking.PICKING_EVENT_TYPE);
    const radius = 3;
    const labelRadius = 4.3;

    // [KO] 모든 피킹 이벤트 타입별로 Mesh 생성 및 리스너 등록
    // [EN] Create a Mesh and register a listener for each picking event type
    eventTypes.forEach((eventName, index) => {
        const angle = (index / eventTypes.length) * Math.PI * 2;
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        material.useTint = true;

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.name = `Mesh_${eventName}`;
        mesh.x = Math.cos(angle) * radius;
        mesh.y = Math.sin(angle) * radius;
        scene.addChild(mesh);

        mesh.addListener(eventName, (e) => {
            material.tint.setColorByRGB(
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)
            );
            eventState.type = e.type;
            eventState.target = e.target.name;
            eventState.pickingId = e.pickingId;
            eventState.mouseX = Math.round(e.mouseX);
            eventState.mouseY = Math.round(e.mouseY);
            eventState.distance = Number(e.distance.toFixed(3));
            eventState.faceIndex = e.faceIndex;
            eventState.point = `${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}`;
            eventState.localPoint = `${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}`;
            eventState.uv = `${e.uv[0].toFixed(3)}, ${e.uv[1].toFixed(3)}`;
        });

        const label = new RedGPU.Display.TextField3D(redGPUContext, eventName);
        label.x = Math.cos(angle) * labelRadius;
        label.y = Math.sin(angle) * labelRadius;
        label.worldSize = 0.5;
        scene.addChild(label);
    });
};

const renderTestPane = (redGPUContext, eventState) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PickingEvent', expanded: true});
            folder.addBinding(eventState, 'type', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'target', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'pickingId', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'mouseX', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'mouseY', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'distance', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'faceIndex', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'point', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'localPoint', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'uv', {readonly: true, interval: 50});
        }
    });
};
