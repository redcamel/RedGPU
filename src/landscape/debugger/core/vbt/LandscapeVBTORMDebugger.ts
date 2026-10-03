import ALandscapeTextureDebugger from "../ALandscapeTextureDebugger";
import Landscape from "../../../Landscape";
import LandscapeTileStreamer from "../../../core/spatial/LandscapeTileStreamer";
import {ALandscapeDebuggerOptions} from "../ALandscapeDebugger";
import LandscapeShaderLibrary from "../../../core/shader/library/LandscapeShaderLibrary";

/**
 * [KO] 가상 베이크 ORM(Occlusion/Roughness/Metalness) 텍스처 아틀라스를 온스크린 캔버스에 실시간 렌더링하는 디버거 클래스입니다.
 * [EN] Real-time debugger rendering the virtual baked ORM (Occlusion/Roughness/Metalness) texture atlas onto an on-screen canvas.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(DebuggerManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (DebuggerManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeVBTORMDebugger extends ALandscapeTextureDebugger {
    /**
     * [KO] LandscapeVBTORMDebugger 생성자입니다.
     * [EN] Constructor for LandscapeVBTORMDebugger.
     *
     * @param landscape - [KO] 대상 Landscape 인스턴스 / [EN] Target Landscape instance
     * @param tileStreamer - [KO] 타일 스트리머 인스턴스 / [EN] Tile streamer instance
     * @param cameraOrOptions - [KO] 카메라 인스턴스 또는 디버거 옵션 / [EN] Camera instance or debugger options
     * @param options - [KO] 디버거 옵션 / [EN] Debugger options
     */
    constructor(
        landscape: Landscape,
        tileStreamer?: LandscapeTileStreamer | null,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VBT (ORM)',
            ...options
        };
        super(
            landscape,
            tileStreamer,
            cameraOrOptions,
            defaultOptions,
            LandscapeShaderLibrary.debug.textureDebuggerFragment,
            'Landscape_Debugger_VBT_ORM_ShaderModule',
            (_, ts) => ts?.getAtlasTexture('vbtORM') ?? null,
            {r: 1.0, g: 0.8, b: 0.0, a: 1.0}
        );
    }
}

Object.freeze(LandscapeVBTORMDebugger);
export default LandscapeVBTORMDebugger;
