/**
 * [KO] 메시 타입을 정의하는 상수입니다.
 * [EN] Constants defining mesh types.
 * @category Constant
 */
const MESH_TYPE = {
    MESH: 'mesh',
    PARTICLE: 'particle',
    INSTANCED_MESH: 'instancedMesh',
} as const
Object.freeze(MESH_TYPE)
export default MESH_TYPE
