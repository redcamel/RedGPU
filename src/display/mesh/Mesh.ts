import {mat4} from "gl-matrix";
import {Function} from "wgsl_reflect";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForVertex from "../../defineProperty/DefineForVertex";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import DrawBufferManager, {DrawCommandSlot} from "../../renderer/core/DrawBufferManager";
import RenderViewStateData from "../view/core/RenderViewStateData";
import VertexGPURenderInfo from "./core/VertexGPURenderInfo";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import AABB from "../../utils/math/bound/AABB";
import calculateMeshAABB from "../../utils/math/bound/calculateMeshAABB";
import calculateMeshCombinedAABB from "../../utils/math/bound/calculateMeshCombinedAABB";
import calculateMeshOBB from "../../utils/math/bound/calculateMeshOBB";
import OBB from "../../utils/math/bound/OBB";
import mat4ToEuler from "../../utils/math/matToEuler";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import uuidToUint from "../../utils/uuid/uuidToUint";
import DrawDebuggerMesh from "../drawDebugger/DrawDebuggerMesh";
import MESH_TYPE from "../MESH_TYPE";
import createMeshVertexUniformBuffers from "./core/createMeshVertexUniformBuffers";
import MeshBase from "./core/MeshBase";
import Object3DContainer from "./core/Object3DContainer";
import updateMeshDirtyPipeline from "./core/pipeline/updateMeshDirtyPipeline";
import getBasicMeshVertexBindGroupDescriptor from "./core/shader/getBasicMeshVertexBindGroupDescriptor";

const VERTEX_SHADER_MODULE_NAME_PBR_SKIN = 'VERTEX_MODULE_MESH_PBR_SKIN'
const CONVERT_RADIAN = Math.PI / 180;
const CPI = 3.141592653589793, CPI2 = 6.283185307179586, C225 = 0.225, C127 = 1.27323954, C045 = 0.405284735,
    C157 = 1.5707963267948966;
const tempFloat32_1 = new Float32Array(1);
const up = new Float32Array([0, 1, 0]);

interface Mesh {
    receiveShadow: boolean
    disableJitter: boolean
    meshType: string
    useDisplacementTexture: boolean
}

/**
 * geometry와 material을 바탕으로 3D/2D 객체의 위치, 회전, 스케일, 피벗, 계층 구조, 렌더링, 그림자, 디버깅 등 다양한 기능을 제공하는 기본 메시 클래스입니다.
 *
 * geometry(버텍스/메시 데이터)와 머티리얼을 바탕으로 실제 화면에 렌더링되는 객체를 표현합니다.
 *
 * 위치, 회전, 스케일, 피벗, 계층 구조, 그림자, 디버깅, 이벤트 등 다양한 기능을 지원합니다.
 *
 * <iframe src="/RedGPU/examples/3d/mesh/basicMesh/"></iframe>
 *
 * 아래는 Mesh의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Mesh Hierarchy example](/RedGPU/examples/3d/mesh/hierarchy/)
 * @see [Mesh Pivot example](/RedGPU/examples/3d/mesh/pivot/)
 * @see [Mesh Child Methods example](/RedGPU/examples/3d/mesh/childMethod/)
 * @see [Mesh lookAt Methods example](/RedGPU/examples/3d/mesh/lookAt/)
 *
 * @category Mesh
 */
class Mesh extends MeshBase {
    /** 메시의 디스플레이스먼트 텍스처 */
    displacementTexture: BitmapTexture
    /** 그림자 캐스팅 여부 */
    castShadow: boolean = false
    /** 인스턴스 고유 ID */
    #instanceId: number
    /** 메시 이름 */
    #name: string
    /** 부모 객체 */
    #parent: Object3DContainer
    /** X 좌표 */
    #x: number = 0
    /** Y 좌표 */
    #y: number = 0
    /** Z 좌표 */
    #z: number = 0
    /** 위치 배열 [x, y, z] */
    #positionArray: Float32Array = new Float32Array([0, 0, 0])
    /** 피벗 X */
    #pivotX: number = 0
    /** 피벗 Y */
    #pivotY: number = 0
    /** 피벗 Z */
    #pivotZ: number = 0
    /** 픽킹 ID */
    readonly #pickingId: number
    /** X 스케일 */
    #scaleX: number = 1
    /** Y 스케일 */
    #scaleY: number = 1
    /** Z 스케일 */
    #scaleZ: number = 1
    /** 스케일 배열 [x, y, z] */
    #scaleArray: Float32Array = new Float32Array([1, 1, 1])
    /** X축 회전 (deg) */
    #rotationX: number = 0
    /** Y축 회전 (deg) */
    #rotationY: number = 0
    /** Z축 회전 (deg) */
    #rotationZ: number = 0
    /** 회전 배열 [x, y, z] (deg) */
    #rotationArray: Float32Array = new Float32Array([0, 0, 0])
    /** 이벤트 핸들러 객체 */
    #events: any = {}
    /** 등록된 이벤트 개수 */
    #eventsNum: number = 0
    /** 프러스텀 컬링 무시 여부 */
    #ignoreFrustumCulling: boolean = false
    /** 메시 투명도 */
    #opacity: number = 1
    /** 디버그 메시 객체 */
    #drawDebugger: DrawDebuggerMesh
    /** 디버그 활성화 여부 */
    #enableDebugger: boolean = false
    /** 캐싱된 AABB */
    #cachedBoundingAABB: AABB
    /** 캐싱된 OBB */
    #cachedBoundingOBB: OBB
    /** 이전 프레임의 모델 행렬 */
    #prevModelMatrix: Float32Array
    /** 렌더 번들 인코더 */
    #bundleEncoder: GPURenderBundleEncoder
    /** 렌더 번들 */
    #renderBundle: GPURenderBundle
    /** 이전 시스템 바인드 그룹 */
    #prevSystemBindGroupList: GPUBindGroup[] = []
    /** 이전 프래그먼트 바인드 그룹 */
    #prevFragmentBindGroup: GPUBindGroup
    #drawCommandSlot: DrawCommandSlot | null = null
    #drawBufferManager: DrawBufferManager | null = null
    #needUpdateNormalMatrixUniform: boolean = true
    #needUpdateMatrixUniform: boolean = true

    #uniformDataMatrixList: Float32Array
    #displacementScale: number

    /**
     * Mesh 인스턴스를 생성합니다.
     * @param redGPUContext RedGPU 컨텍스트
     * @param geometry geometry 또는 primitive 객체(선택)
     * @param material 머티리얼(선택)
     * @param name 메시 이름(선택)
     */
    constructor(redGPUContext: RedGPUContext, geometry?: Geometry | Primitive, material?, name?: string) {
        super(redGPUContext)
        if (name) this.name = name
        this._geometry = geometry
        this._material = material
        this.#pickingId = uuidToUint(this.uuid)
        this.#drawBufferManager = DrawBufferManager.getInstance(redGPUContext)
    }

    //
    get enableDebugger(): boolean {
        return this.#enableDebugger;
    }

    set enableDebugger(value: boolean) {
        this.#enableDebugger = value;
        if (value && !this.#drawDebugger) this.#drawDebugger = new DrawDebuggerMesh(this.redGPUContext, this)
    }

    get drawDebugger(): DrawDebuggerMesh {
        return this.#drawDebugger;
    }

    _material
    get material() {
        return this._material;
    }

    set material(value) {
        this._material = value;
        this.dirtyPipeline = true;
        // blendMode 키가 있는 경우 블렌드 모드 재적용
        if ("blendMode" in this) {
            this.blendMode = this.blendMode;
        }
    }

    // 블렌드 모드 설정 함수
    _geometry: Geometry | Primitive
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    set geometry(value: Geometry | Primitive) {
        this._geometry = value;
        this.dirtyPipeline = true
        this.dirtyTransform = true
    }

    get opacity(): number {
        return this.#opacity;
    }

    set opacity(value: number) {
        validatePositiveNumberRange(value, 0, 1)
        this.#opacity = value;
        this.dirtyOpacity = true
    }

    get ignoreFrustumCulling(): boolean {
        return this.#ignoreFrustumCulling;
    }

    set ignoreFrustumCulling(value: boolean) {
        this.#ignoreFrustumCulling = value;
    }

    get pickingId(): number {
        return this.#pickingId;
    }

    get events(): any {
        return this.#events;
    }

    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }

    get vertexStateBuffers(): GPUVertexBufferLayout[] {
        return this._geometry.gpuRenderInfo.buffers
    }

    /**
     * 설정된 부모 객체값을 반환합니다.
     */
    get parent(): Object3DContainer {
        return this.#parent;
    }

    /**
     * 부모 객체를 설정합니다.
     * @param value
     */
    set parent(value: Object3DContainer) {
        this.#parent = value;
    }

    get pivotX(): number {
        return this.#pivotX;
    }

    set pivotX(value: number) {
        this.#pivotX = value;
        this.dirtyTransform = true
    }

    get pivotY(): number {
        return this.#pivotY;
    }

    set pivotY(value: number) {
        this.#pivotY = value;
        this.dirtyTransform = true
    }

    get pivotZ(): number {
        return this.#pivotZ;
    }

    set pivotZ(value: number) {
        this.#pivotZ = value;
        this.dirtyTransform = true
    }

    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = this.#positionArray[0] = value;
        this.dirtyTransform = true
    }

    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = this.#positionArray[1] = value;
        this.dirtyTransform = true
    }

    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.dirtyTransform = true
    }

    get position(): Float32Array {
        return this.#positionArray;
    }

    get scaleX(): number {
        return this.#scaleX;
    }

    set scaleX(value: number) {
        this.#scaleX = this.#scaleArray[0] = value;
        this.dirtyTransform = true
    }

    get scaleY(): number {
        return this.#scaleY;
    }

    set scaleY(value: number) {
        this.#scaleY = this.#scaleArray[1] = value;
        this.dirtyTransform = true
    }

    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.dirtyTransform = true
    }

    get scale(): Float32Array {
        return this.#scaleArray;
    }

    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value % 360
        ;
        this.dirtyTransform = true
    }

    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value % 360;
        this.dirtyTransform = true
    }

    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value % 360;
        this.dirtyTransform = true
    }

    get rotation(): Float32Array {
        return this.#rotationArray;
    }

    get boundingOBB(): OBB {
        if (!this.#cachedBoundingOBB || this.dirtyTransform) {
            this.#cachedBoundingOBB = null
            this.#cachedBoundingAABB = null
            this.#cachedBoundingOBB = calculateMeshOBB(this);
        }
        return this.#cachedBoundingOBB
    }

    get boundingAABB(): AABB {
        if (!this.#cachedBoundingAABB || this.dirtyTransform) {
            this.#cachedBoundingOBB = null
            this.#cachedBoundingAABB = null
            this.#cachedBoundingAABB = calculateMeshAABB(this);
        }
        return this.#cachedBoundingAABB
    }

    get combinedBoundingAABB(): AABB {
        return calculateMeshCombinedAABB(this)
    }

    setEnableDebuggerRecursively(enableDebugger: boolean = false) {
        if ('enableDebugger' in this) {
            this.enableDebugger = enableDebugger
        }
        if (this.children) {
            this.children.forEach(child => {
                child.setEnableDebuggerRecursively(enableDebugger)
            })
        }
    }

    setCastShadowRecursively(castShadow: boolean = false) {
        if ('castShadow' in this) {
            this.castShadow = castShadow
        }
        if (this.children) {
            this.children.forEach(child => {
                child.setCastShadowRecursively(castShadow)
            })
        }
    }

    setReceiveShadowRecursively(receiveShadow: boolean = false) {
        if ('receiveShadow' in this) {
            this.receiveShadow = receiveShadow
        }
        if (this.children) {
            this.children.forEach(child => {
                child.setReceiveShadowRecursively(receiveShadow)
            })
        }
    }

    getCombinedOpacity(): number {
        if (this['is2DMeshType']) {
            const parent = this.parent as { getCombinedOpacity?: () => number } | undefined;
            return this.#opacity * (parent?.getCombinedOpacity ? parent.getCombinedOpacity() : 1);
        }
        return 1
    }

    addListener(eventName: string, callback: Function) {
        this.#events[eventName] = callback
        this.#eventsNum = Object.keys(this.#events).length
    }

    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void {
        var tPosition = [];
        var tRotation = []
        tPosition[0] = targetX;
        tPosition[1] = targetY;
        tPosition[2] = targetZ;
        //out, eye, center, up
        mat4.identity(this.localMatrix);
        mat4.targetTo(this.localMatrix, [this.#x, this.#y, this.#z], tPosition, up);
        tRotation = mat4ToEuler(this.localMatrix, []);
        this.rotationX = -tRotation[0] * 180 / Math.PI;
        this.rotationY = -tRotation[1] * 180 / Math.PI;
        this.rotationZ = -tRotation[2] * 180 / Math.PI;
    }

    setScale(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const scaleArray = this.#scaleArray
        this.#scaleX = scaleArray[0] = x
        this.#scaleY = scaleArray[1] = y
        this.#scaleZ = scaleArray[2] = z
        this.dirtyTransform = true
    }

    setPosition(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const positionArray = this.#positionArray
        this.#x = positionArray[0] = x;
        this.#y = positionArray[1] = y;
        this.#z = positionArray[2] = z;
        this.dirtyTransform = true
    }

    setRotation(rotationX: number, rotationY?: number, rotationZ?: number) {
        rotationY = rotationY ?? rotationX;
        rotationZ = rotationZ ?? rotationX;
        const rotationArray = this.#rotationArray
        this.#rotationX = rotationArray[0] = rotationX
        this.#rotationY = rotationArray[1] = rotationY
        this.#rotationZ = rotationArray[2] = rotationZ
        this.dirtyTransform = true
    }

    /**
     * @experimental
     */
    clone() {
        const cloneMesh = new Mesh(this.redGPUContext, this._geometry, this._material)
        cloneMesh.setPosition(this.#x, this.#y, this.#z)
        cloneMesh.setRotation(this.#rotationX, this.#rotationY, this.#rotationZ)
        cloneMesh.setScale(this.#scaleX, this.#scaleY, this.#scaleZ)
        // cloneMesh.geometry = this._geometry
        // cloneMesh.material = this._material
        //TODO 추가로 먼가 더해야할것 같으디..
        let i = this.children.length;
        while (i--) {
            cloneMesh.addChild(this.children[i].clone());
        }
        return cloneMesh
    }

    render(renderViewStateData: RenderViewStateData) {
        const {redGPUContext,} = this
        const {
            view,
            isScene2DMode,
            frustumPlanes,
            dirtyVertexUniformFromMaterial,
            useDistanceCulling,
            cullingDistanceSquared,
        } = renderViewStateData
        const {antialiasingManager, gpuDevice} = redGPUContext
        const {scene} = view
        const {shadowManager} = scene
        const {directionalShadowManager} = shadowManager
        const {pickingManager} = view
        const {castingList} = directionalShadowManager
        const currentGeometry = this._geometry
        const currentMaterial = this._material
        const {uuid: currentMaterialUUID} = currentMaterial || {}
        let dirtyTransformForChildren
        let dirtyOpacityForChildren
        let currentDirtyPipeline = this.dirtyPipeline
        const {skinInfo} = this.animationInfo
        if (isScene2DMode) {
            this.#z = 0
            this.#pivotZ = 0
            if (this.depthStencilState.depthWriteEnabled) {
                this.depthStencilState.depthWriteEnabled = false
            }
        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true
            this.#needUpdateNormalMatrixUniform = true
            this.#needUpdateMatrixUniform = true
            {
                const {pixelRectObject} = view
                const parent = this.parent
                const tLocalMatrix = this.localMatrix;
                let aX, aY, aZ;
                // tLocalMatrix translate
                tLocalMatrix[12] = this.#x;
                tLocalMatrix[13] = this.#y;
                tLocalMatrix[14] = this.#z;
                tLocalMatrix[15] = 1;
                // tLocalMatrix rotate
                aX = this.#rotationX * CONVERT_RADIAN;
                aY = this.#rotationY * CONVERT_RADIAN;
                aZ = this.#rotationZ * CONVERT_RADIAN;
                /////////////////////////
                let aSx, aSy, aSz, aCx, aCy, aCz;
                let b0, b1, b2, b3;
                let b00, b01, b02, b10, b11, b12, b20, b21, b22;
                // sin,cos 관련
                let a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33;
                let tRadian;
                a00 = 1, a01 = 0, a02 = 0;
                a10 = 0, a11 = 1, a12 = 0;
                a20 = 0, a21 = 0, a22 = 1;
                tRadian = aX % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aSx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = (aX + C157) % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aCx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = aY % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aSy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = (aY + C157) % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aCy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = aZ % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aSz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = (aZ + C157) % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aCz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                /////////////////////////
                b00 = aCy * aCz;
                b01 = aSx * aSy * aCz - aCx * aSz;
                b02 = aCx * aSy * aCz + aSx * aSz;
                b10 = aCy * aSz;
                b11 = aSx * aSy * aSz + aCx * aCz;
                b12 = aCx * aSy * aSz - aSx * aCz;
                b20 = -aSy;
                b21 = aSx * aCy;
                b22 = aCx * aCy;
                // tLocalMatrix scale
                aX = this.#scaleX , aY = this.#scaleY , aZ = this.#scaleZ;
                // @ts-ignore
                if (this.renderTextureWidth) {
                    // @ts-ignore
                    aX *= this.renderTextureWidth
                    // @ts-ignore
                    aY *= this.renderTextureHeight
                }
                tLocalMatrix[0] = (a00 * b00 + a10 * b01 + a20 * b02) * aX;
                tLocalMatrix[1] = (a01 * b00 + a11 * b01 + a21 * b02) * aX;
                tLocalMatrix[2] = (a02 * b00 + a12 * b01 + a22 * b02) * aX;
                tLocalMatrix[3] = tLocalMatrix[3] * aX;
                tLocalMatrix[4] = (a00 * b10 + a10 * b11 + a20 * b12) * aY;
                tLocalMatrix[5] = (a01 * b10 + a11 * b11 + a21 * b12) * aY;
                tLocalMatrix[6] = (a02 * b10 + a12 * b11 + a22 * b12) * aY;
                tLocalMatrix[7] = tLocalMatrix[7] * aY;
                tLocalMatrix[8] = (a00 * b20 + a10 * b21 + a20 * b22) * aZ;
                tLocalMatrix[9] = (a01 * b20 + a11 * b21 + a21 * b22) * aZ;
                tLocalMatrix[10] = (a02 * b20 + a12 * b21 + a22 * b22) * aZ;
                tLocalMatrix[11] = tLocalMatrix[11] * aZ
                {
                    (this.#pivotX || this.#pivotY || this.#pivotZ) ? (
                        // 피봇처리
                        // 매트립스 곱
                        a00 = tLocalMatrix[0], a01 = tLocalMatrix[1], a02 = tLocalMatrix[2], a03 = tLocalMatrix[3],
                            a10 = tLocalMatrix[4], a11 = tLocalMatrix[5], a12 = tLocalMatrix[6], a13 = tLocalMatrix[7],
                            a20 = tLocalMatrix[8], a21 = tLocalMatrix[9], a22 = tLocalMatrix[10], a23 = tLocalMatrix[11],
                            a30 = tLocalMatrix[12], a31 = tLocalMatrix[13], a32 = tLocalMatrix[14], a33 = tLocalMatrix[15],
                            // Cache only the current line of the second matrix
                            b0 = 1, b1 = 0, b2 = 0, b3 = 0,
                            tLocalMatrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
                            tLocalMatrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
                            tLocalMatrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
                            tLocalMatrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
                            b0 = 0, b1 = 1, b2 = 0, b3 = 0,
                            tLocalMatrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
                            tLocalMatrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
                            tLocalMatrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
                            tLocalMatrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
                            b0 = 0, b1 = 0, b2 = 1, b3 = 0,
                            tLocalMatrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
                            tLocalMatrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
                            tLocalMatrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
                            tLocalMatrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
                            (isScene2DMode
                                ? (
                                    parent?.modelMatrix
                                        ? (b0 = -this.#pivotX, b1 = -this.#pivotY, b2 = -this.#pivotZ, b3 = 1)
                                        : (b0 = -this.#pivotX / aX, b1 = -this.#pivotY / aY, b2 = -this.#pivotZ, b3 = 1)
                                )
                                :
                                (b0 = -this.#pivotX, b1 = -this.#pivotY, b2 = -this.#pivotZ, b3 = 1)),
                            tLocalMatrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
                            tLocalMatrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
                            tLocalMatrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
                            tLocalMatrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
                    ) : 0
                }
                {
                    if (parent?.modelMatrix) {
                        // mat4.multiply(this.modelMatrix, parent.modelMatrix, this.localMatrix);
                        const p = parent.modelMatrix
                        const l = this.localMatrix
                        const out = this.modelMatrix
                        const a00 = p[0], a01 = p[1], a02 = p[2], a03 = p[3];
                        const a10 = p[4], a11 = p[5], a12 = p[6], a13 = p[7];
                        const a20 = p[8], a21 = p[9], a22 = p[10], a23 = p[11];
                        const a30 = p[12], a31 = p[13], a32 = p[14], a33 = p[15];
                        // Cache only the current line of the second matrix
                        let b0 = l[0], b1 = l[1], b2 = l[2], b3 = l[3];
                        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                        b0 = l[4], b1 = l[5], b2 = l[6], b3 = l[7];
                        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                        b0 = l[8], b1 = l[9], b2 = l[10], b3 = l[11];
                        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                        b0 = l[12], b1 = l[13], b2 = l[14], b3 = l[15];
                        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                    } else {
                        // this.modelMatrix = mat4.clone(this.localMatrix)
                        const {modelMatrix, localMatrix} = this
                        modelMatrix[0] = localMatrix[0], modelMatrix[1] = localMatrix[1], modelMatrix[2] = localMatrix[2], modelMatrix[3] = localMatrix[3];
                        modelMatrix[4] = localMatrix[4], modelMatrix[5] = localMatrix[5], modelMatrix[6] = localMatrix[6], modelMatrix[7] = localMatrix[7];
                        modelMatrix[8] = localMatrix[8], modelMatrix[9] = localMatrix[9], modelMatrix[10] = localMatrix[10], modelMatrix[11] = localMatrix[11];
                        modelMatrix[12] = localMatrix[12], modelMatrix[13] = localMatrix[13], modelMatrix[14] = localMatrix[14], modelMatrix[15] = localMatrix[15];
                    }
                }
            }
            if (!currentGeometry) this.#needUpdateMatrixUniform = false
            this.dirtyTransform = false
        }
        // check distanceCulling
        let passFrustumCulling = true
        if (useDistanceCulling && currentGeometry) {
            const {rawCamera} = view
            const aabb = this.boundingAABB;
            // AABB 중심점과 카메라 위치 간의 거리 계산
            const dx = rawCamera.x - aabb.centerX;
            const dy = rawCamera.y - aabb.centerY;
            const dz = rawCamera.z - aabb.centerZ;
            // 거리 제곱 계산
            const distanceSquared = dx * dx + dy * dy + dz * dz;
            const geometryRadius = aabb.geometryRadius;
            // AABB의 반지름을 고려한 컬링 거리 계산
            const cullingDistanceWithRadius = cullingDistanceSquared + (geometryRadius * geometryRadius);
            if (distanceSquared > cullingDistanceWithRadius) {
                passFrustumCulling = false;
            }
        }
        // check frustumCulling
        if (frustumPlanes && passFrustumCulling) {
            // if (currentGeometry) {boundingAABB
            const combinedAABB = this.boundingAABB;
            const frustumPlanes0 = frustumPlanes[0];
            const frustumPlanes1 = frustumPlanes[1];
            const frustumPlanes2 = frustumPlanes[2];
            const frustumPlanes3 = frustumPlanes[3];
            const frustumPlanes4 = frustumPlanes[4];
            const frustumPlanes5 = frustumPlanes[5];
            // combinedBoundingAABB의 중심점과 반지름 사용
            const centerX = combinedAABB.centerX;
            const centerY = combinedAABB.centerY;
            const centerZ = combinedAABB.centerZ;
            const radius = combinedAABB.geometryRadius;
            // 각 frustum plane에 대해 거리 계산
            frustumPlanes0[0] * centerX + frustumPlanes0[1] * centerY + frustumPlanes0[2] * centerZ + frustumPlanes0[3] <= -radius ? passFrustumCulling = false
                : frustumPlanes1[0] * centerX + frustumPlanes1[1] * centerY + frustumPlanes1[2] * centerZ + frustumPlanes1[3] <= -radius ? passFrustumCulling = false
                    : frustumPlanes2[0] * centerX + frustumPlanes2[1] * centerY + frustumPlanes2[2] * centerZ + frustumPlanes2[3] <= -radius ? passFrustumCulling = false
                        : frustumPlanes3[0] * centerX + frustumPlanes3[1] * centerY + frustumPlanes3[2] * centerZ + frustumPlanes3[3] <= -radius ? passFrustumCulling = false
                            : frustumPlanes4[0] * centerX + frustumPlanes4[1] * centerY + frustumPlanes4[2] * centerZ + frustumPlanes4[3] <= -radius ? passFrustumCulling = false
                                : frustumPlanes5[0] * centerX + frustumPlanes5[1] * centerY + frustumPlanes5[2] * centerZ + frustumPlanes5[3] <= -radius ? passFrustumCulling = false : 0;
            // } else {
            // 	passFrustumCulling = false
            // }
        }
        if (this.#ignoreFrustumCulling) passFrustumCulling = true
        if (passFrustumCulling) {
            if (this.gltfLoaderInfo?.activeAnimations?.length) {
                renderViewStateData.animationList[renderViewStateData.animationList.length] = this.gltfLoaderInfo?.activeAnimations
            }
            if (skinInfo) {
                if (!this.currentShaderModuleName.includes(VERTEX_SHADER_MODULE_NAME_PBR_SKIN)) {
                    currentDirtyPipeline = true
                }
                if (this.currentShaderModuleName === `${VERTEX_SHADER_MODULE_NAME_PBR_SKIN}_${skinInfo.joints?.length}`) {
                    renderViewStateData.skinList[renderViewStateData.skinList.length] = this
                    dirtyTransformForChildren = false
                }
            }
        }
        // render
        const {displacementTexture, displacementScale} = currentMaterial || {}
        if (currentDirtyPipeline || currentMaterial?.dirtyPipeline || dirtyVertexUniformFromMaterial[currentMaterialUUID]) {
            dirtyVertexUniformFromMaterial[currentMaterialUUID] = true
        }
        // keepLog(this.gpuRenderInfo?.vertexStructInfo)
        if (currentGeometry) {
            renderViewStateData.num3DObjects++
            if (antialiasingManager.changedMSAA) {
                currentDirtyPipeline = true
            }
            if (!this.gpuRenderInfo) this.initGPURenderInfos()
            const currentUseDisplacementTexture = !!displacementTexture
            if (this.useDisplacementTexture !== currentUseDisplacementTexture) {
                this.useDisplacementTexture = currentUseDisplacementTexture
                currentDirtyPipeline = true
            }

            if (currentDirtyPipeline || dirtyVertexUniformFromMaterial[currentMaterialUUID]) {
                updateMeshDirtyPipeline(this, renderViewStateData)
                this.#bundleEncoder = null
                this.#renderBundle = null
            }
        } else {
            renderViewStateData.num3DGroups++
        }
        {
            if (antialiasingManager.useTAA && this.#uniformDataMatrixList) {

                const {gpuRenderInfo} = this
                const {vertexUniformBuffer, vertexUniformInfo} = gpuRenderInfo
                const {members: vertexUniformInfoMembers} = vertexUniformInfo
                const {members: vertexUniformInfoMatrixListMembers} = vertexUniformInfoMembers.matrixList
                if (this.#prevModelMatrix && vertexUniformInfoMatrixListMembers.prevModelMatrix) {
                    this.#uniformDataMatrixList.set(this.#prevModelMatrix, vertexUniformInfoMatrixListMembers.prevModelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                    // if (vertexUniformInfoMatrixListMembers.prevModelMatrix) {
                    // 	redGPUContext.gpuDevice.queue.writeBuffer(
                    // 		vertexUniformGPUBuffer,
                    // 		vertexUniformInfoMatrixListMembers.prevModelMatrix.uniformOffset,
                    // 		this.#prevModelMatrix,
                    // 	)
                    // }
                }
                {
                    if (!this.#prevModelMatrix) this.#prevModelMatrix = new Float32Array(16)
                    const prev = this.#prevModelMatrix
                    const current = this.modelMatrix
                    prev[0] = current[0], prev[1] = current[1], prev[2] = current[2], prev[3] = current[3];
                    prev[4] = current[4], prev[5] = current[5], prev[6] = current[6], prev[7] = current[7];
                    prev[8] = current[8], prev[9] = current[9], prev[10] = current[10], prev[11] = current[11];
                    prev[12] = current[12], prev[13] = current[13], prev[14] = current[14], prev[15] = current[15];
                }
                if (!this.#needUpdateMatrixUniform && vertexUniformInfoMatrixListMembers.prevModelMatrix) {
                    // keepLog('도냐')
                    redGPUContext.gpuDevice.queue.writeBuffer(
                        vertexUniformBuffer.gpuBuffer,
                        vertexUniformInfoMatrixListMembers.prevModelMatrix.uniformOffset,
                        this.#prevModelMatrix,
                    )
                }
            } else {
                this.#prevModelMatrix = null
            }
        }
        if (currentGeometry && passFrustumCulling) {
            const {gpuRenderInfo} = this
            const {vertexUniformBuffer, vertexUniformInfo} = gpuRenderInfo
            const {members: vertexUniformInfoMembers} = vertexUniformInfo
            const {members: vertexUniformInfoMatrixListMembers} = vertexUniformInfoMembers.matrixList
            const {gpuBuffer: vertexUniformGPUBuffer} = vertexUniformBuffer
            if (!this.#uniformDataMatrixList) {

                this.#uniformDataMatrixList = new Float32Array(vertexUniformInfoMembers.matrixList.endOffset / Float32Array.BYTES_PER_ELEMENT)
            }
            {
                if (vertexUniformInfoMembers.displacementScale !== undefined &&
                    this.#displacementScale !== displacementScale
                ) {
                    this.#displacementScale = displacementScale
                    // keepLog('실행을 하나보네',displacementScale)
                    tempFloat32_1[0] = displacementScale
                    gpuDevice.queue.writeBuffer(
                        vertexUniformGPUBuffer,
                        vertexUniformInfoMembers.displacementScale.uniformOffset,
                        // new vertexUniformInfoMembers.displacementScale.View([displacementScale])
                        tempFloat32_1
                    );
                }
            }

            if (this.#needUpdateMatrixUniform) {
                {
                    const modelMatrix = (
                        //TODO - Sprite2D떄문에 처리했지만 이거 일반화해야함
                        // TODO - renderTextureWidth 이놈도 같이 처리해야할듯
                        // @ts-ignore
                        this.is2DMeshType ? mat4.multiply(
                            mat4.create(),
                            this.modelMatrix,
                            mat4.fromValues(
                                // @ts-ignore
                                this.width, 0, 0, 0, 0, this.height, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                            ),
                        ) : this.modelMatrix
                    )
                    //
                    // gpuDevice.queue.writeBuffer(
                    // 	vertexUniformGPUBuffer,
                    // 	vertexUniformInfoMatrixListMembers.modelMatrix.uniformOffset,
                    // 	modelMatrix
                    // )
                    this.#uniformDataMatrixList.set(modelMatrix, vertexUniformInfoMatrixListMembers.modelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)

                }


                {
                    if (this.#needUpdateNormalMatrixUniform && vertexUniformInfoMatrixListMembers.normalModelMatrix) {
                        this.#needUpdateNormalMatrixUniform = false
                        // calculate NormalMatrix
                        const m = this.modelMatrix;
                        const n = this.normalModelMatrix;
                        const a00 = m[0], a01 = m[1], a02 = m[2];
                        const a10 = m[4], a11 = m[5], a12 = m[6];
                        const a20 = m[8], a21 = m[9], a22 = m[10];
                        const det = a00 * (a11 * a22 - a12 * a21) - a01 * (a10 * a22 - a12 * a20) + a02 * (a10 * a21 - a11 * a20);
                        if (det === 0) {
                            // 역행렬 없음 → 단위 행렬로 대체
                            n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1;
                        } else {
                            const invDet = 1 / det;
                            // 역행렬의 전치 (transpose of inverse)
                            n[0] = (a11 * a22 - a12 * a21) * invDet;
                            n[1] = (a12 * a20 - a10 * a22) * invDet;
                            n[2] = (a10 * a21 - a11 * a20) * invDet;
                            n[3] = 0;
                            n[4] = (a02 * a21 - a01 * a22) * invDet;
                            n[5] = (a00 * a22 - a02 * a20) * invDet;
                            n[6] = (a01 * a20 - a00 * a21) * invDet;
                            n[7] = 0;
                            n[8] = (a01 * a12 - a02 * a11) * invDet;
                            n[9] = (a02 * a10 - a00 * a12) * invDet;
                            n[10] = (a00 * a11 - a01 * a10) * invDet;
                            n[11] = 0;
                            // 하단 행은 단위 행렬처럼 설정
                            n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1;
                        }
                    }
                    // gpuDevice.queue.writeBuffer(
                    // 	vertexUniformGPUBuffer,
                    // 	vertexUniformInfoMatrixListMembers.normalModelMatrix.uniformOffset,
                    // 	// new vertexUniformInfoMatrixListMembers.normalModelMatrix.View(this.normalModelMatrix),
                    // 	this.normalModelMatrix as Float32Array
                    // )
                    this.#uniformDataMatrixList.set(this.normalModelMatrix, vertexUniformInfoMatrixListMembers.normalModelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)

                }
                if (vertexUniformInfoMatrixListMembers.localMatrix) {
                    // gpuDevice.queue.writeBuffer(
                    // 	vertexUniformGPUBuffer,
                    // 	vertexUniformInfoMatrixListMembers.localMatrix.uniformOffset,
                    // 	// new vertexUniformInfoMatrixListMembers.localMatrix.View(this.localMatrix),
                    // 	this.localMatrix as Float32Array
                    // )
                    this.#uniformDataMatrixList.set(this.localMatrix, vertexUniformInfoMatrixListMembers.localMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)

                }
                dirtyTransformForChildren = true
                this.#needUpdateMatrixUniform = false
                // keepLog('진짜 버퍼업로드', this.name)
                gpuDevice.queue.writeBuffer(
                    vertexUniformGPUBuffer,
                    vertexUniformInfoMembers.matrixList.startOffset,
                    this.#uniformDataMatrixList
                )
            }
            if (this.dirtyOpacity) {
                dirtyOpacityForChildren = true
                if (vertexUniformInfoMembers.combinedOpacity) {
                    tempFloat32_1[0] = this.getCombinedOpacity()
                    gpuDevice.queue.writeBuffer(
                        vertexUniformGPUBuffer,
                        vertexUniformInfoMembers.combinedOpacity.uniformOffset,
                        // new vertexUniformInfoMembers.combinedOpacity.View([this.getCombinedOpacity()])
                        tempFloat32_1
                    );
                }
                this.dirtyOpacity = false
            }
            const {
                bundleListRender2PathLayer,
                bundleListParticleLayer,
                bundleListTransparentLayer,
                bundleListAlphaLayer,
                bundleListBasicList
            } = renderViewStateData
            {
                {
                    const {fragmentUniformBindGroup} = currentMaterial.gpuRenderInfo
                    if (
                        !this.#bundleEncoder
                        || currentDirtyPipeline
                        || this.#prevFragmentBindGroup !== fragmentUniformBindGroup
                        || this.#prevSystemBindGroupList[renderViewStateData.viewIndex] !== view.systemUniform_Vertex_UniformBindGroup
                    ) {
                        this.#setDrawBuffer()
                        this.#setRenderBundle(renderViewStateData)
                    }
                    renderViewStateData.numDrawCalls++
                    if (currentGeometry.indexBuffer) {
                        const {indexBuffer} = currentGeometry
                        const {indexCount, triangleCount} = indexBuffer
                        renderViewStateData.numTriangles += triangleCount
                        renderViewStateData.numPoints += indexCount
                    } else {
                        const {vertexBuffer} = currentGeometry
                        const {vertexCount, triangleCount} = vertexBuffer
                        renderViewStateData.numTriangles += triangleCount;
                        renderViewStateData.numPoints += vertexCount
                    }
                    const renderBundle = this.#renderBundle
                    if (currentMaterial.use2PathRender) {
                        bundleListRender2PathLayer[bundleListRender2PathLayer.length] = renderBundle
                    } else if (this.meshType === MESH_TYPE.PARTICLE) {
                        bundleListParticleLayer[bundleListParticleLayer.length] = renderBundle
                    } else if (currentMaterial.transparent) {
                        bundleListTransparentLayer[bundleListTransparentLayer.length] = renderBundle
                        // @ts-ignore
                        renderBundle.mesh = this
                    } else if (currentMaterial.alphaBlend === 2 || currentMaterial.opacity < 1 || !this.depthStencilState.depthWriteEnabled) {
                        bundleListAlphaLayer[bundleListAlphaLayer.length] = renderBundle
                    } else {
                        bundleListBasicList[bundleListBasicList.length] = renderBundle
                    }
                }
            }
            {
                if (this.#eventsNum) {
                    pickingManager.castingList[pickingManager.castingList.length] = this
                }
            }
        } else {
        }
        {
            if (this.castShadow || (this.castShadow && !currentGeometry)) castingList[castingList.length] = this
            if (this.#enableDebugger) this.#drawDebugger.render(renderViewStateData)
        }
        // children render
        const {children} = this
        let i = 0
        const childNum = children.length
        // while (i--) {
        this.dirtyTransform = false
        for (; i < childNum; i++) {
            const child = children[i]
            if (dirtyTransformForChildren) child.dirtyTransform = dirtyTransformForChildren
            if (dirtyOpacityForChildren) child.dirtyOpacity = dirtyOpacityForChildren
            child.render(renderViewStateData)
        }
    }

    initGPURenderInfos() {
        this.gpuRenderInfo = new VertexGPURenderInfo(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        )
        updateMeshDirtyPipeline(this)
    }

    createMeshVertexShaderModuleBASIC = (VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT_BASIC, vertexModuleSource): GPUShaderModule => {
        const {redGPUContext} = this
        const {gpuRenderInfo} = this
        if (gpuRenderInfo.vertexUniformInfo !== UNIFORM_STRUCT_BASIC) {
            gpuRenderInfo.vertexUniformInfo = UNIFORM_STRUCT_BASIC
            gpuRenderInfo.vertexStructInfo = SHADER_INFO
            createMeshVertexUniformBuffers(this)
        }
        gpuRenderInfo.vertexShaderSourceVariant = SHADER_INFO.shaderSourceVariant
        gpuRenderInfo.vertexShaderVariantConditionalBlocks = SHADER_INFO.conditionalBlocks
        gpuRenderInfo.vertexUniformBindGroup = redGPUContext.gpuDevice.createBindGroup(getBasicMeshVertexBindGroupDescriptor(this));
        this.#checkVariant(VERTEX_SHADER_MODULE_NAME)
        return this.gpuRenderInfo.vertexShaderModule
    }

    #setRenderBundle(renderViewStateData: RenderViewStateData) {
        const {redGPUContext, geometry} = this
        const {gpuDevice, antialiasingManager} = redGPUContext
        const {useMSAA} = antialiasingManager
        const {view} = renderViewStateData
        const {pipeline, vertexUniformBindGroup} = this.gpuRenderInfo
        const {vertexBuffer, indexBuffer} = this._geometry
        const {fragmentUniformBindGroup} = this._material.gpuRenderInfo
        // keepLog(`🎬 렌더 번들 갱신 이유: ${this.name}`, {
        // 	noBundleEncoder: !this.#bundleEncoder,
        // 	dirtyPipeline: currentDirtyPipeline,
        // 	fragmentBindGroupChanged: this.#prevFragmentBindGroup !== fragmentUniformBindGroup,
        // 	systemBindGroupChanged: this.#prevSystemBindGroup !== view.systemUniform_Vertex_UniformBindGroup
        // })
        this.#bundleEncoder = null
        this.#bundleEncoder = gpuDevice.createRenderBundleEncoder({
            ...view.basicRenderBundleEncoderDescriptor,
            label: this.uuid
        })
        const bundleEncoder = this.#bundleEncoder
        {
            const {gpuBuffer} = vertexBuffer
            this.#prevSystemBindGroupList[renderViewStateData.viewIndex] = view.systemUniform_Vertex_UniformBindGroup
            this.#prevFragmentBindGroup = fragmentUniformBindGroup
            bundleEncoder.setPipeline(pipeline)
            bundleEncoder.setVertexBuffer(0, gpuBuffer)
            // @ts-ignore
            if (this.particleBuffers?.length) {
                // @ts-ignore
                this.particleBuffers.forEach((v, index) => {
                    bundleEncoder.setVertexBuffer(index + 1, v)
                })
            }
            bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
            bundleEncoder.setBindGroup(1, vertexUniformBindGroup);
            bundleEncoder.setBindGroup(2, fragmentUniformBindGroup)
            //
            if (indexBuffer) {
                const {indexBuffer} = geometry
                const {gpuBuffer: indexGPUBuffer, format} = indexBuffer
                bundleEncoder.setIndexBuffer(indexGPUBuffer, format)
                bundleEncoder.drawIndexedIndirect(this.#drawCommandSlot.buffer, this.#drawCommandSlot.commandOffset * 4)
                // {
                //     keepLog(`🎬 drawIndexedIndirect 호출: ${this.name}`, {
                //         bufferLabel: this.#drawCommandSlot.buffer.label,
                //         byteOffset: this.#drawCommandSlot.commandOffset * 4,
                //         expectedIndexCount: indexCount
                //     })
                // }
            } else {
                bundleEncoder.drawIndirect(this.#drawCommandSlot.buffer, this.#drawCommandSlot.commandOffset * 4)
            }
            this.#renderBundle = (bundleEncoder as GPURenderBundleEncoder).finish();
            // @ts-ignore
            this.#renderBundle.mesh = null
        }
        // keepLog('렌더번들갱신', this.name)
    }

    #setDrawBuffer() {
        const {geometry} = this
        const {vertexBuffer, indexBuffer} = geometry
        const drawBufferManager = this.#drawBufferManager
        if (!this.#drawCommandSlot) {
            this.#drawCommandSlot = drawBufferManager.allocateDrawCommand(this.name)
        }
        if (indexBuffer) {
            const {indexCount} = indexBuffer
            // @ts-ignore
            if (this.particleBuffers) {
                // @ts-ignore
                drawBufferManager.setIndexedIndirectCommand(this.#drawCommandSlot, indexCount, this.particleNum, 0, 0, 0)
            } else {
                drawBufferManager.setIndexedIndirectCommand(this.#drawCommandSlot, indexCount, 1, 0, 0, 0)
                // {
                //     const data = this.#drawCommandSlot.dataArray
                //     const offset = this.#drawCommandSlot.commandOffset
                //     keepLog(`📊 드로우 데이터 설정: ${this.name}`, {
                //         indexCount,
                //         actualData: [data[offset], data[offset + 1], data[offset + 2], data[offset + 3], data[offset + 4]]
                //     })
                // }
            }
            drawBufferManager.updateSingleCommand(this.#drawCommandSlot)
        } else {
            const {vertexCount} = vertexBuffer
            drawBufferManager.setIndirectCommand(this.#drawCommandSlot, vertexCount, 1, 0, 0)
            drawBufferManager.updateSingleCommand(this.#drawCommandSlot)
        }
    }

    #checkVariant(moduleName: String) {
        const {gpuDevice, resourceManager} = this.redGPUContext
        // 현재 머티리얼 상태에 맞는 바리안트 키 찾기
        const currentVariantKey = this.#findMatchingVariantKey();
        // 바리안트별 셰이더 모듈 확인/생성
        const variantShaderModuleName = `${moduleName}_${currentVariantKey}`;
        let targetShaderModule = resourceManager.getGPUShaderModule(variantShaderModuleName);
        if (!targetShaderModule) {
            // 레이지 바리안트 생성기에서 바리안트 소스 코드 가져오기
            let variantSource = this.gpuRenderInfo.vertexShaderSourceVariant.getVariant(currentVariantKey);
            if (variantSource) {
                // keepLog('버텍스 바리안트 셰이더 모듈 생성:', currentVariantKey, variantShaderModuleName);
                if (this.animationInfo?.skinInfo) {
                    const jointNum = `${this.animationInfo.skinInfo.joints.length}`
                    variantSource = variantSource.replaceAll('#JOINT_NUM', jointNum)
                    this.gpuRenderInfo.vertexShaderSourceVariant.getVariant(currentVariantKey)
                    targetShaderModule = resourceManager.createGPUShaderModule(
                        `${variantShaderModuleName}_${jointNum}`,
                        {code: variantSource}
                    );
                } else {
                    targetShaderModule = resourceManager.createGPUShaderModule(
                        variantShaderModuleName,
                        {code: variantSource}
                    );
                }
            } else {
                console.warn('⚠️ 버텍스 바리안트 소스를 찾을 수 없음:', currentVariantKey);
                targetShaderModule = this.gpuRenderInfo.vertexShaderModule; // 기본값 사용
            }
        } else {
            console.log('🚀 버텍스 바리안트 셰이더 모듈 캐시 히트:', currentVariantKey);
        }
        // 셰이더 모듈 업데이트
        this.gpuRenderInfo.vertexShaderModule = targetShaderModule;
    }

    #findMatchingVariantKey(): string {
        const {vertexShaderVariantConditionalBlocks} = this.gpuRenderInfo;
        // keepLog(this.gpuRenderInfo, vertexShaderVariantConditionalBlocks)
        // 현재 활성화된 기능들 확인 (vertexShaderVariantConditionalBlocks 기반)
        const activeFeatures = new Set<string>();
        // keepLog('vertexShaderVariantConditionalBlocks', vertexShaderVariantConditionalBlocks, this)
        // 실제 셰이더에서 발견된 조건부 블록들만 체크
        for (const uniformName of vertexShaderVariantConditionalBlocks) {
            if (this[uniformName]) {
                activeFeatures.add(uniformName);
            }
        }
        console.log('activeFeatures', activeFeatures, this);
        // 활성화된 기능들로부터 바리안트 키 생성
        const variantKey = activeFeatures.size > 0 ?
            Array.from(activeFeatures).sort().join('+') : 'none';
        if (activeFeatures.size) {
            console.log('선택된 바리안트:', variantKey, '(활성 기능:', Array.from(activeFeatures), ')');
        }
        return variantKey;
    }
}

Object.defineProperty(Mesh.prototype, 'meshType', {
    value: MESH_TYPE.MESH,
    writable: false
});
DefineForVertex.defineByPreset(Mesh, [
    DefineForVertex.PRESET_BOOLEAN.RECEIVE_SHADOW
])
DefineForVertex.defineBoolean(Mesh, [
    ['useDisplacementTexture', false],
    ['disableJitter', false],
])
Object.freeze(Mesh)
export default Mesh
