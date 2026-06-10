import * as RedGPU from "../../../../dist/index.js?t=1781134103100";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781134103100";

/**
 * [KO] PointLight Performance(Clustered) 예제
 * [EN] PointLight Performance(Clustered) example
 *
 * [KO] Clustered Forward Shading 기술을 사용하여 1,000개 이상의 실시간 점광원을 효율적으로 렌더링하는 성능을 시연합니다.
 * [EN] Demonstrates the performance of efficiently rendering over 1,000 real-time point lights using Clustered Forward Shading.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 0;
        controller.speedDistance = 0.5;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 다수의 포인트 라이트 생성 (최대 1,024개)
        // [EN] Create Multiple Point Lights (Max 1,024)
        const lightCount = 1024;
        const {lights, initialPositions} = createPointLights(scene, lightCount);

        // 4. [KO] 최적화된 메시 무리 생성 (5,000개)
        // [EN] Create Optimized Mesh Swarm (5,000 instances)
        createOptimizedMeshSwarm(redGPUContext, scene, 5000);

        // 5. [KO] 렌더러 생성 및 애니메이션 루프 시작
        // [EN] Create Renderer and Start Animation Loop
        const renderer = new RedGPU.Renderer();
        const state = { autoAnimate: true };
        
        const render = (time) => {
            if (state.autoAnimate) {
                animateLights(lights, initialPositions, time);
            }
        };
        renderer.start(redGPUContext, render);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, state);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

/**
 * [KO] 무작위 색상과 위치를 가진 다수의 포인트 라이트를 생성합니다.
 * [EN] Creates multiple point lights with random colors and positions.
 */
const createPointLights = (scene, count) => {
    const lights = [];
    const initialPositions = [];
    const range = 80;

    for (let i = 0; i < count; i++) {
        const light = new RedGPU.Light.PointLight();
        
        // [KO] 무작위 색상 및 속성 설정
        // [EN] Set random colors and properties
        light.color.setColorByRGB(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        );
        light.lumen = Math.random() * 500 + 100;
        light.radius = Math.random() * 8 + 2;

        // [KO] 무작위 초기 위치 설정
        // [EN] Set random initial positions
        const x = Math.random() * range - range / 2;
        const y = Math.random() * range - range / 2;
        const z = Math.random() * range - range / 2;
        light.setPosition(x, y, z);

        initialPositions.push([x, y, z]);
        scene.lightManager.addPointLight(light);
        lights.push(light);
    }
    return {lights, initialPositions};
};

/**
 * [KO] 지오메트리 공유와 재질 풀링을 통해 최적화된 메시 무리를 생성합니다.
 * [EN] Creates an optimized mesh swarm using geometry sharing and material pooling.
 */
const createOptimizedMeshSwarm = (redGPUContext, scene, count) => {
    // [KO] 모든 메시가 공유할 단일 지오메트리 (성능 최적화의 핵심)
    // [EN] Single geometry shared by all meshes (Key to performance optimization)
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 16, 16, 16);
    
    // [KO] 과도한 객체 생성을 피하기 위한 재질 풀 생성
    // [EN] Create a material pool to avoid excessive object creation
    const materialPool = [];
    for (let i = 0; i < 50; i++) {
        const mat = new RedGPU.Material.PBRMaterial(redGPUContext);
        mat.baseColorFactor = [0.8, 0.8, 0.8, 1.0];
        mat.roughnessFactor = 0.2;
        mat.metallicFactor = 0.5;
        materialPool.push(mat);
    }

    const range = 100;
    for (let i = 0; i < count; i++) {
        const mesh = new RedGPU.Display.Mesh(
            redGPUContext, 
            geometry, 
            materialPool[i % materialPool.length]
        );

        mesh.setPosition(
            Math.random() * range - range / 2,
            Math.random() * range - range / 2,
            Math.random() * range - range / 2
        );
        mesh.rotationX = Math.random() * 360;
        mesh.rotationY = Math.random() * 360;
        mesh.rotationZ = Math.random() * 360;

        scene.addChild(mesh);
    }
};

/**
 * [KO] 매 프레임 라이트들의 위치를 부드럽게 계산하여 애니메이션합니다.
 * [EN] Animates the positions of lights by calculating them smoothly each frame.
 */
const animateLights = (lights, initialPositions, time) => {
    const t = time * 0.0005;
    const len = lights.length;
    
    for (let i = 0; i < len; i++) {
        const light = lights[i];
        const [ix, iy, iz] = initialPositions[i];
        
        // [KO] 삼각함수를 이용한 유기적인 움직임 계산
        // [EN] Organic movement calculation using trigonometric functions
        light.x = ix + Math.sin(t + i) * 15;
        light.y = iy + Math.cos(t + i * 0.5) * 15;
        light.z = iz + Math.sin(t * 0.8 + i) * 15;
    }
};

/**
 * [KO] 성능 모니터링 및 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for performance monitoring and control.
 */
const renderTestPane = (redGPUContext, state) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Performance Control', expanded: true});
            folder.addBinding(state, 'autoAnimate', {label: 'Animate Lights'});
            
            // [KO] 현재 씬 정보 표시
            // [EN] Display current scene info
            const stats = {
                lightCount: 1024,
                meshCount: 5000
            };
            folder.addBinding(stats, 'lightCount', {readonly: true, label: 'Active Lights'});
            folder.addBinding(stats, 'meshCount', {readonly: true, label: 'Total Meshes'});
        }
    });
};
