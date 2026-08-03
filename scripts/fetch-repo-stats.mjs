import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const sitePath = new URL('../src/data/site.ts', import.meta.url);
const outputPath = new URL('../public/data/repository.json', import.meta.url);

function readStringField(source, field) {
  const match = source.match(new RegExp(`${field}:\\s*['"]([^'"]+)['"]`));
  return match?.[1];
}

async function readRepositoryConfig() {
  const source = await readFile(sitePath, 'utf8');
  const repository = source.match(/repository:\s*{([\s\S]*?)\n\s*},/);
  if (!repository) throw new Error('Could not find site.repository in src/data/site.ts');

  const body = repository[1];
  const slug = readStringField(body, 'slug');
  const url = readStringField(body, 'url');
  const api = readStringField(body, 'api');
  if (!slug || !url || !api) throw new Error('site.repository must define slug, url, and api');

  return { slug, url, api };
}

async function readExistingStats() {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return null;
  }
}

async function writeStats(stats) {
  await mkdir(dirname(fileURLToPath(outputPath)), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');
}

async function fetchStats(repository) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'JaneNSea-BLE-site-build',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(repository.api, { headers });
  if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);

  const payload = await response.json();
  const stargazersCount = Number(payload.stargazers_count);
  if (!Number.isFinite(stargazersCount)) {
    throw new Error('GitHub API returned an invalid stargazers_count');
  }

  return {
    stargazersCount,
    updatedAt: new Date().toISOString(),
    source: 'github-rest',
  };
}

const repository = await readRepositoryConfig();

try {
  const stats = await fetchStats(repository);
  await writeStats(stats);
  console.log(`Repository stats refreshed for ${repository.slug}: ${stats.stargazersCount} stars.`);
} catch (error) {
  const existing = await readExistingStats();
  if (existing) {
    console.warn(`Repository stats refresh failed; keeping existing data. ${error.message}`);
  } else {
    await writeStats({
      stargazersCount: null,
      updatedAt: null,
      source: 'unavailable',
    });
    console.warn(`Repository stats refresh failed; wrote empty fallback. ${error.message}`);
  }
}
