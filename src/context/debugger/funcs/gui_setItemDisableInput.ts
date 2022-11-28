import Controller from "dat.gui/src/dat/controllers/Controller.js";

const gui_setItemDisableInput = (controller: Controller, width?) => {
    const {domElement, __input, __li} = controller
    controller.listen()
    domElement.parentNode.style.cssText = 'display:flex;justify-content: space-between;'
    domElement.parentNode.querySelector('span').style.cssText = 'width:100%'
    domElement.style.width = width || '40px'
    __li.style.color = '#888'
    __input.disabled = true
    __input.style.background = 'transparent'
    __input.style.opacity = 0.5
    __input.style.fontSize = '11px'
    __input.style.textAlign = 'right'
}

export default gui_setItemDisableInput