import ALandscapeTextureDebugger from "../ALandscapeTextureDebugger";
import Landscape from "../../../Landscape";
import LandscapeTileStreamer from "../../../core/spatial/LandscapeTileStreamer";
import {ALandscapeDebuggerOptions} from "../ALandscapeDebugger";
import vntDebuggerWGSL from "./shader/vntDebugger.wgsl";

/**
 * [KO] 가상 노멀맵(VNT) 텍스처 아틀라스를 온스크린 캔버스에 실시간 렌더링하는 디버거 클래스입니다.
 * [EN] Real-time debugger rendering the virtual normal (VNT) texture atlas onto an on-screen canvas.
 */
export class LandscapeVNTDebugger extends ALandscapeTextureDebugger {
    /**
     * [KO] LandscapeVNTDebugger 생성자입니다.
     * [EN] Constructor for LandscapeVNTDebugger.
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
            title: 'VNT (Normal)',
            ...options
        };
        super(
            landscape,
            tileStreamer,
            cameraOrOptions,
            defaultOptions,
            vntDebuggerWGSL,
            'Landscape_Debugger_VNT_ShaderModule',
            (_, ts) => ts?.getAtlasTexture('vnt') ?? null,
            {r: 0.1, g: 0.1, b: 0.1, a: 1.0}
        );
    }
}

Object.freeze(LandscapeVNTDebugger);
export default LandscapeVNTDebugger;
