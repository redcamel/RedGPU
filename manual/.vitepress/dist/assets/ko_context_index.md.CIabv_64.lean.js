import{$ as t,Q as d,j as o,m as s,o as i,ax as r}from"./chunks/framework.D5MFXpji.js";const g=JSON.parse('{"title":"RedGPU Context","description":"RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.","frontmatter":{"title":"RedGPU Context","description":"RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.","order":2},"headers":[],"relativePath":"ko/context/index.md","filePath":"ko/context/index.md","lastUpdated":1781143738000}'),h={name:"ko/context/index.md"},E=Object.assign(h,{setup(c){const a=`
    graph LR
        Init["RedGPU.init() 호출"] -->|비동기| Callback["onSuccess 콜백"]
        Callback -->|인스턴스 획득| Setup["씬 및 뷰 설정"]
        Setup -->|루프 시작| Render["Renderer.start()"]
        
        %% 회색조 스타일 적용
        style Init fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
        style Callback fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Setup fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Render fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`;return(p,e)=>{const l=t("MermaidResponsive"),n=t("ClientOnly");return d(),o("div",null,[e[0]||(e[0]=s("",10)),i(n,null,{default:r(()=>[i(l,{definition:a})]),_:1}),e[1]||(e[1]=s("",43))])}}});export{g as __pageData,E as default};
