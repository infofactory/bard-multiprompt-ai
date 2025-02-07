const { Plugin, PluginKey } = Statamic.$bard.tiptap.pm.state;

export const plugin_key = new PluginKey('bard-multiprompt-ai')

class LoadingView {
  constructor(editorView) {
    this.overlay = document.createElement('div')
    this.overlay.className = 'bard-multiprompt-ai-loading-overlay'
    editorView.dom.parentNode.appendChild(this.overlay)
  }

  update(view, prevState) {
    const state = plugin_key.getState(view.state)
    if (state.showOverlay !== plugin_key.getState(prevState).isLoading) {
      this.overlay.style.display = state.isLoading ? 'block' : 'none'
    }
  }

  destroy() {
    this.overlay.remove()
  }
}


export function createBardMultipromptAiPlugin() {
  return new Plugin({
    key: plugin_key,
    state: {
      init() {
        return { isLoading: false }
      },
      apply(tr, set) {
        const meta = tr.getMeta(plugin_key)
        if (meta && typeof meta.isLoading !== 'undefined') {
          return { isLoading: meta.isLoading }
        }
        return set
      }
    },
    view(editorView) {
      return new LoadingView(editorView)
    }
  })
}
