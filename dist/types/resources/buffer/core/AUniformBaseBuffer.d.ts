import RedGPUContext from "../../../context/RedGPUContext";
import ABaseBuffer, { GPU_BUFFER_DATA_SYMBOL } from "./ABaseBuffer";
/**
 * [KO] 유니폼 버퍼 리소스의 기본 추상 클래스입니다.
 * [EN] Abstract base class for uniform buffer resources.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>상속을 통해 사용하십시오.
 * [EN] This class is an abstract class and cannot be instantiated directly.<br/>Use it through inheritance.
 * :::
 *
 * @category Buffer
 */
declare abstract class AUniformBaseBuffer extends ABaseBuffer {
    #private;
    [GPU_BUFFER_DATA_SYMBOL]: ArrayBuffer;
    /**
     * [KO] AUniformBaseBuffer 인스턴스를 초기화합니다.
     * [EN] Initializes an AUniformBaseBuffer instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param MANAGED_STATE_KEY -
     * [KO] 관리 상태 키
     * [EN] Managed state key
     * @param usage -
     * [KO] GPU 버퍼 사용 플래그
     * [EN] GPU buffer usage flags
     * @param data -
     * [KO] 버퍼에 할당할 데이터 (`ArrayBuffer`)
     * [EN] Data to allocate to the buffer (`ArrayBuffer`)
     * @param label -
     * [KO] 디버그용 레이블 (선택)
     * [EN] Label for debugging (optional)
     */
    protected constructor(redGPUContext: RedGPUContext, MANAGED_STATE_KEY: string, usage: GPUBufferUsageFlags, data: ArrayBuffer, label?: string);
    /**
     * [KO] 버퍼 데이터(`ArrayBuffer`)를 반환합니다.
     * [EN] Returns the buffer data (`ArrayBuffer`).
     */
    get data(): ArrayBuffer;
    /**
     * [KO] 버퍼 데이터를 `Float32Array` 뷰로 반환합니다.
     * [EN] Returns the buffer data as a `Float32Array` view.
     */
    get dataViewF32(): Float32Array;
    /**
     * [KO] 버퍼 데이터를 `Uint32Array` 뷰로 반환합니다.
     * [EN] Returns the buffer data as a `Uint32Array` view.
     */
    get dataViewU32(): Uint32Array;
    /**
     * [KO] 버퍼 크기를 반환합니다.
     * [EN] Returns the buffer size.
     */
    get size(): number;
    /**
     * [KO] `GPUBufferDescriptor`를 반환합니다.
     * [EN] Returns the `GPUBufferDescriptor`.
     */
    get uniformBufferDescriptor(): GPUBufferDescriptor;
    /**
     * [KO] 유니폼 버퍼에 데이터를 씁니다.
     * [EN] Writes data to the uniform buffer.
     * @param target -
     * [KO] 대상 유니폼 정보 (View 생성자 및 오프셋 포함)
     * [EN] Target uniform information (including View constructor and offset)
     * @param value -
     * [KO] 쓸 값
     * [EN] Value to write
     */
    writeOnlyBuffer(target: any, value: any): void;
}
export default AUniformBaseBuffer;
