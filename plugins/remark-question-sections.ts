type MdNode = {
  type: string;
  depth?: number;
  value?: string;
  name?: string;
  attributes?: Array<Record<string, unknown>>;
  children?: MdNode[];
};

const classAttribute = (value: string) => ({
  type: 'mdxJsxAttribute',
  name: 'className',
  value
});

const element = (name: string, className: string, children: MdNode[]): MdNode => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes: [classAttribute(className)],
  children
});

function textContent(node: MdNode): string {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(textContent).join('');
}

function isHeading(node: MdNode, depth: number): boolean {
  return node.type === 'heading' && node.depth === depth;
}

function isMainQuestion(node: MdNode): boolean {
  if (!isHeading(node, 2)) return false;
  const text = textContent(node).trim();
  return /^\d+\.\s/.test(text) || text.endsWith('?');
}

/**
 * Groups interview questions without changing their Markdown source:
 * H2 question -> main answer; H3 inside it -> sub-question and sub-answer.
 */
export default function remarkQuestionSections() {
  return (tree: MdNode) => {
    const source = tree.children ?? [];
    if (!source.some(isMainQuestion)) return;

    const result: MdNode[] = [];
    let index = 0;

    while (index < source.length) {
      const current = source[index];
      if (!isMainQuestion(current)) {
        result.push(current);
        index += 1;
        continue;
      }

      const mainHeading = current;
      const mainAnswer: MdNode[] = [];
      index += 1;

      while (index < source.length && !isHeading(source[index], 2)) {
        if (!isHeading(source[index], 3)) {
          mainAnswer.push(source[index]);
          index += 1;
          continue;
        }

        const subHeading = source[index];
        const subAnswer: MdNode[] = [];
        index += 1;

        while (
          index < source.length &&
          !isHeading(source[index], 2) &&
          !isHeading(source[index], 3)
        ) {
          subAnswer.push(source[index]);
          index += 1;
        }

        mainAnswer.push(
          element('section', 'question-section question-section--sub', [
            subHeading,
            element('div', 'question-section__answer question-section__answer--sub', subAnswer)
          ])
        );
      }

      result.push(
        element('section', 'question-section question-section--main', [
          mainHeading,
          element('div', 'question-section__answer question-section__answer--main', mainAnswer)
        ])
      );
    }

    tree.children = result;
  };
}
