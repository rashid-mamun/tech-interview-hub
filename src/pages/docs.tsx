import React from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function DocsRedirect(): JSX.Element {
  const destination = useBaseUrl('/docs/software%20engineering/');

  return <Redirect to={destination} />;
}
