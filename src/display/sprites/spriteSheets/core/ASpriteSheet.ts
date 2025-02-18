import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import BitmapMaterial from "../../../../material/bitmapMaterial/BitmapMaterial";
import Primitive from "../../../../primitive/core/Primitive";
import RenderViewStateData from "../../../../renderer/RenderViewStateData";
import DefineForVertex from "../../../../resources/defineProperty/DefineForVertex";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import Mesh from "../../../mesh/Mesh";
import SpriteSheetInfo from "../SpriteSheetInfo";

interface ASpriteSheet {
    segmentW: number;
    segmentH: number;
    totalFrame: number;
    currentIndex: number;
}

class ASpriteSheet extends Mesh {
    #frameRate: number = 0
    #nextFrameTime: number = 0
    #perFrameTime: number = 0
    #playYn: boolean = true
    #loop: boolean = true
    #spriteSheetInfo: SpriteSheetInfo
    #setRenderSize: (texture: unknown, segmentW: number, segmentH: number) => void
    #state: string = 'play'

    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo, setRenderSize: (texture: unknown, segmentW: number, segmentH: number) => void) {
        super(redGPUContext);
        this.#setRenderSize = setRenderSize
        this._material = new BitmapMaterial(redGPUContext)
        this._material.transparent = true
        this.dirtyPipeline = true
        this.dirtyTransform = true
        this.spriteSheetInfo = spriteSheetInfo;
    }

    get state(): string {
        return this.#state;
    }

    get loop(): boolean {
        return this.#loop;
    }

    set loop(value: boolean) {
        this.#loop = value;
    }

    get frameRate() {
        return this.#frameRate;
    }

    set frameRate(value) {
        if (value < 0) value = 0;
        if (this.#frameRate === 0 && value) {
            this.#nextFrameTime = 0;
        }
        this.#frameRate = value;
        this.#perFrameTime = 1000 / this.#frameRate;
    }

    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('ASpriteSheet can not change geometry')
    }

    get material() {
        return this._material
    }

    set material(value) {
        consoleAndThrowError('ASpriteSheet can not change material')
    }

    get spriteSheetInfo(): SpriteSheetInfo {
        return this.#spriteSheetInfo;
    }

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

    play() {
        this.#playYn = true;
        this.#state = 'play';
        this.#nextFrameTime = 0;
    };

    pause() {
        this.#playYn = false;
        this.#state = 'pause';
    };

    stop() {
        this.#playYn = false;
        this.currentIndex = 0;
        this.#state = 'stop';
    };

    render(debugViewRenderState: RenderViewStateData) {
        // console.log(this._material.diffuseTexture)
        const {diffuseTexture} = this._material;
        this.#setRenderSize(diffuseTexture, this.segmentW, this.segmentH)
        const {timestamp} = debugViewRenderState;
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
        super.render(debugViewRenderState);
    }
}

DefineForVertex.definePositiveNumber(ASpriteSheet, [
    ['segmentW', 5],
    ['segmentH', 3],
    ['totalFrame', 15],
    ['currentIndex', 0]
])
Object.freeze(ASpriteSheet)
export default ASpriteSheet
