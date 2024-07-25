// uno.config.ts
import presetWind from '@unocss/preset-wind'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetWind()],
  theme: {
    fontSize: {
      base: '0.9rem',
      sm: '0.8rem',
    },
  },
})
