import RedGPUContext from "../../../../context/RedGPUContext";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

export interface FeedbackBufferOptions {
    maxRequests?: number;
}

export class FeedbackBuffer {
    readonly #redGPUContext: RedGPUContext;
    readonly #maxRequests: number;

    #gpuBuffer: GPUBuffer | null = null;
    #readbackBuffers: [GPUBuffer | null, GPUBuffer | null] = [null, null];
    #currentReadbackIndex: number = 0;
    #isReading: boolean = false;
    #frameCount: number = 0;

    constructor(redGPUContext: RedGPUContext, options: FeedbackBufferOptions = {}) {
        this.#redGPUContext = redGPUContext;
        this.#maxRequests = options.maxRequests ?? 256;
        this.#initBuffers();
    }

    get maxRequests(): number {
        return this.#maxRequests;
    }

    get gpuBuffer(): GPUBuffer | null {
        return this.#gpuBuffer;
    }

    public resetBuffer(commandEncoder?: GPUCommandEncoder): void {
        if (!this.#gpuBuffer) return;
        const size = (this.#maxRequests + 1) * 4;

        if (commandEncoder) {
            commandEncoder.clearBuffer(this.#gpuBuffer, 0, size);
        } else {
            this.#redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
                encoder.clearBuffer(this.#gpuBuffer!, 0, size);
            });
        }
    }

    public requestReadback(onRequestsAvailable: (keys: string[]) => void, commandEncoder?: GPUCommandEncoder): void {
        if (!this.#gpuBuffer) return;
        this.#frameCount++;

        // 2프레임마다 1회씩 리드백을 진행하여 대역폭 과부하 방지
        if (this.#frameCount % 2 !== 0) return;
        if (this.#isReading) return;

        const writeIndex = this.#currentReadbackIndex;
        const activeReadbackBuffer = this.#readbackBuffers[writeIndex];
        if (!activeReadbackBuffer) return;

        const bufferSize = (this.#maxRequests + 1) * 4;
        const recordCopy = (encoder: GPUCommandEncoder) => {
            encoder.copyBufferToBuffer(this.#gpuBuffer!, 0, activeReadbackBuffer, 0, bufferSize);
        };

        if (commandEncoder) {
            recordCopy(commandEncoder);
        } else {
            this.#redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, recordCopy);
        }

        // 다음 프레임을 위한 핑퐁 인덱스 전환
        this.#currentReadbackIndex = 1 - this.#currentReadbackIndex;
        this.#isReading = true;

        // 마이크로태스크로 분리하여 현재 프레임 submitAll() 완료 후 mapAsync 실행
        Promise.resolve().then(() => {
            if (!activeReadbackBuffer) {
                this.#isReading = false;
                return;
            }

            activeReadbackBuffer.mapAsync(GPUMapMode.READ).then(() => {
                const arrayBuffer = activeReadbackBuffer.getMappedRange();
                const u32Array = new Uint32Array(arrayBuffer);

                const count = Math.min(u32Array[0], this.#maxRequests);
                const requestedKeys: string[] = [];

                for (let i = 1; i <= count; i++) {
                    const packed = u32Array[i];
                    const vX = packed & 0xffff;
                    const vZ = (packed >> 16) & 0xffff;
                    requestedKeys.push(`${vX}_${vZ}`);
                }

                activeReadbackBuffer.unmap();
                this.#isReading = false;

                if (requestedKeys.length > 0) {
                    onRequestsAvailable(requestedKeys);
                }
            }).catch(() => {
                this.#isReading = false;
            });
        });
    }

    public destroy(): void {
        this.#gpuBuffer?.destroy();
        this.#readbackBuffers[0]?.destroy();
        this.#readbackBuffers[1]?.destroy();
        this.#gpuBuffer = null;
        this.#readbackBuffers = [null, null];
        this.#isReading = false;
    }

    #initBuffers(): void {
        const device = this.#redGPUContext.gpuDevice;
        const bufferSize = (this.#maxRequests + 1) * 4;

        this.#gpuBuffer = device.createBuffer({
            label: 'RVT_FeedbackBuffer_GPU',
            size: bufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });

        this.#readbackBuffers = [
            device.createBuffer({
                label: 'RVT_FeedbackBuffer_Readback_A',
                size: bufferSize,
                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            device.createBuffer({
                label: 'RVT_FeedbackBuffer_Readback_B',
                size: bufferSize,
                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            })
        ];
    }
}

Object.freeze(FeedbackBuffer);
export default FeedbackBuffer;
