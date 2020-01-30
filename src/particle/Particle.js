/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.30 20:31:4
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
	    float minLife, maxLife;
	    float minStartX, maxStartX, minEndX, maxEndX, easeX;
	    float minStartY, maxStartY, minEndY, maxEndY, easeY;
	    float minStartZ, maxStartZ, minEndZ, maxEndZ, easeZ;
	    float minStartAlpha, maxStartAlpha, minEndAlpha, maxEndAlpha, easeAlpha;
	    float minStartScale, maxStartScale, minEndScale, maxEndScale, easeScale;
        float minStartRotationX, maxStartRotationX, minEndRotationX, maxEndRotationX, easeRotationX;
	    float minStartRotationY, maxStartRotationY, minEndRotationY, maxEndRotationY, easeRotationY;
	    float minStartRotationZ, maxStartRotationZ, minEndRotationZ, maxEndRotationZ, easeRotationZ;
	
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
			particlesA.particles[index].infoPosition.infoX.easeType   = params.easeX;
			particlesA.particles[index].infoPosition.infoY.startValue = randomRange( params.minStartY, params.maxStartY, uuid + 3 );
			particlesA.particles[index].infoPosition.infoY.endValue   = randomRange( params.minEndY, params.maxEndY, uuid + 4 );
			particlesA.particles[index].infoPosition.infoY.easeType   = params.easeY;
			particlesA.particles[index].infoPosition.infoZ.startValue = randomRange( params.minStartZ, params.maxStartZ, uuid + 5 );
			particlesA.particles[index].infoPosition.infoZ.endValue   = randomRange( params.minEndZ, params.maxEndZ, uuid + 6 );
			particlesA.particles[index].infoPosition.infoZ.easeType   = params.easeZ;
			// alpha
			particlesA.particles[index].infoAlpha.startValue = randomRange( params.minStartAlpha, params.maxStartAlpha, uuid + 7 );
			particlesA.particles[index].infoAlpha.endValue   = randomRange( params.minEndAlpha, params.maxEndAlpha, uuid + 8 );
			particlesA.particles[index].infoAlpha.easeType   = params.easeAlpha;
			// scale
			particlesA.particles[index].infoScale.startValue = randomRange( params.minStartScale, params.maxStartScale, uuid + 9 );
			particlesA.particles[index].infoScale.endValue   = randomRange( params.minEndScale, params.maxEndScale, uuid + 10 );
			particlesA.particles[index].infoScale.easeType   = params.easeScale;
			// rotation
			particlesA.particles[index].infoRotation.infoX.startValue = randomRange( params.minStartRotationX, params.maxStartRotationX, uuid + 11 );
			particlesA.particles[index].infoRotation.infoX.endValue   = randomRange( params.minEndRotationX, params.maxEndRotationX, uuid + 12 );
			particlesA.particles[index].infoRotation.infoX.easeType   = params.easeRotationX;
			particlesA.particles[index].infoRotation.infoY.startValue = randomRange( params.minStartRotationY, params.maxStartRotationY, uuid + 13 );
			particlesA.particles[index].infoRotation.infoY.endValue   = randomRange( params.minEndRotationY, params.maxEndRotationY, uuid + 14 );
			particlesA.particles[index].infoRotation.infoY.easeType   = params.easeRotationY;
			particlesA.particles[index].infoRotation.infoZ.startValue = randomRange( params.minStartRotationZ, params.maxStartRotationZ, uuid + 15 );
			particlesA.particles[index].infoRotation.infoZ.endValue   = randomRange( params.minEndRotationZ, params.maxEndRotationZ, uuid + 16 );
			particlesA.particles[index].infoRotation.infoZ.easeType   = params.easeRotationZ;
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
		particlesA.particles[index].valueRotation.x = (tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType)) * PI/180;
		tInfo = targetParticle.infoRotation.infoY;
		particlesA.particles[index].valueRotation.y = (tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType)) * PI/180;
		tInfo = targetParticle.infoRotation.infoZ;
		particlesA.particles[index].valueRotation.z = (tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType)) * PI/180;
	}
`
}
export default class Particle extends BaseObject3D {
	static Linear = 0;
	static QuintIn = 1;
	static QuintOut = 2;
	static QuintInOut = 3;
	//
	static BackIn = 4;
	static BackOut = 5;
	static BackInOut = 6;
	//
	static CircIn = 7;
	static CircOut = 8;
	static CircInOut = 9;
	//
	static CubicIn = 10;
	static CubicOut = 11;
	static CubicInOut = 12;
	//
	static ExpoIn = 13;
	static ExpoOut = 14;
	static ExpoInOut = 15;
	//
	static QuadIn = 16;
	static QuadOut = 17;
	static QuadInOut = 18;
	//
	static QuartIn = 19;
	static QuartOut = 20;
	static QuartInOut = 21;
	//
	static SineIn = 22;
	static SineOut = 23;
	static SineInOut = 24;
	static ElasticIn = 25;
	static ElasticOut = 26;
	static ElasticInOut = 27;
	//
	get particleNum() {return this._particleNum;}
	set particleNum(value) {
		this._particleNum = value;
		this.setParticleData()
	}
	get sprite3DMode() {return this._material._sprite3DMode;}
	set sprite3DMode(value) {return this._material.sprite3DMode = value;}
	get texture() {return this._material.diffuseTexture;}
	set texture(value) {return this._material.diffuseTexture = value;}
	get material() {return this._material}
	set material(v) {/*임의설정불가*/}
	#redGPUContext;
	#simParamData;
	computePipeline;
	particleBindGroup;
	particleBuffer;
	minLife = 2000;
	maxLife = 10000;
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
	minStartRotationX = -Math.random() * 360;
	maxStartRotationX = Math.random() * 360;
	minEndRotationX = -Math.random() * 360;
	maxEndRotationX = Math.random() * 360;
	//
	minStartRotationY = -Math.random() * 360;
	maxStartRotationY = Math.random() * 360;
	minEndRotationY = -Math.random() * 360;
	maxEndRotationY = Math.random() * 360;
	//
	minStartRotationZ = -Math.random() * 360;
	maxStartRotationZ = Math.random() * 360;
	minEndRotationZ = -Math.random() * 360;
	maxEndRotationZ = Math.random() * 360;
	//
	easeX = Particle.Linear;
	easeY = Particle.Linear;
	easeZ = Particle.Linear;
	easeScale = Particle.Linear;
	easeRotationX = Particle.Linear;
	easeRotationY = Particle.Linear;
	easeRotationZ = Particle.Linear;
	easeAlpha = Particle.Linear;
	compute(time) {
		this.#simParamData.set(
			[
				// startTime time
				time,
				// position
				this._x, this._y, this._z,
				// lifeRange
				this.minLife, this.maxLife,
				// x,y,z Range
				this.minStartX, this.maxStartX, this.minEndX, this.maxEndX, this.easeX,
				this.minStartY, this.maxStartY, this.minEndY, this.maxEndY, this.easeY,
				this.minStartZ, this.maxStartZ, this.minEndZ, this.maxEndZ, this.easeZ,
				// alphaRange
				this.minStartAlpha, this.maxStartAlpha, this.minEndAlpha, this.maxEndAlpha, this.easeAlpha,
				// scaleRange
				this.minStartScale, this.maxStartScale, this.minEndScale, this.maxEndScale, this.easeScale,
				// x,y,z Range
				this.minStartRotationX, this.maxStartRotationX, this.minEndRotationX, this.maxEndRotationX, this.easeRotationX,
				this.minStartRotationY, this.maxStartRotationY, this.minEndRotationY, this.maxEndRotationY, this.easeRotationY,
				this.minStartRotationZ, this.maxStartRotationZ, this.minEndRotationZ, this.maxEndRotationZ, this.easeRotationZ
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
		this._material = new ParticleMaterial(redGPUContext);
		{
			for(const k in initInfo){
				if(this.hasOwnProperty(k)) {
					console.log(k)
					this[k] = initInfo[k]
				}
			}
		}

		this.geometry = geometry || new Plane(redGPUContext);
		this.texture = texture;
		this.renderDrawLayerIndex = Render.DRAW_LAYER_INDEX2_Z_POINT_SORT;
		this._PROPERTY_NUM = 44
		this.blendColorSrc = 'src-alpha';
		this.blendColorDst = 'one';
		this.blendAlphaSrc = 'src-alpha';
		this.blendAlphaDst = 'one';
		this.depthWriteEnabled = false;
		this.cullMode = 'none'

		// 컴퓨트 파이프 라인 생성
		this.#simParamData = new Float32Array(
			[
				// startTime time
				performance.now(),
				// position
				this._x, this._y, this._z,
				// lifeRange
				this.minLife, this.maxLife,
				// x,y,z Range
				this.minStartX, this.maxStartX, this.minEndX, this.maxEndX, this.easeX,
				this.minStartY, this.maxStartY, this.minEndY, this.maxEndY, this.easeY,
				this.minStartZ, this.maxStartZ, this.minEndZ, this.maxEndZ, this.easeZ,
				// alphaRange
				this.minStartAlpha, this.maxStartAlpha, this.minEndAlpha, this.maxEndAlpha, this.easeAlpha,
				// scaleRange
				this.minStartScale, this.maxStartScale, this.minEndScale, this.maxEndScale, this.easeScale,
				// x,y,z Range
				this.minStartRotationX, this.maxStartRotationX, this.minEndRotationX, this.maxEndRotationX, this.easeRotationX,
				this.minStartRotationY, this.maxStartRotationY, this.minEndRotationY, this.maxEndRotationY, this.easeRotationY,
				this.minStartRotationZ, this.maxStartRotationZ, this.minEndRotationZ, this.maxEndRotationZ, this.easeRotationZ
			]
		)
		let bufferDescriptor = {
			size: this.#simParamData.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		};
		this.simParamBuffer = redGPUContext.device.createBuffer(bufferDescriptor);
		this.simParamBuffer.setSubData(0, this.#simParamData);
		this.pipeline = new PipelineParticle(redGPUContext, this)
		this.particleNum = particleNum || 1;
	}
	setParticleData() {
		let redGPUContext = this.#redGPUContext;
		const _PROPERTY_NUM = this._PROPERTY_NUM;
		const initialParticleData = new Float32Array(this._particleNum * _PROPERTY_NUM);
		const currentTime = performance.now();
		for (let i = 0; i < this._particleNum; ++i) {
			let life = Math.random() * this.maxLife;
			let age = Math.random() * life;
			initialParticleData[_PROPERTY_NUM * i + 0] = currentTime - age // start time
			initialParticleData[_PROPERTY_NUM * i + 1] = life; // life
			// position
			initialParticleData[_PROPERTY_NUM * i + 4] = 0; // x
			initialParticleData[_PROPERTY_NUM * i + 5] = 0; // y
			initialParticleData[_PROPERTY_NUM * i + 6] = 0; // z
			initialParticleData[_PROPERTY_NUM * i + 7] = // alpha;
				// scale
				initialParticleData[_PROPERTY_NUM * i + 8] = 0; // rotationX
			initialParticleData[_PROPERTY_NUM * i + 9] = 0; // rotationY
			initialParticleData[_PROPERTY_NUM * i + 10] = 0; // rotationZ
			initialParticleData[_PROPERTY_NUM * i + 11] = 0; // scale
			// x
			initialParticleData[_PROPERTY_NUM * i + 12] = Math.random() * (this.maxStartX - this.minStartX) + this.minStartX; // startValue
			initialParticleData[_PROPERTY_NUM * i + 13] = Math.random() * (this.maxEndX - this.minEndX) + this.minEndX; // endValue
			initialParticleData[_PROPERTY_NUM * i + 14] = this.easeX; // ease
			initialParticleData[_PROPERTY_NUM * i + 15] = this._x; // startPosition
			// y
			initialParticleData[_PROPERTY_NUM * i + 16] = Math.random() * (this.maxStartY - this.minStartY) + this.minStartY; // startValue
			initialParticleData[_PROPERTY_NUM * i + 17] = Math.random() * (this.maxEndY - this.minEndY) + this.minEndY; // endValue
			initialParticleData[_PROPERTY_NUM * i + 18] = this.easeY; // ease
			initialParticleData[_PROPERTY_NUM * i + 19] = this._y; // startPosition
			// z
			initialParticleData[_PROPERTY_NUM * i + 20] = Math.random() * (this.maxStartZ - this.minStartZ) + this.minStartZ; // startValue
			initialParticleData[_PROPERTY_NUM * i + 21] = Math.random() * (this.maxEndZ - this.minEndZ) + this.minEndZ; // endValue
			initialParticleData[_PROPERTY_NUM * i + 22] = this.easeZ; // ease
			initialParticleData[_PROPERTY_NUM * i + 23] = this._z; // startPosition
			// rotationX
			initialParticleData[_PROPERTY_NUM * i + 24] = Math.random() * (this.maxStartRotationX - this.minStartRotationX) + this.minStartRotationX; // startValue
			initialParticleData[_PROPERTY_NUM * i + 25] = Math.random() * (this.maxEndRotationX - this.minEndRotationX) + this.minEndRotationX; // endValue
			initialParticleData[_PROPERTY_NUM * i + 26] = this.easeRotationX; // ease
			initialParticleData[_PROPERTY_NUM * i + 27] = 0; //
			// rotationY
			initialParticleData[_PROPERTY_NUM * i + 28] = Math.random() * (this.maxStartRotationY - this.minStartRotationY) + this.minStartRotationY; // startValue
			initialParticleData[_PROPERTY_NUM * i + 29] = Math.random() * (this.maxEndRotationY - this.minEndRotationY) + this.minEndRotationY; // endValue
			initialParticleData[_PROPERTY_NUM * i + 30] = this.easeRotationY; // ease
			initialParticleData[_PROPERTY_NUM * i + 31] = 0; //
			// rotationZ
			initialParticleData[_PROPERTY_NUM * i + 32] = Math.random() * (this.maxStartRotationZ - this.minStartRotationZ) + this.minStartRotationZ; // startValue
			initialParticleData[_PROPERTY_NUM * i + 33] = Math.random() * (this.maxEndRotationZ - this.minEndRotationZ) + this.minEndRotationZ; // endValue
			initialParticleData[_PROPERTY_NUM * i + 34] = this.easeRotationZ; // ease
			initialParticleData[_PROPERTY_NUM * i + 35] = 0; //
			// scale
			initialParticleData[_PROPERTY_NUM * i + 36] = Math.random() * (this.maxStartScale - this.minStartScale) + this.minStartScale; // startValue
			initialParticleData[_PROPERTY_NUM * i + 37] = Math.random() * (this.maxEndScale - this.minEndScale) + this.minEndScale; // endValue
			initialParticleData[_PROPERTY_NUM * i + 38] = this.easeScale; // ease
			initialParticleData[_PROPERTY_NUM * i + 39] = 0; //
			// alpha
			initialParticleData[_PROPERTY_NUM * i + 40] = Math.random() * (this.maxStartAlpha - this.minStartAlpha) + this.minStartAlpha;
			; // startValue
			initialParticleData[_PROPERTY_NUM * i + 41] = Math.random() * (this.maxEndAlpha - this.minEndAlpha) + this.minEndAlpha; // endValue
			initialParticleData[_PROPERTY_NUM * i + 42] = this.easeAlpha; // ease
			initialParticleData[_PROPERTY_NUM * i + 43] = 0; //
		}
		if (this.particleBuffer) {
			this.particleBuffer.destroy()
			this.particleBuffer = null
		}
		this.particleBuffer = redGPUContext.device.createBuffer({
			size: initialParticleData.byteLength,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE
		});
		this.particleBuffer.setSubData(0, initialParticleData);
		let computeSource = getComputeSource(this._particleNum)
		let shaderModuleDescriptor = {
			code: redGPUContext.glslang.compileGLSL(computeSource, 'compute'),
			source: computeSource
		};
		console.log('shaderModuleDescriptor', shaderModuleDescriptor);
		let computeModule = redGPUContext.device.createShaderModule(shaderModuleDescriptor);
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
	}
}