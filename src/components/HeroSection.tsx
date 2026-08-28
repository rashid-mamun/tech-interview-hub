import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const docSections = [
  { label: 'Computer Network', to: '/docs/computer%20network/' },
  { label: 'System Design', to: '/docs/system%20design/' },
  { label: 'Database', to: '/docs/database/' },
  { label: 'Docker', to: '/docs/docker/' },
  { label: 'Node.js', to: '/docs/nodeJs/' },
  { label: 'NestJS', to: '/docs/nestJs/' }
];

export const HeroSection = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <section className="home">
      <div className="hero-section">
        <div className="container">
          <div className="hero-section__box">
            <div className="hero-section__content">
              <h1 className="hero-section__title">{siteConfig.title}</h1>
              <p className="hero-section__subtitle">{siteConfig.tagline}</p>
              <p className="hero-section__description">
                Bangla-friendly documentation for practical interview preparation, organized by
                topic and optimized for long-form reading.
              </p>
              <div className="hero-section__actions">
                <Link
                  className="hero-section__button button button--primary button--lg"
                  to="/docs/software%20engineering/">
                  Start Reading
                </Link>
              </div>
            </div>
            <div className="hero-section__topics" aria-label="Documentation sections">
              {docSections.map(section => (
                <Link key={section.to} className="hero-section__topic" to={section.to}>
                  {section.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
