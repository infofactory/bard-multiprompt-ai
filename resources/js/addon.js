import AIMenu from "./components/bard/AIMenu.vue";
import { createBardMultipromptAiPlugin } from "./plugin";
const { Extension } = Statamic.$bard.tiptap.core;

Statamic.$bard.addExtension(() => Extension.create({
  name: 'bard-multiprompt-ai',
  addCommands() {
    return {
      showAIPanel: (prompt) => ({ editor }) => {
        // Show the AIPanel component with event bus
        Statamic.$events.$emit('bard-multiprompt-ai-show-panel', prompt);
        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      createBardMultipromptAiPlugin({
        editor: this.editor
      })
    ]
  }
}));

Statamic.$bard.buttons((buttons, button) => {
  return button({
    name: 'bard-multiprompt-ai',
    text: __('bard-multiprompt-ai::cp.button'),
    html: '<svg version="1.1" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="m254.48 156.11a9.3682 9.3682 0 0 1-9.3682 9.3682h-18.736v18.736a9.3682 9.3682 0 0 1-18.736 0v-18.736h-18.736a9.3682 9.3682 0 0 1 0-18.736h18.736v-18.736a9.3682 9.3682 0 0 1 18.736 0v18.736h18.736a9.3682 9.3682 0 0 1 9.3682 9.3682zm-224.84-93.682h18.736v18.736a9.3682 9.3682 0 0 0 18.736 0v-18.736h18.736a9.3682 9.3682 0 0 0 0-18.736h-18.736v-18.736a9.3682 9.3682 0 0 0-18.736 0v18.736h-18.736a9.3682 9.3682 0 0 0 0 18.736zm149.89 140.52h-9.3682v-9.3682a9.3682 9.3682 0 0 0-18.736 0v9.3682h-9.3682a9.3682 9.3682 0 0 0 0 18.736h9.3682v9.3682a9.3682 9.3682 0 0 0 18.736 0v-9.3682h9.3682a9.3682 9.3682 0 0 0 0-18.736zm41.349-131.15-163.14 163.14a18.736 18.736 0 0 1-26.489 0l-24.24-24.217a18.736 18.736 0 0 1 0-26.5l163.15-163.14a18.736 18.736 0 0 1 26.5 0l24.217 24.217a18.736 18.736 0 0 1 0 26.5zm-13.244-13.244-24.229-24.229-37.473 37.473 24.229 24.229z" fill="currentColor"/></svg>',
    component: AIMenu
  });
});
