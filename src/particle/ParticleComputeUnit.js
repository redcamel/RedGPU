/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.30 17:38:1
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
	    vec3 valuePosition;
	    float valueAlpha;
        vec3 valueRotation;
	    float valueScale;	  
	    InfoGroup infoPosition;
	    InfoGroup infoRotation;
	    Info infoScale;
	    Info infoAlpha;
	};
	
	// 이건 설정값인듯 하고
	layout(std140, set = ${ShareGLSL.SET_INDEX_ComputeUniforms}, binding = 0) uniform SimParams {
	    float time;
        float currentPositionX,currentPositionY,currentPositionZ;
	    float minLife,maxLife;
	    float minStartX, maxStartX, minEndX, maxEndX;
	    float minStartY, maxStartY, minEndY, maxEndY;
	    float minStartZ, maxStartZ, minEndZ, maxEndZ;
	    float minStartAlpha, maxStartAlpha, minEndAlpha, maxEndAlpha;
	    float minStartScale, maxStartScale, minEndScale, maxEndScale;
        float minStartRotationX, maxStartRotationX, minEndRotationX, maxEndRotationX;
	    float minStartRotationY, maxStartRotationY, minEndRotationY, maxEndRotationY;
	    float minStartRotationZ, maxStartRotationZ, minEndRotationZ, maxEndRotationZ;
	
	} params;
	
	// 여기다 쓰곘다는건가	
	layout(std140, set = ${ShareGLSL.SET_INDEX_ComputeUniforms}, binding = 1) buffer ParticlesA {
	    Particle particles[${v}];
	} particlesA;
	
	

	
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
	float rand(float n){return fract(sin(n) * 43758.5453123);}
	float randomRange(float min, float max, float v)
	{
        float newValue = rand(v);
		return (newValue * (max-min)) + min;
	}
	void main() {
		uint index = gl_GlobalInvocationID.x;
		Particle targetParticle = particlesA.particles[index];
	
		float age = params.time - targetParticle.startTime;
		float lifeRatio = age/targetParticle.life;
		if(lifeRatio>=1) {
			float uuid = params.time + index;
			particlesA.particles[index].startTime = params.time;
			particlesA.particles[index].life = randomRange( params.minLife, params.maxLife, uuid );
			// position
			particlesA.particles[index].infoPosition.infoX.startValue = randomRange( params.minStartX, params.maxStartX, uuid + 1 );
			particlesA.particles[index].infoPosition.infoX.endValue   = randomRange( params.minEndX, params.maxEndX, uuid + 2 );
			particlesA.particles[index].infoPosition.infoY.startValue = randomRange( params.minStartY, params.maxStartY, uuid + 3 );
			particlesA.particles[index].infoPosition.infoY.endValue   = randomRange( params.minEndY, params.maxEndY, uuid + 4 );
			particlesA.particles[index].infoPosition.infoZ.startValue = randomRange( params.minStartZ, params.maxStartZ, uuid + 5 );
			particlesA.particles[index].infoPosition.infoZ.endValue   = randomRange( params.minEndZ, params.maxEndZ, uuid + 6 );
			// alpha
			particlesA.particles[index].infoAlpha.startValue = randomRange( params.minStartAlpha, params.maxStartAlpha, uuid + 7 );
			particlesA.particles[index].infoAlpha.endValue   = randomRange( params.minEndAlpha, params.maxEndAlpha, uuid + 8 );
			// scale
			particlesA.particles[index].infoScale.startValue = randomRange( params.minStartScale, params.maxStartScale, uuid + 9 );
			particlesA.particles[index].infoScale.endValue   = randomRange( params.minEndScale, params.maxEndScale, uuid + 10 );
			// rotation
			particlesA.particles[index].infoRotation.infoX.startValue = randomRange( params.minStartX, params.maxStartX, uuid + 11 );
			particlesA.particles[index].infoRotation.infoX.endValue   = randomRange( params.minEndX, params.maxEndX, uuid + 12 );
			particlesA.particles[index].infoRotation.infoY.startValue = randomRange( params.minStartY, params.maxStartY, uuid + 13 );
			particlesA.particles[index].infoRotation.infoY.endValue   = randomRange( params.minEndY, params.maxEndY, uuid + 14 );
			particlesA.particles[index].infoRotation.infoZ.startValue = randomRange( params.minStartZ, params.maxStartZ, uuid + 15 );
			particlesA.particles[index].infoRotation.infoZ.endValue   = randomRange( params.minEndZ, params.maxEndZ, uuid + 16 );
			// birth position
			particlesA.particles[index].infoPosition.infoX.birthCenterValue = params.currentPositionX;
			particlesA.particles[index].infoPosition.infoY.birthCenterValue = params.currentPositionY;
			particlesA.particles[index].infoPosition.infoZ.birthCenterValue = params.currentPositionZ;
			lifeRatio = 0;
		}
		Info tInfo;
		// position
		tInfo = targetParticle.infoPosition.infoX;
		particlesA.particles[index].valuePosition.x = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoPosition.infoY;
		particlesA.particles[index].valuePosition.y = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoPosition.infoZ;
		particlesA.particles[index].valuePosition.z = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		
		// alpha
		tInfo = targetParticle.infoAlpha;
		particlesA.particles[index].valueAlpha = tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		
		// scale
		tInfo = targetParticle.infoScale;
		particlesA.particles[index].valueScale = tInfo.startValue + (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
				
		// rotation
		tInfo = targetParticle.infoRotation.infoX;
		particlesA.particles[index].valueRotation.x = tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoRotation.infoY;
		particlesA.particles[index].valueRotation.y = tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoRotation.infoZ;
		particlesA.particles[index].valueRotation.z = tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
	}
`
}
export default class ParticleComputeUnit extends BaseObject3D {
	//
	get particleNum() {return this._particleNum;}
	set particleNum(value) {this._particleNum = value;}
	#redGPUContext;
	#simParamData;
	computePipeline;
	particleBindGroup;
	particleBuffer;
	minLife=2000;
	maxLife=10000;
	//
	minStartX = -1;
	maxStartX = 1;
	minEndX = -15;
	maxEndX = 15;
	//
	minStartY = -1;
	maxStartY = 1;
	minEndY = -15;
	maxEndY = 15;
	//
	minStartZ = -1;
	maxStartZ = 1;
	minEndZ = -15;
	maxEndZ = 15;
	//
	minStartAlpha = 0.0;
	maxStartAlpha = 1.0;
	minEndAlpha = 0.0;
	maxEndAlpha = 0.0;
	//
	minStartScale = 0.0;
	maxStartScale = 0.25;
	minEndScale = 0.0;
	maxEndScale = 3.0;
	//
	minStartRotationX = -Math.random()*360;
	maxStartRotationX = Math.random()*360;
	minEndRotationX =  -Math.random()*360;
	maxEndRotationX = Math.random()*360;
	//
	minStartRotationY =  -Math.random()*360;
	maxStartRotationY = Math.random()*360;
	minEndRotationY =  -Math.random()*360;
	maxEndRotationY = Math.random()*360;
	//
	minStartRotationZ =  -Math.random()*360;
	maxStartRotationZ = Math.random()*360;
	minEndRotationZ =  -Math.random()*360;
	maxEndRotationZ = Math.random()*360;
	//
	compute(time) {
		this.#simParamData.set(
			[
				// startTime time
				time,
				// position
				this._x,this._y,this._z,
				// lifeRange
				this.minLife, this.maxLife,
				// x,y,z Range
				this.minStartX, this.maxStartX, this.minEndX, this.maxEndX,
				this.minStartY, this.maxStartY, this.minEndY, this.maxEndY,
				this.minStartZ, this.maxStartZ, this.minEndZ, this.maxEndZ,
				// alphaRange
				this.minStartAlpha, this.maxStartAlpha, this.minEndAlpha, this.maxEndAlpha,
				// scaleRange
				this.minStartScale, this.maxStartScale, this.minEndScale, this.maxEndScale,
				// x,y,z Range
				this.minStartRotationX, this.maxStartRotationX, this.minEndRotationX, this.maxEndRotationX,
				this.minStartRotationY, this.maxStartRotationY, this.minEndRotationY, this.maxEndRotationY,
				this.minStartRotationZ, this.maxStartRotationZ, this.minEndRotationZ, this.maxEndRotationZ,
			],
			0
		)
		this.simParamBuffer.setSubData(0, this.#simParamData)
		const commandEncoder = this.#redGPUContext.device.createCommandEncoder({});
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.computePipeline);
		passEncoder.setBindGroup(ShareGLSL.SET_INDEX_ComputeUniforms, this.particleBindGroup);
		passEncoder.dispatch(this._particleNum);
		passEncoder.endPass();
		this.#redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);

	}

	constructor(redGPUContext, particleNum = 1, initInfo = {}, texture, geometry) {
		super(redGPUContext);
		this.#redGPUContext = redGPUContext;
		this.particleNum = particleNum || 1;
		this.geometry = geometry || new Plane(redGPUContext);
		this.material = new ParticleMaterial(redGPUContext, texture);
		this.renderDrawLayerIndex = Render.DRAW_LAYER_INDEX2_Z_POINT_SORT;
		this.PROPERTY_NUM = 44
		this.blendColorSrc = 'src-alpha';
		this.blendColorDst = 'one';
		this.blendAlphaSrc = 'src-alpha';
		this.blendAlphaDst = 'one';
		this.depthWriteEnabled = false;
		this.cullMode ='none'

		// 컴퓨트 파이프 라인 생성
		this.#simParamData = new Float32Array(
			[
				// startTime time
				performance.now(),
				// position
				this._x,this._y,this._z,
				// lifeRange
				this.minLife, this.maxLife,
				// x,y,z Range
				this.minStartX, this.maxStartX, this.minEndX, this.maxEndX,
				this.minStartY, this.maxStartY, this.minEndY, this.maxEndY,
				this.minStartZ, this.maxStartZ, this.minEndZ, this.maxEndZ,
				// alphaRange
				this.minStartAlpha, this.maxStartAlpha, this.minEndAlpha, this.maxEndAlpha,
				// scaleRange
				this.minStartScale, this.maxStartScale, this.minEndScale, this.maxEndScale,
				// x,y,z Range
				this.minStartRotationX, this.maxStartRotationX, this.minEndRotationX, this.maxEndRotationX,
				this.minStartRotationY, this.maxStartRotationY, this.minEndRotationY, this.maxEndRotationY,
				this.minStartRotationZ, this.maxStartRotationZ, this.minEndRotationZ, this.maxEndRotationZ,
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
			let life = Math.random() * this.maxLife;
			let age = Math.random() * life;
			initialParticleData[PROPERTY_NUM * i + 0] = currentTime - age // start time
			initialParticleData[PROPERTY_NUM * i + 1] = life; // life
			// position
			initialParticleData[PROPERTY_NUM * i + 4] = 0; // x
			initialParticleData[PROPERTY_NUM * i + 5] = 0; // y
			initialParticleData[PROPERTY_NUM * i + 6] = 0; // z
			initialParticleData[PROPERTY_NUM * i + 7] = // alpha;
			// scale
			initialParticleData[PROPERTY_NUM * i + 8] = 0; // rotationX
			initialParticleData[PROPERTY_NUM * i + 9] = 0; // rotationY
			initialParticleData[PROPERTY_NUM * i + 10] = 0; // rotationZ
			initialParticleData[PROPERTY_NUM * i + 11] = 0; // scale
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
			// rotationX
			initialParticleData[PROPERTY_NUM * i + 24] = Math.random() * 360; // startValue
			initialParticleData[PROPERTY_NUM * i + 25] = Math.random() * 360; // endValue
			initialParticleData[PROPERTY_NUM * i + 26] = parseInt(Math.random() * 27); // ease
			initialParticleData[PROPERTY_NUM * i + 27] = 0; //
			// rotationY
			initialParticleData[PROPERTY_NUM * i + 28] = Math.random() * 360; // startValue
			initialParticleData[PROPERTY_NUM * i + 29] = Math.random() * 360; // endValue
			initialParticleData[PROPERTY_NUM * i + 30] = parseInt(Math.random() * 27); // ease
			initialParticleData[PROPERTY_NUM * i + 31] = 0; //
			// rotationZ
			initialParticleData[PROPERTY_NUM * i + 32] = Math.random() * 360; // startValue
			initialParticleData[PROPERTY_NUM * i + 33] = Math.random() * 360; // endValue
			initialParticleData[PROPERTY_NUM * i + 34] = parseInt(Math.random() * 27); // ease
			initialParticleData[PROPERTY_NUM * i + 35] = 0; //
			// scale
			initialParticleData[PROPERTY_NUM * i + 36] = Math.random() * 0.25; // startValue
			initialParticleData[PROPERTY_NUM * i + 37] = Math.random() * 3; // endValue
			initialParticleData[PROPERTY_NUM * i + 38] = parseInt(Math.random() * 27); // ease
			initialParticleData[PROPERTY_NUM * i + 39] = 0; //
			// alpha
			initialParticleData[PROPERTY_NUM * i + 40] = Math.random(); // startValue
			initialParticleData[PROPERTY_NUM * i + 41] = 0; // endValue
			initialParticleData[PROPERTY_NUM * i + 42] = parseInt(Math.random() * 27); // ease
			initialParticleData[PROPERTY_NUM * i + 43] = 0; //
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