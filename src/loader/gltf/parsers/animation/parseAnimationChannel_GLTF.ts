import Mesh from "../../../../display/mesh/Mesh";
import AnimationData_GLTF from "../../cls/AnimationData_GLTF";
import AniTrack_GLTF from "../../cls/anitrack/AniTrack_GLTF";
import GLTFParseContext from "../../core/GLTFParseContext";
import {AnimationChannel, AnimationSampler, GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import {GLTFParsedSingleClip} from "./GLTFParsedSingleClip";
import {createPointerTargetBinding, parseAnimationPointerPath} from "./resolveAnimationPointer_GLTF";

const getOrCreateAnimationData = (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    accessorGlTfId: number,
    cache?: Map<number, AnimationData_GLTF>
): AnimationData_GLTF => {
    if (cache) {
        let cached = cache.get(accessorGlTfId);
        if (!cached) {
            cached = new AnimationData_GLTF(gltfLoader, gltfData, accessorGlTfId);
            cache.set(accessorGlTfId, cached);
        }
        return cached;
    }
    return new AnimationData_GLTF(gltfLoader, gltfData, accessorGlTfId);
};

/**
 * [KO] glTF의 단일 애니메이션 채널 데이터를 파싱하여 트랙을 생성하고 클립에 추가합니다.
 * [EN] Parses a single glTF animation channel to create a track and adds it to the clip.
 *
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @param parsedSingleClip -
 * [KO] 트랙이 추가될 파싱된 단일 애니메이션 클립 객체
 * [EN] Parsed single animation clip object to which the track is added
 * @param animationChannel -
 * [KO] 파싱할 glTF 애니메이션 채널 데이터
 * [EN] glTF animation channel data to parse
 * @param animationSamplers -
 * [KO] glTF 애니메이션 샘플러 배열
 * [EN] Array of glTF animation samplers
 * @param gltfData -
 * [KO] glTF 데이터 객체
 * [EN] glTF data object
 * @param animationDataCache -
 * [KO] 공유 액세서 `AnimationData_GLTF` 캐시 맵 (선택)
 * [EN] Optional cache map for shared `AnimationData_GLTF` accessors
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스 (선택)
 * [EN] Optional `GLTFParseContext` instance for the current parse session
 * @category GLTF
 */
const parseAnimationChannel_GLTF = (
    gltfLoader: GLTFLoader,
    parsedSingleClip: GLTFParsedSingleClip,
    animationChannel: AnimationChannel,
    animationSamplers: AnimationSampler[],
    gltfData: GLTF,
    animationDataCache?: Map<number, AnimationData_GLTF>,
    parseContext?: GLTFParseContext
) => {
    let tMesh: Mesh;
    let aniTrack: AniTrack_GLTF;
    const {nodes: NODES} = gltfData
    const targetMeshes = [];
    const {sampler: channelSamplerGlTfId, target: channelTarget} = animationChannel
    const tSampler = animationSamplers[channelSamplerGlTfId];
    let {node: channelTargetDataNodeGlTfId, path: channelTargetDataPath} = channelTarget
    if (channelTargetDataPath === 'pointer') {
        const pointerStr = channelTarget.extensions?.KHR_animation_pointer?.pointer;
        const descriptor = parseAnimationPointerPath(pointerStr);
        if (!descriptor) return;
        if (descriptor.domain === 'node_standard') {
            channelTargetDataNodeGlTfId = descriptor.nodeIndex;
            channelTargetDataPath = descriptor.path;
        } else {
            const outputAccessor = gltfData.accessors?.[tSampler.output];
            let componentCount: 1 | 2 | 3 | 4 = 1;
            if (outputAccessor?.type === 'VEC2') componentCount = 2;
            else if (outputAccessor?.type === 'VEC3') componentCount = 3;
            else if (outputAccessor?.type === 'VEC4') componentCount = 4;
            const binding = createPointerTargetBinding(gltfLoader, gltfData, descriptor, componentCount, parseContext);
            if (!binding) return;
            aniTrack = new AniTrack_GLTF(
                'pointer',
                getOrCreateAnimationData(gltfLoader, gltfData, tSampler.input, animationDataCache),
                getOrCreateAnimationData(gltfLoader, gltfData, tSampler.output, animationDataCache),
                tSampler.interpolation,
                gltfLoader.resultMesh,
                targetMeshes,
                binding
            );
            parsedSingleClip.tracks.push(aniTrack);
            const {dataList} = aniTrack.timeAnimationInfo;
            if (parsedSingleClip.minTime > dataList[0]) parsedSingleClip.minTime = dataList[0];
            if (parsedSingleClip.maxTime < dataList[dataList.length - 1]) parsedSingleClip.maxTime = dataList[dataList.length - 1];
            return;
        }
    }
    if (channelTargetDataNodeGlTfId === undefined) return;
    const tNode = NODES[channelTargetDataNodeGlTfId];
    if (!tNode) return;
    if ('mesh' in tNode) {
        tMesh = parseContext?.nodeObjectMap.get(channelTargetDataNodeGlTfId);
        if (!tMesh) return;
        const nodeMeshes = parseContext?.nodeMeshesMap.get(channelTargetDataNodeGlTfId);
        if (nodeMeshes) {
            let i = nodeMeshes.length;
            while (i--) {
                targetMeshes.push(nodeMeshes[i]);
            }
        }
    } else {
        const groupMesh = parseContext?.nodeObjectMap.get(channelTargetDataNodeGlTfId);
        if (groupMesh) {
            tMesh = groupMesh;
        } else return;
    }
    if (
        channelTargetDataPath == 'scale'
        || channelTargetDataPath == 'rotation'
        || channelTargetDataPath == 'translation'
        || channelTargetDataPath == 'weights'
    ) {
        aniTrack = new AniTrack_GLTF(
            channelTargetDataPath,
            getOrCreateAnimationData(gltfLoader, gltfData, tSampler.input, animationDataCache),
            getOrCreateAnimationData(gltfLoader, gltfData, tSampler.output, animationDataCache),
            tSampler.interpolation,
            tMesh,
            targetMeshes
        )
        parsedSingleClip.tracks.push(aniTrack);
    } else {
        console.warn('파싱할수없는 데이터', channelTargetDataPath);
    }
    if (aniTrack) {
        const {timeAnimationInfo} = aniTrack
        const {dataList} = timeAnimationInfo
        if (parsedSingleClip.minTime > dataList[0]) parsedSingleClip.minTime = dataList[0];
        if (parsedSingleClip.maxTime < dataList[dataList.length - 1]) parsedSingleClip.maxTime = dataList[dataList.length - 1];
    }
};
export default parseAnimationChannel_GLTF
