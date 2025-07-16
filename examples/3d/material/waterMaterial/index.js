import * as RedGPU from "../../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 25;
		controller.speedDistance = 1.5;

		const scene = new RedGPU.Display.Scene();
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		view.axis = true;
		redGPUContext.addView(view);

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		const geometry = new RedGPU.Primitive.Ground(redGPUContext, 500, 500, 1000, 1000,10);
		// const geometry = new RedGPU.Primitive.Box(redGPUContext, 500, 500, 500,500,500, 500,1);
		const material = new RedGPU.Material.WaterMaterial(redGPUContext, '#4A90E2');

		// 🌊 개선된 Gerstner Wave 기반 displacement 텍스처
		material.displacementTexture = new RedGPU.Resource.SimplexTexture(redGPUContext, 1024, 1024, {
			mainLogic: `
				let time = uniforms.time;
				
				// 🌊 4개의 Gerstner Wave 레이어
				let wave1 = generateGerstnerWave(base_uv, time, 
					vec2<f32>(0.8, 0.6), uniforms.amplitude1, uniforms.frequency1, uniforms.speed1, uniforms.steepness1);
				let wave2 = generateGerstnerWave(base_uv, time, 
					vec2<f32>(-0.3, 0.9), uniforms.amplitude2, uniforms.frequency2, uniforms.speed2, uniforms.steepness2);
				let wave3 = generateGerstnerWave(base_uv, time, 
					vec2<f32>(0.5, -0.7), uniforms.amplitude3, uniforms.frequency3, uniforms.speed3, uniforms.steepness3);
				let wave4 = generateGerstnerWave(base_uv, time, 
					vec2<f32>(-0.9, -0.2), uniforms.amplitude4, uniforms.frequency4, uniforms.speed4, uniforms.steepness4);
				
				// 🎯 디테일 노이즈 레이어
				let detailNoise1 = getSimplexNoiseByDimension(
					base_uv * uniforms.detailScale1 + vec2<f32>(time * uniforms.detailSpeed1, 0.0), 
					uniforms
				) * uniforms.detailStrength1;
				
				let detailNoise2 = getSimplexNoiseByDimension(
					base_uv * uniforms.detailScale2 + vec2<f32>(0.0, time * uniforms.detailSpeed2), 
					uniforms
				) * uniforms.detailStrength2;
				
				// 🌊 웨이브 합성
				let combinedWaves = wave1 + wave2 + wave3 + wave4;
				let combinedDetail = detailNoise1 + detailNoise2;
				
				// 🎯 거품 효과 계산
				let foamThreshold = uniforms.foamThreshold;
				let foamIntensity = smoothstep(foamThreshold - 0.1, foamThreshold + 0.1, combinedWaves);
				
				// 🌊 최종 높이 계산
				let finalHeight = combinedWaves + combinedDetail * (1.0 - foamIntensity * 0.5);
				
				// 🎯 부드러운 정규화
				let normalizedHeight = smoothstep(-uniforms.waveRange, uniforms.waveRange, finalHeight);
				
				// 🌊 최종 색상 (높이 + 거품 정보)
				let finalColor = vec4<f32>(normalizedHeight, foamIntensity, 0.0, 1.0);
			`,

			helperFunctions: `
				// 🌊 개선된 Gerstner Wave 함수
				fn generateGerstnerWave(
					uv: vec2<f32>, 
					time: f32, 
					direction: vec2<f32>, 
					amplitude: f32, 
					frequency: f32, 
					speed: f32, 
					steepness: f32
				) -> f32 {
					let normalizedDir = normalize(direction);
					let phase = frequency * dot(normalizedDir, uv) + time * speed;
					let wave = amplitude * sin(phase);
					
					// 🎯 Gerstner Wave의 뾰족한 형태
					let gerstnerEffect = steepness * amplitude * cos(phase);
					
					return wave + gerstnerEffect * 0.5;
				}
				
				// 🌊 부드러운 블렌딩 함수
				fn smoothBlend(a: f32, b: f32, factor: f32) -> f32 {
					let t = smoothstep(0.0, 1.0, factor);
					return mix(a, b, t);
				}
			`,

			uniformStruct: `
				amplitude1: f32,
				frequency1: f32,
				speed1: f32,
				steepness1: f32,
				amplitude2: f32,
				frequency2: f32,
				speed2: f32,
				steepness2: f32,
				amplitude3: f32,
				frequency3: f32,
				speed3: f32,
				steepness3: f32,
				amplitude4: f32,
				frequency4: f32,
				speed4: f32,
				steepness4: f32,
				detailScale1: f32,
				detailSpeed1: f32,
				detailStrength1: f32,
				detailScale2: f32,
				detailSpeed2: f32,
				detailStrength2: f32,
				waveRange: f32,
				foamThreshold: f32,
			`,

			uniformDefaults: {
				// 🌊 Wave 1 - 주요 큰 파도
				amplitude1: 0.6,
				frequency1: 0.2,
				speed1: 1.0,
				steepness1: 0.4,
				// 🌊 Wave 2 - 중간 파도
				amplitude2: 0.4,
				frequency2: 0.3,
				speed2: 0.8,
				steepness2: 0.3,
				// 🌊 Wave 3 - 작은 파도
				amplitude3: 0.2,
				frequency3: 0.5,
				speed3: 1.2,
				steepness3: 0.2,
				// 🌊 Wave 4 - 디테일 파도
				amplitude4: 0.1,
				frequency4: 0.8,
				speed4: 1.5,
				steepness4: 0.1,
				// 🎯 디테일 노이즈
				detailScale1: 8.0,
				detailSpeed1: 0.5,
				detailStrength1: 0.1,
				detailScale2: 15.0,
				detailSpeed2: 0.3,
				detailStrength2: 0.05,
				// 🌊 전역 설정
				waveRange: 1.5,
				foamThreshold: 0.8
			}
		});

		// 🌊 물 색상 설정
		material.color.setColorByHEX('#4A90E2');
		material.transmissionFactor = 0.8;
		material.specularStrength = 1.2;

		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.primitiveState.cullMode = 'none';
		mesh.setPosition(0, 0, 0);
		// mesh.y = -250
		scene.addChild(mesh);

		const testData = {useAnimation: true};
		renderTestPane(redGPUContext, material.displacementTexture, testData);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			if (testData.useAnimation) {
				if (material.displacementTexture) {
					material.displacementTexture.time = time;
				}
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
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	const material = redGPUContext.viewList[0].scene.children[0].material;

	// 🌊 물 프리셋 정의
	const waterPresets = {
		calmOcean: {
			amplitude1: 0.3, frequency1: 0.1, speed1: 0.8, steepness1: 0.2,
			amplitude2: 0.2, frequency2: 0.15, speed2: 0.6, steepness2: 0.1,
			amplitude3: 0.1, frequency3: 0.2, speed3: 1.0, steepness3: 0.05,
			amplitude4: 0.05, frequency4: 0.3, speed4: 1.2, steepness4: 0.02,
			detailScale1: 6.0, detailSpeed1: 0.3, detailStrength1: 0.05,
			detailScale2: 12.0, detailSpeed2: 0.2, detailStrength2: 0.025,
			waveRange: 1.0, foamThreshold: 0.9
		},
		stormyOcean: {
			amplitude1: 1.5, frequency1: 0.08, speed1: 2.0, steepness1: 0.8,
			amplitude2: 1.0, frequency2: 0.12, speed2: 1.8, steepness2: 0.6,
			amplitude3: 0.8, frequency3: 0.2, speed3: 2.5, steepness3: 0.4,
			amplitude4: 0.6, frequency4: 0.3, speed4: 3.0, steepness4: 0.3,
			detailScale1: 10.0, detailSpeed1: 0.8, detailStrength1: 0.15,
			detailScale2: 20.0, detailSpeed2: 0.6, detailStrength2: 0.1,
			waveRange: 3.0, foamThreshold: 0.5
		},
		gentleWaves: {
			amplitude1: 0.6, frequency1: 0.2, speed1: 1.0, steepness1: 0.4,
			amplitude2: 0.4, frequency2: 0.3, speed2: 0.8, steepness2: 0.3,
			amplitude3: 0.2, frequency3: 0.5, speed3: 1.2, steepness3: 0.2,
			amplitude4: 0.1, frequency4: 0.8, speed4: 1.5, steepness4: 0.1,
			detailScale1: 8.0, detailSpeed1: 0.5, detailStrength1: 0.1,
			detailScale2: 15.0, detailSpeed2: 0.3, detailStrength2: 0.05,
			waveRange: 1.5, foamThreshold: 0.8
		},
		lakeRipples: {
			amplitude1: 0.2, frequency1: 0.4, speed1: 0.5, steepness1: 0.1,
			amplitude2: 0.15, frequency2: 0.6, speed2: 0.4, steepness2: 0.08,
			amplitude3: 0.1, frequency3: 0.8, speed3: 0.6, steepness3: 0.05,
			amplitude4: 0.05, frequency4: 1.2, speed4: 0.8, steepness4: 0.02,
			detailScale1: 15.0, detailSpeed1: 0.2, detailStrength1: 0.03,
			detailScale2: 25.0, detailSpeed2: 0.15, detailStrength2: 0.015,
			waveRange: 0.8, foamThreshold: 0.95
		}
	};

	// 🌊 프리셋 적용 함수
	const applyPreset = (preset) => {
		Object.entries(preset).forEach(([key, value]) => {
			targetNoiseTexture.updateUniform(key, value);
		});
		pane.refresh();
	};

	setSeparator(pane, "🌊 Water Presets");

	pane.addButton({title: '🌊 Calm Ocean'}).on('click', () => {
		applyPreset(waterPresets.calmOcean);
		material.color.setColorByHEX('#4A90E2');
		material.transmissionFactor = 0.9;
	});

	pane.addButton({title: '🌊 Stormy Ocean'}).on('click', () => {
		applyPreset(waterPresets.stormyOcean);
		material.color.setColorByHEX('#2E4F6B');
		material.transmissionFactor = 0.6;
	});

	pane.addButton({title: '🌊 Gentle Waves'}).on('click', () => {
		applyPreset(waterPresets.gentleWaves);
		material.color.setColorByHEX('#87CEEB');
		material.transmissionFactor = 0.8;
	});

	pane.addButton({title: '🏞️ Lake Ripples'}).on('click', () => {
		applyPreset(waterPresets.lakeRipples);
		material.color.setColorByHEX('#6BB6FF');
		material.transmissionFactor = 0.85;
	});

	setSeparator(pane, "🌊 Wave Parameters");

	// 🌊 개별 웨이브 컨트롤
	const wave1Folder = pane.addFolder({title: '🌊 Wave 1 (Primary)', expanded: false});
	wave1Folder.addBinding({amplitude1: 0.6}, 'amplitude1', {min: 0, max: 2, step: 0.1, label: 'Amplitude'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('amplitude1', ev.value));
	wave1Folder.addBinding({frequency1: 0.2}, 'frequency1', {min: 0, max: 1, step: 0.01, label: 'Frequency'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('frequency1', ev.value));
	wave1Folder.addBinding({speed1: 1.0}, 'speed1', {min: 0, max: 3, step: 0.1, label: 'Speed'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('speed1', ev.value));
	wave1Folder.addBinding({steepness1: 0.4}, 'steepness1', {min: 0, max: 1, step: 0.01, label: 'Steepness'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('steepness1', ev.value));

	const wave2Folder = pane.addFolder({title: '🌊 Wave 2 (Secondary)', expanded: false});
	wave2Folder.addBinding({amplitude2: 0.4}, 'amplitude2', {min: 0, max: 2, step: 0.1, label: 'Amplitude'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('amplitude2', ev.value));
	wave2Folder.addBinding({frequency2: 0.3}, 'frequency2', {min: 0, max: 1, step: 0.01, label: 'Frequency'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('frequency2', ev.value));
	wave2Folder.addBinding({speed2: 0.8}, 'speed2', {min: 0, max: 3, step: 0.1, label: 'Speed'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('speed2', ev.value));
	wave2Folder.addBinding({steepness2: 0.3}, 'steepness2', {min: 0, max: 1, step: 0.01, label: 'Steepness'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('steepness2', ev.value));

	// 🎯 디테일 노이즈 컨트롤
	const detailFolder = pane.addFolder({title: '🎯 Detail Noise', expanded: false});
	detailFolder.addBinding({detailScale1: 8.0}, 'detailScale1', {min: 1, max: 50, step: 1, label: 'Scale 1'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('detailScale1', ev.value));
	detailFolder.addBinding({detailStrength1: 0.1}, 'detailStrength1', {min: 0, max: 0.5, step: 0.01, label: 'Strength 1'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('detailStrength1', ev.value));
	detailFolder.addBinding({detailScale2: 15.0}, 'detailScale2', {min: 1, max: 50, step: 1, label: 'Scale 2'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('detailScale2', ev.value));
	detailFolder.addBinding({detailStrength2: 0.05}, 'detailStrength2', {min: 0, max: 0.5, step: 0.01, label: 'Strength 2'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('detailStrength2', ev.value));

	setSeparator(pane, "🌊 Global Settings");

	// 🌊 전역 설정
	pane.addBinding({waveRange: 1.5}, 'waveRange', {min: 0.1, max: 5, step: 0.1, label: 'Wave Range'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('waveRange', ev.value));
	pane.addBinding({foamThreshold: 0.8}, 'foamThreshold', {min: 0, max: 1, step: 0.01, label: 'Foam Threshold'})
		.on('change', (ev) => targetNoiseTexture.updateUniform('foamThreshold', ev.value));

	// 🌊 물 외관 설정
	setSeparator(pane, "🌊 Water Appearance");

	pane.addBinding(material.color, 'hex', {label: 'Water Color'});
	pane.addBinding(material.specularColor, 'hex', {label: 'Specular Color'});
	pane.addBinding(material, 'transmissionFactor', {min: 0, max: 1, step: 0.01, label: 'Transparency'});
	pane.addBinding(material, 'specularStrength', {min: 0, max: 2, step: 0.1, label: 'Specular Strength'});

	// 🌊 애니메이션 컨트롤
	const animationFolder = pane.addFolder({title: '🌊 Animation', expanded: true});
	animationFolder.addBinding(testData, 'useAnimation', {label: 'Enable Animation'});
	animationFolder.addBinding(targetNoiseTexture, 'animationSpeed', {min: 0, max: 0.5, step: 0.001, label: 'Animation Speed'});
	animationFolder.addBinding(targetNoiseTexture, 'animationX', {min: -1, max: 1, step: 0.01, label: 'X Direction'});
	animationFolder.addBinding(targetNoiseTexture, 'animationY', {min: -1, max: 1, step: 0.01, label: 'Y Direction'});

	// 🌊 기본 SimplexTexture 컨트롤
	setSeparator(pane, "🌊 Base Noise");
	pane.addBinding(targetNoiseTexture, 'frequency', {min: 0, max: 20, step: 0.1, label: 'Base Frequency'});
	pane.addBinding(targetNoiseTexture, 'amplitude', {min: 0, max: 5, step: 0.1, label: 'Base Amplitude'});
	pane.addBinding(targetNoiseTexture, 'octaves', {min: 1, max: 8, step: 1, label: 'Octaves'});
	pane.addBinding(targetNoiseTexture, 'persistence', {min: 0, max: 1, step: 0.01, label: 'Persistence'});
	pane.addBinding(targetNoiseTexture, 'lacunarity', {min: 1, max: 4, step: 0.1, label: 'Lacunarity'});
	pane.addBinding(targetNoiseTexture, 'seed', {min: 0, max: 1000, step: 1, label: 'Seed'});
	pane.addBinding(targetNoiseTexture, 'noiseDimension', {options: RedGPU.Resource.NOISE_DIMENSION, label: 'Noise Type'});
};
