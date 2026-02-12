/**
 * [KO] SkyAtmosphere Generator LUT 텍스처 시각화 예제
 * [EN] SkyAtmosphere Generator LUT Texture Visualization Example
 *
 * [KO] SkyAtmosphere 시스템 내부에서 생성되는 Transmittance, Multi-Scattering, Sky-View LUT 텍스처를 Sprite3D를 통해 실시간으로 확인합니다.
 * [EN] Real-time visualization of Transmittance, Multi-Scattering, and Sky-View LUT textures generated within the SkyAtmosphere system using Sprite3D.
 * @packageDocumentation
 */
import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        controller.tilt = 0
        controller.distance = 20;
        // view.grid = true;
        // view.axis = true;
        redGPUContext.addView(view);

        // SkyAtmosphere 생성
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        // LUT 텍스처들을 시각화할 Sprite3D 생성 함수
        const createLUTSprite = (texture, name, x, y) => {
            const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
            material.diffuseTexture = texture;
            
            const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
            sprite.x = x;
            sprite.y = y;
            sprite.worldSize = 4;
            scene.addChild(sprite);

            // 라벨 추가
            const label = new RedGPU.Display.TextField3D(redGPUContext, name);
            label.x = x;
            label.y = y - 2.5; // 스프라이트 하단에 배치
            label.worldSize = 1;
            label.color = '#000'; // 검은색으로 설정
            scene.addChild(label);

            return sprite;
        };

        // 3종의 LUT 텍스처 시각화 (위/아래 배치)
        // 위쪽: Multi-Scattering LUT (1:1), Sky-View LUT (1:1)
        const multiScattering = createLUTSprite(skyAtmosphere.multiScatteringTexture, 'Multi-Scattering LUT', -3, 8);
        const skyView =  createLUTSprite(skyAtmosphere.skyViewTexture, 'Sky-View LUT', 3, 8);
        
        // 아래쪽: Transmittance LUT (4:1 비율로 자동 확장됨)
        const transmittance = createLUTSprite(skyAtmosphere.transmittanceTexture, 'Transmittance LUT', 0, 3);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext,);

        renderTestPane(view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane();
    const {
        createFieldOfView,
        createSkyAtmosphereHelper,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);
    createSkyAtmosphereHelper(pane, targetView);
};
