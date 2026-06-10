import * as RedGPU from "../../../../dist/index.js?t=1781133866175";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781133866175";

/**
 * [KO] SpotLight Performance(Clustered) 예제
 * [EN] SpotLight Performance(Clustered) example
 *
 * [KO] 정돈된 그리드 배치를 통해 1,024개의 스포트 라이트가 바닥과 오브젝트에 만드는 조명 효과와 퍼포먼스를 시연합니다.
 * [EN] Demonstrates the lighting effects and performance of 1,024 spot lights on the floor and objects through an organized grid arrangement.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 70;
        controller.tilt = -45;
        controller.speedDistance = 0.5;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 32x32 그리드 형태의 스포트 라이트 생성 (총 1,024개)
        // [EN] Create 32x32 Grid of Spot Lights (Total 1,024)
        const gridSize = 32;
        const spacing = 6;
        const {lights, initialPositions} = createSpotLightGrid(scene, gridSize, spacing);

        // 4. [KO] 환경 구성 (바닥 및 구체 그리드)
        // [EN] Configure Environment (Ground and Sphere Grid)
        createGround(redGPUContext, scene, 300);
        createMatchingMeshGrid(redGPUContext, scene, gridSize, spacing);

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
 * [KO] 스포트라이트의 감쇄를 시각적으로 확인할 수 있는 넓은 바닥을 생성합니다.
 * [EN] Creates a large ground to visually confirm the attenuation of the spotlights.
 */
const createGround = (redGPUContext, scene, size) => {
    const mat = new RedGPU.Material.PBRMaterial(redGPUContext);
    // [KO] 어두운 색상의 재질을 사용하여 빛의 대비를 강조
    // [EN] Use dark material to emphasize light contrast
    mat.baseColorFactor = [0.1, 0.1, 0.1, 1.0];
    mat.roughnessFactor = 0.4;
    mat.metallicFactor = 0.2;

    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Plane(redGPUContext, size, size),
        mat
    );
    ground.rotationX = -90;
    // [KO] 메시들과의 겹침(Z-fighting) 방지를 위해 살짝 아래에 배치
    // [EN] Placed slightly below to prevent Z-fighting with meshes
    ground.y = -2;
    scene.addChild(ground);
};

/**
 * [KO] 정돈된 그리드 형태로 스포트 라이트 무리를 생성합니다.
 * [EN] Creates a swarm of spot lights in an organized grid.
 */
const createSpotLightGrid = (scene, size, spacing) => {
    const lights = [];
    const initialPositions = [];
    const halfSize = (size - 1) * spacing / 2;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const light = new RedGPU.Light.SpotLight();
            
            light.color.setColorByRGB(
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255)
            );
            light.lumen = 4000;
            light.radius = 20;
            light.innerCutoff = 5;
            light.outerCutoff = 25;

            const x = col * spacing - halfSize;
            const z = row * spacing - halfSize;
            const y = 15;
            light.setPosition(x, y, z);
            light.lookAt(x, 0, z);

            initialPositions.push([x, y, z]);
            scene.lightManager.addSpotLight(light);
            lights.push(light);
        }
    }
    return {lights, initialPositions};
};

/**
 * [KO] 라이트 아래에 대응하는 구체 그리드를 생성합니다.
 * [EN] Creates a matching sphere grid below the lights.
 */
const createMatchingMeshGrid = (redGPUContext, scene, size, spacing) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1.5, 16, 16, 16);
    const halfSize = (size - 1) * spacing / 2;
    
    const materialPool = [];
    for (let i = 0; i < 50; i++) {
        const mat = new RedGPU.Material.PBRMaterial(redGPUContext);
        mat.baseColorFactor = [0.8, 0.8, 0.8, 1.0];
        mat.roughnessFactor = 0.2;
        mat.metallicFactor = 0.5;
        materialPool.push(mat);
    }

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const mesh = new RedGPU.Display.Mesh(
                redGPUContext, 
                geometry, 
                materialPool[(row * size + col) % materialPool.length]
            );

            mesh.setPosition(
                col * spacing - halfSize,
                0,
                row * spacing - halfSize
            );
            scene.addChild(mesh);
        }
    }
};

/**
 * [KO] 매 프레임 스포트 라이트들이 바닥을 훑도록 애니메이션합니다.
 * [EN] Animates the spot lights to scan the floor each frame.
 */
const animateLights = (lights, initialPositions, time) => {
    const t = time * 0.001;
    const len = lights.length;
    
    for (let i = 0; i < len; i++) {
        const light = lights[i];
        const [ix, iy, iz] = initialPositions[i];
        
        const offsetX = Math.sin(t + i * 0.1) * 5;
        const offsetZ = Math.cos(t + i * 0.1) * 5;
        
        light.lookAt(ix + offsetX, 0, iz + offsetZ);
    }
};

/**
 * [KO] 성능 모니터링 GUI 구성
 * [EN] Configure Performance Monitoring GUI
 */
const renderTestPane = (redGPUContext, state) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'SpotLight Performance', expanded: true});
            folder.addBinding(state, 'autoAnimate', {label: 'Animate Scanning'});
            
            const stats = {
                lightCount: 1024,
                meshCount: 1024 + 1
            };
            folder.addBinding(stats, 'lightCount', {readonly: true, label: 'Active Lights'});
            folder.addBinding(stats, 'meshCount', {readonly: true, label: 'Total Meshes'});
        }
    });
};
