import * as RedGPU from "../../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1778922031603";
import {createEventInfoBox, updateEventInfoBoxStyle, updateEventInfo} from "../eventInfoBox.js";

/**
 * [KO] Raycasting 예제
 * [EN] Raycasting example
 *
 * [KO] 레이캐스팅을 사용하여 3D 객체와의 상호작용을 감지하는 방법을 보여줍니다.
 * [EN] Demonstrates how to detect interaction with 3D objects using raycasting.
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
        controller.distance = 15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 2. 조명 설정
        const ambientLight = new RedGPU.Light.AmbientLight();
        ambientLight.lux = 1000;
        scene.lightManager.ambientLight = ambientLight;
        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

        // 3. UI 요소 (이벤트 정보 표시 박스) 생성
        const infoBox = createEventInfoBox(isMobile);

        // 공통 재질 및 마커 생성
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg');
        const createMaterial = () => {
            const material = new RedGPU.Material.PhongMaterial(redGPUContext);
            material.diffuseTexture = texture;
            return material;
        };

        const marker = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 0.15),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
        );

        /**
         * [KO] 메시의 마우스 이벤트를 설정합니다.
         * [EN] Sets up mouse events for a mesh.
         */
        const setupEvents = (mesh) => {
            mesh.addListener('over', (e) => {
                e.target.material.color.setColorByHEX('#00ff00');
                scene.addChild(marker);
                infoBox.style.display = 'block';
            });
            mesh.addListener('move', (e) => {
                marker.setPosition(e.point[0], e.point[1], e.point[2]);
                updateEventInfo(infoBox, 'move', e);
            });
            mesh.addListener('out', (e) => {
                e.target.material.color.setColorByHEX('#ffffff');
                scene.removeChild(marker);
                infoBox.style.display = 'none';
            });
        };

        // 4. 객체 생성 및 이벤트 등록
        const primitives = [
            {
                name: 'TorusKnot',
                geom: new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32, 2, 3),
                pos: [-6, 0, 0],
                h: 2.8
            },
            {name: 'Box', geom: new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3), pos: [0, 0, 0], h: 3.0},
            {name: 'Sphere', geom: new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32), pos: [6, 0, 0], h: 4.0},
            {
                name: 'Cylinder',
                geom: new RedGPU.Primitive.Cylinder(redGPUContext, 1.5, 1.5, 4, 32),
                pos: [-4, 0, -5],
                h: 4.0
            },
            {name: 'Torus', geom: new RedGPU.Primitive.Torus(redGPUContext, 2, 0.5, 32, 32), pos: [4, 0, -5], rot: [90, 0, 0], h: 1.0}
        ];

        primitives.forEach(p => {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, p.geom, createMaterial());
            mesh.name = p.name;
            mesh.setPosition(...p.pos);
            if (p.rot) [mesh.rotationX, mesh.rotationY, mesh.rotationZ] = p.rot;
            scene.addChild(mesh);
            setupEvents(mesh);
        });

        // 5. 리사이즈 핸들러 설정
        /**
         * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the screen size changes.
         */
        redGPUContext.onResize = (resizeEvent) => {
            const isMobile = detector.isMobile;
            updateEventInfoBoxStyle(infoBox, isMobile);
        };

        // 6. 렌더링 시작
        new RedGPU.Renderer().start(redGPUContext);
        renderTestPane(redGPUContext);
    },
    (failReason) => console.error(failReason)
);

/**
 * [KO] 테스트를 위한 Tweakpane GUI를 초기화합니다.
 * [EN] Initializes the Tweakpane GUI for testing.
 */
const renderTestPane = async (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            pane.addBlade({
                view: 'text',
                label: 'Guide',
                value: 'Hover over objects to see raycasting in action!',
                parse: (v) => v,
                readonly: true
            });
        }
    });
};
