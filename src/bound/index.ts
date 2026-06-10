/**
 * [KO] AABB, OBB 등 객체의 경계 영역(Bounding Box)을 계산하고 관리하는 클래스와 유틸리티 함수들을 제공합니다.
 * [EN] Provides classes and utility functions to calculate and manage bounding volumes of objects, such as AABB and OBB.
 * @packageDocumentation
 */
import AABB from "./AABB";
import calculateGeometryAABB from "./math/calculateGeometryAABB";
import calculateMeshAABB from "./math/calculateMeshAABB";
import calculateMeshCombinedAABB from "./math/calculateMeshCombinedAABB";
import calculateMeshOBB from "./math/calculateMeshOBB";
import OBB from "./OBB";

export {
    AABB,
    calculateGeometryAABB,
    calculateMeshAABB,
    calculateMeshCombinedAABB,
    calculateMeshOBB,
    OBB
}