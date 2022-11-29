import RedGPUContext from "../context/RedGPUContext";
import RedGPUContextBase from "../context/RedGPUContextBase";
import PostEffectBase from "./PostEffectBase";



/**
 * PostEffect를 관리하는 매니저
 */
class PostEffectManager extends RedGPUContextBase {
    #children: PostEffectBase[] = [];
    get children(): PostEffectBase[] {
        return this.#children;
    }

    /**
     * 생성자
     * @param redGPUContext
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * 포스트 이펙트를 추가합니다.
     * @param postEffect
     */
    addEffect(postEffect: PostEffectBase) {
        this.#children.push(postEffect)
    }

    /**
     * 포스트 이펙트를 제거합니다.
     * @param postEffect
     */
    removeEffect(postEffect: PostEffectBase) {
        const index = this.#children.indexOf(postEffect)
        if (index > -1) {
            this.#children.splice(index, 1);
        }
        return this
    }
}

export default PostEffectManager