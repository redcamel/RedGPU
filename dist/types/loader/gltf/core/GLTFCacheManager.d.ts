import RedGPUContext from "../../../context/RedGPUContext";
import { GLTF } from "../GLTF";
export default class GLTFCacheManager {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get gltfCache(): {
        cache: Map<string, GLTF>;
        pending: Map<string, Promise<any>>;
    };
    get glbCache(): {
        cache: Map<string, ArrayBuffer>;
        pending: Map<string, Promise<ArrayBuffer>>;
    };
    get bufferCache(): {
        cache: Map<string, ArrayBuffer>;
        pending: Map<string, Promise<ArrayBuffer>>;
    };
    destroy(): void;
}
