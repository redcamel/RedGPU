import RedGPUContext from "../../../context/RedGPUContext";
import DefineForFragment from "../../../defineProperty/DefineForFragment";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../resources/sampler/Sampler";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "../shader/fragment.wgsl"
import skyAtmosphereFn from "./skyAtmosphereFn.wgsl"
import TransmittanceLUTTexture from "./generator/transmittance/TransmittanceLUTTexture";
import MultiScatteringLUTTexture from "./generator/multiScattering/MultiScatteringLUTTexture";
import SkyViewLUTTexture from "./generator/skyView/SkyViewLUTTexture";
import CameraVolumeLUTTexture from "./generator/cameraVolume/CameraVolumeLUTTexture";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + fragmentModuleSource)

interface SkyAtmosphereMaterial {
	/**
	 * [KO] 대기 투과율(Transmittance) LUT 텍스처
	 * [EN] Atmospheric Transmittance LUT texture
	 */
	transmittanceTexture: TransmittanceLUTTexture;
	/**
	 * [KO] 다중 산란(Multi-Scattering) LUT 텍스처
	 * [EN] Multi-Scattering LUT texture
	 */
	multiScatteringTexture: MultiScatteringLUTTexture;
	/**
	 * [KO] Sky-View LUT 텍스처
	 * [EN] Sky-View LUT texture
	 */
	skyViewTexture: SkyViewLUTTexture;
	/**
	 * [KO] 3D 공중 투시(Aerial Perspective) LUT 텍스처
	 * [EN] 3D Aerial Perspective LUT texture
	 */
	cameraVolumeTexture: CameraVolumeLUTTexture;
	/**
	 * [KO] 씬 깊이(Scene Depth) 텍스처
	 * [EN] Scene Depth texture
	 */
	sceneDepthTexture: GPUTextureView;
	/**
	 * [KO] 투과율 텍스처 샘플러
	 * [EN] Transmittance texture sampler
	 */
	transmittanceTextureSampler: Sampler;

	/**
	 * [KO] 태양의 방향 벡터
	 * [EN] Sun direction vector
	 */
	sunDirection: Float32Array;
	/**
	 * [KO] 태양의 시직경 (도 단위)
	 * [EN] Sun angular size (in degrees)
	 */
	sunSize: number;
	/**
	 * [KO] 레일리(Rayleigh) 산란 계수 (RGB)
	 * [EN] Rayleigh scattering coefficient (RGB)
	 */
	rayleighScattering: Float32Array;
	/**
	 * [KO] 미(Mie) 비등방성 계수
	 * [EN] Mie anisotropy coefficient
	 */
	mieAnisotropy: number;
	/**
	 * [KO] 오존 흡수 계수 (RGB)
	 * [EN] Ozone absorption coefficient (RGB)
	 */
	ozoneAbsorption: Float32Array;
	/**
	 * [KO] 오존층 중심 고도 (km)
	 * [EN] Ozone layer center altitude (km)
	 */
	ozoneLayerCenter: number;
	/**
	 * [KO] 지면 알베도 (RGB)
	 * [EN] Ground albedo (RGB)
	 */
	groundAlbedo: Float32Array;
	/**
	 * [KO] 지면 환경광 강도
	 * [EN] Ground ambient intensity
	 */
	groundAmbient: number;

	/**
	 * [KO] 지구 반지름 (km)
	 * [EN] Earth radius (km)
	 */
	earthRadius: number;
	/**
	 * [KO] 대기 높이 (km)
	 * [EN] Atmosphere height (km)
	 */
	atmosphereHeight: number;
	/**
	 * [KO] 미(Mie) 산란 계수
	 * [EN] Mie scattering coefficient
	 */
	mieScattering: number;
	/**
	 * [KO] 미(Mie) 소멸 계수
	 * [EN] Mie extinction coefficient
	 */
	mieExtinction: number;
	/**
	 * [KO] 레일리(Rayleigh) 스케일 높이 (km)
	 * [EN] Rayleigh scale height (km)
	 */
	rayleighScaleHeight: number;
	/**
	 * [KO] 미(Mie) 스케일 높이 (km)
	 * [EN] Mie scale height (km)
	 */
	mieScaleHeight: number;
	/**
	 * [KO] 카메라 높이 (km)
	 * [EN] Camera altitude (km)
	 */
	cameraHeight: number;
	/**
	 * [KO] 다중 산란 환경광 계수
	 * [EN] Multi-scattering ambient coefficient
	 */
	multiScatteringAmbient: number;
	/**
	 * [KO] 노출값
	 * [EN] Exposure value
	 */
	exposure: number;
	/**
	 * [KO] 태양 강도
	 * [EN] Sun intensity
	 */
	sunIntensity: number;
	/**
	 * [KO] 높이 안개 밀도
	 * [EN] Height fog density
	 */
	heightFogDensity: number;
	/**
	 * [KO] 높이 안개 감쇠 계수
	 * [EN] Height fog falloff coefficient
	 */
	heightFogFalloff: number;
	/**
	 * [KO] 지평선 연무 강도
	 * [EN] Horizon haze intensity
	 */
	horizonHaze: number;
	/**
	 * [KO] 미(Mie) 글로우 계수
	 * [EN] Mie glow coefficient
	 */
	mieGlow: number;
	/**
	 * [KO] 미(Mie) 헤일로 계수
	 * [EN] Mie halo coefficient
	 */
	mieHalo: number;
	/**
	 * [KO] 지면 광택도
	 * [EN] Ground shininess
	 */
	groundShininess: number;
	/**
	 * [KO] 지면 스펙큘러 강도
	 * [EN] Ground specular intensity
	 */
	groundSpecular: number;
	/**
	 * [KO] 오존층 두께 (km)
	 * [EN] Ozone layer width (km)
	 */
	ozoneLayerWidth: number;
}

/**
 * [KO] SkyAtmosphere 전용 재질 클래스입니다.
 * [EN] Material class dedicated to SkyAtmosphere.
 *
 * [KO] 이 재질은 대기 산란 계산에 필요한 각종 파라미터와 LUT 텍스처들을 관리합니다.
 * [EN] This material manages various parameters and LUT textures required for atmospheric scattering calculations.
 *
 * ### Example
 * ```typescript
 * const material = new RedGPU.SkyAtmosphereMaterial(redGPUContext);
 * ```
 *
 * @category Material
 */
class SkyAtmosphereMaterial extends ABitmapBaseMaterial {
	/**
	 * [KO] 파이프라인 갱신 필요 여부
	 * [EN] Whether the pipeline needs to be updated
	 */
	dirtyPipeline: boolean = false

	/**
	 * [KO] SkyAtmosphereMaterial 인스턴스를 생성합니다.
	 * [EN] Creates a SkyAtmosphereMaterial instance.
	 *
	 * @param redGPUContext -
	 * [KO] RedGPU 컨텍스트
	 * [EN] RedGPU context
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext, 'SKY_ATMOSPHERE_MATERIAL', SHADER_INFO, 2);
		this.initGPURenderInfos();

		// 초기화 (UE 표준값 기반)
		this.rayleighScattering = new Float32Array([0.0058, 0.0135, 0.0331]);
		this.mieAnisotropy = 0.9;
		this.ozoneAbsorption = new Float32Array([0.00065, 0.00188, 0.00008]);
		this.ozoneLayerCenter = 25.0;
		this.groundAlbedo = new Float32Array([0.15, 0.15, 0.15]);
		this.groundAmbient = 0.4;
		this.sunDirection = new Float32Array([0, 1, 0]);
		this.sunSize = 0.5;

		this.earthRadius = 6360.0;
		this.atmosphereHeight = 60.0;
		this.mieScattering = 0.021;
		this.mieExtinction = 0.021;
		this.rayleighScaleHeight = 8.0;
		this.mieScaleHeight = 1.2;
		this.cameraHeight = 0.2;
		this.multiScatteringAmbient = 0.05;
		this.exposure = 1.0;
		this.sunIntensity = 22.0;
		this.heightFogDensity = 0.0;
		this.heightFogFalloff = 0.1;
		this.horizonHaze = 0.3;
		this.mieGlow = 0.75;
		this.mieHalo = 0.99;
		this.groundShininess = 512.0;
		this.groundSpecular = 4.0;
		this.ozoneLayerWidth = 15.0;

		this.transmittanceTextureSampler = new Sampler(this.redGPUContext, {
			magFilter: 'linear',
			minFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		});
	}

	/**
	 * [KO] 프래그먼트 바인드 그룹을 명시적인 인덱스로 구성합니다.
	 * [EN] Configures the fragment bind group with explicit indices.
	 * @protected
	 */
	override _updateFragmentState() {
		const {gpuDevice, resourceManager} = this.redGPUContext;

		const entries: GPUBindGroupEntry[] = [
			// Binding 0: Uniform Buffer
			{
				binding: 0,
				resource: {
					buffer: this.gpuRenderInfo.fragmentUniformBuffer.gpuBuffer,
					offset: 0,
					size: this.gpuRenderInfo.fragmentUniformBuffer.size
				}
			},
			// Binding 1: Transmittance LUT (2D)
			{
				binding: 1,
				resource: resourceManager.getGPUResourceBitmapTextureView(this.transmittanceTexture?.gpuTexture) || resourceManager.emptyBitmapTextureView
			},
			// Binding 2: Multi-Scattering LUT (2D)
			{
				binding: 2,
				resource: resourceManager.getGPUResourceBitmapTextureView(this.multiScatteringTexture?.gpuTexture) || resourceManager.emptyBitmapTextureView
			},
			// Binding 3: Sky-View LUT (2D)
			{
				binding: 3,
				resource: resourceManager.getGPUResourceBitmapTextureView(this.skyViewTexture?.gpuTexture) || resourceManager.emptyBitmapTextureView
			},
			// Binding 4: Camera Volume LUT (3D)
			{
				binding: 4,
				resource: this.cameraVolumeTexture ? this.cameraVolumeTexture.gpuTextureView : resourceManager.emptyTexture3DView
			},
			// Binding 5: Scene Depth (Depth 2D)
			{
				binding: 5,
				resource: this.sceneDepthTexture || resourceManager.emptyDepthTextureView
			},
			// Binding 6: Sampler
			{
				binding: 6,
				resource: this.getGPUResourceSampler(this.transmittanceTextureSampler)
			}
		];

		const bindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: this.gpuRenderInfo.fragmentBindGroupLayout,
			label: this.FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
			entries
		};

		this.gpuRenderInfo.fragmentState = this.getFragmentRenderState();
		this.gpuRenderInfo.fragmentUniformBindGroup = gpuDevice.createBindGroup(bindGroupDescriptor);
	}
}

// 개별 속성 정의 (셰이더 구조체 AtmosphereParameters 순서와 정확히 일치해야 함)
DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['rayleighScattering']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, ['mieAnisotropy']);

DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['ozoneAbsorption']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, ['ozoneLayerCenter']);

DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['groundAlbedo']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, ['groundAmbient']);

DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['sunDirection']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, ['sunSize']);

// Scalars
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, [
	'earthRadius',
	'atmosphereHeight',
	'mieScattering',
	'mieExtinction',
	'rayleighScaleHeight',
	'mieScaleHeight',
	'cameraHeight',
	'multiScatteringAmbient',
	'exposure',
	'sunIntensity',
	'heightFogDensity',
	'heightFogFalloff',
	'horizonHaze',
	'mieGlow',
	'mieHalo',
	'groundShininess',
	'groundSpecular',
	'ozoneLayerWidth'
]);

DefineForFragment.defineTexture(SkyAtmosphereMaterial, [
	'transmittanceTexture',
	'multiScatteringTexture',
	'skyViewTexture',
]);

// [수정] sceneDepthTexture는 raw GPUTextureView이므로 리스너 로직이 없는 수동 정의 사용
Object.defineProperty(SkyAtmosphereMaterial.prototype, 'sceneDepthTexture', {
	get: function () { return this._sceneDepthTexture; },
	set: function (v) {
		this._sceneDepthTexture = v;
		this.dirtyPipeline = true;
		if (this.gpuRenderInfo?.fragmentShaderModule) this._updateFragmentState();
	}
});

DefineForFragment.defineTexture3D(SkyAtmosphereMaterial, [
	'cameraVolumeTexture',
]);

DefineForFragment.defineSampler(SkyAtmosphereMaterial, [
	'transmittanceTextureSampler',
]);

Object.freeze(SkyAtmosphereMaterial);
export default SkyAtmosphereMaterial;
