import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function DocsRedirect(): JSX.Element {
  const destination = useBaseUrl('/docs/software%20engineering/');

  return (
    <>
      <Head>
        <title>Technical Interview Documentation | Tech Interview Hub</title>
        <meta
          name="description"
          content="Browse technical interview notes for data structures, OOP, networking, operating systems, databases, software engineering, system design, Node.js, and NestJS."
        />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <main className="container margin-vert--lg">
        <h1>Technical Interview Documentation</h1>
        <p>
          Continue to the <Link to={destination}>software engineering interview guide</Link>.
        </p>
      </main>
      <Redirect to={destination} />
    </>
  );
}
