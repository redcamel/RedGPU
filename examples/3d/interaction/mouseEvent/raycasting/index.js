import * as RedGPU from "../../../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] Raycasting (Precision Picking) 예제
 * [EN] Raycasting (Precision Picking) example
 *
 * [KO] 복잡한 지오메트리(TorusKnot 등)를 대상으로 삼각형 단위의 정밀 레이캐스팅 교차 지점(point, localPoint, faceIndex, uv)을 검출하고 시각화합니다.
 * [EN] Detects and visualizes triangle-level precision raycasting intersection data (point, localPoint, faceIndex, uv) on complex geometries.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.tilt = -20;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const ambientLight = new RedGPU.Light.AmbientLight();
        ambientLight.intensity = 0.5;
        scene.lightManager.ambientLight = ambientLight;
        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

        const eventState = {
            type: 'None',
            target: 'None',
            distance: 0,
            faceIndex: -1,
            point: '0.00, 0.00, 0.00',
            localPoint: '0.00, 0.00, 0.00',
            uv: '0.000, 0.000'
        };

        // [KO] 레이캐스팅 교차 지점(e.point)을 표시할 마커 구체 생성
        // [EN] Create a marker sphere to indicate the raycasting intersection point (e.point)
        const marker = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 0.15),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
        );

        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg');
        const primitives = [
            {
                name: 'TorusKnot',
                geom: new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32, 2, 3),
                pos: [-6, 0, 0]
            },
            {name: 'Box', geom: new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3), pos: [0, 0, 0]},
            {name: 'Sphere', geom: new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32), pos: [6, 0, 0]},
            {name: 'Cylinder', geom: new RedGPU.Primitive.Cylinder(redGPUContext, 1.5, 1.5, 4, 32), pos: [-4, 0, -5]},
            {name: 'Torus', geom: new RedGPU.Primitive.Torus(redGPUContext, 2, 0.5, 32, 32), pos: [4, 0, -5], rotX: 90}
        ];

        primitives.forEach((p) => {
            const material = new RedGPU.Material.PhongMaterial(redGPUContext);
            material.diffuseTexture = texture;

            const mesh = new RedGPU.Display.Mesh(redGPUContext, p.geom, material);
            mesh.name = p.name;
            mesh.setPosition(...p.pos);
            if (p.rotX) mesh.rotationX = p.rotX;
            scene.addChild(mesh);

            // [KO] 정밀 레이캐스팅 이벤트(OVER, MOVE, OUT) 등록
            // [EN] Register precision raycasting events (OVER, MOVE, OUT)
            mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.OVER, (e) => {
                e.target.material.color.setColorByHEX('#00ff00');
                scene.addChild(marker);
            });
            mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.MOVE, (e) => {
                marker.setPosition(e.point[0], e.point[1], e.point[2]);
                eventState.type = e.type;
                eventState.target = e.target.name;
                eventState.distance = Number(e.distance.toFixed(3));
                eventState.faceIndex = e.faceIndex;
                eventState.point = `${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}`;
                eventState.localPoint = `${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}`;
                eventState.uv = `${e.uv[0].toFixed(3)}, ${e.uv[1].toFixed(3)}`;
            });
            mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.OUT, (e) => {
                e.target.material.color.setColorByHEX('#ffffff');
                scene.removeChild(marker);
                eventState.type = e.type;
            });
        });

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

const renderTestPane = (redGPUContext, eventState) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Raycasting Hit Info', expanded: true});
            folder.addBinding(eventState, 'type', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'target', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'distance', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'faceIndex', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'point', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'localPoint', {readonly: true, interval: 50});
            folder.addBinding(eventState, 'uv', {readonly: true, interval: 50});
        }
    });
};
