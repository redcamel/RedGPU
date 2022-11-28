const throwError = function () {
	console.log('------ throwError! ------')
	throw new Error(Array.prototype.slice.call(arguments).join(' '))
}
export default throwError