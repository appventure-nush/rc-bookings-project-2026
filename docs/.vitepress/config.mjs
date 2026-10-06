import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'RCBooking',
  description: 'Developer docs for the Research Congress booking system',
  base: '/rc-bookings-project-2026/',
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/quickstart' },
      { text: 'API reference', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        { text: 'Get started', items: [
          { text: 'Quickstart', link: '/guide/quickstart' },
        ]},
      ],
      '/api/': [
        { text: 'API reference', items: [
          { text: 'Overview and errors', link: '/api/' },
          { text: 'Bookings', link: '/api/bookings' },
        ]},
      ],
    },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/appventure-nush/rc-bookings-project-2026' }],
  },
})