(function(e){function t(t){for(var r,n,o=t[0],l=t[1],c=t[2],u=0,d=[];u<o.length;u++)n=o[u],Object.prototype.hasOwnProperty.call(s,n)&&s[n]&&d.push(s[n][0]),s[n]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);p&&p(t);while(d.length)d.shift()();return i.push.apply(i,c||[]),a()}function a(){for(var e,t=0;t<i.length;t++){for(var a=i[t],r=!0,n=1;n<a.length;n++){var o=a[n];0!==s[o]&&(r=!1)}r&&(i.splice(t--,1),e=l(l.s=a[0]))}return e}var r={},n={app:0},s={app:0},i=[];function o(e){return l.p+"js/"+({generators:"generators"}[e]||e)+"-legacy."+{generators:"3faa80d6"}[e]+".js"}function l(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,l),a.l=!0,a.exports}l.e=function(e){var t=[],a={generators:1};n[e]?t.push(n[e]):0!==n[e]&&a[e]&&t.push(n[e]=new Promise((function(t,a){for(var r="css/"+({generators:"generators"}[e]||e)+"."+{generators:"c1d75e50"}[e]+".css",s=l.p+r,i=document.getElementsByTagName("link"),o=0;o<i.length;o++){var c=i[o],u=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(u===r||u===s))return t()}var d=document.getElementsByTagName("style");for(o=0;o<d.length;o++){c=d[o],u=c.getAttribute("data-href");if(u===r||u===s)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var r=t&&t.target&&t.target.src||s,i=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=r,delete n[e],p.parentNode.removeChild(p),a(i)},p.href=s;var h=document.getElementsByTagName("head")[0];h.appendChild(p)})).then((function(){n[e]=0})));var r=s[e];if(0!==r)if(r)t.push(r[2]);else{var i=new Promise((function(t,a){r=s[e]=[t,a]}));t.push(r[2]=i);var c,u=document.createElement("script");u.charset="utf-8",u.timeout=120,l.nc&&u.setAttribute("nonce",l.nc),u.src=o(e);var d=new Error;c=function(t){u.onerror=u.onload=null,clearTimeout(p);var a=s[e];if(0!==a){if(a){var r=t&&("load"===t.type?"missing":t.type),n=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+r+": "+n+")",d.name="ChunkLoadError",d.type=r,d.request=n,a[1](d)}s[e]=void 0}};var p=setTimeout((function(){c({type:"timeout",target:u})}),12e4);u.onerror=u.onload=c,document.head.appendChild(u)}return Promise.all(t)},l.m=e,l.c=r,l.d=function(e,t,a){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(l.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)l.d(a,r,function(t){return e[t]}.bind(null,r));return a},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="",l.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=t,c=c.slice();for(var d=0;d<c.length;d++)t(c[d]);var p=u;i.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("56d7")},"0ac4":function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var r=a("0dc8");function n(){}const s=["info","log","error","warn","debug"],i="font-weight:bold;background:black;color:white;text-decoration:underline;",o=new Map;function l(e,t=i){let a=o.get(e);return a||(a=new Proxy(console,{get(a,i){const o=s.includes(i),l="debug"===i;if(o&&(l||r["a"].isDebugMode)){const r=a[i];return r.bind(self.console,`%c[${e}:${i}]`,t)}return l?n:a[i]}}),o.set(e,a)),a}},"0dc8":function(e,t,a){"use strict";var r=a("aa51");class n{constructor(){this._data=new Map}setItem(e,t){this._data.set(e,t)}getItem(e){return this._data.get(e)}removeItem(e){this._data.delete(e)}clear(){this._data.clear()}}class s{constructor(e=""){this._scope=e,this._eventListeners=new Map,this._storage=self.localStorage||new n}_makeScopedKey(e){return`${this._scope}:${e}`}storeValue(e,t,a=!1){this._storage.setItem(this._makeScopedKey(e),t),a?this.emitValueChange(e,t):this.delayedEmitValueChange(e,t)}storeObject(e,t,a){this._storage.setItem(this._makeScopedKey(e),JSON.stringify(t)),a?this.emitValueChange(e,t):this.delayedEmitValueChange(e,t)}removeItem(e){this._storage.removeItem(this._makeScopedKey(e))}addEventListener(e,t){"function"===typeof t&&this._eventListeners.set(e,t)}removeEventListener(e){return this._eventListeners.delete(e)}emitValueChange(e,t){this._eventListeners.forEach(a=>{a(e,t)})}delayedEmitValueChange(e,t,a=0){return new Promise((r,n)=>{setTimeout(()=>{try{this.emitValueChange(e,t),r()}catch(a){n(a)}},a)})}getBoolean(e){const t=this._storage.getItem(this._makeScopedKey(e));return"true"===t}getString(e){return this._storage.getItem(this._makeScopedKey(e))||""}}var i=new s("app");class o{constructor(e=i){this._store=e}get store(){return this._store}get isDebugMode(){return this._store.getBoolean(r["g"].DEBUG_MODE)}set isDebugMode(e){this._store.storeValue(r["g"].DEBUG_MODE,e)}get useLightTheme(){return this._store.getBoolean(r["g"].USE_LIGHT_THEME)}set useLightTheme(e){this._store.storeValue(r["g"].USE_LIGHT_THEME,e)}get serverIndex(){const e=r["e"].indexOf(this.serverName);return e>-1?e:0}get serverName(){return this._store.getString(r["g"].DEFAULT_SERVER)||r["f"].Global}set serverName(e){this._store.storeValue(r["g"].DEFAULT_SERVER,e)}getUrlForServer(e){const t=`${r["g"].BASE_CONTENT_URL}${e}`;return this._store.getString(t)}setUrlForServer(e,t){const a=`${r["g"].BASE_CONTENT_URL}${e}`;return this._store.storeValue(a,t)}}t["a"]=new o(i)},2048:function(e,t,a){},"21bb":function(e,t,a){"use strict";var r=a("7a98"),n=a.n(r);n.a},"2f12":function(e,t,a){},5594:function(e,t,a){"use strict";(function(e){var r=a("731b"),n=a("25f1");t["a"]=Object(r["a"])(new n["a"](e))}).call(this,a("838c"))},"56d7":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",[a("top-app-bar",{on:{toggledrawer:function(t){e.showDrawer=!e.showDrawer}}}),a("left-nav-drawer",{model:{value:e.showDrawer,callback:function(t){e.showDrawer=t},expression:"showDrawer"}}),a("v-content",[a("router-view")],1),a("site-trackers")],1)},n=[],s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-navigation-drawer",{staticClass:"app-left-nav-drawer",attrs:{app:"",temporary:"","aria-hidden":(!e.showDrawer).toString()},model:{value:e.showDrawer,callback:function(t){e.showDrawer=t},expression:"showDrawer"}},[a("v-list-item",[a("v-list-item-content",[a("v-list-item-title",[e._v("\n\t\t\t\tBF Wiki Page Generator\n\t\t\t")])],1)],1),a("v-divider"),a("v-list",{attrs:{nav:""}},[e._l(e.routeConfig,(function(t){return[t.name?a("v-subheader",{key:t.name+"-header"},[e._v("\n\t\t\t\t"+e._s(t.name)+"\n\t\t\t")]):e._e(),a("v-list-item-group",{key:t.name+"-pages"},e._l(t.pages,(function(t){return a("v-list-item",{key:t.path,attrs:{to:t.path,tabindex:e.showDrawer?0:-1},on:{click:function(t){e.showDrawer=!1}}},[a("v-list-item-icon",[a("v-icon",{domProps:{textContent:e._s(t.listConfig.icon)}})],1),a("v-list-item-content",[a("v-list-item-title",{domProps:{textContent:e._s(t.name)}})],1)],1)})),1)]}))],2)],1)},i=[],o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{attrs:{id:"home-page-container"}},[a("section",[a("general-settings-card")],1),a("section",{staticClass:"d-flex"},[a("data-download-card")],1)])},l=[],c=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-card",{attrs:{width:"100%"}},[a("v-card-title",[e._v("Download Data")]),a("v-card-text",[a("data-download-selector",{attrs:{statisticsToken:e.statisticsToken},on:{updatestatistics:e.updateStatisticsToken},model:{value:e.dataPairsToConsider,callback:function(t){e.dataPairsToConsider=t},expression:"dataPairsToConsider"}})],1),a("v-card-actions",[a("v-btn",{attrs:{disabled:!e.hasPairs,color:"primary"},on:{click:e.startDownload}},[e._v("\n\t\t\tDownload\n\t\t")]),a("v-spacer"),a("v-btn",{attrs:{disabled:!e.hasPairs,outlined:"",color:"error"},on:{click:e.startDelete}},[e._v("\n\t\t\tDelete\n\t\t")])],1),a("multi-dialog",{attrs:{persistent:"",width:"500",slotsToExpose:e.dialogNamesArray},model:{value:e.activeDialog,callback:function(t){e.activeDialog=t},expression:"activeDialog"}},[a("v-card",{attrs:{slot:e.DIALOG_NAMES.DOWNLOAD},slot:e.DIALOG_NAMES.DOWNLOAD},[a("v-card-text",[a("database-download-progress",{attrs:{pairsToDownload:e.pairsToDownload},on:{finish:function(){return e.activeDialog=""}}})],1)],1),a("v-card",{attrs:{slot:e.DIALOG_NAMES.DELETE},slot:e.DIALOG_NAMES.DELETE},[a("v-card-text",[a("database-delete-progress",{attrs:{pairsToDelete:e.pairsToDelete},on:{finish:function(){return e.activeDialog=""}}})],1)],1)],1)],1)},u=[],d=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ul",{attrs:{id:"data-download-selector-list"}},[e._l(e.dataNameKeyPairs,(function(t){return a("li",{key:t.name},[a("v-layout",{staticClass:"mb-3",attrs:{row:"",wrap:"","align-baseline":""}},[a("v-flex",{attrs:{xs12:"",sm3:""}},[a("v-label",[e._v("\n\t\t\t\t\t"+e._s(t.name)+"\n\t\t\t\t")])],1),e._l(e.servers,(function(r){return a("v-flex",{key:r,attrs:{xs4:"",sm3:""}},[a("scoped-variables",{attrs:{pairKey:e.createPairKey(t.key,r)},scopedSlots:e._u([{key:"default",fn:function(n){var s=n.pairKey;return[e.blacklistedPairs.includes(s)?[a("v-checkbox",{attrs:{disabled:"",label:r,"aria-label":"Data for "+t.name+" of the "+r+" server is unavailable",hint:"Data unavailable.","persistent-hint":""}})]:[a("v-checkbox",{attrs:{value:s,disabled:e.blacklistedPairs.includes(s),label:r,"aria-label":"Select data for "+t.name+" of the "+r+" server",hint:e.getDataStatus(s),"persistent-hint":""},model:{value:e.pairsToDownload,callback:function(t){e.pairsToDownload=t},expression:"pairsToDownload"}})]]}}],null,!0)})],1)}))],2)],1)})),a("li",{staticClass:"py-2"},[a("v-layout",{attrs:{row:"",wrap:"","align-baseline":""}},[a("v-flex",{attrs:{xs12:"",sm3:""}},[a("v-label",[e._v("\n\t\t\t\t\tSelect All\n\t\t\t\t")])],1),e._l(e.servers,(function(t){return a("v-flex",{key:t,attrs:{xs4:"",sm3:""}},[a("v-btn",{attrs:{outlined:"","aria-label":"Select all data for "+t+" server"},on:{click:function(a){return e.addEntriesForServer(t)}}},[e._v("\n\t\t\t\t\t"+e._s(t)+"\n\t\t\t\t")])],1)}))],2)],1),a("li",{staticClass:"py-2 pl-0",attrs:{id:"clear-data-download-area"}},[a("v-btn",{attrs:{block:"",outlined:"",disabled:0===e.pairsToDownload.length},on:{click:function(t){e.pairsToDownload=[]}}},[e._v("\n\t\t\tClear Selection\n\t\t")])],1)],2)},p=[],h=a("aa51");function g(e,t){return e<t?-1:1}function f(e,t){let a=!1;return e.length===t.length&&(a=0===e.length||e.every(e=>t.includes(e))&&t.every(t=>e.includes(t))),a}var v=a("8213"),m=a("ba21"),b=a("5594"),w=a("ef1b"),y=a("0ac4");const _=Object(y["a"])("DataDownloadSelector");var D={components:{ScopedVariables:m["a"]},computed:{availableTablesPromise(){return this.$store.state.availableTablesPromise},blacklistedPairs(){return[this.createPairKey(h["a"].dictionary.key,h["f"].Europe),this.createPairKey(h["a"].dictionary.key,h["f"].Japan)]},dataNameKeyPairs(){return Object.keys(h["a"]).map(e=>({key:e,name:h["a"][e].name})).sort((e,t)=>g(e.name,t.name))},servers(){return h["e"].slice()}},created(){this.updatePairStatusMapping()},data(){return{pairStatusMapping:{},pairsToDownload:[]}},methods:{addEntriesForServer(e){const{dataNameKeyPairs:t,createPairKey:a,pairsToDownload:r}=this;t.forEach(({key:t})=>{const n=a(t,e);r.includes(n)||r.push(n)})},createPairKey(e,t){return Object(v["a"])(e,t)},getDataStatus(e){const t=this.pairStatusMapping[e];let a;return a=0===Object.keys(this.pairStatusMapping).length?"Loading data...":t>-1?`Updated ${Object(w["a"])(t)} ago (${t.toLocaleString()})`:"No data cached.",a},async updatePairStatusMapping(){this.pairStatusMapping={};const{statisticsToken:e}=this,t=await b["a"],a=await this.availableTablesPromise.then(e=>{_.debug("getting date info for following pairKeys",e);const a=new Set(e.map(e=>Object(v["b"])(e).table)),r=Array.from(a).map(e=>({table:e}));return t.getDateInformationForTableKeyPairs(r)});e===this.statisticsToken&&(this.pairStatusMapping=this.dataNameKeyPairs.reduce((e,{key:t})=>(h["e"].forEach(r=>{const n=Object(v["a"])(t,r);e[n]=a[n]||-1}),e),{}),_.debug({dateInfo:a,pairStatusMapping:this.pairStatusMapping}))}},props:{statisticsToken:{default:0,type:Number},value:{default:()=>[],type:Array}},watch:{availableTablesPromise(){this.$emit("updatestatistics")},pairsToDownload(e){const{blacklistedPairs:t}=this;e.some(e=>t.includes(e))?this.pairsToDownload=e.filter(e=>!t.includes(e)):f(e,this.value)||this.$emit("input",e)},statisticsToken(){this.updatePairStatusMapping()},value:{handler(e){this.pairsToDownload=Array.isArray(e)?e.slice():[]},immediate:!0}}},k=D,T=(a("6343"),a("2877")),S=a("6544"),E=a.n(S),L=a("8336"),C=a("ac7c"),x=a("0e8f"),P=a("24c9"),O=a("a722"),A=Object(T["a"])(k,d,p,!1,null,null,null),j=A.exports;E()(A,{VBtn:L["a"],VCheckbox:C["a"],VFlex:x["a"],VLabel:P["a"],VLayout:O["a"]});var V=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("progress-viewer",{attrs:{message:"Deleting data...",progress:-1}})},M=[],I=a("da02"),N=a("8e36");const $=Object(y["a"])("DeleteProgress");var G={components:{ProgressViewer:I["a"],VProgressLinear:N["a"]},methods:{async delete(){const{pairsToDelete:e}=this;if(e.length>0){const t=await b["a"];this.$emit("start");try{await t.deleteMultiple(e),this.currentProgress=100,$.debug("successfully deleted",e)}finally{this.$emit("finish")}}}},props:{pairsToDelete:{required:!0,type:Array}},watch:{pairsToDelete:{handler(e){e.length>0&&this.$store.commit("setAvailableTablesPromise",this.delete().then(()=>this.$store.dispatch("updateAvailableTables")))},immediate:!0}}},U=G,B=Object(T["a"])(U,V,M,!1,null,null,null),F=B.exports,K=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("progress-viewer",{attrs:{message:e.progressMessage,bufferProgress:e.currentProgress,progress:e.currentProgress}})},R=[],J=a("f2ec"),W=a("9db4");const H=Object(y["a"])("DownloadProgress");var z={components:{ProgressViewer:I["a"],VProgressLinear:N["a"]},data(){return{currentProgress:0,progressMessage:"Downloading data..."}},methods:{async download(){const{pairsToDownload:e}=this;if(e.length>0){const t=await Object(W["a"])();this.currentProgress=0,this.progressMessage="Downloading data...",this.$emit("start");try{const a=t(e);await new Promise((e,t)=>{a.subscribe(e=>{H.debug(e.loaded,e.total),this.progressMessage=e.message,this.currentProgress=e.loaded/e.total*100},e=>{this.progressMessage=`An error has occurred. [${e.toString?e.toString():e}]`,t(e)},()=>e())})}finally{H.debug("waiting for thread to terminate"),await J["a"].terminate(t),this.$emit("finish")}}}},props:{pairsToDownload:{required:!0,type:Array}},watch:{pairsToDownload:{handler(e){e.length>0&&this.$store.commit("setAvailableTablesPromise",this.download().then(()=>this.$store.dispatch("updateAvailableTables")))},immediate:!0}}},q=z,X=Object(T["a"])(q,K,R,!1,null,null,null),Q=X.exports,Y=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-dialog",e._b({attrs:{value:!!e.activeDialog},on:{input:function(){return e.activeDialog=""}}},"v-dialog",e.$attrs,!1),[e._l(e.slotsToExpose,(function(t){return[e.activeDialog===t?[e._t(t,[a("span",{key:t},[e._v("This is the slot for "+e._s(t))])])]:e._e()]}))],2)},Z=[],ee={data(){return{activeDialog:""}},props:{slotsToExpose:{required:!0,type:Array},value:{default:"",type:String}},watch:{activeDialog(e){this.value!==e&&this.$emit("input",e)},value:{handler(e){this.activeDialog!==e&&(this.activeDialog=e)},immediate:!0}}},te=ee,ae=a("169a"),re=Object(T["a"])(te,Y,Z,!1,null,null,null),ne=re.exports;E()(re,{VDialog:ae["a"]});var se={components:{DataDownloadSelector:j,DatabaseDeleteProgress:F,DatabaseDownloadProgress:Q,MultiDialog:ne},computed:{DIALOG_NAMES:()=>Object.freeze({DELETE:"delete",DOWNLOAD:"download"}),dialogNamesArray(){return Object.values(this.DIALOG_NAMES)},hasPairs(){return this.dataPairsToConsider.length>0}},data(){return{activeDialog:"",dataPairsToConsider:[],pairsToDelete:[],pairsToDownload:[],statisticsToken:0}},methods:{startDelete(){this.activeDialog=this.DIALOG_NAMES.DELETE,this.pairsToDelete=this.dataPairsToConsider.map(e=>{const[t,a]=e.split("-");return{key:a,table:t}})},startDownload(){this.activeDialog=this.DIALOG_NAMES.DOWNLOAD,this.pairsToDownload=this.dataPairsToConsider.map(e=>{const[t,a]=e.split("-");return{key:t,server:a}})},updateStatisticsToken(){this.statisticsToken=Date.now()}},watch:{activeDialog(e,t){t!==this.DIALOG_NAMES.DOWNLOAD&&t!==this.DIALOG_NAMES.DELETE||(this.updateStatisticsToken(),this.dataPairsToConsider=[])}}},ie=se,oe=a("b0af"),le=a("99d9"),ce=a("2fa4"),ue=Object(T["a"])(ie,c,u,!1,null,null,null),de=ue.exports;E()(ue,{VBtn:L["a"],VCard:oe["a"],VCardActions:le["a"],VCardText:le["b"],VCardTitle:le["c"],VSpacer:ce["a"]});var pe=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-card",{staticClass:"general-settings-card"},[a("v-card-title",[e._v("General Settings")]),a("v-card-text",[a("form",[a("v-container",{staticClass:"pt-0",attrs:{fluid:""}},[a("v-row",{staticClass:"settings-row",attrs:{align:"baseline"}},[a("v-label",[e._v("\n\t\t\t\t\t\tLight Mode\n\t\t\t\t\t")]),a("v-switch",{staticClass:"ml-2",attrs:{"aria-label":"Light Mode","hide-details":""},model:{value:e.isLightTheme,callback:function(t){e.isLightTheme=t},expression:"isLightTheme"}})],1),a("v-row",{staticClass:"settings-row",attrs:{align:"baseline"}},[a("v-label",[a("span",{staticClass:"pr-1"},[e._v("Default Server")]),a("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(t){var r=t.on;return[a("v-icon",e._g({},r),[e._v("fa-question-circle")])]}}])},[a("span",[e._v("When viewing data pages, it will default to this server.")])])],1),a("v-btn-toggle",{staticClass:"ml-2",attrs:{"aria-label":"Default Server",name:"active-server",mandatory:""},model:{value:e.defaultServerIndex,callback:function(t){e.defaultServerIndex=t},expression:"defaultServerIndex"}},e._l(e.serverNameValuePairs,(function(t){return a("v-btn",{key:t.value,attrs:{text:""}},[e._v("\n\t\t\t\t\t\t\t"+e._s(t.name)+"\n\t\t\t\t\t\t")])})),1)],1),a("v-row",{staticClass:"settings-row",attrs:{align:"baseline"}},[a("v-text-field",{attrs:{label:"Content URL",placeholder:e.defaultContentUrl,hint:"Leave blank to use application default.","persistent-hint":""},on:{change:e.changeContentUrl},model:{value:e.contentUrl,callback:function(t){e.contentUrl=t},expression:"contentUrl"}})],1)],1)],1)])],1)},he=[],ge=a("0dc8");function fe(){return ge["a"].getUrlForServer(ge["a"].serverName)}var ve={beforeDestroy(){ge["a"].store.removeEventListener(this)},beforeMount(){ge["a"].store.addEventListener(this,()=>{const e=ge["a"].useLightTheme;!!e!==this.isLightTheme&&(this.isLightTheme=e);const t=ge["a"].serverIndex;t!==this.defaultServerIndex&&(this.defaultServerIndex=t);const a=fe();a!==this.contentUrl&&(this.contentUrl=a)})},computed:{defaultContentUrl(){return h["b"][h["e"][this.defaultServerIndex]]},serverNameValuePairs(){return h["e"].map(e=>({name:h["f"][e],value:e}))}},data(){return{contentUrl:fe(),defaultServerIndex:ge["a"].serverIndex,isLightTheme:ge["a"].useLightTheme}},methods:{changeContentUrl(){const{contentUrl:e}=this,t=fe();e!==t&&ge["a"].setUrlForServer(ge["a"].serverName,e)}},watch:{defaultServerIndex(e){const t=h["e"][e],a=ge["a"].serverIndex;t?a!==e&&(ge["a"].serverName=t,this.contentUrl=ge["a"].getUrlForServer(t)):this.defaultServerIndex=0},isLightTheme(e){const t=ge["a"].useLightTheme;t!==!!e&&(ge["a"].useLightTheme=!!e)}}},me=ve,be=(a("87b6"),a("a609")),we=a("a523"),ye=a("132d"),_e=a("0fd9"),De=a("b73d"),ke=a("8654"),Te=a("3a2f"),Se=Object(T["a"])(me,pe,he,!1,null,null,null),Ee=Se.exports;E()(Se,{VBtn:L["a"],VBtnToggle:be["a"],VCard:oe["a"],VCardText:le["b"],VCardTitle:le["c"],VContainer:we["a"],VIcon:ye["a"],VLabel:P["a"],VRow:_e["a"],VSwitch:De["a"],VTextField:ke["a"],VTooltip:Te["a"]});var Le={components:{DataDownloadCard:de,GeneralSettingsCard:Ee},created(){this.$store.commit("setTitleOverride","BF Wiki Page Generator - Home")}},Ce=Le,xe=(a("21bb"),Object(T["a"])(Ce,o,l,!1,null,null,null)),Pe=xe.exports;E()(xe,{VContainer:we["a"]});const Oe=[{component:()=>a.e("generators").then(a.bind(null,"5104")),listConfig:{hidden:!0},name:"Generators Home",path:"/generators"},{component:()=>a.e("generators").then(a.bind(null,"bc2b")),listConfig:{icon:"fa-users"},name:"Unit Generator",path:"/generators/units"},{component:()=>a.e("generators").then(a.bind(null,"5d84")),listConfig:{hidden:!0},name:"Unit Generator - Loading...",path:"/generators/units/:id"},{component:()=>a.e("generators").then(a.bind(null,"b51d")),listConfig:{icon:"fa-shield-alt"},name:"Item Generator",path:"/generators/items"},{component:()=>a.e("generators").then(a.bind(null,"b272")),listConfig:{hidden:!0},name:"Item Generator - Loading...",path:"/generators/items/:id"},{component:()=>a.e("generators").then(a.bind(null,"b63b")),listConfig:{icon:"fa-tablet"},name:"Extra Skill Generator",path:"/generators/extra-skills"},{component:()=>a.e("generators").then(a.bind(null,"7608")),listConfig:{hidden:!0},name:"Extra Skill Generator - Loading...",path:"/generators/extra-skills/:id"},{component:()=>a.e("generators").then(a.bind(null,"2234")),listConfig:{icon:"fa-skull"},name:"Burst Generator",path:"/generators/bursts"},{component:()=>a.e("generators").then(a.bind(null,"d724")),listConfig:{hidden:!0},name:"Burst Generator - Loading...",path:"/generators/bursts/:id"}];var Ae=Oe.map(e=>(e.listConfig.parent="Page Generators",e)),je=[{component:Pe,listConfig:{icon:"fa-home"},name:"Home",path:"/"},...Ae],Ve={computed:{routeConfig(){const e=[void 0],t=je.filter(e=>e.listConfig&&!e.listConfig.hidden);return t.forEach(t=>{e.includes(t.listConfig.parent)||e.push(t.listConfig.parent)}),e.map(e=>({name:e,pages:t.filter(t=>t.listConfig.parent===e)}))}},data(){return{showDrawer:!1}},props:{value:{default:!1,type:Boolean}},watch:{showDrawer(e){e!==this.value&&this.$emit("input",e)},value:{handler(e){!!e!==this.showDrawer&&(this.showDrawer=!!e)},immediate:!0}}},Me=Ve,Ie=(a("74e3"),a("ce7e")),Ne=a("8860"),$e=a("da13"),Ge=a("5d23"),Ue=a("1baa"),Be=a("34c3"),Fe=a("f774"),Ke=a("e0c7"),Re=Object(T["a"])(Me,s,i,!1,null,null,null),Je=Re.exports;E()(Re,{VDivider:Ie["a"],VIcon:ye["a"],VList:Ne["a"],VListItem:$e["a"],VListItemContent:Ge["a"],VListItemGroup:Ue["a"],VListItemIcon:Be["a"],VListItemTitle:Ge["b"],VNavigationDrawer:Fe["a"],VSubheader:Ke["a"]});var We=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("noscript",{staticStyle:{display:"none"}},[e._v("Can't load site trackers.")])},He=[],ze={methods:{appendScript(e){return new Promise((function(t,a){const r=document.createElement("script");r.src=e,r.onload=()=>{t()},r.onerror=a,document.body.appendChild(r)}))},async loadGoogleAnalyticsTracker(){function e(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],e("js",new Date),e("config","UA-80417877-1"),await this.appendScript("https://www.googletagmanager.com/gtag/js?id=UA-80417877-1")},async loadStatCounterTracker(){window.sc_project=window.sc_project||11034084,window.sc_invisible=window.sc_invisible||1,window.sc_security=window.sc_security||"3e7dba9f",await this.appendScript("https://secure.statcounter.com/counter/counter.js")}},mounted(){this.loadGoogleAnalyticsTracker(),this.loadStatCounterTracker()}},qe=ze,Xe=Object(T["a"])(qe,We,He,!1,null,null,null),Qe=Xe.exports,Ye=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app-bar",{attrs:{app:""}},[a("v-app-bar-nav-icon",{attrs:{"aria-label":"Display Navigation Drawer"},on:{click:function(t){return t.stopPropagation(),e.$emit("toggledrawer")}}}),a("v-toolbar-title",{staticClass:"headline"},[e._v("\n\t\t"+e._s(e.toolbarTitle)+"\n\t")]),a("v-spacer"),a("v-divider",{attrs:{vertical:""}}),a("v-btn",{attrs:{"aria-label":"Go to the GitHub Repository",icon:"",href:"https://github.com/BluuArc/bfwiki-page-generator",target:"_blank",rel:"noopener"}},[a("v-icon",[e._v("fab fa-github")])],1),a("v-btn",{attrs:{"aria-label":"Join the Discord Server",icon:"",href:"https://discord.gg/8rUdRfr",target:"_blank",rel:"noopener"}},[a("v-icon",[e._v("fab fa-discord")])],1),a("v-btn",{attrs:{"aria-label":"Go to the Brave Frontier Global Wiki",icon:"",href:"https://bravefrontierglobal.fandom.com/wiki/Brave_Frontier_Wiki",target:"_blank",rel:"noopener"}},[a("v-icon",[e._v("fa-link")])],1)],1)},Ze=[],et={computed:{toolbarTitle(){return this.$store.state.titleOverride||this.$route.name}},watch:{toolbarTitle:{handler(e){e&&(document.title=e)},immediate:!0}}},tt=et,at=a("40dc"),rt=a("5bc1"),nt=a("2a7f"),st=Object(T["a"])(tt,Ye,Ze,!1,null,null,null),it=st.exports;E()(st,{VAppBar:at["a"],VAppBarNavIcon:rt["a"],VBtn:L["a"],VDivider:Ie["a"],VIcon:ye["a"],VSpacer:ce["a"],VToolbarTitle:nt["a"]});var ot={beforeMount(){const e=document.querySelector("html");e.classList.add("page-html")},components:{LeftNavDrawer:Je,SiteTrackers:Qe,TopAppBar:it},async created(){ge["a"].store.addEventListener(this,()=>{const e=ge["a"].useLightTheme;!e!==this.$vuetify.theme.dark&&(this.$vuetify.theme.dark=!e)});const e=Object(y["a"])("APP");ge["a"].isDebugMode&&(e.debug("Debug Mode enabled. Adding debug object to window._bfDebug"),window._bfDebug={appLocalStorageStore:ge["a"],context:this,dbWorker:await b["a"],logger:Object(y["a"])("DevTools")})},data:()=>({showDrawer:!1}),name:"App"},lt=ot,ct=(a("5c0b"),a("7496")),ut=a("a75b"),dt=Object(T["a"])(lt,r,n,!1,null,null,null),pt=dt.exports;E()(dt,{VApp:ct["a"],VContent:ut["a"]});var ht=a("2b0e"),gt=a("8c4f");ht["a"].use(gt["a"]);var ft=new gt["a"]({routes:je}),vt=a("2f62");ht["a"].use(vt["a"]);const mt=new vt["a"].Store({actions:{async updateAvailableTables(e){const t=Object.values(h["a"]).reduce((e,t)=>(e.push({keys:h["e"],table:t.key}),e),[]),a=b["a"].then(e=>e.getCachedServersInTables(t));return e.commit("setAvailableTablesPromise",a),a}},mutations:{setAvailableTablesPromise(e,t){e.availableTablesPromise=t},setTitleOverride(e,t){e.titleOverride=t}},state:{availableTablesPromise:Promise.resolve([]),titleOverride:""}});mt.dispatch("updateAvailableTables");var bt=mt,wt=a("f309");ht["a"].use(wt["a"]);var yt=new wt["a"]({icons:{iconfont:"fa"},theme:{dark:!ge["a"].useLightTheme,themes:{dark:{error:"#FF9999"},light:{primary:"#ee44aa",secondary:"#424242",accent:"#82B1FF",error:"#FF5252",info:"#2196F3",success:"#4CAF50",warning:"#FFC107"}}}});a("d5e8"),a("15f5");ht["a"].config.productionTip=!1,new ht["a"]({render:e=>e(pt),router:ft,store:bt,vuetify:yt}).$mount("#app")},"5c0b":function(e,t,a){"use strict";var r=a("e332"),n=a.n(r);n.a},6343:function(e,t,a){"use strict";var r=a("fbe4"),n=a.n(r);n.a},"74e3":function(e,t,a){"use strict";var r=a("2f12"),n=a.n(r);n.a},"7a98":function(e,t,a){},8213:function(e,t,a){"use strict";function r(e,t){return`${e}-${t}`}function n(e){const[t,a]=e.split("-");return{server:a,table:t}}a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return n}))},"838c":function(e,t,a){e.exports=a.p+"js/0-legacy.41f4c76f.worker.js"},"87b6":function(e,t,a){"use strict";var r=a("2048"),n=a.n(r);n.a},"9db4":function(e,t,a){"use strict";(function(e){a.d(t,"a",(function(){return s}));var r=a("731b"),n=a("25f1");function s(){return Object(r["a"])(new n["a"](e))}}).call(this,a("9f4f"))},"9f4f":function(e,t,a){e.exports=a.p+"js/1-legacy.aadd78ba.worker.js"},aa51:function(e,t,a){"use strict";a.d(t,"f",(function(){return r})),a.d(t,"e",(function(){return n})),a.d(t,"a",(function(){return s})),a.d(t,"d",(function(){return i})),a.d(t,"g",(function(){return o})),a.d(t,"b",(function(){return l})),a.d(t,"c",(function(){return c}));const r=Object.freeze({EU:"Europe",Europe:"EU",GL:"Global",Global:"GL",JP:"Japan",Japan:"JP"}),n=Object.freeze([r.Global,r.Europe,r.Japan]),s=Object.freeze({bursts:{files:new Array(10).fill(0).map((e,t)=>`bbs_${t}.json`),key:"bursts",name:"Brave Bursts"},dictionary:{files:["dictionary.json"],key:"dictionary",name:"Dictionary"},evolutionMaterials:{files:["evo_list.json"],key:"evolutionMaterials",name:"Evolution Materials"},extraSkills:{files:["es.json"],key:"extraSkills",name:"Extra Skills"},items:{files:["items.json"],key:"items",name:"Items"},leaderSkills:{files:["ls.json"],key:"leaderSkills",name:"Leader Skills"},missions:{files:["missions.json"],key:"missions",name:"Missions"},spEnhancements:{files:["feskills.json"],key:"spEnhancements",name:"SP Enhancements"},units:{files:["info.json"],key:"units",name:"Units"}}),i=Object.freeze({[s.bursts.key]:[s.bursts.key,s.units.key],[s.extraSkills.key]:[s.extraSkills.key],[s.items.key]:[s.items.key,s.dictionary.key],[s.units.key]:[s.units.key,s.spEnhancements.key,s.dictionary.key,s.evolutionMaterials.key]}),o=Object.freeze({BASE_CONTENT_URL:"url-",DEBUG_MODE:"debugMode",DEFAULT_SERVER:"defaultServer",USE_LIGHT_THEME:"useLightTheme"}),l=Object.freeze({EU:"http://static-bravefrontier.gumi-europe.net/content",GL:"https://dv5bk1m8igv7v.cloudfront.net/asset/21600/content",JP:"http://cdn.android.brave.a-lim.jp"}),c=Object.freeze({JSON_EXPLORER:"JSON Explorer",WIKI_TEMPLATE:"Wiki Template"})},ba21:function(e,t,a){"use strict";var r,n,s={functional:!0,render(e,t){return t.scopedSlots.default(t.props)}},i=s,o=a("2877"),l=Object(o["a"])(i,r,n,!1,null,null,null);t["a"]=l.exports},da02:function(e,t,a){"use strict";var r=function(e,t){var a=t._c;return a("section",{staticClass:"text-center"},[a("p",{domProps:{textContent:t._s(t.props.message)}}),t.props.progress<0?a("v-progress-linear",{attrs:{indeterminate:""}}):a("v-progress-linear",{attrs:{"buffer-value":t.props.bufferProgress,value:t.props.progress,stream:""}})],1)},n=[],s=a("2877"),i=a("6544"),o=a.n(i),l=a("8e36"),c={},u=Object(s["a"])(c,r,n,!0,null,null,null);t["a"]=u.exports;o()(u,{VProgressLinear:l["a"]})},e332:function(e,t,a){},fbe4:function(e,t,a){}});
//# sourceMappingURL=app-legacy.d9eb0ce3.js.map