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
import expandFlatNormals from "../core/expandFlatNormals";
import GLTFParseContext from "../core/GLTFParseContext";
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
const PBR_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
    {
        aVertexPosition: VertexInterleaveType.float32x3,
        aVertexNormal: VertexInterleaveType.float32x3,
        aTexcoord: VertexInterleaveType.float32x2,
        aTexcoord1: VertexInterleaveType.float32x2,
        aVertexColor_0: VertexInterleaveType.float32x4,
        aVertexTangent: VertexInterleaveType.float32x4,
    },
    'PBR'
);
const EMPTY_PBR_INTERLEAVED_STRUCT = new VertexInterleavedStruct({}, 'PBR');
const SKIN_WEIGHT_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
    {
        aVertexWeight: VertexInterleaveType.float32x4,
    }
);
const PBR_VERTEX_FLOAT_STRIDE = PBR_INTERLEAVED_STRUCT.arrayStride / 4;

const resolvePrimitiveTopology = (mode: number | undefined): {
    topology: GPUPrimitiveTopology;
    noIndexBuffer: boolean
} => {
    switch (mode) {
        case 0:
            return {topology: GPU_PRIMITIVE_TOPOLOGY.POINT_LIST, noIndexBuffer: false};
        case 1:
        case 2:
            return {topology: GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, noIndexBuffer: false};
        case 3:
            return {topology: GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP, noIndexBuffer: true};
        case 5:
            return {topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP, noIndexBuffer: true};
        case 4:
        case 6:
        default:
            return {topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST, noIndexBuffer: false};
    }
};

const bindMaterialVariants = (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    meshPrimitive: MeshPrimitive,
    mesh: Mesh,
    defaultMaterial: PBRMaterial,
    parseContext: GLTFParseContext,
    hasVertexColor: boolean,
    hasVertexTangent: boolean,
    isSkinned: boolean,
    bypassMaterialCache: boolean
): void => {
    const variantMappings = meshPrimitive.extensions?.KHR_materials_variants?.mappings;
    if (!Array.isArray(variantMappings) || variantMappings.length === 0) return;

    const variantMaterials = new Map<number, PBRMaterial>();
    const parsedByMaterialId = new Map<number, PBRMaterial>();
    for (let m = 0, mLen = variantMappings.length; m < mLen; m++) {
        const mapping = variantMappings[m];
        if (!mapping || typeof mapping.material !== 'number' || !Array.isArray(mapping.variants)) continue;
        let variantMat = parsedByMaterialId.get(mapping.material);
        if (!variantMat) {
            variantMat = parseMaterialInfo_GLTF(gltfLoader, gltfData, meshPrimitive, {
                overrideMaterialId: mapping.material,
                parseContext,
                useVertexColor: hasVertexColor,
                useVertexTangent: hasVertexTangent,
                isSkinned,
                bypassCache: bypassMaterialCache
            });
            if (variantMat instanceof PBRMaterial && !gltfLoader.parsingResult.materials.includes(variantMat)) {
                gltfLoader.parsingResult.materials.push(variantMat);
            }
            parsedByMaterialId.set(mapping.material, variantMat);
        }
        for (let v = 0, vLen = mapping.variants.length; v < vLen; v++) {
            variantMaterials.set(mapping.variants[v], variantMat);
        }
    }
    parseContext.materialVariantEntries.push({
        mesh,
        defaultMaterial,
        variantMaterials
    });
};

const applyInitialMorphTargets = (
    mesh: Mesh,
    vertexCount: number,
    hasVertexBuffer: VertexBuffer | undefined
): void => {
    const morphList = mesh.animationInfo.morphInfo.morphInfoDataList;
    if (morphList.length === 0) return;

    const targetGeometryData = mesh.geometry.vertexBuffer.data;
    const stride = vertexCount > 0 ? PBR_VERTEX_FLOAT_STRIDE : 0;
    if (!hasVertexBuffer && stride > 0) {
        const listLen = morphList.length;
        const morphVertexCount = targetGeometryData.length / stride;
        for (let index = 0; index < listLen; index++) {
            const morphVertices = morphList[index].vertices;
            const tWeights = mesh.animationInfo.morphInfo.weights[index] == undefined
                ? 0.5
                : mesh.animationInfo.morphInfo.weights[index];
            for (let vi = 0; vi < morphVertexCount; vi++) {
                const base = vi * stride;
                const v3 = vi * 3;
                targetGeometryData[base] += morphVertices[v3] * tWeights;
                targetGeometryData[base + 1] += morphVertices[v3 + 1] * tWeights;
                targetGeometryData[base + 2] += morphVertices[v3 + 2] * tWeights;
            }
        }
        mesh.geometry.vertexBuffer.updateAllData(targetGeometryData);
    }
    mesh.animationInfo.morphInfo.origin = new Float32Array(targetGeometryData);
};

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
 * @param meshGlTfId -
 * [KO] 파싱할 glTF 메시의 식별자
 * [EN] glTF identifier of the mesh to parse
 * @param nodeGlTfId -
 * [KO] 메시가 속한 노드의 glTF 식별자
 * [EN] glTF identifier of the node to which the mesh belongs
 * @param isSkinned -
 * [KO] 노드가 스킨(`skin`)을 참조하는지 여부
 * [EN] Whether the owning node references a skin
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance for the current parse session
 * @returns
 * [KO] 생성된 `Mesh` 인스턴스 배열
 * [EN] Array of created `Mesh` instances
 * @category GLTF
 */
const parseMesh_GLTF = function (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    gltfMesh: GltfMesh,
    meshGlTfId: GlTfId,
    nodeGlTfId: GlTfId,
    isSkinned: boolean,
    parseContext: GLTFParseContext
) {
    const {redGPUContext} = gltfLoader;
    let tName: string | undefined;
    if (gltfMesh.name) tName = gltfMesh.name;

    let bypassMaterialCache = false;
    if (tName && gltfLoader.parsingOption) {
        const lowerName = tName.toLowerCase();
        for (const k in gltfLoader.parsingOption) {
            if (lowerName.indexOf(k) > -1) {
                bypassMaterialCache = true;
                break;
            }
        }
    }

    const tMeshList: Mesh[] = [];
    const {primitives} = gltfMesh;
    const primitivesLength = primitives.length;
    for (let i = 0; i < primitivesLength; i++) {
        const meshPrimitive: MeshPrimitive = primitives[i];
        const {topology: tDrawMode, noIndexBuffer} = resolvePrimitiveTopology(meshPrimitive.mode);

        const hasMorph = Boolean(meshPrimitive.targets && meshPrimitive.targets.length > 0);
        const hasSkinAttributes = Boolean(
            meshPrimitive.attributes &&
            (meshPrimitive.attributes['WEIGHTS_0'] !== undefined || meshPrimitive.attributes['JOINTS_0'] !== undefined)
        );
        const canShareGeometry = !hasMorph && !isSkinned && !hasSkinAttributes;
        const geoCacheKey = canShareGeometry ? `${meshGlTfId}_${i}` : '';
        const cachedGeoEntry = canShareGeometry ? parseContext.geometryCache.get(geoCacheKey) : undefined;

        let tGeo: Geometry;
        let weightBuffer: VertexBuffer | null = null;
        let jointBuffer: IndexBuffer | null = null;
        let hasVertexColor = false;
        let hasVertexTangent = false;
        let vertexCount = 0;
        let jointWeights: Float32Array = EMPTY_FLOAT32_ARRAY;
        let joints: Float32Array = EMPTY_FLOAT32_ARRAY;
        let morphInfo: MorphInfo_GLTF;
        let hasVertexBuffer: VertexBuffer | undefined;

        if (cachedGeoEntry) {
            tGeo = cachedGeoEntry.geometry;
            hasVertexColor = cachedGeoEntry.hasVertexColor;
            hasVertexTangent = cachedGeoEntry.hasVertexTangent;
            morphInfo = new MorphInfo_GLTF(gltfLoader, gltfData, meshPrimitive, gltfMesh.weights);
        } else {
            let indices: Uint32Array = EMPTY_UINT32_ARRAY;
            let vertices: Float32Array = EMPTY_FLOAT32_ARRAY;
            let verticesColor_0: Float32Array = EMPTY_FLOAT32_ARRAY;
            let uvs: Float32Array = EMPTY_FLOAT32_ARRAY;
            let uvs1: Float32Array = EMPTY_FLOAT32_ARRAY;
            let normals: Float32Array = EMPTY_FLOAT32_ARRAY;
            let tangents: Float32Array = EMPTY_FLOAT32_ARRAY;

            const {attributes} = meshPrimitive;
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

            let normalData: Float32Array;
            const isTriangleList = meshPrimitive.mode === undefined || meshPrimitive.mode === 4;
            if (normals.length > 0) {
                normalData = normals;
            } else if (!hasMorph && isTriangleList) {
                const expanded = expandFlatNormals(
                    vertices,
                    indices,
                    verticesColor_0,
                    uvs,
                    uvs1,
                    jointWeights,
                    joints
                );
                vertices = expanded.vertices;
                normalData = expanded.normals;
                verticesColor_0 = expanded.verticesColor_0;
                uvs = expanded.uvs;
                uvs1 = expanded.uvs1;
                jointWeights = expanded.jointWeights;
                joints = expanded.joints;
                indices = EMPTY_UINT32_ARRAY;
                tangents = EMPTY_FLOAT32_ARRAY;
            } else {
                normalData = calculateNormals(vertices, indices);
            }

            hasVertexColor = verticesColor_0.length > 0;
            if (!tangents.length && uvs.length > 0) {
                tangents = calculateTangents(vertices, normalData, uvs, indices);
            }
            hasVertexTangent = tangents.length > 0;

            const interleaveData = parseInterleaveData_GLTF(vertices, verticesColor_0, normalData, uvs, uvs1, tangents);
            vertexCount = (vertices.length / 3) | 0;

            morphInfo = new MorphInfo_GLTF(gltfLoader, gltfData, meshPrimitive, gltfMesh.weights);
            const vertexCacheKey = canShareGeometry
                ? `Vertex_${gltfLoader.url}_mesh${meshGlTfId}_${i}`
                : `Vertex_${gltfLoader.url}_${nodeGlTfId}_${i}_${morphInfo.weights.length ? createUUID() : ''}`;
            const indexCacheKey = canShareGeometry
                ? `Index_${gltfLoader.url}_mesh${meshGlTfId}_${i}`
                : `Index_${gltfLoader.url}_${nodeGlTfId}_${i}`;
            hasVertexBuffer = redGPUContext.resourceManager['managedVertexBufferState'].table.get(vertexCacheKey)?.buffer;
            tGeo = new Geometry(
                redGPUContext,
                hasVertexBuffer || new VertexBuffer(
                    redGPUContext,
                    interleaveData,
                    vertexCount > 0 ? PBR_INTERLEAVED_STRUCT : EMPTY_PBR_INTERLEAVED_STRUCT,
                    undefined,
                    vertexCacheKey
                ),
                !noIndexBuffer && indices.length ? new IndexBuffer(
                    redGPUContext,
                    indices,
                    undefined,
                    indexCacheKey
                ) : null
            );

            const needsSkinBuffers = isSkinned || jointWeights.length > 0 || joints.length > 0;
            if (needsSkinBuffers) {
                const weightData = packSkinWeights_GLTF(vertexCount, jointWeights);
                const jointData = packSkinJoints_GLTF(vertexCount, joints);
                const weightCacheKey = `Weight_${gltfLoader.url}_${nodeGlTfId}_${i}`;
                const jointCacheKey = `Joint_${gltfLoader.url}_${nodeGlTfId}_${i}`;
                weightBuffer = new VertexBuffer(
                    redGPUContext,
                    weightData,
                    SKIN_WEIGHT_INTERLEAVED_STRUCT,
                    undefined,
                    weightCacheKey
                );
                jointBuffer = new IndexBuffer(
                    redGPUContext,
                    jointData,
                    GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
                    jointCacheKey
                );
            }

            if (canShareGeometry) {
                parseContext.geometryCache.set(geoCacheKey, {
                    geometry: tGeo,
                    hasVertexColor,
                    hasVertexTangent
                });
            }
        }

        const tMaterial = parseMaterialInfo_GLTF(gltfLoader, gltfData, meshPrimitive, {
            parseContext,
            useVertexColor: hasVertexColor,
            useVertexTangent: hasVertexTangent,
            isSkinned,
            bypassCache: bypassMaterialCache
        });
        if (tMaterial instanceof PBRMaterial && !gltfLoader.parsingResult.materials.includes(tMaterial)) {
            gltfLoader.parsingResult.materials.push(tMaterial);
        }

        const tMesh = new Mesh(redGPUContext, tGeo, tMaterial);
        bindMaterialVariants(
            gltfLoader,
            gltfData,
            meshPrimitive,
            tMesh,
            tMaterial,
            parseContext,
            hasVertexColor,
            hasVertexTangent,
            isSkinned,
            bypassMaterialCache
        );
        tMesh.animationInfo.weightBuffer = weightBuffer;
        tMesh.animationInfo.jointBuffer = jointBuffer;
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
        tMesh.primitiveState.topology = tDrawMode;
        if (tMesh.material.doubleSided) {
            tMesh.primitiveState.cullMode = GPU_CULL_MODE.NONE;
        }
        if (tMesh.material.use2PathRender) {
            tMesh.primitiveState.cullMode = GPU_CULL_MODE.NONE;
            tMesh.depthStencilState.depthCompare = GPU_COMPARE_FUNCTION.LESS_EQUAL;
        }
        if (tMesh.material.alphaBlend === 2) {
            tMesh.depthStencilState.depthCompare = GPU_COMPARE_FUNCTION.LESS_EQUAL;
            if (!tMesh.material.use2PathRender) {
                tMesh.depthStencilState.depthWriteEnabled = false;
            }
        }
        tMesh.animationInfo.morphInfo = morphInfo;
        if (!tMesh.gpuRenderInfo) tMesh.initGPURenderInfos();
        applyInitialMorphTargets(tMesh, vertexCount, hasVertexBuffer);
        tMeshList.push(tMesh);
    }
    return tMeshList;
};
export default parseMesh_GLTF;
