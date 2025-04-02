<template>
  <span>
    <v-portal :disabled="!dropdown" :to="portalTarget">
      <div v-show="dropdown"
        class="popover-content bg-white dark:bg-dark-550 shadow-popover dark:shadow-dark-popover rounded-md">
        <template v-for="prompt in prompts">
          <a class="flex items-center" href="#" @click="generate($event, prompt)">
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
import AIService from '../../service';

export default {
  mixins: [BardToolbarButton],
  data() {
    return {
      dropdown: false,
      portalTarget: `bard-multiprompt-ai-${this._uid}`,
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

    async generate(ev, prompt) {
      ev.preventDefault();

      this.closeDropdown();
      if (prompt.variables && prompt.variables.length > 0) {
        // Use showAIPanel command from the Extension
        this.editor.commands.showAIPanel(prompt);
        return;
      }

      // Get the current selection
      const selection = this.editor.view.state.selection;
      const selectionFrom = selection.empty ? 0 : selection.from;
      const selectionTo = selection.empty ? this.editor.state.doc.content.size : selection.to;

      // Use the AIService to generate content
      await AIService.generate({
        editor: this.editor,
        prompt,
        selectionFrom,
        selectionTo
      });
    },

    closeDropdown() {
      this.$refs.dropdown.close();
      this.dropdown = false;
    }
  }
}
</script>