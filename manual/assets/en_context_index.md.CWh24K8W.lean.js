import{D as i,o as h,c as r,a2 as a,G as e,w as p}from"./chunks/framework.DZW1bhNM.js";const g=JSON.parse('{"title":"RedGPU Context","description":"Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.","frontmatter":{"title":"RedGPU Context","description":"Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.","order":2},"headers":[],"relativePath":"en/context/index.md","filePath":"en/context/index.md","lastUpdated":1770698112000}'),o={name:"en/context/index.md"},E=Object.assign(o,{setup(k){const t=`
    graph LR
        Init["Call RedGPU.init()"] -->|Async| Callback["onSuccess Callback"]
        Callback -->|Obtain Instance| Setup["Scene and View Setup"]
        Setup -->|Start Loop| Render["Renderer.start()"]
        
        %% Apply custom classes
        class Init,Render mermaid-system;
        class Callback mermaid-main;
`;return(d,s)=>{const n=i("MermaidResponsive"),l=i("ClientOnly");return h(),r("div",null,[s[0]||(s[0]=a("",7)),e(l,null,{default:p(()=>[e(n,{definition:t})]),_:1}),s[1]||(s[1]=a("",20))])}}});export{g as __pageData,E as default};
