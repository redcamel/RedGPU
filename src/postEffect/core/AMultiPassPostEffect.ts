import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect from "./ASinglePassPostEffect";
import {IPostEffectResult} from "./types";

/**
 * [KO] 다중 패스 후처리 이펙트 추상 클래스입니다.
 * [EN] Abstract class for multi-pass post-processing effects.
 *
 * [KO] 여러 개의 단일 패스(Single-pass) 이펙트를 체인처럼 연결하여 순차적으로 실행하는 기반 클래스입니다.
 * [EN] Base class for chaining and sequentially executing multiple single-pass effects.
 *
 * @category Core
 */
abstract class AMultiPassPostEffect extends ASinglePassPostEffect {
    /**
     * [KO] 실행될 내부 패스(이펙트) 리스트
     * [EN] List of internal passes (effects) to be executed
     */
    #passList: ASinglePassPostEffect[] = []

    /**
     * [KO] 합산된 총 비디오 메모리 사용량 (Bytes)
     * [EN] Total accumulated video memory usage in bytes
     */
    #videoMemorySize: number = 0

    /**
     * [KO] AMultiPassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an AMultiPassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param passList -
     * [KO] 순차적으로 적용할 단일 패스 이펙트 배열
     * [EN] Array of single-pass effects to be applied sequentially
     */
    protected constructor(redGPUContext: RedGPUContext, passList: ASinglePassPostEffect[]) {
        super(redGPUContext);
        this.#passList.push(...passList);
    }

    /**
     * [KO] 모든 내부 패스의 비디오 메모리 사용량을 합산하여 반환합니다.
     * [EN] Returns the sum of video memory usage of all internal passes.
     */
    get videoMemorySize(): number {
        this.#calcVideoMemory();
        return this.#videoMemorySize;
    }

    /**
     * [KO] 등록된 내부 패스 리스트를 반환합니다.
     * [EN] Returns the list of registered internal passes.
     */
    get passList(): ASinglePassPostEffect[] {
        return this.#passList;
    }

    /**
     * [KO] 등록된 모든 내부 패스의 리소스를 해제합니다.
     * [EN] Clears the resources of all registered internal passes.
     */
    clear() {
        this.#passList.forEach(v => v.clear());
    }

    /**
     * [KO] 모든 패스를 순차적으로 렌더링합니다. 각 패스의 결과는 다음 패스의 입력으로 전달됩니다.
     * [EN] Renders all passes sequentially. The result of each pass is passed as input to the next.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 최초 입력 소스 텍스처 정보
     * [EN] Initial input source texture information
     * @returns
     * [KO] 최종 패스의 렌더링 결과
     * [EN] Rendering result of the final pass
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        let targetOutputInfo: IPostEffectResult;
        const pool = view.postEffectManager.texturePool;

        this.#passList.forEach((effect: ASinglePassPostEffect, index) => {
            const prevTemp = targetOutputInfo;

            // [KO] 두 번째 패스부터는 이전 패스의 결과물을 입력 소스로 사용합니다.
            // [EN] From the second pass onwards, use the result of the previous pass as the input source.
            if (index) sourceTextureInfo = targetOutputInfo;

            targetOutputInfo = effect.render(view, width, height, sourceTextureInfo);

            // [KO] 이전 패스에서 생성된 중간 단계 텍스처는 다음 패스의 입력으로 사용된 직후 풀에 반납하여 메모리를 효율적으로 관리합니다.
            // [EN] Intermediate textures from previous passes are released back to the pool immediately after being used as input for the next pass to manage memory efficiently.
            if (prevTemp) {
                pool.release(prevTemp.texture);
            }
        });

        return targetOutputInfo;
    }

    /**
     * [KO] 모든 내부 패스의 메모리 사용량을 합산하여 총 사용량을 계산합니다.
     * [EN] Calculates the total usage by summing the memory usage of all internal passes.
     */
    #calcVideoMemory() {
        this.#videoMemorySize = 0;
        this.#passList.forEach(effect => {
            this.#videoMemorySize += effect.videoMemorySize;
        });
    }
}

Object.freeze(AMultiPassPostEffect);
export default AMultiPassPostEffect;
