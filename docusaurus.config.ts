import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkQuestionSections from './plugins/remark-question-sections';

const siteUrl = 'https://rashid-mamun.github.io';
const siteBaseUrl = '/tech-interview-hub/';
const publicUrl = `${siteUrl}${siteBaseUrl.slice(0, -1)}`;
const repoUrl = 'https://github.com/rashid-mamun/tech-interview-hub';
const siteDescription =
  'Bangla-friendly technical interview notes on data structures, OOP, networking, operating systems, databases, software engineering, system design, Node.js, and NestJS.';

const config: Config = {
  title: 'Tech Interview Hub',
  tagline: siteDescription,
  favicon: 'img/favicon.svg',
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
  markdown: {
    mermaid: true
  },
  plugins: ['docusaurus-plugin-sass', require.resolve('docusaurus-lunr-search')],
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: `${repoUrl}/tree/desgin/`,
          remarkPlugins: [remarkQuestionSections]
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
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' }
    },
    image: 'img/social-card.png',
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
          'tech interview hub, technical interview notes, data structures interview questions, object oriented programming interview, computer networking interview, operating systems interview, database interview questions, software engineering interview, system design interview, node js interview questions, nestjs interview questions, bangla programming notes'
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
          'Bangla-friendly technical interview notes covering data structures, OOP, computer networks, operating systems, databases, software engineering, system design, Node.js, and NestJS.'
      },
      { property: 'og:url', content: publicUrl },
      { property: 'og:image', content: `${publicUrl}/img/social-card.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Tech Interview Hub - Developer Interview Documentation' },
      {
        name: 'twitter:description',
        content:
          'Technical interview notes for data structures, OOP, networking, operating systems, databases, software engineering, system design, Node.js, and NestJS.'
      },
      { name: 'twitter:image', content: `${publicUrl}/img/social-card.png` },
      { name: 'github:repository', content: repoUrl }
    ],
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['java'],
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
          'Bangla-friendly technical interview notes covering data structures, OOP, computer networks, operating systems, databases, software engineering, system design, Node.js, and NestJS.',
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
          'Open-source technical interview documentation for data structures, OOP, networking, operating systems, databases, software engineering, system design, Node.js, and NestJS.'
      })
    }
  ]
};

export default config;
