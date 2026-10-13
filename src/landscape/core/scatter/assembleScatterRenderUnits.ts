import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import ScatterRenderUnit from "./ScatterRenderUnit";
import {
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE,
    POSITION_ONLY_INTERLEAVED_STRUCT,
    POSITION_ONLY_STRIDE
} from "./ScatterVertexFormats";

const tempLocalMatrix: mat4 = mat4.create();
const identityMatrix: mat4 = mat4.create();

export interface RawMeshNode {
    node: Mesh;
    geometry: Geometry | Primitive;
    material: any;
    currentRelativeMatrix: mat4;
    normalMatrix: mat4;
    rawStride: number;
}

export interface AssembledMeshGroup {
    material: any;
    geometry: Geometry;
    vertexCount: number;
    indexCount: number;
    firstIndex: number;
    rawNodes: RawMeshNode[];
}

export interface ScatterAssemblyOptions {
    preservePivot?: boolean;

    centerXZ?: boolean;

    generateShadowMergedGeometry?: boolean;
}

export interface ScatterAssemblyResult {
    groups: AssembledMeshGroup[];
    renderUnits: ScatterRenderUnit[];
    unifiedGeometry: Geometry | null;
    totalVertexCount: number;
    totalIndexCount: number;
    boundingRadius: number;
    boundingHeight: number;
    bottomOffset: number;
    shadowMergedGeometry?: Geometry | null;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
}

function computeMeshLocalMatrix(mesh: Mesh, out: mat4): mat4 {
    const {
        x = 0,
        y = 0,
        z = 0,
        rotationX = 0,
        rotationY = 0,
        rotationZ = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1
    } = mesh;
    const radX = rotationX * (Math.PI / 180);
    const radY = rotationY * (Math.PI / 180);
    const radZ = rotationZ * (Math.PI / 180);

    out[12] = x;
    out[13] = y;
    out[14] = z;
    out[15] = 1;

    const aSx = Math.sin(radX), aCx = Math.cos(radX);
    const aSy = Math.sin(radY), aCy = Math.cos(radY);
    const aSz = Math.sin(radZ), aCz = Math.cos(radZ);

    const b00 = aCy * aCz;
    const b01 = aCx * aSz + aSx * aSy * aCz;
    const b02 = aSx * aSz - aCx * aSy * aCz;

    const b10 = -aCy * aSz;
    const b11 = aCx * aCz - aSx * aSy * aSz;
    const b12 = aSx * aCz + aCx * aSy * aSz;

    const b20 = aSy;
    const b21 = -aSx * aCy;
    const b22 = aCx * aCy;

    out[0] = b00 * scaleX;
    out[1] = b01 * scaleX;
    out[2] = b02 * scaleX;
    out[3] = 0;

    out[4] = b10 * scaleY;
    out[5] = b11 * scaleY;
    out[6] = b12 * scaleY;
    out[7] = 0;

    out[8] = b20 * scaleZ;
    out[9] = b21 * scaleZ;
    out[10] = b22 * scaleZ;
    out[11] = 0;

    return out;
}

function traverseHierarchy(
    node: Mesh,
    parentRelativeMatrix: mat4,
    isRoot: boolean,
    rawList: RawMeshNode[]
): void {
    if (!node) return;

    const currentRelativeMatrix = mat4.create();
    if (isRoot) {
        const parentChain: Mesh[] = [];
        let p: any = node.parent;
        while (p?.isInstanceofMesh) {
            parentChain.unshift(p);
            p = p.parent;
        }
        for (let c = 0; c < parentChain.length; c++) {
            computeMeshLocalMatrix(parentChain[c], tempLocalMatrix);
            mat4.multiply(currentRelativeMatrix, currentRelativeMatrix, tempLocalMatrix);
        }
        computeMeshLocalMatrix(node, tempLocalMatrix);
        mat4.multiply(currentRelativeMatrix, currentRelativeMatrix, tempLocalMatrix);
    } else {
        computeMeshLocalMatrix(node, tempLocalMatrix);
        mat4.multiply(currentRelativeMatrix, parentRelativeMatrix, tempLocalMatrix);
    }

    const {geometry, material, children} = node;
    if (geometry) {
        const mat = material as any;
        if (mat) {
            const {dirtyPipeline, gpuRenderInfo} = mat;
            if (dirtyPipeline || !gpuRenderInfo?.fragmentShaderModule) {
                mat._updateFragmentState();
                mat.dirtyPipeline = false;
            }
        }

        const {vertexBuffer} = geometry;
        const {stride, interleavedStruct} = vertexBuffer;
        const rawStride = stride ?? (interleavedStruct?.arrayStride ? interleavedStruct.arrayStride / 4 : 18);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, currentRelativeMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        rawList.push({
            node,
            geometry,
            material: mat,
            currentRelativeMatrix,
            normalMatrix,
            rawStride,
        });
    }

    if (children?.length > 0) {
        for (let i = 0; i < children.length; i++) {
            traverseHierarchy(
                children[i] as Mesh,
                currentRelativeMatrix,
                false,
                rawList
            );
        }
    }
}

export default function assembleScatterRenderUnits(
    redGPUContext: RedGPUContext,
    roots: Mesh | Mesh[],
    options?: ScatterAssemblyOptions
): ScatterAssemblyResult {
    const rootList = Array.isArray(roots) ? roots : [roots];
    const rawList: RawMeshNode[] = [];

    for (let r = 0; r < rootList.length; r++) {
        traverseHierarchy(
            rootList[r],
            identityMatrix,
            true,
            rawList
        );
    }

    if (rawList.length === 0) {
        return {
            groups: [],
            renderUnits: [],
            unifiedGeometry: null,
            totalVertexCount: 0,
            totalIndexCount: 0,
            boundingRadius: 0,
            boundingHeight: 0,
            bottomOffset: 0,
            shadowMergedGeometry: null,
            minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0
        };
    }

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    let lodTotalVertices = 0;
    let lodTotalIndices = 0;

    for (let i = 0; i < rawList.length; i++) {
        const raw = rawList[i];
        const {geometry, rawStride, currentRelativeMatrix} = raw;
        const {vertexBuffer, indexBuffer} = geometry;
        const {data, vertexCount} = vertexBuffer;

        lodTotalVertices += vertexCount;
        lodTotalIndices += indexBuffer ? indexBuffer.indexCount : vertexCount;

        if (data && vertexCount > 0) {
            for (let v = 0; v < vertexCount; v++) {
                const srcIdx = v * rawStride;
                const x = data[srcIdx + 0];
                const y = data[srcIdx + 1];
                const z = data[srcIdx + 2];
                const wx = currentRelativeMatrix[0] * x + currentRelativeMatrix[4] * y + currentRelativeMatrix[8] * z + currentRelativeMatrix[12];
                const wy = currentRelativeMatrix[1] * x + currentRelativeMatrix[5] * y + currentRelativeMatrix[9] * z + currentRelativeMatrix[13];
                const wz = currentRelativeMatrix[2] * x + currentRelativeMatrix[6] * y + currentRelativeMatrix[10] * z + currentRelativeMatrix[14];

                if (wx < minX) minX = wx;
                if (wx > maxX) maxX = wx;
                if (wy < minY) minY = wy;
                if (wy > maxY) maxY = wy;
                if (wz < minZ) minZ = wz;
                if (wz > maxZ) maxZ = wz;
            }
        }
    }

    const {
        preservePivot = true,
        centerXZ = false,
        generateShadowMergedGeometry = false
    } = options ?? {};

    const offsetX = centerXZ && isFinite(minX) ? (minX + maxX) * 0.5 : 0;
    const offsetY = !preservePivot && isFinite(minY) ? minY : 0;
    const offsetZ = centerXZ && isFinite(minZ) ? (minZ + maxZ) * 0.5 : 0;

    const materialGroups = new Map<string, { material: any; raws: RawMeshNode[] }>();
    for (let i = 0; i < rawList.length; i++) {
        const raw = rawList[i];
        const matKey = getMaterialKey(raw.material);
        let entry = materialGroups.get(matKey);
        if (!entry) {
            entry = {material: raw.material, raws: []};
            materialGroups.set(matKey, entry);
        }
        entry.raws.push(raw);
    }

    const groups: AssembledMeshGroup[] = [];

    let shadowMergedPositions: Float32Array | null = null;
    let shadowMergedIndices: Uint32Array | null = null;
    let shadowVertexOffset = 0;
    let shadowIndexOffset = 0;

    if (generateShadowMergedGeometry && lodTotalVertices > 0) {
        shadowMergedPositions = new Float32Array(lodTotalVertices * POSITION_ONLY_STRIDE);
        shadowMergedIndices = new Uint32Array(lodTotalIndices);
    }

    let unifiedVertexData: Float32Array | null = null;
    let unifiedIndexData: Uint32Array | null = null;
    let unifiedVertexOffset = 0;
    let unifiedIndexOffset = 0;

    if (lodTotalVertices > 0) {
        unifiedVertexData = new Float32Array(lodTotalVertices * PBR_STRIDE);
        unifiedIndexData = new Uint32Array(lodTotalIndices);
    }

    for (const entry of materialGroups.values()) {
        const {raws, material} = entry;

        let totalVertexCount = 0;
        let totalIndexCount = 0;

        for (let g = 0; g < raws.length; g++) {
            const {geometry} = raws[g];
            const {vertexBuffer, indexBuffer} = geometry;
            const {vertexCount} = vertexBuffer;
            totalVertexCount += vertexCount;
            totalIndexCount += indexBuffer ? indexBuffer.indexCount : vertexCount;
        }

        const combinedVertexData = new Float32Array(totalVertexCount * PBR_STRIDE);
        const combinedIndexData = new Uint32Array(totalIndexCount);

        let vertexOffset = 0;
        let indexOffset = 0;
        const groupFirstIndex = unifiedIndexOffset;
        const groupStartVertexOffset = unifiedVertexOffset;

        for (let g = 0; g < raws.length; g++) {
            const raw = raws[g];
            const {geometry, rawStride, currentRelativeMatrix, normalMatrix} = raw;
            const {vertexBuffer, indexBuffer} = geometry;
            const {data, vertexCount} = vertexBuffer;
            const srcIData = indexBuffer?.data;

            if (data && vertexCount > 0) {

                for (let v = 0; v < vertexCount; v++) {
                    const srcIdx = v * rawStride;
                    const dstIdx = (vertexOffset + v) * PBR_STRIDE;

                    const x = data[srcIdx + 0];
                    const y = data[srcIdx + 1];
                    const z = data[srcIdx + 2];
                    const vx = (currentRelativeMatrix[0] * x + currentRelativeMatrix[4] * y + currentRelativeMatrix[8] * z + currentRelativeMatrix[12]) - offsetX;
                    const vy = (currentRelativeMatrix[1] * x + currentRelativeMatrix[5] * y + currentRelativeMatrix[9] * z + currentRelativeMatrix[13]) - offsetY;
                    const vz = (currentRelativeMatrix[2] * x + currentRelativeMatrix[6] * y + currentRelativeMatrix[10] * z + currentRelativeMatrix[14]) - offsetZ;

                    combinedVertexData[dstIdx + 0] = vx;
                    combinedVertexData[dstIdx + 1] = vy;
                    combinedVertexData[dstIdx + 2] = vz;

                    if (shadowMergedPositions) {
                        const dstShadowIdx = (shadowVertexOffset + v) * POSITION_ONLY_STRIDE;
                        shadowMergedPositions[dstShadowIdx + 0] = vx;
                        shadowMergedPositions[dstShadowIdx + 1] = vy;
                        shadowMergedPositions[dstShadowIdx + 2] = vz;
                    }

                    if (rawStride >= 6) {
                        const nx = data[srcIdx + 3];
                        const ny = data[srcIdx + 4];
                        const nz = data[srcIdx + 5];

                        let tx = normalMatrix[0] * nx + normalMatrix[4] * ny + normalMatrix[8] * nz;
                        let ty = normalMatrix[1] * nx + normalMatrix[5] * ny + normalMatrix[9] * nz;
                        let tz = normalMatrix[2] * nx + normalMatrix[6] * ny + normalMatrix[10] * nz;
                        const len = Math.sqrt(tx * tx + ty * ty + tz * tz);
                        if (len > 0.000001) {
                            tx /= len;
                            ty /= len;
                            tz /= len;
                        }
                        combinedVertexData[dstIdx + 3] = tx;
                        combinedVertexData[dstIdx + 4] = ty;
                        combinedVertexData[dstIdx + 5] = tz;
                    } else {
                        combinedVertexData[dstIdx + 3] = 0;
                        combinedVertexData[dstIdx + 4] = 1;
                        combinedVertexData[dstIdx + 5] = 0;
                    }

                    if (rawStride >= 8) {
                        combinedVertexData[dstIdx + 6] = data[srcIdx + 6];
                        combinedVertexData[dstIdx + 7] = data[srcIdx + 7];
                    }

                    if (rawStride >= 10) {
                        combinedVertexData[dstIdx + 8] = data[srcIdx + 8];
                        combinedVertexData[dstIdx + 9] = data[srcIdx + 9];
                    } else {
                        combinedVertexData[dstIdx + 8] = combinedVertexData[dstIdx + 6];
                        combinedVertexData[dstIdx + 9] = combinedVertexData[dstIdx + 7];
                    }

                    let vc0 = 1.0, vc1 = 1.0, vc2 = 1.0, vc3 = 1.0;
                    if (rawStride >= 14) {
                        vc0 = data[srcIdx + 10];
                        vc1 = data[srcIdx + 11];
                        vc2 = data[srcIdx + 12];
                        vc3 = data[srcIdx + 13];
                    }
                    combinedVertexData[dstIdx + 10] = vc0;
                    combinedVertexData[dstIdx + 11] = vc1;
                    combinedVertexData[dstIdx + 12] = vc2;
                    combinedVertexData[dstIdx + 13] = vc3;

                    let tanX = 0, tanY = 0, tanZ = 0, tanW = 1.0;
                    let hasTangent = false;

                    if (rawStride >= 18) {
                        tanX = data[srcIdx + 14];
                        tanY = data[srcIdx + 15];
                        tanZ = data[srcIdx + 16];
                        tanW = data[srcIdx + 17];
                        hasTangent = true;
                    } else if (rawStride >= 16) {
                        tanX = data[srcIdx + 12];
                        tanY = data[srcIdx + 13];
                        tanZ = data[srcIdx + 14];
                        tanW = data[srcIdx + 15];
                        hasTangent = true;
                    } else if (rawStride === 12) {
                        tanX = data[srcIdx + 8];
                        tanY = data[srcIdx + 9];
                        tanZ = data[srcIdx + 10];
                        tanW = data[srcIdx + 11];
                        hasTangent = true;
                    }

                    if (hasTangent) {
                        let rtx = normalMatrix[0] * tanX + normalMatrix[4] * tanY + normalMatrix[8] * tanZ;
                        let rty = normalMatrix[1] * tanX + normalMatrix[5] * tanY + normalMatrix[9] * tanZ;
                        let rtz = normalMatrix[2] * tanX + normalMatrix[6] * tanY + normalMatrix[10] * tanZ;
                        const tlen = Math.sqrt(rtx * rtx + rty * rty + rtz * rtz);
                        if (tlen > 0.000001) {
                            rtx /= tlen;
                            rty /= tlen;
                            rtz /= tlen;
                        }
                        combinedVertexData[dstIdx + 14] = rtx;
                        combinedVertexData[dstIdx + 15] = rty;
                        combinedVertexData[dstIdx + 16] = rtz;
                        combinedVertexData[dstIdx + 17] = tanW;
                    } else {
                        combinedVertexData[dstIdx + 14] = 1.0;
                        combinedVertexData[dstIdx + 15] = 0.0;
                        combinedVertexData[dstIdx + 16] = 0.0;
                        combinedVertexData[dstIdx + 17] = 1.0;
                    }
                }

                if (srcIData && indexBuffer.indexCount) {
                    const iCount = indexBuffer.indexCount;
                    for (let idx = 0; idx < iCount; idx++) {
                        const sVal = srcIData[idx];
                        combinedIndexData[indexOffset + idx] = vertexOffset + sVal;
                        if (unifiedIndexData) {
                            unifiedIndexData[unifiedIndexOffset + idx] = unifiedVertexOffset + sVal;
                        }
                        if (shadowMergedIndices) {
                            shadowMergedIndices[shadowIndexOffset + idx] = shadowVertexOffset + sVal;
                        }
                    }
                    indexOffset += iCount;
                    if (unifiedIndexData) unifiedIndexOffset += iCount;
                    if (shadowMergedIndices) shadowIndexOffset += iCount;
                } else {
                    for (let idx = 0; idx < vertexCount; idx++) {
                        combinedIndexData[indexOffset + idx] = vertexOffset + idx;
                        if (unifiedIndexData) {
                            unifiedIndexData[unifiedIndexOffset + idx] = unifiedVertexOffset + idx;
                        }
                        if (shadowMergedIndices) {
                            shadowMergedIndices[shadowIndexOffset + idx] = shadowVertexOffset + idx;
                        }
                    }
                    indexOffset += vertexCount;
                    if (unifiedIndexData) unifiedIndexOffset += vertexCount;
                    if (shadowMergedIndices) shadowIndexOffset += vertexCount;
                }

                vertexOffset += vertexCount;
                if (unifiedVertexData) unifiedVertexOffset += vertexCount;
                if (shadowMergedPositions) shadowVertexOffset += vertexCount;
            }
        }

        if (unifiedVertexData) {
            unifiedVertexData.set(combinedVertexData, groupStartVertexOffset * PBR_STRIDE);
        }

        const isSingleGroup = materialGroups.size === 1;
        let groupGeom: Geometry | null = null;
        if (isSingleGroup) {
            const combinedVB = new VertexBuffer(redGPUContext, combinedVertexData, PBR_INTERLEAVED_STRUCT);
            const combinedIB = new IndexBuffer(redGPUContext, combinedIndexData);
            groupGeom = new Geometry(redGPUContext, combinedVB, combinedIB);
        }

        groups.push({
            material,
            geometry: groupGeom as Geometry,
            vertexCount: totalVertexCount,
            indexCount: totalIndexCount,
            firstIndex: groupFirstIndex,
            rawNodes: raws
        });
    }

    let unifiedGeometry: Geometry | null = null;
    if (lodTotalVertices > 0) {
        if (groups.length === 1) {
            unifiedGeometry = groups[0].geometry;
        } else if (unifiedVertexData && unifiedIndexData) {
            const unifiedVB = new VertexBuffer(redGPUContext, unifiedVertexData, PBR_INTERLEAVED_STRUCT);
            const unifiedIB = new IndexBuffer(redGPUContext, unifiedIndexData);
            unifiedGeometry = new Geometry(redGPUContext, unifiedVB, unifiedIB);
            for (let i = 0; i < groups.length; i++) {
                groups[i].geometry = unifiedGeometry;
            }
        }
    }

    let shadowMergedGeometry: Geometry | null = null;
    if (shadowMergedPositions && shadowMergedIndices) {
        const shadowVB = new VertexBuffer(redGPUContext, shadowMergedPositions, POSITION_ONLY_INTERLEAVED_STRUCT);
        const shadowIB = new IndexBuffer(redGPUContext, shadowMergedIndices);
        shadowMergedGeometry = new Geometry(redGPUContext, shadowVB, shadowIB);
    }

    let maxDistSq = 0;
    for (let i = 0; i < rawList.length; i++) {
        const raw = rawList[i];
        const {geometry, rawStride, currentRelativeMatrix} = raw;
        const {vertexBuffer} = geometry;
        const {data, vertexCount} = vertexBuffer;

        if (data && vertexCount > 0) {
            for (let v = 0; v < vertexCount; v++) {
                const srcIdx = v * rawStride;
                const x = data[srcIdx + 0];
                const y = data[srcIdx + 1];
                const z = data[srcIdx + 2];
                const vx = (currentRelativeMatrix[0] * x + currentRelativeMatrix[4] * y + currentRelativeMatrix[8] * z + currentRelativeMatrix[12]) - offsetX;
                const vy = (currentRelativeMatrix[1] * x + currentRelativeMatrix[5] * y + currentRelativeMatrix[9] * z + currentRelativeMatrix[13]) - offsetY;
                const vz = (currentRelativeMatrix[2] * x + currentRelativeMatrix[6] * y + currentRelativeMatrix[10] * z + currentRelativeMatrix[14]) - offsetZ;
                const dSq = vx * vx + vy * vy + vz * vz;
                if (dSq > maxDistSq) maxDistSq = dSq;
            }
        }
    }

    const boundingRadius = Math.sqrt(maxDistSq);
    const boundingHeight = (isFinite(minY) && isFinite(maxY) && maxY > minY) ? (maxY - minY) : (boundingRadius > 0 ? boundingRadius * 2.0 : 1.0);
    const bottomOffset = preservePivot ? (isFinite(minY) ? -minY : 0) : 0;

    const finalMinX = isFinite(minX) ? minX - offsetX : 0;
    const finalMaxX = isFinite(maxX) ? maxX - offsetX : 0;
    const finalMinY = isFinite(minY) ? minY - offsetY : 0;
    const finalMaxY = isFinite(maxY) ? maxY - offsetY : 0;
    const finalMinZ = isFinite(minZ) ? minZ - offsetZ : 0;
    const finalMaxZ = isFinite(maxZ) ? maxZ - offsetZ : 0;

    const renderUnits: ScatterRenderUnit[] = unifiedGeometry ? groups.map(({
                                                                               vertexCount,
                                                                               indexCount,
                                                                               firstIndex,
                                                                               material
                                                                           }) => {
        return new ScatterRenderUnit({
            geometry: unifiedGeometry,
            vertexCount,
            indexCount,
            firstIndex,
            material
        });
    }) : [];

    return {
        groups,
        renderUnits,
        unifiedGeometry,
        totalVertexCount: lodTotalVertices,
        totalIndexCount: lodTotalIndices,
        boundingRadius,
        boundingHeight,
        bottomOffset,
        shadowMergedGeometry,
        minX: finalMinX,
        maxX: finalMaxX,
        minY: finalMinY,
        maxY: finalMaxY,
        minZ: finalMinZ,
        maxZ: finalMaxZ
    };
}

function getMaterialKey(mat: any): string {
    if (!mat) return 'default_mat';
    const {constructor, baseColorTexture, normalTexture, ormTexture} = mat;
    const matType = constructor?.name ?? 'Material';

    let baseColorKey = '';
    if (baseColorTexture) {
        const {src, url, uuid} = baseColorTexture;
        baseColorKey = src ?? url ?? uuid ?? '';
    }

    let normalKey = '';
    if (normalTexture) {
        const {src, url, uuid} = normalTexture;
        normalKey = src ?? url ?? uuid ?? '';
    }

    let ormKey = '';
    if (ormTexture) {
        const {src, url, uuid} = ormTexture;
        ormKey = src ?? url ?? uuid ?? '';
    }

    return `${matType}_${baseColorKey}_${normalKey}_${ormKey}`;
}

