import * as RedGPU from "../../../../dist/index.js?t=1783324948992";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783324948992";

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
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 35;
        controller.speedDistance = 0.5;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 라이트 및 환경 구성
        // [EN] Configure Light and Environment
        
        // [KO] 디렉셔널 라이트 생성
        // [EN] Create Directional Light
        const light = createDirectionalLight(scene);
        
        // [KO] 스튜디오 환경 및 재질 구 배치
        // [EN] Arrange studio environment and material spheres
        createStudioEnvironment(redGPUContext, scene);
        createMaterialStudio(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, light);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 디렉셔널 라이트를 생성하고 씬에 추가합니다.
 * [EN] Creates a directional light and adds it to the scene.
 */
const createDirectionalLight = (scene) => {
    const direction = [-1, -1, -1];
    const light = new RedGPU.Light.DirectionalLight(direction, '#ffffff');
    light.enableDebugger = true;
    scene.lightManager.addDirectionalLight(light);
    return light;
};

/**
 * [KO] 바닥과 벽으로 구성된 스튜디오 배경을 생성합니다.
 * [EN] Creates a studio background consisting of a floor and a wall.
 */
const createStudioEnvironment = (redGPUContext, scene) => {
    const studioMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    studioMaterial.baseColorFactor = [0.5, 0.5, 0.5, 1.0];
    studioMaterial.roughnessFactor = 0.5;

    // [KO] 바닥 (Floor)
    // [EN] Floor
    const floorGeo = new RedGPU.Primitive.Plane(redGPUContext, 100, 100);
    const floor = new RedGPU.Display.Mesh(redGPUContext, floorGeo, studioMaterial);
    floor.rotationX = -90;
    floor.y = -6;
    scene.addChild(floor);

    // [KO] 뒷벽 (Back Wall)
    // [EN] Back Wall
    const wallGeo = new RedGPU.Primitive.Plane(redGPUContext, 100, 60);
    const wall = new RedGPU.Display.Mesh(redGPUContext, wallGeo, studioMaterial);
    wall.z = -25;
    wall.y = 24;
    scene.addChild(wall);
};

/**
 * [KO] 금속성(Metallic)과 거칠기(Roughness) 변화를 시각화하는 구체들을 배치합니다.
 * [EN] Arranges spheres to visualize variations in Metallic and Roughness.
 */
const createMaterialStudio = (redGPUContext, scene) => {
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

/**
 * [KO] 라이트 속성을 실시간으로 제어하기 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time light property control.
 */
const renderTestPane = (redGPUContext, light) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const lightConfig = {
                color: {r: light.color.r, g: light.color.g, b: light.color.b}
            };

            const lightFolder = pane.addFolder({title: 'DirectionalLight Control', expanded: true});
            
            // [KO] 색상 제어
            // [EN] Color Control
            const colorFolder = lightFolder.addFolder({title: 'Light Color', expanded: true});
            colorFolder.addBinding(lightConfig, 'color', {picker: 'inline', view: 'color'}).on('change', (evt) => {
                const {r, g, b} = evt.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            // [KO] 조도 제어 (Lux)
            // [EN] Illuminance Control (Lux)
            const luxFolder = lightFolder.addFolder({title: 'Illuminance', expanded: true});
            luxFolder.addBinding(light, 'lux', {
                min: 0,
                max: 200000,
                step: 100
            });

            // [KO] 구면 좌표 기반 방향 제어 (elevation, azimuth)
            // [EN] Spherical Coordinate Direction Control (elevation, azimuth)
            const sphericalFolder = lightFolder.addFolder({title: 'Spherical Direction (Sun)', expanded: true});
            sphericalFolder.addBinding(light, 'elevation', {min: -90, max: 90, step: 0.1}).on('change', () => pane.refresh());
            sphericalFolder.addBinding(light, 'azimuth', {min: 0, max: 360, step: 0.1}).on('change', () => pane.refresh());

            // [KO] Cartesian 좌표 기반 방향 제어 (directionX, directionY, directionZ)
            // [EN] Cartesian Coordinate Direction Control (directionX, directionY, directionZ)
            const dirFolder = lightFolder.addFolder({title: 'Cartesian Direction', expanded: true});
            dirFolder.addBinding(light, 'directionX', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionY', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionZ', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            
            // [KO] 디버거 활성화 여부
            // [EN] Debugger visibility
            lightFolder.addBinding(light, 'enableDebugger', {label: 'Show Light Debugger'});
        }
    });
};
