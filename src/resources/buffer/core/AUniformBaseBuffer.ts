import RedGPUContext from "../../../context/RedGPUContext";
import ABaseBuffer, {
    GPU_BUFFER_DATA_SYMBOL,
    GPU_BUFFER_DATA_SYMBOL_F32,
    GPU_BUFFER_DATA_SYMBOL_U32,
    GPU_BUFFER_SYMBOL
} from "./ABaseBuffer";

/**
 * [KO] 유니폼 버퍼 리소스의 기본 추상 클래스입니다.
 * [EN] Abstract base class for uniform buffer resources.
 *
 * [KO] CPU 측 `ArrayBuffer`와 `Float32Array`/`Uint32Array` 뷰를 함께 보관합니다.
 * [EN] Keeps the CPU-side `ArrayBuffer` along with `Float32Array`/`Uint32Array` views.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Buffer
 */
abstract class AUniformBaseBuffer extends ABaseBuffer {
    [GPU_BUFFER_DATA_SYMBOL]: ArrayBuffer
    readonly #uniformBufferDescriptor: GPUBufferDescriptor
    readonly #size: number
    #destroyed: boolean = false

    /**
     * [KO] GPU 유니폼 버퍼를 생성하고 초기 데이터를 기록합니다.
     * [EN] Creates the GPU uniform buffer and writes the initial data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param MANAGED_STATE_KEY -
     * [KO] 리소스 매니저의 관리 상태 키
     * [EN] Managed state key of the resource manager
     * @param usage -
     * [KO] GPU 버퍼 사용 플래그
     * [EN] GPU buffer usage flags
     * @param data -
     * [KO] 초기 버퍼 데이터 (`ArrayBuffer`)
     * [EN] Initial buffer data (`ArrayBuffer`)
     * @param label -
     * [KO] 디버그용 레이블 (기본값: 빈 문자열)
     * [EN] Debug label (default: empty string)
     */
    protected constructor(
        redGPUContext: RedGPUContext,
        MANAGED_STATE_KEY: string,
        usage: GPUBufferUsageFlags,
        data: ArrayBuffer,
        label: string = ''
    ) {
        super(redGPUContext, MANAGED_STATE_KEY, usage)
        this.#size = data.byteLength
        this.#uniformBufferDescriptor = {
            size: this.#size,
            usage: this.usage,
            label
        };
        try {
            this[GPU_BUFFER_SYMBOL] = redGPUContext.gpuDevice.createBuffer(this.#uniformBufferDescriptor);
        } catch (error) {
            console.error('GPU 버퍼 생성에 실패했습니다:', error);
        }
        redGPUContext.gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, data);
        this[GPU_BUFFER_DATA_SYMBOL] = data;
        this[GPU_BUFFER_DATA_SYMBOL_F32] = new Float32Array(data);
        this[GPU_BUFFER_DATA_SYMBOL_U32] = new Uint32Array(data);
    }

    /**
     * [KO] 버퍼 디버그 레이블을 반환합니다.
     * [EN] Returns the buffer debug label.
     *
     * @returns
     * [KO] 레이블 문자열
     * [EN] Label string
     */
    get label() {
        return this.#uniformBufferDescriptor.label
    }

    /**
     * [KO] CPU 측 버퍼 데이터를 반환합니다.
     * [EN] Returns the CPU-side buffer data.
     *
     * @returns
     * [KO] 버퍼 데이터 (`ArrayBuffer`)
     * [EN] Buffer data (`ArrayBuffer`)
     */
    get data(): ArrayBuffer {
        return this[GPU_BUFFER_DATA_SYMBOL];
    }

    /**
     * [KO] 버퍼 데이터의 `Float32Array` 뷰를 반환합니다.
     * [EN] Returns the `Float32Array` view of the buffer data.
     *
     * @returns
     * [KO] `Float32Array` 뷰
     * [EN] `Float32Array` view
     */
    get dataViewF32(): Float32Array {
        return this[GPU_BUFFER_DATA_SYMBOL_F32];
    }

    /**
     * [KO] 버퍼 데이터의 `Uint32Array` 뷰를 반환합니다.
     * [EN] Returns the `Uint32Array` view of the buffer data.
     *
     * @returns
     * [KO] `Uint32Array` 뷰
     * [EN] `Uint32Array` view
     */
    get dataViewU32(): Uint32Array {
        return this[GPU_BUFFER_DATA_SYMBOL_U32];
    }

    /**
     * [KO] 버퍼 크기(byte)를 반환합니다.
     * [EN] Returns the buffer size in bytes.
     *
     * @returns
     * [KO] 바이트 크기
     * [EN] Size in bytes
     */
    get size(): number {
        return this.#size;
    }

    /**
     * [KO] 버퍼 생성에 사용된 디스크립터를 반환합니다.
     * [EN] Returns the descriptor used to create the buffer.
     *
     * @returns
     * [KO] `GPUBufferDescriptor` 객체
     * [EN] `GPUBufferDescriptor` object
     */
    get uniformBufferDescriptor(): GPUBufferDescriptor {
        return this.#uniformBufferDescriptor;
    }

    /**
     * [KO] GPU 버퍼와 데이터 뷰를 해제합니다. 중복 호출 시 무시됩니다.
     * [EN] Releases the GPU buffer and data views. Repeated calls are ignored.
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true
        super.destroy();
        this[GPU_BUFFER_DATA_SYMBOL_F32] = null
        this[GPU_BUFFER_DATA_SYMBOL_U32] = null

    }

    /**
     * [KO] 지정한 유니폼 위치에 값을 GPU 버퍼로 직접 기록합니다.
     * [EN] Writes a value directly to the GPU buffer at the given uniform location.
     *
     * [KO] boolean 값은 1 또는 0으로 변환됩니다.
     * [EN] Boolean values are converted to 1 or 0.
     *
     * @param target -
     * [KO] 대상 유니폼 정보 (`View` 생성자와 `uniformOffset` 포함)
     * [EN] Target uniform info (contains `View` constructor and `uniformOffset`)
     * @param value -
     * [KO] 기록할 값 (number, boolean 또는 배열)
     * [EN] Value to write (number, boolean, or array)
     */
    writeOnlyBuffer(target: any, value: any) {
        if (typeof value === "boolean") {
            value = value ? 1 : 0
        }
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.gpuBuffer,
            target.uniformOffset,
            new target.View(typeof value === "number" ? [value] : value),
        )
    }
}

export default AUniformBaseBuffer