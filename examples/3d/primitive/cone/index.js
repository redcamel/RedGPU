import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Cone Primitive 예제
 * [EN] Cone Primitive example
 *
 * [KO] Cone 지오메트리를 토폴로지·재질별로 비교하고 생성 파라미터를 실시간으로 제어합니다.
 * [EN] Compares Cone geometry across topologies and materials, and controls its parameters in real-time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.tilt = -15;
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

    // [KO] Cone 지오메트리 생성 (radius, height, radialSegments, heightSegments, capBottom, thetaStart, thetaLength)
    // [EN] Create Cone geometry (radius, height, radialSegments, heightSegments, capBottom, thetaStart, thetaLength)
    const geometry = new RedGPU.Primitive.Cone(redGPUContext, 1, 2, 32, 1, true, 0, Math.PI * 2);

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
        {material: createBitmapMaterial('../../../assets/texture/h_test.jpg'), text: 'Triangle List<br/>(Diffuse)'},
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
        label.setPosition(x, 2.2, 0);
        label.text = text;
        label.color = '#ffffff';
        label.fontSize = 32;
        label.worldSize = text.includes('<br/>') ? 1.0 : 0.5;
        scene.addChild(label);

        return mesh;
    });

    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.setPosition(0, -2.5, 0);
    title.text = 'Customizable Cone Primitive';
    title.color = '#ffffff';
    title.fontSize = 96;
    title.fontWeight = 500;
    title.worldSize = 1.3;
    scene.addChild(title);

    return meshes;
};

const renderTestPane = (redGPUContext, meshes) => {
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

    const updateGeometry = () => {
        const geometry = new RedGPU.Primitive.Cone(
            redGPUContext,
            config.radius, config.height,
            config.radialSegments, config.heightSegments,
            config.capBottom,
            config.thetaStart, config.thetaLength
        );
        meshes.forEach((mesh) => mesh.geometry = geometry);
    };

    const updateCullMode = () => {
        meshes.forEach((mesh) => mesh.primitiveState.cullMode = config.cullMode);
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const geometryFolder = pane.addFolder({title: 'Geometry', expanded: true});
            geometryFolder.addBinding(config, 'radius', {min: 0, max: 2, step: 0.1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'height', {min: 0.5, max: 5, step: 0.1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'radialSegments', {
                min: 3,
                max: 128,
                step: 1
            }).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'heightSegments', {
                min: 1,
                max: 64,
                step: 1
            }).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'capBottom').on('change', updateGeometry);
            geometryFolder.addBinding(config, 'thetaStart', {
                min: 0,
                max: Math.PI * 2,
                step: 0.1
            }).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'thetaLength', {
                min: 0,
                max: Math.PI * 2,
                step: 0.1
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
