import { config } from '@hanzo/ui/tailwind'

export default {
  presets: [config],
  content: {
    files: [
      "**/*.tsx",
      './node_modules/@hanzo/ui/**/*.{ts,tsx}'
    ]
  },
} 
