import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Ground Primitive 예제
 * [EN] Ground Primitive example
 *
 * [KO] Ground 프리미티브 생성 및 모든 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Ground primitive and control all its properties in real-time.
 */

// [KO] 캔버스 생성 및 문서에 추가
// [EN] Create canvas and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 카메라 컨트롤러 생성 (OrbitController)
        // [EN] Create camera controller (OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;
        controller.tilt = -15;
        controller.speedDistance = 0.3;

        // [KO] 씬 및 뷰 생성
        // [EN] Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // [KO] 컨텍스트에 뷰 추가
        // [EN] Add view to context
        redGPUContext.addView(view);

        createPrimitive(redGPUContext, scene);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직 작성
            // [EN] Write logic to be executed every frame
        };
        renderer.start(redGPUContext, render);

        // [KO] 테스트용 GUI 렌더링
        // [EN] Render GUI for testing
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] Ground 메시 4종(Line / Triangle Grid / Triangle Diffuse / Point)과 타이틀 텍스트를 씬에 추가합니다.
 * [EN] Adds 4 Ground meshes (Line / Triangle Grid / Triangle Diffuse / Point) and a title text to the scene.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createPrimitive = (redGPUContext, scene) => {
    // [KO] 재질 생성 (BitmapMaterial 2종, ColorMaterial 2종)
    // [EN] Create materials (2x BitmapMaterial, 2x ColorMaterial)
    const MAT = {
        grid:    new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),
        diffuse: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png')),
        line:    new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point:   new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    // [KO] 공유 Ground 지오메트리 (width=4, height=4, widthSegments=10, heightSegments=10)
    // [EN] Shared Ground geometry (width=4, height=4, widthSegments=10, heightSegments=10)
    const groundGeometry = new RedGPU.Primitive.Ground(redGPUContext, 4, 4, 10, 10);

    // [KO] 표시할 메시 목록 (좌→우 순서)
    // [EN] Mesh list to display (left to right)
    const GAP = 5.5;
    const MESH_ITEMS = [
        {material: MAT.line,    x: -GAP * 1.5, topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST,  label: 'Line List'},
        {material: MAT.grid,    x: -GAP * 0.5,                                                     label: 'Triangle List<br/>(Grid)'},
        {material: MAT.diffuse, x:  GAP * 0.5,                                                     label: 'Triangle List<br/>(Diffuse)'},
        {material: MAT.point,   x:  GAP * 1.5, topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST, label: 'Point List'},
    ];

    // [KO] 메시 및 라벨 생성
    // [EN] Create meshes and labels
    MESH_ITEMS.forEach(({material, x, topology, label}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, groundGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(x, 0, 0);
        scene.addChild(mesh);

        const text = new RedGPU.Display.TextField3D(redGPUContext);
        text.setPosition(x, 3.0, 0);
        text.text      = label;
        text.color     = '#ffffff';
        text.fontSize  = 32;
        text.worldSize = label.includes('<br/>') ? 1.0 : 0.5;
        scene.addChild(text);
    });

    // [KO] 타이틀 텍스트
    // [EN] Title text
    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.setPosition(0, -3.3, 0);
    title.text       = 'Customizable Ground Primitive';
    title.color      = '#ffffff';
    title.fontSize   = 96;
    title.fontWeight = 500;
    title.worldSize  = 1.3;
    scene.addChild(title);
};

/**
 * [KO] 테스트를 위한 GUI 패널을 렌더링합니다.
 * [EN] Renders a GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    // [KO] GUI와 동기화되는 설정값
    // [EN] Config values synced with GUI
    const config = {
        width: 4,
        height: 4,
        widthSegments: 10,
        heightSegments: 10,
        flipY: false,
        cullMode: RedGPU.GPU_CULL_MODE.BACK,
    };

    // [KO] 씬의 Mesh(TextField3D 제외) 목록을 반환하는 헬퍼
    // [EN] Helper that returns Mesh list from scene (excluding TextField3D)
    const getMeshes = () =>
        redGPUContext.viewList[0].scene.children.filter(
            obj => obj instanceof RedGPU.Display.Mesh && !(obj instanceof RedGPU.Display.TextField3D)
        );

    // [KO] 설정값으로 Ground 지오메트리를 재생성하여 모든 메시에 적용
    // [EN] Rebuild Ground geometry from config and apply to all meshes
    const updateGeometry = () => {
        const newGeometry = new RedGPU.Primitive.Ground(
            redGPUContext,
            config.width, config.height,
            config.widthSegments, config.heightSegments, config.flipY
        );
        getMeshes().forEach(mesh => mesh.geometry = newGeometry);
    };

    // [KO] cullMode 변경을 모든 메시에 적용
    // [EN] Apply cullMode change to all meshes
    const updateCullMode = () => {
        getMeshes().forEach(mesh => mesh.primitiveState.cullMode = config.cullMode);
    };

    new RedGPUExampleHelper(redGPUContext, {
        guiCallback: (pane) => {
            // [KO] 지오메트리 속성 (크기 / 세그먼트)
            // [EN] Geometry properties (size / segments)
            const geoFolder = pane.addFolder({title: 'Geometry', expanded: true});
            geoFolder.addBinding(config, 'width', {min: 1, max: 10, step: 1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'height', {min: 1, max: 10, step: 1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'widthSegments', {min: 1, max: 64, step: 1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'heightSegments', {min: 1, max: 64, step: 1}).on('change', updateGeometry);
            geoFolder.addBinding(config, 'flipY').on('change', updateGeometry);

            // [KO] 프리미티브 상태 (Face Culling)
            // [EN] Primitive state (Face Culling)
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
