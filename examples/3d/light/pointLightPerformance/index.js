import * as RedGPU from "../../../../dist";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Create a camera controller (Orbit type)
        const controller = new RedGPU.Camera.ObitController(redGPUContext);
        controller.distance = 30;
        // Create a scene and add a view with the camera controller
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        redGPUContext.addView(view);
        const light = new RedGPU.Light.DirectionalLight();
        light.intensity = 0.1
        scene.lightManager.addDirectionalLight(light);
        // Add multiple Point Lights to the scene
        const { lights, initialPositions } = createPointLights(scene, 500); // 초기 위치와 1000 라이트 반환


        // Add 100 sample Sphere meshes to the scene
        createSphereMeshes(redGPUContext, scene, 500); // 정육면체 공간 내 1000개의 구 메쉬 생성

        // Create a renderer and start rendering
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            animateLights(lights,initialPositions); // 라이트 애니메이션
        };
        renderer.start(redGPUContext, render);
    },
    (failReason) => {
        // Handle initialization failure
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

// Function to create multiple Point Lights
const createPointLights = (scene, count) => {
    const lights = [];
    const initialPositions = []; // 초기 위치 저장 배열
    for (let i = 0; i < count; i++) {
        const radius = Math.random() * 7.5 + 1; // 고정 반경

        // 랜덤 색상 생성
        const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

        // 포인트 라이트 생성
        const light = new RedGPU.Light.PointLight();
        light.color.setColorByRGBString(color);
        light.radius = radius;

        // 정육면체 범위에서 라이트의 랜덤 위치 설정
        const x = Math.random() * 70 - 35;
        const y = Math.random() * 70 - 35;
        const z = Math.random() * 70 - 35;
        light.x = x;
        light.y = y;
        light.z = z;

        // 초기 위치 저장
        initialPositions.push({ x, y, z });

        // 라이트를 씬에 추가
        scene.lightManager.addPointLight(light);

        // 배열에 추가하여 이후 애니메이션에 사용
        lights.push(light);
    }
    return { lights, initialPositions }; // 라이트와 초기 위치 반환
};

// Function to create sphere meshes
const createSphereMeshes = (redGPUContext, scene, count) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        "../../../assets/UV_Grid_Sm.jpg"
    );

    const gridSize = 70
    const cubeSize = 1;
    const perRow = Math.cbrt(count);
    const spacing = gridSize / perRow;
    const halfGrid = gridSize / 2;
    const halfCube = cubeSize / 2;
    for (let x = 0; x < perRow; x++) {
        for (let y = 0; y < perRow; y++) {
            for (let z = 0; z < perRow; z++) {

                let cubePosX = x * spacing - halfGrid + halfCube;
                let cubePosY = y * spacing - halfGrid + halfCube;
                let cubePosZ = z * spacing - halfGrid + halfCube;
                const segment = Math.floor(Math.random() * 28 + 4)
                let geometry = new RedGPU.Primitive.Sphere(redGPUContext, Math.random() * 3,segment,segment,segment);

                let mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
                // testPhongMaterial.shininess = 128
                mesh.x = cubePosX;
                mesh.y = cubePosY;
                mesh.z = cubePosZ;
                mesh.setRotation(Math.random() * 360)

                scene.addChild(mesh);
            }
        }
    }
};

// Function to animate lights
const animateLights = (lights, initialPositions) => {
    const time = performance.now() * 0.001; // 시간 기반 애니메이션

    lights.forEach((light, index) => {
        const basePosition = initialPositions[index]; // 초기 위치 값 참조
        light.x = basePosition.x + Math.sin(time + index) * 10; // x축 진동 (범위를 10으로 제한)
        light.y = basePosition.y + Math.cos(time + index) * 10; // y축 진동 (범위를 10으로 제한)
        light.z = basePosition.z + Math.sin(time + 2 * index) * 10; // z축 진동 (범위를 10으로 제한)
    });
};