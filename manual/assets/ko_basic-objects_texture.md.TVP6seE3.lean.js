import{$ as n,Q as d,j as E,g as s,n as a,o as t,ax as e,m as h}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"Texture","description":"","frontmatter":{"title":"Texture","order":3},"headers":[],"relativePath":"ko/basic-objects/texture.md","filePath":"ko/basic-objects/texture.md","lastUpdated":1783326997000}'),o={name:"ko/basic-objects/texture.md"},u=Object.assign(o,{setup(g){const p=`
    Img["이미지 URL/파일"] -->|로드| Texture["BitmapTexture (리소스)"]
    Texture -->|참조| Material["BitmapMaterial (머티리얼)"]
    Material -->|적용| Mesh["Mesh (디스플레이 객체)"]

    %% 회색조 스타일 적용
    style Img fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Texture fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(y,i)=>{const k=n("MermaidResponsive"),l=n("ClientOnly"),r=n("CodePen");return d(),E("div",null,[i[1]||(i[1]=s("h1",{id:"texture",tabindex:"-1"},[a("Texture "),s("a",{class:"header-anchor",href:"#texture","aria-label":'Permalink to "Texture"'},"​")],-1)),i[2]||(i[2]=s("p",null,[a("단순한 색상을 넘어 실제 사진이나 그림 파일을 물체의 표면에 입히면 훨씬 현실적인 3D 객체를 만들 수 있습니다. RedGPU 에서는 이미지 파일을 "),s("strong",null,"BitmapTexture"),a(" 로 불러와 "),s("strong",null,"BitmapMaterial"),a(" 을 사용하여 물체에 적용합니다.")],-1)),t(l,null,{default:e(()=>[t(k,{definition:p})]),_:1}),i[3]||(i[3]=h("",17)),t(l,null,{default:e(()=>[t(r,{title:"RedGPU Basics - Texture",slugHash:"mesh-texture"},{default:e(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);

const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.TorusKnot(redGPUContext), 
    material
);
scene.addChild(mesh);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    mesh.rotationX += 1;
    mesh.rotationY += 1;
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=h("",5))])}}});export{F as __pageData,u as default};
