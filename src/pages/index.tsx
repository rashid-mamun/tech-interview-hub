import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import { HeroSection } from '../components/HeroSection';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Head>
        <meta
          name="keywords"
          content="Tech Interview Hub, tech-interview-hub, Rashid Mamun, backend interview questions, system design interview, database interview questions, computer networking interview questions, Docker interview questions, Node.js interview questions, NestJS interview questions, Bangla programming notes"
        />
        <meta name="author" content="Rashid Mamun" />
        <meta name="google-site-verification" content="cAhJkw9HN0dfCLlevCXA591yh_UUW-nH7yzYZqZhVss" />
        <meta property="og:title" content="Tech Interview Hub - Developer Interview Documentation" />
        <meta property="og:description" content={siteConfig.tagline} />
        <meta property="og:url" content="https://rashid-mamun.github.io/tech-interview-hub" />
        <meta property="og:image" content="https://rashid-mamun.github.io/tech-interview-hub/img/social-card.svg" />
        <meta name="twitter:image" content="https://rashid-mamun.github.io/tech-interview-hub/img/social-card.svg" />
        <link rel="canonical" href="https://rashid-mamun.github.io/tech-interview-hub" />
      </Head>
      <HeroSection />
      <main></main>
    </Layout>
  );
}
