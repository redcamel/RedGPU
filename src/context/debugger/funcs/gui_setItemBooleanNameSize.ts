import Controller from "dat.gui/src/dat/controllers/Controller.js";

const gui_setItemBooleanNameSize = (controller:Controller) => {
	controller.listen()
	controller.domElement.parentNode.style.cssText = 'display:flex;justify-content: space-between;'
	controller.domElement.parentNode.querySelector('span').style.cssText = 'width:100%'
	controller.domElement.style.width = '40px'
	return controller
}

export default gui_setItemBooleanNameSize
