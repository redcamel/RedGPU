import{f as o,D as r,o as c,c as f,a2 as i,G as l,w as n,k as e,a as t}from"./chunks/framework.DpNgdNqH.js";const k=JSON.parse('{"title":"General Effects","description":"","frontmatter":{"title":"General Effects","order":2},"headers":[],"relativePath":"en/post-effect/general-effects.md","filePath":"en/post-effect/general-effects.md","lastUpdated":1770625747000}'),g={name:"en/post-effect/general-effects.md"};function h(p,a,u,y,m,x){const s=r("CodePen"),d=r("ClientOnly");return c(),f("div",null,[a[2]||(a[2]=i("",9)),l(d,null,{default:n(()=>[l(s,{title:"RedGPU PostEffect - RadialBlur",slugHash:"posteffect-radialblur"},{default:n(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),e("p",null,[t(`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const ibl = new RedGPU.Resource.IBL(
redGPUContext,
'`),e("a",{href:"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr",target:"_blank",rel:"noreferrer"},"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr"),t(`'
);`)]),t(`
`),e("pre",null,[e("code",null,`new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (result) => { scene.addChild(result.resultMesh); }
);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
redGPUContext.addView(view);

const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
radialBlur.blur = 0.1;
view.postEffectManager.addEffect(radialBlur);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),t(`
`),e("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),a[3]||(a[3]=e("h3",{id:"_2-2-grayscale",tabindex:"-1"},[t("2.2 Grayscale "),e("a",{class:"header-anchor",href:"#_2-2-grayscale","aria-label":'Permalink to "2.2 Grayscale"'},"​")],-1)),a[4]||(a[4]=e("p",null,"Converts the image to black and white to create a classic atmosphere.",-1)),l(d,null,{default:n(()=>[l(s,{title:"RedGPU PostEffect - Grayscale",slugHash:"posteffect-grayscale"},{default:n(()=>[...a[1]||(a[1]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),e("p",null,[t(`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const ibl = new RedGPU.Resource.IBL(
redGPUContext,
'`),e("a",{href:"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr",target:"_blank",rel:"noreferrer"},"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr"),t(`'
);`)]),t(`
`),e("pre",null,[e("code",null,`new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (result) => { scene.addChild(result.resultMesh); }
);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

redGPUContext.addView(view);

// Add grayscale effect
const grayscale = new RedGPU.PostEffect.Grayscale(redGPUContext);
view.postEffectManager.addEffect(grayscale);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),t(`
`),e("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),a[5]||(a[5]=i("",8))])}const P=o(g,[["render",h]]);export{k as __pageData,P as default};
