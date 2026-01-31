import{f as p,D as e,o as r,c as d,a2 as k,G as n,w as t,k as s,a}from"./chunks/framework.DpNgdNqH.js";const C=JSON.parse('{"title":"GLTF Loader","description":"","frontmatter":{"title":"GLTF Loader","order":1},"headers":[],"relativePath":"en/assets/model-loading/index.md","filePath":"en/assets/model-loading/index.md","lastUpdated":1769835435000}'),o={name:"en/assets/model-loading/index.md"};function g(E,i,c,y,m,F){const l=e("CodePen"),h=e("ClientOnly");return r(),d("div",null,[i[1]||(i[1]=k("",15)),n(h,null,{default:t(()=>[n(l,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:t(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3; // Adjust camera distance

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// Setup IBL and Skybox
const ibl = new RedGPU.Resource.IBL(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    (loader) => {
        scene.addChild(loader.resultMesh);
        
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
            loader.resultMesh.rotationY += 1;
        });
    }
);
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=s("h2",{id:"next-steps",tabindex:"-1"},[a("Next Steps "),s("a",{class:"header-anchor",href:"#next-steps","aria-label":'Permalink to "Next Steps"'},"​")],-1)),i[3]||(i[3]=s("p",null,"Learn about image-based objects that will enrich the 3D space along with text.",-1)),i[4]||(i[4]=s("ul",null,[s("li",null,[s("strong",null,[s("a",{href:"./../sprite/"},"Sprite & SpriteSheet")])])],-1))])}const P=p(o,[["render",g]]);export{C as __pageData,P as default};
