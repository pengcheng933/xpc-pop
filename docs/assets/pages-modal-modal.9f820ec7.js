import{o,e as a,a as l,d as e,F as s,r as t,t as p,k as r,j as n}from"./index-3871ad41.js";import{r as c,_ as d}from"./uni-app.es.e04eb6a9.js";import{_ as i}from"./_plugin-vue_export-helper.1b428a4d.js";const u=i({__name:"modal",setup(i){const u=["普通确认框","只有确认按钮","带文本输入框"],m=[()=>{n().globalData.popShow({type:"modalPop",title:"标题",content:"内容",cancelStyle:{color:"gray",border:"1rpx solid #000",borderRadius:"12rpx"},success:o=>{console.log(o)}})},()=>{n().globalData.popShow({type:"modalPop",content:"内容",showCancel:!1,clickMask:!0})},()=>{n().globalData.popShow({type:"modalPop",editable:!0,placeholderText:"输入框提示语句",inputStyle:{color:"red"},maskShow:!1,boxStyle:{backgroundColor:"gray"}}).then((o=>{console.log(o)}))}];return(n,i)=>{const b=c(r("xpc-pop"),d);return o(),a(s,null,[l(b),e("div",null,"他们的调用都在onMounted生命周期后"),e("div",{class:"modal"},[(o(),a(s,null,t(u,((o,a)=>e("div",{class:"item",onClick:o=>(o=>{m[o]()})(a)},p(o),9,["onClick"]))),64))])],64)}}},[["__scopeId","data-v-d8b38d1b"]]);export{u as default};