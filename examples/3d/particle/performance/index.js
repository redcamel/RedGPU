import * as RedGPU from "../../../../dist/index.js?t=1781137785306";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781137785306";

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
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 100;
        controller.tilt = -15;
        controller.distanceInterpolation = 0.7;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = null;
        view.grid = null;
        redGPUContext.addView(view);

        // 2. IBL 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;

        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // 3. 파티클 성능 테스트 생성
        const {particleWrap} = createParticlePerformanceTest(redGPUContext, scene);

        // 4. 애니메이션 렌더 루프 및 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // 메인 파티클 컨테이너 애니메이션
            particleWrap.x += Math.sin(time / 500);
            particleWrap.y += Math.cos(time / 500);
            particleWrap.z += Math.sin(time / 500);
        });

        // 5. 테스트 GUI 설정
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 성능 테스트를 위한 대량의 파티클 이미터들을 생성합니다.
 * [EN] Creates a large number of particle emitters for performance testing.
 */
const createParticlePerformanceTest = (redGPUContext, scene) => {
    const texture1 = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle.png');
    const texture2 = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle2.png');

    // 메인 파티클 래퍼 (중심점 표시용 구체)
    const particleWrap = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
    );
    scene.addChild(particleWrap);

    // 메인 이미터 추가
    const mainEmitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
    mainEmitter.material.diffuseTexture = texture2;
    particleWrap.addChild(mainEmitter);

    // 추가 100개의 이미터 생성
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

/**
 * [KO] 예제 도우미 패널을 렌더링합니다.
 * [EN] Renders the example helper panel.
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
