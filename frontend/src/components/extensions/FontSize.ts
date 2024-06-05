import { Mark, mergeAttributes } from '@tiptap/core'
import type { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
    }
  }
}

export const FontSize = Mark.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.fontSize.replace('px', ''),
        renderHTML: (attributes: { size: string }) => {
          if (!attributes.size) {
            return {}
          }
          return { style: `font-size: ${attributes.size}px` }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        style: 'font-size',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: CommandProps) => {
          return chain().setMark(this.name, { size }).run()
        },
    }
  },
})
