import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] RoundedBox Primitive 예제
 * [EN] RoundedBox Primitive example
 *
 * [KO] RoundedBox 지오메트리를 토폴로지·재질별로 비교하고 생성 파라미터를 실시간으로 제어합니다.
 * [EN] Compares RoundedBox geometry across topologies and materials, and controls its parameters in real-time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
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

    // [KO] RoundedBox 지오메트리 생성 (width, height, depth, widthSegments, heightSegments, depthSegments, radius, radiusSegments)
    // [EN] Create RoundedBox geometry (width, height, depth, widthSegments, heightSegments, depthSegments, radius, radiusSegments)
    const geometry = new RedGPU.Primitive.RoundedBox(redGPUContext, 2, 2, 2, 1, 1, 1, 0.5, 8);

    // [KO] 하나의 지오메트리를 공유하며 토폴로지(LINE_LIST / TRIANGLE_LIST / POINT_LIST)별로 비교 배치
    // [EN] Share one geometry and compare across topologies (LINE_LIST / TRIANGLE_LIST / POINT_LIST)
    const GAP = 3.5;
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
        label.setPosition(x, 2.0, 0);
        label.text = text;
        label.color = '#ffffff';
        label.fontSize = 32;
        label.worldSize = text.includes('<br/>') ? 1.0 : 0.5;
        scene.addChild(label);

        return mesh;
    });

    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.setPosition(0, -2.5, 0);
    title.text = 'Customizable RoundedBox Primitive';
    title.color = '#ffffff';
    title.fontSize = 96;
    title.fontWeight = 500;
    title.worldSize = 1.3;
    scene.addChild(title);

    return meshes;
};

const renderTestPane = (redGPUContext, meshes) => {
    const config = {
        width: 2, height: 2, depth: 2,
        widthSegments: 1, heightSegments: 1, depthSegments: 1,
        radius: 0.5,
        radiusSegments: 8,
        cullMode: RedGPU.GPU_CULL_MODE.BACK,
    };

    const updateGeometry = () => {
        const geometry = new RedGPU.Primitive.RoundedBox(
            redGPUContext,
            config.width, config.height, config.depth,
            config.widthSegments, config.heightSegments, config.depthSegments,
            config.radius, config.radiusSegments
        );
        meshes.forEach((mesh) => mesh.geometry = geometry);
    };

    const updateCullMode = () => {
        meshes.forEach((mesh) => mesh.primitiveState.cullMode = config.cullMode);
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const geometryFolder = pane.addFolder({title: 'Geometry', expanded: true});
            geometryFolder.addBinding(config, 'width', {min: 0.1, max: 5, step: 0.1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'height', {min: 0.1, max: 5, step: 0.1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'depth', {min: 0.1, max: 5, step: 0.1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'widthSegments', {min: 1, max: 15, step: 1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'heightSegments', {
                min: 1,
                max: 15,
                step: 1
            }).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'depthSegments', {min: 1, max: 15, step: 1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'radius', {min: 0, max: 2.5, step: 0.01}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'radiusSegments', {
                min: 1,
                max: 32,
                step: 1
            }).on('change', updateGeometry);

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
