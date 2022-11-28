import RedGPUContextBase from "../RedGPUContextBase";
import * as dat from "dat.gui";
import debuggerRenderViewList from "./draw/debuggerRenderViewList";
import debuggerRenderResourceManager from "./draw/debuggerRenderResourceManager";
import setStatePanels from "./category/systemStatePanels/setStatePanels";
import setActiveDebugger from "./category/systemStatePanels/setActiveDebugger";

class RedGPUContextDebugger extends RedGPUContextBase {
    #gui;
    #activeViewDebugger: boolean = false
    get activeViewDebugger(): boolean {
        return this.#activeViewDebugger;
    }

    set activeViewDebugger(value: boolean) {
        this.#activeViewDebugger = value;
        let debugView = document.getElementById('___debugView___')
        if (value) {
            if (!debugView) {
                debugView = document.createElement('div')
                debugView.setAttribute('id', '___debugView___')
                debugView.style.cssText = `
                        position: absolute;
                        max-height: 100%;
                        bottom: 0;
                        left:0;
                        box-sizing: border-box;
                        background: rgba(0,0,0,0.5);
                        color : #fff;
                        font-size: 10px;
                        display: flex;
                        flex-direction: column;
                        gap : 4px;
                        overflow: hidden;
                        overflow-y:auto;
                    `
                document.body.appendChild(debugView)
            }
        } else {
            if (debugView) document.body.removeChild(debugView)
        }
    }

    #activeResourceDebugger: boolean = false

    get activeResourceDebugger(): boolean {
        return this.#activeResourceDebugger;
    }

    set activeResourceDebugger(value: boolean) {
        this.#activeResourceDebugger = value;
        let debugResource = document.getElementById('___debugResource___')
        if (value) {
            {

                if (!debugResource) {
                    debugResource = document.createElement('div')
                    debugResource.setAttribute('id', '___debugResource___')
                    debugResource.style.cssText = `
                         position: absolute;
                    bottom: 0;
                    right: 0;
                    padding:16px;
                    background: rgba(0,0,0,0.5);
                    color : #fff;
                    font-size: 10px;
                    overflow-y: auto;
                    `
                    document.body.appendChild(debugResource)
                }
            }
        } else {

            if (debugResource) document.body.removeChild(debugResource)
        }
    }

    #useDebugger: boolean = false
    get useDebugger(): boolean {
        return this.#useDebugger;
    }

    #temp_HD_ViewList
    __userDebugSet

    set temp_HD_ViewList(value) {
        if (this.#temp_HD_ViewList) window.removeEventListener('changeViewList', this.#temp_HD_ViewList)
        this.#temp_HD_ViewList = value;
    }

    set useDebugger(value: boolean) {
        const redGPUContext = this.redGPUContext
        this.#useDebugger = value;
        if (value) {
            if (!this.#gui) {
                console.log(redGPUContext)
                const gui = this.#gui = new dat.GUI()
                const hasUserDebug = this.__userDebugSet
                setStatePanels(gui, redGPUContext, this, !hasUserDebug)
                setActiveDebugger(gui, this)
                hasUserDebug?.(gui, redGPUContext, this)
            }
            this.#gui.show()
        } else {
            this.temp_HD_ViewList = null
            this.#gui.hide()
        }
        /////
    }

    #adapterInfo = {}
    get adapterInfo() {
        return this.#adapterInfo;
    }

    get limit() {
        return this.redGPUContext.gpuAdapter.limits
    }

    constructor(context) {
        super(context)

        this.#update()
    }

    #dat = dat

    get dat(): any {
        return this.#dat;
    }

    #update() {
        this.redGPUContext.gpuAdapter.requestAdapterInfo().then(v => {
            console.log('requestAdapterInfo', v)
            this.#adapterInfo = v
        })
    }

    render() {
        if (!this.#useDebugger) return
        const redGPUContext = this.redGPUContext
        if (this.#activeViewDebugger) {
            debuggerRenderViewList(redGPUContext.viewList)
        }
        if (this.#activeResourceDebugger) {
            debuggerRenderResourceManager(redGPUContext.resourceManager)
        }


    }

}

export default RedGPUContextDebugger