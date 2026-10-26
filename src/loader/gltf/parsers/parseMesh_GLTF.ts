import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import GPU_COMPARE_FUNCTION from "../../../gpuConst/GPU_COMPARE_FUNCTION";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import PBRMaterial from "../../../material/pbrMaterial/PBRMaterial";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import calculateNormals from "../../../math/calculateNormals";
import createUUID from "../../../utils/uuid/createUUID";
import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";
import MorphInfo_GLTF from "../cls/MorphInfo_GLTF";
import {GLTF, GlTfId, Mesh as GltfMesh, MeshPrimitive} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseMaterialInfo_GLTF from "./material/parseMaterialInfo_GLTF";
import parseAttributeInfo_GLTF from "./parseAttributeInfo_GLTF";
import parseIndicesInfo_GLTF from "./parseIndicesInfo_GLTF";
import parseInterleaveData_GLTF from "./parseInterleaveData_GLTF";
import parseSparse_GLTF from "./parseSparse_GLTF";
import calculateTangents from "../../../math/calculateTangents";

/**
 * [KO] glTF 메시 데이터를 파싱하여 프리미티브별 지오메트리, 재질, 모프 타겟이 적용된 `Mesh` 배열을 생성합니다.
 * [EN] Parses glTF mesh data and creates an array of `Mesh` instances with geometry, material, and morph targets applied per primitive.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 원본 `GLTF` 데이터 객체
 * [EN] Source `GLTF` data object
 * @param gltfMesh -
 * [KO] 파싱할 glTF 메시 데이터
 * [EN] glTF mesh data to parse
 * @param nodeGlTfId -
 * [KO] 메시가 속한 노드의 glTF 식별자
 * [EN] glTF identifier of the node to which the mesh belongs
 * @returns
 * [KO] 생성된 `Mesh` 인스턴스 배열
 * [EN] Array of created `Mesh` instances
 * @category GLTF
 */
const parseMesh_GLTF = function (gltfLoader: GLTFLoader, gltfData: GLTF, gltfMesh: GltfMesh, nodeGlTfId: GlTfId) {
    const {redGPUContext} = gltfLoader
    let tName;
    if (gltfMesh.name) tName = gltfMesh.name;
    const tMeshList = [];
    const {primitives} = gltfMesh
    let i = 0
    const primitivesLength = primitives.length
    for (i; i < primitivesLength; i++) {
        const meshPrimitive: MeshPrimitive = primitives[i]
        let tMesh: Mesh;
        let tMaterial;
        let indices = [];
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
        const {attributes} = meshPrimitive
        const temp = new Map()
        if (attributes) {
            for (const key in attributes) {
                const accessorGlTfId = attributes[key];
                const accessorInfo = new AccessorInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
                const isTexcoord = key.indexOf('TEXCOORD_') > -1
                if (isTexcoord) {
                    const name = `TEXCOORD_${temp.size}`
                    temp.set(key, name)
                }

                parseAttributeInfo_GLTF(
                    isTexcoord ? temp.get(key) : key, accessorInfo,
                    vertices,
                    uvs, uvs1, uvs2,
                    normals,
                    jointWeights, joints,
                    verticesColor_0, tangents
                );
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
        if ('indices' in meshPrimitive) {
            let accessorGlTfId = meshPrimitive.indices;
            let accessorInfo = new AccessorInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
            parseIndicesInfo_GLTF(accessorInfo, indices);
        }
        tMaterial = parseMaterialInfo_GLTF(gltfLoader, gltfData, meshPrimitive);
        if (tMaterial instanceof PBRMaterial) {
            gltfLoader.parsingResult.materials.push(tMaterial);
        }
        let noIndexBuffer = false
        if ('mode' in meshPrimitive) {
            switch (meshPrimitive.mode) {
                case 0 :
                    tDrawMode = GPU_PRIMITIVE_TOPOLOGY.POINT_LIST;
                    break;
                case 1 :
                    tDrawMode = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
                    break;
                case 2 :
                    tDrawMode = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
                    break;
                case 3 :
                    tDrawMode = GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP;
                    noIndexBuffer = true
                    break;
                case 4 :
                    tDrawMode = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
                    break;
                case 5 :
                    tDrawMode = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
                    noIndexBuffer = true
                    break;
                case 6 :
                    tDrawMode = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
                    break;
            }
        }
        if (verticesColor_0.length) {
            tMaterial.useVertexColor = true;
            (tMaterial as any).useVertexColor_0 = true;
        }

        let normalData;
        if (!normals.length) {
            normalData = calculateNormals(vertices, indices);

        } else normalData = normals;

        {
            if (tangents.length > 0) {
            } else {
                tangents = Array.from(calculateTangents(vertices, normalData, uvs, indices));
            }
        }
        if (tangents.length) tMaterial.useVertexTangent = true;
        let interleaveData = [];
        parseInterleaveData_GLTF(interleaveData, vertices, verticesColor_0, normalData, uvs, uvs1, uvs2, jointWeights, joints, tangents);
        let tGeo: Geometry;
        let tInterleaveInfoList = {};
        if (vertices.length) tInterleaveInfoList['aVertexPosition'] = VertexInterleaveType.float32x3
        if (normalData.length) tInterleaveInfoList['aVertexNormal'] = VertexInterleaveType.float32x3
        if (uvs.length) tInterleaveInfoList['aTexcoord'] = VertexInterleaveType.float32x2
        if (uvs2.length) tInterleaveInfoList['aTexcoord1'] = VertexInterleaveType.float32x2
        else if (uvs1.length) tInterleaveInfoList['aTexcoord1'] = VertexInterleaveType.float32x2
        else if (uvs.length) tInterleaveInfoList['aTexcoord1'] = VertexInterleaveType.float32x2
        tInterleaveInfoList['aVertexColor_0'] = VertexInterleaveType.float32x4
        tInterleaveInfoList['aVertexTangent'] = VertexInterleaveType.float32x4
        const weightData = []
        const jointData = []
        parseInterleaveData_GLTF(weightData, vertices, verticesColor_0, normalData, uvs, uvs1, uvs2, jointWeights, joints, tangents, true)
        parseInterleaveData_GLTF(jointData, vertices, verticesColor_0, normalData, uvs, uvs1, uvs2, jointWeights, joints, tangents, false, true)
        const weightBuffer = new VertexBuffer(
            redGPUContext,
            weightData,
            new VertexInterleavedStruct(
                {
                    aVertexWeight: VertexInterleaveType.float32x4,
                }
            ),
            undefined,
            `Weight_${gltfLoader.url}_${nodeGlTfId}_${i}`
        )
        const jointBuffer = new IndexBuffer(
            redGPUContext,
            jointData,
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            `Joint_${gltfLoader.url}_${nodeGlTfId}_${i}`
        )
        let morphInfo = new MorphInfo_GLTF(gltfLoader, gltfData, meshPrimitive, gltfMesh.weights);
        const vertexCacheKey = `Vertex_${gltfLoader.url}_${nodeGlTfId}_${i}_${morphInfo.weights.length ? createUUID() : ''}`
        const hasVertexBuffer = redGPUContext.resourceManager['managedVertexBufferState'].table.get(vertexCacheKey)?.buffer
        tGeo = new Geometry(
            redGPUContext,
            hasVertexBuffer || new VertexBuffer(
                redGPUContext,
                interleaveData,
                new VertexInterleavedStruct(
                    tInterleaveInfoList,
                    'PBR'
                ),
                undefined,
                vertexCacheKey
            ),
            !noIndexBuffer && indices.length ? new IndexBuffer(
                redGPUContext,
                new Uint32Array(indices),
                undefined,
                `Index_${gltfLoader.url}_${nodeGlTfId}_${i}`
            ) : null
        );
        if (!tMaterial) {
            consoleAndThrowError('재질을 파싱할수없는경우 ', meshPrimitive);
        }
        tMesh = new Mesh(redGPUContext, tGeo, tMaterial);
        tMesh.animationInfo.weightBuffer = weightBuffer
        tMesh.animationInfo.jointBuffer = jointBuffer
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
        if (tMesh.material.doubleSided) {
            tMesh.primitiveState.cullMode = GPU_CULL_MODE.NONE;
        }
        if (tMesh.material.use2PathRender) {
            tMesh.primitiveState.cullMode = GPU_CULL_MODE.NONE;
            tMesh.depthStencilState.depthCompare = GPU_COMPARE_FUNCTION.LESS_EQUAL
        }
        if (tMesh.material.alphaBlend === 2) {
            tMesh.depthStencilState.depthCompare = GPU_COMPARE_FUNCTION.LESS_EQUAL
        }
        tMesh.animationInfo.morphInfo = morphInfo;
        tMesh.animationInfo.morphInfo.origin = new Float32Array(interleaveData);
        let targetGeometryData = tMesh.geometry.vertexBuffer.data
        if (!tMesh.gpuRenderInfo) tMesh.initGPURenderInfos()
        let NUM = 0;
        {
            for (const k in tInterleaveInfoList) {
                NUM += tInterleaveInfoList[k].numElements
            }
        }
        if (!hasVertexBuffer) {
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
        meshPrimitive['Mesh'] = tMesh;
        tMeshList.push(tMesh);
    }
    return tMeshList;
};
export default parseMesh_GLTF;
