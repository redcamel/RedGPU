/**
 * 주어진 값이 RedGPUContext 인스턴스인지 검증합니다.
 *
 * 값의 constructor.name이 'RedGPUContext'인지 확인하며,
 *
 * 그렇지 않으면 에러 메시지를 출력하고 예외를 발생시킵니다.
 *
 * @param value 검증할 값
 * @returns {boolean} RedGPUContext 인스턴스이면 true, 아니면 false
 */
declare const validateRedGPUContext: (value: any) => boolean;
export default validateRedGPUContext;
