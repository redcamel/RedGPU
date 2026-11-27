// parseCameras_GLTF (orthographic/perspective) 및 parseNode_GLTF (멀티-프리미티브 + 자식 노드 1회 생성) 단위 테스트
import {describe, expect, it, vi} from 'vitest';
import OrthographicCamera from '../../../../src/camera/camera/OrthographicCamera';
import PerspectiveCamera from '../../../../src/camera/camera/PerspectiveCamera';
import GLTFParseContext from '../../../../src/loader/gltf/core/GLTFParseContext';
import {GLTF} from '../../../../src/loader/gltf/GLTF';
import parseCameras_GLTF from '../../../../src/loader/gltf/parsers/parseCameras_GLTF';
import parseNode_GLTF from '../../../../src/loader/gltf/parsers/parseNode_GLTF';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));

vi.mock('../../../../src/display/mesh/Mesh', () => {
    return {
        default: class MockMesh {
            name = '';
            visible = true;
            x = 0;
            y = 0;
            z = 0;
            scaleX = 1;
            scaleY = 1;
            scaleZ = 1;
            rotationX = 0;
            rotationY = 0;
            rotationZ = 0;
            children: any[] = [];

            addChild(child: any) {
                this.children.push(child);
            }

            setPosition(x: number, y: number, z: number) {
                this.x = x;
                this.y = y;
                this.z = z;
            }

            setScale(x: number, y: number, z: number) {
                this.scaleX = x;
                this.scaleY = y;
                this.scaleZ = z;
            }

            setRotation(x: number, y: number, z: number) {
                this.rotationX = x;
                this.rotationY = y;
                this.rotationZ = z;
            }
        }
    };
});

vi.mock('../../../../src/loader/gltf/parsers/parseMesh_GLTF', () => {
    return {
        default: (_loader: any, _data: any, gltfMesh: any) => {
            const count = gltfMesh.primitives.length;
            const list = [];
            for (let i = 0; i < count; i++) {
                list.push({
                    name: `${gltfMesh.name ?? 'mesh'}_prim${i}`,
                    visible: true,
                    x: 0, y: 0, z: 0,
                    scaleX: 1, scaleY: 1, scaleZ: 1,
                    rotationX: 0, rotationY: 0, rotationZ: 0,
                    children: [],
                    addChild(c: any) {
                        this.children.push(c);
                    }
                });
            }
            return list;
        }
    };
});

describe('Phase 8-6 — Multi-Primitive Node Grouping & Orthographic Camera Parsing', () => {
    it('maps both perspective and orthographic glTF cameras accurately', () => {
        const cameras: PerspectiveCamera[] = [];
        const mockLoader = {
            parsingResult: {cameras}
        } as any;

        const gltfData = {
            asset: {version: '2.0'},
            cameras: [
                {
                    type: 'perspective',
                    perspective: {
                        yfov: Math.PI / 3,
                        znear: 0.25,
                        zfar: 500
                    }
                },
                {
                    type: 'orthographic',
                    orthographic: {
                        xmag: 12,
                        ymag: 8,
                        znear: 0.5,
                        zfar: 200
                    }
                }
            ]
        } as unknown as GLTF;

        parseCameras_GLTF(mockLoader, gltfData);

        expect(cameras.length).toBe(2);
        expect(cameras[0]).toBeInstanceOf(PerspectiveCamera);
        expect(cameras[0]).not.toBeInstanceOf(OrthographicCamera);
        expect(cameras[0].fieldOfView).toBeCloseTo(60, 4);
        expect(cameras[0].nearClipping).toBeCloseTo(0.25);
        expect(cameras[0].farClipping).toBeCloseTo(500);

        expect(cameras[1]).toBeInstanceOf(OrthographicCamera);
        const ortho = cameras[1] as OrthographicCamera;
        expect(ortho.left).toBe(-12);
        expect(ortho.right).toBe(12);
        expect(ortho.top).toBe(8);
        expect(ortho.bottom).toBe(-8);
        expect(ortho.nearClipping).toBeCloseTo(0.5);
        expect(ortho.farClipping).toBeCloseTo(200);
    });

    it('groups multi-primitive node under one container and parses children exactly once (CesiumMilkTruck pattern)', () => {
        const ctx = new GLTFParseContext();
        const rootParent = {
            children: [] as any[],
            addChild(c: any) {
                this.children.push(c);
            }
        } as any;
        const mockLoader = {
            redGPUContext: {},
            parsingResult: {groups: []}
        } as any;

        const gltfData = {
            asset: {version: '2.0'},
            meshes: [
                {name: 'TruckBody', primitives: [{attributes: {}}, {attributes: {}}, {attributes: {}}]},
                {name: 'Wheel', primitives: [{attributes: {}}]}
            ],
            nodes: [
                {name: 'TruckNode', mesh: 0, translation: [1, 2, 3], children: [1, 2]},
                {name: 'FrontWheel', mesh: 1},
                {name: 'RearWheel', mesh: 1}
            ]
        } as unknown as GLTF;

        parseNode_GLTF(mockLoader, gltfData, 0, rootParent, ctx);

        // 부모 아래에 컨테이너 그룹 1개만 부착
        expect(rootParent.children.length).toBe(1);
        const truckGroup = rootParent.children[0];
        expect(truckGroup.name).toBe('TruckNode');
        expect(truckGroup.x).toBe(1);
        expect(truckGroup.y).toBe(2);
        expect(truckGroup.z).toBe(3);

        // nodeObjectMap은 그룹 컨테이너를 가리켜 TRS 애니메이션이 3개 프리미티브 전체를 이동시킴
        expect(ctx.nodeObjectMap.get(0)).toBe(truckGroup);
        // nodeMeshesMap은 3개 프리미티브를 모두 유지 (모프/가시성 호환)
        expect(ctx.nodeMeshesMap.get(0)?.length).toBe(3);

        // 그룹 자식은 3개 프리미티브 + 2개 바퀴 = 총 5개 (기존 버그처럼 바퀴가 3벌=6개 중복되지 않음!)
        expect(truckGroup.children.length).toBe(5);
    });

    it('attaches single-primitive node directly without an extra group container', () => {
        const ctx = new GLTFParseContext();
        const rootParent = {
            children: [] as any[],
            addChild(c: any) {
                this.children.push(c);
            }
        } as any;
        const mockLoader = {
            redGPUContext: {},
            parsingResult: {groups: []}
        } as any;

        const gltfData = {
            asset: {version: '2.0'},
            meshes: [
                {name: 'SingleMesh', primitives: [{attributes: {}}]}
            ],
            nodes: [
                {name: 'SingleNode', mesh: 0}
            ]
        } as unknown as GLTF;

        parseNode_GLTF(mockLoader, gltfData, 0, rootParent, ctx);

        expect(rootParent.children.length).toBe(1);
        expect(rootParent.children[0].name).toBe('SingleMesh_prim0');
        expect(ctx.nodeObjectMap.get(0)).toBe(rootParent.children[0]);
    });
});
