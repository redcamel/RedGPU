import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import Mesh from "../../../../mesh/Mesh";
import Geometry from "../../../../../geometry/Geometry";
import VertexBuffer from "../../../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexInterleavedStruct from "../../../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import {createOctahedralImpostorGeometry} from "../impostor/octahedral/createOctahedralImpostorGeometry";
import OctahedralImpostorMaterial from "../impostor/octahedral/OctahedralImpostorMaterial";
import FoliageImpostorBaker from "../impostor/FoliageImpostorBaker";
import FoliageSubMesh from "../../FoliageSubMesh";
import FoliageShadowMergedSubMesh from "../submesh/FoliageShadowMergedSubMesh";
import type {FoliageLODInfo, FoliageTypeOptions} from "../../FoliageType";
import type {FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";

const PBR_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
    {
        position: VertexInterleaveType.float32x3,
        vertexNormal: VertexInterleaveType.float32x3,
        uv: VertexInterleaveType.float32x2,
        uv1: VertexInterleaveType.float32x2,
        vertexColor_0: VertexInterleaveType.float32x4,
        vertexTangent: VertexInterleaveType.float32x4,
    },
    'PBR'
);
const PBR_STRIDE = 18;
const PBR_STRIDE_BYTES = PBR_STRIDE * 4;

const POSITION_ONLY_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
    {
        position: VertexInterleaveType.float32x3,
    },
    'PositionOnly'
);
const POSITION_ONLY_STRIDE = 3;
const POSITION_ONLY_STRIDE_BYTES = POSITION_ONLY_STRIDE * 4;

export interface FoliageAssemblyResult {
    subMeshes: FoliageSubMesh[];
    shadowMergedSubMeshes: FoliageShadowMergedSubMesh[];
    lod0SubMeshCount: number;
    lodInfoList: FoliageLODInfo[];
    bottomOffset: number;
    boundingRadius: number;
}

interface RawSubMesh {
    node: Mesh;
    geometry: any;
    material: any;
    currentRelativeMatrix: mat4;
    normalMatrix: mat4;
    rawStride: number;
}

class FoliageSubMeshAssembler {

    static readonly #subMeshUniformData: Float32Array = new Float32Array(36);
    static readonly #subMeshUniformUint32: Uint32Array = new Uint32Array(FoliageSubMeshAssembler.#subMeshUniformData.buffer);
    static readonly #tempLocalMatrix: mat4 = mat4.create();
    static readonly #identityMatrix: mat4 = mat4.create();
    static #bufferSeq: number = 0;

    static assemble(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        subMeshBindGroupLayout: GPUBindGroupLayout
    ): FoliageAssemblyResult {
        const gpuDevice = redGPUContext.gpuDevice;
        const subList: FoliageSubMesh[] = [];
        const lodInfoList: FoliageLODInfo[] = [];

        if (!gpuDevice || !subMeshBindGroupLayout) {
            return {
                subMeshes: subList,
                shadowMergedSubMeshes: [],
                lod0SubMeshCount: 0,
                lodInfoList: [],
                bottomOffset: 0,
                boundingRadius: 10.0
            };
        }

        const useImpostor = options.useImpostor !== false;
        const lodConfigs = options.lods || [];
        const numLODs = Math.min(lodConfigs.length, 8);

        for (let l = 0; l < numLODs; l++) {
            const lodCfg = lodConfigs[l];
            const lodMeshes = Array.isArray(lodCfg.mesh) ? lodCfg.mesh : [lodCfg.mesh];
            const startSubOffset = subList.length;

            const assembledSubMeshes = FoliageSubMeshAssembler.#assembleMeshList(
                redGPUContext,
                lodMeshes,
                l,
                options,
                subMeshBindGroupLayout
            );

            for (let s = 0; s < assembledSubMeshes.length; s++) {
                subList.push(assembledSubMeshes[s]);
            }

            const subCountForThisLOD = subList.length - startSubOffset;
            const defaultDist = (l === 0) ? 80.0 : (80.0 * Math.pow(2.5, l));
            const switchDist = lodCfg.lodDistance ?? defaultDist;

            lodInfoList.push({
                lodIndex: l,
                lodDistance: switchDist,
                subMeshOffset: startSubOffset,
                subMeshCount: subCountForThisLOD,
            });
        }

        if (useImpostor && subList.length > 0) {
            const impostorLODIndex = lodInfoList.length;
            const lod0SubMeshes = subList.filter(s => s.lodIndex === 0);

            FoliageSubMeshAssembler.#buildAndAttachImpostor(
                redGPUContext,
                gpuDevice,
                subMeshBindGroupLayout,
                options,
                lod0SubMeshes,
                subList,
                lodInfoList,
                impostorLODIndex
            );
        }


        const shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
        for (let l = 0; l < numLODs; l++) {
            const subsInLod = subList.filter(s => s.lodIndex === l && !s.isImpostor);
            if (subsInLod.length > 0) {
                const shadowSub = FoliageSubMeshAssembler.buildShadowMergedGeometry(
                    redGPUContext,
                    subsInLod,
                    l,
                    options,
                    subMeshBindGroupLayout
                );
                if (shadowSub) {
                    shadowMergedSubMeshes.push(shadowSub);
                }
            }
        }

        const lod0SubMeshCount = lodInfoList.length > 0 ? lodInfoList[0].subMeshCount : subList.length;

        let minOffset = 0;
        let maxDistSq = 0;
        const maxInstances = options.maxInstances ?? 50000;

        for (let i = 0; i < subList.length; i++) {
            const sub = subList[i];
            sub.instanceBufferOffset = (sub.lodIndex ?? 0) * maxInstances * 32;
            sub.indirectOffsetBytes = i * 20;

            minOffset = Math.min(minOffset, sub.bottomOffset);

            const vBuffer = sub.geometry?.vertexBuffer;
            const vData = vBuffer?.data;
            if (vData) {
                const stride = (vBuffer.stride || (vBuffer.interleavedStruct?.arrayStride ? vBuffer.interleavedStruct.arrayStride / 4 : 18));
                const count = vBuffer.vertexCount ?? 0;
                for (let v = 0; v < count; v++) {
                    const idx = v * stride;
                    const vx = vData[idx];
                    const vy = vData[idx + 1];
                    const vz = vData[idx + 2];
                    const dSq = vx * vx + vy * vy + vz * vz;
                    if (dSq > maxDistSq) maxDistSq = dSq;
                }
            }
        }

        for (let i = 0; i < shadowMergedSubMeshes.length; i++) {
            const shadowSub = shadowMergedSubMeshes[i];
            const lodInfo = lodInfoList.find(info => info.lodIndex === shadowSub.lodIndex);
            const subOffset = lodInfo ? lodInfo.subMeshOffset : 0;
            shadowSub.instanceBufferOffset = (shadowSub.lodIndex ?? 0) * maxInstances * 32;
            shadowSub.indirectOffsetBytes = subOffset * 20;
        }

        const boundingRadius = Math.sqrt(maxDistSq);

        let finalBottomOffset = minOffset;
        if (options.groundOffset !== undefined) {
            finalBottomOffset = options.groundOffset;
        } else if (boundingRadius > 0) {
            finalBottomOffset = Math.max(minOffset, Math.min(boundingRadius * 0.025, 0.35));
        }

        return {
            subMeshes: subList,
            shadowMergedSubMeshes,
            lod0SubMeshCount,
            lodInfoList,
            bottomOffset: finalBottomOffset,
            boundingRadius,
        };
    }


    static buildShadowMergedGeometry(
        redGPUContext: RedGPUContext,
        subMeshesInLod: FoliageSubMesh[],
        lodIndex: number,
        options: FoliageTypeOptions,
        subMeshBindGroupLayout: GPUBindGroupLayout
    ): FoliageShadowMergedSubMesh | null {
        if (!subMeshesInLod || subMeshesInLod.length === 0) return null;

        let totalVertexCount = 0;
        let totalIndexCount = 0;

        for (let i = 0; i < subMeshesInLod.length; i++) {
            const sub = subMeshesInLod[i];
            if (sub.isImpostor) continue;
            const geom = sub.geometry;
            totalVertexCount += geom.vertexBuffer?.vertexCount ?? 0;
            totalIndexCount += geom.indexBuffer?.indexCount ?? (geom.vertexBuffer?.vertexCount ?? 0);
        }

        if (totalVertexCount === 0) return null;


        const mergedPositions = new Float32Array(totalVertexCount * POSITION_ONLY_STRIDE);
        const mergedIndices = new Uint32Array(totalIndexCount);

        let vertexOffset = 0;
        let indexOffset = 0;

        for (let i = 0; i < subMeshesInLod.length; i++) {
            const sub = subMeshesInLod[i];
            if (sub.isImpostor) continue;
            const geom = sub.geometry;
            const srcVB = geom.vertexBuffer;
            const srcIB = geom.indexBuffer;
            const srcVData = srcVB?.data;
            const srcIData = srcIB?.data;
            const vCount = srcVB?.vertexCount ?? 0;
            const stride = srcVB?.stride || (srcVB?.interleavedStruct?.arrayStride ? srcVB.interleavedStruct.arrayStride / 4 : 18);

            if (srcVData && vCount > 0) {
                for (let v = 0; v < vCount; v++) {
                    const srcIdx = v * stride;
                    const dstIdx = (vertexOffset + v) * POSITION_ONLY_STRIDE;
                    mergedPositions[dstIdx + 0] = srcVData[srcIdx + 0];
                    mergedPositions[dstIdx + 1] = srcVData[srcIdx + 1];
                    mergedPositions[dstIdx + 2] = srcVData[srcIdx + 2];
                }
            }

            if (srcIData) {
                const iCount = srcIB.indexCount;
                for (let idx = 0; idx < iCount; idx++) {
                    mergedIndices[indexOffset + idx] = srcIData[idx] + vertexOffset;
                }
                indexOffset += iCount;
            } else {
                for (let idx = 0; idx < vCount; idx++) {
                    mergedIndices[indexOffset + idx] = vertexOffset + idx;
                }
                indexOffset += vCount;
            }

            vertexOffset += vCount;
        }

        const seq = ++FoliageSubMeshAssembler.#bufferSeq;
        const vKey = `FoliageShadowVB_${options.name}_LOD${lodIndex}_${seq}`;
        const iKey = `FoliageShadowIB_${options.name}_LOD${lodIndex}_${seq}`;
        const combinedVB = new VertexBuffer(redGPUContext, mergedPositions, POSITION_ONLY_INTERLEAVED_STRUCT, undefined, vKey);
        const combinedIB = new IndexBuffer(redGPUContext, mergedIndices, undefined, iKey);
        const combinedGeom = new Geometry(redGPUContext, combinedVB, combinedIB);

        const gpuDevice = redGPUContext.gpuDevice;
        const uniformBuffer = gpuDevice.createBuffer({
            label: `FoliageShadowSubMesh_UniformBuffer_${options.name}_LOD${lodIndex}`,
            size: 144,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const floatView = FoliageSubMeshAssembler.#subMeshUniformData;
        const uintView = FoliageSubMeshAssembler.#subMeshUniformUint32;
        floatView.set(FoliageSubMeshAssembler.#identityMatrix, 0);
        floatView.set(FoliageSubMeshAssembler.#identityMatrix, 16);
        uintView[32] = 0;
        uintView[33] = 0; 
        uintView[34] = 0;
        uintView[35] = 0;

        gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 144);

        const vertexBindGroup = gpuDevice.createBindGroup({
            label: `FoliageShadowSubMesh_VertexBindGroup_${options.name}_LOD${lodIndex}`,
            layout: subMeshBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: uniformBuffer}
                }
            ]
        });

        return new FoliageShadowMergedSubMesh({
            lodIndex,
            geometry: combinedGeom,
            vertexCount: totalVertexCount,
            indexCount: totalIndexCount,
            isIndexed: true,
            indexFormat: 'uint32',
            strideBytes: POSITION_ONLY_STRIDE_BYTES,
            vertexUniformBuffer: uniformBuffer,
            vertexUniformBindGroup: vertexBindGroup,
            instanceBufferOffset: 0,
            indirectOffsetBytes: 0,
        });
    }

    static #buildAndAttachImpostor(
        redGPUContext: RedGPUContext,
        gpuDevice: GPUDevice,
        subMeshBindGroupLayout: GPUBindGroupLayout,
        options: FoliageTypeOptions,
        sourceSubMeshes: FoliageSubMesh[],
        subList: FoliageSubMesh[],
        lodInfoList: FoliageLODInfo[],
        impostorLODIndex: number
    ): void {
        const bakeResult = FoliageImpostorBaker.bakeSubMeshes(redGPUContext, sourceSubMeshes, options.name);

        const bbWidth = bakeResult.width;
        const bbHeight = bakeResult.height;
        const bbBottomOffset = bakeResult.bottomOffset ?? 0;

        const bbGeom = createOctahedralImpostorGeometry(redGPUContext, bbWidth, bbHeight, bbBottomOffset);
        const bbMat = new OctahedralImpostorMaterial(redGPUContext, bakeResult.baseColorTexture, bakeResult.normalTexture, bakeResult.packedORMTexture, `${options.name}_OctahedralMat`, 8.0);

        const bbStartOffset = subList.length;
        const bbSubMesh = FoliageSubMeshAssembler.#createSubMeshInstance(
            gpuDevice,
            subMeshBindGroupLayout,
            subList.length,
            sourceSubMeshes[0]?.mesh,
            bbGeom,
            bbMat,
            mat4.create(),
            mat4.create(),
            PBR_STRIDE_BYTES,
            impostorLODIndex,
            true,
            bbWidth,
            bbHeight,
            bbBottomOffset
        );
        subList.push(bbSubMesh);

        lodInfoList.push({
            lodIndex: impostorLODIndex,
            lodDistance: 1000000.0,
            subMeshOffset: bbStartOffset,
            subMeshCount: 1,
        });
    }

    static #computeMeshLocalMatrix(mesh: Mesh, out: mat4): mat4 {
        const x = mesh.x ?? 0;
        const y = mesh.y ?? 0;
        const z = mesh.z ?? 0;
        const radX = (mesh.rotationX ?? 0) * (Math.PI / 180);
        const radY = (mesh.rotationY ?? 0) * (Math.PI / 180);
        const radZ = (mesh.rotationZ ?? 0) * (Math.PI / 180);
        const sX = mesh.scaleX ?? 1;
        const sY = mesh.scaleY ?? 1;
        const sZ = mesh.scaleZ ?? 1;

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

        out[0] = b00 * sX;
        out[1] = b01 * sX;
        out[2] = b02 * sX;
        out[3] = 0;

        out[4] = b10 * sY;
        out[5] = b11 * sY;
        out[6] = b12 * sY;
        out[7] = 0;

        out[8] = b20 * sZ;
        out[9] = b21 * sZ;
        out[10] = b22 * sZ;
        out[11] = 0;

        return out;
    }

    static #traverseHierarchy(
        node: Mesh,
        parentRelativeMatrix: mat4,
        isRoot: boolean,
        rawList: RawSubMesh[],
        options: FoliageTypeOptions
    ): void {
        if (!node) return;

        const currentRelativeMatrix = mat4.create();
        if (isRoot) {
            const parentChain: Mesh[] = [];
            let p: any = node.parent;
            while (p && p.isInstanceofMesh) {
                parentChain.unshift(p);
                p = p.parent;
            }
            for (let c = 0; c < parentChain.length; c++) {
                FoliageSubMeshAssembler.#computeMeshLocalMatrix(parentChain[c], FoliageSubMeshAssembler.#tempLocalMatrix);
                mat4.multiply(currentRelativeMatrix, currentRelativeMatrix, FoliageSubMeshAssembler.#tempLocalMatrix);
            }
            FoliageSubMeshAssembler.#computeMeshLocalMatrix(node, FoliageSubMeshAssembler.#tempLocalMatrix);
            mat4.multiply(currentRelativeMatrix, currentRelativeMatrix, FoliageSubMeshAssembler.#tempLocalMatrix);
        } else {
            FoliageSubMeshAssembler.#computeMeshLocalMatrix(node, FoliageSubMeshAssembler.#tempLocalMatrix);
            mat4.multiply(currentRelativeMatrix, parentRelativeMatrix, FoliageSubMeshAssembler.#tempLocalMatrix);
        }

        if (node.geometry && node.material) {
            const mat = node.material;

            const isFoliage = options.isFoliage !== false;
            if (isFoliage) {
                mat.isFoliage = true;


                const isMasked = !!mat.useCutOff || mat.alphaBlend === 1;
                if (isMasked) {
                    mat.useCutOff = true;
                    mat.cutOff = (mat.cutOff > 0) ? mat.cutOff : 0.3333;
                    mat.doubleSided = true;
                } else {
                    mat.useCutOff = false;
                }
                mat.transparent = false;
                mat.dirtyPipeline = true;
            }

            if (mat.dirtyPipeline || !mat.gpuRenderInfo?.fragmentShaderModule || !mat.gpuRenderInfo?.fragmentUniformBindGroup) {
                mat._updateFragmentState();
                mat.dirtyPipeline = false;
            }

            const geom = node.geometry;
            const rawStride = geom.vertexBuffer?.stride || (geom.vertexBuffer?.interleavedStruct?.arrayStride ? geom.vertexBuffer.interleavedStruct.arrayStride / 4 : 18);

            const normalMatrix = mat4.create();
            mat4.invert(normalMatrix, currentRelativeMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            rawList.push({
                node,
                geometry: geom,
                material: mat,
                currentRelativeMatrix,
                normalMatrix,
                rawStride,
            });
        }

        const children = node.children;
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                FoliageSubMeshAssembler.#traverseHierarchy(
                    children[i] as Mesh,
                    currentRelativeMatrix,
                    false,
                    rawList,
                    options
                );
            }
        }
    }

    static #assembleMeshList(
        redGPUContext: RedGPUContext,
        roots: Mesh[],
        lodIndex: number,
        options: FoliageTypeOptions,
        subMeshBindGroupLayout: GPUBindGroupLayout
    ): FoliageSubMesh[] {
        const gpuDevice = redGPUContext.gpuDevice;
        const rawList: RawSubMesh[] = [];

        for (let r = 0; r < roots.length; r++) {
            FoliageSubMeshAssembler.#traverseHierarchy(
                roots[r],
                FoliageSubMeshAssembler.#identityMatrix,
                true,
                rawList,
                options
            );
        }

        if (rawList.length === 0) return [];

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        for (let i = 0; i < rawList.length; i++) {
            const raw = rawList[i];
            const geom = raw.geometry;
            const srcVB = geom.vertexBuffer;
            const srcVData = srcVB?.data;
            const vCount = srcVB?.vertexCount ?? 0;
            const rawStride = raw.rawStride;
            const m = raw.currentRelativeMatrix;

            if (srcVData && vCount > 0) {
                for (let v = 0; v < vCount; v++) {
                    const srcIdx = v * rawStride;
                    const x = srcVData[srcIdx + 0];
                    const y = srcVData[srcIdx + 1];
                    const z = srcVData[srcIdx + 2];
                    const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
                    const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
                    const wz = m[2] * x + m[6] * y + m[10] * z + m[14];

                    if (wx < minX) minX = wx;
                    if (wx > maxX) maxX = wx;
                    if (wy < minY) minY = wy;
                    if (wy > maxY) maxY = wy;
                    if (wz < minZ) minZ = wz;
                    if (wz > maxZ) maxZ = wz;
                }
            }
        }

        const offsetX = (isFinite(minX) && isFinite(maxX)) ? (minX + maxX) * 0.5 : 0;
        const offsetY = isFinite(minY) ? minY : 0;
        const offsetZ = (isFinite(minZ) && isFinite(maxZ)) ? (minZ + maxZ) * 0.5 : 0;

        const getMaterialKey = (mat: any): string => {
            if (!mat) return 'default_mat';
            const matType = mat.constructor?.name || 'Material';
            const diffuseKey = mat.baseColorTexture?.src || mat.diffuseTexture?.src || mat.baseColorTexture?.url || mat.diffuseTexture?.url || (mat.baseColorTexture ? mat.baseColorTexture.uuid : '');
            const normalKey = mat.normalTexture?.src || mat.normalTexture?.url || (mat.normalTexture ? mat.normalTexture.uuid : '');
            const ormKey = mat.ormTexture?.src || mat.ormTexture?.url || (mat.ormTexture ? mat.ormTexture.uuid : '');
            return `${matType}_${diffuseKey}_${normalKey}_${ormKey}`;
        };

        const materialGroups = new Map<string, { material: any; raws: RawSubMesh[] }>();
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

        const isFoliage = options.isFoliage !== false;
        const treeCenterY = (isFinite(minY) && isFinite(maxY)) ? ((minY + maxY) * 0.5 - offsetY) : 0;
        const treeRadius = Math.max(
            (isFinite(maxX) && isFinite(minX)) ? (maxX - minX) * 0.5 : 2.0,
            (isFinite(maxY) && isFinite(minY)) ? (maxY - minY) * 0.5 : 3.0,
            (isFinite(maxZ) && isFinite(minZ)) ? (maxZ - minZ) * 0.5 : 2.0,
            0.5
        );
        const invTreeRadius = 1.0 / treeRadius;

        const resultSubMeshes: FoliageSubMesh[] = [];

        materialGroups.forEach((entry) => {
            const group = entry.raws;
            const mat = entry.material;

            let totalVertexCount = 0;
            let totalIndexCount = 0;

            for (let g = 0; g < group.length; g++) {
                const geom = group[g].geometry;
                totalVertexCount += geom.vertexBuffer?.vertexCount ?? 0;
                totalIndexCount += geom.indexBuffer?.indexCount ?? (geom.vertexBuffer?.vertexCount ?? 0);
            }

            const combinedVertexData = new Float32Array(totalVertexCount * PBR_STRIDE);
            const combinedIndexData = new Uint32Array(totalIndexCount);

            let vertexOffset = 0;
            let indexOffset = 0;

            for (let g = 0; g < group.length; g++) {
                const raw = group[g];
                const geom = raw.geometry;
                const srcVB = geom.vertexBuffer;
                const srcIB = geom.indexBuffer;
                const srcVData = srcVB?.data;
                const srcIData = srcIB?.data;
                const vCount = srcVB?.vertexCount ?? 0;
                const rawStride = raw.rawStride;

                if (srcVData && vCount > 0) {
                    const m = raw.currentRelativeMatrix;
                    const n = raw.normalMatrix;

                    for (let v = 0; v < vCount; v++) {
                        const srcIdx = v * rawStride;
                        const dstIdx = (vertexOffset + v) * PBR_STRIDE;

                        const x = srcVData[srcIdx + 0];
                        const y = srcVData[srcIdx + 1];
                        const z = srcVData[srcIdx + 2];
                        const vx = (m[0] * x + m[4] * y + m[8] * z + m[12]) - offsetX;
                        const vy = (m[1] * x + m[5] * y + m[9] * z + m[13]) - offsetY;
                        const vz = (m[2] * x + m[6] * y + m[10] * z + m[14]) - offsetZ;
                        combinedVertexData[dstIdx + 0] = vx;
                        combinedVertexData[dstIdx + 1] = vy;
                        combinedVertexData[dstIdx + 2] = vz;

                        if (rawStride >= 6) {
                            const nx = srcVData[srcIdx + 3];
                            const ny = srcVData[srcIdx + 4];
                            const nz = srcVData[srcIdx + 5];

                            let tx = n[0] * nx + n[4] * ny + n[8] * nz;
                            let ty = n[1] * nx + n[5] * ny + n[9] * nz;
                            let tz = n[2] * nx + n[6] * ny + n[10] * nz;
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
                            combinedVertexData[dstIdx + 6] = srcVData[srcIdx + 6];
                            combinedVertexData[dstIdx + 7] = srcVData[srcIdx + 7];
                        }

                        if (rawStride >= 10) {
                            combinedVertexData[dstIdx + 8] = srcVData[srcIdx + 8];
                            combinedVertexData[dstIdx + 9] = srcVData[srcIdx + 9];
                        } else {
                            combinedVertexData[dstIdx + 8] = combinedVertexData[dstIdx + 6];
                            combinedVertexData[dstIdx + 9] = combinedVertexData[dstIdx + 7];
                        }

                        let vc0 = 1.0, vc1 = 1.0, vc2 = 1.0, vc3 = 1.0;
                        if (rawStride >= 14) {
                            vc0 = srcVData[srcIdx + 10];
                            vc1 = srcVData[srcIdx + 11];
                            vc2 = srcVData[srcIdx + 12];
                            vc3 = srcVData[srcIdx + 13] !== 0 ? srcVData[srcIdx + 13] : 1.0;
                        }
                        combinedVertexData[dstIdx + 10] = vc0;
                        combinedVertexData[dstIdx + 11] = vc1;
                        combinedVertexData[dstIdx + 12] = vc2;
                        combinedVertexData[dstIdx + 13] = vc3;

                        let tanX = 0, tanY = 0, tanZ = 0, tanW = 1.0;
                        let hasTangent = false;

                        if (rawStride >= 18) {
                            tanX = srcVData[srcIdx + 14];
                            tanY = srcVData[srcIdx + 15];
                            tanZ = srcVData[srcIdx + 16];
                            tanW = srcVData[srcIdx + 17] !== 0 ? srcVData[srcIdx + 17] : 1.0;
                            hasTangent = true;
                        } else if (rawStride >= 16) {
                            tanX = srcVData[srcIdx + 12];
                            tanY = srcVData[srcIdx + 13];
                            tanZ = srcVData[srcIdx + 14];
                            tanW = srcVData[srcIdx + 15] !== 0 ? srcVData[srcIdx + 15] : 1.0;
                            hasTangent = true;
                        } else if (rawStride === 12) {

                            tanX = srcVData[srcIdx + 8];
                            tanY = srcVData[srcIdx + 9];
                            tanZ = srcVData[srcIdx + 10];
                            tanW = srcVData[srcIdx + 11] !== 0 ? srcVData[srcIdx + 11] : 1.0;
                            hasTangent = true;
                        }

                        if (hasTangent) {

                            let rtx = m[0] * tanX + m[4] * tanY + m[8] * tanZ;
                            let rty = m[1] * tanX + m[5] * tanY + m[9] * tanZ;
                            let rtz = m[2] * tanX + m[6] * tanY + m[10] * tanZ;
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
                }

                if (srcIData) {
                    const iCount = srcIB.indexCount;
                    for (let i = 0; i < iCount; i++) {
                        combinedIndexData[indexOffset + i] = srcIData[i] + vertexOffset;
                    }
                    indexOffset += iCount;
                } else {
                    for (let i = 0; i < vCount; i++) {
                        combinedIndexData[indexOffset + i] = vertexOffset + i;
                    }
                    indexOffset += vCount;
                }

                vertexOffset += vCount;
            }

            const seq = ++FoliageSubMeshAssembler.#bufferSeq;
            const vKey = `FoliageCombinedVB_${options.name}_LOD${lodIndex}_${mat.name || 'mat'}_${seq}`;
            const iKey = `FoliageCombinedIB_${options.name}_LOD${lodIndex}_${mat.name || 'mat'}_${seq}`;
            const combinedVB = new VertexBuffer(redGPUContext, combinedVertexData, PBR_INTERLEAVED_STRUCT, undefined, vKey);
            const combinedIB = new IndexBuffer(redGPUContext, combinedIndexData, undefined, iKey);
            const combinedGeom = new Geometry(redGPUContext, combinedVB, combinedIB);

            const combinedSubMesh = FoliageSubMeshAssembler.#createSubMeshInstance(
                gpuDevice,
                subMeshBindGroupLayout,
                resultSubMeshes.length,
                group[0].node,
                combinedGeom,
                mat,
                FoliageSubMeshAssembler.#identityMatrix,
                FoliageSubMeshAssembler.#identityMatrix,
                PBR_STRIDE_BYTES,
                lodIndex
            );

            resultSubMeshes.push(combinedSubMesh);
        });

        return resultSubMeshes;
    }

    static #createSubMeshInstance(
        gpuDevice: GPUDevice,
        subMeshBindGroupLayout: GPUBindGroupLayout,
        subIndex: number,
        meshNode: Mesh,
        geom: any,
        mat: any,
        relMatrix: mat4,
        normMatrix: mat4,
        strideBytes: number,
        lodIndex: number = 0,
        isImpostorOverride: boolean = false,
        impostorWidth: number = 0,
        impostorHeight: number = 0,
        bottomOffset: number = 0
    ): FoliageSubMesh {
        const isIndexed = !!geom.indexBuffer;
        const indexCount = geom.indexBuffer?.indexCount ?? 0;
        const vertexCount = geom.vertexBuffer?.vertexCount ?? 0;

        const uniformBuffer = gpuDevice.createBuffer({
            label: `FoliageSubMesh_UniformBuffer_${meshNode.name || subIndex}`,
            size: 144,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const floatView = FoliageSubMeshAssembler.#subMeshUniformData;
        const uintView = FoliageSubMeshAssembler.#subMeshUniformUint32;

        floatView.set(relMatrix, 0);
        floatView.set(normMatrix, 16);
        uintView[32] = (mat as any)?.globalFragmentSlotIndex ?? 0;

        const isIdentity = (
            relMatrix[0] === 1 && relMatrix[1] === 0 && relMatrix[2] === 0 && relMatrix[3] === 0 &&
            relMatrix[4] === 0 && relMatrix[5] === 1 && relMatrix[6] === 0 && relMatrix[7] === 0 &&
            relMatrix[8] === 0 && relMatrix[9] === 0 && relMatrix[10] === 1 && relMatrix[11] === 0 &&
            relMatrix[12] === 0 && relMatrix[13] === 0 && relMatrix[14] === 0 && relMatrix[15] === 1
        );
        uintView[33] = isIdentity ? 0 : 1;
        uintView[34] = 0;
        uintView[35] = 0;

        gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 144);

        const vertexBindGroup = gpuDevice.createBindGroup({
            label: `FoliageSubMesh_VertexBindGroup_${meshNode.name || subIndex}`,
            layout: subMeshBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: uniformBuffer}
                }
            ]
        });

        const isImpostor = isImpostorOverride || mat instanceof OctahedralImpostorMaterial || mat?.constructor?.name === 'OctahedralImpostorMaterial' || (typeof mat?.name === 'string' && mat.name.includes('Octahedral'));
        const isMasked = !!mat.useCutOff || mat.alphaBlend === 1 || isImpostor;
        const hasBaseColorTexture = !!(mat.baseColorTexture?.gpuTexture || mat.baseColorTexture?.src || mat.baseColorTexture?.url || (mat.diffuseTexture && (mat.diffuseTexture.gpuTexture || mat.diffuseTexture.src || mat.diffuseTexture.url)));

        const isDepthPrepass = !isImpostor && (hasBaseColorTexture || isMasked);
        const isMainOpaqueOrMasked = true;
        const mainDepthMode: FoliageDepthPassMode = isDepthPrepass ? 'mainShadingAfterDepth' : 'normal';

        return new FoliageSubMesh({
            mesh: meshNode,
            geometry: geom,
            material: mat,
            indexCount,
            vertexCount,
            isIndexed,
            indexFormat: geom.indexBuffer?.format || 'uint32',
            strideBytes,
            bottomOffset,
            relativeModelMatrix: relMatrix,
            relativeNormalMatrix: normMatrix,
            vertexUniformBuffer: uniformBuffer,
            vertexUniformBindGroup: vertexBindGroup,
            lodIndex,
            isDepthPrepass,
            isMainOpaqueOrMasked,
            isMasked,
            mainDepthMode,
            isImpostor,
            impostorWidth,
            impostorHeight,
            instanceBufferOffset: 0,
            indirectOffsetBytes: 0,
        });
    }
}

Object.freeze(FoliageSubMeshAssembler);
export default FoliageSubMeshAssembler;
