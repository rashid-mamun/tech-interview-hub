import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BracketLeft from '../assets/icons/bracket-left.svg';
import BracketRight from '../assets/icons/bracket-right.svg';

export const HeroSection = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <section className="home">
      <div style={{ backgroundImage: 'url("./img/bg.svg")' }} className="hero-section">
        <div className="container">
          <div className="hero-section__box">
            <BracketLeft className="hero-section__brackets hero-section__brackets--left" />
            <div className="hero-section__content">
              <h1 className="hero-section__title">{siteConfig.title}</h1>
              <p className="hero-section__subtitle">{siteConfig.tagline}</p>
              <div className="hero-section__divider" />
              <p className="hero-section__description">
                ShareTrip is the country’s first and leading Online Travel Aggregator (OTA). Since
                our inception, we have dreamt of making travel easier for people of all ages and we
                move forward to make that dream into reality.
              </p>
              <Link className="hero-section__button button button--primary button--lg" to="/docs">
                Read the Docs
              </Link>
            </div>
            <BracketRight className="hero-section__brackets hero-section__brackets--right" />
          </div>
        </div>
      </div>
    </section>
  );
};

