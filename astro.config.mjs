// @ts-check
import astroExpressiveCode from 'astro-expressive-code'
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroExpressiveCode({
      themes: ['one-dark-pro'],
      styleOverrides: {
        codeFontSize: 'var(--plainframe-size-regular-700)',
        codeLineHeight: '1.8',
        codeFontFamily: 'var(--plainframe-typography-code-700)',
        codePaddingBlock: 'var(--plainframe-space-medium-900)',
        codePaddingInline: 'var(--plainframe-space-medium-1300)',
        borderRadius: 'var(--plainframe-radius-rectangle-300)',

        frames: {
          shadowColor: 'transparent'
        }
      }
    })
  ]
});
