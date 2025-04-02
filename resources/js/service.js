import { pluginKey } from './plugin';
const { DOMParser, DOMSerializer } = Statamic.$bard.tiptap.pm.model;

export default {
  async generate({ editor, prompt, selectionFrom, selectionTo, variables = {} }) {
    // Show loading overlay
    editor.setEditable(false);
    const showLoadingTr = editor.state.tr.setMeta(pluginKey, { isLoading: true });
    editor.view.dispatch(showLoadingTr);

    let result = { success: false, error: null };

    try {
      // Get the selected text in HTML
      const selectedText = editor.state.doc.cut(selectionFrom, selectionTo);
      const html = this.fragmentToHTML(selectedText.content, editor.schema);

      // Send request to generate content
      const request = await fetch('/!/bard-multiprompt-ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': StatamicConfig.csrfToken
        },
        body: JSON.stringify({
          prompt_id: prompt.id,
          html,
          variables: variables
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

      // Apply the generated content to the editor
      if (data.generation_mode === 'replace') {
        const fragment = this.htmlToFragment(data.html, editor.schema);
        const replaceTr = editor.state.tr.replaceRange(selectionFrom, selectionTo, fragment);
        editor.view.dispatch(replaceTr);
      } else if (data.generation_mode === 'continue') {
        const fragment = this.htmlToFragment(data.html, editor.schema);
        const insertTr = editor.state.tr.replaceRange(selectionTo, selectionTo, fragment);
        editor.view.dispatch(insertTr);
      }

      result = { success: true };
    } catch (error) {
      Statamic.$toast.error(error.message);
      result = { success: false, error: error.message };
    } finally {
      // Hide loading overlay
      const hideLoadingTr = editor.state.tr.setMeta(pluginKey, { isLoading: false });
      editor.view.dispatch(hideLoadingTr);
      editor.setEditable(true);
    }

    return result;
  },

  /**
   * Convert a ProseMirror fragment to HTML
   */
  fragmentToHTML(fragment, schema) {
    const serializer = DOMSerializer.fromSchema(schema);
    const domFragment = serializer.serializeFragment(fragment);
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(domFragment);
    return tempDiv.innerHTML;
  },

  /**
   * Convert HTML to a ProseMirror fragment
   */
  htmlToFragment(html, schema) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const parser = DOMParser.fromSchema(schema);
    return parser.parseSlice(tempDiv);
  }
};