const { Plugin, PluginKey } = Statamic.$bard.tiptap.pm.state;
import Vue from 'vue';
import AIPanel from './components/bard/AIPanel.vue';

export const pluginKey = new PluginKey('bard-multiprompt-ai');

class BardMultipromptAIView {
  constructor(editorView, options) {
    this.editor = options.editor;
    this.view = editorView;
    this.currentPrompt = null;

    // Create wrapper element
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'bard-multiprompt-ai-wrapper';
    this.wrapper.style.display = 'none';
    this.view.dom.parentNode.appendChild(this.wrapper);

    // Create overlay element
    this.overlay = document.createElement('div');
    this.overlay.className = 'bard-multiprompt-ai-overlay';
    this.wrapper.appendChild(this.overlay);

    // Create panel container
    this.panelContainer = document.createElement('div');
    this.panelContainer.className = 'bard-multiprompt-ai-panel-container';
    this.wrapper.appendChild(this.panelContainer);

    // Create Vue instance for the panel
    this.vm = new Vue({
      el: this.panelContainer,
      render: h => h(AIPanel, {
        props: {
          editor: this.editor
        },
        ref: 'panel'
      })
    });

    // Store the panel component reference
    this.panel = this.vm.$refs.panel;

    // Listen for events to show the panel
    Statamic.$events.$on('bard-multiprompt-ai-show-panel', this.showPanel);
    this.overlay.addEventListener('click', this.closePanel);
  }

  showPanel = (prompt) => {
    if (this.panel) {
      this.currentPrompt = prompt;
      this.panel.showPanel(prompt);
    }
  }

  closePanel = () => {
    if (this.panel) {
      this.panel.closePanel();
      this.currentPrompt = null;
    }
  }

  update(view, prevState) {
    const state = pluginKey.getState(view.state);
    const prevPluginState = pluginKey.getState(prevState);

    const isLoadingChanged = state.isLoading !== prevPluginState.isLoading
    const showPanelChanged = state.showPanel !== prevPluginState.showPanel

    if (isLoadingChanged || showPanelChanged) {
      if (state.isLoading || state.showPanel) {
        this.wrapper.style.display = 'block';
      } else {
        this.wrapper.style.display = 'none';
      }
    }

    if (isLoadingChanged) {
      if (state.isLoading) {
        this.overlay.classList.add('generating');
      } else {
        this.overlay.classList.remove('generating');
      }
    }
  }

  destroy() {
    Statamic.$events.$off('bard-multiprompt-ai-show-panel', this.showPanel);
    if (this.vm) {
      this.vm.$destroy();
    }
    if (this.overlay) {
      this.overlay.removeEventListener('click', this.closePanel);
      this.overlay.remove();
    }
    if (this.wrapper) {
      this.wrapper.remove();
    }
  }
}

export function createBardMultipromptAiPlugin(options = {}) {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return {
          isLoading: false,
          showPanel: false
        };
      },
      apply(tr, state) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          return {
            ...state,
            ...meta
          };
        }
        return state;
      }
    },
    view(editorView) {
      return new BardMultipromptAIView(editorView, options);
    }
  });
}