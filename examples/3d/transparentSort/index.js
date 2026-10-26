import * as RedGPU from "../../../dist/index.js";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js";

/**
 * [KO] Transparent Sort 예제
 * [EN] Transparent Sort example
 *
 * [KO] 반투명한 객체들이 카메라 거리에 따라 올바르게 정렬(Sorting)되어 렌더링되는 과정을 시연합니다.
 * [EN] Demonstrates the correct sorting and rendering of translucent objects based on their distance from the camera.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;
        controller.distance = 30;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.skybox = createSkybox(redGPUContext);
        redGPUContext.addView(view);

        // [KO] 무작위 반투명 메시 군집 생성
        // [EN] Create random translucent mesh swarm
        addRandomMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            let i = scene.numChildren;
            while (i--) {
                const child = scene.children[i];
                child.rotationX += 1.0;
                child.rotationY += 1.0;
                child.rotationZ += 1.0;
                child.y += Math.sin(time / 1000 + i * 10) / 50;
            }
        });

        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSkybox = (redGPUContext) => {
    const skyboxImagePaths = [
        '../../assets/skybox/px.jpg',
        '../../assets/skybox/nx.jpg',
        '../../assets/skybox/py.jpg',
        '../../assets/skybox/ny.jpg',
        '../../assets/skybox/pz.jpg',
        '../../assets/skybox/nz.jpg'
    ];

    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
    return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
};

const addRandomMeshes = (redGPUContext, scene) => {
    const geometries = [
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 16, 16),
        new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3),
        new RedGPU.Primitive.Cylinder(redGPUContext, 2, 2, 6, 16),
        new RedGPU.Primitive.Torus(redGPUContext, 1.5, 0.5, 16, 32),
        new RedGPU.Primitive.TorusKnot(redGPUContext, 0.5, 0.2, 128, 64, 2, 3)
    ];

    // [KO] 반투명 머티리얼 풀 생성 (transparent = true 활성화)
    // [EN] Create translucent material pool (enable transparent = true)
    const materialPool = Array.from({ length: 50 }).map(() => {
        const material = new RedGPU.Material.PhongMaterial(redGPUContext, getRandomHexValue());
        material.opacity = 0.2 + Math.random() * 0.6;
        material.transparent = true;
        return material;
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

const getRandomHexValue = () => {
    const randomColor = Math.floor(Math.random() * 0xffffff);
    return `#${randomColor.toString(16).padStart(6, '0')}`;
};

const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const params = {
                transparent: true
            };

            pane.addBinding(params, 'transparent').on('change', (ev) => {
                scene.children.forEach((child) => {
                    if (child.material) {
                        child.material.transparent = ev.value;
                    }
                });
            });
        }
    });
};
