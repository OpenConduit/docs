import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenConduit',
  description: 'Developer documentation for OpenConduit — architecture, API reference, and extension platform guide.',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'OpenConduit Docs',

    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'API Reference', link: '/api/stores', activeMatch: '/api/' },
      { text: 'Extensions', link: '/extensions/', activeMatch: '/extensions/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Overview', link: '/guide/' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Contributing', link: '/guide/contributing' },
            { text: 'Debug Console', link: '/guide/debug-console' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Stores', link: '/api/stores' },
            { text: 'Hooks', link: '/api/hooks' },
            { text: 'Components', link: '/api/components' },
            { text: 'Types', link: '/api/types' },
            { text: 'IPC Channels', link: '/api/ipc-channels' },
            { text: 'Keyboard Shortcuts', link: '/api/keyboard-shortcuts' },
          ],
        },
      ],
      '/extensions/': [
        {
          text: 'Extension Platform',
          items: [
            { text: 'Overview', link: '/extensions/' },
            { text: 'Extension Manifest', link: '/extensions/manifest' },
            { text: 'Activity Bar Contributions', link: '/extensions/activity-bar' },
            { text: 'Command Contributions', link: '/extensions/commands' },
            { text: 'Settings Contributions', link: '/extensions/settings' },
            { text: 'Bottom Panel Contributions', link: '/extensions/bottom-panel' },
            { text: 'Extension API', link: '/extensions/api' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/OpenConduit/Client' },
    ],

    footer: {
      message: 'Released under the AGPLv3 License.',
      copyright: 'Copyright © 2026 OpenConduit',
    },

    search: {
      provider: 'local',
    },
  },
})
