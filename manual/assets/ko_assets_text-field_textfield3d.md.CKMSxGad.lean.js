import{f as p,D as e,o as d,c as r,a2 as t,G as n,w as l,k as s,a}from"./chunks/framework.DpNgdNqH.js";const D=JSON.parse('{"title":"TextField3D","description":"","frontmatter":{"title":"TextField3D","order":3},"headers":[],"relativePath":"ko/assets/text-field/textfield3d.md","filePath":"ko/assets/text-field/textfield3d.md","lastUpdated":1770635218000}'),o={name:"ko/assets/text-field/textfield3d.md"};function E(g,i,c,y,F,u){const h=e("CodePen"),k=e("ClientOnly");return d(),r("div",null,[i[1]||(i[1]=t("",26)),n(k,null,{default:l(()=>[n(h,{title:"RedGPU Basics - TextField3D Showcase",slugHash:"textfield3d-showcase"},{default:l(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`// IBL Setup
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// 헬멧 및 텍스트 필드 그룹 생성을 위한 헬퍼 함수
const createCase = (x, label, color, useBB, usePS) => {
    // 1. 모델 로딩
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            const mesh = loader.resultMesh;
            mesh.x = x;
            scene.addChild(mesh);
        }
    );

    // 2. 텍스트 필드 생성
    const text = new RedGPU.Display.TextField3D(redGPUContext, label);
    text.x = x; text.y = 1.5;
    text.background = color;
    text.padding = 15;
    text.useBillboard = useBB;
    text.usePixelSize = usePS;
    scene.addChild(text);
};

// 케이스 배치
createCase(-3, "Billboard: OFF", "rgba(255, 0, 0, 0.8)", false, false);
createCase(0, "World Size", "rgba(0, 204, 153, 0.8)", true, false);
createCase(3, "Pixel Size", "rgba(0, 102, 255, 0.8)", true, true);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=t("",6))])}const C=p(o,[["render",E]]);export{D as __pageData,C as default};
