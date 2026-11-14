import * as RedGPU from "../../../../dist/index.js?t=1794639759027";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794639759027";

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 50;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] IBL 및 스카이박스 설정
        // [EN] Set up IBL and skybox
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;

        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        view.grid = true;

        const {particleEmitter, particleContainer} = createParticleTest(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // [KO] 이미터 컨테이너를 사인파 궤적으로 이동
            // [EN] Move the emitter container along a sine-wave trajectory
            particleContainer.x = Math.sin(time / 500) * 5;
            particleContainer.y = Math.cos(time / 500) * 5;
            particleContainer.z = Math.sin(time / 500) * 5;
        });

        renderTestPane(redGPUContext, particleEmitter);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createParticleTest = (redGPUContext, scene) => {
    // [KO] 파티클 중심점 시각화용 빨간색 구체 컨테이너
    // [EN] Red sphere container to visualize the particle origin
    const particleContainer = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
    );
    scene.addChild(particleContainer);

    const particleEmitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
    particleContainer.addChild(particleEmitter);

    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle2.png');
    particleEmitter.material.diffuseTexture = texture;
    particleEmitter.material.blendColorState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE;

    return {particleEmitter, particleContainer};
};

const renderTestPane = (redGPUContext, particleEmitter) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const particleFolder = pane.addFolder({title: 'particle', expanded: true});
            particleFolder.addBinding(particleEmitter, 'particleNum', {min: 0, max: 50000, step: 1});

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

            const lifeFolder = pane.addFolder({title: 'life', expanded: true});
            lifeFolder.addBinding(particleEmitter, 'minLife', {min: 0, max: 10000, step: 1});
            lifeFolder.addBinding(particleEmitter, 'maxLife', {min: 0, max: 10000, step: 1});

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

            const scaleFolder = pane.addFolder({title: 'scale', expanded: true});
            scaleFolder.addBlade({view: 'separator'});
            scaleFolder.addBinding(particleEmitter, 'minStartScale', {min: 0, max: 5});
            scaleFolder.addBinding(particleEmitter, 'maxStartScale', {min: 0, max: 5});
            scaleFolder.addBinding(particleEmitter, 'minEndScale', {min: 0, max: 5});
            scaleFolder.addBinding(particleEmitter, 'maxEndScale', {min: 0, max: 5});
            scaleFolder.addBinding(particleEmitter, 'easeScale', {options: RedGPU.Display.PARTICLE_EASE});

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
