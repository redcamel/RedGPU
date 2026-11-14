import{D as l,o as p,c as k,k as a,a as i,G as e,w as d,a2 as t}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse(`{"title":"Camera Controller","description":"If Camera learned earlier is the 'eye', Controller is the 'joystick' that moves that eye. It is an Interaction Module that detects user input (mouse, to...","frontmatter":{"title":"Camera Controller","order":5},"headers":[],"relativePath":"en/view-system/controller.md","filePath":"en/view-system/controller.md","lastUpdated":1794650641000}`),c={name:"en/view-system/controller.md"},C=Object.assign(c,{setup(g){const r=`
    graph LR
        Input["User Input (Mouse · Touch · Keyboard)"]
        Controller["Controller (Orbit / Free / Follow / Isometric)"]
        Camera["Built-in Camera (Updates View · Projection Matrix)"]
        View["View3D (Screen Rendering)"]

        Input -->|Detects Events| Controller
        Controller -->|Real-time Control| Camera
        Controller -.->|Registered Directly to View| View

        %% Grayscale styles applied
        style Input fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Camera fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`;return(E,s)=>{const h=l("MermaidResponsive"),o=l("ClientOnly"),n=l("ExampleFrame");return p(),k("div",null,[s[0]||(s[0]=a("h1",{id:"camera-controller",tabindex:"-1"},[i("Camera Controller "),a("a",{class:"header-anchor",href:"#camera-controller","aria-label":'Permalink to "Camera Controller"'},"​")],-1)),s[1]||(s[1]=a("p",null,[i("If "),a("code",null,"Camera"),i(" learned earlier is the 'eye', "),a("strong",null,"Controller"),i(" is the 'joystick' that moves that eye. It is an "),a("strong",null,"Interaction Module"),i(" that detects user input (mouse, touch, keyboard) to control the camera's position and rotation in real time, enabling intuitive 3D navigation without complex matrix calculations.")],-1)),s[2]||(s[2]=a("h2",{id:"_1-architecture-and-role",tabindex:"-1"},[i("1. Architecture and Role "),a("a",{class:"header-anchor",href:"#_1-architecture-and-role","aria-label":'Permalink to "1. Architecture and Role"'},"​")],-1)),e(o,null,{default:d(()=>[e(h,{definition:r})]),_:1}),s[3]||(s[3]=t("",9)),e(n,{src:"/RedGPU/examples/3d/controller/orbitController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),s[4]||(s[4]=t("",3)),e(n,{src:"/RedGPU/examples/3d/controller/freeController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),s[5]||(s[5]=t("",3)),e(n,{src:"/RedGPU/examples/3d/controller/isometricController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),s[6]||(s[6]=t("",3)),e(n,{src:"/RedGPU/examples/3d/controller/followController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),s[7]||(s[7]=t("",11))])}}});export{m as __pageData,C as default};
