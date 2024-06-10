import Controller from "dat.gui/src/dat/controllers/Controller.js";

const gui_setItemDisableInput = (controller: Controller, width?, fontSize?) => {
	const rightModeYn = width === 'auto'
	console.log(controller)
	const {domElement, __input, __li} = controller
	controller.listen()
	domElement.parentNode.style.cssText = 'display:flex;justify-content: space-between;'
	domElement.parentNode.querySelector('span').style.cssText = `max-width:100%;width:auto;${rightModeYn ? 'overflow:initial;text-overflow:initial;' : ''}`
	domElement.style.width = rightModeYn ? '100%' : (width || '40px')
	__li.style.color = '#888'
	if (__input) {
		__input.disabled = true
		__input.style.background = 'transparent'
		__input.style.opacity = 0.75
		__input.style.fontSize = fontSize || '10px'
		__input.style.textAlign = 'right'
	}
	return controller
}
export default gui_setItemDisableInput
