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
        emoji: [{ name: 'Noto Color Emoji', weights: ['400'] }],
      },
    }),
  ],
  rules: [
    [
      /^field-auto-sizing-(\d+)_(\d+)$/,
      ([, d1, d2]) => ({
        'field-sizing': 'content',
        'min-height': `${d1}lh`,
        'max-height': `${d2}lh`,
      }),
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
