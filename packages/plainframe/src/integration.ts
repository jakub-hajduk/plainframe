// @ts-check
import { type AstroIntegration } from 'astro'
import astroExpressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url'
import { addIntegration, defineIntegration } from 'astro-integration-kit'

interface PlainframeOptions {

}

export default defineIntegration({
  name: "plainframe-theme",
  setup() {
    return {
      hooks: {
        "astro:config:setup": (params) => {
          addIntegration(params, {
            integration: astroExpressiveCode({
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
          })
          addIntegration(params, {
            integration: mdx()
          })

          params.config.vite.resolve.alias['@storybook/blocks'] = 'plainframe/storybook-blocks',
          params.config.vite.resolve.alias['@storybook/addon-docs/blocks'] = 'plainframe/storybook-blocks'
        }
      }
    }
  }
})
