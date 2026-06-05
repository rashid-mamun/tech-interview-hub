import React, {useEffect, useState} from 'react';
import {useLocation} from '@docusaurus/router';

type RootProps = {
  children: React.ReactNode;
};

export default function Root({ children }: RootProps): JSX.Element {
  return (
    <>
      {children}
      <DocsLayoutToggles />
    </>
  );
}

function DocsLayoutToggles(): JSX.Element | null {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [leftHidden, setLeftHidden] = useState(false);
  const [rightHidden, setRightHidden] = useState(false);
  const isDocsPage = location.pathname.includes('/docs');

  useEffect(() => {
    setMounted(true);

    try {
      setLeftHidden(localStorage.getItem('docs-left-hidden') === 'true');
      setRightHidden(localStorage.getItem('docs-right-hidden') === 'true');
    } catch {
      setLeftHidden(false);
      setRightHidden(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.body.classList.toggle('docs-left-hidden', isDocsPage && leftHidden);
    document.body.classList.toggle('docs-right-hidden', isDocsPage && rightHidden);

    if (isDocsPage) {
      try {
        localStorage.setItem('docs-left-hidden', String(leftHidden));
        localStorage.setItem('docs-right-hidden', String(rightHidden));
      } catch {
        // Ignore storage failures in private browsing or locked-down browsers.
      }
    }

    return () => {
      document.body.classList.remove('docs-left-hidden', 'docs-right-hidden');
    };
  }, [isDocsPage, leftHidden, mounted, rightHidden]);

  if (!mounted || !isDocsPage) {
    return null;
  }

  return (
    <div className="docs-layout-toggles" aria-label="Docs layout controls">
      <button
        type="button"
        className="docs-layout-toggle-btn"
        aria-label={leftHidden ? 'Show left sidebar' : 'Hide left sidebar'}
        aria-pressed={leftHidden}
        title={leftHidden ? 'Show left sidebar' : 'Hide left sidebar'}
        onClick={() => setLeftHidden((value) => !value)}>
        <SidebarIcon />
      </button>
      <button
        type="button"
        className="docs-layout-toggle-btn"
        aria-label={rightHidden ? 'Show right table of contents' : 'Hide right table of contents'}
        aria-pressed={rightHidden}
        title={rightHidden ? 'Show right table of contents' : 'Hide right table of contents'}
        onClick={() => setRightHidden((value) => !value)}>
        <TocIcon />
      </button>
    </div>
  );
}

function SidebarIcon(): JSX.Element {
  return (
    <svg className="docs-layout-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16M4 12h10M4 19h16" />
    </svg>
  );
}

function TocIcon(): JSX.Element {
  return (
    <svg className="docs-layout-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}
