(function(t){function e(e){for(var r,s,a=e[0],c=e[1],A=e[2],l=0,u=[];l<a.length;l++)s=a[l],o[s]&&u.push(o[s][0]),o[s]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(t[r]=c[r]);d&&d(e);while(u.length)u.shift()();return i.push.apply(i,A||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,s=1;s<n.length;s++){var a=n[s];0!==o[a]&&(r=!1)}r&&(i.splice(e--,1),t=c(c.s=n[0]))}return t}var r={},s={app:0},o={app:0},i=[];function a(t){return c.p+"js/"+({}[t]||t)+"."+{"chunk-2a9b0b0f":"de6de74b"}[t]+".js"}function c(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(t){var e=[],n={"chunk-2a9b0b0f":1};s[t]?e.push(s[t]):0!==s[t]&&n[t]&&e.push(s[t]=new Promise(function(e,n){for(var r="css/"+({}[t]||t)+"."+{"chunk-2a9b0b0f":"e9e97092"}[t]+".css",o=c.p+r,i=document.getElementsByTagName("link"),a=0;a<i.length;a++){var A=i[a],l=A.getAttribute("data-href")||A.getAttribute("href");if("stylesheet"===A.rel&&(l===r||l===o))return e()}var u=document.getElementsByTagName("style");for(a=0;a<u.length;a++){A=u[a],l=A.getAttribute("data-href");if(l===r||l===o)return e()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=e,d.onerror=function(e){var r=e&&e.target&&e.target.src||o,i=new Error("Loading CSS chunk "+t+" failed.\n("+r+")");i.request=r,delete s[t],d.parentNode.removeChild(d),n(i)},d.href=o;var h=document.getElementsByTagName("head")[0];h.appendChild(d)}).then(function(){s[t]=0}));var r=o[t];if(0!==r)if(r)e.push(r[2]);else{var i=new Promise(function(e,n){r=o[t]=[e,n]});e.push(r[2]=i);var A,l=document.createElement("script");l.charset="utf-8",l.timeout=120,c.nc&&l.setAttribute("nonce",c.nc),l.src=a(t),A=function(e){l.onerror=l.onload=null,clearTimeout(u);var n=o[t];if(0!==n){if(n){var r=e&&("load"===e.type?"missing":e.type),s=e&&e.target&&e.target.src,i=new Error("Loading chunk "+t+" failed.\n("+r+": "+s+")");i.type=r,i.request=s,n[1](i)}o[t]=void 0}};var u=setTimeout(function(){A({type:"timeout",target:l})},12e4);l.onerror=l.onload=A,document.head.appendChild(l)}return Promise.all(e)},c.m=t,c.c=r,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)c.d(n,r,function(e){return t[e]}.bind(null,r));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/editor/",c.oe=function(t){throw console.error(t),t};var A=window["webpackJsonp"]=window["webpackJsonp"]||[],l=A.push.bind(A);A.push=e,A=A.slice();for(var u=0;u<A.length;u++)e(A[u]);var d=l;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"55d5":function(t,e,n){"use strict";var r=n("666d"),s=n.n(r);s.a},"56d7":function(t,e,n){"use strict";n.r(e);var r=n("8bbf"),s=n.n(r),o=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"page"},[r("div",{staticClass:"left-container",class:{hide:!t.showHtml&&!t.showJS},style:{"flex-basis":t.leftWidth},on:{mousemove:t.onDragging,mouseup:t.onDragEnd,mouseleave:function(e){return t.onDragEnd("leave")}}},[r("div",{staticClass:"html-container",class:{hide:!t.showHtml},style:{"flex-basis":t.htmlHeight}},[r("code-editor",{attrs:{value:t.htmlStr,mode:"xml",title:"html"},on:{update:function(e){return t.htmlStr=e}}})],1),r("div",{staticClass:"separator separator-vertical",on:{mousedown:function(e){return t.onDragStart("left")}}}),r("div",{staticClass:"js-container",class:{hide:!t.showJS},style:{"flex-basis":"calc(100% - "+t.htmlHeight+")"}},[r("code-editor",{attrs:{value:t.jsStr,mode:"javascript",title:"js"},on:{update:function(e){return t.jsStr=e}}})],1)]),r("div",{staticClass:"separator separator-horizotal",on:{mousedown:function(e){return t.onDragStart("middle")},mouseup:t.onDragEnd}}),r("div",{staticClass:"right-container",class:{hide:!t.showCSS&&!t.showPreview},style:{"flex-basis":"calc(100% - "+t.leftWidth+")"},on:{mousemove:t.onDragging,mouseup:t.onDragEnd,mouseleave:function(e){return t.onDragEnd("leave")}}},[r("div",{staticClass:"css-container",class:{hide:!t.showCSS},style:{"flex-basis":t.cssHeight}},[r("code-editor",{attrs:{value:t.cssStr,mode:"css",title:"css"},on:{update:function(e){return t.cssStr=e}}})],1),r("div",{staticClass:"separator separator-vertical",on:{mousedown:function(e){return t.onDragStart("right")},mousemove:t.onDragging}}),r("div",{staticClass:"iframe-container",class:{hide:!t.showPreview},style:{"flex-basis":"calc(100% - "+t.cssHeight+")"}},[r("html-preview",{ref:"htmlPreview",attrs:{"html-str":t.htmlStr,"js-str":t.jsStr,"css-str":t.cssStr,"disable-mouse":Boolean(t.draggingSeparator)}})],1)]),t.showOptions?r("option-modal",{on:{close:function(e){t.showOptions=!1}}}):t._e(),r("img",{staticClass:"option",attrs:{src:n("5922")},on:{click:function(e){t.showOptions=!0}}})],1)},i=[],a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"edit-container"},[n("span",{directives:[{name:"show",rawName:"v-show",value:t.focused,expression:"focused"}],staticClass:"panel-title"},[t._v(t._s(t.title))]),n("codemirror",{staticClass:"editor",attrs:{value:t.value,options:Object.assign(t.cmOption,{mode:t.mode,autofocus:"html"===t.title}),placeholder:t.title+" code here."},on:{input:t.update,focus:function(e){t.focused=!0},blur:function(e){t.focused=!1}}})],1)},c=[],A=n("8f94"),l={props:{title:String,value:String,mode:String},data:function(){return{focused:!1,cmOption:{tabSize:2,styleActiveLine:!0}}},components:{codemirror:A["codemirror"]},methods:{update:function(t){this.$emit("update",t)}}},u=l,d=(n("63df"),n("6f3e"),n("2877")),h=Object(d["a"])(u,a,c,!1,null,"4cf386b6",null),f=h.exports,m=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("iframe",{style:{"pointer-events":t.disableMouse?"none":"inherit"},attrs:{id:"iframe"}})},p=[],g={props:{htmlStr:String,cssStr:String,jsStr:String,disableMouse:Boolean},watch:{htmlStr:function(){this.renderIfNecessary()},cssStr:function(){this.renderIfNecessary()},jsStr:function(){this.renderIfNecessary()}},methods:{renderIfNecessary:function(){this.$store.getters.autoRender&&this.render()},render:function(){const t=`\n        <!DOCTYPE html>\n        <html>\n        <head>\n          <meta http-equiv="content-type" content="text/html; charset=utf-8" />\n          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />\n          <style> body { font-family: sans-serif; }</style>\n          <style>${this.cssStr}</style>\n        </head>\n        <body>\n          ${this.htmlStr||"<span style='color: #888'>Preview here.</span>"}\n        `+"<script>"+this.jsStr+"<\/script>\n        </body>\n        </html>\n      ",e=document.getElementById("iframe").contentDocument;e.open(),e.write(t),e.close()}}},v=g,S=(n("edd4"),Object(d["a"])(v,m,p,!1,null,"14f5dc7d",null)),b=S.exports;const w="CodeHere_",y=["htmlStr","cssStr","jsStr","htmlHeight","cssHeight","leftWidth","autoRender"],C=Object.freeze({fetchAll:function(){const t={};for(let e of y)t[e]=this.fetch(e);return t},fetch:function(t){return localStorage.getItem(w+t)},save:function(t){if(t)for(let e in t)localStorage.setItem(w+e,t[e])}});var j=C,D=n("2f62");function O(){let t=j.fetch("autoRender");return null===t||void 0===t?(t=!0,j.save({autoRender:t})):t="true"===t,{autoRender:t}}s.a.use(D["a"]);const E={options:{autoRender:O().autoRender}},H={autoRender({options:t}){return t.autoRender}},x={setAutoRender({options:t},e){t.autoRender=e,j.save({autoRender:e})}},k={setAutoRender({commit:t},e){t("setAutoRender",e)}};var B=new D["a"].Store({state:E,getters:H,mutations:x,actions:k});const P=()=>n.e("chunk-2a9b0b0f").then(n.bind(null,"bb63"));let R;var M={store:B,data:function(){return{htmlStr:"",cssStr:"",jsStr:"",htmlHeight:"50%",cssHeight:"50%",leftWidth:"50%",showHtml:!0,showCSS:!0,showJS:!0,showPreview:!0,draggingSeparator:"",showOptions:!1}},components:{codeEditor:f,htmlPreview:b,optionModal:P},mounted:function(){const t=j.fetchAll();for(let e in t)this[e]=t[e];setTimeout(()=>{this.render()},600),document.onkeydown=this.onKeyDown},watch:{htmlStr:function(){j.save({htmlStr:this.htmlStr||""})},cssStr:function(){j.save({cssStr:this.cssStr||""})},jsStr:function(){j.save({jsStr:this.jsStr||""})}},methods:{onKeyDown:function(t){if(t.metaKey){switch(t.key){case"1":this.showHtml=!this.showHtml;break;case"2":this.showJS=!this.showJS;break;case"3":this.showCSS=!this.showCSS;break;case"4":this.showPreview=!this.showPreview;break;case"Enter":this.render();break;default:break}["1","2","3","4","Enter"].indexOf(t.key)>=0&&t.preventDefault()}},onDragStart:function(t){R=document.activeElement,this.draggingSeparator=t},onDragging:function(t){"left"===this.draggingSeparator&&(this.htmlHeight=t.y+"px"),"right"===this.draggingSeparator&&(this.cssHeight=t.y+"px"),"middle"===this.draggingSeparator&&(this.leftWidth=t.x+"px")},onDragEnd:function(t){if(this.draggingSeparator&&("middle"!==this.draggingSeparator||"leave"!==t)){const t={left:"htmlHeight",right:"cssHeight",middle:"leftWidth"},e=t[this.draggingSeparator];e&&j.save({[e]:this[e]}),this.draggingSeparator="",R&&R.focus()}},render:function(){this.$refs.htmlPreview.render()}}},K=M,N=(n("55d5"),Object(d["a"])(K,o,i,!1,null,"399437cf",null)),L=N.exports;s.a.config.productionTip=!1,new s.a({el:"#app",render:t=>t(L)})},5922:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDIYgjAAAAL3RSTlMABBL76winD/XnoMjVG/Cpa1R1WS4X5N+wLLm3zqOIX47KcO3Z0sGKQa0jRplFInFvBvoAAAOTSURBVFjDrVfpeqowEE0IYSugIChUUbtYly7z/m93Z6JJgeBW7/nhZyY5J8AsmbDz4NtQKIRLzv6CZzB4vp/N2QrEtPEQzVTAivG7BSIQNVMoBES3CXCEEfAg9I8WPwSPcWvNZZCA6zAFx9UC15B9RSvOuBHwj2bfCODkKvrKzmzJKkAsHLVW9gWkWuMsAFHhX5tPbhMBwDsq0PS+LbCnJch/BwiEcqv9SnOAaZE8KQXmjD8CSPU3SCH4GOOA+E9lMQWYsyF+mKAwKsTF8k29jZ5Tz51uixj5uHMSDihUis+5UlDrq3GpJ8txlQKB+Jwrhar7ASYA04Te66QwyxPWQZLPTnxak+BbTOivEWhAFNpT8tnNaRlv7UDj3H02Pq4FNB0BD4LyaKBfOeQmY6bfMgCvIzAGeJHGMhh27Vn5AjDurOILrWBnhy3Ekb/o2f3YUrAeqL1/7PdUtUKXfthl2e6nK6H5vK/gbDBE2/R6HQeACOJ1jYZ2pdo4Q1+5BnClGZUNtNCUhiFdAHK5LbAEyI2fPlMKp+h1MnmNKITePs1UDrC0BVTKzHgrMiHO9DCLoRV5fGbS7GQgSDbWD0D7I2Gtp8i2RsOnns0pCKSeMviANNHJg8n42nXjK75FqfMihY82cxWNEFUAld6iwf37zl8DRHq+gqDykBOtaGjODxOcNUDMLMQAtQl8DUyvLYAIXUS6KH83y+w4yQC2J2u5SMMwdENB/ghhWvuO7/vO717kDgtyBhszUASJxS1kArzeykNAbzt0VAWHntEDgQKjbl6yHbnAFiBH7HpLR4MCmQkaq+xl/1/g8Ve47yP+2B+R3Fj4DsGYNzCT19xI8MmNlMTCJQQmkLZXA2kTKIpQiT2/OZSFHcpzrpLJa7xm1Eqm6HoyjRokRasz6exgOufddM4xnR0rnc8WlO+hgvJ9paBQSZPdknYaykmnpMkZPczVovrWK6rfVlG1BIpOWXciAQYicjplvbYEiBH3D5bt5niwbLb9gyV27DhR/c/g0XagQXuC+ihLQfH5TYerVuiAL4h/8/H+1D3eKTiJf3uDQQrjh1uci02WtJssiU2W1GsK1WQ93OY91GjuL7S6m3qZDrS6S7vVHW6248vNdjLcbHOlIALqn863+358bPfnw27aA+LFv3jheAEEyvGzVx72tyvP45eux699j1887asvTL0RwpvCnVdfExgGc/YX8OUt1/9/fBqGksibPYUAAAAASUVORK5CYII="},"63df":function(t,e,n){"use strict";var r=n("f969"),s=n.n(r);s.a},"666d":function(t,e,n){},"6f3e":function(t,e,n){"use strict";var r=n("b7b7"),s=n.n(r);s.a},"8bbf":function(t,e){t.exports=Vue},abfa:function(t,e,n){},b7b7:function(t,e,n){},bf73:function(t,e){t.exports=CodeMirror},edd4:function(t,e,n){"use strict";var r=n("abfa"),s=n.n(r);s.a},f969:function(t,e,n){}});