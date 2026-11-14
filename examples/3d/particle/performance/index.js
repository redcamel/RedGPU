import * as RedGPU from "../../../../dist/index.js?t=1794650694512";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794650694512";

/**
 * [KO] 파티클 성능 테스트 예제
 * [EN] Particle performance test example
 *
 * [KO] 100개의 파티클 이미터를 동시에 렌더링하여 대량의 파티클 처리 성능을 테스트합니다.
 * [EN] Tests the performance of mass particle processing by rendering 100 particle emitters simultaneously.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 100;
        controller.tilt = -15;
        controller.distanceInterpolation = 0.7;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = null;
        view.grid = null;
        redGPUContext.addView(view);

        // [KO] IBL 및 스카이박스 설정
        // [EN] Set up IBL and skybox
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;

        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const {particleWrap} = createParticlePerformanceTest(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // [KO] 메인 파티클 컨테이너 애니메이션
            // [EN] Animate the main particle container
            particleWrap.x += Math.sin(time / 500);
            particleWrap.y += Math.cos(time / 500);
            particleWrap.z += Math.sin(time / 500);
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createParticlePerformanceTest = (redGPUContext, scene) => {
    const texture1 = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle.png');
    const texture2 = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle2.png');

    // [KO] 메인 파티클 래퍼 (중심점 표시용 구체)
    // [EN] Main particle wrapper (sphere indicating the origin)
    const particleWrap = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
    );
    scene.addChild(particleWrap);

    const mainEmitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
    mainEmitter.material.diffuseTexture = texture2;
    particleWrap.addChild(mainEmitter);

    // [KO] 추가 100개의 이미터 생성
    // [EN] Create 100 additional particle emitters
    let i = 100;
    while (i--) {
        const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
        emitter.setPosition(
            Math.random() * 50 - 25,
            Math.random() * 50 - 25,
            Math.random() * 50 - 25
        );
        emitter.material.diffuseTexture = Math.random() > 0.5 ? texture1 : texture2;
        emitter.material.blendColorState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE;
        scene.addChild(emitter);
    }

    return {particleWrap};
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
