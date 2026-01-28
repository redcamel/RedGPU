import * as RedGPU from "../../../../dist/index.js?t=1769587130347";
import {setSeparator} from "../../../exampleHelper/createExample/panes/index.js?t=1769587130347";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controllerTest = new RedGPU.Camera.OrbitController(redGPUContext);
        controllerTest.distance = 50
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controllerTest);

        redGPUContext.addView(view);
        const cubeTexture =
            new RedGPU.Resource.CubeTexture(redGPUContext, [
                "../../../assets/skybox/px.jpg", // Positive X
                "../../../assets/skybox/nx.jpg", // Negative X
                "../../../assets/skybox/py.jpg", // Positive Y
                "../../../assets/skybox/ny.jpg", // Negative Y
                "../../../assets/skybox/pz.jpg", // Positive Z
                "../../../assets/skybox/nz.jpg", // Negative Z
            ])
        // view.iblTexture = cubeTexture
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture)
        const texture_particle2 = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle2.png');
        const testParticleWrap = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Sphere(redGPUContext),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
        )
        scene.addChild(testParticleWrap)
        const testParticle = new RedGPU.Display.ParticleEmitter(redGPUContext)
        testParticleWrap.addChild(testParticle)
        testParticle.material.diffuseTexture = texture_particle2
        testParticle.material.blendColorState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE

        const renderer = new RedGPU.Renderer(redGPUContext)

        const render = (time) => {
            redGPUContext.viewList.forEach(view => {

            })
            //
            testParticleWrap.x += Math.sin(time / 500) * 0.5
            testParticleWrap.y += Math.cos(time / 500) * 0.5
            testParticleWrap.z += Math.sin(time / 500) * 0.5

        }
        renderer.start(redGPUContext, render)
        renderTestPane(redGPUContext, testParticle)
    },
    (failReason) => {
        // Handle initialization failure
        console.error('Initialization failed:', failReason); // 초기화 실패 로그 출력
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason; // 실패 원인 메시지를 표시
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext, testParticle) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769587130347');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769587130347");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    {
        {
            const folder = pane.addFolder({
                title: 'particle',
                expanded: true
            })
            folder.addBinding(testParticle, 'particleNum', {min: 0, max: 50000, step: 1})
        }
        {
            const folder = pane.addFolder({
                title: 'geometry material',
                expanded: true
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'useBillboard')

            folder.addBinding({texture: '../../../assets/particle/particle2.png'}, 'texture', {
                options: {
                    texture0: '../../../assets/particle/particle2.png',
                    texture1: '../../../assets/particle/particle.png',
                }
            }).on('change', e => {
                testParticle.material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, e.value);
            })
            folder.addBinding({geometry: 'Plane'}, 'geometry', {
                options: {
                    Plane: 'Plane',
                    Box: 'Box',
                    Sphere: 'Sphere',
                }
            }).on('change', e => {
                testParticle.geometry = new RedGPU.Primitive[e.value](redGPUContext);

            })
        }
        {
            const folder = pane.addFolder({
                title: 'life',
                expanded: true
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minLife', {min: 0, max: 10000, step: 1})
            folder.addBinding(testParticle, 'maxLife', {min: 0, max: 10000, step: 1})

        }

        {
            const folder = pane.addFolder({
                title: 'position',
                expanded: true
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minStartX', {min: -20, max: 20})
            folder.addBinding(testParticle, 'maxStartX', {min: -20, max: 20})
            folder.addBinding(testParticle, 'minEndX', {min: -20, max: 20})
            folder.addBinding(testParticle, 'maxEndX', {min: -20, max: 20})
            folder.addBinding(testParticle, 'easeX', {
                options: RedGPU.Display.PARTICLE_EASE
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minStartY', {min: -20, max: 20})
            folder.addBinding(testParticle, 'maxStartY', {min: -20, max: 20})
            folder.addBinding(testParticle, 'minEndY', {min: -20, max: 20})
            folder.addBinding(testParticle, 'maxEndY', {min: -20, max: 20})
            folder.addBinding(testParticle, 'easeY', {
                options: RedGPU.Display.PARTICLE_EASE
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minStartZ', {min: -20, max: 20})
            folder.addBinding(testParticle, 'maxStartZ', {min: -20, max: 20})
            folder.addBinding(testParticle, 'minEndY', {min: -20, max: 20})
            folder.addBinding(testParticle, 'maxEndY', {min: -20, max: 20})
            folder.addBinding(testParticle, 'easeZ', {
                options: RedGPU.Display.PARTICLE_EASE
            })
            setSeparator(folder)

        }

        {
            const folder = pane.addFolder({
                title: 'rotation',
                expanded: false
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minStartRotationX', {min: 0, max: 360})
            folder.addBinding(testParticle, 'maxStartRotationX', {min: 0, max: 360})
            folder.addBinding(testParticle, 'minEndRotationX', {min: 0, max: 360})
            folder.addBinding(testParticle, 'maxEndRotationX', {min: 0, max: 360})
            folder.addBinding(testParticle, 'easeRotationX', {
                options: RedGPU.Display.PARTICLE_EASE
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minStartRotationY', {min: 0, max: 360})
            folder.addBinding(testParticle, 'maxStartRotationY', {min: 0, max: 360})
            folder.addBinding(testParticle, 'minEndRotationY', {min: 0, max: 360})
            folder.addBinding(testParticle, 'maxEndRotationY', {min: 0, max: 360})
            folder.addBinding(testParticle, 'easeRotationY', {
                options: RedGPU.Display.PARTICLE_EASE
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minStartRotationZ', {min: 0, max: 360})
            folder.addBinding(testParticle, 'maxStartRotationZ', {min: 0, max: 360})
            folder.addBinding(testParticle, 'minEndRotationZ', {min: 0, max: 360})
            folder.addBinding(testParticle, 'maxEndRotationZ', {min: 0, max: 360})
            folder.addBinding(testParticle, 'easeRotationZ', {
                options: RedGPU.Display.PARTICLE_EASE
            })
        }

        {
            const folder = pane.addFolder({
                title: 'scale',
                expanded: true
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minStartScale', {min: 0, max: 5})
            folder.addBinding(testParticle, 'maxStartScale', {min: 0, max: 5})
            folder.addBinding(testParticle, 'minEndScale', {min: 0, max: 5})
            folder.addBinding(testParticle, 'maxEndScale', {min: 0, max: 5})
            folder.addBinding(testParticle, 'easeScale', {
                options: RedGPU.Display.PARTICLE_EASE
            })
        }

        {
            const folder = pane.addFolder({
                title: 'alpha',
                expanded: false
            })
            setSeparator(folder)
            folder.addBinding(testParticle, 'minStartAlpha', {min: 0, max: 1})
            folder.addBinding(testParticle, 'maxStartAlpha', {min: 0, max: 1})
            folder.addBinding(testParticle, 'minEndAlpha', {min: 0, max: 1})
            folder.addBinding(testParticle, 'maxEndAlpha', {min: 0, max: 1})
            folder.addBinding(testParticle, 'easeAlpha', {
                options: RedGPU.Display.PARTICLE_EASE
            })
        }
    }
};
