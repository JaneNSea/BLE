import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
  // 发布到项目型 GitHub Pages 仓库时，在这里增加：
  // site: 'https://<username>.github.io',
  // base: '/<repository-name>',
});
