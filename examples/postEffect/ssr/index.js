import * as RedGPU from "../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] SSR 예제
 * [EN] SSR example
 *
 * [KO] Screen Space Reflection (SSR) 화면 공간 반사 효과를 시연합니다.
 * [EN] Demonstrates the Screen Space Reflection (SSR) effect.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // [KO] SSR(실시간 화면 공간 반사) 활성화
        // [EN] Enable SSR (Screen Space Reflection)
        view.postEffectManager.useSSR = true;
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 32, 16);
        const orangeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        orangeMaterial.color.setColorByHEX('#af532e');
        orangeMaterial.useSSR = true;
        orangeMaterial.metallic = 0.1;

        const floatingSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, orangeMaterial);
        floatingSphere.x = -1.5;
        scene.addChild(floatingSphere);

        const groundGeometry = new RedGPU.Primitive.Ground(redGPUContext, 100, 100);
        const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        groundMaterial.color.setColorByHEX('#7a5d4a');
        groundMaterial.useSSR = true;
        groundMaterial.metallic = 0.5;

        const ground = new RedGPU.Display.Mesh(redGPUContext, groundGeometry, groundMaterial);
        ground.y = -1;
        scene.addChild(ground);

        loadGLTFModels(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            floatingSphere.rotationY += 0.02;
            floatingSphere.y = Math.sin(time * 0.002) * 0.5;
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const loadGLTFModels = (redGPUContext, scene) => {
    const models = [
        {
            url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
            pos: {x: 0, z: 0}
        },
        {
            url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MetalRoughSpheres/glTF-Binary/MetalRoughSpheres.glb',
            pos: {z: -2}
        }
    ];

    models.forEach(({url, pos}) => {
        new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
            const mesh = scene.addChild(result.resultMesh);
            Object.assign(mesh, pos);
        });
    });
};

const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const ssrFolder = pane.addFolder({title: 'PostEffect', expanded: true});
            const ssr = view.postEffectManager.ssr;

            ssrFolder.addBinding(view.postEffectManager, 'useSSR').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
            });

            const controls = [
                ssrFolder.addBinding(ssr, 'maxSteps', {min: 1, max: 512, step: 1}),
                ssrFolder.addBinding(ssr, 'maxDistance', {min: 1, max: 200, step: 0.1}),
                ssrFolder.addBinding(ssr, 'stepSize', {min: 0.001, max: 5.0, step: 0.001}),
                ssrFolder.addBinding(ssr, 'reflectionIntensity', {min: 0.0, max: 10.0, step: 0.01}),
                ssrFolder.addBinding(ssr, 'fadeDistance', {min: 1, max: 100, step: 0.1}),
                ssrFolder.addBinding(ssr, 'edgeFade', {min: 0.0, max: 0.5, step: 0.01})
            ];
        }
    });
};
