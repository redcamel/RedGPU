import{$ as l,Q as E,j as o,m as h,o as t,ax as n,g as i,n as a}from"./chunks/framework.D5MFXpji.js";const C=JSON.parse('{"title":"Getting Started","description":"","frontmatter":{"title":"Getting Started","order":1},"headers":[],"relativePath":"ko/introduction/index.md","filePath":"ko/introduction/index.md","lastUpdated":1783325144000}'),g={name:"ko/introduction/index.md"},m=Object.assign(g,{setup(y){const p=`
    Renderer["RedGPU.Renderer"] -->|Draws| View["RedGPU.Display.View3D"]
    View -->|Composes| Scene["RedGPU.Display.Scene"]
    View -->|Uses| Camera["RedGPU.Camera"]
    Scene -->|Contains| Mesh["RedGPU.Display.Mesh"]
    Mesh -->|Combines| Geo["Geometry"] & Mat["Material"]

    %% 회색조 스타일 적용
    style Renderer fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Scene fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Camera fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Geo fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mat fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`,r=`
    Start(["시작"]) --> Init["RedGPU.init 초기화"] 
    Init -->|성공| Context["redGPUContext 획득"]
    Context --> Create["리소스 생성<br/>Scene, Camera, Mesh"]
    Create --> SetupView["View3D 설정"]
    SetupView --> StartLoop["렌더링 루프 시작"]
    StartLoop -->|Loop| Update["프레임 업데이트"]
    Update --> Render["화면 렌더링"]
    Render --> Update

    %% 회색조 스타일 적용
    style Start fill:#fafafa,stroke:#d4d4d8,color:#52525b,stroke-width:1px
    style Init fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Context fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Create fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style SetupView fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style StartLoop fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Update fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Render fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(c,s)=>{const d=l("CodePen"),e=l("ClientOnly"),k=l("MermaidResponsive");return E(),o("div",null,[s[1]||(s[1]=h("",19)),t(e,null,{default:n(()=>[t(d,{title:"RedGPU Quick Start - Rotating Cube",slugHash:"getting-started"},{default:n(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera();
camera.z = -5;`),a(`
`),i("pre",null,[i("code",null,`    const geometry = new RedGPU.Primitive.Box(redGPUContext); 
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    
    scene.addChild(mesh);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        mesh.rotationX += 1;
        mesh.rotationY += 1;
    });
},
(error) => {
    console.error("RedGPU 초기화 실패:", error);
}
`)]),a(`
`),i("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=i("br",null,null,-1)),s[3]||(s[3]=i("h2",{id:"시스템-구조-및-실행-흐름",tabindex:"-1"},[a("시스템 구조 및 실행 흐름 "),i("a",{class:"header-anchor",href:"#시스템-구조-및-실행-흐름","aria-label":'Permalink to "시스템 구조 및 실행 흐름"'},"​")],-1)),s[4]||(s[4]=i("p",null,"RedGPU의 주요 클래스 관계와 애플리케이션 생명 주기를 도식화한 내용입니다.",-1)),s[5]||(s[5]=i("h3",{id:"실행-프로세스",tabindex:"-1"},[a("실행 프로세스 "),i("a",{class:"header-anchor",href:"#실행-프로세스","aria-label":'Permalink to "실행 프로세스"'},"​")],-1)),t(e,null,{default:n(()=>[t(k,{definition:r})]),_:1}),s[6]||(s[6]=h("",2)),t(e,null,{default:n(()=>[t(k,{definition:p})]),_:1}),s[7]||(s[7]=h("",3))])}}});export{C as __pageData,m as default};
