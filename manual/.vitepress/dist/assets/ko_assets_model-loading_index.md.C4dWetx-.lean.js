import{f as p,D as n,o as k,c as r,a2 as d,G as e,w as l,k as s,a}from"./chunks/framework.DZW1bhNM.js";const m=JSON.parse('{"title":"GLTF Loader (모델 로딩)","description":"","frontmatter":{"title":"GLTF Loader (모델 로딩)","order":1},"headers":[],"relativePath":"ko/assets/model-loading/index.md","filePath":"ko/assets/model-loading/index.md","lastUpdated":1770713971000}'),o={name:"ko/assets/model-loading/index.md"};function E(g,i,c,y,F,u){const t=n("CodePen"),h=n("ClientOnly");return k(),r("div",null,[i[1]||(i[1]=d("",15)),e(h,null,{default:l(()=>[e(t,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:l(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3; // 카메라 거리 조절

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// IBL 및 Skybox 설정
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
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=s("h2",{id:"다음-단계",tabindex:"-1"},[a("다음 단계 "),s("a",{class:"header-anchor",href:"#다음-단계","aria-label":'Permalink to "다음 단계"'},"​")],-1)),i[3]||(i[3]=s("p",null,"텍스트와 함께 3D 공간을 풍성하게 채워줄 이미지 기반의 객체들에 대해 알아봅니다.",-1)),i[4]||(i[4]=s("ul",null,[s("li",null,[s("strong",null,[s("a",{href:"./../sprite/"},"스프라이트")])])],-1))])}const G=p(o,[["render",E]]);export{m as __pageData,G as default};
