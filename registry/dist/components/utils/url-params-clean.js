!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["utils/url-params-clean"]=t():e["utils/url-params-clean"]=t()}(globalThis,(()=>(()=>{var e,t,r={912:e=>{function t(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=912,e.exports=t},799:e=>{"use strict";e.exports="自动删除网址中的多余跟踪参数。请注意这会导致浏览器历史记录出现重复的标题（分别是转换前后的网址），并可能导致后退要多退几次。\n"},110:e=>{"use strict";e.exports=coreApis.lifeCycle},391:e=>{"use strict";e.exports=coreApis.observer}},o={};function a(e){var t=o[e];if(void 0!==t)return t.exports;var i=o[e]={exports:{}};return r[e](i,i.exports,a),i.exports}t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,a.t=function(r,o){if(1&o&&(r=this(r)),8&o)return r;if("object"==typeof r&&r){if(4&o&&r.__esModule)return r;if(16&o&&"function"==typeof r.then)return r}var i=Object.create(null);a.r(i);var n={};e=e||[null,t({}),t([]),t(t)];for(var s=2&o&&r;"object"==typeof s&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach((e=>n[e]=()=>r[e]));return n.default=()=>r,a.d(i,n),i},a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{"use strict";a.d(i,{component:()=>s});const e=coreApis.pluginApis.data,t=coreApis.componentApis.define,r=coreApis.utils,o="网址参数清理",n=(0,coreApis.utils.log.useScopedConsole)(o),s=(0,t.defineComponentMetadata)({name:"urlParamsClean",displayName:o,entry:async()=>{if((0,r.isNotHtml)()||(0,r.isIframe)())return;
/* spell-checker: disable */const[t]=(0,e.registerAndGetData)("urlParamsClean.noClean",["videocard_series"]),[o]=(0,e.registerAndGetData)("urlParamsClean.params",["spm_id_from","from_source","from_spmid","from","seid","share_source","share_medium","share_plat","share_tag","share_session_id","share_from","bbid","ts","timestamp","unique_k","rt","tdsourcetag","accept_quality","broadcast_type","current_qn","current_quality","playurl_h264","playurl_h265","quality_description","network","network_status","platform_network_status","p2p_type","referfrom","visit_id","bsource","spm","hotRank","-Arouter","vd_source","is_story_h5","buvid","plat_id","goFrom","jumpLinkType","hasBack","noTitleBar","msource","live_from","plat_id","extra_jump_from","subarea_rank","popular_rank","launch_id","spmid"]),[i]=(0,e.registerAndGetData)("urlParamsClean.siteSpecifiedParams",[{match:/\/\/www\.bilibili\.com\/audio\/(au[\d]+|mycollection)/,param:"type"},{match:/\/\/live\.bilibili\.com\//,param:"session_id"},{match:/\/\/www\.bilibili\.com\/bangumi\//,param:"theme"},{match:/\/\/www\.bilibili\.com\/video\//,param:"mid"},{match:/\/\/www\.bilibili\.com\/video\//,param:"up_id"},{match:/\/\/mall\.bilibili\.com\//,param:"noReffer"}]),[s]=(0,e.registerAndGetData)("urlParamsClean.tailingSlash",[]),c=e=>{const a=new URL(e,location.origin),n=[...new URLSearchParams(a.search).entries()].map((e=>{let[t,r]=e;return`${t}=${r}`}));if(n.some((e=>t.some((t=>e.includes(t))))))return e;const c=n.filter((e=>!o.some((t=>e.startsWith(`${t}=`)))&&!i.some((t=>{let{match:r,param:o}=t;return document.URL.match(r)&&e.startsWith(`${o}=`)})))).join("&");s.forEach((e=>{let{match:t}=e;const o=a.pathname;(0,r.matchPattern)(o,t)&&o.endsWith("/")&&(a.pathname=o.slice(0,o.length-1))}));const l=c?`?${c}`:"";return a.search=l,a.toString()},l=e=>function(t,r,o){const a=(()=>{try{return new URL(o,location.origin+location.pathname).toString()}catch(e){return n.warn("History API URL",`解析失败: ${o}`),o}})(),i=c(a);for(var s=arguments.length,l=new Array(s>3?s-3:0),m=3;m<s;m++)l[m-3]=arguments[m];return i!==o?(n.log("History API 拦截",a,i),e.call(this,t,r,i,...l)):e.call(this,t,r,o,...l)},m=unsafeWindow.history.pushState;unsafeWindow.history.pushState=l(m);const u=unsafeWindow.history.replaceState;unsafeWindow.history.replaceState=l(u);const{fullyLoaded:p}=await Promise.resolve().then(a.t.bind(a,110,23)),{urlChange:d}=await Promise.resolve().then(a.t.bind(a,391,23));p((()=>{d((()=>(()=>{const e=c(document.URL);e!==document.URL&&(n.log("直接清理",document.URL,e),window.history.replaceState(history.state,"",e))})()))}))},tags:[componentsTags.utils],
/* spell-checker: disable */
urlExclude:[/game\.bilibili\.com\/fgo/,/live\.bilibili\.com\/p\/html\/live-app-hotrank\//],commitHash:"5c95cd605aa1c68860b1f9e1321529c62b50cd9b",coreVersion:"2.8.8",description:(()=>{const e=a(912);return{...Object.fromEntries(e.keys().map((t=>[t.match(/index\.(.+)\.md$/)[1],e(t)]))),"zh-CN":()=>Promise.resolve().then(a.t.bind(a,799,17)).then((e=>e.default))}})()})})(),i=i.component})()));