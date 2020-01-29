/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.29 22:10:29
 *
 */

import BaseObject3D from "../base/BaseObject3D.js";
import Plane from "../primitives/Plane.js";
import ParticleMaterial from "./ParticleMaterial.js";
import Render from "../renderer/Render.js";
import ShareGLSL from "../base/ShareGLSL.js";
import PipelineParticle from "../base/pipeline/PipelineParticle.js";

let getComputeSource = v => {
	return `
	#version 450
	// 파티클 구조체 선언
	struct Info {
		float startValue;
		float endValue;
		float easeType;
		float birthCenterValue;
	};
	struct InfoGroup {
		Info infoX;
		Info infoY;
		Info infoZ;
	};
	struct Particle {
		float startTime;
	    float life;
	    vec4 valuePosition;
	    vec3 valueScale;
	    float valueAlpha;
	    InfoGroup infoPosition;
	    InfoGroup infoScale;
	    Info infoAlpha;
	};
	
	// 이건 설정값인듯 하고
	layout(std140, set = ${ShareGLSL.SET_INDEX_ComputeUniforms}, binding = 0) uniform SimParams {
	    float time;
	    float minLife,maxLife;
	    float minStartX,maxStartX;
	    vec3 currentPosition;
	} params;
	
	// 여기다 쓰곘다는건가	
	layout(std140, set = ${ShareGLSL.SET_INDEX_ComputeUniforms}, binding = 1) buffer ParticlesA {
	    Particle particles[${v}];
	} particlesA;
	
	

	float rand(vec2 co)
	{
	    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}
	const float PI = 3.141592653589793;
	const float HPI = PI * 0.5;
	const float PI2 = PI * 2;
	float calEasing(float n, float type){
		switch( int(type) ){
			// linear
			case 0 : break;
			// QuintIn
			case 1 : n = n * n * n * n * n; break;
			// QuintOut
			case 2 : n = ((n -= 1) * n * n * n * n) + 1; break;
			// QuintInOut
			case 3 : n = ((n = n * 2) < 1) ? n * n * n * n * n * 0.5 : 0.5 * ((n -= 2) * n * n * n * n + 2); break;
			////////////////////////
			// BackIn
			case 4 : n = n * n * (n * 1.70158 + n - 1.70158); break;
			// BackOut
			case 5 : n = (n -= 1) * n * (n * 1.70158 + n + 1.70158) + 1; break;
			// BackInOut
			case 6 : n = ((n = n * 2) < 1) ? 0.5 * n * n * (n * 1.70158 + n - 1.70158) : 0.5 * (n -= 2) * n * (n * 1.70158 + n + 1.70158) + 1; break;
			////////////////////////
			// CircIn
			case 7 : n = -1 * (sqrt(1 - n * n) - 1); break;
			// CircOut
			case 8 : n = sqrt(1 - (n -= 1) * n); break;
			// CircInOut
			case 9 : n = ((n = n * 2) < 1) ? -0.5 * (sqrt(1 - n * n) - 1) : 0.5 * sqrt(1 - (n -= 2) * n) + 0.5; break;
			////////////////////////
			// CubicIn
			case 10 : n = n * n * n; break;
			// CubicOut
			case 11 : n = ((n -= 1) * n * n) + 1; break;
			// CubicInOut
			case 12 : n = ((n = n * 2) < 1) ? n * n * n * 0.5 : 0.5 * ((n -= 2) * n * n + 2); break;
			////////////////////////
			// ExpoIn
			case 13 : n = n == 0.0 ? 0.0 : pow(2, 10 * (n - 1)); break;
			// ExpoOut
			case 14 : n = n == 1.0 ? 1.0 : -pow(2, -10 * n) + 1; break;
			// ExpoInOut
			case 15 : n = ((n = n * 2) < 1) ? (n == 0.0 ? 0.0 : 0.5 * pow(2, 10 * (n - 1))) : (n == 2.0 ? 1.0 : -0.5 * pow(2, -10 * (n - 1)) + 1); break;
			////////////////////////
			// QuadIn
			case 16 : n = n * n; break;
			// QuadOut
			case 17 : n = ((2 - n) * n); break;
			// QuadInOut
			case 18 : n = ((n = n * 2) < 1) ? n * n * 0.5 : 0.5 * ((2 - (n -= 1)) * n + 1); break;
			////////////////////////
			// QuartIn
			case 19 : n = n * n * n * n; break;
			// QuartOut
			case 20 : n = 1 - ((n -= 1) * n * n * n); break;
			// QuartInOut
			case 21 : n = ((n = n * 2) < 1) ? n * n * n * n * 0.5 : 1 - ((n -= 2) * n * n * n * 0.5); break;
			////////////////////////
			// SineIn
			case 22 : n = -cos(n * HPI) + 1; break;
			// SineOut
			case 23 : n = sin(n * HPI); break;
			// SineInOut
			case 24 : n = (-cos(n * PI) + 1) * 0.5; break;
			////////////////////////
			// ElasticIn
			case 25 : n = n == 0.0 ? 0.0 : n == 1.0 ? 1.0 : -1 * pow(2, 10 * (n -= 1)) * sin((n - 0.075) * (PI2) / 0.3); break;
			// ElasticOut
			case 26 : n = n == 0.0 ? 0.0 : n == 1.0 ? 1.0 : pow(2, -10 * n) * sin((n - 0.075) * (PI2) / 0.3) + 1; break;
			// ElasticInOut
			case 27 : n =( (n == 0.0 ? 0.0 : (n == 1.0 ? 1.0 : n *= 2)), (n < 1) ? -0.5 * pow(2, 10 * (n -= 1)) * sin((n - 0.075) * (PI2) / 0.3) : 0.5 * pow(2, -10 * (n -= 1)) * sin((n - 0.075) * (PI2) / 0.3) + 1); break;
		}
		return n;
	}
	float randomRange(float min, float max, float v)
	{
        float newValue = rand(vec2( min, max) + v) * max;
        if(newValue < min) newValue = min;
		return newValue;
	}
	void main() {
		uint index = gl_GlobalInvocationID.x;
		Particle targetParticle = particlesA.particles[index];
	
		float age = params.time - targetParticle.startTime;
		float lifeRatio = age/targetParticle.life;
		if(lifeRatio>=1) {
			particlesA.particles[index].startTime = params.time;
			particlesA.particles[index].life = randomRange( params.minLife, params.maxLife, params.time + index );
			//
			// particlesA.particles[index].infoPosition.infoX.startValue = randomRange( params.minStartX, params.maxStartX, params.time + index );
			// particlesA.particles[index].infoPosition.infoY.startValue = randomRange( params.minStartX, params.maxStartX, params.time + index );
			// particlesA.particles[index].infoPosition.infoZ.startValue = randomRange( params.minStartX, params.maxStartX, params.time + index );
			//
			particlesA.particles[index].infoPosition.infoX.birthCenterValue = params.currentPosition.x;
			particlesA.particles[index].infoPosition.infoY.birthCenterValue = params.currentPosition.y;
			particlesA.particles[index].infoPosition.infoZ.birthCenterValue = params.currentPosition.z;
			lifeRatio = 0;
		}
		// position
		Info tInfo;
		tInfo = targetParticle.infoPosition.infoX;
		particlesA.particles[index].valuePosition.x = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoPosition.infoY;
		particlesA.particles[index].valuePosition.y = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoPosition.infoZ;
		particlesA.particles[index].valuePosition.z = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		
		// scale
		tInfo = targetParticle.infoScale.infoX;
		particlesA.particles[index].valueScale.x = tInfo.startValue + (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoScale.infoY;
		particlesA.particles[index].valueScale.y = tInfo.startValue + (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoScale.infoZ;
		particlesA.particles[index].valueScale.z = tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		
		// alpha
		tInfo = targetParticle.infoAlpha;
		particlesA.particles[index].valueAlpha = tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
	}
`
}
export default class ParticleComputeUnit extends BaseObject3D {
	get minStartX() {return this._minStartX;}
	set minStartX(value) {this._minStartX = value;}
	get maxStartX() {return this._maxStartX;}
	set maxStartX(value) {this._maxStartX = value;}
	get maxLife() {return this._maxLife;}
	set maxLife(value) {this._maxLife = value;}
	get minLife() {return this._minLife;}
	set minLife(value) {this._minLife = value;}
	get particleNum() {return this._particleNum;}
	set particleNum(value) {this._particleNum = value;}
	#redGPUContext;
	#simParamData;
	computePipeline;
	particleBindGroup;
	particleBuffer
	compute(time) {
		this.#simParamData.set(
			[
				// startTime time
				performance.now(),
				// lifeRange
				this._minLife, this._maxLife,
				0, // empty
				// xRange
				this._minStartX, this._maxStartX,
				0,0, // empty
				// position
				this._x,this._y,this._z
			],
			0
		)
		this.simParamBuffer.setSubData(0, new Float32Array(this.#simParamData))
		const commandEncoder = this.#redGPUContext.device.createCommandEncoder({});
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.computePipeline);
		passEncoder.setBindGroup(ShareGLSL.SET_INDEX_ComputeUniforms, this.particleBindGroup);
		passEncoder.dispatch(this._particleNum);
		passEncoder.endPass();
		this.#redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);

	}
	_minLife=2000;
	_maxLife=10000;
	_minStartX = -10;
	_maxStartX = 10;
	constructor(redGPUContext, particleNum = 1, initInfo = {}, texture, geometry) {
		super(redGPUContext);
		this.#redGPUContext = redGPUContext;
		this.particleNum = particleNum || 1;
		this.geometry = geometry || new Plane(redGPUContext);
		this.material = new ParticleMaterial(redGPUContext, texture);
		this.renderDrawLayerIndex = Render.DRAW_LAYER_INDEX2_Z_POINT_SORT;
		this.PROPERTY_NUM = 40
		this.blendColorSrc = 'src-alpha';
		this.blendColorDst = 'one';
		this.blendAlphaSrc = 'src-alpha';
		this.blendAlphaDst = 'one';
		this.depthWriteEnabled = false;

		// 컴퓨트 파이프 라인 생성
		this.#simParamData = new Float32Array(
			[
				// startTime time
				performance.now(),
				// lifeRange
				this._minLife, this._maxLife,
				0,// empty
				// xRange
				this._minStartX, this._maxStartX,
				0,0, // empty
				// position
				this._x,this._y,this._z
			]
		)
		let bufferDescriptor = {
			size: this.#simParamData.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		};

		let computeSource = getComputeSource(this._particleNum)
		console.log(computeSource)
		let shaderModuleDescriptor = {
			code: redGPUContext.glslang.compileGLSL(computeSource, 'compute'),
			source: computeSource
		};
		console.log('shaderModuleDescriptor', shaderModuleDescriptor);
		let computeModule = redGPUContext.device.createShaderModule(shaderModuleDescriptor);

		const PROPERTY_NUM = this.PROPERTY_NUM;
		const initialParticleData = new Float32Array(this._particleNum * PROPERTY_NUM);
		const currentTime = performance.now();
		for (let i = 0; i < this._particleNum; ++i) {
			let life = Math.random() * 10000;
			let age = Math.random() * life;
			initialParticleData[PROPERTY_NUM * i + 0] = currentTime - age // start time
			initialParticleData[PROPERTY_NUM * i + 1] = life; // life
			// position
			initialParticleData[PROPERTY_NUM * i + 4] = Math.random() * 100 - 50; // x
			initialParticleData[PROPERTY_NUM * i + 5] = Math.random() * 100 - 50; // y
			initialParticleData[PROPERTY_NUM * i + 6] = Math.random() * 100 - 50; // z
			initialParticleData[PROPERTY_NUM * i + 7] = 0;
			// scale
			initialParticleData[PROPERTY_NUM * i + 8] = 0; // scaleX
			initialParticleData[PROPERTY_NUM * i + 9] = 0; // scaleY
			initialParticleData[PROPERTY_NUM * i + 10] = 0; // scaleZ
			// alpha
			initialParticleData[PROPERTY_NUM * i + 11] = 0; // alpha
			// x
			initialParticleData[PROPERTY_NUM * i + 12] = Math.random() * 0.5 - 0.25; // startValue
			initialParticleData[PROPERTY_NUM * i + 13] = Math.random() * 100 - 50; // endValue
			initialParticleData[PROPERTY_NUM * i + 14] = parseInt(Math.random() * 27); // ease
			initialParticleData[PROPERTY_NUM * i + 15] = 0; // startPosition
			// y
			initialParticleData[PROPERTY_NUM * i + 16] = Math.random() * 0.5 - 0.25; // startValue
			initialParticleData[PROPERTY_NUM * i + 17] = Math.random() * 100 - 50; // endValue
			initialParticleData[PROPERTY_NUM * i + 18] = parseInt(Math.random() * 27); // ease
			initialParticleData[PROPERTY_NUM * i + 19] = 0; // startPosition
			// z
			initialParticleData[PROPERTY_NUM * i + 20] = Math.random() * 0.5 - 0.25; // startValue
			initialParticleData[PROPERTY_NUM * i + 21] = Math.random() * 100 - 50; // endValue
			initialParticleData[PROPERTY_NUM * i + 22] = parseInt(Math.random() * 27); // ease
			initialParticleData[PROPERTY_NUM * i + 23] = 0; // startPosition
			// scaleX
			let tScaleStart = Math.random() * 0.25
			let tScaleEnd = Math.random() * 3
			let tScaleEase = parseInt(Math.random() * 27)
			initialParticleData[PROPERTY_NUM * i + 24] = tScaleStart; // startValue
			initialParticleData[PROPERTY_NUM * i + 25] = tScaleEnd; // endValue
			initialParticleData[PROPERTY_NUM * i + 26] = tScaleEase; // ease
			// scaleY
			initialParticleData[PROPERTY_NUM * i + 28] = tScaleStart; // startValue
			initialParticleData[PROPERTY_NUM * i + 29] = tScaleEnd; // endValue
			initialParticleData[PROPERTY_NUM * i + 30] = tScaleEase; // ease
			// scaleZ
			initialParticleData[PROPERTY_NUM * i + 32] = tScaleStart; // startValue
			initialParticleData[PROPERTY_NUM * i + 33] = tScaleEnd; // endValue
			initialParticleData[PROPERTY_NUM * i + 34] = tScaleEase; // ease
			// alpha
			initialParticleData[PROPERTY_NUM * i + 36] = Math.random(); // startValue
			initialParticleData[PROPERTY_NUM * i + 37] = 0; // endValue
			initialParticleData[PROPERTY_NUM * i + 38] = parseInt(Math.random() * 27); // ease
		}

		this.simParamBuffer = redGPUContext.device.createBuffer(bufferDescriptor);
		this.simParamBuffer.setSubData(0, this.#simParamData);


		this.particleBuffer = redGPUContext.device.createBuffer({
			size: initialParticleData.byteLength,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE
		});
		this.particleBuffer.setSubData(0, initialParticleData);

		const computeBindGroupLayout = redGPUContext.device.createBindGroupLayout({
			bindings: [
				{binding: 0, visibility: GPUShaderStage.COMPUTE, type: "uniform-buffer"},
				{binding: 1, visibility: GPUShaderStage.COMPUTE, type: "storage-buffer"}
			],
		});

		const computePipelineLayout = redGPUContext.device.createPipelineLayout({
			bindGroupLayouts: [computeBindGroupLayout],
		});

		this.particleBindGroup = redGPUContext.device.createBindGroup({
			layout: computeBindGroupLayout,
			bindings: [
				{
					binding: 0,
					resource: {
						buffer: this.simParamBuffer,
						offset: 0,
						size: this.#simParamData.byteLength
					},
				},
				{
					binding: 1,
					resource: {
						buffer: this.particleBuffer,
						offset: 0,
						size: initialParticleData.byteLength,
					},
				}
			],
		});
		this.computePipeline = redGPUContext.device.createComputePipeline({
			layout: computePipelineLayout,
			computeStage: {
				module: computeModule,
				entryPoint: "main"
			},
		});

		this.pipeline = new PipelineParticle(redGPUContext, this)


	}
}