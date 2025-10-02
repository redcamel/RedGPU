import Camera2D from "../../camera/camera/Camera2D";
import AController from "../../camera/core/AController";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_COMPARE_FUNCTION from "../../gpuConst/GPU_COMPARE_FUNCTION";
import PassClusterLightBound from "../../light/clusterLight/PassClusterLightBound";
import PassClustersLight from "../../light/clusterLight/PassClustersLight";
import PassClustersLightHelper from "../../light/clusterLight/PassClustersLightHelper";
import PostEffectManager from "../../postEffect/PostEffectManager";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import Sampler from "../../resources/sampler/Sampler";
import SystemCode from "../../resources/systemCode/SystemCode";
import CubeTexture from "../../resources/texture/CubeTexture";
import IBL from "../../resources/texture/ibl/IBL";
import IBLCubeTexture from "../../resources/texture/ibl/IBLCubeTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import DrawDebuggerPointLight from "../drawDebugger/light/DrawDebuggerPointLight";
import DrawDebuggerSpotLight from "../drawDebugger/light/DrawDebuggerSpotLight";
import Scene from "../scene/Scene";
import SkyBox from "../skyboxs/skyBox/SkyBox";
import AView from "./core/AView";
import ViewRenderTextureManager from "./core/ViewRenderTextureManager";

const SHADER_INFO = parseWGSL(SystemCode.SYSTEM_UNIFORM)
const UNIFORM_STRUCT = SHADER_INFO.uniforms.systemUniforms;

/**
 * 3D 렌더링 뷰 클래스입니다. AView를 확장하여 3D 장면 렌더링 기능을 제공합니다.
 *
 * 3D 장면 렌더링, 조명, 그림자, 포스트 이펙트, IBL(이미지 기반 조명) 처리를 담당합니다.
 *
 * @example
 * ```javascript
 * const scene = new RedGPU.Display.Scene();
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
 * view.grid = true;
 * redGPUContext.addView(view);
 * ```
 * <iframe src="/RedGPU/examples/3d/view/singleView/" ></iframe>
 *
 * 아래는 View3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Multi View3D example](/RedGPU/examples/3d/view/multiView/)
 * @category View
 */
class View3D extends AView {
	/**
	 * 정점 셰이더용 시스템 유니폼 구조 정보
	 * @private
	 */
	#systemUniform_Vertex_StructInfo: any = UNIFORM_STRUCT;
	/**
	 * 정점 셰이더 시스템 유니폼용 GPU 바인드 그룹
	 * @private
	 */
	#systemUniform_Vertex_UniformBindGroup: GPUBindGroup;
	/**
	 * 정점 셰이더 시스템 유니폼용 유니폼 버퍼
	 * @private
	 */
	#systemUniform_Vertex_UniformBuffer: UniformBuffer;
	/**
	 * 환경 렌더링을 위한 스카이박스 객체
	 * @private
	 */
	#skybox: SkyBox
	/**
	 * IBL(이미지 기반 조명) 설정
	 * @private
	 */
	#ibl: IBL
	/**
	 * 디버그 뷰 렌더링 상태 데이터
	 * @private
	 * @readonly
	 */
	readonly #renderViewStateData: RenderViewStateData
	/**
	 * 포스트 이펙트 처리 매니저
	 * @private
	 * @readonly
	 */
	readonly #postEffectManager: PostEffectManager
	/**
	 * 렌더 타겟 처리를 위한 뷰 렌더 텍스처 매니저
	 * @private
	 * @readonly
	 */
	readonly #viewRenderTextureManager: ViewRenderTextureManager
	/**
	 * 바인드 그룹 생성 최적화를 위한 이전 프레임 정보 캐시
	 * @private
	 */
	#prevInfoList = []
	/**
	 * 그림자 깊이 비교용 GPU 샘플러
	 * @private
	 */
	#shadowDepthSampler: GPUSampler
	/**
	 * 일반적인 텍스처 샘플링용 기본 GPU 샘플러
	 * @private
	 */
	#basicSampler: GPUSampler
	/**
	 * 타일링된 텍스처 샘플링용 압축 GPU 샘플러
	 * @private
	 */
	#basicPackedSampler: GPUSampler
	/**
	 * 클러스터 라이트 데이터를 저장하는 GPU 버퍼
	 * @private
	 */
	#clusterLightsBuffer: GPUBuffer
	/**
	 * 클러스터 라이트 데이터를 담은 Float32Array
	 * @private
	 */
	#clusterLightsBufferData: Float32Array
	/**
	 * 클러스터 라이트 처리 패스
	 * @private
	 */
	#passLightClusters: PassClustersLight
	/**
	 * 클러스터 라이트 경계 계산 패스
	 * @private
	 */
	#passLightClustersBound: PassClusterLightBound
	/**
	 * 더티 체킹용 이전 프레임 너비
	 * @private
	 */
	#prevWidth: number = undefined
	/**
	 * 더티 체킹용 이전 프레임 높이
	 * @private
	 */
	#prevHeight: number = undefined
	/**
	 * 리소스 관리를 위한 이전 프레임의 IBL 텍스처
	 * @private
	 */
	#prevIBL_iblTexture: IBLCubeTexture
	/**
	 * 리소스 관리를 위한 이전 프레임의 IBL 복사열 텍스처
	 * @private
	 */
	#prevIBL_irradianceTexture: IBLCubeTexture

	/**
	 * View3D 인스턴스를 생성합니다.
	 * 3D 렌더링에 필요한 모든 컴포넌트(조명, 포스트 이펙트, 리소스 관리)를 초기화합니다.
	 *
	 * @param redGPUContext - 렌더링 작업을 위한 WebGPU 컨텍스트
	 * @param scene - 렌더링할 3D 장면
	 * @param camera - 카메라 컨트롤러 (3D 또는 2D 카메라)
	 * @param name - 뷰의 선택적 이름 식별자
	 */
	constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string) {
		super(redGPUContext, scene, camera, name)
		this.#init()
		this.#viewRenderTextureManager = new ViewRenderTextureManager(this)
		this.#renderViewStateData = new RenderViewStateData(this)
		this.#postEffectManager = new PostEffectManager(this)
	}

	/**
	 * 뷰 렌더 텍스처 매니저를 가져옵니다.
	 * @returns ViewRenderTextureManager 인스턴스
	 */
	get viewRenderTextureManager(): ViewRenderTextureManager {
		return this.#viewRenderTextureManager;
	}

	/**
	 * 정점 셰이더용 시스템 유니폼 구조 정보를 가져옵니다.
	 * @returns 유니폼 구조 정보 객체
	 */
	get systemUniform_Vertex_StructInfo(): any {
		return this.#systemUniform_Vertex_StructInfo;
	}

	/**
	 * 정점 셰이더 시스템 유니폼용 GPU 바인드 그룹을 가져옵니다.
	 * @returns 정점 유니폼용 GPUBindGroup
	 */
	get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup {
		return this.#systemUniform_Vertex_UniformBindGroup;
	}

	/**
	 * 정점 셰이더 시스템 유니폼용 유니폼 버퍼를 가져옵니다.
	 * @returns UniformBuffer 인스턴스
	 */
	get systemUniform_Vertex_UniformBuffer(): UniformBuffer {
		return this.#systemUniform_Vertex_UniformBuffer;
	}

	/**
	 * 클러스터 라이트 경계 패스를 가져옵니다.
	 * @returns PassClusterLightBound 인스턴스
	 */
	get passLightClustersBound(): PassClusterLightBound {
		return this.#passLightClustersBound;
	}

	/**
	 * IBL(이미지 기반 조명) 설정을 가져옵니다.
	 * @returns IBL 인스턴스
	 */
	get ibl(): IBL {
		return this.#ibl;
	}

	/**
	 * IBL(이미지 기반 조명) 설정을 설정합니다.
	 * @param value - 설정할 IBL 인스턴스
	 */
	set ibl(value: IBL) {
		this.#ibl = value;
	}

	/**
	 * 포스트 이펙트 매니저를 가져옵니다.
	 * @returns PostEffectManager 인스턴스
	 */
	get postEffectManager(): PostEffectManager {
		return this.#postEffectManager;
	}

	/**
	 * 디버그 뷰 렌더링 상태를 가져옵니다.
	 * @returns RenderViewStateData 인스턴스
	 */
	get renderViewStateData(): RenderViewStateData {
		return this.#renderViewStateData;
	}

	/**
	 * 스카이박스를 가져옵니다.
	 * @returns SkyBox 인스턴스
	 */
	get skybox(): SkyBox {
		return this.#skybox;
	}

	/**
	 * 스카이박스를 설정합니다.
	 * 이전 텍스처의 리소스 상태를 관리하고 새 텍스처로 교체합니다.
	 * @param value - 설정할 SkyBox 인스턴스
	 */
	set skybox(value: SkyBox) {
		const {resourceManager} = this.redGPUContext
		const prevTexture = this.#skybox?.skyboxTexture
		const newTexture = value?.skyboxTexture
		if (prevTexture && prevTexture !== newTexture) {
			this.#manageIBLResourceState(resourceManager, prevTexture.cacheKey, false);
		}
		this.#skybox = value;
	}

	/**
	 * 뷰를 업데이트하고 렌더링 준비를 수행합니다.
	 * 유니폼 데이터 업데이트, 바인드 그룹 생성, 클러스터 라이트 계산을 처리합니다.
	 *
	 * @param view - 업데이트할 View3D 인스턴스
	 * @param shadowRender - 그림자 렌더링 여부 (기본값: false)
	 * @param calcPointLightCluster - 포인트 라이트 클러스터 계산 여부 (기본값: false)
	 * @param renderPath1ResultTextureView - 렌더 패스 1 결과 텍스처 뷰 (선택사항)
	 */
	update(view: View3D, shadowRender: boolean = false, calcPointLightCluster: boolean = false, renderPath1ResultTextureView?: GPUTextureView) {
		const {scene} = view
		const {shadowManager} = scene
		const {directionalShadowManager} = shadowManager
		const ibl = view.ibl
		const ibl_iblTexture = ibl?.iblTexture?.gpuTexture
		const ibl_irradianceTexture = ibl?.irradianceTexture?.gpuTexture
		let shadowDepthTextureView = shadowRender ? directionalShadowManager.shadowDepthTextureViewEmpty : directionalShadowManager.shadowDepthTextureView
		const index = view.redGPUContext.viewList.indexOf(view)
		const key = `${index}_${shadowRender ? 'shadowRender' : 'basic'}_2path${!!renderPath1ResultTextureView}`
		if (index > -1) {
			let needResetBindGroup = true
			let prevInfo = this.#prevInfoList[key]
			if (prevInfo) {
				needResetBindGroup = (
					prevInfo.ibl !== ibl ||
					prevInfo.ibl_iblTexture !== ibl_iblTexture ||
					prevInfo.ibl_irradianceTexture !== ibl_irradianceTexture ||
					prevInfo.renderPath1ResultTextureView !== renderPath1ResultTextureView ||
					prevInfo.shadowDepthTextureView !== shadowDepthTextureView
					|| !this.#passLightClusters
				)
			}
			if (needResetBindGroup) this.#createVertexUniformBindGroup(key, shadowDepthTextureView, view.ibl, renderPath1ResultTextureView)
			else this.#systemUniform_Vertex_UniformBindGroup = this.#prevInfoList[key].vertexUniformBindGroup;
			[
				{key: 'useIblTexture', value: [ibl_iblTexture ? 1 : 0]},
				{key: 'time', value: [view.renderViewStateData.timestamp || 0]},
				{key: 'isView3D', value: [this.constructor === View3D ? 1 : 0]},
			].forEach(({key, value}) => {
				this.redGPUContext.gpuDevice.queue.writeBuffer(
					this.#systemUniform_Vertex_UniformBuffer.gpuBuffer,
					this.#systemUniform_Vertex_StructInfo.members[key].uniformOffset,
					new this.#systemUniform_Vertex_StructInfo.members[key].View(value)
				);
			});
			this.#prevInfoList[key] = {
				ibl,
				ibl_iblTexture,
				ibl_irradianceTexture,
				renderPath1ResultTextureView,
				shadowDepthTextureView,
				vertexUniformBindGroup: this.#systemUniform_Vertex_UniformBindGroup
			}
		}
		this.#updateClusters(calcPointLightCluster)
	}

	/**
	 * 정점 유니폼 바인드 그룹을 생성합니다.
	 * 시스템 유니폼, 샘플러, 텍스처 등의 리소스를 바인딩합니다.
	 *
	 * @param key - 캐시 키
	 * @param shadowDepthTextureView - 그림자 깊이 텍스처 뷰
	 * @param ibl - IBL 설정
	 * @param renderPath1ResultTextureView - 렌더 패스 1 결과 텍스처 뷰
	 * @private
	 */
	#createVertexUniformBindGroup(key: string, shadowDepthTextureView: GPUTextureView, ibl: IBL, renderPath1ResultTextureView: GPUTextureView) {
		this.#updateClusters(true)
		const ibl_iblTexture = ibl?.iblTexture
		const ibl_irradianceTexture = ibl?.irradianceTexture
		const {redGPUContext} = this
		const {gpuDevice, resourceManager} = redGPUContext;
		const systemUniform_Vertex_BindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
			label: `SYSTEM_UNIFORM_bindGroup_${key}`,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#systemUniform_Vertex_UniformBuffer.gpuBuffer,
						offset: 0,
						size: this.#systemUniform_Vertex_UniformBuffer.size
					},
				},
				{
					binding: 1,
					resource: this.#shadowDepthSampler
				},
				{
					binding: 2,
					resource: shadowDepthTextureView
				},
				{
					binding: 3,
					resource: this.#basicSampler
				},
				{
					binding: 5,
					resource: {
						buffer: this.#clusterLightsBuffer,
						offset: 0,
						size: this.#clusterLightsBuffer.size
					}
				},
				{
					binding: 6,
					resource: {
						buffer: this.#passLightClusters.clusterLightsBuffer,
						offset: 0,
						size: this.#passLightClusters.clusterLightsBuffer.size
					}
				},
				{
					binding: 7,
					resource: this.#basicSampler
				},
				{
					binding: 8,
					resource: renderPath1ResultTextureView
						|| resourceManager.emptyBitmapTextureView
				},
				{
					binding: 9,
					resource: this.#basicPackedSampler
				},
				{
					binding: 10,
					resource:
						resourceManager.getGPUResourceCubeTextureView(ibl_iblTexture, ibl_iblTexture?.viewDescriptor || CubeTexture.defaultViewDescriptor)
				},
				{
					binding: 11,
					resource:
						resourceManager.getGPUResourceCubeTextureView(ibl_irradianceTexture, ibl_irradianceTexture?.viewDescriptor || CubeTexture.defaultViewDescriptor)
				},
			]
		}
		this.#systemUniform_Vertex_UniformBindGroup = gpuDevice.createBindGroup(systemUniform_Vertex_BindGroupDescriptor);
		// IBL 텍스처 리소스 상태 업데이트
		this.#updateIBLResourceStates(resourceManager, ibl_iblTexture, ibl_irradianceTexture);
	}

	/**
	 * IBL 텍스처 리소스 상태를 업데이트합니다.
	 * 이전 텍스처와 새 텍스처의 사용 횟수를 관리하여 메모리를 효율적으로 관리합니다.
	 *
	 * @param resourceManager - 리소스 매니저 인스턴스
	 * @param ibl_iblTexture - IBL 텍스처
	 * @param ibl_irradianceTexture - IBL 복사열 텍스처
	 * @private
	 */
	#updateIBLResourceStates(resourceManager: ResourceManager, ibl_iblTexture: any, ibl_irradianceTexture: any) {
		// IBL 텍스처 쌍들을 배열로 정의
		const textureUpdates = [
			[this.#prevIBL_iblTexture, ibl_iblTexture],
			[this.#prevIBL_irradianceTexture, ibl_irradianceTexture]
		];
		// 각 텍스처 쌍에 대해 리소스 상태 관리
		textureUpdates.forEach(([prevTexture, newTexture]) => {
			if (prevTexture && prevTexture !== newTexture) {
				this.#manageIBLResourceState(resourceManager, prevTexture.cacheKey, false);
			}
			if (newTexture && prevTexture !== newTexture) {
				this.#manageIBLResourceState(resourceManager, newTexture.cacheKey, true);
			}
		});
		// 이전 텍스처 참조 업데이트
		this.#prevIBL_iblTexture = ibl_iblTexture;
		this.#prevIBL_irradianceTexture = ibl_irradianceTexture;
	}

	/**
	 * IBL 리소스 상태를 관리합니다.
	 * 텍스처의 사용 횟수를 증가 또는 감소시켜 리소스 생명주기를 관리합니다.
	 *
	 * @param resourceManager - 리소스 매니저 인스턴스
	 * @param cacheKey - 텍스처 캐시 키
	 * @param isAddingListener - 리스너 추가 여부 (true: 사용 횟수 증가, false: 사용 횟수 감소)
	 * @private
	 */
	#manageIBLResourceState(resourceManager: ResourceManager, cacheKey: string, isAddingListener: boolean) {
		const targetResourceManagedState = resourceManager['managedCubeTextureState']
		const targetState = targetResourceManagedState?.table.get(cacheKey);
		if (targetState) {
			isAddingListener ? targetState.useNum++ : targetState.useNum--;
		}
	}

	/**
	 * View3D를 초기화합니다.
	 * 시스템 유니폼 버퍼, 클러스터 라이트 버퍼, 샘플러들을 생성하고 설정합니다.
	 * @private
	 */
	#init() {
		const systemUniform_Vertex_UniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
		this.#systemUniform_Vertex_UniformBuffer = new UniformBuffer(
			this.redGPUContext,
			systemUniform_Vertex_UniformData,
			'SYSTEM_UNIFORM_BUFFER_VERTEX',
			'SYSTEM_UNIFORM_BUFFER_VERTEX',
		);
		//
		this.#clusterLightsBufferData = new Float32Array((16 * PassClustersLightHelper.MAX_CLUSTER_LIGHTS) + 4)
		this.#clusterLightsBuffer = this.redGPUContext.resourceManager.createGPUBuffer(`VIEW_CLUSTER_LIGHTS_BUFFER`,
			{
				size: this.#clusterLightsBufferData.byteLength,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
			}
		)
		this.redGPUContext.gpuDevice.queue.writeBuffer(this.#clusterLightsBuffer, 0, this.#clusterLightsBufferData)
		//
		this.#shadowDepthSampler = new Sampler(this.redGPUContext, {
			addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			compare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
		}).gpuSampler
		this.#basicSampler = new Sampler(this.redGPUContext).gpuSampler
		this.#basicPackedSampler = new Sampler(this.redGPUContext, {
			addressModeU: GPU_ADDRESS_MODE.REPEAT,
			addressModeV: GPU_ADDRESS_MODE.REPEAT,
		}).gpuSampler
	}

	/**
	 * 클러스터 라이트를 업데이트합니다.
	 * 포인트 라이트와 스팟 라이트 데이터를 계산하고 GPU 버퍼에 업로드합니다.
	 *
	 * @param calcClusterLight - 클러스터 라이트 계산 여부 (기본값: false)
	 * @private
	 */
	#updateClusters(calcClusterLight: boolean = false) {
		if (!calcClusterLight) return
		const {redGPUContext, scene, renderViewStateData} = this
		// const dirtyPixelSize = this.#prevWidth == undefined || this.#prevHeight == undefined || this.#prevWidth !== this.pixelRectArray[2] || this.#prevHeight !== this.pixelRectArray[3]
		const dirtyPixelSize = true;
		if (!this.#passLightClustersBound) {
			this.#passLightClustersBound = new PassClusterLightBound(redGPUContext, this)
		}
		if (this.#passLightClusters && dirtyPixelSize) {
			// console.log('passLightClustersBound 재계산')
			this.#passLightClustersBound.render()
			this.#prevWidth = this.pixelRectArray[2]
			this.#prevHeight = this.pixelRectArray[3]
		}
		if (!this.#passLightClusters) {
			this.#passLightClusters = new PassClustersLight(redGPUContext, this)
		}
		if (scene) {
			const {pointLights, spotLights} = scene.lightManager
			const pointLightNum = pointLights.length
			const spotLightNum = spotLights.length
			if (pointLightNum) {
				let i = pointLightNum
				// console.log('실행이되긴하하나2')
				while (i--) {
					const tLight = pointLights[i]
					const stride = 16
					const offset = 4 + stride * i
					this.#clusterLightsBufferData.set(
						[
							...tLight.position, tLight.radius,
							...tLight.color.rgbNormal, tLight.intensity, 0
						],
						offset,
					)
					if (tLight.enableDebugger) {
						if (!tLight.drawDebugger) tLight.drawDebugger = new DrawDebuggerPointLight(redGPUContext, tLight)
						tLight.drawDebugger.render(renderViewStateData)
					}
				}
			}
			if (spotLightNum) {
				const stride = 16
				const prevOffset = pointLightNum * stride
				let i = spotLightNum
				// console.log('실행이되긴하하나2')
				while (i--) {
					const tLight = spotLights[i]
					const offset = 4 + stride * i + prevOffset;
					this.#clusterLightsBufferData.set(
						[
							...tLight.position, tLight.radius,
							...tLight.color.rgbNormal, tLight.intensity, 1, ...tLight.direction, tLight.outerCutoff, tLight.innerCutoff
						],
						offset,
					)
					if (tLight.enableDebugger) {
						if (!tLight.drawDebugger) tLight.drawDebugger = new DrawDebuggerSpotLight(redGPUContext, tLight)
						tLight.drawDebugger.render(renderViewStateData)
					}
				}
			}
			this.#clusterLightsBufferData.set(
				[pointLightNum, spotLightNum, 0, 0],
				0,
			)
			this.redGPUContext.gpuDevice.queue.writeBuffer(this.#clusterLightsBuffer, 0, this.#clusterLightsBufferData);
			this.#passLightClusters.render()
		}
	}
}

Object.freeze(View3D)
export default View3D
