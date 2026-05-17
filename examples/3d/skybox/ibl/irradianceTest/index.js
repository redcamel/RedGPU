import * as RedGPU from "../../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1778922031603";

/**
 * [KO] Irradiance 맵 테스트 예제
 * [EN] Irradiance Map Test Example
 */

// [KO] 캔버스 생성 및 문서에 추가
// [EN] Create canvas and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    async (redGPUContext) => {
        // [KO] 카메라 컨트롤러 생성 (OrbitController)
        // [EN] Create camera controller (OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // [KO] 씬 및 뷰 생성
        // [EN] Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // [KO] 컨텍스트에 뷰 추가
        // [EN] Add view to context
        redGPUContext.addView(view);

        // [KO] HDR 텍스처 로드 (현재 버전은 순수 2D 리소스로 로드됨)
        // [EN] Load HDR texture (loaded as a pure 2D resource in current version)
        const hdrTexture = new RedGPU.Resource.HDRTexture(
            redGPUContext,
            '../../../../assets/hdr/pisa.hdr',
            async (v) => {
                // [KO] 1. 로드된 2D HDR을 큐브맵으로 변환
                // [EN] 1. Convert the loaded 2D HDR to a cubemap
                const sourceCubeTexture = await redGPUContext.resourceManager.equirectangularToCubeGenerator.generate(v.gpuTexture);

                // [KO] 2. 변환된 큐브맵으로부터 Irradiance 맵 생성
                // [EN] 2. Generate Irradiance map from the converted cubemap
                const irradianceCubeTexture = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCubeTexture.gpuTexture);

                // [KO] 결과를 시각적으로 확인하기 위해 스카이박스에 적용
                // [EN] Apply to Skybox to visually verify the result
                const skybox = new RedGPU.Display.SkyBox(redGPUContext, irradianceCubeTexture);
                view.skybox = skybox;

                console.log('Irradiance map generated and applied to skybox');
            }
        );

        // [KO] 원본 2D HDR 이미지를 확인하기 위한 Sprite3D 생성
        // [EN] Create Sprite3D to view the original 2D HDR image
        const previewMesh = new RedGPU.Display.Sprite3D(
            redGPUContext,
            new RedGPU.Material.BitmapMaterial(redGPUContext, hdrTexture)
        );
        previewMesh.usePixelSize = true;
        previewMesh.pixelSize = 300;
        scene.addChild(previewMesh);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // [KO] 테스트용 GUI 렌더링
        // [EN] Render GUI for testing
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트를 위한 GUI 패널을 렌더링합니다.
 * [EN] Renders a GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};