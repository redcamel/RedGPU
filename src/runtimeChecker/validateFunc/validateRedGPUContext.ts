import consoleAndThrowError from "../../utils/consoleAndThrowError";

const validateRedGPUContext = (value: any) => {
	if (!(value?.constructor?.name === 'RedGPUContext')) {
		const errorMsg = `from ${value?.constructor?.name} : requires a RedGPUContext instance, but received : ${value}`
		console.log('------ msg ------')
		console.log('but received : ', value)
		consoleAndThrowError(errorMsg)
		return false
	}
	return true
}
export default validateRedGPUContext
