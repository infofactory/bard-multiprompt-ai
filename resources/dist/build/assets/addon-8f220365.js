const{Plugin:g,PluginKey:v}=Statamic.$bard.tiptap.pm.state,d=new v("bard-multiprompt-ai");class _{constructor(t){this.overlay=document.createElement("div"),this.overlay.className="bard-multiprompt-ai-loading-overlay",t.dom.parentNode.appendChild(this.overlay)}update(t,o){const r=d.getState(t.state);r.showOverlay!==d.getState(o).isLoading&&(this.overlay.style.display=r.isLoading?"block":"none")}destroy(){this.overlay.remove()}}function w(){return new g({key:d,state:{init(){return{isLoading:!1}},apply(e,t){const o=e.getMeta(d);return o&&typeof o.isLoading<"u"?{isLoading:o.isLoading}:t}},view(e){return new _(e)}})}function b(e,t,o,r,i,p,m,h){var s=typeof e=="function"?e.options:e;t&&(s.render=t,s.staticRenderFns=o,s._compiled=!0),r&&(s.functional=!0),p&&(s._scopeId="data-v-"+p);var n;if(m?(n=function(a){a=a||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!a&&typeof __VUE_SSR_CONTEXT__<"u"&&(a=__VUE_SSR_CONTEXT__),i&&i.call(this,a),a&&a._registeredComponents&&a._registeredComponents.add(m)},s._ssrRegister=n):i&&(n=h?function(){i.call(this,(s.functional?this.parent:this).$root.$options.shadowRoot)}:i),n)if(s.functional){s._injectStyles=n;var l=s.render;s.render=function(f,u){return n.call(u),l(f,u)}}else{var c=s.beforeCreate;s.beforeCreate=c?[].concat(c,n):[n]}return{exports:e,options:s}}const{DOMParser:T,DOMSerializer:L}=Statamic.$bard.tiptap.pm.model,y={mixins:[BardToolbarButton],data(){return{dropdown:!1,portalTarget:`bard-multiprompt-ai-${this._uid}`,selectionFrom:null,selectionTo:null,prompts:[]}},mounted:function(){this.fetchPrompts()},methods:{async fetchPrompts(){try{const t=await(await fetch("/!/bard-multiprompt-ai")).json();this.prompts=[],this.prompts.push(...t.data)}catch(e){Statamic.$toast.error(e.message)}},async generate(e,t){e.preventDefault(),this.closeDropdown(),this.editor.setEditable(!1);const o=this.editor.state.tr.setMeta(d,{isLoading:!0});this.editor.view.dispatch(o);const r=this.editor.view.state.selection;r.empty?(this.selectionFrom=0,this.selectionTo=this.editor.state.doc.content.size):(this.selectionFrom=r.from,this.selectionTo=r.to);const i=this.editor.state.doc.cut(this.selectionFrom,this.selectionTo),p=this.fragmentToHTML(i.content);try{const n=(await(await fetch("/!/bard-multiprompt-ai/generate",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":StatamicConfig.csrfToken},body:JSON.stringify({prompt_id:t,html:p})})).json()).data;if(n.error)throw new Error(n.error);if(!n.html)throw new Error("AI response not generated");if(n.generation_mode==="replace"){const l=this.htmlToFragment(n.html),c=this.editor.state.tr.replaceRange(this.selectionFrom,this.selectionTo,l);this.editor.view.dispatch(c)}else if(n.generation_mode==="continue"){const l=this.htmlToFragment(n.html),c=this.editor.state.tr.replaceRange(this.selectionTo,this.selectionTo,l);this.editor.view.dispatch(c)}}catch(h){Statamic.$toast.error(h.message)}const m=this.editor.state.tr.setMeta(d,{isLoading:!1});this.editor.view.dispatch(m),this.editor.setEditable(!0)},fragmentToHTML(e){const o=L.fromSchema(this.editor.schema).serializeFragment(e.content),r=document.createElement("div");return r.appendChild(o),r.innerHTML},htmlToFragment(e){const t=document.createElement("div");return t.innerHTML=e,T.fromSchema(this.editor.schema).parseSlice(t)},closeDropdown(){this.$refs.dropdown.close(),this.dropdown=!1}}};var C=function(){var t=this,o=t._self._c;return o("span",[o("v-portal",{attrs:{disabled:!t.dropdown,to:t.portalTarget}},[o("div",{directives:[{name:"show",rawName:"v-show",value:t.dropdown,expression:"dropdown"}],staticClass:"popover-content bg-white dark:bg-dark-550 shadow-popover dark:shadow-dark-popover rounded-md"},[t._l(t.prompts,function(r){return[o("a",{staticClass:"flex items-center",attrs:{href:"#"},on:{click:function(i){return t.generate(i,r.id)}}},[t._v(" "+t._s(r.name)+" ")])]})],2)]),o("popover",{ref:"dropdown",attrs:{placement:"bottom-start"},on:{opened:function(r){t.dropdown=!0},closed:function(r){t.dropdown=!1}},scopedSlots:t._u([{key:"trigger",fn:function(){return[o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.button.text,expression:"button.text"}],staticClass:"bard-toolbar-button",domProps:{innerHTML:t._s(t.button.html)}})]},proxy:!0}])},[o("portal-target",{staticClass:"popover-container dropdown-list",attrs:{name:t.portalTarget}})],1)],1)},S=[],M=b(y,C,S,!1,null,null,null,null);const $=M.exports,{Extension:F}=Statamic.$bard.tiptap.core;Statamic.$bard.addExtension(()=>F.create({name:"bard-multiprompt-ai",addProseMirrorPlugins(){return[w()]}}));Statamic.$bard.buttons((e,t)=>t({name:"bard-multiprompt-ai",text:__("bard-multiprompt-ai::cp.button"),html:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z" fill="currentColor"/></svg>',component:$}));
