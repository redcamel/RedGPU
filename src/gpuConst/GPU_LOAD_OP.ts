/**
 * [KO] 렌더 패스 시작 시 어태치먼트를 로드하는 방식을 정의하는 상수군입니다.
 * [EN] Constants defining how to load attachments at the start of a render pass.
 *
 * [KO] 새로운 렌더링 작업을 시작하기 전 기존 데이터를 어떻게 처리할지 결정합니다.
 * [EN] Determines how to handle existing data before starting a new rendering task.
 * 
 * @category Constants
 */
const GPU_LOAD_OP = {
	/**
	 * [KO] 기존 어태치먼트의 내용을 로드하여 유지합니다.
	 * [EN] Loads and maintains the contents of the existing attachment.
	 */
	LOAD: 'load',
	/**
	 * [KO] 어태치먼트를 지정된 색상 혹은 값으로 초기화(지움)합니다.
	 * [EN] Initializes (clears) the attachment with a specified color or value.
	 */
	CLEAR: 'clear',
} as const;
Object.freeze(GPU_LOAD_OP);
export default GPU_LOAD_OP;