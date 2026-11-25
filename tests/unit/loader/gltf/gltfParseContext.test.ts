// GLTFParseContext 상태 관리, 2-Pass 스킨/조인트 동기 해석, 4-튜플 머티리얼 캐시 키, 포인터 바인딩 및 원본 JSON 불변성 단위 테스트
import {describe, expect, it, vi} from 'vitest';
import ParsedSkinInfo_GLTF from '../../../../src/loader/gltf/cls/ParsedSkinInfo_GLTF';
import GLTFParseContext from '../../../../src/loader/gltf/core/GLTFParseContext';
import {GLTF, MeshPrimitive, Skin} from '../../../../src/loader/gltf/GLTF';
import parseSkin_GLTF, {parseJoint_GLTF} from '../../../../src/loader/gltf/parsers/animation/parseSkin_GLTF';
import {
    createPointerTargetBinding,
    parseAnimationPointerPath
} from '../../../../src/loader/gltf/parsers/animation/resolveAnimationPointer_GLTF';
import parseMaterialInfo_GLTF from '../../../../src/loader/gltf/parsers/material/parseMaterialInfo_GLTF';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));

describe('GLTFParseContext — lifecycle, 2-Pass skinning, 4-tuple material cache & JSON immutability', () => {
    it('stores runtime mappings and releases all references on clear()', () => {
        const ctx = new GLTFParseContext();
        const mockMesh = {name: 'Mesh0'} as any;
        const mockMaterial = {name: 'Mat0'} as any;
        const mockGeometry = {name: 'Geo0'} as any;

        ctx.nodeObjectMap.set(0, mockMesh);
        ctx.nodeMeshesMap.set(0, [mockMesh]);
        ctx.materialCache.set('0_0_0_0', mockMaterial);
        ctx.geometryCache.set('0_0', {
            geometry: mockGeometry,
            hasVertexColor: false,
            hasVertexTangent: true,
        });
        ctx.pendingSkins.push({skinId: 0, mesh: mockMesh});

        expect(ctx.nodeObjectMap.size).toBe(1);
        expect(ctx.nodeMeshesMap.size).toBe(1);
        expect(ctx.materialCache.size).toBe(1);
        expect(ctx.geometryCache.size).toBe(1);
        expect(ctx.pendingSkins.length).toBe(1);

        ctx.clear();

        expect(ctx.nodeObjectMap.size).toBe(0);
        expect(ctx.nodeMeshesMap.size).toBe(0);
        expect(ctx.materialCache.size).toBe(0);
        expect(ctx.geometryCache.size).toBe(0);
        expect(ctx.pendingSkins.length).toBe(0);
    });

    it('resolves joints synchronously from parseContext without requestAnimationFrame and warns on missing joints', () => {
        const ctx = new GLTFParseContext();
        const jointMesh0 = {name: 'Joint_0'} as any;
        const jointMesh2 = {name: 'Joint_2'} as any;
        ctx.nodeObjectMap.set(0, jointMesh0);
        ctx.nodeObjectMap.set(2, jointMesh2);

        const skinInfo = new ParsedSkinInfo_GLTF();
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        });

        parseJoint_GLTF(skinInfo, 0, ctx);
        parseJoint_GLTF(skinInfo, 2, ctx);
        parseJoint_GLTF(skinInfo, 99, ctx);

        expect(skinInfo.joints).toEqual([jointMesh0, jointMesh2]);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        warnSpy.mockRestore();
    });

    it('binds skin joints, skeleton, and inverseBindMatrices in Pass 2 without mutating frozen gltfData', () => {
        const ctx = new GLTFParseContext();
        const jointA = {name: 'JointA'} as any;
        const jointB = {name: 'JointB'} as any;
        const rootSkeleton = {name: 'SkeletonRoot'} as any;

        // 스킨 노드가 조인트 노드보다 앞에 배치된 씬에서도 Pass 1 완료 후 컨텍스트에 모든 노드가 등록된 상태를 재현
        ctx.nodeObjectMap.set(5, jointA);
        ctx.nodeObjectMap.set(6, jointB);
        ctx.nodeObjectMap.set(4, rootSkeleton);

        const ibmData = new Float32Array(32);
        // 2개의 항등 행렬(Identity MAT4) + 고유 식별 값
        ibmData[0] = 1;
        ibmData[5] = 1;
        ibmData[10] = 1;
        ibmData[15] = 1;
        ibmData[12] = 3.5;

        ibmData[16] = 1;
        ibmData[21] = 1;
        ibmData[26] = 1;
        ibmData[31] = 1;
        ibmData[28] = -2.25;

        const dataView = new DataView(ibmData.buffer);

        const frozenNodes = Object.freeze([
            Object.freeze({name: 'SkinnedMeshNode', skin: 0}),
            Object.freeze({name: 'Unused1'}),
            Object.freeze({name: 'Unused2'}),
            Object.freeze({name: 'Unused3'}),
            Object.freeze({name: 'SkeletonRoot'}),
            Object.freeze({name: 'JointA'}),
            Object.freeze({name: 'JointB'}),
        ]);

        const gltfData = Object.freeze({
            asset: {version: '2.0'},
            nodes: frozenNodes,
            bufferViews: [
                {buffer: 0, byteOffset: 0, byteLength: ibmData.byteLength}
            ],
            accessors: [
                {
                    bufferView: 0,
                    byteOffset: 0,
                    componentType: 5126,
                    count: 2,
                    type: 'MAT4'
                }
            ]
        }) as unknown as GLTF;

        const mockLoader = {
            parsingResult: {
                uris: {
                    buffers: [dataView]
                }
            }
        } as any;

        const skin: Skin = {
            joints: [5, 6],
            skeleton: 4,
            inverseBindMatrices: 0
        };

        const targetMesh = {
            animationInfo: {skinInfo: null}
        } as any;

        parseSkin_GLTF(mockLoader, gltfData, skin, targetMesh, ctx);

        expect(targetMesh.animationInfo.skinInfo).toBeInstanceOf(ParsedSkinInfo_GLTF);
        expect(targetMesh.animationInfo.skinInfo.joints).toEqual([jointA, jointB]);
        expect(targetMesh.animationInfo.skinInfo.skeletonMesh).toBe(rootSkeleton);
        expect(targetMesh.animationInfo.skinInfo.inverseBindMatrices.length).toBe(2);
        expect(targetMesh.animationInfo.skinInfo.inverseBindMatrices[0][12]).toBeCloseTo(3.5);
        expect(targetMesh.animationInfo.skinInfo.inverseBindMatrices[1][12]).toBeCloseTo(-2.25);

        // 원본 gltfData 노드 객체에 'Mesh' / 'Meshes' 속성이 추가되지 않았는지 확인
        for (const node of frozenNodes) {
            expect('Mesh' in node).toBe(false);
            expect('Meshes' in node).toBe(false);
        }
    });

    it('resolves 5-tuple material cache keys separating static, skinned, vertexColor, vertexTangent, and forceUnlit variants', () => {
        const ctx = new GLTFParseContext();
        const staticMat = {id: 'mat0_static', useSkin: false} as any;
        const skinnedMat = {id: 'mat0_skinned', useSkin: true} as any;
        const vcMat = {id: 'mat0_vc', useSkin: false} as any;
        const vtMat = {id: 'mat0_vt', useSkin: false} as any;
        const unlitMat = {id: 'mat0_unlit', useKHR_materials_unlit: true} as any;
        const defaultMat = {id: 'default_static', useSkin: false} as any;

        ctx.materialCache.set('0_0_0_0_0', staticMat);
        ctx.materialCache.set('0_0_0_1_0', skinnedMat);
        ctx.materialCache.set('0_1_0_0_0', vcMat);
        ctx.materialCache.set('0_0_1_0_0', vtMat);
        ctx.materialCache.set('0_0_0_0_1', unlitMat);
        ctx.materialCache.set('default_0_0_0_0', defaultMat);

        const mockLoader = {redGPUContext: {}} as any;
        const mockGltfData = {materials: [{}]} as unknown as GLTF;
        const basePrimitive: MeshPrimitive = {attributes: {POSITION: 0}, material: 0};
        const defaultPrimitive: MeshPrimitive = {attributes: {POSITION: 0}};

        // 동일 5-튜플 요청 시 캐시된 인스턴스 공유 반환
        expect(parseMaterialInfo_GLTF(mockLoader, mockGltfData, basePrimitive, {
            parseContext: ctx,
            useVertexColor: false,
            useVertexTangent: false,
            isSkinned: false
        })).toBe(staticMat);

        // forceUnlit=true는 staticMat과 분리된 unlitMat 반환
        expect(parseMaterialInfo_GLTF(mockLoader, mockGltfData, basePrimitive, {
            parseContext: ctx,
            useVertexColor: false,
            useVertexTangent: false,
            isSkinned: false,
            forceUnlit: true
        })).toBe(unlitMat);

        // isSkinned=true는 staticMat과 분리된 skinnedMat 반환 (useSkin 교차 오염 방지)
        expect(parseMaterialInfo_GLTF(mockLoader, mockGltfData, basePrimitive, {
            parseContext: ctx,
            useVertexColor: false,
            useVertexTangent: false,
            isSkinned: true
        })).toBe(skinnedMat);

        // useVertexColor / useVertexTangent 변형별 캐시 분리
        expect(parseMaterialInfo_GLTF(mockLoader, mockGltfData, basePrimitive, {
            parseContext: ctx,
            useVertexColor: true,
            useVertexTangent: false,
            isSkinned: false
        })).toBe(vcMat);

        expect(parseMaterialInfo_GLTF(mockLoader, mockGltfData, basePrimitive, {
            parseContext: ctx,
            useVertexColor: false,
            useVertexTangent: true,
            isSkinned: false
        })).toBe(vtMat);

        // material 미지정 프리미티브는 'default' 키 사용
        expect(parseMaterialInfo_GLTF(mockLoader, mockGltfData, defaultPrimitive, {
            parseContext: ctx,
            useVertexColor: false,
            useVertexTangent: false,
            isSkinned: false
        })).toBe(defaultMat);

        // overrideMaterialId 지정 시 해당 ID 키로 조회
        expect(parseMaterialInfo_GLTF(mockLoader, mockGltfData, defaultPrimitive, {
            overrideMaterialId: 0,
            parseContext: ctx,
            useVertexColor: false,
            useVertexTangent: false,
            isSkinned: true
        })).toBe(skinnedMat);
    });

    it('resolves KHR_node_visibility pointer bindings via parseContext without reading mutated gltfData.nodes', () => {
        const ctx = new GLTFParseContext();
        const primMesh0 = {visible: true} as any;
        const primMesh1 = {visible: true} as any;
        const groupMesh = {visible: true} as any;

        ctx.nodeMeshesMap.set(0, [primMesh0, primMesh1]);
        ctx.nodeObjectMap.set(1, groupMesh);

        const frozenGltfData = Object.freeze({
            asset: {version: '2.0'},
            nodes: Object.freeze([
                Object.freeze({name: 'MultiPrimNode'}),
                Object.freeze({name: 'GroupNode'})
            ])
        }) as unknown as GLTF;

        const mockLoader = {
            parsingResult: {
                groups: {}
            }
        } as any;

        const desc0 = parseAnimationPointerPath('/nodes/0/extensions/KHR_node_visibility/visible');
        expect(desc0).not.toBeNull();
        if (!desc0) return;
        const binding0 = createPointerTargetBinding(mockLoader, frozenGltfData, desc0, 1, ctx);
        expect(binding0).not.toBeNull();
        if (!binding0) return;
        binding0.apply(0, 0, 0, 0);
        expect(primMesh0.visible).toBe(false);
        expect(primMesh1.visible).toBe(false);
        binding0.apply(1, 0, 0, 0);
        expect(primMesh0.visible).toBe(true);
        expect(primMesh1.visible).toBe(true);

        const desc1 = parseAnimationPointerPath('/nodes/1/extensions/KHR_node_visibility/visible');
        expect(desc1).not.toBeNull();
        if (!desc1) return;
        const binding1 = createPointerTargetBinding(mockLoader, frozenGltfData, desc1, 1, ctx);
        expect(binding1).not.toBeNull();
        if (!binding1) return;
        binding1.apply(0, 0, 0, 0);
        expect(groupMesh.visible).toBe(false);
    });
});
