import * as RedGPU from "../../../../../dist/index.js?t=1784264152422";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1784264152422";

/**
 * [KO] Irradiance 맵 테스트 예제
 * [EN] Irradiance Map Test Example
 *
 * [KO] 환경 맵으로부터 정교한 Irradiance 맵을 생성하고 시각적으로 검증하는 과정을 시연합니다.
 * [EN] Demonstrates the process of generating and visually verifying a sophisticated Irradiance map from an environment map.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] HDR 텍스처 로드 및 맵 생성 워크플로우
        // [EN] HDR Texture Load and Map Generation Workflow
        const hdrTexture = new RedGPU.Resource.HDRTexture(
            redGPUContext,
            '../../../../assets/hdr/pisa.hdr',
            async (hdrResource) => {
                // [KO] A. 2D HDR 이미지를 큐브맵으로 변환
                // [EN] A. Convert 2D HDR image to a Cubemap
                const sourceCube = await redGPUContext.resourceManager.equirectangularToCubeGenerator.generate(hdrResource.gpuTexture);

                // [KO] B. 큐브맵으로부터 Irradiance 맵 생성
                // [EN] B. Generate Irradiance map from the Cubemap
                const irradianceCube = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCube.gpuTexture);

                // [KO] C. 결과를 시각적으로 확인하기 위해 스카이박스에 적용
                // [EN] C. Apply to Skybox for visual verification
                view.skybox = new RedGPU.Display.SkyBox(redGPUContext, irradianceCube);

                console.log('Irradiance map generated and applied to skybox');
            }
        );

        // 4. [KO] 원본 HDR 미리보기용 Sprite3D 생성
        // [EN] Create Sprite3D for original HDR preview
        const previewMesh = new RedGPU.Display.Sprite3D(
            redGPUContext,
            new RedGPU.Material.BitmapMaterial(redGPUContext, hdrTexture)
        );
        previewMesh.usePixelSize = true;
        previewMesh.pixelSize = 300;
        scene.addChild(previewMesh);

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 구성합니다.
 * [EN] Configures GUI for testing.
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
