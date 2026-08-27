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
import type {FoliageLODInfo, FoliageSubMesh, FoliageTypeOptions} from "../../FoliageType";
import type {FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";
import GPU_BLEND_FACTOR from "../../../../../gpuConst/GPU_BLEND_FACTOR";

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

export interface FoliageAssemblyResult {
    subMeshes: FoliageSubMesh[];
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
    strideBytes: number;
    rawStride: number;
}

class FoliageSubMeshAssembler {

    static readonly #subMeshUniformData: Float32Array = new Float32Array(36);
    static readonly #subMeshUniformUint32: Uint32Array = new Uint32Array(FoliageSubMeshAssembler.#subMeshUniformData.buffer);
    static readonly #tempLocalMatrix: mat4 = mat4.create();
    static readonly #identityMatrix: mat4 = mat4.create();

    static assemble(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        subMeshBindGroupLayout: GPUBindGroupLayout
    ): FoliageAssemblyResult {
        const gpuDevice = redGPUContext.gpuDevice;
        const subList: FoliageSubMesh[] = [];
        const lodInfoList: FoliageLODInfo[] = [];

        if (!gpuDevice || !subMeshBindGroupLayout) {
            return {subMeshes: subList, lod0SubMeshCount: 0, lodInfoList: [], bottomOffset: 0, boundingRadius: 10.0};
        }

        const billboardOpt = options.billboard || options.impostor;
        const hasCustomLODs = options.lods && options.lods.length > 0;

        if (hasCustomLODs) {
            const lodConfigs = options.lods!;
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
                    subMeshBindGroupLayout,
                    lodCfg.materialOverride
                );

                for (let s = 0; s < assembledSubMeshes.length; s++) {
                    subList.push(assembledSubMeshes[s]);
                }

                const subCountForThisLOD = subList.length - startSubOffset;
                const prevDist = l > 0 ? lodInfoList[l - 1].lodDistance : 0.0;
                const defaultDist = (l === 0) ? 30.0 : (30.0 * Math.pow(2.5, l));
                const switchDist = lodCfg.lodDistance ?? lodCfg.distance ?? defaultDist;
                const autoFade = FoliageSubMeshAssembler.calculateAutoFadeRange(switchDist, prevDist);
                const fadeRange = lodCfg.fadeRange ?? autoFade;

                lodInfoList.push({
                    lodIndex: l,
                    lodDistance: switchDist,
                    fadeRange: fadeRange,
                    subMeshOffset: startSubOffset,
                    subMeshCount: subCountForThisLOD,
                });
            }

            // Billboard fallback / attachment if enabled
            if (billboardOpt?.enabled) {
                const billboardLODIndex = lodInfoList.length;
                const lod0SubMeshes = subList.filter(s => s.lodIndex === 0);
                const bakeResult = FoliageImpostorBaker.bakeSubMeshes(redGPUContext, lod0SubMeshes, options.name);

                const bbWidth = billboardOpt.width ?? bakeResult.width;
                const bbHeight = billboardOpt.height ?? bakeResult.height;
                const bbBottomOffset = bakeResult.bottomOffset ?? 0;

                const bbGeom = createOctahedralImpostorGeometry(redGPUContext, bbWidth, bbHeight, false, bbBottomOffset);
                let bbMat = billboardOpt.material;
                if (!bbMat) {
                    bbMat = new OctahedralImpostorMaterial(redGPUContext, bakeResult.texture, bakeResult.normalTexture, `${options.name}_OctahedralMat`, 8.0);
                }

                const bbStartOffset = subList.length;
                const bbSubMesh = FoliageSubMeshAssembler.#createSubMeshInstance(
                    gpuDevice,
                    subMeshBindGroupLayout,
                    subList.length,
                    lod0SubMeshes[0]?.mesh,
                    bbGeom,
                    bbMat,
                    mat4.create(),
                    mat4.create(),
                    PBR_STRIDE * 4,
                    billboardLODIndex
                );
                // 🌿 빌보드(Impostor)는 Depth Prepass 불필요 -> Main Pass 1패스('normal')로 렌더링
                bbSubMesh.isDepthPrepass = false;
                bbSubMesh.isMainOpaqueOrMasked = true;
                bbSubMesh.mainDepthMode = 'normal';

                (bbSubMesh as any)._octahedralWidth = bbWidth;
                (bbSubMesh as any)._octahedralHeight = bbHeight;
                (bbSubMesh as any)._bakedWidth = bbWidth;
                (bbSubMesh as any)._bakedHeight = bbHeight;
                (bbSubMesh as any)._bottomOffset = bbBottomOffset;
                subList.push(bbSubMesh);

                if (billboardOpt.lodDistance && lodInfoList.length > 0) {
                    lodInfoList[lodInfoList.length - 1].lodDistance = billboardOpt.lodDistance;
                }

                const last3DDist = lodInfoList.length > 0 ? lodInfoList[lodInfoList.length - 1].lodDistance : 100.0;
                const prevDist = lodInfoList.length > 1 ? lodInfoList[lodInfoList.length - 2].lodDistance : 0.0;
                const autoBbFade = FoliageSubMeshAssembler.calculateAutoFadeRange(last3DDist, prevDist);

                lodInfoList.push({
                    lodIndex: billboardLODIndex,
                    lodDistance: 1000000.0,
                    fadeRange: autoBbFade,
                    subMeshOffset: bbStartOffset,
                    subMeshCount: 1,
                });
            }
        } else {
            // Legacy single mesh mode
            const roots = options.mesh ? (Array.isArray(options.mesh) ? options.mesh : [options.mesh]) : [];
            const assembledSubMeshes = FoliageSubMeshAssembler.#assembleMeshList(
                redGPUContext,
                roots,
                0,
                options,
                subMeshBindGroupLayout
            );

            for (let s = 0; s < assembledSubMeshes.length; s++) {
                subList.push(assembledSubMeshes[s]);
            }

            const lod0Count = subList.length;
            const lod0Dist = billboardOpt?.lodDistance ?? options.lodDistance ?? 80.0;
            const autoFade0 = FoliageSubMeshAssembler.calculateAutoFadeRange(lod0Dist, 0.0);

            lodInfoList.push({
                lodIndex: 0,
                lodDistance: lod0Dist,
                fadeRange: autoFade0,
                subMeshOffset: 0,
                subMeshCount: lod0Count,
            });

            if (billboardOpt?.enabled) {
                const bakeResult = FoliageImpostorBaker.bakeSubMeshes(redGPUContext, subList, options.name);

                const bbWidth = billboardOpt.width ?? bakeResult.width;
                const bbHeight = billboardOpt.height ?? bakeResult.height;
                const bbBottomOffset = bakeResult.bottomOffset ?? 0;

                const bbGeom = createOctahedralImpostorGeometry(redGPUContext, bbWidth, bbHeight, false, bbBottomOffset);
                let bbMat = billboardOpt.material;
                if (!bbMat) {
                    bbMat = new OctahedralImpostorMaterial(redGPUContext, bakeResult.texture, bakeResult.normalTexture, `${options.name}_OctahedralMat`, 8.0);
                }

                const bbSubMesh = FoliageSubMeshAssembler.#createSubMeshInstance(
                    gpuDevice,
                    subMeshBindGroupLayout,
                    subList.length,
                    subList[0]?.mesh,
                    bbGeom,
                    bbMat,
                    mat4.create(),
                    mat4.create(),
                    PBR_STRIDE * 4,
                    1
                );
                // 🌿 빌보드(Impostor)는 Depth Prepass 불필요 -> Main Pass 1패스('normal')로 렌더링
                bbSubMesh.isDepthPrepass = false;
                bbSubMesh.isMainOpaqueOrMasked = true;
                bbSubMesh.mainDepthMode = 'normal';

                (bbSubMesh as any)._octahedralWidth = bbWidth;
                (bbSubMesh as any)._octahedralHeight = bbHeight;
                (bbSubMesh as any)._bakedWidth = bbWidth;
                (bbSubMesh as any)._bakedHeight = bbHeight;
                (bbSubMesh as any)._bottomOffset = bbBottomOffset;
                subList.push(bbSubMesh);

                lodInfoList.push({
                    lodIndex: 1,
                    lodDistance: 1000000.0,
                    fadeRange: autoFade0,
                    subMeshOffset: lod0Count,
                    subMeshCount: 1,
                });
            }
        }

        const lod0SubMeshCount = lodInfoList.length > 0 ? lodInfoList[0].subMeshCount : subList.length;

        let minOffset = 0;
        let maxDistSq = 0;
        for (let i = 0; i < subList.length; i++) {
            const sub = subList[i];
            minOffset = Math.min(minOffset, sub.bottomOffset);

            const vBuffer = sub.geometry?.vertexBuffer;
            const vData = vBuffer?.data;
            if (vData) {
                const stride = (vBuffer.interleavedStruct?.arrayStride ? vBuffer.interleavedStruct.arrayStride / 4 : 18);
                const vCount = vBuffer.vertexCount || (vData.length / stride);
                for (let v = 0; v < vCount; v++) {
                    const idx = v * stride;
                    const vx = vData[idx];
                    const vy = vData[idx + 1];
                    const vz = vData[idx + 2];
                    const dSq = vx * vx + vy * vy + vz * vz;
                    if (dSq > maxDistSq) maxDistSq = dSq;
                }
            }
        }

        const boundingRadius = maxDistSq > 0 ? Math.max(Math.sqrt(maxDistSq), 0.5) : 10.0;

        return {
            subMeshes: subList,
            lod0SubMeshCount,
            lodInfoList,
            bottomOffset: minOffset,
            boundingRadius,
        };
    }

    static calculateAutoFadeRange(currentDist: number, prevDist: number = 0): number {
        const span = Math.max(currentDist - prevDist, 5.0);
        return Math.min(Math.max(span * 0.10, 5.0), 15.0);
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
        options: FoliageTypeOptions,
        materialOverride?: any
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

        if (node.geometry && (node.material || materialOverride)) {
            const mat = materialOverride || node.material;

            const isFoliage = options.isFoliage !== false;
            if (isFoliage) {
                // 🌿 식생 전용 셰이딩 모델 모드 활성화
                mat.isFoliage = true;
            }

            if (options.convertBlendToMasked || isFoliage) {
                if (mat.alphaBlend === 2 || mat.transparent || mat.alphaMode === 'BLEND' || mat.alphaMode === 'MASK') {
                    mat.useCutOff = false;
                    mat.cutOff = (mat.cutOff > 0) ? mat.cutOff : 0.3333;
                    const {blendColorState, blendAlphaState} = mat;
                    if (blendColorState && blendAlphaState) {
                        blendColorState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
                        blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
                        blendAlphaState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
                        blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
                    }
                    mat.transparent = false;
                    mat.alphaBlend = 2;
                    mat.dirtyPipeline = true;
                }
            }

            if (mat.dirtyPipeline || !mat.gpuRenderInfo?.fragmentShaderModule || !mat.gpuRenderInfo?.fragmentUniformBindGroup) {
                mat._updateFragmentState();
                mat.dirtyPipeline = false;
            }

            const geom = node.geometry;
            const rawStride = (geom.vertexBuffer as any)?.stride || 12;
            const strideBytes = rawStride * 4;

            const normalMatrix = mat4.create();
            mat4.invert(normalMatrix, currentRelativeMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            rawList.push({
                node,
                geometry: geom,
                material: mat,
                currentRelativeMatrix,
                normalMatrix,
                strideBytes,
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
                    options,
                    materialOverride
                );
            }
        }
    }

    static #assembleMeshList(
        redGPUContext: RedGPUContext,
        roots: Mesh[],
        lodIndex: number,
        options: FoliageTypeOptions,
        subMeshBindGroupLayout: GPUBindGroupLayout,
        materialOverride?: any
    ): FoliageSubMesh[] {
        const gpuDevice = redGPUContext.gpuDevice;
        const rawList: RawSubMesh[] = [];

        for (let r = 0; r < roots.length; r++) {
            FoliageSubMeshAssembler.#traverseHierarchy(
                roots[r],
                FoliageSubMeshAssembler.#identityMatrix,
                true,
                rawList,
                options,
                materialOverride
            );
        }

        if (rawList.length === 0) return [];

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

        // 🌿 수목 1그루 전체(줄기+잎사귀 등 모든 노드)의 통합 바운딩 중심(treeCenterX, treeCenterZ)을 단 1회 계산
        let treeMinX = Infinity, treeMaxX = -Infinity;
        let treeMinZ = Infinity, treeMaxZ = -Infinity;

        for (let i = 0; i < rawList.length; i++) {
            const raw = rawList[i];
            const srcVData = raw.geometry.vertexBuffer?.data;
            const vCount = raw.geometry.vertexBuffer?.vertexCount ?? 0;
            const rawStride = raw.rawStride;
            const m = raw.currentRelativeMatrix;
            if (srcVData && vCount > 0) {
                for (let v = 0; v < vCount; v++) {
                    const srcIdx = v * rawStride;
                    const x = srcVData[srcIdx + 0];
                    const y = srcVData[srcIdx + 1];
                    const z = srcVData[srcIdx + 2];
                    const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
                    const wz = m[2] * x + m[6] * y + m[10] * z + m[14];
                    if (wx < treeMinX) treeMinX = wx;
                    if (wx > treeMaxX) treeMaxX = wx;
                    if (wz < treeMinZ) treeMinZ = wz;
                    if (wz > treeMaxZ) treeMaxZ = wz;
                }
            }
        }

        const treeCenterX = (treeMinX !== Infinity) ? (treeMinX + treeMaxX) * 0.5 : 0;
        const treeCenterZ = (treeMinZ !== Infinity) ? (treeMinZ + treeMaxZ) * 0.5 : 0;

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
                        combinedVertexData[dstIdx + 0] = m[0] * x + m[4] * y + m[8] * z + m[12];
                        combinedVertexData[dstIdx + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
                        combinedVertexData[dstIdx + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];

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

                        if (rawStride >= 14) {
                            const vc0 = srcVData[srcIdx + 10];
                            const vc1 = srcVData[srcIdx + 11];
                            const vc2 = srcVData[srcIdx + 12];
                            const vc3 = srcVData[srcIdx + 13];
                            combinedVertexData[dstIdx + 10] = vc0;
                            combinedVertexData[dstIdx + 11] = vc1;
                            combinedVertexData[dstIdx + 12] = vc2;
                            combinedVertexData[dstIdx + 13] = vc3 !== 0 ? vc3 : 1.0;
                        } else {
                            combinedVertexData[dstIdx + 10] = 1.0;
                            combinedVertexData[dstIdx + 11] = 1.0;
                            combinedVertexData[dstIdx + 12] = 1.0;
                            combinedVertexData[dstIdx + 13] = 1.0;
                        }

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
                            // Primitive layout: position(3) + normal(3) + uv(2) + tangent(4)
                            tanX = srcVData[srcIdx + 8];
                            tanY = srcVData[srcIdx + 9];
                            tanZ = srcVData[srcIdx + 10];
                            tanW = srcVData[srcIdx + 11] !== 0 ? srcVData[srcIdx + 11] : 1.0;
                            hasTangent = true;
                        }

                        if (hasTangent) {
                            // Tangent is a surface direction vector, transformed by model matrix m (linear part)
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

            // 🌿 수목 전체 1그루의 단일 통합 중심을 모든 파트(줄기/잎사귀)에 동일하게 일괄 적용!
            if (Math.abs(treeCenterX) > 0.001 || Math.abs(treeCenterZ) > 0.001) {
                for (let v = 0; v < totalVertexCount; v++) {
                    const idx = v * PBR_STRIDE;
                    combinedVertexData[idx + 0] -= treeCenterX;
                    combinedVertexData[idx + 2] -= treeCenterZ;
                }
            }

            const vKey = `FoliageCombinedVB_${options.name}_LOD${lodIndex}_${mat.name || 'mat'}_${Math.random()}`;
            const iKey = `FoliageCombinedIB_${options.name}_LOD${lodIndex}_${mat.name || 'mat'}_${Math.random()}`;
            const combinedVB = new VertexBuffer(redGPUContext, combinedVertexData, PBR_INTERLEAVED_STRUCT, undefined, vKey);
            const combinedIB = new IndexBuffer(redGPUContext, combinedIndexData, undefined, iKey);
            const combinedGeom = new Geometry(redGPUContext, combinedVB, combinedIB);

            const identityMatrix = mat4.create();
            mat4.identity(identityMatrix);

            const combinedSubMesh = FoliageSubMeshAssembler.#createSubMeshInstance(
                gpuDevice,
                subMeshBindGroupLayout,
                resultSubMeshes.length,
                group[0].node,
                combinedGeom,
                mat,
                identityMatrix,
                identityMatrix,
                PBR_STRIDE * 4,
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
        lodIndex: number = 0
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

        const isBillboard = mat instanceof OctahedralImpostorMaterial || mat?.constructor?.name === 'OctahedralImpostorMaterial' || (typeof mat?.name === 'string' && mat.name.includes('Octahedral'));
        const isTransparent = !!mat.transparent || !!mat.use2PathRender;
        const isAlpha = (mat.alphaBlend === 2 || (mat.opacity !== undefined && mat.opacity < 1.0)) && !isTransparent;
        const isMasked = !!mat.useCutOff || (mat.cutOff !== undefined && mat.cutOff > 0);
        const hasBaseColorTexture = !!(mat.baseColorTexture?.gpuTexture || mat.baseColorTexture?.src || mat.baseColorTexture?.url || (mat.diffuseTexture && (mat.diffuseTexture.gpuTexture || mat.diffuseTexture.src || mat.diffuseTexture.url)));

        // 🌿 3D 식생 LOD 서브메시에 대해 Depth Prepass 2패스 적용 (빌보드는 1패스 'normal' 렌더링)
        const isDepthPrepass = !isBillboard && !isTransparent && !isAlpha && (hasBaseColorTexture || isMasked);
        const isMainOpaqueOrMasked = !isTransparent && !isAlpha;
        const mainDepthMode: FoliageDepthPassMode = isDepthPrepass ? 'mainShadingAfterDepth' : 'normal';

        return {
            mesh: meshNode,
            geometry: geom,
            material: mat,
            indexCount,
            vertexCount,
            isIndexed,
            indexFormat: geom.indexBuffer?.format || 'uint32',
            strideBytes,
            bottomOffset: 0,
            relativeModelMatrix: relMatrix,
            relativeNormalMatrix: normMatrix,
            vertexUniformBuffer: uniformBuffer,
            vertexUniformBindGroup: vertexBindGroup,
            lodIndex,
            isDepthPrepass,
            isMainOpaqueOrMasked,
            mainDepthMode,
            isAlpha,
            isTransparent,
        };
    }
}

Object.freeze(FoliageSubMeshAssembler);
export default FoliageSubMeshAssembler;
