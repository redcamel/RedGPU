/**
 * `defineTexture` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 */
export interface DefineTextureInfo {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
}
/**
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 일반 텍스처(Texture) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter/setter는 {@link BitmapTexture}, {@link ANoiseTexture}, {@link HDRTexture} 인스턴스를 처리합니다.
 * - 텍스처가 설정되면 자동으로 바인드 그룹을 업데이트하기 위해 대상 인스턴스의 `updateTexture(prevTexture, texture)` 메서드가 호출됩니다.
 * - 만약 대상 인스턴스에 `use{Key}` 패턴의 속성(예: `useDiffuseTexture` 등)이 존재할 경우, 해당 텍스처의 유무에 맞춰 불리언 값 및 GPU 유니폼 버퍼에 1/0 상태를 동기화합니다.
 *
 * **[EN]**
 * - Handles {@link BitmapTexture}, {@link ANoiseTexture}, and {@link HDRTexture} instances.
 * - When a texture is set, it invokes `updateTexture(prevTexture, texture)` on the target instance to update bind groups.
 * - If a corresponding `use{Key}` property (e.g. `useDiffuseTexture`) exists on the target, it automatically synchronizes its boolean state and GPU globalStruct value (1 or 0) based on texture presence.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link DefineTextureInfo} 설정 또는 그 배열 [EN] A single {@link DefineTextureInfo} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineTexture(MyMaterial, { key: 'diffuseTexture' });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineTexture(MyMaterial, [
 *   { key: 'diffuseTexture' },
 *   { key: 'normalTexture' },
 *   { key: 'displacementTexture' }
 * ]);
 * ```
 */
declare const defineTexture: (target: any, defineInfo: DefineTextureInfo | DefineTextureInfo[]) => void;
export default defineTexture;
