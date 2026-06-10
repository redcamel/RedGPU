import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
/**
 * [KO] 프리미티브 생성을 위한 공통 수학 및 데이터 처리 유틸리티 클래스입니다.
 * [EN] Utility class for common math and data processing for primitive generation.
 *
 * @category Core
 */
declare class PrimitiveUtils {
    #private;
    static finalize(redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string): Geometry;
    static generateGrid(interleaveData: number[], indexData: number[], resolutionX: number, resolutionY: number, vertexCallback: (u: number, v: number, ix: number, iy: number) => void, skipIndices?: boolean, reverseIndices?: boolean): void;
    static getEmptyGeometry(redGPUContext: RedGPUContext, uniqueKey: string): Geometry;
    static generateBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, uniqueKey: string): Geometry;
    static generateRoundedBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, radius: number, radiusSegments: number, uniqueKey: string): Geometry;
    static generatePlaneData(interleaveData: number[], indexData: number[], width: number, height: number, mainSegmentsX: number, mainSegmentsY: number, center: any, uV: any, vV: any, normal: any, radius?: number, radiusSegments?: number, boxDim?: any, flipY?: boolean): void;
    static generateSphereData(redGPUContext: RedGPUContext, radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry;
    static generateCylinderData(redGPUContext: RedGPUContext, radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, capTop: boolean, capBottom: boolean, thetaStart: number, thetaLength: number, isRadialTop: boolean, isRadialBottom: boolean, uniqueKey: string): Geometry;
    static generateConeData(redGPUContext: RedGPUContext, radius: number, height: number, radialSegments: number, heightSegments: number, capBottom: boolean, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry;
    static generatePlaneEntryData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry;
    static generateGroundData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry;
    static generateCircleEntryData(redGPUContext: RedGPUContext, radius: number, radialSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry;
    static generateRingEntryData(redGPUContext: RedGPUContext, innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry;
    static generateTorusData(redGPUContext: RedGPUContext, radius: number, thickness: number, radialSegments: number, tubularSegments: number, thetaStart: number, thetaLength: number, capStart: boolean, capEnd: boolean, isRadialCapStart: boolean, isRadialCapEnd: boolean, uniqueKey: string): Geometry;
    static generateTorusKnotData(redGPUContext: RedGPUContext, radius: number, tubeRadius: number, tubularSegments: number, radialSegments: number, windingsAroundAxis: number, windingsAroundCircle: number, uniqueKey: string): Geometry;
    static generateRingData(interleaveData: number[], indexData: number[], innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, center: {
        x: number;
        y: number;
        z: number;
    }, uV: {
        x: number;
        y: number;
        z: number;
    }, vV: {
        x: number;
        y: number;
        z: number;
    }, normal: {
        x: number;
        y: number;
        z: number;
    }, isFront?: boolean, isRadial?: boolean, uvVStart?: number, uvVEnd?: number): void;
    static generateSphericalData(interleaveData: number[], indexData: number[], radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, yOffset?: number, uvVStart?: number, uvVEnd?: number): void;
    static generateCylinderTorsoData(interleaveData: number[], indexData: number[], radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, thetaStart: number, thetaLength: number, center: {
        x: number;
        y: number;
        z: number;
    }, uV: {
        x: number;
        y: number;
        z: number;
    }, vV: {
        x: number;
        y: number;
        z: number;
    }, axisVector?: {
        x: number;
        y: number;
        z: number;
    }, skipIndices?: boolean, uvVStart?: number, uvVEnd?: number): void;
    static generateCapsuleData(redGPUContext: RedGPUContext, radius: number, height: number, radialSegments: number, heightSegments: number, capSegments: number, uniqueKey: string): Geometry;
    static generateGridIndices(indexData: number[], vertexOffset: number, gridX: number, gridY: number, gridX1: number, reverse?: boolean): void;
    static calculateTangents(interleaveData: number[], indexData: number[]): void;
    static interleavePacker(interleaveData: number[], px: number, py: number, pz: number, nx: number, ny: number, nz: number, u: number, v: number, tx?: number, ty?: number, tz?: number, tw?: number): void;
}
export default PrimitiveUtils;
