import RedGPUContext from "../../../../context/RedGPUContext";
import DefineForVertex from "../../../../defineProperty/DefineForVertex";
import Geometry from "../../../../geometry/Geometry";
import GPU_ADDRESS_MODE from "../../../../gpuConst/GPU_ADDRESS_MODE";
import BitmapMaterial from "../../../../material/bitmapMaterial/BitmapMaterial";
import Primitive from "../../../../primitive/core/Primitive";
import Sampler from "../../../../resources/sampler/Sampler";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import Mesh from "../../../mesh/Mesh";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import SpriteSheetInfo from "../SpriteSheetInfo";

/**
 * 스프라이트 시트의 기본 속성을 정의하는 인터페이스
 */
interface ASpriteSheet {
	/** 세그먼트 너비 */
	segmentW: number;
	/** 세그먼트 높이 */
	segmentH: number;
	/** 총 프레임 수 */
	totalFrame: number;
	/** 현재 프레임 인덱스 */
	currentIndex: number;
}

/**
 * 스프라이트 시트 애니메이션을 처리하는 추상 기본 클래스
 *
 * ASpriteSheet는 2D 스프라이트 애니메이션을 위한 기본 기능을 제공합니다.
 * 하나의 텍스처에 여러 프레임이 격자 형태로 배열된 스프라이트 시트를
 * 시간에 따라 순차적으로 표시하여 애니메이션 효과를 만듭니다.
 */
class ASpriteSheet extends Mesh {
	/**
	 * 애니메이션 프레임 레이트 (FPS)
	 * @private
	 */
	#frameRate: number = 0
	/**
	 * 다음 프레임 표시 시각 (밀리초)
	 * @private
	 */
	#nextFrameTime: number = 0
	/**
	 * 프레임 간 간격 시간 (밀리초)
	 * @private
	 */
	#perFrameTime: number = 0
	/**
	 * 재생 상태 여부
	 * @private
	 */
	#playYn: boolean = true
	/**
	 * 반복 재생 여부
	 * @private
	 */
	#loop: boolean = true
	/**
	 * 스프라이트 시트 정보 객체
	 * @private
	 */
	#spriteSheetInfo: SpriteSheetInfo
	/**
	 * 렌더링 크기 설정 함수
	 * @private
	 */
	#setRenderSize: (texture: unknown, segmentW: number, segmentH: number) => void
	/**
	 * 현재 애니메이션 상태 ('play', 'pause', 'stop')
	 * @private
	 */
	#state: string = 'play'

	/**
	 * 새로운 ASpriteSheet 인스턴스를 생성합니다.
	 *
	 * @param redGPUContext - RedGPU 렌더링 컨텍스트
	 * @param spriteSheetInfo - 스프라이트 시트 정보 객체
	 * @param setRenderSize - 렌더링 크기 설정 콜백 함수
	 */
	constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo, setRenderSize: (texture: unknown, segmentW: number, segmentH: number) => void) {
		super(redGPUContext);
		this.#setRenderSize = setRenderSize
		this._material = new BitmapMaterial(redGPUContext)
		this._material.transparent = true
		this.dirtyPipeline = true
		this.dirtyTransform = true
		this.spriteSheetInfo = spriteSheetInfo;
		this._material.diffuseTextureSampler = new Sampler(redGPUContext)
		this._material.diffuseTextureSampler.addressModeU = GPU_ADDRESS_MODE.REPEAT
		this._material.diffuseTextureSampler.addressModeV = GPU_ADDRESS_MODE.REPEAT
	}

	/**
	 * 현재 애니메이션 상태를 반환합니다.
	 * @returns 'play', 'pause', 'stop' 중 하나
	 */
	get state(): string {
		return this.#state;
	}

	/**
	 * 반복 재생 여부를 반환합니다.
	 * @returns 반복 재생 활성화 여부
	 */
	get loop(): boolean {
		return this.#loop;
	}

	/**
	 * 반복 재생 여부를 설정합니다.
	 * @param value - 반복 재생 활성화 여부
	 */
	set loop(value: boolean) {
		this.#loop = value;
	}

	/**
	 * 애니메이션 프레임 레이트를 반환합니다.
	 * @returns 초당 프레임 수 (FPS)
	 */
	get frameRate() {
		return this.#frameRate;
	}

	/**
	 * 애니메이션 프레임 레이트를 설정합니다.
	 * @param value - 초당 프레임 수 (음수인 경우 0으로 설정)
	 */
	set frameRate(value) {
		if (value < 0) value = 0;
		if (this.#frameRate === 0 && value) {
			this.#nextFrameTime = 0;
		}
		this.#frameRate = value;
		this.#perFrameTime = 1000 / this.#frameRate;
	}

	/**
	 * 지오메트리를 반환합니다.
	 * @returns 현재 지오메트리
	 */
	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	/**
	 * 지오메트리 설정을 시도합니다.
	 * @param value - 설정하려는 지오메트리
	 * @throws {Error} ASpriteSheet는 지오메트리를 변경할 수 없습니다
	 */
	set geometry(value: Geometry | Primitive) {
		consoleAndThrowError('ASpriteSheet can not change geometry')
	}

	/**
	 * 머티리얼을 반환합니다.
	 * @returns 현재 머티리얼
	 */
	get material() {
		return this._material
	}

	/**
	 * 머티리얼 설정을 시도합니다.
	 * @param value - 설정하려는 머티리얼
	 * @throws {Error} ASpriteSheet는 머티리얼을 변경할 수 없습니다
	 */
	set material(value) {
		consoleAndThrowError('ASpriteSheet can not change material')
	}

	/**
	 * 스프라이트 시트 정보를 반환합니다.
	 * @returns 현재 스프라이트 시트 정보
	 */
	get spriteSheetInfo(): SpriteSheetInfo {
		return this.#spriteSheetInfo;
	}

	/**
	 * 스프라이트 시트 정보를 설정합니다.
	 * @param value - 새로운 스프라이트 시트 정보
	 */
	set spriteSheetInfo(value: SpriteSheetInfo) {
		this.#spriteSheetInfo = value;
		this.frameRate = value.frameRate;
		this.segmentW = value.segmentW;
		this.segmentH = value.segmentH;
		this.totalFrame = value.totalFrame;
		this.currentIndex = value.startIndex;
		this.#loop = true;
		this.#nextFrameTime = 0;
		this._material.diffuseTexture = value.texture;
	}

	/**
	 * 애니메이션을 재생합니다.
	 * 상태를 'play'로 변경하고 재생을 시작합니다.
	 */
	play() {
		this.#playYn = true;
		this.#state = 'play';
		this.#nextFrameTime = 0;
	};

	/**
	 * 애니메이션을 일시정지합니다.
	 * 상태를 'pause'로 변경하고 현재 프레임에서 정지합니다.
	 */
	pause() {
		this.#playYn = false;
		this.#state = 'pause';
	};

	/**
	 * 애니메이션을 정지합니다.
	 * 상태를 'stop'으로 변경하고 첫 번째 프레임으로 되돌립니다.
	 */
	stop() {
		this.#playYn = false;
		this.currentIndex = 0;
		this.#state = 'stop';
	};

	/**
	 * 스프라이트 시트를 렌더링합니다.
	 *
	 * 시간에 따른 프레임 업데이트와 애니메이션 로직을 처리한 후 렌더링을 수행합니다.
	 *
	 * @param renderViewStateData - 렌더링 상태 및 디버그 정보
	 */
	render(renderViewStateData: RenderViewStateData) {
		// console.log(this._material.diffuseTexture)
		const {diffuseTexture} = this._material;
		this.#setRenderSize(diffuseTexture, this.segmentW, this.segmentH)
		const {timestamp} = renderViewStateData;
		if (!this.#nextFrameTime) this.#nextFrameTime = this.#perFrameTime + timestamp;
		if (this.#playYn && this.#nextFrameTime < timestamp && this.#frameRate) {
			const rawGapFrame = Math.floor((timestamp - this.#nextFrameTime) / this.#perFrameTime);
			const gapFrame = (Number.isFinite(rawGapFrame) ? rawGapFrame : 0) || 1;
			this.#nextFrameTime = this.#perFrameTime + timestamp;
			this.currentIndex += gapFrame;
			if (this.currentIndex >= this.totalFrame) {
				if (this.loop) {
					this.#playYn = true
					this.currentIndex = 0;
				} else {
					this.#playYn = false
					this.currentIndex = this.totalFrame - 1;
				}
			}
		}
		super.render(renderViewStateData);
	}
}

/**
 * ASpriteSheet 클래스에 스프라이트 시트 관련 속성들을 정의합니다.
 */
DefineForVertex.definePositiveNumber(ASpriteSheet, [
	['segmentW', 5],
	['segmentH', 3],
	['totalFrame', 15],
	['currentIndex', 0]
])
/**
 * ASpriteSheet 클래스를 동결하여 런타임에서의 수정을 방지합니다.
 * @readonly
 */
Object.freeze(ASpriteSheet)
export default ASpriteSheet
