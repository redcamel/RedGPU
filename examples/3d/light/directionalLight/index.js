import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] DirectionalLight 예제 (Lighting Studio)
 * [EN] DirectionalLight Example (Lighting Studio)
 *
 * [KO] 태양광과 같은 평행광인 DirectionalLight의 기본 사용법과 실시간 제어 기능을 시연합니다.
 * [EN] Demonstrates the basic usage and real-time control of DirectionalLight, which acts as a parallel light source like sunlight.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 35;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 디렉셔널 라이트 및 스튜디오 환경 구성
        // [EN] Configure DirectionalLight and studio environment
        const light = createDirectionalLight(scene);
        createStudioEnvironment(redGPUContext, scene);
        createMaterialStudio(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, light);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createDirectionalLight = (scene) => {
    const direction = [-1, -1, -1];
    const light = new RedGPU.Light.DirectionalLight(direction, '#ffffff');
    light.enableDebugger = true;
    scene.lightManager.addDirectionalLight(light);
    return light;
};

const createStudioEnvironment = (redGPUContext, scene) => {
    const studioMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    studioMaterial.baseColorFactor = [0.5, 0.5, 0.5, 1.0];
    studioMaterial.roughnessFactor = 0.5;

    const floorGeo = new RedGPU.Primitive.Plane(redGPUContext, 100, 100);
    const floor = new RedGPU.Display.Mesh(redGPUContext, floorGeo, studioMaterial);
    floor.rotationX = -90;
    floor.y = -6;
    scene.addChild(floor);

    const wallGeo = new RedGPU.Primitive.Plane(redGPUContext, 100, 60);
    const wall = new RedGPU.Display.Mesh(redGPUContext, wallGeo, studioMaterial);
    wall.z = -25;
    wall.y = 24;
    scene.addChild(wall);
};

const createMaterialStudio = (redGPUContext, scene) => {
    // [KO] 금속성(Metallic)과 거칠기(Roughness) 변화를 비교하기 위한 구체 그리드 배치
    // [EN] Arrange sphere grid to compare variations in Metallic and Roughness
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2.5, 32, 32, 32);
    const rows = 2;
    const cols = 5;
    const spacing = 8;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const metallic = row === 1 ? 1.0 : 0.0;
            const roughness = col / (cols - 1);

            const material = new RedGPU.Material.PBRMaterial(redGPUContext);
            material.baseColorFactor = metallic === 1.0 ? [1.0, 1.0, 1.0, 1.0] : [1.0, 0.0, 0.0, 1.0];
            material.metallicFactor = metallic;
            material.roughnessFactor = roughness;

            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            const x = col * spacing - ((cols - 1) * spacing) / 2;
            const y = row * spacing - ((rows - 1) * spacing) / 2;

            mesh.setPosition(x, y + 2, 0);
            scene.addChild(mesh);
        }
    }
};

const renderTestPane = (redGPUContext, light) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lightConfig = {
                color: {r: light.color.r, g: light.color.g, b: light.color.b}
            };

            const lightFolder = pane.addFolder({title: 'DirectionalLight Control', expanded: true});

            lightFolder.addBinding(lightConfig, 'color', {picker: 'inline', view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            lightFolder.addBinding(light, 'lux', {min: 0, max: 200000, step: 100});
            lightFolder.addBinding(light, 'enableDebugger');

            const sphericalFolder = lightFolder.addFolder({title: 'Spherical Direction (Sun)', expanded: true});
            sphericalFolder.addBinding(light, 'elevation', {
                min: -90,
                max: 90,
                step: 0.1
            }).on('change', () => pane.refresh());
            sphericalFolder.addBinding(light, 'azimuth', {
                min: -180,
                max: 180,
                step: 0.1
            }).on('change', () => pane.refresh());

            const dirFolder = lightFolder.addFolder({title: 'Cartesian Direction', expanded: true});
            dirFolder.addBinding(light, 'directionX', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionY', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionZ', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
        }
    });
};
