import {defineProperties} from "./core/createDefineByPreset";
import defineSampler from "./funcs/defineSampler";

const DefineProperty = {
    defineSampler: defineProperties(defineSampler),

}
Object.freeze(DefineProperty)
export default DefineProperty
