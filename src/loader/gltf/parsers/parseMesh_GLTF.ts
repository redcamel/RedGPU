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
import calculateNormals from "../../../math/calculateNormals";
import createUUID from "../../../utils/uuid/createUUID";
import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";
import MorphInfo_GLTF from "../cls/MorphInfo_GLTF";
import {GLTF, GlTfId, Mesh as GltfMesh, MeshPrimitive} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseMaterialInfo_GLTF from "./material/parseMaterialInfo_GLTF";
import parseAttributeInfo_GLTF from "./parseAttributeInfo_GLTF";
import parseIndicesInfo_GLTF from "./parseIndicesInfo_GLTF";
import parseInterleaveData_GLTF, {packSkinJoints_GLTF, packSkinWeights_GLTF} from "./parseInterleaveData_GLTF";
import parseSparse_GLTF from "./parseSparse_GLTF";
import calculateTangents from "../../../math/calculateTangents";

const EMPTY_FLOAT32_ARRAY = new Float32Array(0);
const EMPTY_UINT32_ARRAY = new Uint32Array(0);

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
        let indices: Uint32Array = EMPTY_UINT32_ARRAY;
        let vertices: Float32Array = EMPTY_FLOAT32_ARRAY;
        let verticesColor_0: Float32Array = EMPTY_FLOAT32_ARRAY;
        let uvs: Float32Array = EMPTY_FLOAT32_ARRAY;
        let uvs1: Float32Array = EMPTY_FLOAT32_ARRAY;
        let normals: Float32Array = EMPTY_FLOAT32_ARRAY;
        let jointWeights: Float32Array = EMPTY_FLOAT32_ARRAY;
        let joints: Float32Array = EMPTY_FLOAT32_ARRAY;
        let tangents: Float32Array = EMPTY_FLOAT32_ARRAY;
        let tDrawMode: GPUPrimitiveTopology;
        const {attributes} = meshPrimitive
        if (attributes) {
            for (const key in attributes) {
                const accessorGlTfId = attributes[key];
                const accessorInfo = new AccessorInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
                const parsed = parseAttributeInfo_GLTF(key, accessorInfo);
                if (parsed) {
                    switch (key) {
                        case 'POSITION':
                            vertices = parsed;
                            break;
                        case 'NORMAL':
                            normals = parsed;
                            break;
                        case 'TEXCOORD_0':
                            uvs = parsed;
                            break;
                        case 'TEXCOORD_1':
                            uvs1 = parsed;
                            break;
                        case 'COLOR_0':
                            verticesColor_0 = parsed;
                            break;
                        case 'TANGENT':
                            tangents = parsed;
                            break;
                        case 'WEIGHTS_0':
                            jointWeights = parsed;
                            break;
                        case 'JOINTS_0':
                            joints = parsed;
                            break;
                    }
                }
                if (accessorInfo.accessor.sparse && parsed) {
                    parseSparse_GLTF(
                        gltfLoader, key,
                        accessorInfo.accessor,
                        gltfData,
                        parsed,
                    );
                }
            }
        }
        if ('indices' in meshPrimitive) {
            const accessorGlTfId = meshPrimitive.indices;
            const accessorInfo = new AccessorInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
            indices = parseIndicesInfo_GLTF(accessorInfo);
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
        }

        const normalData: Float32Array = normals.length ? normals : calculateNormals(vertices, indices);

        if (!tangents.length) {
            tangents = calculateTangents(vertices, normalData, uvs, indices);
        }
        if (tangents.length) tMaterial.useVertexTangent = true;
        const interleaveData = parseInterleaveData_GLTF(vertices, verticesColor_0, normalData, uvs, uvs1, tangents);
        const vertexCount = (vertices.length / 3) | 0;
        let tGeo: Geometry;
        const tInterleaveInfoList = {};
        if (vertexCount > 0) {
            tInterleaveInfoList['aVertexPosition'] = VertexInterleaveType.float32x3
            tInterleaveInfoList['aVertexNormal'] = VertexInterleaveType.float32x3
            tInterleaveInfoList['aTexcoord'] = VertexInterleaveType.float32x2
            tInterleaveInfoList['aTexcoord1'] = VertexInterleaveType.float32x2
            tInterleaveInfoList['aVertexColor_0'] = VertexInterleaveType.float32x4
            tInterleaveInfoList['aVertexTangent'] = VertexInterleaveType.float32x4
        }
        const weightData = packSkinWeights_GLTF(vertexCount, jointWeights);
        const jointData = packSkinJoints_GLTF(vertexCount, joints);
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
                indices,
                undefined,
                `Index_${gltfLoader.url}_${nodeGlTfId}_${i}`
            ) : null
        );
        tMesh = new Mesh(redGPUContext, tGeo, tMaterial);
        const variantMappings = meshPrimitive.extensions?.KHR_materials_variants?.mappings;
        if (Array.isArray(variantMappings) && variantMappings.length > 0) {
            const variantMaterials = new Map<number, PBRMaterial>();
            const parsedByMaterialId = new Map<number, PBRMaterial>();
            for (let m = 0, mLen = variantMappings.length; m < mLen; m++) {
                const mapping = variantMappings[m];
                if (!mapping || typeof mapping.material !== 'number' || !Array.isArray(mapping.variants)) continue;
                let variantMat = parsedByMaterialId.get(mapping.material);
                if (!variantMat) {
                    variantMat = parseMaterialInfo_GLTF(gltfLoader, gltfData, meshPrimitive, mapping.material);
                    if (verticesColor_0.length) variantMat.useVertexColor = true;
                    if (tangents.length) variantMat.useVertexTangent = true;
                    if (variantMat instanceof PBRMaterial) {
                        gltfLoader.parsingResult.materials.push(variantMat);
                    }
                    parsedByMaterialId.set(mapping.material, variantMat);
                }
                for (let v = 0, vLen = mapping.variants.length; v < vLen; v++) {
                    variantMaterials.set(mapping.variants[v], variantMat);
                }
            }
            gltfLoader.parsingResult.materialVariantEntries.push({
                mesh: tMesh,
                defaultMaterial: tMaterial,
                variantMaterials
            });
        }
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
            if (!tMesh.material.use2PathRender) {
                tMesh.depthStencilState.depthWriteEnabled = false
            }
        }
        tMesh.animationInfo.morphInfo = morphInfo;
        if (!tMesh.gpuRenderInfo) tMesh.initGPURenderInfos()
        const morphList = tMesh.animationInfo.morphInfo.morphInfoDataList;
        if (morphList.length > 0) {
            const targetGeometryData = tMesh.geometry.vertexBuffer.data;
            let NUM = 0;
            for (const k in tInterleaveInfoList) {
                NUM += tInterleaveInfoList[k].numElements;
            }
            if (!hasVertexBuffer) {
                const listLen = morphList.length;
                const targetGeometryDataLen = targetGeometryData.length;
                const morphVertexCount = targetGeometryDataLen / NUM;
                for (let index = 0; index < listLen; index++) {
                    const morphVertices = morphList[index].vertices;
                    const tWeights = tMesh.animationInfo.morphInfo.weights[index] == undefined
                        ? 0.5
                        : tMesh.animationInfo.morphInfo.weights[index];
                    for (let vi = 0; vi < morphVertexCount; vi++) {
                        const base = vi * NUM;
                        const v3 = vi * 3;
                        targetGeometryData[base] += morphVertices[v3] * tWeights;
                        targetGeometryData[base + 1] += morphVertices[v3 + 1] * tWeights;
                        targetGeometryData[base + 2] += morphVertices[v3 + 2] * tWeights;
                    }
                }
                tMesh.geometry.vertexBuffer.updateAllData(targetGeometryData);
            }
            tMesh.animationInfo.morphInfo.origin = new Float32Array(targetGeometryData);
        }
        meshPrimitive['Mesh'] = tMesh;
        tMeshList.push(tMesh);
    }
    return tMeshList;
};
export default parseMesh_GLTF;
