import * as RedGPU from "../../../../../dist/index.js?t=1770699661827";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    async (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
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

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext, scene, hdrTexture);
    },
    (failReason) => {
        console.error(failReason);
    }
);

const renderTestPane = async (redGPUContext, scene, hdrTexture) => {
    const {setDebugButtons} = await import("../../../../exampleHelper/createExample/panes/index.js?t=1770699661827");
    setDebugButtons(RedGPU, redGPUContext);
};