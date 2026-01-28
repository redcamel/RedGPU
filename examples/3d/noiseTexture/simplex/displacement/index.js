import * as RedGPU from "../../../../../dist/index.js?t=1769587130347";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 55;
        controller.speedDistance = 2;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.intensity = 2;
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const geometry = new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 1000, 1000);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);

        material.displacementTexture = new RedGPU.Resource.SimplexTexture(redGPUContext, 1024, 1024, {
            mainLogic: `
					let uv = vec2<f32>(
						(base_uv.x + uniforms.time * ( uniforms.animationX * uniforms.animationSpeed )) , 
						(base_uv.y + uniforms.time * ( uniforms.animationY * uniforms.animationSpeed )) 
					);
					let noiseValue = getSimplexNoiseByDimension(uv, uniforms);
					let displacement = (noiseValue - 0.5) * uniforms.strength;
					let normalizedDisplacement = clamp(displacement * 0.5 + 0.5, 0.0, 1.0);
					let finalColor = vec4<f32>(normalizedDisplacement, normalizedDisplacement, normalizedDisplacement, 1.0);
			`,
            uniformStruct: `
				strength: f32,
			`,
            uniformDefaults: {
                strength: 2.0
            }
        });

        material.color.setColorByHEX('#0a3a0a')

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.primitiveState.cullMode = 'none';
        mesh.setPosition(0, 0, 0);
        scene.addChild(mesh);

        const testData = {useAnimation: true};
        renderTestPane(redGPUContext, material.displacementTexture, testData);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            if (testData.useAnimation) {
                if (material.displacementTexture) material.displacementTexture.time = time;
            }
        });
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "18px";
        errorMessage.style.padding = "20px";
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext, targetNoiseTexture, testData) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769587130347');
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../../exampleHelper/createExample/panes/index.js?t=1769587130347");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    setSeparator(pane, "Presets");

    pane.addButton({title: '🏔️ Mountain Peaks'}).on('click', () => {
        targetNoiseTexture.frequency = 3.0;
        targetNoiseTexture.amplitude = 2.5;
        targetNoiseTexture.octaves = 6;
        targetNoiseTexture.persistence = 0.65;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 42;
        targetNoiseTexture.updateUniform('strength', 2.5);
        pane.refresh();
    });

    pane.addButton({title: '🌊 Ocean Waves'}).on('click', () => {
        targetNoiseTexture.frequency = 6.0;
        targetNoiseTexture.amplitude = 1.8;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.4;
        targetNoiseTexture.lacunarity = 2.5;
        targetNoiseTexture.seed = 123;
        targetNoiseTexture.updateUniform('strength', 1.8);
        pane.refresh();
    });

    pane.addButton({title: '🌋 Lava Flow'}).on('click', () => {
        targetNoiseTexture.frequency = 4.0;
        targetNoiseTexture.amplitude = 3.0;
        targetNoiseTexture.octaves = 5;
        targetNoiseTexture.persistence = 0.8;
        targetNoiseTexture.lacunarity = 1.8;
        targetNoiseTexture.seed = 999;
        targetNoiseTexture.updateUniform('strength', 3.0);
        pane.refresh();
    });

    pane.addButton({title: '👤 Facial Features'}).on('click', () => {
        targetNoiseTexture.frequency = 12.0;
        targetNoiseTexture.amplitude = 0.8;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.5;
        targetNoiseTexture.lacunarity = 2.2;
        targetNoiseTexture.seed = 666;
        targetNoiseTexture.updateUniform('strength', 0.8);
        pane.refresh();
    });

    pane.addButton({title: '🪨 Rock Formation'}).on('click', () => {
        targetNoiseTexture.frequency = 5.0;
        targetNoiseTexture.amplitude = 2.2;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.6;
        targetNoiseTexture.lacunarity = 3.0;
        targetNoiseTexture.seed = 777;
        targetNoiseTexture.updateUniform('strength', 2.2);
        pane.refresh();
    });

    pane.addButton({title: '🏜️ Sand Waves'}).on('click', () => {
        targetNoiseTexture.frequency = 2.5;
        targetNoiseTexture.amplitude = 1.5;
        targetNoiseTexture.octaves = 3;
        targetNoiseTexture.persistence = 0.7;
        targetNoiseTexture.lacunarity = 1.5;
        targetNoiseTexture.seed = 333;
        targetNoiseTexture.updateUniform('strength', 1.5);
        pane.refresh();
    });

    pane.addButton({title: '🪸 Coral Spikes'}).on('click', () => {
        targetNoiseTexture.frequency = 15.0;
        targetNoiseTexture.amplitude = 1.2;
        targetNoiseTexture.octaves = 6;
        targetNoiseTexture.persistence = 0.85;
        targetNoiseTexture.lacunarity = 2.8;
        targetNoiseTexture.seed = 555;
        targetNoiseTexture.updateUniform('strength', 1.2);
        pane.refresh();
    });

    pane.addButton({title: '🌳 Tree Trunk'}).on('click', () => {
        targetNoiseTexture.frequency = 8.0;
        targetNoiseTexture.amplitude = 1.0;
        targetNoiseTexture.octaves = 5;
        targetNoiseTexture.persistence = 0.6;
        targetNoiseTexture.lacunarity = 2.1;
        targetNoiseTexture.seed = 888;
        targetNoiseTexture.updateUniform('strength', 1.0);
        pane.refresh();
    });

    pane.addButton({title: '🏗️ Concrete Cracks'}).on('click', () => {
        targetNoiseTexture.frequency = 20.0;
        targetNoiseTexture.amplitude = 0.4;
        targetNoiseTexture.octaves = 3;
        targetNoiseTexture.persistence = 0.8;
        targetNoiseTexture.lacunarity = 3.5;
        targetNoiseTexture.seed = 111;
        targetNoiseTexture.updateUniform('strength', 0.4);
        pane.refresh();
    });

    pane.addButton({title: '🪙 Hammered Metal'}).on('click', () => {
        targetNoiseTexture.frequency = 25.0;
        targetNoiseTexture.amplitude = 0.6;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.4;
        targetNoiseTexture.lacunarity = 2.8;
        targetNoiseTexture.seed = 222;
        targetNoiseTexture.updateUniform('strength', 0.6);
        pane.refresh();
    });

    pane.addButton({title: '🧊 Ice Formations'}).on('click', () => {
        targetNoiseTexture.frequency = 7.0;
        targetNoiseTexture.amplitude = 2.8;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.7;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 444;
        targetNoiseTexture.updateUniform('strength', 2.8);
        pane.refresh();
    });

    pane.addButton({title: '🍄 Mushroom Caps'}).on('click', () => {
        targetNoiseTexture.frequency = 10.0;
        targetNoiseTexture.amplitude = 1.4;
        targetNoiseTexture.octaves = 3;
        targetNoiseTexture.persistence = 0.6;
        targetNoiseTexture.lacunarity = 1.9;
        targetNoiseTexture.seed = 666;
        targetNoiseTexture.updateUniform('strength', 1.4);
        pane.refresh();
    });

    pane.addButton({title: '🌪️ Tornado Swirl'}).on('click', () => {
        targetNoiseTexture.frequency = 4.0;
        targetNoiseTexture.amplitude = 4.0;
        targetNoiseTexture.octaves = 5;
        targetNoiseTexture.persistence = 0.9;
        targetNoiseTexture.lacunarity = 1.6;
        targetNoiseTexture.seed = 777;
        targetNoiseTexture.updateUniform('strength', 4.0);
        pane.refresh();
    });

    pane.addButton({title: '🦴 Bone Structure'}).on('click', () => {
        targetNoiseTexture.frequency = 18.0;
        targetNoiseTexture.amplitude = 0.8;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.5;
        targetNoiseTexture.lacunarity = 2.4;
        targetNoiseTexture.seed = 999;
        targetNoiseTexture.updateUniform('strength', 0.8);
        pane.refresh();
    });

    pane.addButton({title: '🌍 Planet Surface'}).on('click', () => {
        targetNoiseTexture.frequency = 1.5;
        targetNoiseTexture.amplitude = 5.0;
        targetNoiseTexture.octaves = 7;
        targetNoiseTexture.persistence = 0.7;
        targetNoiseTexture.lacunarity = 2.2;
        targetNoiseTexture.seed = 1234;
        targetNoiseTexture.updateUniform('strength', 5.0);
        pane.refresh();
    });

    pane.addButton({title: '🔥 Fire Distortion'}).on('click', () => {
        targetNoiseTexture.frequency = 30.0;
        targetNoiseTexture.amplitude = 0.5;
        targetNoiseTexture.octaves = 2;
        targetNoiseTexture.persistence = 0.3;
        targetNoiseTexture.lacunarity = 4.0;
        targetNoiseTexture.seed = 555;
        targetNoiseTexture.updateUniform('strength', 0.5);
        pane.refresh();
    });

    setSeparator(pane, "Parameters");

    pane.addBinding(targetNoiseTexture, 'frequency', {
        min: 0,
        max: 30,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'amplitude', {
        min: 0,
        max: 10,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'octaves', {
        min: 1,
        max: 8,
        step: 1
    });

    pane.addBinding(targetNoiseTexture, 'persistence', {
        min: 0,
        max: 1,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'lacunarity', {
        min: 0,
        max: 10,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'seed', {
        min: 0,
        max: 1000,
        step: 0.01
    });

    const strengthBinding = pane.addBinding({strength: 2.0}, 'strength', {
        min: 0,
        max: 5,
        step: 0.01
    });
    strengthBinding.on('change', (ev) => {
        targetNoiseTexture.updateUniform('strength', ev.value);
    });

    pane.addBinding(targetNoiseTexture, 'noiseDimension', {
        options: RedGPU.Resource.NOISE_DIMENSION
    });

    const animation = pane.addFolder({title: 'Animation', expanded: true});
    animation.addBinding(testData, 'useAnimation');
    animation.addBinding(targetNoiseTexture, 'animationSpeed', {
        min: 0,
        max: 1,
        step: 0.001
    });
    animation.addBinding(targetNoiseTexture, 'animationX', {
        min: -1,
        max: 1,
        step: 0.001
    });
    animation.addBinding(targetNoiseTexture, 'animationY', {
        min: -1,
        max: 1,
        step: 0.001
    });
};
