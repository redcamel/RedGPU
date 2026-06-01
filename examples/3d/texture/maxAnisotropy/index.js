import * as RedGPU from "../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778922031603";

/**
 * [KO] Max Anisotropy 예제
 * [EN] Max Anisotropy example
 *
 * [KO] 이방성 필터링(Anisotropic Filtering)의 효과를 시연합니다.
 * [KO] 멀리 있는 텍스처가 예각에서 뭉개지는 현상을 방지하여 선명도를 유지하는 과정을 확인합니다.
 * [EN] Demonstrates the effect of Anisotropic Filtering.
 * [EN] Observe how it maintains clarity by preventing texture blurring at sharp angles in the distance.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정 (도로를 길게 내다보는 각도)
        // [EN] Setup Camera Controller (Angle looking down the long roads)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 40;
        controller.tilt = -10;
        controller.pan = 0;
        controller.centerY = 2;

        // 2. [KO] 씬 구성
        // [EN] Configure Scene
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 조명 설정
        // [EN] Setup Lighting
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.intensity = 1.5;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. [KO] 이방성 필터링 비교용 도로 생성 (Ground 프리미티브 사용)
        // [EN] Create Comparison Lanes (Using Ground primitive)
        createComparisonLanes(redGPUContext, scene);

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

/**
 * [KO] 서로 다른 maxAnisotropy 값이 적용된 긴 도로(Ground)들을 생성합니다.
 * [EN] Creates long roads (Ground) with different maxAnisotropy values applied.
 */
function createComparisonLanes(redGPUContext, scene) {
    const anisotropyValues = [1, 8, 16];
    const laneWidth = 10;
    const laneLength = 2000;
    const gap = 2;
    const totalWidth = (laneWidth + gap) * anisotropyValues.length - gap;

    // [KO] 텍스처 리소스 로드
    // [EN] Load texture resource
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/maxAnisotropy/maxAnisotropy.jpg");
    
    // [KO] Ground 지오메트리 생성 (이미 XZ 평면에 누워 있음)
    // [EN] Create Ground geometry (already lying on the XZ plane)
    const geometry = new RedGPU.Primitive.Ground(redGPUContext, laneWidth, laneLength, 1, 100);

    anisotropyValues.forEach((value, index) => {
        const x = (index * (laneWidth + gap)) - (totalWidth / 2) + (laneWidth / 2);

        // [KO] 각 도로별 고유한 샘플러 설정
        // [EN] Set a unique sampler for each road
        const sampler = new RedGPU.Resource.Sampler(redGPUContext);
        sampler.minFilter = RedGPU.GPU_FILTER_MODE.LINEAR;
        sampler.magFilter = RedGPU.GPU_FILTER_MODE.LINEAR;
        sampler.mipmapFilter = RedGPU.GPU_FILTER_MODE.LINEAR;
        sampler.addressModeU = RedGPU.GPU_ADDRESS_MODE.REPEAT;
        sampler.addressModeV = RedGPU.GPU_ADDRESS_MODE.REPEAT;
        sampler.maxAnisotropy = value;

        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        material.diffuseTextureSampler = sampler;
        
        // [KO] 텍스처 타일링 설정
        // [EN] Set texture tiling
        material.textureScale = [1, laneLength / laneWidth];

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        // [KO] Ground는 별도의 회전 없이도 바닥에 놓입니다. Z축 방향으로 길게 뻗도록 위치 조절
        // [EN] Ground lies on the floor without additional rotation. Adjust position to extend along Z-axis
        mesh.setPosition(x, 0, -laneLength / 2 + 25);
        scene.addChild(mesh);

        // [KO] 각 도로 입구에 값 표시 라벨 생성
        // [EN] Create value labels at the entrance of each road
        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = `MaxAnisotropy: ${value}`;
        label.fontSize = 24;
        label.worldSize = 1.2;
        label.setPosition(x, 1, 5);
        label.useBillboard = true;
        scene.addChild(label);
    });
}

/**
 * [KO] 테스트용 GUI를 구성합니다.
 * [EN] Configures GUI for testing.
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
