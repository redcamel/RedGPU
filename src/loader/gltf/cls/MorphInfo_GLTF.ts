import {GLTF, MeshPrimitive} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseAttributeInfo_GLTF from "../parsers/parseAttributeInfo_GLTF";
import parseSparse_GLTF from "../parsers/parseSparse_GLTF";
import AccessorInfo_GLTF from "./AccessorInfo_GLTF";
import MorphInfoData_GLTF from "./MorphInfoData_GLTF";

/**
 * Represents a MorphInfo_GLTF object.
 * @constructor
 * @param {GLTFLoader} gltfLoader - The GLTFLoader object.
 * @param {GLTF} scenesData - The scenes data object.
 * @param {MeshPrimitive} meshPrimitive - The mesh primitive object.
 * @param {number[]} weightsValue - The weights values for morphing.
 */
class MorphInfo_GLTF {
	morphInfoDataList: MorphInfoData_GLTF[] = []
	weights: number[]
	cacheData = {}
	origin

	/**
	 * Creates a new instance of the Constructor class.
	 * @param {GLTFLoader} gltfLoader - The GLTFLoader instance.
	 * @param {GLTF} gltfData - The GLTF data.
	 * @param {MeshPrimitive} meshPrimitive - The mesh primitive.
	 * @param {number[]} weightsValue - The weights value.
	 */
	constructor(gltfLoader: GLTFLoader, gltfData: GLTF, meshPrimitive: MeshPrimitive, weightsValue: number[]) {
		if (meshPrimitive.targets) {
			this.morphInfoDataList = meshPrimitive.targets.map((target) => {
				const morphData = new MorphInfoData_GLTF()
				for (let key in target) {
					const {
						vertices,
						verticesColor_0,
						normals,
						uvs,
						uvs1,
						uvs2,
						jointWeights,
						joints,
						tangents,
					} = morphData;
					const accessorGlTfId = target[key];
					const accessorInfo = new AccessorInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
					const {accessor} = accessorInfo
					// 어트리뷰트 갈궈서 파악함
					parseAttributeInfo_GLTF(
						key, accessorInfo,
						vertices, uvs, uvs1, uvs2, normals,
						jointWeights, joints,
						verticesColor_0, tangents
					);
					// 스파스 정보도 갈굼
					if (accessor.sparse) parseSparse_GLTF(gltfLoader, key, accessor, gltfData, vertices);
				}
				if (weightsValue.length) {
					morphData.interleaveData = new Float32Array(morphData.vertices);
				}
				return morphData
			});
		}
		this.weights = weightsValue || [];
		this.origin = null; // TODO 애초에 이거 필요없지 않냐?
		// console.log('MorphInfo_GLTF',this)
	}
}

export default MorphInfo_GLTF;
