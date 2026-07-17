import * as RedGPU from "../../../../dist/index.js?t=1784264851335";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1784264851335";

/**
 * [KO] Cone Primitive 예제
 * [EN] Cone Primitive example
 *
 * [KO] Cone 프리미티브 생성 및 속성을 실시간으로 제어하는 방법을 시연합니다.
 * [EN] Demonstrates creating a Cone primitive and controlling its properties in real-time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정 [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.tilt = -15;
        controller.speedDistance = 0.3;

        // 2. [KO] 씬 및 뷰 구성 [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 프리미티브 생성 및 추가 [EN] Create and Add Primitives
        createPrimitive(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 루프 시작 [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직 [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링 [EN] Render Test GUI
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
 * [KO] 다양한 토폴로지의 Cone 메시와 라벨을 생성합니다.
 * [EN] Creates Cone meshes with various topologies and labels.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createPrimitive = (redGPUContext, scene) => {
    // [KO] 재질 정의 [EN] Define Materials
    const MAT = {
        grid:    new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),
        diffuse: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg')),
        line:    new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point:   new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    // [KO] 공유 지오메트리 생성 [EN] Create Shared Geometry
    const coneGeometry = new RedGPU.Primitive.Cone(redGPUContext, 1, 2, 32, 1, true, 0, Math.PI * 2);

    const GAP = 3.5;
    const MESH_ITEMS = [
        {material: MAT.line,    x: -GAP * 1.5, topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST,  label: 'Line List'},
        {material: MAT.grid,    x: -GAP * 0.5,                                                     label: 'Triangle List<br/>(Grid)'},
        {material: MAT.diffuse, x:  GAP * 0.5,                                                     label: 'Triangle List<br/>(Diffuse)'},
        {material: MAT.point,   x:  GAP * 1.5, topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST, label: 'Point List'},
    ];

    MESH_ITEMS.forEach(({material, x, topology, label}) => {
        // [KO] 메시 생성 및 설정 [EN] Create and configure Mesh
        const mesh = new RedGPU.Display.Mesh(redGPUContext, coneGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(x, 0, 0);
        scene.addChild(mesh);

        // [KO] 3D 라벨 생성 [EN] Create 3D Label
        const text = new RedGPU.Display.TextField3D(redGPUContext);
        text.setPosition(x, 2.2, 0);
        text.text      = label;
        text.color     = '#ffffff';
        text.fontSize  = 32;
        text.worldSize = label.includes('<br/>') ? 1.0 : 0.5;
        scene.addChild(text);
    });

    // [KO] 타이틀 텍스트 추가 [EN] Add Title Text
    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.setPosition(0, -2.5, 0);
    title.text       = 'Customizable Cone Primitive';
    title.color      = '#ffffff';
    title.fontSize   = 96;
    title.fontWeight = 500;
    title.worldSize  = 1.3;
    scene.addChild(title);
};

/**
 * [KO] 실시간 속성 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time property control.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    const config = {
        radius: 1,
        height: 2,
        radialSegments: 32,
        heightSegments: 1,
        capBottom: true,
        thetaStart: 0,
        thetaLength: Math.PI * 2,
        cullMode: RedGPU.GPU_CULL_MODE.BACK,
    };

    const getMeshes = () =>
        redGPUContext.viewList[0].scene.children.filter(
            obj => obj instanceof RedGPU.Display.Mesh && !(obj instanceof RedGPU.Display.TextField3D)
        );

    const updateGeometry = () => {
        const newGeometry = new RedGPU.Primitive.Cone(
            redGPUContext,
            config.radius, config.height,
            config.radialSegments, config.heightSegments,
            config.capBottom,
            config.thetaStart, config.thetaLength
        );
        getMeshes().forEach(mesh => mesh.geometry = newGeometry);
    };

    const updateCullMode = () => {
        getMeshes().forEach(mesh => mesh.primitiveState.cullMode = config.cullMode);
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const geoFolder = pane.addFolder({title: 'Geometry', expanded: true});
            geoFolder.addBinding(config, 'radius', {min: 0, max: 2, step: 0.1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'height', {min: 0.5, max: 5, step: 0.1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'radialSegments', {min: 3, max: 128, step: 1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'heightSegments', {min: 1, max: 64, step: 1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'capBottom').on('change', updateGeometry);
            geoFolder.addBinding(config, 'thetaStart', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'thetaLength', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);

            const matFolder = pane.addFolder({title: 'CullMode', expanded: true});
            matFolder.addBinding(config, 'cullMode', {
                options: {
                    NONE:  RedGPU.GPU_CULL_MODE.NONE,
                    BACK:  RedGPU.GPU_CULL_MODE.BACK,
                    FRONT: RedGPU.GPU_CULL_MODE.FRONT,
                }
            }).on('change', updateCullMode);
        }
    });
};
