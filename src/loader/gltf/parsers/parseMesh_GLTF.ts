import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import GPU_COMPARE_FUNCTION from "../../../gpuConst/GPU_COMPARE_FUNCTION";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import PBRMaterial from "../../../material/pbrMaterial/PBRMaterial";
import InterleaveType from "../../../resources/buffer/core/type/InterleaveType";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import InterleavedStruct from "../../../resources/buffer/vertexBuffer/InterleavedStruct";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import calculateNormals from "../../../utils/math/calculateNormals";
import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";
import MorphInfo_GLTF from "../cls/MorphInfo_GLTF";
import {GLTF, GlTfId, Mesh as GltfMesh, MeshPrimitive} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseMaterialInfo_GLTF from "./material/parseMaterialInfo_GLTF";
import parseAttributeInfo_GLTF from "./parseAttributeInfo_GLTF";
import parseIndicesInfo_GLTF from "./parseIndicesInfo_GLTF";
import parseInterleaveData_GLTF from "./parseInterleaveData_GLTF";
import parseSparse_GLTF from "./parseSparse_GLTF";

const parseMesh_GLTF = function (gltfLoader: GLTFLoader, gltfData: GLTF, gltfMesh: GltfMesh, nodeGlTfId: GlTfId) {
	const {redGPUContext} = gltfLoader
	// keepLog('gltfMesh',nodeGlTfId,gltfMesh)
	let tName;
	if (gltfMesh.name) tName = gltfMesh.name;
	const tMeshList = [];
	const {primitives} = gltfMesh
	// primitives.forEach((meshPrimitive: MeshPrimitive) => {
	//
	// });
	let i = 0
	const primitivesLength = primitives.length
	for (i; i < primitivesLength; i++) {
		const meshPrimitive: MeshPrimitive = primitives[i]
		let tMesh: Mesh;
		let tMaterial;
		let indices = [];
		// 어트리뷰트에서 파싱되는놈들
		let vertices = [];
		let verticesColor_0 = [];
		let uvs = [];
		let uvs1 = [];
		let uvs2 = [];
		let normals = [];
		let jointWeights = [];
		let joints = [];
		let tangents = [];
		let tDrawMode: GPUPrimitiveTopology;
		// 형상 파싱
		const {attributes} = meshPrimitive
		if (attributes) {
			for (const key in attributes) {
				// 엑세서를 통해서 정보파악하고
				const accessorGlTfId = attributes[key];
				const accessorInfo = new AccessorInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
				// 어트리뷰트 갈궈서 파악함
				parseAttributeInfo_GLTF(
					key, accessorInfo,
					vertices, uvs, uvs1, uvs2, normals,
					jointWeights, joints,
					verticesColor_0, tangents
				);
				// 스파스 정보도 갈굼
				if (accessorInfo.accessor.sparse) {
					parseSparse_GLTF(
						gltfLoader, key,
						accessorInfo.accessor,
						gltfData,
						vertices,
					);
				}
			}
		}
		// 인덱스 파싱
		if ('indices' in meshPrimitive) {
			// 버퍼뷰의 위치를 말하므로...이를 추적파싱항
			let accessorGlTfId = meshPrimitive.indices;
			let accessorInfo = new AccessorInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
			parseIndicesInfo_GLTF(accessorInfo, indices);
		}
		// 재질파싱
		tMaterial = parseMaterialInfo_GLTF(gltfLoader, gltfData, meshPrimitive);
		if (tMaterial instanceof PBRMaterial) {
			gltfLoader.parsingResult.materials.push(tMaterial);
		}
		let noIndexBuffer = false
		// 모드 파싱
		if ('mode' in meshPrimitive) {
			// 0 POINTS
			// 1 LINES
			// 2 LINE_LOOP
			// 3 LINE_STRIP
			// 4 TRIANGLES
			// 5 TRIANGLE_STRIP
			// 6 TRIANGLE_FAN
			switch (meshPrimitive.mode) {
				case 0 :
					// POINTS
					tDrawMode = GPU_PRIMITIVE_TOPOLOGY.POINT_LIST;
					break;
				case 1 :
					// LINES
					tDrawMode = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
					break;
				case 2 :
					// LINE_LOOP
					tDrawMode = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
					break;
				case 3 :
					// LINE_STRIP
					tDrawMode = GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP;
					noIndexBuffer = true
					break;
				case 4 :
					// TRIANGLES
					tDrawMode = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
					break;
				case 5 :
					// TRIANGLE_STRIP
					tDrawMode = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
					noIndexBuffer = true
					break;
				case 6 :
					// TRIANGLE_FAN
					tDrawMode = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
					break;
			}
		}
		/////////////////////////////////////////////////////////
		// 최종데이터 생산
		if (verticesColor_0.length) tMaterial.useVertexColor_0 = true;
		if (tangents.length) tMaterial.useVertexTangent = true;
		let normalData;
		if (normals.length) normalData = normals;
		else normalData = calculateNormals(vertices, indices);
		let interleaveData = [];
		parseInterleaveData_GLTF(interleaveData, vertices, verticesColor_0, normalData, uvs, uvs1, uvs2, jointWeights, joints, tangents);
		// console.log('interleaveData', interleaveData);
		/////////////////////////////////////////////////////////
		// 메쉬 생성
		let tGeo: Geometry;
		let tInterleaveInfoList = {};
		if (vertices.length) tInterleaveInfoList['aVertexPosition'] = InterleaveType.float32x3
		if (normalData.length) tInterleaveInfoList['aVertexNormal'] = InterleaveType.float32x3
		if (uvs.length) tInterleaveInfoList['aTexcoord'] = InterleaveType.float32x2
		if (uvs2.length) tInterleaveInfoList['aTexcoord1'] = InterleaveType.float32x2
		else if (uvs1.length) tInterleaveInfoList['aTexcoord1'] = InterleaveType.float32x2
		else if (uvs.length) tInterleaveInfoList['aTexcoord1'] = InterleaveType.float32x2
		tInterleaveInfoList['aVertexColor_0'] = InterleaveType.float32x4
		// if (jointWeights.length)
		tInterleaveInfoList['aVertexWeight'] = InterleaveType.float32x4
		// if (joints.length)
		tInterleaveInfoList['aVertexJoint'] = InterleaveType.float32x4
		tInterleaveInfoList['aVertexTangent'] = InterleaveType.float32x4
		tGeo = new Geometry(
			redGPUContext,
			new VertexBuffer(
				redGPUContext,
				interleaveData,
				new InterleavedStruct(
					tInterleaveInfoList,
				),
				undefined,
				`Vertex_${gltfLoader.url}_${nodeGlTfId}_${i}`
			),
			!noIndexBuffer && indices.length ? new IndexBuffer(
				redGPUContext,
				new Uint32Array(indices),
				undefined,
				`Index_${gltfLoader.url}_${nodeGlTfId}_${i}`
			) : null
		);
		// console.log(tDrawMode,indices)
		// console.log('tGeo', tGeo)
		if (!tMaterial) {
			consoleAndThrowError('재질을 파싱할수없는경우 ', meshPrimitive);
		}
		tMesh = new Mesh(redGPUContext, tGeo, tMaterial);
		if (tName) {
			tMesh.name = tName;
			if (gltfLoader.parsingOption) {
				for (let k in gltfLoader.parsingOption) {
					if (tName.toLowerCase().indexOf(k) > -1) {
						gltfLoader.parsingOption[k](tMesh);
					}
				}
			}
		}
		if (tDrawMode) tMesh.primitiveState.topology = tDrawMode;
		else tMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
		//
		if (tMesh.material.doubleSided) {
			tMesh.primitiveState.cullMode = GPU_CULL_MODE.NONE;
		}
		if (tMesh.material.use2PathRender) {
			tMesh.primitiveState.cullMode = GPU_CULL_MODE.NONE;
			tMesh.depthStencilState.depthCompare = GPU_COMPARE_FUNCTION.LESS_EQUAL
			// tMesh.depthStencilState.depthWriteEnabled = false
		}
		if (tMesh.material.alphaBlend === 2) {
			// TODO
			tMesh.depthStencilState.depthCompare = GPU_COMPARE_FUNCTION.LESS_EQUAL
		}
		/////////////////////////////////////////////////////////
		{
			// 모프리스트 설정
			let morphInfo = new MorphInfo_GLTF(gltfLoader, gltfData, meshPrimitive, gltfMesh.weights);
			let index = 0;
			let list = morphInfo.morphInfoDataList;
			const len = list.length
			while (index < len) {
				const morph = list[index];
				const normalData = morph.normals.length ? morph.normals : calculateNormals(morph.vertices, indices);
				const interleaveData = [];
				parseInterleaveData_GLTF(
					interleaveData,
					morph.vertices, morph.verticesColor_0,
					normalData, morph.uvs, morph.uvs1, morph.uvs2,
					morph.jointWeights, morph.joints,
					morph.tangents
				);
				morph.interleaveData = interleaveData;
				index++;
			}
			tMesh.animationInfo.morphInfo = morphInfo;
			tMesh.animationInfo.morphInfo.origin = new Float32Array(interleaveData);
			// console.log('모프리스트', tMesh.animationInfo.morphInfo);
		}
		/////////////////////////////////////////////////////
		let targetGeometryData = tMesh.geometry.vertexBuffer.data
		if (!tMesh.gpuRenderInfo) tMesh.initGPURenderInfos()
		let NUM = 0;
		{
			// console.log('여긴가',new InterleavedStruct(tInterleaveInfoList),tMesh.geometry.vertexBuffer)
			for (const k in tInterleaveInfoList) {
				// console.log('여긴가', k, tInterleaveInfoList[k],)
				NUM += tInterleaveInfoList[k].numElements
			}
		}
		// console.log('여긴가', NUM)
		{
			const list = tMesh.animationInfo.morphInfo.morphInfoDataList;
			let index = 0;
			const listLen = list.length
			const targetGeometryDataLen = targetGeometryData.length
			while (index < listLen) {
				let v = list[index];
				const vertices = v.vertices
				let i = 0, len = targetGeometryDataLen / NUM;
				let tWeights = tMesh.animationInfo.morphInfo.weights[index] == undefined ? 0.5 : tMesh.animationInfo.morphInfo.weights[index];
				while (i < len) {
					targetGeometryData[i * NUM] += vertices[i * 3] * tWeights;
					targetGeometryData[i * NUM + 1] += vertices[i * 3 + 1] * tWeights;
					targetGeometryData[i * NUM + 2] += vertices[i * 3 + 2] * tWeights;
					i++;
				}
				index++;
			}
		}
		tMesh.geometry.vertexBuffer.updateAllData(targetGeometryData);
		tMesh.animationInfo.morphInfo.origin = new Float32Array(targetGeometryData);
		/////////////////////////////////////////////////////
		meshPrimitive['Mesh'] = tMesh;
		tMeshList.push(tMesh);
		// console.log('vertices', vertices);
		// console.log('normalData', normalData);
		// console.log('uvs', uvs);
		// console.log('joints', joints);
		// console.log('jointWeights', jointWeights);
		// console.log('tangents', tangents);
		// console.log('indices', indices)
	}
	return tMeshList;
};
export default parseMesh_GLTF;
