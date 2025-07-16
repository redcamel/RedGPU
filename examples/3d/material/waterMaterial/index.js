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
		directionalLight.intensity = 1.5;
		scene.lightManager.addDirectionalLight(directionalLight);

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);
		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		const geometry = new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 1000, 1000);
		const material = new RedGPU.Material.WaterMaterial(redGPUContext);

		material.displacementTexture = new RedGPU.Resource.SimplexTexture(redGPUContext, 2048, 2048, {
			mainLogic: `
        let time = uniforms.time;
        
        // 🌊 웨이브 UV 계산
        let wave1_uv = vec2<f32>(base_uv.x * 0.5 + time * 0.02, base_uv.y * 0.3 + time * 0.015);
        let wave2_uv = vec2<f32>(base_uv.x * 1.2 - time * 0.025, base_uv.y * 0.8 + time * 0.03);
        let wave3_uv = vec2<f32>(base_uv.x * 2.5 + time * 0.05, base_uv.y * 1.8 - time * 0.04);
        let diagonal_uv = vec2<f32>(base_uv.x * 1.5 + base_uv.y * 0.3 + time * 0.02, base_uv.y * 1.2 - base_uv.x * 0.2 + time * 0.018);
        
        // 🎯 정규화된 노이즈 값 (각각 -1~1 범위)
        let noise1 = getSimplexNoiseByDimension(wave1_uv, uniforms) * 0.6;
        let noise2 = getSimplexNoiseByDimension(wave2_uv, uniforms) * 0.3;
        let noise3 = getSimplexNoiseByDimension(wave3_uv, uniforms) * 0.15;
        let noise4 = getSimplexNoiseByDimension(diagonal_uv, uniforms) * 0.25;
        
        // 🌊 사인파 (각각 정규화)
        let sinWave1 = sin(base_uv.x * 15.0 + time * 2.0) * 0.1;
        let sinWave2 = sin(base_uv.y * 12.0 + time * 1.5) * 0.08;
        let sinWave3 = sin((base_uv.x + base_uv.y) * 8.0 + time * 1.8) * 0.06;
        
        // 🎯 합성 (전체 가중치 합이 1.0 이하가 되도록)
        let combinedNoise = noise1 + noise2 + noise3 + noise4;      // 최대 약 ±1.3
        let combinedSin = sinWave1 + sinWave2 + sinWave3;           // 최대 약 ±0.24
        
        // 🌊 정규화 후 strength 적용
        let normalizedBase = (combinedNoise + combinedSin) * 0.5;   // 범위를 약 ±0.77로 조정
        let displacement = normalizedBase * uniforms.strength;
        
        // 0-1 범위로 최종 정규화
        let normalizedDisplacement = clamp(displacement * 0.5 + 0.5, 0.0, 1.0);
        
        // 최종 색상
        let finalColor = vec4<f32>(normalizedDisplacement, normalizedDisplacement, normalizedDisplacement, 1.0);
    `,
			uniformStruct: `
        strength: f32,
    `,
			uniformDefaults: {
				strength: 1.5  // 이제 더 예측 가능한 결과
			}
		});
		material.normalTexture = new RedGPU.Resource.SimplexTexture(redGPUContext, 2048, 2048, {
			mainLogic: `
        let time = uniforms.time;
        let offset = uniforms.normalOffset;
        
        
        
        // 🎯 중심과 주변 4방향 높이값 계산
        let center = getHeightValue(base_uv, time);
        let left = getHeightValue(base_uv + vec2<f32>(-offset, 0.0), time);
        let right = getHeightValue(base_uv + vec2<f32>(offset, 0.0), time);
        let up = getHeightValue(base_uv + vec2<f32>(0.0, offset), time);
        let down = getHeightValue(base_uv + vec2<f32>(0.0, -offset), time);
        
        // 🌊 기울기 계산
        let ddx = (right - left) * uniforms.normalStrength / (2.0 * offset);
        let ddy = (up - down) * uniforms.normalStrength / (2.0 * offset);
        
        // 🎯 노멀 벡터 계산 (접선 공간)
        let normal = normalize(vec3<f32>(-ddx, -ddy, 1.0));
        
        // 🌊 노멀을 0-1 범위로 변환 (RGB 컬러로)
        let normalColor = normal * 0.5 + 0.5;
        
        let finalColor = vec4<f32>(normalColor, 1.0);
    `,
			uniformStruct: `
        strength: f32,
        normalStrength: f32,
        normalOffset: f32,
    `,
			uniformDefaults: {
				strength: 1.5,
				normalStrength: 1.0,
				normalOffset: 0.001
			},
			helperFunctions : `
				// 🎯 노멀 계산을 위한 함수 - 디스플레이스먼트와 동일한 패턴
				fn getHeightValue(uv: vec2<f32>, time:f32) -> f32 {
				    // 🌊 웨이브 UV 계산 (디스플레이스먼트와 동일)
				    let wave1_uv = vec2<f32>(uv.x * 0.5 + time * 0.02, uv.y * 0.3 + time * 0.015);
				    let wave2_uv = vec2<f32>(uv.x * 1.2 - time * 0.025, uv.y * 0.8 + time * 0.03);
				    let wave3_uv = vec2<f32>(uv.x * 2.5 + time * 0.05, uv.y * 1.8 - time * 0.04);
				    let diagonal_uv = vec2<f32>(uv.x * 1.5 + uv.y * 0.3 + time * 0.02, uv.y * 1.2 - uv.x * 0.2 + time * 0.018);
				    
				    // 🎯 정규화된 노이즈 값
				    let noise1 = getSimplexNoiseByDimension(wave1_uv, uniforms) * 0.6;
				    let noise2 = getSimplexNoiseByDimension(wave2_uv, uniforms) * 0.3;
				    let noise3 = getSimplexNoiseByDimension(wave3_uv, uniforms) * 0.15;
				    let noise4 = getSimplexNoiseByDimension(diagonal_uv, uniforms) * 0.25;
				    
				    // 🌊 사인파
				    let sinWave1 = sin(uv.x * 15.0 + time * 2.0) * 0.1;
				    let sinWave2 = sin(uv.y * 12.0 + time * 1.5) * 0.08;
				    let sinWave3 = sin((uv.x + uv.y) * 8.0 + time * 1.8) * 0.06;
				    
				    // 🎯 합성
				    let combinedNoise = noise1 + noise2 + noise3 + noise4;
				    let combinedSin = sinWave1 + sinWave2 + sinWave3;
				    
				    // 🌊 정규화 후 strength 적용
				    let normalizedBase = (combinedNoise + combinedSin) * 0.5;
				    return normalizedBase * uniforms.strength;
				}
			`
		});

		// 물에 적합한 파란색 계열 색상
		// material.color.setColorByHEX('#2c7aa6');

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
				if (material.normalTexture) material.normalTexture.time = time;
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

	// material 객체 참조 추가
	const material = redGPUContext.viewList[0].scene.children[0].material;

	// 🌊 텍스처 동기화 함수
	const syncTextures = (properties) => {
		// displacement texture 업데이트
		Object.entries(properties).forEach(([key, value]) => {
			if (key === 'strength') {
				targetNoiseTexture.updateUniform(key, value);
			} else if (targetNoiseTexture.hasOwnProperty(key)) {
				targetNoiseTexture[key] = value;
			}
		});

		// normal texture 동기화
		if (material.normalTexture) {
			Object.entries(properties).forEach(([key, value]) => {
				if (key === 'strength') {
					material.normalTexture.updateUniform(key, value);
				} else if (material.normalTexture.hasOwnProperty(key)) {
					material.normalTexture[key] = value;
				}
			});
		}
	};

	setSeparator(pane, "🌊 Water Presets");

	pane.addButton({title: '🌊 Calm Ocean'}).on('click', () => {
		const presetValues = {
			frequency: 3.0,
			amplitude: 1.2,
			octaves: 4,
			persistence: 0.5,
			lacunarity: 2.0,
			seed: 42,
			strength: 1.2
		};

		syncTextures(presetValues);

		// 추가 노멀 텍스처 설정
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', 0.8);
			material.normalTexture.updateUniform('normalOffset', 0.001);
		}
		material.normalScale = 1.0;
		pane.refresh();
	});

	pane.addButton({title: '🌊 Rough Seas'}).on('click', () => {
		const presetValues = {
			frequency: 6.0,
			amplitude: 2.5,
			octaves: 5,
			persistence: 0.7,
			lacunarity: 2.3,
			seed: 123,
			strength: 2.8
		};

		syncTextures(presetValues);

		// 추가 노멀 텍스처 설정
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', 1.5);
			material.normalTexture.updateUniform('normalOffset', 0.0008);
		}
		material.normalScale = 1.2;
		pane.refresh();
	});

	pane.addButton({title: '🏊 Swimming Pool'}).on('click', () => {
		const presetValues = {
			frequency: 12.0,
			amplitude: 0.3,
			octaves: 3,
			persistence: 0.3,
			lacunarity: 1.8,
			seed: 333,
			strength: 0.5
		};

		syncTextures(presetValues);

		// 추가 노멀 텍스처 설정
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', 0.5);
			material.normalTexture.updateUniform('normalOffset', 0.0015);
		}
		material.normalScale = 0.8;
		pane.refresh();
	});

	pane.addButton({title: '🌊 Stormy Waters'}).on('click', () => {
		const presetValues = {
			frequency: 4.0,
			amplitude: 3.5,
			octaves: 6,
			persistence: 0.8,
			lacunarity: 2.5,
			seed: 777,
			strength: 3.5
		};

		syncTextures(presetValues);

		// 추가 노멀 텍스처 설정
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', 2.0);
			material.normalTexture.updateUniform('normalOffset', 0.0006);
		}
		material.normalScale = 1.5;
		pane.refresh();
	});

	pane.addButton({title: '🏞️ Lake Ripples'}).on('click', () => {
		const presetValues = {
			frequency: 8.0,
			amplitude: 0.8,
			octaves: 4,
			persistence: 0.4,
			lacunarity: 2.1,
			seed: 555,
			strength: 0.8
		};

		syncTextures(presetValues);

		// 추가 노멀 텍스처 설정
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', 0.6);
			material.normalTexture.updateUniform('normalOffset', 0.0012);
		}
		material.normalScale = 0.9;
		pane.refresh();
	});

	pane.addButton({title: '🌊 Deep Ocean'}).on('click', () => {
		const presetValues = {
			frequency: 2.0,
			amplitude: 4.0,
			octaves: 7,
			persistence: 0.6,
			lacunarity: 2.2,
			seed: 999,
			strength: 4.2
		};

		syncTextures(presetValues);

		// 추가 노멀 텍스처 설정
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', 2.5);
			material.normalTexture.updateUniform('normalOffset', 0.0005);
		}
		material.normalScale = 1.8;
		pane.refresh();
	});

	pane.addButton({title: '🏖️ Beach Waves'}).on('click', () => {
		const presetValues = {
			frequency: 5.0,
			amplitude: 1.8,
			octaves: 4,
			persistence: 0.6,
			lacunarity: 2.0,
			seed: 222,
			strength: 2.0
		};

		syncTextures(presetValues);

		// 추가 노멀 텍스처 설정
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', 1.2);
			material.normalTexture.updateUniform('normalOffset', 0.0009);
		}
		material.normalScale = 1.1;
		pane.refresh();
	});

	pane.addButton({title: '🌊 Tidal Pool'}).on('click', () => {
		const presetValues = {
			frequency: 15.0,
			amplitude: 0.5,
			octaves: 3,
			persistence: 0.3,
			lacunarity: 1.5,
			seed: 111,
			strength: 0.6
		};

		syncTextures(presetValues);

		// 추가 노멀 텍스처 설정
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', 0.4);
			material.normalTexture.updateUniform('normalOffset', 0.002);
		}
		material.normalScale = 0.7;
		pane.refresh();
	});

	setSeparator(pane, "Water Parameters");

	// 🌊 동기화된 파라미터 컨트롤
	pane.addBinding(material, 'opacity', {
		min: 0,
		max: 1,
		step: 0.01,
		label: 'opacity'
	})


	pane.addBinding(targetNoiseTexture, 'frequency', {
		min: 0,
		max: 20,
		step: 0.1,
		label: 'Wave Frequency'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.frequency = ev.value;
		}
	});

	pane.addBinding(targetNoiseTexture, 'amplitude', {
		min: 0,
		max: 5,
		step: 0.1,
		label: 'Wave Amplitude'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.amplitude = ev.value;
		}
	});

	pane.addBinding(targetNoiseTexture, 'octaves', {
		min: 1,
		max: 8,
		step: 1,
		label: 'Wave Complexity'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.octaves = ev.value;
		}
	});

	pane.addBinding(targetNoiseTexture, 'persistence', {
		min: 0,
		max: 1,
		step: 0.01,
		label: 'Wave Persistence'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.persistence = ev.value;
		}
	});

	pane.addBinding(targetNoiseTexture, 'lacunarity', {
		min: 1,
		max: 4,
		step: 0.1,
		label: 'Wave Lacunarity'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.lacunarity = ev.value;
		}
	});

	pane.addBinding(targetNoiseTexture, 'seed', {
		min: 0,
		max: 1000,
		step: 1,
		label: 'Wave Pattern'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.seed = ev.value;
		}
	});

	const strengthBinding = pane.addBinding({strength: 1.5}, 'strength', {
		min: 0,
		max: 5,
		step: 0.1,
		label: 'Wave Height'
	});
	strengthBinding.on('change', (ev) => {
		targetNoiseTexture.updateUniform('strength', ev.value);
		// 노멀 텍스처도 동기화
		if (material.normalTexture) {
			material.normalTexture.updateUniform('strength', ev.value);
		}
	});

	pane.addBinding(targetNoiseTexture, 'noiseDimension', {
		options: RedGPU.Resource.NOISE_DIMENSION,
		label: 'Noise Type'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.noiseDimension = ev.value;
		}
	});

	// 🌊 노멀 텍스처 컨트롤 추가
	setSeparator(pane, "🌊 Normal Texture Settings");

	const normalStrengthBinding = pane.addBinding({normalStrength: 1.0}, 'normalStrength', {
		min: 0,
		max: 3,
		step: 0.1,
		label: 'Normal Strength'
	});
	normalStrengthBinding.on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalStrength', ev.value);
		}
	});

	const normalOffsetBinding = pane.addBinding({normalOffset: 0.001}, 'normalOffset', {
		min: 0.0001,
		max: 0.01,
		step: 0.0001,
		label: 'Normal Detail'
	});
	normalOffsetBinding.on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.updateUniform('normalOffset', ev.value);
		}
	});

	pane.addBinding(material, 'normalScale', {
		min: 0,
		max: 2,
		step: 0.1,
		label: 'Normal Scale'
	});

	const animation = pane.addFolder({title: '🌊 Wave Animation', expanded: true});
	animation.addBinding(testData, 'useAnimation', {
		label: 'Enable Animation'
	});

	animation.addBinding(targetNoiseTexture, 'animationSpeed', {
		min: 0,
		max: 0.5,
		step: 0.001,
		label: 'Animation Speed'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.animationSpeed = ev.value;
		}
	});

	animation.addBinding(targetNoiseTexture, 'animationX', {
		min: -1,
		max: 1,
		step: 0.001,
		label: 'X Direction'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.animationX = ev.value;
		}
	});

	animation.addBinding(targetNoiseTexture, 'animationY', {
		min: -1,
		max: 1,
		step: 0.001,
		label: 'Y Direction'
	}).on('change', (ev) => {
		if (material.normalTexture) {
			material.normalTexture.animationY = ev.value;
		}
	});
};
