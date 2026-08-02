import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [collection, slug] = process.argv.slice(2);
const allowed = new Set(['notes', 'projects', 'products']);

if (!allowed.has(collection) || !slug) {
  console.error('Usage: node scripts/new-content.mjs <notes|projects|products> <kebab-case-slug>');
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Slug must use lowercase ASCII kebab-case.');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const templates = {
  notes: `---
title: "待填写：技术问题"
summary: "用一句话说明问题、触发条件和解法。"
publishedAt: ${today}
tags: ["待分类"]
listingTags: ["开发方向", "编程语言"]
featured: false
priority: 0
draft: true
readingMinutes: 5
relatedProjects: []
---

## 问题

## 原因

## 解法

## 边界与取舍
`,
  projects: `---
title: "待填写：项目名称"
summary: "说明项目解决的问题和最终产出。"
publishedAt: ${today}
tags: ["待分类"]
featured: false
priority: 0
draft: true
type: "personal"
status: "building"
role: "独立完成"
year: ${new Date().getFullYear()}
period: "${new Date().getFullYear()} 年"
authors:
  - name: "JaneNSea"
    role: "独立作者"
    avatar: "/avatar.jpg"
repositories: []
---

## 背景与目标

## 实现与架构

## 难点与决策

## 结果与反思
`,
  products: `---
title: "待填写：产品名称"
summary: "说明产品为谁解决什么问题。"
tagline: "一句话产品定位"
publishedAt: ${today}
tags: ["待分类"]
featured: false
priority: 0
draft: true
status: "building"
visibility: "closed-source"
role: "创始人与核心开发者"
audience: ["investor", "interviewer", "judge"]
ctaLabel: "申请产品演示"
metrics: []
---

## 问题与用户

## 产品方案

## 技术架构

## 关键决策

## 验证结果

## 商业化方向
`,
};

const directory = resolve('src', 'content', collection);
const target = resolve(directory, `${slug}.md`);

if (existsSync(target)) {
  console.error(`Content already exists: ${target}`);
  process.exit(1);
}

await mkdir(directory, { recursive: true });
await writeFile(target, templates[collection], 'utf8');
console.log(`Created ${target}`);
