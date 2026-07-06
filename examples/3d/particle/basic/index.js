import * as RedGPU from "../../../../dist/index.js?t=1783324948992";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783324948992";

/**
 * [KO] 파티클 기본 예제
 * [EN] Particle basic example
 *
 * [KO] 기본적인 파티클 이미터를 생성하고 다양한 속성(수명, 위치, 회전, 크기 등)을 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a basic particle emitter and control various properties (life, position, rotation, scale, etc.).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 50;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 2. IBL 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;

        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        view.grid = true;

        // 3. 파티클 설정
        const {particleEmitter, particleContainer} = createParticleTest(redGPUContext, scene);

        // 4. 애니메이션 렌더 루프 및 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // 이미터 컨테이너를 사인파 궤적으로 이동시킵니다.
            particleContainer.x = Math.sin(time / 500) * 5;
            particleContainer.y = Math.cos(time / 500) * 5;
            particleContainer.z = Math.sin(time / 500) * 5;
        });

        // 5. 테스트 GUI 설정
        renderTestPane(redGPUContext, particleEmitter);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트를 위한 파티클 이미터와 컨테이너를 생성합니다.
 * [EN] Creates a particle emitter and container for testing.
 */
const createParticleTest = (redGPUContext, scene) => {
    // 파티클의 중심점을 시각화하기 위한 빨간색 구체 컨테이너
    const particleContainer = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
    );
    scene.addChild(particleContainer);

    // 파티클 이미터 생성
    const particleEmitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
    particleContainer.addChild(particleEmitter);

    // 기본 텍스처 및 블렌딩 설정
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle2.png');
    particleEmitter.material.diffuseTexture = texture;
    particleEmitter.material.blendColorState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE;

    return {particleEmitter, particleContainer};
};

/**
 * [KO] 테스트용 GUI를 렌더링하고 파티클 속성을 제어합니다.
 * [EN] Renders the GUI for testing and controls particle properties.
 */
const renderTestPane = (redGPUContext, particleEmitter) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // particle 폴더
            const particleFolder = pane.addFolder({title: 'particle', expanded: true});
            particleFolder.addBinding(particleEmitter, 'particleNum', {min: 0, max: 50000, step: 1});

            // geometry material 폴더
            const assetFolder = pane.addFolder({title: 'geometry material', expanded: true});
            assetFolder.addBinding(particleEmitter, 'useBillboard');
            assetFolder.addBinding({texture: '../../../assets/particle/particle2.png'}, 'texture', {
                options: {
                    texture0: '../../../assets/particle/particle2.png',
                    texture1: '../../../assets/particle/particle.png',
                }
            }).on('change', ev => {
                particleEmitter.material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, ev.value);
            });
            assetFolder.addBinding({geometry: 'Plane'}, 'geometry', {
                options: {Plane: 'Plane', Box: 'Box', Sphere: 'Sphere'}
            }).on('change', ev => {
                particleEmitter.geometry = new RedGPU.Primitive[ev.value](redGPUContext);
            });

            // life 폴더
            const lifeFolder = pane.addFolder({title: 'life', expanded: true});
            lifeFolder.addBinding(particleEmitter, 'minLife', {min: 0, max: 10000, step: 1});
            lifeFolder.addBinding(particleEmitter, 'maxLife', {min: 0, max: 10000, step: 1});

            // position 폴더
            const posFolder = pane.addFolder({title: 'position', expanded: true});
            posFolder.addBlade({view: 'separator'});
            posFolder.addBinding(particleEmitter, 'minStartX', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'maxStartX', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'minEndX', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'maxEndX', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'easeX', {options: RedGPU.Display.PARTICLE_EASE});
            posFolder.addBlade({view: 'separator'});
            posFolder.addBinding(particleEmitter, 'minStartY', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'maxStartY', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'minEndY', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'maxEndY', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'easeY', {options: RedGPU.Display.PARTICLE_EASE});
            posFolder.addBlade({view: 'separator'});
            posFolder.addBinding(particleEmitter, 'minStartZ', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'maxStartZ', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'minEndZ', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'maxEndZ', {min: -20, max: 20});
            posFolder.addBinding(particleEmitter, 'easeZ', {options: RedGPU.Display.PARTICLE_EASE});

            // rotation 폴더
            const rotFolder = pane.addFolder({title: 'rotation', expanded: true});
            rotFolder.addBlade({view: 'separator'});
            rotFolder.addBinding(particleEmitter, 'minStartRotationX', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'maxStartRotationX', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'minEndRotationX', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'maxEndRotationX', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'easeRotationX', {options: RedGPU.Display.PARTICLE_EASE});
            rotFolder.addBlade({view: 'separator'});
            rotFolder.addBinding(particleEmitter, 'minStartRotationY', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'maxStartRotationY', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'minEndRotationY', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'maxEndRotationY', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'easeRotationY', {options: RedGPU.Display.PARTICLE_EASE});
            rotFolder.addBlade({view: 'separator'});
            rotFolder.addBinding(particleEmitter, 'minStartRotationZ', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'maxStartRotationZ', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'minEndRotationZ', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'maxEndRotationZ', {min: 0, max: 360});
            rotFolder.addBinding(particleEmitter, 'easeRotationZ', {options: RedGPU.Display.PARTICLE_EASE});

            // scale 폴더
            const scaleFolder = pane.addFolder({title: 'scale', expanded: true});
            scaleFolder.addBlade({view: 'separator'});
            scaleFolder.addBinding(particleEmitter, 'minStartScale', {min: 0, max: 5});
            scaleFolder.addBinding(particleEmitter, 'maxStartScale', {min: 0, max: 5});
            scaleFolder.addBinding(particleEmitter, 'minEndScale', {min: 0, max: 5});
            scaleFolder.addBinding(particleEmitter, 'maxEndScale', {min: 0, max: 5});
            scaleFolder.addBinding(particleEmitter, 'easeScale', {options: RedGPU.Display.PARTICLE_EASE});

            // alpha 폴더
            const alphaFolder = pane.addFolder({title: 'alpha', expanded: true});
            alphaFolder.addBlade({view: 'separator'});
            alphaFolder.addBinding(particleEmitter, 'minStartAlpha', {min: 0, max: 1});
            alphaFolder.addBinding(particleEmitter, 'maxStartAlpha', {min: 0, max: 1});
            alphaFolder.addBinding(particleEmitter, 'minEndAlpha', {min: 0, max: 1});
            alphaFolder.addBinding(particleEmitter, 'maxEndAlpha', {min: 0, max: 1});
            alphaFolder.addBinding(particleEmitter, 'easeAlpha', {options: RedGPU.Display.PARTICLE_EASE});
        }
    });
};
