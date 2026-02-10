import * as RedGPU from "../dist/index.js?t=1770698056099";

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'redGPUCanvas')
document.body.appendChild(canvas);
RedGPU.init(
    canvas,
    redGPUContext => {
        // redGPUContext.useMSAA=false
        const controllerTest = new RedGPU.Camera.PerspectiveCamera(redGPUContext);

        // controllerTest.tilt = -10
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controllerTest);

        const directionalLightTest = new RedGPU.Light.DirectionalLight()
        directionalLightTest.color.r = 255
        directionalLightTest.color.g = 255
        directionalLightTest.color.b = 255
        directionalLightTest.intensity = 1

        scene.lightManager.addDirectionalLight(directionalLightTest)

        const tEffect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
        const tEffect2 = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
        tEffect2.amount = 0
        view.postEffectManager.addEffect(tEffect)
        view.postEffectManager.addEffect(tEffect2)
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, './assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture)
        view.ibl = ibl
        const renderer = new RedGPU.Renderer(redGPUContext)

        //
        let model;

        function loadGLTF(url) {
            new RedGPU.GLTFLoader(
                redGPUContext,
                url,
                (v) => {
                    console.log('GLTFLoader ', v)
                    console.log('GLTFLoader parsingResult', v.parsingResult)
                    scene.addChild(model = v['resultMesh'])
                    model.setScale(redGPUContext.detector.isMobile ? 0.5 : 10)
                    console.log(model)
                }
            )
        }

        const modelURL = redGPUContext.detector.isMobile ? 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb' : 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb'
        loadGLTF(modelURL);

        // loadGLTF('./assets/gltf/busterDrone/busterDrone.gltf');
        const render = (time) => {
            directionalLightTest.direction[0] = Math.sin(time / 1500)
            directionalLightTest.direction[1] = -1
            directionalLightTest.direction[2] = Math.cos(time / 1500)
            if (model) {
                model.rotationY += 0.5
            }
            controllerTest.x = Math.sin(time / 2000) * 3
            controllerTest.y = Math.cos(time / 2500) * 2 + 1.5
            controllerTest.z = Math.cos(time / 1500) * 2
            controllerTest.lookAt(0, 0, 0)

        }
        renderer.start(redGPUContext, render)
    },
    failReason => {
        console.log('실패', failReason)
        const t0 = document.createElement('div')
        document.body.appendChild(t0)
        t0.innerHTML = failReason
    },
)
