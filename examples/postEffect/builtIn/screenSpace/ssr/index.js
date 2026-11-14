import * as RedGPU from "../../../../../dist/index.js?t=1794650694512";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1794650694512";

/**
 * [KO] SSR 예제
 * [EN] SSR example
 *
 * [KO] 화면 공간 반사(SSR) 이펙트를 사용하여 표면에 실시간 반사 효과를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply real-time surface reflections using Screen Space Reflection (SSR).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] SSR 이펙트 활성화 및 인스턴스 참조
        // [EN] Enable SSR effect and reference instance
        view.builtInEffectManager.useSSR = true;
        const effect = view.builtInEffectManager.ssr;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 32, 16);
        const orangeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        orangeMaterial.color.setColorByHEX('#af532e');
        orangeMaterial.metallic = 0.1;
        const floatingSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, orangeMaterial);
        floatingSphere.x = -1.5;
        scene.addChild(floatingSphere);

        const colorBoxGeometry = new RedGPU.Primitive.Box(redGPUContext, 0.7, 0.7, 0.7);
        const colorMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00d2ff');
        const colorMesh = new RedGPU.Display.Mesh(redGPUContext, colorBoxGeometry, colorMaterial);
        colorMesh.setPosition(-1.5, -0.4, 1.5);
        scene.addChild(colorMesh);

        const bitmapBoxGeometry = new RedGPU.Primitive.Box(redGPUContext, 0.7, 0.7, 0.7);
        const bitmapTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg');
        const bitmapMaterial = new RedGPU.Material.BitmapMaterial(redGPUContext, bitmapTexture);
        const bitmapMesh = new RedGPU.Display.Mesh(redGPUContext, bitmapBoxGeometry, bitmapMaterial);
        bitmapMesh.setPosition(1.5, -0.4, 1.5);
        scene.addChild(bitmapMesh);

        const textField3D = new RedGPU.Display.TextField3D(redGPUContext, 'SSR Reflection');
        textField3D.color = '#ffffff';
        textField3D.background = 'rgba(20, 30, 50, 0.85)';
        textField3D.padding = 12;
        textField3D.borderRadius = 8;
        textField3D.worldSize = 0.45;
        textField3D.setPosition(0, -0.35, 1.5);
        scene.addChild(textField3D);

        const groundGeometry = new RedGPU.Primitive.Ground(redGPUContext, 100, 100);
        const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        groundMaterial.color.setColorByHEX('#7a5d4a');
        groundMaterial.metallic = 0.5;
        const ground = new RedGPU.Display.Mesh(redGPUContext, groundGeometry, groundMaterial);
        ground.y = -1;
        scene.addChild(ground);

        loadGLTFModels(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            floatingSphere.rotationY += 0.02;
            floatingSphere.y = Math.sin(time * 0.002) * 0.5;
            colorMesh.rotationY += 0.015;
            bitmapMesh.rotationY -= 0.015;
        });

        renderTestPane(redGPUContext, view, effect);
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

const renderTestPane = (redGPUContext, view, effect) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});
            folder.addBinding(view.builtInEffectManager, 'useSSR').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
            });

            const controls = [
                folder.addBinding(effect, 'maxSteps', {min: 1, max: 512, step: 1}),
                folder.addBinding(effect, 'maxDistance', {min: 1, max: 200, step: 0.1}),
                folder.addBinding(effect, 'stepSize', {min: 0.001, max: 5.0, step: 0.001}),
                folder.addBinding(effect, 'reflectionIntensity', {min: 0.0, max: 10.0, step: 0.01}),
                folder.addBinding(effect, 'fadeDistance', {min: 1, max: 100, step: 0.1}),
                folder.addBinding(effect, 'edgeFade', {min: 0.0, max: 0.5, step: 0.01})
            ];
        }
    });
};
