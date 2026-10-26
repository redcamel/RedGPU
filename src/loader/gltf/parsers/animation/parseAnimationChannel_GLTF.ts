import Mesh from "../../../../display/mesh/Mesh";
import parseAnimationInfo_GLTF from "../../cls/AnimationData_GLTF";
import AniTrack_GLTF from "../../cls/anitrack/AniTrack_GLTF";
import {AnimationChannel, AnimationSampler, GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import {GLTFParsedSingleClip} from "./GLTFParsedSingleClip";

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
const parseAnimationChannel_GLTF = (
    gltfLoader: GLTFLoader,
    parsedSingleClip: GLTFParsedSingleClip,
    animationChannel: AnimationChannel,
    animationSamplers: AnimationSampler[],
    gltfData: GLTF
) => {
    let tMesh: Mesh;
    let aniTrack: AniTrack_GLTF;
    const {nodes: NODES, meshes: MESHES} = gltfData
    const targetMeshes = [];
    const {sampler: channelSamplerGlTfId, target: channelTarget} = animationChannel
    const tSampler = animationSamplers[channelSamplerGlTfId];
    const {node: channelTargetDataNodeGlTfId, path: channelTargetDataPath} = channelTarget
    const tNode = NODES[channelTargetDataNodeGlTfId];
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
        } else return console.log('여기로 오는경우가 있는건가2');
    }
    if (
        channelTargetDataPath == 'scale'
        || channelTargetDataPath == 'rotation'
        || channelTargetDataPath == 'translation'
        || channelTargetDataPath == 'weights'
    ) {
        aniTrack = new AniTrack_GLTF(
            channelTargetDataPath,
            new parseAnimationInfo_GLTF(gltfLoader, gltfData, tSampler.input),
            new parseAnimationInfo_GLTF(gltfLoader, gltfData, tSampler.output),
            tSampler.interpolation,
            tMesh,
            targetMeshes
        )
        parsedSingleClip.tracks.push(aniTrack);
    } else {
        console.log('파싱할수없는 데이터', channelTargetDataPath);
    }
    if (aniTrack) {
        const {timeAnimationInfo} = aniTrack
        const {dataList} = timeAnimationInfo
        if (parsedSingleClip.minTime > dataList[0]) parsedSingleClip.minTime = dataList[0];
        if (parsedSingleClip.maxTime < dataList[dataList.length - 1]) parsedSingleClip.maxTime = dataList[dataList.length - 1];
    }
};
export default parseAnimationChannel_GLTF
