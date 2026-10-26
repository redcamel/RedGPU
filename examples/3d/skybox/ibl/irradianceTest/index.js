import * as RedGPU from "../../../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] Irradiance 맵 테스트 예제
 * [EN] Irradiance Map Test Example
 *
 * [KO] 환경 맵으로부터 Irradiance 맵을 생성하고 스카이박스에 적용하여 시각적으로 검증합니다.
 * [EN] Generates an Irradiance map from an environment map and applies it to a skybox for visual verification.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] HDR 텍스처를 큐브맵으로 변환한 뒤 Irradiance 맵을 생성하여 스카이박스에 적용
        // [EN] Convert HDR texture to cubemap, generate Irradiance map, and apply to skybox
        const hdrTexture = new RedGPU.Resource.HDRTexture(
            redGPUContext,
            '../../../../assets/hdr/pisa.hdr',
            async (hdrResource) => {
                const sourceCube = await redGPUContext.resourceManager.equirectangularToCubeGenerator.generate(hdrResource.gpuTexture);
                const irradianceCube = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCube.gpuTexture);
                view.skybox = new RedGPU.Display.SkyBox(redGPUContext, irradianceCube);
            }
        );

        // [KO] 원본 HDR 미리보기용 Sprite3D 배치
        // [EN] Place Sprite3D for original HDR preview
        const previewMesh = new RedGPU.Display.Sprite3D(
            redGPUContext,
            new RedGPU.Material.BitmapMaterial(redGPUContext, hdrTexture)
        );
        previewMesh.usePixelSize = true;
        previewMesh.pixelSize = 300;
        scene.addChild(previewMesh);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
