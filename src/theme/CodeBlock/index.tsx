import React, {type ComponentProps, useEffect, useRef} from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';

import styles from './styles.module.css';

type Props = ComponentProps<typeof OriginalCodeBlock>;

const LANGUAGE_NAMES: Record<string, string> = {
  cpp: 'C++',
  c: 'C',
  cs: 'C#',
  java: 'Java',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  json: 'JSON',
  bash: 'Bash',
  shell: 'Shell',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
};

const AUTO_CLOSE_DELAY_MS = 50_000;

function getLanguage(className?: string): string | undefined {
  const language = className?.match(/(?:^|\s)language-([^\s]+)/)?.[1];
  if (!language) return undefined;
  return LANGUAGE_NAMES[language.toLowerCase()] ?? language.toUpperCase();
}

function getLineCount(children: Props['children']): number | undefined {
  if (typeof children !== 'string') return undefined;

  const content = children.replace(/\n+$/, '');
  return content ? content.split('\n').length : 0;
}

export default function CodeBlock(props: Props): JSX.Element {
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const language = getLanguage(props.className);
  const isPlainText = language === 'TEXT';
  const title = isPlainText ? 'Preview' : 'Code Example';
  const lineCount = getLineCount(props.children);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => clearCloseTimer, []);

  const handleToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    clearCloseTimer();

    const details = event.currentTarget;
    if (details.open) {
      closeTimerRef.current = setTimeout(() => {
        if (details.isConnected) {
          details.open = false;
        }
        closeTimerRef.current = null;
      }, AUTO_CLOSE_DELAY_MS);
    }
  };

  if (lineCount !== undefined && lineCount <= 5) {
    return <OriginalCodeBlock {...props} />;
  }

  return (
    <details className={styles.codeDetails} onToggle={handleToggle}>
      <summary className={styles.codeSummary}>
        <span className={styles.leading} aria-hidden="true">
          {isPlainText ? 'Aa' : '</>'}
        </span>
        <span className={styles.summaryText}>
          <span className={styles.titleRow}>
            <span className={styles.title}>{title}</span>
            {language && !isPlainText && (
              <span className={styles.language}>{language}</span>
            )}
          </span>
          <span className={styles.hint}>Click to view details</span>
        </span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      <div className={styles.codeContent}>
        <OriginalCodeBlock {...props} />
      </div>
    </details>
  );
}
