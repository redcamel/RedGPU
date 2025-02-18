import RedGPUContext from "../../../context/RedGPUContext";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";

class SpriteSheetInfo {
    readonly #segmentW: number = 0
    readonly #segmentH: number = 0
    readonly #totalFrame: number = 0
    readonly #startIndex: number = 0
    readonly #frameRate: number = 0
    readonly #loop: boolean = true
    readonly #texture: BitmapTexture

    constructor(
        redGPUContext: RedGPUContext,
        src: string,
        segmentW: number, segmentH: number, totalFrame: number, startIndex: number,
        loop: boolean = true,
        frameRate: number = 60
    ) {
        validateRedGPUContext(redGPUContext)
        validateUintRange(segmentW)
        validateUintRange(segmentH)
        validateUintRange(totalFrame)
        validateUintRange(startIndex)
        validateUintRange(frameRate)
        this.#segmentW = segmentW
        this.#segmentH = segmentH
        this.#totalFrame = totalFrame
        this.#startIndex = startIndex
        this.#texture = new BitmapTexture(redGPUContext, src)
        this.#loop = loop
        this.#frameRate = frameRate
    }

    get segmentW(): number {
        return this.#segmentW;
    }

    get segmentH(): number {
        return this.#segmentH;
    }

    get totalFrame(): number {
        return this.#totalFrame;
    }

    get startIndex(): number {
        return this.#startIndex;
    }

    get texture(): BitmapTexture {
        return this.#texture;
    }

    get frameRate(): number {
        return this.#frameRate;
    }

    get loop(): boolean {
        return this.#loop;
    }
}

Object.freeze(SpriteSheetInfo)
export default SpriteSheetInfo
