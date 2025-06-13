import GPU_COMPARE_FUNCTION from "../../../../gpuConst/GPU_COMPARE_FUNCTION";
import ParsedSkinInfo_GLTF from "../../cls/ParsedSkinInfo_GLTF";
import {GlTfId, Node} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";

const parseJoint_GLTF = (gltfLoader: GLTFLoader, skinInfo: ParsedSkinInfo_GLTF, nodes: Node[], jointGlTfId: GlTfId) => {
	// const {redGPUContext} = gltfLoader
	const jointMesh = nodes[jointGlTfId]['Mesh'];
	if (jointMesh) {
		skinInfo.joints.push(jointMesh);
		// jointMesh.geometry = new Sphere(redGPUContext, 0.05, 3, 3, 3);
		// jointMesh.material = new ColorMaterial(redGPUContext, '#ff0000');
		// jointMesh.material.transparent = true
		// jointMesh.depthStencilState.depthCompare = GPU_COMPARE_FUNCTION.ALWAYS
		// jointMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
		jointMesh.depthCompare = GPU_COMPARE_FUNCTION.NEVER
	} else {
		requestAnimationFrame(function () {
			// console.log(nodes[jointGlTfId])
			parseJoint_GLTF(gltfLoader, skinInfo, nodes, jointGlTfId);
		});
	}
};
export default parseJoint_GLTF
