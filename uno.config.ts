// uno.config.ts
import presetWind from '@unocss/preset-wind'
import { defineConfig, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: [{ name: 'Noto Sans JP', weights: ['300', '400', '500'] }],
      },
    }),
  ],
  theme: {
    fontSize: {
      base: '0.9rem',
      sm: '0.8rem',
    },
  },
})
