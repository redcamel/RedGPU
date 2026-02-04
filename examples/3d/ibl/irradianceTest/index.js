import * as RedGPU from "../../../../dist/index.js";

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
            '../../../assets/hdr/pisa.hdr',
            async (v) => {
                // [KO] 로드된 2D HDR로부터 Irradiance 맵 생성 (IBLCubeTexture 직접 반환)
                // [EN] Generate Irradiance map from the loaded 2D HDR (returns IBLCubeTexture directly)
                const irradianceCubeTexture = await redGPUContext.resourceManager.irradianceGenerator.generate(v.gpuTexture);

                // [KO] 결과를 시각적으로 확인하기 위해 스카이박스에 적용
                // [EN] Apply to Skybox to visually verify the result
                const skybox = new RedGPU.Display.SkyBox(redGPUContext, irradianceCubeTexture);
                view.skybox = skybox;
                console.log(hdrTexture.gpuTexture)

                console.log('Irradiance map generated and applied to skybox');
            }
        );

        const previewMesh = new RedGPU.Display.Sprite3D(
            redGPUContext,
            new RedGPU.Material.BitmapMaterial(redGPUContext, hdrTexture)
        );
        previewMesh.usePixelSize = true;
        previewMesh.pixelSize = 200
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

    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);

};
