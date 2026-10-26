import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] Cylinder Primitive 예제
 * [EN] Cylinder Primitive example
 *
 * [KO] Cylinder 지오메트리를 토폴로지별로 비교하고, 캡(cap)의 평면(Grid)·방사형(Radial) UV 매핑 차이 및 생성 파라미터를 실시간으로 제어합니다.
 * [EN] Compares Cylinder geometry across topologies, showing planar (Grid) vs radial cap UV mapping, and controls its parameters in real-time.
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

        const meshEntries = createPrimitive(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, meshEntries);
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

    // [KO] Cylinder 지오메트리 생성 (radiusTop, radiusBottom, height, radialSegments, heightSegments, capTop, capBottom, thetaStart, thetaLength, isRadialTop, isRadialBottom)
    // [EN] Create Cylinder geometry (radiusTop, radiusBottom, height, radialSegments, heightSegments, capTop, capBottom, thetaStart, thetaLength, isRadialTop, isRadialBottom)
    const geometry = new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 1, 32, 8, true, true, 0, Math.PI * 2, false, false);
    const radialGeometry = new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 1, 32, 8, true, true, 0, Math.PI * 2, true, true);

    // [KO] 토폴로지(LINE_LIST / TRIANGLE_LIST / POINT_LIST) 및 캡의 평면·방사형 UV 매핑별 비교 배치
    // [EN] Compare across topologies (LINE_LIST / TRIANGLE_LIST / POINT_LIST) and planar vs radial cap UV mapping
    const GAP = 3.5;
    const items = [
        {
            material: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
            topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST,
            text: 'Line List<br/>(Planar)',
            isRadial: false
        },
        {
            material: createBitmapMaterial('../../../assets/UV_Grid_Sm.jpg'),
            text: 'Triangle List<br/>(Grid)',
            isRadial: false
        },
        {
            material: createBitmapMaterial('../../../assets/texture/h_test.jpg'),
            text: 'Triangle List<br/>(Radial)',
            isRadial: true
        },
        {
            material: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
            topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST,
            text: 'Point List',
            isRadial: false
        },
    ];

    const meshEntries = items.map(({material, topology, text, isRadial}, index) => {
        const x = GAP * (index - 1.5);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, isRadial ? radialGeometry : geometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(x, 0, 0);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(x, 1.8, 0);
        label.text = text;
        label.color = '#ffffff';
        label.fontSize = 32;
        label.worldSize = text.includes('<br/>') ? 1.0 : 0.5;
        scene.addChild(label);

        return {mesh, isRadial};
    });

    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.setPosition(0, -2.3, 0);
    title.text = 'Customizable Cylinder Primitive';
    title.color = '#ffffff';
    title.fontSize = 96;
    title.fontWeight = 500;
    title.worldSize = 1.3;
    scene.addChild(title);

    return meshEntries;
};

const renderTestPane = (redGPUContext, meshEntries) => {
    const config = {
        radiusTop: 1,
        radiusBottom: 1,
        height: 1,
        radialSegments: 32,
        heightSegments: 8,
        capTop: true,
        capBottom: true,
        cullMode: RedGPU.GPU_CULL_MODE.BACK,
    };

    const updateGeometry = () => {
        const createGeometry = (isRadial) => new RedGPU.Primitive.Cylinder(
            redGPUContext,
            config.radiusTop, config.radiusBottom, config.height,
            config.radialSegments, config.heightSegments,
            config.capTop, config.capBottom,
            0, Math.PI * 2,
            isRadial, isRadial
        );
        const geometry = createGeometry(false);
        const radialGeometry = createGeometry(true);
        meshEntries.forEach(({mesh, isRadial}) => mesh.geometry = isRadial ? radialGeometry : geometry);
    };

    const updateCullMode = () => {
        meshEntries.forEach(({mesh}) => mesh.primitiveState.cullMode = config.cullMode);
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const geometryFolder = pane.addFolder({title: 'Geometry', expanded: true});
            geometryFolder.addBinding(config, 'radiusTop', {min: 0, max: 2, step: 0.1}).on('change', updateGeometry);
            geometryFolder.addBinding(config, 'radiusBottom', {min: 0, max: 2, step: 0.1}).on('change', updateGeometry);
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
            geometryFolder.addBinding(config, 'capTop').on('change', updateGeometry);
            geometryFolder.addBinding(config, 'capBottom').on('change', updateGeometry);

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
