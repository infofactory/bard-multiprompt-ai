<template>
  <div class="ai-panel" v-show="isVisible">
    <div class="card p-4 shadow-lg rounded-md"
      style="width: 400px; max-width: 90vw;">
      <h2 class="text-base text-gray-700 dark:text-dark-150 font-medium rtl:ml-4 ltr:mr-4">{{ currentPrompt ? currentPrompt.name : 'Configure AI Prompt' }}</h2>

      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitForm" class="mt-5">
        <div v-for="(variable, index) in variables" :key="index" class="mb-4">
          <label class="block text-sm font-medium mb-1" :for="`variable-${variable}`">
            {{ variable }}
          </label>
          <input :id="`variable-${variable}`" v-model="variableValues[variable]" class="input-text w-full" required />
        </div>

        <div class="flex justify-end mt-6">
          <button type="button" class="btn mr-2" @click="closePanel">{{ __('bard-multiprompt-ai::cp.cancel') }}</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">{{ __('bard-multiprompt-ai::cp.generating') }}</span>
            <span v-else>{{ __('bard-multiprompt-ai::cp.generate') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { pluginKey } from '../../plugin';
import AIService from '../../service';

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isVisible: false,
      currentPrompt: null,
      variableValues: {},
      isSubmitting: false,
      errorMessage: '',
      selectionFrom: null,
      selectionTo: null
    };
  },
  computed: {
    variables() {
      return this.currentPrompt?.variables || [];
    }
  },
  methods: {
    __,
    showPanel(prompt) {
      this.currentPrompt = prompt;
      this.variableValues = {};
      this.errorMessage = '';

      // Initialize default values if available
      if (prompt.variables) {
        prompt.variables.forEach(variable => {
          this.variableValues[variable] = ''
        });
      }

      // Store the current selection
      const selection = this.editor.view.state.selection;
      if (selection.empty) {
        this.selectionFrom = 0;
        this.selectionTo = this.editor.state.doc.content.size;
      } else {
        this.selectionFrom = selection.from;
        this.selectionTo = selection.to;
      }

      this.isVisible = true;

      // Update plugin state
      const tr = this.editor.state.tr.setMeta(pluginKey, { showPanel: true });
      this.editor.view.dispatch(tr);

      // Add ESC key listener
      document.addEventListener('keydown', this.handleEscKey);
    },

    closePanel() {
      if (this.isSubmitting) return;
      this.isVisible = false;

      // Update plugin state
      const tr = this.editor.state.tr.setMeta(pluginKey, { showPanel: false });
      this.editor.view.dispatch(tr);

      document.removeEventListener('keydown', this.handleEscKey);
    },

    handleEscKey(e) {
      if (e.key === 'Escape' && this.isVisible) {
        this.closePanel();
      }
    },

    async submitForm() {
      if (this.isSubmitting) return;

      this.isSubmitting = true;
      this.errorMessage = '';

      const hasEmptyVariable = Object.values(this.variableValues).some(value => !value);
      if (hasEmptyVariable) {
        this.errorMessage = 'All variables must be filled';
        return;
      }

      const result = await AIService.generate({
        editor: this.editor,
        prompt: this.currentPrompt,
        selectionFrom: this.selectionFrom,
        selectionTo: this.selectionTo,
        variables: this.variableValues
      });

      this.isSubmitting = false;

      if (result.success) {
        this.closePanel();
      } else {
        this.errorMessage = result.error || 'An error occurred';
      }
    }
  },
  beforeDestroy() {
    // Clean up event listener if component is destroyed while panel is open
    document.removeEventListener('keydown', this.handleEscKey);

    // Make sure the panel state is reset in the plugin
    if (this.isVisible) {
      const tr = this.editor.state.tr.setMeta(pluginKey, { showPanel: false });
      this.editor.view.dispatch(tr);
    }
  }
};
</script>

<style>
.bard-multiprompt-ai-wrapper {
  position: absolute;
  inset: 0;
  background: none;
  z-index: 10;
}

.ai-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
}

.bard-multiprompt-ai-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.5);
}
:is(.dark .bard-multiprompt-ai-overlay) {
  background-color: rgba(0, 0, 0, 0.5);
}

.bard-multiprompt-ai-overlay.generating {
  z-index: 12;
}

.bard-multiprompt-ai-overlay.generating::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  margin-left: -20px;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-top-color: #000;
  animation: spin 1s linear infinite;
}

:is(.dark .bard-multiprompt-ai-overlay.generating)::after {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>