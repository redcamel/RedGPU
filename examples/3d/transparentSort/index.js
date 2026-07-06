import * as RedGPU from "../../../dist/index.js?t=1783322366074";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1783322366074";

/**
 * [KO] Transparent Sort 예제
 * [EN] Transparent Sort example
 *
 * [KO] 반투명한 객체들이 카메라 거리에 따라 올바르게 정렬(Sorting)되어 렌더링되는 과정을 시연합니다.
 * [EN] Demonstrates the correct sorting and rendering of translucent objects based on their distance from the camera.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;
        controller.distance = 30;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();

        // [KO] 방향성 조명 추가
        // [EN] Add Directional Light
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 배경 스카이박스 설정
        // [EN] Setup Background Skybox
        view.skybox = createSkybox(redGPUContext);

        // 3. [KO] 무작위 반투명 메시 군집 생성
        // [EN] Create Random Translucent Mesh Swarm
        addRandomMeshes(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 애니메이션 루프 시작
        // [EN] Create Renderer and Start Animation Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 모든 메시를 회전시키고 위아래로 흔들리게 함
            // [EN] Rotate all meshes and make them wobble up and down
            let i = scene.numChildren;
            while (i--) {
                const child = scene.children[i];
                if (child instanceof RedGPU.Display.Mesh && !(child instanceof RedGPU.Display.TextField3D)) {
                    child.rotationX += 1.0;
                    child.rotationY += 1.0;
                    child.rotationZ += 1.0;
                    child.y += Math.sin(time / 1000 + i * 10) / 50;
                }
            }
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 스카이박스를 생성합니다.
 * [EN] Creates a skybox.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @returns {RedGPU.Display.SkyBox}
 */
const createSkybox = (redGPUContext) => {
    const skyboxImagePaths = [
        "../../assets/skybox/px.jpg",
        "../../assets/skybox/nx.jpg",
        "../../assets/skybox/py.jpg",
        "../../assets/skybox/ny.jpg",
        "../../assets/skybox/pz.jpg",
        "../../assets/skybox/nz.jpg",
    ];

    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
    return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
};

/**
 * [KO] 대규모 무작위 메시들을 생성하여 씬에 추가합니다.
 * [EN] Creates a large number of random meshes and adds them to the scene.
 */
const addRandomMeshes = (redGPUContext, scene) => {
    // [KO] 성능 최적화를 위해 지오메트리 공유
    // [EN] Share geometries for performance optimization
    const geometries = [
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 16, 16),
        new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3),
        new RedGPU.Primitive.Cylinder(redGPUContext, 2, 2, 6, 16),
        new RedGPU.Primitive.Torus(redGPUContext, 1.5, 0.5, 16, 32),
        new RedGPU.Primitive.TorusKnot(redGPUContext, 0.5, 0.2, 128, 64, 2, 3)
    ];

    // [KO] 성능 최적화를 위해 머티리얼 풀(Pool) 생성 (1000개 생성 시의 GC 부담 방지)
    // [EN] Create a material pool for performance (prevents GC overhead when creating 1000 instances)
    const materialPool = Array.from({ length: 50 }).map(() => {
        const mat = new RedGPU.Material.PhongMaterial(redGPUContext, getRandomHexValue());
        mat.opacity = 0.2 + Math.random() * 0.6; // [KO] 0.2 ~ 0.8 사이의 투명도 [EN] Opacity between 0.2 and 0.8
        mat.transparent = true;
        return mat;
    });

    for (let i = 0; i < 1000; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materialPool[Math.floor(Math.random() * materialPool.length)];

        const x = Math.random() * 150 - 75;
        const y = Math.random() * 10 - 5;
        const z = Math.random() * 150 - 75;

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setScale(Math.max(Math.random() * 1.5, 0.5));
        mesh.setPosition(x, y, z);
        mesh.rotationX = Math.random() * 360;
        mesh.rotationY = Math.random() * 360;
        mesh.rotationZ = Math.random() * 360;

        scene.addChild(mesh);
    }
};

/**
 * [KO] 무작위 16진수 색상 값을 반환합니다.
 * [EN] Returns a random hex color value.
 */
const getRandomHexValue = () => {
    const randomColor = Math.floor(Math.random() * 0xffffff);
    return `#${randomColor.toString(16).padStart(6, "0")}`;
};

/**
 * [KO] 실시간 정렬 옵션 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time sorting option control.
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const params = {
                transparent: true,
            };

            pane.addBinding(params, 'transparent', {
                label: 'Use Transparency Sort'
            }).on("change", (ev) => {
                // [KO] 모든 자식 객체의 머티리얼 투명 옵션 일괄 변경
                // [EN] Batch update transparent option for all children's materials
                scene.children.forEach(child => {
                    if (child instanceof RedGPU.Display.Mesh && child.material) {
                        child.material.transparent = ev.value;
                    }
                });
            });
        }
    });
};
