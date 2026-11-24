import Mesh from "../../../../display/mesh/Mesh";
import parseAnimationInfo_GLTF from "../../cls/AnimationData_GLTF";
import AniTrack_GLTF from "../../cls/anitrack/AniTrack_GLTF";
import {AnimationChannel, AnimationSampler, GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import {GLTFParsedSingleClip} from "./GLTFParsedSingleClip";
import {createPointerTargetBinding, parseAnimationPointerPath} from "./resolveAnimationPointer_GLTF";

/**
 * [KO] GLTF의 단일 애니메이션 채널 데이터를 파싱하여 트랙을 생성하고 클립에 추가합니다.
 * [EN] Parses a single GLTF animation channel to create a track and adds it to the clip.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param parsedSingleClip -
 * [KO] 트랙이 추가될 파싱된 단일 애니메이션 클립 객체
 * [EN] Parsed single animation clip object to which the track will be added
 * @param animationChannel -
 * [KO] 파싱할 GLTF 애니메이션 채널 데이터
 * [EN] GLTF animation channel data to parse
 * @param animationSamplers -
 * [KO] GLTF 애니메이션 샘플러 배열
 * [EN] Array of GLTF animation samplers
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @category Loader
 */
const getOrCreateAnimationData = (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    accessorGlTfId: number,
    cache?: Map<number, parseAnimationInfo_GLTF>
): parseAnimationInfo_GLTF => {
    if (cache) {
        let cached = cache.get(accessorGlTfId);
        if (!cached) {
            cached = new parseAnimationInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
            cache.set(accessorGlTfId, cached);
        }
        return cached;
    }
    return new parseAnimationInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
};

const parseAnimationChannel_GLTF = (
    gltfLoader: GLTFLoader,
    parsedSingleClip: GLTFParsedSingleClip,
    animationChannel: AnimationChannel,
    animationSamplers: AnimationSampler[],
    gltfData: GLTF,
    animationDataCache?: Map<number, parseAnimationInfo_GLTF>
) => {
    let tMesh: Mesh;
    let aniTrack: AniTrack_GLTF;
    const {nodes: NODES, meshes: MESHES} = gltfData
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
            const binding = createPointerTargetBinding(gltfLoader, gltfData, descriptor, componentCount);
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
        tMesh = tNode['Mesh'];
        const {primitives} = MESHES[tNode.mesh];
        let i = primitives.length;
        while (i--) {
            targetMeshes.push(primitives[i]['Mesh']);
        }
    } else {
        let tGroup;
        if (gltfLoader.parsingResult.groups[channelTargetDataNodeGlTfId]) {
            tGroup = gltfLoader.parsingResult.groups[channelTargetDataNodeGlTfId];
            tMesh = tGroup;
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
