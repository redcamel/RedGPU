import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] Plane Primitive 예제
 * [EN] Plane Primitive example
 *
 * [KO] XY 평면 기반 Plane 지오메트리를 토폴로지·재질별로 비교하고 생성 파라미터를 실시간으로 제어합니다.
 * [EN] Compares XY-plane based Plane geometry across topologies and materials, and controls its parameters in real-time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const meshes = createPrimitive(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, meshes);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPrimitive = (redGPUContext, scene) => {
    const createBitmapMaterial = (src) => new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, src));

    // [KO] Plane 지오메트리 생성 (width, height, widthSegments, heightSegments)
    // [EN] Create Plane geometry (width, height, widthSegments, heightSegments)
    const geometry = new RedGPU.Primitive.Plane(redGPUContext, 4, 4, 10, 10);

    // [KO] 하나의 지오메트리를 공유하며 토폴로지(LINE_LIST / TRIANGLE_LIST / POINT_LIST)별로 비교 배치
    // [EN] Share one geometry and compare across topologies (LINE_LIST / TRIANGLE_LIST / POINT_LIST)
    const GAP = 5.5;
    const items = [
        {
            material: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
            topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST,
            text: 'Line List'
        },
        {material: createBitmapMaterial('../../../assets/UV_Grid_Sm.jpg'), text: 'Triangle List<br/>(Grid)'},
        {material: createBitmapMaterial('../../../assets/texture/crate.png'), text: 'Triangle List<br/>(Diffuse)'},
        {
            material: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
            topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST,
            text: 'Point List'
        },
    ];

    const meshes = items.map(({material, topology, text}, index) => {
        const x = GAP * (index - 1.5);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(x, 0, 0);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(x, 3.0, 0);
        label.text = text;
        label.color = '#ffffff';
        label.fontSize = 32;
        label.worldSize = text.includes('<br/>') ? 1.0 : 0.5;
        scene.addChild(label);

        return mesh;
    });

    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.setPosition(0, -3.3, 0);
    title.text = 'Customizable Plane Primitive';
    title.color = '#ffffff';
    title.fontSize = 96;
    title.fontWeight = 500;
    title.worldSize = 1.3;
    scene.addChild(title);

    return meshes;
};

const renderTestPane = (redGPUContext, meshes) => {
    const config = {
        width: 4,
        height: 4,
        widthSegments: 10,
        heightSegments: 10,
        flipY: false,
        cullMode: RedGPU.GPU_CULL_MODE.BACK,
    };

    const updateGeometry = () => {
        const geometry = new RedGPU.Primitive.Plane(
            redGPUContext,
            config.width, config.height,
            config.widthSegments, config.heightSegments, config.flipY
        );
        meshes.forEach((mesh) => mesh.geometry = geometry);
    };

    const updateCullMode = () => {
        meshes.forEach((mesh) => mesh.primitiveState.cullMode = config.cullMode);
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const geometryFolder = pane.addFolder({title: 'Geometry', expanded: true});
            geometryFolder.addBinding(config, 'width', {min: 1, max: 10, step: 1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'height', {min: 1, max: 10, step: 1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'widthSegments', {min: 1, max: 64, step: 1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'heightSegments', {
                min: 1,
                max: 64,
                step: 1
            }).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'flipY').on('change', updateGeometry);

            const primitiveStateFolder = pane.addFolder({title: 'PrimitiveState', expanded: true});
            primitiveStateFolder.addBinding(config, 'cullMode', {
                options: {
                    NONE: RedGPU.GPU_CULL_MODE.NONE,
                    BACK: RedGPU.GPU_CULL_MODE.BACK,
                    FRONT: RedGPU.GPU_CULL_MODE.FRONT,
                }
            }).on('change', updateCullMode);
        }
    });
};
