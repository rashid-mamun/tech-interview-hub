import React from 'react';
import Link from '@docusaurus/Link';

const subjects = [
  { label: 'Data Structures', description: 'Complexity, arrays, trees, graphs, sorting, and problem-solving patterns.', to: '/docs/data%20structures/' },
  { label: 'Object Oriented', description: 'OOP principles, SOLID, design patterns, Java, and C++ concepts.', to: '/docs/object%20oriented/' },
  { label: 'Computer Network', description: 'Internet, DNS, TCP/IP, HTTP, routing, and client-server communication.', to: '/docs/computer%20network/' },
  { label: 'Operating Systems', description: 'Processes, threads, memory, scheduling, storage, and concurrency.', to: '/docs/operating%20systems/' },
  { label: 'Database', description: 'SQL, indexing, transactions, normalization, NoSQL, and scalability.', to: '/docs/database/' },
  { label: 'Software Engineering', description: 'SDLC, Agile, requirements, architecture, testing, and project delivery.', to: '/docs/software%20engineering/' },
  { label: 'System Design', description: 'Scalable architecture, caching, messaging, reliability, and case studies.', to: '/docs/system%20design/' },
  { label: 'Node.js', description: 'Runtime internals, async programming, Express, security, and performance.', to: '/docs/nodeJs/' },
  { label: 'NestJS', description: 'Modules, dependency injection, APIs, validation, testing, and deployment.', to: '/docs/nestJs/' }
];

export const HeroSection = () => (
  <main className="home">
    <section className="hero-section" aria-labelledby="home-title">
      <div className="container">
        <div className="hero-section__intro">
          <p className="hero-section__eyebrow">Bangla-friendly interview documentation</p>
          <h1 id="home-title" className="hero-section__title">
            Technical interview notes built for deep understanding
          </h1>
          <p className="hero-section__subtitle">
            Study the core computer science, software engineering, backend, and system design
            concepts that technical interviews test—explained clearly with practical examples,
            code, and diagrams.
          </p>
          <div className="hero-section__actions">
            <Link className="hero-section__button button button--primary button--lg" to="/docs/data%20structures/">
              Start with Data Structures
            </Link>
            <a className="hero-section__text-link" href="#subjects">Explore all subjects</a>
          </div>
          <p className="hero-section__scope">9 focused subjects · Interview questions · Follow-up explanations</p>
        </div>

        <nav id="subjects" className="hero-section__subjects" aria-label="Interview subjects">
          <div className="hero-section__subjects-heading">
            <p>Choose a subject</p>
            <span>Follow the sequence or revise a specific topic.</span>
          </div>
          <div className="hero-section__topics">
            {subjects.map((subject, index) => (
              <Link key={subject.to} className="hero-section__topic" to={subject.to}>
                <span className="hero-section__topic-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="hero-section__topic-copy">
                  <strong>{subject.label}</strong>
                  <span>{subject.description}</span>
                </span>
                <span className="hero-section__topic-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </section>
  </main>
);
