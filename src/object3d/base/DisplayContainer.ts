import {Mesh} from "../mesh/Mesh";


class DisplayContainer {
    #children: Mesh[] = []
    get children() {
        return this.#children;
    }

    #parent
    get parent() {
        return this.#parent;
    }

    set parent(value) {
        this.#parent = value;
    }

    constructor() {
    }

    addChild(child: Mesh) {
        if (child.parent) child.parent.remove(child)
        child.parent = this
        this.#children.push(child)
        return this
    }

    addChildAt(child: Mesh, index: number) {
        if (child.parent) child.parent.remove(child)
        child.parent = this
        if (this.#children.length < index) index = this.#children.length;
        this.#children.splice(index, 0, child)
        return this
    }

    removeChild(child: Mesh) {
        child.parent = null
        this.#children.push(child)
        return this
    }

    removeChildAt(index) {
        const child = this.#children[index]
        if (child) {
            child.parent = null;
            this.#children.splice(index, 1);
        }
        return this
    }

    removeAllChild() {
        let i = this.#children.length
        while (i--) {
            this.#children[i].parent = null
        }
        this.#children.length = 0
        return this
    }

}

export default DisplayContainer