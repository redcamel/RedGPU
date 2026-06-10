import * as RedGPU from "../../../dist/index.js?t=1781133866175";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1781133866175";

/**
 * [KO] SSR 예제
 * [EN] SSR example
 *
 * [KO] Screen Space Reflection (SSR) 효과를 시연합니다.
 * [EN] Demonstrates the Screen Space Reflection (SSR) effect.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(canvas, (redGPUContext) => {

    // 카메라 및 컨트롤러 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;
    controller.tilt = -15;

    const scene = new RedGPU.Display.Scene();

    // IBL(환경광) 및 스카이박스 설정
    const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

    // 2. 뷰(View) 생성 및 SSR 설정
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    // SSR(실시간 반사) 활성화
    view.postEffectManager.useSSR = true;
    redGPUContext.addView(view);

    // 3. 조명 설정
    const directionalLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(directionalLight);

    // 4. 오브젝트 생성

    // [A] 공중에 떠 있는 오렌지색 구체
    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 32, 16);
    const orangeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    orangeMaterial.color.setColorByHEX('#af532e');
    orangeMaterial.useSSR = true; // SSR 대상 설정
    orangeMaterial.metallic = 0.1;

    const floatingSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, orangeMaterial);
    floatingSphere.x = -1.5;
    scene.addChild(floatingSphere);

    // [B] 바닥 (거울처럼 반사되는 평면)
    const groundGeometry = new RedGPU.Primitive.Ground(redGPUContext, 100, 100);
    const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    groundMaterial.color.setColorByHEX('#7a5d4a');
    groundMaterial.useSSR = true;
    groundMaterial.metallic = 0.5;

    const ground = new RedGPU.Display.Mesh(redGPUContext, groundGeometry, groundMaterial);
    ground.y = -1;
    scene.addChild(ground);

    // [C] 외부 GLTF 모델 로드
    loadGLTFModels(redGPUContext, scene);

    // 5. 애니메이션 및 렌더링 시작
    let time = 0;
    const renderer = new RedGPU.Renderer();

    renderer.start(redGPUContext, () => {
        time += 0.01;

        if (floatingSphere) {
            floatingSphere.rotationY += 0.02;
            floatingSphere.y = Math.sin(time) * 0.5;
        }
    });

    // [KO] RedGPUExampleHelper 초기화
    // [EN] Initialize RedGPUExampleHelper
    renderTestPane(redGPUContext);
});

/**
 * [KO] RedGPUExampleHelper 초기화
 * [EN] Initialize RedGPUExampleHelper
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
function renderTestPane(redGPUContext) {
    const view = redGPUContext.viewList[0];
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const ssrFolder = pane.addFolder({title: 'SSR 옵션 조절'});
            const ssr = view.postEffectManager.ssr;

            ssrFolder.addBinding(view.postEffectManager, 'useSSR', {label: 'SSR 활성화'});

            const params = [
                {key: 'maxSteps', min: 16, max: 128, step: 1},
                {key: 'maxDistance', min: 1, max: 50, step: 0.1},
                {key: 'stepSize', min: 0.001, max: 0.1, step: 0.001},
                {key: 'reflectionIntensity', min: 0.0, max: 5.0, step: 0.01},
                {key: 'fadeDistance', min: 1, max: 25, step: 0.1},
                {key: 'edgeFade', min: 0.0, max: 0.5, step: 0.01}
            ];

            params.forEach(p => ssrFolder.addBinding(ssr, p.key, {min: p.min, max: p.max, step: p.step}));
        }
    });
}


/**
 * GLTF 모델 로딩 함수
 */
function loadGLTFModels(redGPUContext, scene) {
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
}
