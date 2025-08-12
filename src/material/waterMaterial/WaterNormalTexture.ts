import RedGPUContext from "../../context/RedGPUContext";
import ANoiseTexture, { NoiseDefine } from "../../resources/texture/noiseTexture/core/ANoiseTexture";

const BASE_OPTIONS = {
	// 전역 제어 속성들만 유지
	waveScale: 10.0,              // 전체 파도 크기 스케일 (필수)
	waveHeight: 0.3,              // 전체 파도 높이 멀티플라이어 (필수)
	foamEdgeSize: 0.4,            // 폼 효과 크기 (필수)

	/** 거스트너 파도 1-4 (메인 파도 - 큰 스웰) */
	wave1DirectionX: 1.0, wave1DirectionY: 0.3, wave1Steepness: 0.20, wave1Wavelength: 15.0, wave1Speed: 1.0,
	wave2DirectionX: -0.8, wave2DirectionY: 1.2, wave2Steepness: 0.18, wave2Wavelength: 18.0, wave2Speed: 0.9,
	wave3DirectionX: 0.6, wave3DirectionY: -1.0, wave3Steepness: 0.16, wave3Wavelength: 20.0, wave3Speed: 1.1,
	wave4DirectionX: -1.1, wave4DirectionY: 0.5, wave4Steepness: 0.14, wave4Wavelength: 22.0, wave4Speed: 0.8,
	/** 거스트너 파도 5-8 (중간 파도 - 바람파) */
	wave5DirectionX: 0.9, wave5DirectionY: 0.8, wave5Steepness: 0.12, wave5Wavelength: 8.0, wave5Speed: 1.2,
	wave6DirectionX: -0.4, wave6DirectionY: -1.3, wave6Steepness: 0.11, wave6Wavelength: 9.5, wave6Speed: 1.3,
	wave7DirectionX: 1.3, wave7DirectionY: -0.2, wave7Steepness: 0.10, wave7Wavelength: 11.0, wave7Speed: 0.7,
	wave8DirectionX: -0.2, wave8DirectionY: 1.4, wave8Steepness: 0.09, wave8Wavelength: 12.5, wave8Speed: 1.4,
	/** 거스트너 파도 9-12 (작은 파도 - 캡피리파) */
	wave9DirectionX: 0.7, wave9DirectionY: -0.9, wave9Steepness: 0.08, wave9Wavelength: 4.5, wave9Speed: 1.6,
	wave10DirectionX: -1.2, wave10DirectionY: 0.6, wave10Steepness: 0.07, wave10Wavelength: 5.2, wave10Speed: 1.1,
	wave11DirectionX: 0.5, wave11DirectionY: 1.1, wave11Steepness: 0.06, wave11Wavelength: 6.0, wave11Speed: 1.8,
	wave12DirectionX: -0.9, wave12DirectionY: -0.4, wave12Steepness: 0.05, wave12Wavelength: 7.0, wave12Speed: 1.5,
	/** 거스트너 파도 13-16 (극소 파도 - 미세 디테일) */
	wave13DirectionX: 1.4, wave13DirectionY: 0.1, wave13Steepness: 0.04, wave13Wavelength: 2.5, wave13Speed: 2.0,
	wave14DirectionX: -0.3, wave14DirectionY: -1.5, wave14Steepness: 0.035, wave14Wavelength: 3.0, wave14Speed: 1.9,
	wave15DirectionX: 0.8, wave15DirectionY: 0.9, wave15Steepness: 0.03, wave15Wavelength: 3.5, wave15Speed: 2.2,
	wave16DirectionX: -1.0, wave16DirectionY: 0.2, wave16Steepness: 0.025, wave16Wavelength: 4.0, wave16Speed: 1.7,
}

const WATER_NORMAL_DEFINE: NoiseDefine = {
	uniformStruct: `
    waveScale: f32,
    waveHeight: f32,
    foamEdgeSize: f32,

    wave1DirectionX: f32, wave1DirectionY: f32, wave1Steepness: f32, wave1Wavelength: f32, wave1Speed: f32,
    wave2DirectionX: f32, wave2DirectionY: f32, wave2Steepness: f32, wave2Wavelength: f32, wave2Speed: f32,
    wave3DirectionX: f32, wave3DirectionY: f32, wave3Steepness: f32, wave3Wavelength: f32, wave3Speed: f32,
    wave4DirectionX: f32, wave4DirectionY: f32, wave4Steepness: f32, wave4Wavelength: f32, wave4Speed: f32,
    wave5DirectionX: f32, wave5DirectionY: f32, wave5Steepness: f32, wave5Wavelength: f32, wave5Speed: f32,
    wave6DirectionX: f32, wave6DirectionY: f32, wave6Steepness: f32, wave6Wavelength: f32, wave6Speed: f32,
    wave7DirectionX: f32, wave7DirectionY: f32, wave7Steepness: f32, wave7Wavelength: f32, wave7Speed: f32,
    wave8DirectionX: f32, wave8DirectionY: f32, wave8Steepness: f32, wave8Wavelength: f32, wave8Speed: f32,
    wave9DirectionX: f32, wave9DirectionY: f32, wave9Steepness: f32, wave9Wavelength: f32, wave9Speed: f32,
    wave10DirectionX: f32, wave10DirectionY: f32, wave10Steepness: f32, wave10Wavelength: f32, wave10Speed: f32,
    wave11DirectionX: f32, wave11DirectionY: f32, wave11Steepness: f32, wave11Wavelength: f32, wave11Speed: f32,
    wave12DirectionX: f32, wave12DirectionY: f32, wave12Steepness: f32, wave12Wavelength: f32, wave12Speed: f32,
    wave13DirectionX: f32, wave13DirectionY: f32, wave13Steepness: f32, wave13Wavelength: f32, wave13Speed: f32,
    wave14DirectionX: f32, wave14DirectionY: f32, wave14Steepness: f32, wave14Wavelength: f32, wave14Speed: f32,
    wave15DirectionX: f32, wave15DirectionY: f32, wave15Steepness: f32, wave15Wavelength: f32, wave15Speed: f32,
    wave16DirectionX: f32, wave16DirectionY: f32, wave16Steepness: f32, wave16Wavelength: f32, wave16Speed: f32,
  `,

	helperFunctions: `
    fn gerstnerWave(
      direction: vec2<f32>,
      steepness: f32,
      wavelength: f32,
      speed: f32,
      position: vec2<f32>,
      t: f32
    ) -> vec3<f32> {
      let k = 2.0 * 3.14159 / wavelength;
      let c = sqrt(9.8 / k);
      let d = normalize(direction);
      let f = k * (dot(d, position) - c * speed * t);
      let a = steepness / k;
      
      return vec3<f32>(
        d.x * a * cos(f),
        d.y * a * cos(f),
        a * sin(f)
      );
    }
    
    fn hash(p: vec2<f32>) -> f32 {
      let h = dot(p, vec2<f32>(127.1, 311.7));
      return fract(sin(h) * 43758.5453123);
    }
    
    fn noise(p: vec2<f32>) -> f32 {
      let i = floor(p);
      let f = fract(p);
      let u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      
      let a = hash(i + vec2<f32>(0.0, 0.0));
      let b = hash(i + vec2<f32>(1.0, 0.0));
      let c = hash(i + vec2<f32>(0.0, 1.0));
      let d = hash(i + vec2<f32>(1.0, 1.0));
      
      return mix(
        mix(a, b, u.x),
        mix(c, d, u.x),
        u.y
      );
    }
    
    fn fbm(p: vec2<f32>, octaves: i32) -> f32 {
      var value = 0.0;
      var amplitude = 0.5;
      var frequency = 1.0;
      var pos = p;
      
      let rotation = mat2x2<f32>(
        vec2<f32>(0.8, 0.6),
        vec2<f32>(-0.6, 0.8)
      );
      
      for (var i = 0; i < octaves; i = i + 1) {
        value += amplitude * noise(pos * frequency);
        pos = rotation * pos;
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      
      return value;
    }
    
    /** 16개의 거스트너 파도를 계산하는 함수 */
    fn calculateGerstnerWaves(uv: vec2<f32>, t: f32) -> vec3<f32> {
      let wavePos = uv * uniforms.waveScale;
      var totalWave = vec3<f32>(0.0, 0.0, 0.0);
      
      /** 메인 파도 (1-4) */
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave1DirectionX, uniforms.wave1DirectionY)), 
        uniforms.wave1Steepness, uniforms.wave1Wavelength, uniforms.wave1Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave2DirectionX, uniforms.wave2DirectionY)), 
        uniforms.wave2Steepness, uniforms.wave2Wavelength, uniforms.wave2Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave3DirectionX, uniforms.wave3DirectionY)), 
        uniforms.wave3Steepness, uniforms.wave3Wavelength, uniforms.wave3Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave4DirectionX, uniforms.wave4DirectionY)), 
        uniforms.wave4Steepness, uniforms.wave4Wavelength, uniforms.wave4Speed, wavePos, uniforms.time);
      
      /** 중간 파도 (5-8) */
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave5DirectionX, uniforms.wave5DirectionY)), 
        uniforms.wave5Steepness, uniforms.wave5Wavelength, uniforms.wave5Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave6DirectionX, uniforms.wave6DirectionY)), 
        uniforms.wave6Steepness, uniforms.wave6Wavelength, uniforms.wave6Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave7DirectionX, uniforms.wave7DirectionY)), 
        uniforms.wave7Steepness, uniforms.wave7Wavelength, uniforms.wave7Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave8DirectionX, uniforms.wave8DirectionY)), 
        uniforms.wave8Steepness, uniforms.wave8Wavelength, uniforms.wave8Speed, wavePos, uniforms.time);
      
      /** 작은 파도 (9-12) */
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave9DirectionX, uniforms.wave9DirectionY)), 
        uniforms.wave9Steepness, uniforms.wave9Wavelength, uniforms.wave9Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave10DirectionX, uniforms.wave10DirectionY)), 
        uniforms.wave10Steepness, uniforms.wave10Wavelength, uniforms.wave10Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave11DirectionX, uniforms.wave11DirectionY)), 
        uniforms.wave11Steepness, uniforms.wave11Wavelength, uniforms.wave11Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave12DirectionX, uniforms.wave12DirectionY)), 
        uniforms.wave12Steepness, uniforms.wave12Wavelength, uniforms.wave12Speed, wavePos, uniforms.time);
      
      /** 극소 파도 (13-16) */
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave13DirectionX, uniforms.wave13DirectionY)), 
        uniforms.wave13Steepness, uniforms.wave13Wavelength, uniforms.wave13Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave14DirectionX, uniforms.wave14DirectionY)), 
        uniforms.wave14Steepness, uniforms.wave14Wavelength, uniforms.wave14Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave15DirectionX, uniforms.wave15DirectionY)), 
        uniforms.wave15Steepness, uniforms.wave15Wavelength, uniforms.wave15Speed, wavePos, uniforms.time);
      totalWave += gerstnerWave(normalize(vec2<f32>(uniforms.wave16DirectionX, uniforms.wave16DirectionY)), 
        uniforms.wave16Steepness, uniforms.wave16Wavelength, uniforms.wave16Speed, wavePos, uniforms.time);
      
      return totalWave;
    }
    
    /** 높이값을 계산하는 함수 */
    fn calculateHeight(uv: vec2<f32>, t: f32) -> f32 {
      /** FBM 노이즈는 보조 효과로만 사용 */
      let fbmValue = fbm(uv * 2.5 + vec2<f32>(t * 0.1, t * 0.2), 3);
     
      
      /** 16개의 거스트너 파도가 메인 */
      let gerstnerResult = calculateGerstnerWaves(uv, t);
      
      /** 높이 합성 - 거스트너 파도 중심 */
      var height = gerstnerResult.z * uniforms.waveHeight;
      height += fbmValue * 0.15 * uniforms.waveHeight;
      
      return height;
    }
    
    fn calcNormal(heightMap: vec3<f32>, pixelSize: f32) -> vec3<f32> {
      let center = heightMap.z;
      let top = heightMap.y;
      let right = heightMap.x;
      
      let dx = (right - center) / pixelSize;
      let dy = (top - center) / pixelSize;
      
      return normalize(vec3<f32>(-dx, -dy, 1.0));
    }
    
    fn calculateFoam(height: f32, edgeThreshold: f32) -> f32 {
      let foamIntensity = smoothstep(edgeThreshold - 0.1, edgeThreshold + 0.1, abs(height));
      return foamIntensity * uniforms.foamEdgeSize;
    }
  `,

	mainLogic: `
    var finalColor = vec4<f32>(0.0, 1.0, 0.0, 1.0);
    
    let uv = base_uv;
    let t = uniforms.time;
    let pixelSize = 1.0 / dimW;
    
    /** 높이 계산 - 중앙, 우측, 상단 */
    let height = calculateHeight(uv, t);
    let heightRight = calculateHeight(uv + vec2<f32>(pixelSize, 0.0), t);
    let heightTop = calculateHeight(uv + vec2<f32>(0.0, pixelSize), t);
    
    let heightData = vec3<f32>(heightRight, heightTop, height);
    let normal = calcNormal(heightData, pixelSize * 2.0);
    
    /** 폼 효과 계산 */
    let foamAmount = calculateFoam(height, 0.4);
    
    /** 노멀 벡터를 텍스처 공간으로 인코딩 */
    let encodedNormal = normal * 0.5 + 0.5;
    
    /** 폼 효과를 알파 채널에 저장 */
    finalColor = vec4<f32>(
      encodedNormal.x,
      encodedNormal.y,
      encodedNormal.z,
      1.0 - foamAmount
    );
   
  `,

	uniformDefaults: BASE_OPTIONS
};

/**
 * 16개의 거스트너 파도를 사용한 물의 노멀 텍스처 생성 클래스
 * 개별 파도가 각각 방향, 가파름, 파장, 속도를 가지므로 중복 속성들을 제거
 * - 파도 1-4: 메인 파도 (큰 스웰, 15-22m 파장)
 * - 파도 5-8: 중간 파도 (바람파, 8-12.5m 파장)
 * - 파도 9-12: 작은 파도 (캡피리파, 4.5-7m 파장)
 * - 파도 13-16: 극소 파도 (미세 디테일, 2.5-4m 파장)
 */
class WaterNormalTexture extends ANoiseTexture {
	/** 전역 제어 속성들 */
	#waveScale: number = BASE_OPTIONS.waveScale;
	#waveHeight: number = BASE_OPTIONS.waveHeight;
	#foamEdgeSize: number = BASE_OPTIONS.foamEdgeSize;

	/** 거스트너 파도 1-16 속성들 */
	#wave1DirectionX: number = BASE_OPTIONS.wave1DirectionX; #wave1DirectionY: number = BASE_OPTIONS.wave1DirectionY;
	#wave1Steepness: number = BASE_OPTIONS.wave1Steepness; #wave1Wavelength: number = BASE_OPTIONS.wave1Wavelength; #wave1Speed: number = BASE_OPTIONS.wave1Speed;
	#wave2DirectionX: number = BASE_OPTIONS.wave2DirectionX; #wave2DirectionY: number = BASE_OPTIONS.wave2DirectionY;
	#wave2Steepness: number = BASE_OPTIONS.wave2Steepness; #wave2Wavelength: number = BASE_OPTIONS.wave2Wavelength; #wave2Speed: number = BASE_OPTIONS.wave2Speed;
	#wave3DirectionX: number = BASE_OPTIONS.wave3DirectionX; #wave3DirectionY: number = BASE_OPTIONS.wave3DirectionY;
	#wave3Steepness: number = BASE_OPTIONS.wave3Steepness; #wave3Wavelength: number = BASE_OPTIONS.wave3Wavelength; #wave3Speed: number = BASE_OPTIONS.wave3Speed;
	#wave4DirectionX: number = BASE_OPTIONS.wave4DirectionX; #wave4DirectionY: number = BASE_OPTIONS.wave4DirectionY;
	#wave4Steepness: number = BASE_OPTIONS.wave4Steepness; #wave4Wavelength: number = BASE_OPTIONS.wave4Wavelength; #wave4Speed: number = BASE_OPTIONS.wave4Speed;
	#wave5DirectionX: number = BASE_OPTIONS.wave5DirectionX; #wave5DirectionY: number = BASE_OPTIONS.wave5DirectionY;
	#wave5Steepness: number = BASE_OPTIONS.wave5Steepness; #wave5Wavelength: number = BASE_OPTIONS.wave5Wavelength; #wave5Speed: number = BASE_OPTIONS.wave5Speed;
	#wave6DirectionX: number = BASE_OPTIONS.wave6DirectionX; #wave6DirectionY: number = BASE_OPTIONS.wave6DirectionY;
	#wave6Steepness: number = BASE_OPTIONS.wave6Steepness; #wave6Wavelength: number = BASE_OPTIONS.wave6Wavelength; #wave6Speed: number = BASE_OPTIONS.wave6Speed;
	#wave7DirectionX: number = BASE_OPTIONS.wave7DirectionX; #wave7DirectionY: number = BASE_OPTIONS.wave7DirectionY;
	#wave7Steepness: number = BASE_OPTIONS.wave7Steepness; #wave7Wavelength: number = BASE_OPTIONS.wave7Wavelength; #wave7Speed: number = BASE_OPTIONS.wave7Speed;
	#wave8DirectionX: number = BASE_OPTIONS.wave8DirectionX; #wave8DirectionY: number = BASE_OPTIONS.wave8DirectionY;
	#wave8Steepness: number = BASE_OPTIONS.wave8Steepness; #wave8Wavelength: number = BASE_OPTIONS.wave8Wavelength; #wave8Speed: number = BASE_OPTIONS.wave8Speed;
	#wave9DirectionX: number = BASE_OPTIONS.wave9DirectionX; #wave9DirectionY: number = BASE_OPTIONS.wave9DirectionY;
	#wave9Steepness: number = BASE_OPTIONS.wave9Steepness; #wave9Wavelength: number = BASE_OPTIONS.wave9Wavelength; #wave9Speed: number = BASE_OPTIONS.wave9Speed;
	#wave10DirectionX: number = BASE_OPTIONS.wave10DirectionX; #wave10DirectionY: number = BASE_OPTIONS.wave10DirectionY;
	#wave10Steepness: number = BASE_OPTIONS.wave10Steepness; #wave10Wavelength: number = BASE_OPTIONS.wave10Wavelength; #wave10Speed: number = BASE_OPTIONS.wave10Speed;
	#wave11DirectionX: number = BASE_OPTIONS.wave11DirectionX; #wave11DirectionY: number = BASE_OPTIONS.wave11DirectionY;
	#wave11Steepness: number = BASE_OPTIONS.wave11Steepness; #wave11Wavelength: number = BASE_OPTIONS.wave11Wavelength; #wave11Speed: number = BASE_OPTIONS.wave11Speed;
	#wave12DirectionX: number = BASE_OPTIONS.wave12DirectionX; #wave12DirectionY: number = BASE_OPTIONS.wave12DirectionY;
	#wave12Steepness: number = BASE_OPTIONS.wave12Steepness; #wave12Wavelength: number = BASE_OPTIONS.wave12Wavelength; #wave12Speed: number = BASE_OPTIONS.wave12Speed;
	#wave13DirectionX: number = BASE_OPTIONS.wave13DirectionX; #wave13DirectionY: number = BASE_OPTIONS.wave13DirectionY;
	#wave13Steepness: number = BASE_OPTIONS.wave13Steepness; #wave13Wavelength: number = BASE_OPTIONS.wave13Wavelength; #wave13Speed: number = BASE_OPTIONS.wave13Speed;
	#wave14DirectionX: number = BASE_OPTIONS.wave14DirectionX; #wave14DirectionY: number = BASE_OPTIONS.wave14DirectionY;
	#wave14Steepness: number = BASE_OPTIONS.wave14Steepness; #wave14Wavelength: number = BASE_OPTIONS.wave14Wavelength; #wave14Speed: number = BASE_OPTIONS.wave14Speed;
	#wave15DirectionX: number = BASE_OPTIONS.wave15DirectionX; #wave15DirectionY: number = BASE_OPTIONS.wave15DirectionY;
	#wave15Steepness: number = BASE_OPTIONS.wave15Steepness; #wave15Wavelength: number = BASE_OPTIONS.wave15Wavelength; #wave15Speed: number = BASE_OPTIONS.wave15Speed;
	#wave16DirectionX: number = BASE_OPTIONS.wave16DirectionX; #wave16DirectionY: number = BASE_OPTIONS.wave16DirectionY;
	#wave16Steepness: number = BASE_OPTIONS.wave16Steepness; #wave16Wavelength: number = BASE_OPTIONS.wave16Wavelength; #wave16Speed: number = BASE_OPTIONS.wave16Speed;

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 512,
		height: number = 512
	) {
		super(redGPUContext, width, height, WATER_NORMAL_DEFINE);
		this.cacheKey = `WaterNormalTexture_${width}x${height}_${Date.now()}`;
	}

	/** 전역 제어 속성들 - 필수 속성들만 유지 */
	get waveScale(): number { return this.#waveScale; }
	set waveScale(value: number) { this.#waveScale = value; this.updateUniform('waveScale', value); }
	get waveHeight(): number { return this.#waveHeight; }
	set waveHeight(value: number) { this.#waveHeight = value; this.updateUniform('waveHeight', value); }
	get foamEdgeSize(): number { return this.#foamEdgeSize; }
	set foamEdgeSize(value: number) { this.#foamEdgeSize = value; this.updateUniform('foamEdgeSize', value); }

	/** 거스트너 파도 1-16 getter/setter */
	get wave1DirectionX(): number { return this.#wave1DirectionX; } set wave1DirectionX(value: number) { this.#wave1DirectionX = value; this.updateUniform('wave1DirectionX', value); }
	get wave1DirectionY(): number { return this.#wave1DirectionY; } set wave1DirectionY(value: number) { this.#wave1DirectionY = value; this.updateUniform('wave1DirectionY', value); }
	get wave1Steepness(): number { return this.#wave1Steepness; } set wave1Steepness(value: number) { this.#wave1Steepness = value; this.updateUniform('wave1Steepness', value); }
	get wave1Wavelength(): number { return this.#wave1Wavelength; } set wave1Wavelength(value: number) { this.#wave1Wavelength = value; this.updateUniform('wave1Wavelength', value); }
	get wave1Speed(): number { return this.#wave1Speed; } set wave1Speed(value: number) { this.#wave1Speed = value; this.updateUniform('wave1Speed', value); }

	get wave2DirectionX(): number { return this.#wave2DirectionX; } set wave2DirectionX(value: number) { this.#wave2DirectionX = value; this.updateUniform('wave2DirectionX', value); }
	get wave2DirectionY(): number { return this.#wave2DirectionY; } set wave2DirectionY(value: number) { this.#wave2DirectionY = value; this.updateUniform('wave2DirectionY', value); }
	get wave2Steepness(): number { return this.#wave2Steepness; } set wave2Steepness(value: number) { this.#wave2Steepness = value; this.updateUniform('wave2Steepness', value); }
	get wave2Wavelength(): number { return this.#wave2Wavelength; } set wave2Wavelength(value: number) { this.#wave2Wavelength = value; this.updateUniform('wave2Wavelength', value); }
	get wave2Speed(): number { return this.#wave2Speed; } set wave2Speed(value: number) { this.#wave2Speed = value; this.updateUniform('wave2Speed', value); }

	get wave3DirectionX(): number { return this.#wave3DirectionX; } set wave3DirectionX(value: number) { this.#wave3DirectionX = value; this.updateUniform('wave3DirectionX', value); }
	get wave3DirectionY(): number { return this.#wave3DirectionY; } set wave3DirectionY(value: number) { this.#wave3DirectionY = value; this.updateUniform('wave3DirectionY', value); }
	get wave3Steepness(): number { return this.#wave3Steepness; } set wave3Steepness(value: number) { this.#wave3Steepness = value; this.updateUniform('wave3Steepness', value); }
	get wave3Wavelength(): number { return this.#wave3Wavelength; } set wave3Wavelength(value: number) { this.#wave3Wavelength = value; this.updateUniform('wave3Wavelength', value); }
	get wave3Speed(): number { return this.#wave3Speed; } set wave3Speed(value: number) { this.#wave3Speed = value; this.updateUniform('wave3Speed', value); }

	get wave4DirectionX(): number { return this.#wave4DirectionX; } set wave4DirectionX(value: number) { this.#wave4DirectionX = value; this.updateUniform('wave4DirectionX', value); }
	get wave4DirectionY(): number { return this.#wave4DirectionY; } set wave4DirectionY(value: number) { this.#wave4DirectionY = value; this.updateUniform('wave4DirectionY', value); }
	get wave4Steepness(): number { return this.#wave4Steepness; } set wave4Steepness(value: number) { this.#wave4Steepness = value; this.updateUniform('wave4Steepness', value); }
	get wave4Wavelength(): number { return this.#wave4Wavelength; } set wave4Wavelength(value: number) { this.#wave4Wavelength = value; this.updateUniform('wave4Wavelength', value); }
	get wave4Speed(): number { return this.#wave4Speed; } set wave4Speed(value: number) { this.#wave4Speed = value; this.updateUniform('wave4Speed', value); }

	get wave5DirectionX(): number { return this.#wave5DirectionX; } set wave5DirectionX(value: number) { this.#wave5DirectionX = value; this.updateUniform('wave5DirectionX', value); }
	get wave5DirectionY(): number { return this.#wave5DirectionY; } set wave5DirectionY(value: number) { this.#wave5DirectionY = value; this.updateUniform('wave5DirectionY', value); }
	get wave5Steepness(): number { return this.#wave5Steepness; } set wave5Steepness(value: number) { this.#wave5Steepness = value; this.updateUniform('wave5Steepness', value); }
	get wave5Wavelength(): number { return this.#wave5Wavelength; } set wave5Wavelength(value: number) { this.#wave5Wavelength = value; this.updateUniform('wave5Wavelength', value); }
	get wave5Speed(): number { return this.#wave5Speed; } set wave5Speed(value: number) { this.#wave5Speed = value; this.updateUniform('wave5Speed', value); }

	get wave6DirectionX(): number { return this.#wave6DirectionX; } set wave6DirectionX(value: number) { this.#wave6DirectionX = value; this.updateUniform('wave6DirectionX', value); }
	get wave6DirectionY(): number { return this.#wave6DirectionY; } set wave6DirectionY(value: number) { this.#wave6DirectionY = value; this.updateUniform('wave6DirectionY', value); }
	get wave6Steepness(): number { return this.#wave6Steepness; } set wave6Steepness(value: number) { this.#wave6Steepness = value; this.updateUniform('wave6Steepness', value); }
	get wave6Wavelength(): number { return this.#wave6Wavelength; } set wave6Wavelength(value: number) { this.#wave6Wavelength = value; this.updateUniform('wave6Wavelength', value); }
	get wave6Speed(): number { return this.#wave6Speed; } set wave6Speed(value: number) { this.#wave6Speed = value; this.updateUniform('wave6Speed', value); }

	get wave7DirectionX(): number { return this.#wave7DirectionX; } set wave7DirectionX(value: number) { this.#wave7DirectionX = value; this.updateUniform('wave7DirectionX', value); }
	get wave7DirectionY(): number { return this.#wave7DirectionY; } set wave7DirectionY(value: number) { this.#wave7DirectionY = value; this.updateUniform('wave7DirectionY', value); }
	get wave7Steepness(): number { return this.#wave7Steepness; } set wave7Steepness(value: number) { this.#wave7Steepness = value; this.updateUniform('wave7Steepness', value); }
	get wave7Wavelength(): number { return this.#wave7Wavelength; } set wave7Wavelength(value: number) { this.#wave7Wavelength = value; this.updateUniform('wave7Wavelength', value); }
	get wave7Speed(): number { return this.#wave7Speed; } set wave7Speed(value: number) { this.#wave7Speed = value; this.updateUniform('wave7Speed', value); }

	get wave8DirectionX(): number { return this.#wave8DirectionX; } set wave8DirectionX(value: number) { this.#wave8DirectionX = value; this.updateUniform('wave8DirectionX', value); }
	get wave8DirectionY(): number { return this.#wave8DirectionY; } set wave8DirectionY(value: number) { this.#wave8DirectionY = value; this.updateUniform('wave8DirectionY', value); }
	get wave8Steepness(): number { return this.#wave8Steepness; } set wave8Steepness(value: number) { this.#wave8Steepness = value; this.updateUniform('wave8Steepness', value); }
	get wave8Wavelength(): number { return this.#wave8Wavelength; } set wave8Wavelength(value: number) { this.#wave8Wavelength = value; this.updateUniform('wave8Wavelength', value); }
	get wave8Speed(): number { return this.#wave8Speed; } set wave8Speed(value: number) { this.#wave8Speed = value; this.updateUniform('wave8Speed', value); }

	get wave9DirectionX(): number { return this.#wave9DirectionX; } set wave9DirectionX(value: number) { this.#wave9DirectionX = value; this.updateUniform('wave9DirectionX', value); }
	get wave9DirectionY(): number { return this.#wave9DirectionY; } set wave9DirectionY(value: number) { this.#wave9DirectionY = value; this.updateUniform('wave9DirectionY', value); }
	get wave9Steepness(): number { return this.#wave9Steepness; } set wave9Steepness(value: number) { this.#wave9Steepness = value; this.updateUniform('wave9Steepness', value); }
	get wave9Wavelength(): number { return this.#wave9Wavelength; } set wave9Wavelength(value: number) { this.#wave9Wavelength = value; this.updateUniform('wave9Wavelength', value); }
	get wave9Speed(): number { return this.#wave9Speed; } set wave9Speed(value: number) { this.#wave9Speed = value; this.updateUniform('wave9Speed', value); }

	get wave10DirectionX(): number { return this.#wave10DirectionX; } set wave10DirectionX(value: number) { this.#wave10DirectionX = value; this.updateUniform('wave10DirectionX', value); }
	get wave10DirectionY(): number { return this.#wave10DirectionY; } set wave10DirectionY(value: number) { this.#wave10DirectionY = value; this.updateUniform('wave10DirectionY', value); }
	get wave10Steepness(): number { return this.#wave10Steepness; } set wave10Steepness(value: number) { this.#wave10Steepness = value; this.updateUniform('wave10Steepness', value); }
	get wave10Wavelength(): number { return this.#wave10Wavelength; } set wave10Wavelength(value: number) { this.#wave10Wavelength = value; this.updateUniform('wave10Wavelength', value); }
	get wave10Speed(): number { return this.#wave10Speed; } set wave10Speed(value: number) { this.#wave10Speed = value; this.updateUniform('wave10Speed', value); }

	get wave11DirectionX(): number { return this.#wave11DirectionX; } set wave11DirectionX(value: number) { this.#wave11DirectionX = value; this.updateUniform('wave11DirectionX', value); }
	get wave11DirectionY(): number { return this.#wave11DirectionY; } set wave11DirectionY(value: number) { this.#wave11DirectionY = value; this.updateUniform('wave11DirectionY', value); }
	get wave11Steepness(): number { return this.#wave11Steepness; } set wave11Steepness(value: number) { this.#wave11Steepness = value; this.updateUniform('wave11Steepness', value); }
	get wave11Wavelength(): number { return this.#wave11Wavelength; } set wave11Wavelength(value: number) { this.#wave11Wavelength = value; this.updateUniform('wave11Wavelength', value); }
	get wave11Speed(): number { return this.#wave11Speed; } set wave11Speed(value: number) { this.#wave11Speed = value; this.updateUniform('wave11Speed', value); }

	get wave12DirectionX(): number { return this.#wave12DirectionX; } set wave12DirectionX(value: number) { this.#wave12DirectionX = value; this.updateUniform('wave12DirectionX', value); }
	get wave12DirectionY(): number { return this.#wave12DirectionY; } set wave12DirectionY(value: number) { this.#wave12DirectionY = value; this.updateUniform('wave12DirectionY', value); }
	get wave12Steepness(): number { return this.#wave12Steepness; } set wave12Steepness(value: number) { this.#wave12Steepness = value; this.updateUniform('wave12Steepness', value); }
	get wave12Wavelength(): number { return this.#wave12Wavelength; } set wave12Wavelength(value: number) { this.#wave12Wavelength = value; this.updateUniform('wave12Wavelength', value); }
	get wave12Speed(): number { return this.#wave12Speed; } set wave12Speed(value: number) { this.#wave12Speed = value; this.updateUniform('wave12Speed', value); }

	get wave13DirectionX(): number { return this.#wave13DirectionX; } set wave13DirectionX(value: number) { this.#wave13DirectionX = value; this.updateUniform('wave13DirectionX', value); }
	get wave13DirectionY(): number { return this.#wave13DirectionY; } set wave13DirectionY(value: number) { this.#wave13DirectionY = value; this.updateUniform('wave13DirectionY', value); }
	get wave13Steepness(): number { return this.#wave13Steepness; } set wave13Steepness(value: number) { this.#wave13Steepness = value; this.updateUniform('wave13Steepness', value); }
	get wave13Wavelength(): number { return this.#wave13Wavelength; } set wave13Wavelength(value: number) { this.#wave13Wavelength = value; this.updateUniform('wave13Wavelength', value); }
	get wave13Speed(): number { return this.#wave13Speed; } set wave13Speed(value: number) { this.#wave13Speed = value; this.updateUniform('wave13Speed', value); }

	get wave14DirectionX(): number { return this.#wave14DirectionX; } set wave14DirectionX(value: number) { this.#wave14DirectionX = value; this.updateUniform('wave14DirectionX', value); }
	get wave14DirectionY(): number { return this.#wave14DirectionY; } set wave14DirectionY(value: number) { this.#wave14DirectionY = value; this.updateUniform('wave14DirectionY', value); }
	get wave14Steepness(): number { return this.#wave14Steepness; } set wave14Steepness(value: number) { this.#wave14Steepness = value; this.updateUniform('wave14Steepness', value); }
	get wave14Wavelength(): number { return this.#wave14Wavelength; } set wave14Wavelength(value: number) { this.#wave14Wavelength = value; this.updateUniform('wave14Wavelength', value); }
	get wave14Speed(): number { return this.#wave14Speed; } set wave14Speed(value: number) { this.#wave14Speed = value; this.updateUniform('wave14Speed', value); }

	get wave15DirectionX(): number { return this.#wave15DirectionX; } set wave15DirectionX(value: number) { this.#wave15DirectionX = value; this.updateUniform('wave15DirectionX', value); }
	get wave15DirectionY(): number { return this.#wave15DirectionY; } set wave15DirectionY(value: number) { this.#wave15DirectionY = value; this.updateUniform('wave15DirectionY', value); }
	get wave15Steepness(): number { return this.#wave15Steepness; } set wave15Steepness(value: number) { this.#wave15Steepness = value; this.updateUniform('wave15Steepness', value); }
	get wave15Wavelength(): number { return this.#wave15Wavelength; } set wave15Wavelength(value: number) { this.#wave15Wavelength = value; this.updateUniform('wave15Wavelength', value); }
	get wave15Speed(): number { return this.#wave15Speed; } set wave15Speed(value: number) { this.#wave15Speed = value; this.updateUniform('wave15Speed', value); }

	get wave16DirectionX(): number { return this.#wave16DirectionX; } set wave16DirectionX(value: number) { this.#wave16DirectionX = value; this.updateUniform('wave16DirectionX', value); }
	get wave16DirectionY(): number { return this.#wave16DirectionY; } set wave16DirectionY(value: number) { this.#wave16DirectionY = value; this.updateUniform('wave16DirectionY', value); }
	get wave16Steepness(): number { return this.#wave16Steepness; } set wave16Steepness(value: number) { this.#wave16Steepness = value; this.updateUniform('wave16Steepness', value); }
	get wave16Wavelength(): number { return this.#wave16Wavelength; } set wave16Wavelength(value: number) { this.#wave16Wavelength = value; this.updateUniform('wave16Wavelength', value); }
	get wave16Speed(): number { return this.#wave16Speed; } set wave16Speed(value: number) { this.#wave16Speed = value; this.updateUniform('wave16Speed', value); }
}

export default WaterNormalTexture;
