import ASinglePassPostEffect from "./ASinglePassPostEffect";
import { IPostEffectSourceConfig } from "./types";
/**
 * [KO] 기본 후처리 이펙트용 WGSL 코드를 생성하는 고수준 헬퍼 함수입니다.
 * [EN] High-level helper function to generate WGSL code for basic post-processing effects.
 *
 * [KO] 이 함수는 반복적인 보일러플레이트 코드를 자동화하며 다음 기능을 수행합니다:
 * 1. MSAA/Non-MSAA 대응 소스 자동 분기 생성.
 * 2. 입력 소스 텍스처(Group 0) 바인딩 자동화.
 * 3. 이펙트 전용 유니폼(Group 1) 및 시스템 공용 리소스(Group 2: G-Buffer, Depth 등) 자동 포함.
 * 4. 출력용 스토리지 텍스처(Group 3) 정의.
 * 5. 클래스에 정의된 워크그룹 사이즈 반영.
 *
 * [EN] This function automates repetitive boilerplate code and performs the following:
 * 1. Automatically generates separate code for MSAA and Non-MSAA.
 * 2. Automates binding of input source textures (Group 0).
 * 3. Automatically includes effect-specific uniforms (Group 1) and system common resources (Group 2: G-Buffer, Depth, etc.).
 * 4. Defines the storage texture for output (Group 3).
 * 5. Reflects the workgroup size defined in the class.
 *
 * @param effect - [KO] ASinglePassPostEffect를 상속받은 이펙트 인스턴스 [EN] Effect instance inheriting ASinglePassPostEffect
 * @param code - [KO] main 함수 내부에 삽입될 WGSL 로직 [EN] WGSL logic to be inserted inside the main function
 * @param uniformStruct - [KO] (선택) 이펙트에서 사용할 Uniforms 구조체 정의 [EN] (Optional) Uniforms struct definition for the effect
 * @param sourceTextureConfigs - [KO] (선택) 입력 소스들에 대한 설정 (기본값: {name: 'sourceTexture'}) [EN] (Optional) Configurations for input sources (Default: {name: 'sourceTexture'})
 * @returns [KO] MSAA와 Non-MSAA용으로 각각 생성된 WGSL 코드 객체 [EN] WGSL code objects generated for MSAA and Non-MSAA respectively
 */
declare const createBasicPostEffectCode: (effect: ASinglePassPostEffect, code: string, uniformStruct?: string, sourceTextureConfigs?: IPostEffectSourceConfig | IPostEffectSourceConfig[]) => {
    msaa: string;
    nonMsaa: string;
};
export default createBasicPostEffectCode;
