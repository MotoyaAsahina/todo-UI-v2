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
  rules: [
    [
      /^field-auto-sizing-(\d+)$/,
      ([, d]) => ({ 'field-sizing': 'content', 'min-height': `${d}lh` }),
    ],
  ],
  theme: {
    fontSize: {
      base: '0.9rem',
      md: '0.85rem',
      sm: '0.8rem',
    },
  },
})
