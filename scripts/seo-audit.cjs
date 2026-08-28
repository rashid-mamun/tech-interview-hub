const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');
const forbiddenTopics = ['aws', 'cloud', 'docker', 'linux'];

if (!fs.existsSync(buildDir)) {
  console.error('SEO audit failed: build directory not found. Run npm run build first.');
  process.exit(1);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function firstMatch(html, expression) {
  return html.match(expression)?.[1]?.trim() ?? '';
}

const htmlFiles = walk(buildDir).filter((file) => file.endsWith('.html'));
const pages = htmlFiles
  .map((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(buildDir, file).replaceAll('\\', '/');
    return {
      relativePath,
      html,
      title: firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      description: firstMatch(
        html,
        /<meta[^>]+name="description"[^>]+content="([^"]*)"/i
      ),
      canonicalCount: (html.match(/<link[^>]+rel="canonical"/gi) ?? []).length,
      h1Count: (html.match(/<h1(?:\s|>)/gi) ?? []).length
    };
  })
  .filter((page) => page.relativePath !== '404.html');

const errors = [];
const addPageErrors = (label, predicate) => {
  const matches = pages.filter(predicate).map((page) => page.relativePath);
  if (matches.length) errors.push(`${label}: ${matches.join(', ')}`);
};

addPageErrors('Missing title', (page) => !page.title);
addPageErrors('Missing description', (page) => !page.description);
addPageErrors('Canonical count must be exactly one', (page) => page.canonicalCount !== 1);
addPageErrors('Missing H1', (page) => page.h1Count === 0);
addPageErrors('Multiple H1 elements', (page) => page.h1Count > 1);

for (const field of ['title', 'description']) {
  const values = new Map();
  for (const page of pages) {
    const matches = values.get(page[field]) ?? [];
    matches.push(page.relativePath);
    values.set(page[field], matches);
  }
  for (const [value, matches] of values) {
    if (value && matches.length > 1) {
      errors.push(`Duplicate ${field} (${matches.length} pages): ${matches.join(', ')}`);
    }
  }
}

const sitemapPath = path.join(buildDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  errors.push('Missing sitemap.xml');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8').toLowerCase();
  for (const topic of forbiddenTopics) {
    if (sitemap.includes(`/docs/${topic}/`)) {
      errors.push(`Deleted topic remains in sitemap: ${topic}`);
    }
  }
}

for (const topic of forbiddenTopics) {
  if (fs.existsSync(path.join(buildDir, 'docs', topic))) {
    errors.push(`Deleted topic remains in build output: ${topic}`);
  }
}

const homepage = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
if (!homepage.includes('"@type":"CollectionPage"')) {
  errors.push('Homepage CollectionPage structured data is missing');
}
if (!homepage.includes('"numberOfItems":9')) {
  errors.push('Homepage structured data must contain exactly nine subjects');
}

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${pages.length} indexable HTML pages checked.`);
console.log('Verified unique titles/descriptions, one canonical and one H1 per page.');
console.log('Verified sitemap, nine-subject structured data, and removed-topic cleanup.');
