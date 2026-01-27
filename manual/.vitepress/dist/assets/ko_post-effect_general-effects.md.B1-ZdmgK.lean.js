import{f as o,D as r,o as c,c as f,a2 as i,G as a,w as d,k as t,a as e}from"./chunks/framework.Dn9yU8Jh.js";const k=JSON.parse('{"title":"General Effects","description":"","frontmatter":{"title":"General Effects","order":2},"headers":[],"relativePath":"ko/post-effect/general-effects.md","filePath":"ko/post-effect/general-effects.md","lastUpdated":1769513216000}'),g={name:"ko/post-effect/general-effects.md"};function h(p,l,x,y,u,m){const n=r("CodePen"),s=r("ClientOnly");return c(),f("div",null,[l[2]||(l[2]=i("",9)),a(s,null,{default:d(()=>[a(n,{title:"RedGPU PostEffect - RadialBlur",slugHash:"posteffect-radialblur"},{default:d(()=>[...l[0]||(l[0]=[t("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),t("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),t("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),t("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),t("p",null,[e(`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const ibl = new RedGPU.Resource.IBL(
redGPUContext,
'`),t("a",{href:"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr",target:"_blank",rel:"noreferrer"},"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr"),e(`'
);`)]),e(`
`),t("pre",null,[t("code",null,`new RedGPU.GLTFLoader(
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
`)]),e(`
`),t("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),l[3]||(l[3]=t("h3",{id:"_2-2-그레이스케일-grayscale",tabindex:"-1"},[e("2.2 그레이스케일 (Grayscale) "),t("a",{class:"header-anchor",href:"#_2-2-그레이스케일-grayscale","aria-label":'Permalink to "2.2 그레이스케일 (Grayscale)"'},"​")],-1)),l[4]||(l[4]=t("p",null,"이미지를 흑백으로 변환하여 고전적인 분위기를 연출합니다.",-1)),a(s,null,{default:d(()=>[a(n,{title:"RedGPU PostEffect - Grayscale",slugHash:"posteffect-grayscale"},{default:d(()=>[...l[1]||(l[1]=[t("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),t("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),t("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),t("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),t("p",null,[e(`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const ibl = new RedGPU.Resource.IBL(
redGPUContext,
'`),t("a",{href:"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr",target:"_blank",rel:"noreferrer"},"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr"),e(`'
);`)]),e(`
`),t("pre",null,[t("code",null,`new RedGPU.GLTFLoader(
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

// 흑백 효과 추가
const grayscale = new RedGPU.PostEffect.Grayscale(redGPUContext);
view.postEffectManager.addEffect(grayscale);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),e(`
`),t("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),l[5]||(l[5]=i("",8))])}const b=o(g,[["render",h]]);export{k as __pageData,b as default};
