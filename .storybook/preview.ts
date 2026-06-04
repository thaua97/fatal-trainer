import type { Preview } from '@storybook/vue3'
import '../app/assets/css/main.css'

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
  decorators: [
    (story, context) => {
      const title = context.title ?? ''
      const isComposite = title.startsWith('Composite/')
      return {
        template: isComposite
          ? '<div class="min-h-screen bg-white"><story /></div>'
          : `
          <div class="min-h-screen bg-white p-6">
            <div class="max-w-lg mx-auto">
              <story />
            </div>
          </div>
        `,
      }
    },
  ],
}

export default preview
