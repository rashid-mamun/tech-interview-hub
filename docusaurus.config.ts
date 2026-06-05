import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const siteUrl = 'https://rashid-mamun.github.io';
const siteBaseUrl = '/tech-interview-hub/';
const publicUrl = `${siteUrl}${siteBaseUrl.slice(0, -1)}`;
const repoUrl = 'https://github.com/rashid-mamun/tech-interview-hub';
const siteDescription =
  'Structured interview notes for backend, database, networking, Docker, Node.js, and system design.';

const config: Config = {
  title: 'Tech Interview Hub',
  tagline: siteDescription,
  favicon: 'img/favicon.ico',
  url: siteUrl,
  baseUrl: siteBaseUrl,
  organizationName: 'rashid-mamun',
  projectName: 'tech-interview-hub',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  scripts: [{ src: '/js/docs-layout-toggle.js', defer: true }],
  plugins: ['docusaurus-plugin-sass', require.resolve('docusaurus-lunr-search')],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: `${repoUrl}/tree/desgin/`
        },
        sitemap: {
          priority: 0.8,
          filename: 'sitemap.xml'
        },
        theme: {
          customCss: './src/scss/app.scss'
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    navbar: {
      logo: {
        alt: 'Tech Interview Hub',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'right',
          label: 'Docs'
        }
      ]
    },
    footer: {
      style: 'dark',
      copyright: `Copyright (c) ${new Date().getFullYear()} Tech Interview Hub.`
    },
    metadata: [
      {
        name: 'keywords',
        content:
          'tech interview hub, tech-interview-hub, rashid mamun, backend interview questions, system design interview, node js interview questions, database interview questions, computer networking interview questions, docker interview questions, nestjs interview questions, bangla programming notes, developer interview preparation, tech-interview-hub github'
      },
      { name: 'author', content: 'Rashid Mamun' },
      { name: 'google-site-verification', content: 'cAhJkw9HN0dfCLlevCXA591yh_UUW-nH7yzYZqZhVss' },
      { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Tech Interview Hub' },
      {
        property: 'og:title',
        content: 'Tech Interview Hub - Backend, System Design, Database and Networking Interview Notes'
      },
      {
        property: 'og:description',
        content:
          'Bangla-friendly technical interview documentation for backend developers covering system design, networking, database, Docker, Node.js, and NestJS.'
      },
      { property: 'og:url', content: publicUrl },
      { property: 'og:image', content: `${publicUrl}/img/social-card.svg` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Tech Interview Hub - Developer Interview Documentation' },
      {
        name: 'twitter:description',
        content:
          'Structured backend, system design, database, networking, Docker, Node.js, and NestJS interview notes.'
      },
      { name: 'twitter:image', content: `${publicUrl}/img/social-card.svg` },
      { name: 'github:repository', content: repoUrl }
    ],
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      magicComments: [
        {
          className: 'code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' }
        },
        {
          className: 'code-block-error-line',
          line: 'error-next-line',
          block: { start: 'error-start', end: 'error-end' }
        }
      ]
    }
  } satisfies Preset.ThemeConfig,
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: publicUrl
      }
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json'
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Tech Interview Hub',
        alternateName: ['tech-interview-hub', 'Rashid Mamun Tech Interview Hub'],
        url: publicUrl,
        description:
          'Bangla-friendly technical interview documentation for backend developers covering system design, networking, database, Docker, Node.js, and NestJS.',
        inLanguage: ['en', 'bn'],
        author: {
          '@type': 'Person',
          name: 'Rashid Mamun',
          url: 'https://github.com/rashid-mamun'
        },
        sameAs: [repoUrl],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${publicUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      })
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json'
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'tech-interview-hub',
        codeRepository: repoUrl,
        programmingLanguage: ['TypeScript', 'React', 'Markdown', 'Docusaurus'],
        author: {
          '@type': 'Person',
          name: 'Rashid Mamun',
          url: 'https://github.com/rashid-mamun'
        },
        description:
          'Open-source technical interview documentation website for backend, system design, networking, database, Docker, Node.js, and NestJS preparation.'
      })
    }
  ]
};

export default config;
