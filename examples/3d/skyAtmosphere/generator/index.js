import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] SkyAtmosphere Generator (LUT) 예제
 * [EN] SkyAtmosphere Generator (LUT) example
 *
 * [KO] SkyAtmosphere 시스템 내부에서 실시간으로 생성되는 다양한 LUT(Look-Up Table) 텍스처들과 간접 조명(Reflection/Irradiance LUT) 결과를 시각화합니다.
 * [EN] Visualizes various LUT (Look-Up Table) textures and indirect lighting (Reflection/Irradiance LUT) results generated in real-time within the SkyAtmosphere system.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;
        controller.distance = 35;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 태양 광원(DirectionalLight) 및 SkyAtmosphere 초기화
        // [EN] Initialize sun light source (DirectionalLight) and SkyAtmosphere
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 35;
        directionalLight.azimuth = 0;
        scene.lightManager.addDirectionalLight(directionalLight);

        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        const createLUTSprite = (texture, name, x, y) => {
            if (!texture) return;

            const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
            material.diffuseTexture = texture;

            const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
            sprite.setPosition(x, y, 0);
            sprite.worldSize = 2;
            scene.addChild(sprite);

            const label = new RedGPU.Display.TextField3D(redGPUContext);
            label.text = name;
            label.setPosition(x, y - 3, 0);
            label.fontSize = 32;
            label.color = '#fff';
            scene.addChild(label);

            return sprite;
        };

        // [KO] 주요 2D LUT 시각화 및 Reflection/Irradiance LUT 검증 구체 배치
        // [EN] Visualize primary 2D LUTs and place verification spheres for Reflection/Irradiance LUTs
        createLUTSprite(skyAtmosphere.transmittanceLUT, 'Transmittance LUT', -9, 9);
        createLUTSprite(skyAtmosphere.multiScatteringLUT, 'Multi-Scattering LUT', 0, 9);
        createLUTSprite(skyAtmosphere.skyViewLUT, 'Sky-View LUT', 9, 9);

        const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 4, 32, 32);

        const metallicMat = new RedGPU.Material.PBRMaterial(redGPUContext);
        metallicMat.metallicFactor = 1.0;
        metallicMat.roughnessFactor = 0.05;
        const metallicVerifier = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, metallicMat);
        metallicVerifier.setPosition(-10, -2, 0);
        scene.addChild(metallicVerifier);

        const metallicLabel = new RedGPU.Display.TextField3D(redGPUContext);
        metallicLabel.text = 'Specular Verification<br/>(Reflection LUT)';
        metallicLabel.setPosition(-10, -8, 0);
        metallicLabel.fontSize = 24;
        metallicLabel.worldSize = 2;
        metallicLabel.color = '#00ccff';
        scene.addChild(metallicLabel);

        const diffuseMat = new RedGPU.Material.PBRMaterial(redGPUContext);
        diffuseMat.metallicFactor = 0.0;
        diffuseMat.roughnessFactor = 1.0;
        const diffuseVerifier = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, diffuseMat);
        diffuseVerifier.setPosition(10, -2, 0);
        scene.addChild(diffuseVerifier);

        const diffuseLabel = new RedGPU.Display.TextField3D(redGPUContext);
        diffuseLabel.text = 'Diffuse Verification<br/>(Irradiance LUT)';
        diffuseLabel.setPosition(10, -8, 0);
        diffuseLabel.fontSize = 24;
        diffuseLabel.worldSize = 2;
        diffuseLabel.color = '#00ccff';
        scene.addChild(diffuseLabel);

        const infoLabel = new RedGPU.Display.TextField3D(redGPUContext);
        infoLabel.text = 'Note: Aerial Perspective LUT is a 3D Volume texture utilized in the background.';
        infoLabel.setPosition(0, -15, 0);
        infoLabel.fontSize = 20;
        infoLabel.worldSize = 1;
        infoLabel.color = '#999';
        scene.addChild(infoLabel);

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
