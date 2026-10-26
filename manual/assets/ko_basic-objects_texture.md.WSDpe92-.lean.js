import{D as n,o as d,c as o,k as s,a,G as e,w as t,a2 as p}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse('{"title":"Texture","description":"","frontmatter":{"title":"Texture","order":3},"headers":[],"relativePath":"ko/basic-objects/texture.md","filePath":"ko/basic-objects/texture.md","lastUpdated":1792987289000}'),E={name:"ko/basic-objects/texture.md"},u=Object.assign(E,{setup(c){const h=`
    Img["이미지 URL/파일"] -->|로드| Texture["BitmapTexture (리소스)"]
    Texture -->|참조| Material["BitmapMaterial (머티리얼)"]
    Material -->|적용| Mesh["Mesh (디스플레이 객체)"]

    %% 회색조 스타일 적용
    style Img fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Texture fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(g,i)=>{const k=n("MermaidResponsive"),l=n("ClientOnly"),r=n("CodePen");return d(),o("div",null,[i[1]||(i[1]=s("h1",{id:"texture",tabindex:"-1"},[a("Texture "),s("a",{class:"header-anchor",href:"#texture","aria-label":'Permalink to "Texture"'},"​")],-1)),i[2]||(i[2]=s("p",null,[a("단순한 색상을 넘어 실제 사진이나 그림 파일을 물체의 표면에 입히면 훨씬 현실적인 3D 객체를 만들 수 있습니다. RedGPU 에서는 이미지 파일을 "),s("a",{href:"/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/BitmapTexture.html"},[s("code",null,"BitmapTexture")]),a(" 로 불러와 "),s("a",{href:"/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Material/classes/BitmapMaterial.html"},[s("code",null,"BitmapMaterial")]),a(" 을 사용하여 물체에 적용합니다.")],-1)),e(l,null,{default:t(()=>[e(k,{definition:h})]),_:1}),i[3]||(i[3]=p("",11)),e(l,null,{default:t(()=>[e(r,{title:"RedGPU Basics - Texture",slugHash:"mesh-texture"},{default:t(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=p("",6))])}}});export{m as __pageData,u as default};
