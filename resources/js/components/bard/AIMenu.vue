<template>
  <span>
    <v-portal :disabled="!dropdown" :to="portalTarget">
      <div v-show="dropdown"
        class="popover-content bg-white dark:bg-dark-550 shadow-popover dark:shadow-dark-popover rounded-md">
        <template v-for="prompt in prompts">
          <a class="flex items-center" href="#" @click="generate($event, prompt.id)">
            {{ prompt.name }}
          </a>
        </template>
      </div>
    </v-portal>

    <popover ref="dropdown" placement="bottom-start" @opened="dropdown = true" @closed="dropdown = false">
      <template #trigger>
        <button class="bard-toolbar-button" v-html="button.html" v-tooltip="button.text"></button>
      </template>
      <portal-target :name="portalTarget" class="popover-container dropdown-list" />
    </popover>
  </span>
</template>

<script>
import { plugin_key } from '../../plugin';
const { DOMParser, DOMSerializer } = Statamic.$bard.tiptap.pm.model;

export default {
  mixins: [BardToolbarButton],
  data() {
    return {
      dropdown: false,
      portalTarget: `bard-multiprompt-ai-${this._uid}`,
      selectionFrom: null,
      selectionTo: null,
      prompts: []
    }
  },
  mounted: function () {
    this.fetchPrompts();
  },
  methods: {
    async fetchPrompts() {
      try {
        const request = await fetch('/!/bard-multiprompt-ai');
        const response = await request.json();
        this.prompts = [];
        this.prompts.push(...response.data);
      } catch (error) {
        Statamic.$toast.error(error.message);
      }
    },
    async generate(ev, prompt_id) {
      ev.preventDefault();
      this.closeDropdown();
      this.editor.setEditable(false);
      // Show loading overlay
      const showLoadingTr = this.editor.state.tr.setMeta(plugin_key, { isLoading: true })
      this.editor.view.dispatch(showLoadingTr);

      const selection = this.editor.view.state.selection;
      if (selection.empty) {
        this.selectionFrom = 0;
        this.selectionTo = this.editor.state.doc.content.size;
      } else {
        this.selectionFrom = selection.from;
        this.selectionTo = selection.to;
      }

      // Get the selected text in HTML
      const selectedText = this.editor.state.doc.cut(this.selectionFrom, this.selectionTo);
      const html = this.fragmentToHTML(selectedText.content);

      try {
        const request = await fetch('/!/bard-multiprompt-ai/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': StatamicConfig.csrfToken
          },
          body: JSON.stringify({
            prompt_id,
            html
          }),
        });
        const response = await request.json();
        const data = response.data;

        if (data.error) {
          throw new Error(data.error);
        }

        if (!data.html) {
          throw new Error('AI response not generated');
        }

        if (data.generation_mode === 'replace') {
          const fragment = this.htmlToFragment(data.html);
          const replaceTr = this.editor.state.tr.replaceRange(this.selectionFrom, this.selectionTo, fragment)
          this.editor.view.dispatch(replaceTr);
        } else if (data.generation_mode === 'continue') {
          const fragment = this.htmlToFragment(data.html);
          const insertTr = this.editor.state.tr.replaceRange(this.selectionTo, this.selectionTo, fragment);
          this.editor.view.dispatch(insertTr);
        }
      } catch (error) {
        Statamic.$toast.error(error.message);
      }

      // Hide loading overlay
      const hideLoadingTr = this.editor.state.tr.setMeta(plugin_key, { isLoading: false })
      this.editor.view.dispatch(hideLoadingTr);
      this.editor.setEditable(true);
    },

    fragmentToHTML(fragment) {
      const serializer = DOMSerializer.fromSchema(this.editor.schema);
      const domFragment = serializer.serializeFragment(fragment.content);
      const tempDiv = document.createElement('div')
      tempDiv.appendChild(domFragment)
      const html = tempDiv.innerHTML;
      return html
    },

    htmlToFragment(html) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      const parser = DOMParser.fromSchema(this.editor.schema);
      const documentSlice = parser.parseSlice(tempDiv)
      return documentSlice;
    },

    closeDropdown() {
      this.$refs.dropdown.close();
      this.dropdown = false;
    }
  }
}
</script>

<style>
.bard-multiprompt-ai-loading-overlay {
  display: none;
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 1000;
}
</style>
