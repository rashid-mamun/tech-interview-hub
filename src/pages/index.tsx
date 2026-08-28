import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import {HeroSection} from '../components/HeroSection';

const canonicalUrl = 'https://rashid-mamun.github.io/tech-interview-hub/';
const pageDescription =
  'Bangla-friendly technical interview notes on data structures, OOP, networking, operating systems, databases, software engineering, system design, Node.js, and NestJS.';

const subjects = [
  ['Data Structures', 'docs/data%20structures/'],
  ['Object Oriented Programming', 'docs/object%20oriented/'],
  ['Computer Network', 'docs/computer%20network/'],
  ['Operating Systems', 'docs/operating%20systems/'],
  ['Database', 'docs/database/'],
  ['Software Engineering', 'docs/software%20engineering/'],
  ['System Design', 'docs/system%20design/'],
  ['Node.js', 'docs/nodeJs/'],
  ['NestJS', 'docs/nestJs/']
];

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Tech Interview Hub',
  headline: 'Technical Interview Notes for Software Engineers',
  description: pageDescription,
  url: canonicalUrl,
  inLanguage: ['en', 'bn'],
  isPartOf: {
    '@type': 'WebSite',
    name: 'Tech Interview Hub',
    url: canonicalUrl
  },
  mainEntity: {
    '@type': 'ItemList',
    name: 'Technical interview subjects',
    numberOfItems: subjects.length,
    itemListElement: subjects.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      url: canonicalUrl + path
    }))
  }
};

export default function Home(): JSX.Element {
  return (
    <Layout title="Technical Interview Notes" description={pageDescription}>
      <Head>
        <meta
          name="keywords"
          content="technical interview notes, data structures interview questions, object oriented programming interview, computer networking interview, operating systems interview, database interview questions, software engineering interview, system design interview, Node.js interview questions, NestJS interview questions, Bangla programming notes"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tech Interview Hub" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="bn_BD" />
        <meta property="og:title" content="Technical Interview Notes | Tech Interview Hub" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={canonicalUrl + 'img/social-card.png'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Tech Interview Hub technical interview notes" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Technical Interview Notes | Tech Interview Hub" />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={canonicalUrl + 'img/social-card.png'} />
        <meta name="twitter:image:alt" content="Tech Interview Hub technical interview notes" />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </Head>
      <HeroSection />
    </Layout>
  );
}
