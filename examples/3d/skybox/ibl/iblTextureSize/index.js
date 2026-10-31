import * as RedGPU from "../../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] IBL Texture Size 예제
 * [EN] IBL Texture Size example
 *
 * [KO] IBL 생성 시 텍스처 크기에 따른 시각적 렌더링 품질과 성능의 차이를 비교 시연합니다.
 * [EN] Compares visual rendering quality and performance based on IBL texture size.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        controller.speedDistance = 0.1;

        const sceneNormal = new RedGPU.Display.Scene();
        const sceneLowRes = new RedGPU.Display.Scene();

        // [KO] 첫 번째 뷰 설정 (기본 해상도 IBL: prefilterSize 512)
        // [EN] Configure first view (Default resolution IBL: prefilterSize 512)
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, sceneNormal, controller);
        const iblNormal = new RedGPU.Resource.IBL(
            redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        viewNormal.ibl = iblNormal;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, iblNormal.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] 두 번째 뷰 설정 (저해상도 IBL: environmentSize 1024, prefilterSize 16)
        // [EN] Configure second view (Low resolution IBL: environmentSize 1024, prefilterSize 16)
        const viewLowRes = new RedGPU.Display.View3D(redGPUContext, sceneLowRes, controller);
        const iblLowRes = new RedGPU.Resource.IBL(
            redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            25000, 1024, 16
        );
        viewLowRes.ibl = iblLowRes;
        viewLowRes.skybox = new RedGPU.Display.SkyBox(redGPUContext, iblLowRes.environmentTexture);
        redGPUContext.addView(viewLowRes);

        sceneNormal.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
        sceneLowRes.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CompareMetallic/glTF-Binary/CompareMetallic.glb';
        loadGLTF(redGPUContext, sceneNormal, modelUrl);
        loadGLTF(redGPUContext, sceneLowRes, modelUrl);

        const updateLayout = () => {
            const isPortrait = window.innerWidth < window.innerHeight;
            if (isPortrait) {
                viewNormal.setSize('100%', '50%');
                viewNormal.setPosition(0, 0);
                viewLowRes.setSize('100%', '50%');
                viewLowRes.setPosition(0, '50%');
            } else {
                viewNormal.setSize('50%', '100%');
                viewNormal.setPosition(0, 0);
                viewLowRes.setSize('50%', '100%');
                viewLowRes.setPosition('50%', 0);
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const loadGLTF = (redGPUContext, scene, url) => {
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => {
        scene.addChild(v.resultMesh);
    });
};

const renderTestPane = (redGPUContext, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'Custom IBL Texture Size 16 * 16',
            normalTitle: 'Basic IBL Texture Size 512 * 512',
            targetContainer: container
        }
    });
};
